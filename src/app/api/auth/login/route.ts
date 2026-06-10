import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signToken, COOKIE_NAME, cookieOptions } from "@/lib/auth";
import { checkRateLimit, recordFailedAttempt, clearAttempts } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
});

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // same-origin requests without preflight may omit Origin
  const host = request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { allowed, remaining } = await checkRateLimit(request);
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
    const failResponse = NextResponse.json(
      { error: "Invalid email or password", remaining: remaining - 1 },
      { status: 401 }
    );
    await recordFailedAttempt(request, failResponse);
    return failResponse;
  }

  const token = await signToken({ role: "admin" });
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, token, cookieOptions);
  await clearAttempts(response);
  return response;
}
