"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useIsBrut } from "@/lib/theme";

// A clean, crisp scroll progress bar — a single terracotta fill that grows as you scroll.
// No comet, halo, or glow (those read as generic/AI-slop); just a flat brutalist hairline.
export function ScrollProgress() {
  const isBrut = useIsBrut();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  const rail = isBrut ? "rgba(26,23,20,0.08)" : "rgba(255,255,255,0.06)";
  const fill = isBrut ? "var(--accent, #bd5232)" : "rgba(255,255,255,0.7)";

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
    >
      <div className="absolute inset-0" style={{ background: rail }} />
      <motion.div
        className="absolute inset-y-0 left-0 right-0 origin-left"
        style={{ scaleX: progress, background: fill }}
      />
    </div>
  );
}
