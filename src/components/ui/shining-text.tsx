"use client";

import { motion } from "framer-motion";

interface ShiningTextProps {
  text: string;
  className?: string;
}

export function ShiningText({ text, className = "" }: ShiningTextProps) {
  return (
    <motion.span
      className={`bg-[linear-gradient(110deg,#3a3a3a,35%,#d0d0d0,50%,#3a3a3a,75%,#3a3a3a)] bg-[length:200%_100%] bg-clip-text text-[12px] font-medium text-transparent tracking-wide ${className}`}
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{
        repeat: Infinity,
        duration: 2.2,
        ease: "linear",
      }}
    >
      {text}
    </motion.span>
  );
}
