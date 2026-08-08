/**
 * Is the full-screen footer curtain open?
 *
 * The footer publishes this; the navbar subscribes and animates itself out of the way so the
 * signature owns the screen. Kept as a module-level store rather than React context because
 * MainNavbar sits ABOVE <MotionConfig> in layout.tsx while the footer sits inside it — a
 * provider spanning both would re-render the entire page on every open/close.
 *
 * Read with useSyncExternalStore. Same shape as lib/neat-control.ts.
 */

let open = false;
const listeners = new Set<() => void>();

export function setCurtainOpen(next: boolean): void {
  if (open === next) return;
  open = next;
  for (const notify of listeners) notify();
}

export function subscribeCurtain(callback: () => void): () => void {
  listeners.add(callback);
  return () => void listeners.delete(callback);
}

export const getCurtainOpen = (): boolean => open;

/** SSR snapshot — the navbar always renders visible on the server. */
export const getCurtainOpenServer = (): boolean => false;
