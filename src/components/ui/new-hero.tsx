"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Terminal,
  Cpu,
  Globe,
  LayoutTemplate,
  LayoutGrid,
  ArrowRight,
  Download,
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

const TECH_STACK = [
  { name: "React",      icon: Globe },
  { name: "TypeScript", icon: Code2 },
  { name: "Python",     icon: Terminal },
  { name: "Tailwind",   icon: LayoutTemplate },
  { name: "Node.js",    icon: Cpu },
  { name: "Next.js",    icon: Globe },
  { name: "SQL",        icon: Database },
  { name: "MongoDB",    icon: Database },
  { name: "PostgreSQL", icon: Database },
  { name: "Docker",     icon: LayoutGrid },
  { name: "Git",        icon: Terminal },
];

const ease = [0.22, 1, 0.36, 1] as const;

function TechMarquee() {
  return (
    <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex animate-tech-marquee">
        {[...TECH_STACK, ...TECH_STACK].map((tech, i) => {
          const Icon = tech.icon;
          return (
            <div
              key={`${tech.name}-${i}`}
              className="group flex shrink-0 items-center gap-2 border-r border-white/[0.06] px-6 py-2 transition-all hover:bg-white/[0.05]"
            >
              <Icon className="h-3 w-3 text-white/35 group-hover:text-white/80 transition-colors duration-300" />
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-white/35 group-hover:text-white/70 transition-colors duration-300">
                {tech.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function NewHero() {
  // Mouse parallax — direct DOM manipulation, zero re-renders
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const panel = panelRef.current;
    if (!panel) return;
    const { innerWidth: w, innerHeight: h } = window;
    const x = (e.clientX / w - 0.5) * 2;   // -1 to 1
    const y = (e.clientY / h - 0.5) * 2;   // -1 to 1
    panel.style.transform = `translate(${x * -10}px, ${y * -7}px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (panelRef.current) panelRef.current.style.transform = "translate(0px, 0px)";
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-1 flex-col">

        {/* Hero body */}
        <div className="flex flex-1 items-center max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-16 pt-28 md:pt-24 pb-6 gap-8 lg:gap-12">

          {/* ═══════════════ LEFT — Copy ═══════════════ */}
          <div className="flex flex-col justify-center w-full lg:w-[52%]">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease }}
              className="mb-7"
            >
              <span className="role-badge">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                Available for Work
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease }}
              className="mb-6 select-none"
            >
              <h1
                className="font-black leading-[1.0] tracking-tight text-white font-display"
                style={{
                  fontSize: "clamp(2.2rem, 7.5vw, 5.2rem)",
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 32px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.9)",
                }}
              >
                BIBEK{" "}
                <span className="pathak-gradient">
                  PATHAK
                </span>
              </h1>
              <div className="mt-5 space-y-2.5">
                <p
                  className="font-semibold text-white leading-tight"
                  style={{
                    fontSize: "clamp(0.9rem, 2.5vw, 1.18rem)",
                    textShadow: "0 1px 8px rgba(0,0,0,0.9)",
                  }}
                >
                  Full Stack Engineer
                  <span className="mx-2.5 text-white/25 font-light">/</span>
                  <span className="text-white/55 font-normal">AI &amp; ML Developer</span>
                </p>
                <div
                  className="flex items-center gap-2 text-white/40 flex-wrap"
                  style={{
                    fontSize: "clamp(0.62rem, 1.5vw, 0.72rem)",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    textShadow: "0 1px 8px rgba(0,0,0,0.9)",
                  }}
                >
                  <span>CS <span className="text-white/30">@</span> SELU</span>
                  <span className="text-white/20">·</span>
                  <span><span className="text-white/70">10+</span> Projects</span>
                  <span className="text-white/20">·</span>
                  <span>React · Next.js · Python</span>
                </div>
              </div>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease }}
              className="flex items-center gap-3 sm:gap-4 flex-wrap mb-8 mt-9"
            >
              <LiquidButton
                size="xl"
                className="rounded-full font-bold group"
                onClick={() => window.location.href = "/achievements"}
              >
                View Achievements
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </LiquidButton>
              <LiquidButton
                size="xl"
                variant="ghost"
                className="rounded-full font-semibold"
                onClick={() => window.open("/Bibek_Pathak_Resume_Mar26.pdf", "_blank")}
              >
                Download Resume
                <Download className="h-3.5 w-3.5" />
              </LiquidButton>
            </motion.div>

            {/* Social icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.8, ease }}
              className="flex items-center gap-3"
            >
              <a
                href="https://github.com/RavangDai"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-full text-white/60 hover:text-white hover:scale-110 transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
                }}
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/bibek-pathak-10398a301/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full text-white/60 hover:text-white hover:scale-110 transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
                }}
              >
                <FaLinkedinIn className="h-5 w-5" />
              </a>
            </motion.div>
          </div>

          {/* ═══════════════ RIGHT — Code panel ═══════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.35, ease }}
            className="hidden lg:flex lg:w-[48%] relative items-center justify-center"
          >
            {/* Parallax wrapper */}
            <div
              ref={panelRef}
              className="relative w-full max-w-[460px]"
              style={{ transition: "transform 0.18s cubic-bezier(0.22,1,0.36,1)", willChange: "transform" }}
            >
              {/* ── T-shaped skill map ── */}
              <div className="relative mx-auto flex flex-col items-center py-2">

                {/* Breadth caption */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.55, ease }}
                  className="mb-3 flex items-center gap-3 text-[0.55rem] font-semibold uppercase tracking-[0.32em] text-white/35"
                >
                  <span className="h-px w-7 bg-gradient-to-r from-transparent to-white/25" />
                  Breadth
                  <span className="h-px w-7 bg-gradient-to-l from-transparent to-white/25" />
                </motion.div>

                {/* Roof — horizontal bar (SWE · Data) */}
                <motion.div
                  initial={{ opacity: 0, y: -18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.65, ease }}
                  className="liquid-glass liquid-edge relative z-10 flex h-[68px] w-[330px] items-center justify-between overflow-hidden rounded-2xl px-9"
                >
                  <span className="relative z-10 text-xl font-black tracking-tight text-white">SWE</span>
                  <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-white/30" />
                  <span className="relative z-10 text-xl font-black tracking-tight text-white">Data</span>
                </motion.div>

                {/* Stem — vertical bar (AI / ML) */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.85, ease }}
                  className="liquid-glass liquid-edge relative -mt-px flex h-[200px] w-[86px] flex-col items-center justify-center gap-1.5 overflow-hidden rounded-b-2xl"
                  style={{ borderTop: "none" }}
                >
                  <span className="relative z-10 text-lg font-black leading-none tracking-tight text-white">AI</span>
                  <span className="relative z-10 text-sm leading-none text-white/30">/</span>
                  <span className="relative z-10 text-lg font-black leading-none tracking-tight text-white">ML</span>
                  {/* vertical DEPTH label */}
                  <span
                    className="pointer-events-none absolute -right-7 top-1/2 z-10 -translate-y-1/2 text-[0.5rem] font-semibold uppercase tracking-[0.3em] text-white/30"
                    style={{ writingMode: "vertical-rl" }}
                  >
                    Depth
                  </span>
                </motion.div>

                {/* Concept label */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.05, ease }}
                  className="mt-4 text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-white/40"
                >
                  T-shaped engineer
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════ BOTTOM — Marquee ═══════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1, ease }}
          className="pb-6 pt-3 border-t border-white/[0.05]"
        >
          <TechMarquee />
        </motion.div>
      </div>
    </section>
  );
}
