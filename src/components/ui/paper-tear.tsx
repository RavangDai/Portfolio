"use client";

import { useId, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// A torn-paper seam between sections. The lower sheet rises UP FROM BELOW and STRETCHES (scaleY
// from its base) to meet the fixed upper sheet, closing a shadowed rip; then a strip of washi
// tape seals across. Scroll-linked, so it's calm + reduced-motion safe.

// Upper sheet — solid down to a ragged BOTTOM edge (~y44-57 in a 64-tall viewBox).
const TOP_EDGE =
  "M0,0 L1440,0 L1440,47 L1402,55 L1360,45 L1320,56 L1278,46 L1236,57 L1194,44 L1152,55 " +
  "L1110,47 L1068,57 L1026,44 L984,55 L942,47 L900,57 L858,45 L816,56 L774,44 L732,55 " +
  "L690,48 L648,57 L606,44 L566,55 L524,47 L482,57 L440,45 L398,56 L356,44 L314,55 " +
  "L272,48 L230,57 L188,44 L146,55 L104,47 L62,57 L24,45 L0,54 Z";

// Lower sheet — solid up to a ragged TOP edge (~y9-22 in a 64-tall viewBox).
const BOT_EDGE =
  "M0,64 L1440,64 L1440,18 L1402,20 L1360,10 L1320,21 L1278,11 L1236,22 L1194,9 L1152,20 " +
  "L1110,12 L1068,22 L1026,9 L984,20 L942,12 L900,22 L858,10 L816,21 L774,9 L732,20 " +
  "L690,13 L648,22 L606,9 L566,20 L524,12 L482,22 L440,10 L398,21 L356,9 L314,20 " +
  "L272,13 L230,22 L188,9 L146,20 L104,12 L62,22 L24,10 L0,19 Z";

export function PaperTear({ tape = "tan" }: { tape?: "tan" | "blush" | "mint" | "marigold" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // The lower sheet rises + stretches up (from its base) to seal the rip, then the tape draws on.
  const botScaleY = useTransform(scrollYProgress, [0.08, 0.56], [0.35, 1]);
  const botY = useTransform(scrollYProgress, [0.08, 0.56], [14, 0]);
  const gapO = useTransform(scrollYProgress, [0.08, 0.5], [1, 0]);
  const seal = useTransform(scrollYProgress, [0.54, 0.78], [0, 1]);

  const sh = "ptear-" + useId().replace(/:/g, "");
  const tapeClass =
    tape === "blush" ? "brut-tape--blush"
    : tape === "mint" ? "brut-tape--mint"
    : tape === "marigold" ? "brut-tape--marigold"
    : "";

  return (
    <div ref={ref} className="ptear" aria-hidden>
      {/* shadowed torn backing, revealed while the rip is open */}
      <motion.div className="ptear-gap" style={{ opacity: gapO }} />

      {/* lower sheet — anchored at its base; rises + stretches up to close the rip */}
      <motion.div className="ptear-bottom" style={{ scaleY: botScaleY, y: botY, originY: 1 }}>
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none">
          <path d={BOT_EDGE} fill="#f7f1e8" />
        </svg>
      </motion.div>

      {/* upper sheet (fixed, front) — casts a shadow onto the gap/lower sheet from its torn edge */}
      <div className="ptear-top">
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none">
          <defs>
            <filter id={sh} x="-2%" y="-30%" width="104%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#1a1714" floodOpacity="0.32" />
            </filter>
          </defs>
          <path d={TOP_EDGE} fill="#f7f1e8" filter={`url(#${sh})`} />
        </svg>
      </div>

      <motion.span
        className={`ptear-tape brut-tape ${tapeClass}`}
        style={{ scaleX: seal, opacity: seal, originX: 0.5, rotate: -3 }}
      />
    </div>
  );
}
