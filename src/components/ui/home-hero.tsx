"use client";

import dynamic from "next/dynamic";

// The brutalist blueprint hero is client-driven (scroll-linked transforms + GSAP). Load it on
// the client so SSR stays simple; while the chunk loads, show a paper placeholder that matches
// the hero's light backdrop — no flash before the scene appears.
const HorizonHero = dynamic(
  () => import("@/components/ui/horizon-hero-section").then((m) => ({ default: m.Component })),
  { ssr: false, loading: () => <div className="hero-loading" /> }
);

export function HomeHero() {
  return <HorizonHero />;
}
