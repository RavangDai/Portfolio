"use client";

import { usePathname } from "next/navigation";

/**
 * Routes that render the light "neon brutalism" theme. Everything else
 * (the home/hero) stays on the dark cosmos theme.
 *
 * This list is the single source of truth — the global chrome (navbar, footer,
 * chatbot, scroll bar, background) and the page wrappers all read it through
 * `useIsBrut()` so the look stays in sync across the app.
 */
export const BRUT_ROUTES = [
  "/",
  "/projects",
  "/certificates",
  "/achievements",
  "/contact",
] as const;

export function isBrutPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return BRUT_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/** Client hook: true when the current route uses the light brutalist theme. */
export function useIsBrut(): boolean {
  return isBrutPath(usePathname());
}
