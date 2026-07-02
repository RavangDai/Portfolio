"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { SiteInfo } from "@/lib/content/types";

// The brutalist blueprint hero is client-driven (scroll-linked transforms + GSAP, position:sticky),
// so it loads on the client (ssr:false) with a paper placeholder. Its content is mirrored as a
// server-rendered sr-only <h1> + bio in app/page.tsx for crawlers.
const HorizonHero = dynamic(
  () => import("@/components/ui/horizon-hero-section").then((m) => ({ default: m.Component })),
  { ssr: false, loading: () => <div className="hero-loading" /> }
);

export function HomeHero({ site }: { site: SiteInfo }) {
  // Server and the client's first paint must render byte-identical markup, or React throws a
  // hydration-mismatch (#418) at this boundary — confirmed happening in production (not dev)
  // because next/dynamic's ssr:false bailout marker doesn't reconcile cleanly here once the lazy
  // chunk loads. Gating on a post-mount flag guarantees both first renders are the same inert
  // placeholder; the swap to the real (dynamically imported) hero happens as an ordinary
  // client-side update afterward, never during hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="hero-loading" />;
  return <HorizonHero site={site} />;
}
