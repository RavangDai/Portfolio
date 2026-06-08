"use client";

import { useIsBrut } from "@/lib/theme";

/**
 * Site-wide animated background.
 *
 * - Dark routes (home/hero): a pure-CSS "living aurora" — a few large, slow,
 *   blurred radial orbs drifting on a near-black base. GPU-composited transforms
 *   only, so it costs almost nothing, and it gives the (hero) glass surfaces
 *   bright gradients to refract.
 * - Brutalist routes (/projects /certificates /achievements /contact): a flat
 *   paper surface with a faint ink grid + grain, matching the light theme.
 *
 * `pointer-events-none` keeps it from swallowing clicks/scroll on either theme.
 */
export function SiteBackground() {
  const isBrut = useIsBrut();

  if (isBrut) {
    return (
      <div
        aria-hidden
        className="brut-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        {/* faint grain to break the flatness */}
        <div className="grain-layer opacity-[0.4]" />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#080808]"
    >
      {/* ── Drifting aurora orbs ── */}
      {/* top-left — brightest catch */}
      <div
        className="absolute -left-[10%] -top-[15%] h-[60vmax] w-[60vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 35%, transparent 68%)",
          filter: "blur(60px)",
          animation: "sgb-orb-a 26s ease-in-out infinite alternate",
          willChange: "transform",
        }}
      />
      {/* bottom-right — faint cool silver */}
      <div
        className="absolute -bottom-[20%] -right-[12%] h-[55vmax] w-[55vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(206,214,230,0.13) 0%, rgba(206,214,230,0.04) 38%, transparent 70%)",
          filter: "blur(70px)",
          animation: "sgb-orb-b 32s ease-in-out infinite alternate",
          willChange: "transform",
        }}
      />
      {/* mid-right — soft mid glow for depth */}
      <div
        className="absolute left-[42%] top-[28%] h-[42vmax] w-[42vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 40%, transparent 72%)",
          filter: "blur(80px)",
          animation: "sgb-orb-c 38s ease-in-out infinite alternate",
          willChange: "transform",
        }}
      />

      {/* Film grain — breaks the digital flatness (mix-blend screen) */}
      <div className="grain-layer" />

      {/* Edge vignette — darkens the corners so the orbs read as light pooling
          in the center rather than washing the whole frame. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Mood veil — keeps the glow from over-brightening content */}
      <div className="absolute inset-0 bg-black/15" />
    </div>
  );
}
