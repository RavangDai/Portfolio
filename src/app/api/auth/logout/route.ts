import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";
import { isSameOrigin } from "@/lib/http";

export async function POST(request: NextRequest) {
  // Same-origin only — blocks CSRF forced-logout (e.g. a cross-site auto-POST).
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
