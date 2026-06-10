import { SignJWT, jwtVerify } from "jose";
import type { NextRequest, NextResponse } from "next/server";

const ATTEMPT_COOKIE = "login_attempts";
const MAX_ATTEMPTS = 5;
const WINDOW_SECS = 15 * 60; // 15 minutes

function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET env var is not set");
  return new TextEncoder().encode(s);
}

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
  const token = await new SignJWT(attempts as unknown as Record<string, unknown>)
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

export async function checkRateLimit(
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
