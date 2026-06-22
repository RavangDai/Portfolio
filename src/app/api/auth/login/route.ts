import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signToken, COOKIE_NAME, cookieOptions } from "@/lib/auth";
import { loginRateLimit, recordFailedAttempt, clearAttempts } from "@/lib/rate-limit";
import { isSameOrigin } from "@/lib/http";

const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
});

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { allowed, remaining, durable } = await loginRateLimit(request);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many failed attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminHash) {
    console.error("ADMIN_EMAIL or ADMIN_PASSWORD_HASH env vars not set");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const emailMatch = email.toLowerCase() === adminEmail.toLowerCase();
  // Always run bcrypt.compare to prevent timing attacks, even on email mismatch
  const passwordMatch = await bcrypt.compare(password, adminHash);

  if (!emailMatch || !passwordMatch) {
    // Durable limiter already counted this attempt; only the cookie fallback needs
    // to record it (and surface a decremented count to the UI).
    const failResponse = NextResponse.json(
      { error: "Invalid email or password", remaining: Math.max(0, remaining - (durable ? 0 : 1)) },
      { status: 401 }
    );
    if (!durable) await recordFailedAttempt(request, failResponse);
    return failResponse;
  }

  const token = await signToken({ role: "admin" });
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, token, cookieOptions);
  if (!durable) await clearAttempts(response);
  return response;
}
