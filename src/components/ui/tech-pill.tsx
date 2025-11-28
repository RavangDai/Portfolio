"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type TechPillProps = {
  label: string;
  index?: number; // used for stagger
};

const pillVariants = {
  hidden: { opacity: 0, y: 6, scale: 0.96 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05, // stagger based on index
      duration: 0.25,
      ease: [0.23, 0.86, 0.39, 0.96] as any,
    },
  }),
};

export function TechPill({ label, index = 0 }: TechPillProps) {
  return (
    <motion.div
      className={cn(
        "px-4 py-1.5 rounded-full text-sm text-white/80",
        "border border-white/12 bg-white/[0.03] backdrop-blur-md",
        "shadow-[0_4px_18px_rgba(0,0,0,0.45)]"
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={pillVariants}
      custom={index}
      whileHover={{ scale: 1.02 }}
    >
      {label}
    </motion.div>
  );
}
