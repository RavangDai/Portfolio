"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Tape — a strip of washi tape pinning a surface to the paper.
 *
 * Wraps the shared `.brut-tape` look (see globals.css) with a scroll-triggered "press-on"
 * entrance: the strip drops in slightly lifted + over-rotated + transparent, then settles onto
 * the surface. Purely decorative (`aria-hidden`, `pointer-events: none` via the class).
 *
 * The consumer positions it with `style` (top/left/right/width/height); rotation is the `rotate`
 * prop (framer owns the transform, so it must not also live in `style`).
 *
 * `initial` is intentionally static (NOT branched on useReducedMotion): that hook reads the OS
 * media query and returns false on the server / true on the client, which produced a hydration
 * mismatch. Motion policy is owned globally by <MotionConfig reducedMotion="never"> in layout.tsx,
 * so the entrance plays consistently for everyone and the SSR markup always matches.
 */

type TapeColor = "butter" | "blush" | "mint" | "clay" | "marigold";

export function Tape({
  color,
  rotate = -6,
  className,
  style,
}: {
  color?: TapeColor;
  rotate?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.span
      aria-hidden
      className={cn("brut-tape", color && `brut-tape--${color}`, className)}
      style={style}
      initial={{ opacity: 0, scale: 0.72, rotate: rotate - 10, y: -8 }}
      whileInView={{ opacity: 1, scale: 1, rotate, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
