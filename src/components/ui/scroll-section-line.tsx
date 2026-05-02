"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ScrollSectionLine() {
  const [active, setActive] = useState(false);
  const lastId = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const SECTIONS = ["home", "projects", "certificates", "contact"];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id !== lastId.current) {
            if (lastId.current !== "") {
              clearTimeout(timerRef.current);
              setActive(true);
              timerRef.current = setTimeout(() => setActive(false), 700);
            }
            lastId.current = entry.target.id;
          }
        }
      },
      { threshold: 0.28 }
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Scan line sweeping left to right */}
          <motion.div
            key="scan-line"
            className="pointer-events-none fixed left-0 right-0 z-[150] h-px"
            style={{
              top: "50%",
              transformOrigin: "left center",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0.08) 85%, transparent 100%)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Soft vignette flash behind the line */}
          <motion.div
            key="scan-bg"
            className="pointer-events-none fixed inset-0 z-[149]"
            style={{
              background:
                "radial-gradient(ellipse 100% 18% at 50% 50%, rgba(255,255,255,0.025) 0%, transparent 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
