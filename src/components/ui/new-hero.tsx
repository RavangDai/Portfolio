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
              className="group flex shrink-0 items-center gap-2 border-r border-white/[0.06] px-6 py-2 transition-all hover:bg-white/[0.06]"
            >
              <Icon className="h-3 w-3 text-[#17E7FF]/50 group-hover:text-[#FF5373] transition-colors duration-300" />
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-white/30 group-hover:text-white/65 transition-colors duration-300">
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-[#003FFF]/10" />

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
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-sm shadow-sm">
                <Sparkles className="h-3 w-3 text-[#FF5373]" />
                <span className="text-[0.65rem] font-bold text-white tracking-[0.2em] uppercase">
                  Available for Work
                </span>
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
                className="font-black leading-[1.05] tracking-tight text-white"
                style={{ fontSize: "clamp(2.6rem, 5.2vw, 4.8rem)" }}
              >
                Building Smart
                <br />
                &amp;{" "}
                <span
                  style={{
                    background: "linear-gradient(130deg, #FF5373 0%, #FFC858 45%, #17E7FF 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Scalable
                </span>
                <br />
                Web Solutions
              </h1>
            </motion.div>

            {/* Sub-tagline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease }}
              className="mb-9 text-[0.95rem] text-white/55 leading-relaxed max-w-[420px]"
            >
              A full-stack developer &amp; AI engineer passionate about
              performance, clean code, and exceptional user experience. From
              concept to clean code.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease }}
              className="flex items-center gap-4 flex-wrap mb-8"
            >
              <a
                href="#projects"
                className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#FF5373] text-white font-semibold text-sm shadow-lg shadow-[#FF5373]/30 hover:bg-[#FF5373]/85 hover:shadow-[#FF5373]/45 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              >
                View Portfolio
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <a
                href="/Bibek_Pathak_Resume_Mar26.pdf"
                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-sm text-white font-semibold text-sm hover:bg-white/[0.14] hover:border-white/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 shadow-sm"
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
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.10] border border-white/[0.12] text-white shadow-md hover:bg-[#FF5373] hover:border-[#FF5373]/50 hover:scale-110 transition-all duration-300"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/bibek-pathak-10398a301/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-white shadow-md shadow-blue-500/25 hover:bg-blue-400 hover:scale-110 transition-all duration-300"
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
            {/* Glow blobs */}
            <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-[#FF5373]/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-[#17E7FF]/20 blur-3xl pointer-events-none" />

            {/* Photo card */}
            <div className="relative w-full max-w-[400px]">
              <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] max-h-[500px]">
                <Image
                  src="/bibekdai.png"
                  alt="Bibek Pathak"
                  fill
                  priority
                  className="object-cover object-[50%_15%]"
                />
                {/* Bottom overlay */}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#003FFF]/60 to-transparent" />
                {/* Name card */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
                  <div className="px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/[0.12] shadow-lg">
                    <p className="text-xs font-bold text-white tracking-wide">Bibek Pathak</p>
                    <p className="text-[0.6rem] text-white/55 font-medium mt-0.5">Full-Stack &amp; AI Engineer</p>
                  </div>
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-[#FF5373] flex items-center justify-center shadow-lg shadow-[#FF5373]/30">
                    <Code2 className="h-4.5 w-4.5 text-white" />
                  </div>
                </div>
              </div>

              {/* Floating code card */}
              <motion.div
                animate={{ y: [-7, 7, -7] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-12 top-14 px-4 py-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/[0.12] shadow-xl"
              >
                <p className="text-[0.55rem] font-mono text-white/30 mb-1.5">// stack.ts</p>
                <p className="text-[0.63rem] font-mono text-white/80">
                  <span className="text-[#FF5373]">const</span> skills = [
                </p>
                <p className="text-[0.63rem] font-mono text-[#17E7FF] pl-3">&quot;React&quot;, &quot;Next.js&quot;,</p>
                <p className="text-[0.63rem] font-mono text-[#17E7FF] pl-3">&quot;Python&quot;, &quot;AI/ML&quot;</p>
                <p className="text-[0.63rem] font-mono text-white/80">]</p>
              </motion.div>

              {/* Floating stats card */}
              <motion.div
                animate={{ y: [7, -7, 7] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
                className="absolute -right-8 bottom-24 px-5 py-3.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/[0.12] shadow-xl"
              >
                <p className="text-[0.55rem] font-semibold text-white/40 uppercase tracking-wider mb-2">Experience</p>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-black text-[#FFC858] leading-none">3+</span>
                  <span className="text-[0.62rem] text-white/50 font-medium mb-0.5">years</span>
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
          className="pb-6 pt-3 border-t border-white/[0.06]"
        >
          <TechMarquee />
        </motion.div>
      </div>
    </section>
  );
}
