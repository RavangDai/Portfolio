"use client";

import Image from "next/image";
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
  Sparkles,
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { NeatGradientBg } from "@/components/ui/neat-gradient-bg";

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
      <motion.div
        className="flex"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 38, ease: "linear" } }}
      >
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
      </motion.div>
    </div>
  );
}

export function NewHero() {
  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col overflow-hidden">

      {/* ── Background ── */}
      <NeatGradientBg />

      {/* LEFT TEXT SHIELD — critical for readability: dark gradient covers the copy column */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.58) 30%, rgba(0,0,0,0.22) 55%, transparent 75%)"
        }}
      />

      {/* Radial vignette — gradient bright spot shifted right toward the photo */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 65% 60% at 72% 52%, transparent 30%, rgba(0,0,0,0.65) 100%)"
        }}
      />

      {/* Top fade — keeps nav readable */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/55 to-transparent" />

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#080808] to-transparent" />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-1 flex-col">

        {/* Hero body */}
        <div className="flex flex-1 items-center max-w-7xl mx-auto w-full px-6 md:px-10 lg:px-16 pt-28 md:pt-24 pb-6 gap-8 lg:gap-12">

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
                  fontSize: "clamp(2.8rem, 5.5vw, 5.2rem)",
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 32px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.9)",
                }}
              >
                BIBEK{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #cccccc 50%, #f0f0f0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 2px 16px rgba(0,0,0,0.8))",
                  }}
                >
                  PATHAK
                </span>
              </h1>
              <p
                className="mt-4 font-medium text-white/65 leading-snug tracking-wide"
                style={{
                  fontSize: "clamp(0.88rem, 1.4vw, 1.05rem)",
                  textShadow: "0 1px 8px rgba(0,0,0,0.9)",
                  letterSpacing: "0.04em",
                }}
              >
                Building Smart &amp; Scalable Web Solutions
              </p>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease }}
              className="flex items-center gap-4 flex-wrap mb-8 mt-9"
            >
              <a
                href="#projects"
                className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                style={{
                  background: "#ffffff",
                  color: "#000000",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.12), 0 4px 16px rgba(0,0,0,0.4)",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.9), 0 0 40px rgba(255,255,255,0.22), 0 8px 28px rgba(0,0,0,0.5)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.12), 0 4px 16px rgba(0,0,0,0.4)")}
              >
                View Portfolio
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <a
                href="/Bibek_Pathak_Resume_Mar26.pdf"
                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full font-semibold text-sm text-white/75 hover:text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 16px rgba(0,0,0,0.3)",
                }}
              >
                Download CV
                <Download className="h-3.5 w-3.5" />
              </a>
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

          {/* ═══════════════ RIGHT — Photo ═══════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.35, ease }}
            className="hidden lg:flex lg:w-[48%] relative justify-center"
          >
            {/* Ambient glass blobs */}
            <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-white/8 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-white/5 blur-3xl pointer-events-none" />

            {/* Photo card */}
            <div className="relative w-full max-w-[480px]">
              {/* Ambient glow under photo */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(180,180,180,0.2) 50%, transparent 90%)" }}
              />

              {/* Cutout image */}
              <div className="group relative mx-auto">
                <Image
                  src="/bibekdai.png"
                  alt="Bibek Pathak"
                  width={480}
                  height={560}
                  priority
                  className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02] drop-shadow-2xl"
                  style={{ filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.8))" }}
                />

                {/* Hover speech-bubble */}
                <div
                  className="absolute top-8 -right-4 w-[210px] -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-350 ease-out pointer-events-none"
                  style={{
                    background: "rgba(10, 10, 10, 0.75)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderTopColor: "rgba(255,255,255,0.25)",
                    borderRadius: "14px 14px 14px 2px",
                    padding: "13px 15px",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 16px 48px rgba(0,0,0,0.6)",
                  }}
                >
                  <p className="text-white/80 text-[0.75rem] leading-relaxed font-medium">
                    A full-stack developer &amp; AI engineer passionate about performance, clean code, and exceptional UX.
                  </p>
                  <span className="block mt-2 text-white/45 text-[0.68rem] tracking-wide font-semibold">
                    From concept to clean code.
                  </span>
                  <span
                    className="absolute -bottom-[9px] left-5 w-0 h-0"
                    style={{
                      borderLeft: "9px solid transparent",
                      borderRight: "9px solid transparent",
                      borderTop: "9px solid rgba(10,10,10,0.75)",
                    }}
                  />
                </div>
              </div>

              {/* Curved quote SVG */}
              <div className="relative -mt-10 px-2">
                <svg viewBox="0 0 460 72" xmlns="http://www.w3.org/2000/svg" className="w-full overflow-visible">
                  <defs>
                    <path id="arc" d="M 10,8 Q 230,70 450,8" />
                  </defs>
                  <path d="M 10,8 Q 230,70 450,8" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
                  <text fontSize="11.5" fontFamily="ui-sans-serif, system-ui" letterSpacing="0.04em">
                    <textPath href="#arc" startOffset="50%" textAnchor="middle" fill="rgba(255,255,255,0.40)">
                      ✦ building smart &amp; scalable solutions, one line at a time ✦
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* Floating code card — liquid glass */}
              <motion.div
                animate={{ y: [-7, 7, -7] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-12 top-14 px-4 py-3 rounded-2xl"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderTopColor: "rgba(255,255,255,0.22)",
                  backdropFilter: "blur(32px) saturate(180%)",
                  WebkitBackdropFilter: "blur(32px) saturate(180%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 20px 60px rgba(0,0,0,0.6)",
                }}
              >
                <p className="text-[0.55rem] font-mono text-white/35 mb-1.5">// stack.ts</p>
                <p className="text-[0.63rem] font-mono text-white/85">
                  <span className="text-white/50">const</span> <span className="text-white">skills</span> <span className="text-white/40">=</span> <span className="text-white/40">[</span>
                </p>
                <p className="text-[0.63rem] font-mono text-white/60 pl-3">&quot;React&quot;, &quot;Next.js&quot;,</p>
                <p className="text-[0.63rem] font-mono text-white/60 pl-3">&quot;Python&quot;, &quot;AI/ML&quot;</p>
                <p className="text-[0.63rem] font-mono text-white/40">]</p>
              </motion.div>

              {/* Floating stats card — liquid glass */}
              <motion.div
                animate={{ y: [7, -7, 7] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
                className="absolute -right-8 bottom-24 px-5 py-3.5 rounded-2xl"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderTopColor: "rgba(255,255,255,0.22)",
                  backdropFilter: "blur(32px) saturate(180%)",
                  WebkitBackdropFilter: "blur(32px) saturate(180%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 20px 60px rgba(0,0,0,0.6)",
                }}
              >
                <p className="text-[0.55rem] font-semibold text-white/35 uppercase tracking-wider mb-2">Experience</p>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-black text-white leading-none">3+</span>
                  <span className="text-[0.62rem] text-white/40 font-medium mb-0.5">years</span>
                </div>
              </motion.div>
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
