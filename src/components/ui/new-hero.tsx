"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  FileText,
  Code2,
  Database,
  Terminal,
  Cpu,
  Globe,
  LayoutTemplate,
  ArrowDown,
} from "lucide-react";
import { FlowLink } from "@/components/ui/flow-button";

// --- CONFIGURATION ---
const TECH_STACK = [
  { name: "React", icon: Globe },
  { name: "TypeScript", icon: Code2 },
  { name: "Python", icon: Terminal },
  { name: "Tailwind", icon: LayoutTemplate },
  { name: "Node.js", icon: Cpu },
  { name: "Next.js", icon: Globe },
  { name: "SQL", icon: Database },
  { name: "MongoDB", icon: Database },
  { name: "PostgreSQL", icon: Database },
  { name: "Docker", icon: LayoutGrid },
  { name: "Git", icon: Terminal },
];

// Particle positions — deterministic so no hydration mismatch
const PARTICLES = [
  { left: "8%",  top: "22%", size: 3, duration: 4.2, delay: 0 },
  { left: "18%", top: "68%", size: 2, duration: 5.5, delay: 0.8 },
  { left: "82%", top: "18%", size: 2, duration: 3.8, delay: 1.4 },
  { left: "88%", top: "55%", size: 3, duration: 6.1, delay: 0.3 },
  { left: "50%", top: "88%", size: 2, duration: 4.7, delay: 1.9 },
  { left: "35%", top: "12%", size: 1.5, duration: 5.0, delay: 2.4 },
];

const ease = [0.22, 1, 0.36, 1] as const;

// --- AVATAR ---
const SKILL_TAGS = [
  { label: "AI",          x: 46,  y: -31, delay: 0.0  },
  { label: "Full-Stack",  x: -27, y: 49,  delay: 0.07 },
  { label: "Data",        x: -73, y: -31, delay: 0.04 },
];

function Avatar() {
  return (
    // Outer div is the hover-zone (larger than the avatar so tags stay visible when cursor moves toward them)
    <motion.div
      className="relative flex items-center justify-center w-[180px] h-[140px]"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      {/* Inner centered container for rings + glow + photo */}
      <div className="relative w-[90px] h-[90px] flex items-center justify-center">
        {/* Pulse rings */}
        <span
          className="absolute inset-0 rounded-full border border-emerald-400/30 pointer-events-none"
          style={{ animation: "pulse-out 3s ease-out infinite" }}
        />
        <span
          className="absolute inset-0 rounded-full border border-cyan-400/20 pointer-events-none"
          style={{ animation: "pulse-out 3s ease-out infinite", animationDelay: "1s" }}
        />

        {/* Animated glow halo */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{
            boxShadow: [
              "0 0 18px 5px rgba(16,185,129,0.18)",
              "0 0 32px 10px rgba(34,211,238,0.26)",
              "0 0 18px 5px rgba(16,185,129,0.18)",
            ],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Photo */}
        <div className="group/photo relative h-[78px] w-[78px] sm:h-[90px] sm:w-[90px] overflow-hidden rounded-full border border-white/[0.08]">
          <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-lg opacity-0 group-hover/photo:opacity-100 transition-opacity duration-700" />
          <Image
            src="/hero-me.png"
            alt="Bibek Pathak"
            fill
            priority
            className="relative object-cover object-[50%_20%] grayscale transition-all duration-700 group-hover/photo:grayscale-0 group-hover/photo:scale-110"
          />
        </div>
      </div>

      {/* Floating skill tags — orbit into view on hover */}
      {SKILL_TAGS.map(({ label, x, y, delay }) => (
        <motion.span
          key={label}
          style={{ position: "absolute", top: "50%", left: "50%" }}
          variants={{
            rest: {
              opacity: 0,
              x: x * 0.45,
              y: y * 0.45,
              scale: 0.65,
              transition: { duration: 0.22, ease: "easeOut" },
            },
            hover: {
              opacity: 1,
              x,
              y,
              scale: 1,
              transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay },
            },
          }}
          className="text-[0.52rem] font-bold uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-[#020A06]/95 text-emerald-400/85 pointer-events-none whitespace-nowrap z-10"
        >
          {label}
        </motion.span>
      ))}
    </motion.div>
  );
}

// --- MARQUEE ---
function TechMarquee() {
  return (
    <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex gap-0 pr-0"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: { repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" },
        }}
      >
        {[...TECH_STACK, ...TECH_STACK].map((tech, index) => {
          const Icon = tech.icon;
          return (
            <div
              key={`${tech.name}-${index}`}
              className="group flex shrink-0 items-center gap-2 border-r border-white/[0.06] px-5 py-1 transition-all hover:bg-white/[0.03]"
            >
              <Icon className="h-3 w-3 text-emerald-600/50 group-hover:text-emerald-400 transition-colors duration-300" />
              <span className="text-[0.6rem] font-medium uppercase tracking-[0.22em] text-white/25 group-hover:text-white/60 transition-colors duration-300">
                {tech.name}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

// --- MAIN HERO ---
export function NewHero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#020A06] pb-0"
    >
      {/* ══════════════════════════════════════
          BACKGROUND LAYER
      ══════════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[8%] left-[10%] h-[520px] w-[520px] rounded-full bg-emerald-600 blur-[100px] animate-aurora-1" />
        <div className="absolute bottom-[10%] right-[8%] h-[460px] w-[460px] rounded-full bg-cyan-600 blur-[90px] animate-aurora-2" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_100%,transparent_50%,#020A06_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#020A06] to-transparent" />
        {/* Grain texture for depth */}
        <div className="grain-layer" />
      </div>

      {/* ══════════════════════════════════════
          FLOATING PARTICLES
      ══════════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-400"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            animate={{ y: [-10, 10, -10], opacity: [0.15, 0.55, 0.15] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════
          TOP STRIP
      ══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease }}
        className="relative z-10 flex items-center justify-between px-6 pt-8 md:px-10"
      >
        <div className="flex items-center gap-2 text-[0.58rem] font-medium uppercase tracking-[0.28em] text-white/25">
          <span>Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-3 w-3" />
          </motion.div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════
          CENTER CONTENT
      ══════════════════════════════════════ */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center pt-6 pb-4">

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.38, ease }}
        >
          <Avatar />
        </motion.div>

        {/* ── PRIMARY NAME ── */}
        <div className="mt-5 sm:mt-6 select-none">

          {/* BIBEK */}
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.55, ease }}
          >
            <span
              className="block font-black leading-[0.82] tracking-tighter shimmer-text"
              style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}
            >
              BIBEK
            </span>
          </motion.div>

          {/* PATHAK */}
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.7, ease }}
          >
            <span
              className="block font-thin leading-[0.82] tracking-[0.18em] text-white/20"
              style={{ fontSize: "clamp(2.8rem, 9.5vw, 7.8rem)" }}
            >
              PATHAK
            </span>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1.1, ease }}
          className="mt-5 h-px w-48 origin-center"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.7) 35%, rgba(34,211,238,0.7) 65%, transparent)",
          }}
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.18, ease }}
          className="mt-4 max-w-[360px] text-sm text-slate-400 leading-relaxed"
        >
          Synthesizing code, design, and data into scalable, user-centric applications.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.32, ease }}
          className="mt-7 flex flex-wrap items-center justify-center gap-4"
        >
          <FlowLink href="#projects" variant="primary">
            View Projects
            <LayoutGrid className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" />
          </FlowLink>
          <FlowLink href="/Bibek_Pathak_Resume_Mar26.pdf" variant="ghost">
            Download Resume
            <FileText className="h-3.5 w-3.5" />
          </FlowLink>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          BOTTOM — MARQUEE
      ══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5, ease }}
        className="relative z-10 pb-7 pt-5"
      >
        <TechMarquee />
      </motion.div>
    </section>
  );
}
