"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Vertical curtain: scaleY 1→0 from top edge, page revealed top-down */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.9, delay: 0.05, ease: [0.76, 0, 0.24, 1] }}
        className="pointer-events-none fixed inset-0 z-[200] bg-[#050509]"
        style={{ transformOrigin: "top center" }}
      />
      {children}
    </motion.div>
  );
}
