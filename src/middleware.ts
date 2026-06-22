import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

// Inline the secret resolution so the middleware bundle stays minimal.
// jose uses Web Crypto APIs and runs fine on Vercel Edge Runtime.
// Returns null when JWT_SECRET is unset so the guard fails *closed* — never verify
// against a hardcoded default (that would let a forged token in if the env var is
// missing in a deploy).
function getSecret(): Uint8Array | null {
  const s = process.env.JWT_SECRET;
  if (!s) return null;
  return new TextEncoder().encode(s);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login page is always accessible
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secret = getSecret();
  let valid = false;

  if (token && secret) {
    try {
      const { payload } = await jwtVerify(token, secret);
      // Require the admin role claim. Other tokens signed with the same secret
      // (e.g. the login_attempts cookie) must not be accepted as a session.
      valid = payload.role === "admin";
    } catch {
      valid = false;
    }
  }

  if (!valid) {
    // API routes return 401 JSON; page routes redirect to login
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
