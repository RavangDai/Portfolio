"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[9999] h-[2px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #10b981 0%, #22d3ee 50%, #10b981 100%)",
        boxShadow:
          "0 0 6px rgba(16,185,129,1), 0 0 18px rgba(16,185,129,0.6), 0 0 40px rgba(16,185,129,0.25)",
      }}
    />
  );
}
