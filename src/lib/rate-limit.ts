import { SignJWT, jwtVerify } from "jose";
import type { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ATTEMPT_COOKIE = "login_attempts";
const MAX_ATTEMPTS = 5;
const WINDOW_SECS = 15 * 60; // 15 minutes

function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET env var is not set");
  return new TextEncoder().encode(s);
}

// --- Durable limiter (Upstash) -------------------------------------------------
// The real brute-force defense: server-side, keyed by client IP, so it cannot be
// bypassed by simply discarding cookies between requests. Active only when the
// Upstash env vars are present (i.e. production); otherwise we fall back to the
// best-effort cookie scheme below so local dev still throttles.

let ratelimit: Ratelimit | null | undefined;

function getRatelimit(): Ratelimit | null {
  if (ratelimit !== undefined) return ratelimit;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    ratelimit = null;
    return null;
  }
  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(MAX_ATTEMPTS, `${WINDOW_SECS} s`),
    prefix: "ratelimit:admin-login",
    analytics: false,
  });
  return ratelimit;
}

function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "anon"; // last resort — shared bucket (Next 16 dropped request.ip)
}

/**
 * Decide whether a login attempt is allowed.
 *
 * Durable path (Upstash configured): `.limit()` both checks and counts this attempt
 * against the IP's window — the caller does no cookie bookkeeping.
 *
 * Fallback path (no Upstash): read-only check of the signed attempt cookie; the caller
 * must call `recordFailedAttempt` / `clearAttempts` to update it.
 */
export async function loginRateLimit(
  request: NextRequest
): Promise<{ allowed: boolean; remaining: number; durable: boolean }> {
  const rl = getRatelimit();
  if (rl) {
    const { success, remaining } = await rl.limit(clientIp(request));
    return { allowed: success, remaining, durable: true };
  }
  const { allowed, remaining } = await checkRateLimitCookie(request);
  return { allowed, remaining, durable: false };
}

// --- Public endpoint limiter ---------------------------------------------------
// Generic per-IP throttle for unauthenticated, cost-bearing public routes
// (/api/chat -> Gemini spend, /api/contact -> SMTP send). Reuses the same Upstash
// setup as the login limiter. The login flow's signed-cookie fallback is useless
// here — an anonymous abuser just discards cookies between requests — so when
// Upstash is absent (local dev) we fall back to a best-effort in-memory sliding
// window. In-memory is per-instance only (serverless spins up many), so it is a
// dev convenience, not a production guarantee; production must set the Upstash vars.

const publicLimiters = new Map<string, Ratelimit>();

function getPublicLimiter(name: string, limit: number, windowSecs: number): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const key = `${name}:${limit}:${windowSecs}`;
  let rl = publicLimiters.get(key);
  if (!rl) {
    rl = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(limit, `${windowSecs} s`),
      prefix: `ratelimit:${name}`,
      analytics: false,
    });
    publicLimiters.set(key, rl);
  }
  return rl;
}

const memBuckets = new Map<string, number[]>();

function memRateLimit(bucket: string, limit: number, windowSecs: number): boolean {
  const now = Date.now();
  const windowMs = windowSecs * 1000;
  const hits = (memBuckets.get(bucket) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    memBuckets.set(bucket, hits);
    return false;
  }
  hits.push(now);
  memBuckets.set(bucket, hits);
  return true;
}

/**
 * Allow at most `limit` requests per `windowSecs` per client IP for the named
 * bucket. Returns true when the request is within budget, false when throttled.
 */
export async function publicRateLimit(
  request: Request,
  name: string,
  limit: number,
  windowSecs: number
): Promise<boolean> {
  const ip = clientIp(request);
  const rl = getPublicLimiter(name, limit, windowSecs);
  if (rl) {
    const { success } = await rl.limit(ip);
    return success;
  }
  return memRateLimit(`${name}:${ip}`, limit, windowSecs);
}

// --- Cookie fallback -----------------------------------------------------------

interface Attempts {
  count: number;
  since: number;
}

async function readAttempts(request: NextRequest): Promise<Attempts> {
  const value = request.cookies.get(ATTEMPT_COOKIE)?.value;
  if (!value) return { count: 0, since: Date.now() };
  try {
    const { payload } = await jwtVerify(value, getSecret());
    return {
      count: (payload.count as number) ?? 0,
      since: (payload.since as number) ?? Date.now(),
    };
  } catch {
    return { count: 0, since: Date.now() };
  }
}

async function writeCookie(response: NextResponse, attempts: Attempts): Promise<void> {
  // Tag the payload so this token can never be mistaken for an admin session
  // (the middleware requires role === "admin").
  const token = await new SignJWT({ ...attempts, role: "login_attempts" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${WINDOW_SECS}s`)
    .sign(getSecret());
  response.cookies.set(ATTEMPT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: WINDOW_SECS,
  });
}

async function checkRateLimitCookie(
  request: NextRequest
): Promise<{ allowed: boolean; remaining: number }> {
  const { count, since } = await readAttempts(request);
  const elapsed = Date.now() - since;
  if (elapsed > WINDOW_SECS * 1000) return { allowed: true, remaining: MAX_ATTEMPTS };
  const remaining = MAX_ATTEMPTS - count;
  return { allowed: remaining > 0, remaining: Math.max(0, remaining) };
}

export async function recordFailedAttempt(
  request: NextRequest,
  response: NextResponse
): Promise<void> {
  const prev = await readAttempts(request);
  const now = Date.now();
  const windowExpired = now - prev.since > WINDOW_SECS * 1000;
  await writeCookie(response, {
    count: windowExpired ? 1 : prev.count + 1,
    since: windowExpired ? now : prev.since,
  });
}

export async function clearAttempts(response: NextResponse): Promise<void> {
  response.cookies.set(ATTEMPT_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
