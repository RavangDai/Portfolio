"use client";

import dynamic from "next/dynamic";
import type { SiteInfo } from "@/lib/content/types";

// The brutalist blueprint hero is client-driven (scroll-linked transforms + GSAP, position:sticky),
// so it loads on the client (ssr:false) with a paper placeholder. Its content is mirrored as a
// server-rendered sr-only <h1> + bio in app/page.tsx for crawlers.
const HorizonHero = dynamic(
  () => import("@/components/ui/horizon-hero-section").then((m) => ({ default: m.Component })),
  { ssr: false, loading: () => <div className="hero-loading" /> }
);

export function HomeHero({ site }: { site: SiteInfo }) {
  return <HorizonHero site={site} />;
}
