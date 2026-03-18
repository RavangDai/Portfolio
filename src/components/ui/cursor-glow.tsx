"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const [visible, setVisible] = useState(false);

  const rawX = useMotionValue(-600);
  const rawY = useMotionValue(-600);

  // Spring lag — gives the "trailing spotlight" feel
  const x = useSpring(rawX, { stiffness: 80, damping: 20, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 80, damping: 20, mass: 0.5 });

  useEffect(() => {
    // Skip on touch devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [rawX, rawY]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[9997] mix-blend-screen"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ opacity: { duration: 0.4 } }}
    >
      {/* Outer large soft glow */}
      <div
        className="h-[480px] w-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.10) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}
