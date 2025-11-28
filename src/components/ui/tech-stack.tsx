"use client";

import { motion } from "framer-motion";
import { TechPill } from "./tech-pill";

const item = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
    },
  },
});

export function TechStack() {
  return (
    <motion.div variants={item(0.25)} className="mt-10 space-y-8">

      {/* Section Title */}
      <h3 className="text-xs uppercase tracking-[0.22em] text-white/40">
        Tech Stack
      </h3>

      {/* 🔧 Languages */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-white/70 flex items-center gap-2">
          🔧 Languages
        </p>

        <div className="flex flex-wrap gap-3">
          <TechPill label="TypeScript" index={0} />
          <TechPill label="JavaScript" index={1} />
          <TechPill label="Python" index={2} />
          <TechPill label="Java" index={3} />
        </div>
      </div>

      {/* 🎨 Frontend */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-white/70 flex items-center gap-2">
          🎨 Frontend
        </p>

        <div className="flex flex-wrap gap-3">
          <TechPill label="React" index={0} />
          <TechPill label="Next.js" index={1} />
          <TechPill label="Tailwind" index={2} />
          <TechPill label="Framer Motion" index={3} />
          <TechPill label="ShadCN" index={4} />
        </div>
      </div>

      {/* 🧱 Backend */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-white/70 flex items-center gap-2">
          🧱 Backend
        </p>

        <div className="flex flex-wrap gap-3">
          <TechPill label="Node.js" index={0} />
          <TechPill label="Express" index={1} />
          <TechPill label="REST APIs" index={2} />
        </div>
      </div>

      {/* 📊 Data / AI */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-white/70 flex items-center gap-2">
          📊 Data / AI
        </p>

        <div className="flex flex-wrap gap-3">
          <TechPill label="Pandas" index={0} />
          <TechPill label="NumPy" index={1} />
          <TechPill label="Scikit-learn" index={2} />
        </div>
      </div>

    </motion.div>
  );
}
{/* TECH STACK */}
<motion.div variants={item(0.25)} className="mt-10 space-y-8">

  {/* Section Title */}
  <h3 className="text-xs uppercase tracking-[0.22em] text-white/40">
    Tech Stack
  </h3>

  {/* 🔧 Languages */}
  <div className="space-y-2">
    <p className="text-sm font-medium text-white/70 flex items-center gap-2">
      🔧 Languages
    </p>

    <div className="flex flex-wrap gap-3">
      <TechPill label="TypeScript" />
      <TechPill label="JavaScript" />
      <TechPill label="Python" />
      <TechPill label="Java" />
    </div>
  </div>

  {/* 🎨 Frontend */}
  <div className="space-y-2">
    <p className="text-sm font-medium text-white/70 flex items-center gap-2">
      🎨 Frontend
    </p>

    <div className="flex flex-wrap gap-3">
      <TechPill label="React" />
      <TechPill label="Next.js" />
      <TechPill label="Tailwind" />
      <TechPill label="Framer Motion" />
      <TechPill label="ShadCN" />
    </div>
  </div>

  {/* 🧱 Backend */}
  <div className="space-y-2">
    <p className="text-sm font-medium text-white/70 flex items-center gap-2">
      🧱 Backend
    </p>

    <div className="flex flex-wrap gap-3">
      <TechPill label="Node.js" />
      <TechPill label="Express" />
      <TechPill label="REST APIs" />
    </div>
  </div>

  {/* 📊 Data / AI */}
  <div className="space-y-2">
    <p className="text-sm font-medium text-white/70 flex items-center gap-2">
      📊 Data / AI
    </p>

    <div className="flex flex-wrap gap-3">
      <TechPill label="Pandas" />
      <TechPill label="NumPy" />
      <TechPill label="Scikit-learn" />
    </div>
  </div>

</motion.div>
