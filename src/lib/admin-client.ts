// Shared client-side helper for the admin editors.

// Minimal structural type so this module doesn't depend on next/navigation's
// router type — any object with a `push(href)` works (the App Router instance does).
type Pushable = { push: (href: string) => void };

/**
 * Handle an expired/cleared admin session on a write or upload fetch.
 *
 * When the JWT behind `admin_session` has expired (hard 24h, no renewal) the next
 * request is rejected by the middleware with 401. Without this, the editor would just
 * flash a generic "Save failed." and silently strand the user's typed-in changes.
 *
 * On a 401 this flashes a clear message and redirects to the login page, threading the
 * current path through `?next` so they return here after re-authenticating. The caller's
 * form state is intentionally left untouched so nothing is lost on the round trip.
 *
 * @returns true when a 401 was handled (caller should stop processing the response).
 */
export function handleUnauthorized(
  res: Response,
  router: Pushable,
  pathname: string,
  flash: (text: string, ok: boolean) => void
): boolean {
  if (res.status !== 401) return false;
  flash("Session expired — please sign in again.", false);
  router.push(`/admin/login?next=${encodeURIComponent(pathname)}`);
  return true;
}
