import type { NextRequest } from "next/server";

// Shared same-origin guard for state-changing API routes (login, content, upload).
// CSRF is primarily blocked by the `sameSite: "strict"` session cookie; this is a
// second layer. A modern browser always sends `Origin` (or at least `Referer`) on a
// same-origin POST/PUT, so we can require one of them to match the host and reject the
// request when both are absent — rather than treating "no Origin" as trusted.
export function isSameOrigin(request: NextRequest): boolean {
  const host = request.headers.get("host");
  if (!host) return false;

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  // No Origin header — fall back to Referer before deciding.
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  // Neither Origin nor Referer on a state-changing request: do not trust it.
  return false;
}
