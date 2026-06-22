"use client";

import { useEffect, useRef } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * HighlightText — scroll-driven "inking" emphasis. The text is always in the DOM and readable
 * in its muted state (the ink is an enhancement, never a visibility gate; crawlers / no-JS
 * readers lose nothing). Two effects compose over one CSS engine (the registered `--hl`
 * <percentage> in globals.css):
 *
 *   • ink       — the glyphs themselves shift muted (--ink-2) → accent (terracotta). A solid
 *                 accent clone is wiped over a muted base by `--hl` (two solid colours, NOT a
 *                 background-clip:text gradient). aria-hidden so it never double-reads.
 *   • underline — a hand-drawn terracotta marker sweep at the baseline (the "gradient sweep").
 *   • color     — legacy: a translucent pastel marker wash BEHIND the text (the original look).
 *
 * Two drivers for the same `--hl`:
 *   • mode="reveal" (default) — IntersectionObserver flips --hl 0→100% once, the CSS transition
 *     eases it. For the many small emphasis words (cheap, observer disconnects after firing).
 *   • mode="scroll" — Framer useScroll → useTransform writes --hl frame-by-frame as the element
 *     is read. For headings + the hero. MotionValues mutate the DOM directly: zero re-renders.
 *
 * Reduced motion: honoured deliberately here even though the app sets <MotionConfig
 * reducedMotion="never"> (which forces Framer's useReducedMotion() to false). We read the OS
 * preference via matchMedia directly; the CSS media query in globals.css also snaps --hl to
 * 100% (final inked state, no movement) as defence in depth.
 */

// Legacy translucent washes that sit BEHIND the text (light, so ink text stays legible).
const WASH = {
  pop: "var(--pop-soft, rgba(189,82,50,0.16))",
  accent: "var(--accent-soft, #f4ddd0)",
  butter: "#f1d6a4",
  mint: "#cdd3b2",
  blush: "#f0cdbd",
} as const;

// Foreground ink targets (the colour the glyphs settle into).
const INK = {
  accent: "var(--accent, #bd5232)",
  "accent-deep": "var(--accent-deep, #9e3f27)",
  "accent-ink": "var(--accent-ink, #ffffff)", // for titles on filled (dark) accent cards
  ink: "var(--ink, #1a1714)",
} as const;

type WashColor = keyof typeof WASH;
type InkColor = keyof typeof INK;

export interface HighlightTextProps {
  children: React.ReactNode;
  /** Element to render. Defaults to a span; pass "h1"/"h2"/… to ink a heading directly. */
  as?: React.ElementType;
  /** "reveal" = ink once on entry (default); "scroll" = ink in real time tied to scroll. */
  mode?: "reveal" | "scroll";
  /** Shift the glyphs muted → accent. */
  ink?: boolean;
  /** Hand-drawn marker sweep at the baseline. */
  underline?: boolean;
  /** Foreground ink target. Use "accent-deep" for small text (AA), "accent" for headings. */
  inkColor?: InkColor;
  /** Legacy translucent pastel wash behind the text. */
  color?: WashColor;
  /** Legacy alias: variant="underline" is equivalent to underline. */
  variant?: "marker" | "underline";
  from?: "left" | "right";
  className?: string;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Shared markup. The accent clone (ink) is aria-hidden so the phrase reads once. */
function Inked({
  tagRef,
  as: Tag = "span",
  mode = "reveal",
  ink = false,
  underline = false,
  inkColor = "accent",
  color,
  variant,
  from = "left",
  className,
  children,
}: HighlightTextProps & { tagRef: React.Ref<HTMLElement> }) {
  const isUnderline = underline || variant === "underline";
  const wash = color ? WASH[color] : undefined;

  const style: React.CSSProperties = {
    ...(wash ? { ["--hl-color" as string]: wash } : {}),
    ...(ink || isUnderline ? { ["--ink-accent" as string]: INK[inkColor] } : {}),
  };

  return (
    <Tag
      ref={tagRef}
      data-from={from}
      data-mode={mode}
      className={cn(
        ink ? "brut-ink" : "brut-hl",
        isUnderline && (ink ? "brut-ink--underline" : "brut-hl--underline"),
        className,
      )}
      style={style}
    >
      {children}
      {ink && (
        <span aria-hidden className="brut-ink__fill">
          {children}
        </span>
      )}
    </Tag>
  );
}

/** mode="reveal": ink once when the phrase scrolls into view, then stop observing. */
function RevealHighlight(props: HighlightTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion + the CSS media query both land --hl at 100% (final state) without movement.
    if (prefersReducedMotion()) {
      el.style.setProperty("--hl", "100%");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.style.setProperty("--hl", "100%");
            io.disconnect();
          }
        }
      },
      { threshold: 0.7 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <Inked {...props} tagRef={ref} />;
}

/** mode="scroll": --hl tracks scroll progress as the element is read. */
function ScrollHighlight(props: HighlightTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useRef(false);

  // From "top enters at 90% of the viewport" to "top reaches 50%" — inks as it rises into view.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.5"],
  });
  const hl = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
    if (reduced.current) ref.current?.style.setProperty("--hl", "100%");
  }, []);

  useMotionValueEvent(hl, "change", (v) => {
    if (reduced.current) return;
    ref.current?.style.setProperty("--hl", v);
  });

  return <Inked {...props} tagRef={ref} />;
}

export function HighlightText(props: HighlightTextProps) {
  return props.mode === "scroll" ? (
    <ScrollHighlight {...props} />
  ) : (
    <RevealHighlight {...props} />
  );
}

/** Back-compat alias — existing <Highlight color=… variant=…> call sites keep working. */
export const Highlight = HighlightText;
