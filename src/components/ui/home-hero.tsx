"use client";

import dynamic from "next/dynamic";

// The cosmos hero is heavy WebGL (Three.js + bloom). Load it only on the client so the
// main bundle stays lean. While the chunk + WebGL boot, show a plain black placeholder
// that matches the hero's backdrop — no "old hero" flashes in before the cosmos appears.
const HorizonHero = dynamic(
  () => import("@/components/ui/horizon-hero-section").then((m) => ({ default: m.Component })),
  { ssr: false, loading: () => <div className="hero-loading" /> }
);

export function HomeHero() {
  return <HorizonHero />;
}
