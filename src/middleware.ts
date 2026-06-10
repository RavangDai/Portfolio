import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

// Inline the secret resolution so the middleware bundle stays minimal.
// jose uses Web Crypto APIs and runs fine on Vercel Edge Runtime.
function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) return new TextEncoder().encode("__missing_secret__");
  return new TextEncoder().encode(s);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login page is always accessible
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  let valid = false;

  if (token) {
    try {
      await jwtVerify(token, getSecret());
      valid = true;
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
