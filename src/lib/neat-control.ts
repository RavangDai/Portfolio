/**
 * Tiny control channel for the site's background WebGL gradient.
 *
 * The site runs ONE @firecms/neat WebGL context permanently (site-background.tsx). The
 * full-screen footer curtain runs a SECOND WebGL context (the three.js halftone field).
 * Two animating contexts on screen at once is a real GPU/battery cost on phones, so the
 * footer parks the gradient while its own scene is visible and restores it on the way out.
 *
 * "Park" means speed 0, not destroy: the gradient keeps its last rendered frame on screen
 * (so nothing visibly changes behind the translucent sections) but stops stepping its
 * simulation, which is where the cost actually is.
 *
 * Deliberately not React context — SiteBackground sits above <MotionConfig> in the layout
 * tree while the footer sits inside it, and a provider spanning both would re-render the
 * entire page on every park/unpark.
 */

interface Parkable {
  speed: number;
}

let instance: Parkable | null = null;
let liveSpeed = 3; // restored on unpark; overwritten when the gradient registers
let parked = false;

/** Called by SiteBackground once the gradient exists. Pass null on teardown. */
export function registerNeat(gradient: Parkable | null): void {
  instance = gradient;
  if (gradient) liveSpeed = gradient.speed;
  parked = false;
}

/**
 * Park/unpark the background gradient. Safe to call when no gradient is registered
 * (WebGL unavailable, reduced motion, non-brut route) — it just no-ops.
 */
export function setNeatParked(next: boolean): void {
  if (!instance || parked === next) return;
  if (next) {
    liveSpeed = instance.speed;
    instance.speed = 0;
  } else {
    instance.speed = liveSpeed;
  }
  parked = next;
}
