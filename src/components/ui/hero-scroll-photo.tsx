"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export function HeroScrollPhoto() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });

  // Motion path (tweak these 3 if needed)
  const x = useTransform(scrollYProgress, [0, 0.65], ["0px", "280px"]);
  const y = useTransform(scrollYProgress, [0, 0.65], ["0px", "420px"]);
  const scale = useTransform(scrollYProgress, [0, 0.65], [1, 0.78]);
  const rotate = useTransform(scrollYProgress, [0, 0.65], [0, -6]);

  // Morph: circle -> rounded card
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.65],
    ["9999px", "28px"]
  );

  const glowOpacity = useTransform(scrollYProgress, [0, 0.65], [0.95, 0.55]);

  return (
    <div ref={wrapRef} className="relative">
      {/* ============ SECTION 1: INTRO (white like example) ============ */}
      <section className="relative mx-auto w-full max-w-6xl px-4 pt-24 pb-16 md:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white px-6 py-20 shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.06),transparent_65%)]" />

          <div className="relative z-10 flex items-center justify-between">
            <p className="text-lg tracking-[0.18em] text-black/80 md:text-xl">
              DATA - AI
            </p>
            <p className="text-lg tracking-[0.18em] text-black/80 md:text-xl">
              FULL STACK
            </p>
          </div>

          <div className="relative z-10 mt-14 flex justify-center">
            <motion.div
              style={{ x, y, scale, rotate, borderRadius }}
              className="relative h-[260px] w-[260px] md:h-[340px] md:w-[340px]"
            >
              {/* glow */}
              <motion.div
                style={{ opacity: glowOpacity }}
                className="pointer-events-none absolute -inset-10 -z-10 rounded-full
                bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.55),transparent_60%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.40),transparent_60%)]
                blur-2xl"
              />

              {/* frame */}
              <div className="relative h-full w-full overflow-hidden border border-black/10 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
                <Image
                  src="/hero-me.png"
                  alt="Bibek Pathak"
                  fill
                  priority
                  className="object-cover"
                />

                {/* premium overlays */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),transparent_60%)]" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/25" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-white/20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 2: YOUR DARK HERO (placeholder target) ============ */}
      <section
        className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-6 md:px-6 md:pb-24"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.22),transparent_60%)]" />

        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          {/* left side: keep empty (your actual hero already exists) */}
          <div />

          {/* right target area */}
          <div className="relative hidden justify-self-end md:block">
            <div
              className={cn(
                "h-[360px] w-[320px] rounded-3xl border border-white/10 bg-white/[0.02]",
                "shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
              )}
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
          </div>
        </div>
      </section>
    </div>
  );
}
