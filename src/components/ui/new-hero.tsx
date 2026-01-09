"use client";

import Image from "next/image";
import { motion, MotionConfig } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] },
  }),
};

const lineVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      delay: 0.2 + i * 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const wordWrap = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.28 } },
};

const word = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

// headline gradient like your other sections (cool steel -> indigo)
const heroGradientText =
  "bg-gradient-to-r from-[#ffffff] via-[#cfd6ff] to-[#eef2ff] bg-clip-text text-transparent";

// stronger accent gradient (no pink)
const strongGradientText =
  "bg-gradient-to-r from-slate-100 via-indigo-200 to-cyan-200 bg-clip-text font-semibold text-transparent";

function AnimatedHeroHeadline() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-x-10 -top-10 h-24 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.16),transparent_70%)] blur-2xl" />

      <motion.h1
        initial="hidden"
        animate="visible"
        className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
      >
        <motion.span custom={0} variants={lineVariants} className="block">
          <motion.span variants={wordWrap} className={cn("inline-block", heroGradientText)}>
            {"Building across design, data &".split(" ").map((w, i) => (
              <motion.span key={`${w}-${i}`} variants={word} className="inline-block">
                {w}&nbsp;
              </motion.span>
            ))}
          </motion.span>
        </motion.span>

        <motion.span custom={1} variants={lineVariants} className="block">
          <motion.span variants={wordWrap} className={cn("inline-block", heroGradientText)}>
            {"full-stack engineering.".split(" ").map((w, i) => (
              <motion.span key={`${w}-${i}`} variants={word} className="inline-block">
                {w}&nbsp;
              </motion.span>
            ))}
          </motion.span>
        </motion.span>
      </motion.h1>
    </div>
  );
}

export function NewHero() {
  return (
    <MotionConfig reducedMotion="never">
      <section
        id="home"
        className="relative overflow-hidden border-b border-white/[0.06] bg-gradient-to-b from-[#050509] to-[#030308]"
      >
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(129,140,248,0.20),transparent_60%)] blur-2xl" />
          <div className="absolute -bottom-40 left-[-140px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,_rgba(244,114,182,0.10),transparent_62%)] blur-3xl" />
          <div className="absolute -bottom-44 right-[-180px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.10),transparent_62%)] blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-24 md:px-6 md:pb-24 md:pt-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1fr]">
            {/* LEFT */}
            <motion.div
              variants={fade}
              initial="hidden"
              animate="visible"
              custom={0}
              className="relative flex flex-col items-center"
            >
              {/* Portrait */}
              <div className="group relative h-72 w-72">
                {/* outer aura (hover) */}
                <div className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.22),transparent_60%)] blur-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                {/* ring glow (hover) */}
                <div className="pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.18),transparent_62%)] blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* gradient ring */}
                <div className="absolute inset-0 rounded-full p-[3px] transition-transform duration-500 group-hover:scale-[1.02]">
                  <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_210deg,_rgba(99,102,241,0.70),_rgba(59,130,246,0.35),_rgba(34,211,238,0.55),_rgba(99,102,241,0.70))]" />
                  <div className="absolute inset-[3px] rounded-full bg-[#050509]" />
                </div>

                {/* image */}
                <div className="absolute inset-[10px] overflow-hidden rounded-full bg-white/[0.04] shadow-[0_25px_80px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-[1.01]">
                  <Image
                    src="/hero-me.png"
                    alt="Bibek Pathak"
                    fill
                    priority
                    className="object-cover object-[50%_22%]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),transparent_55%)]" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 to-black/45" />
                </div>
              </div>

              {/* Text strip */}
              <div className="mt-8 w-full max-w-md rounded-2xl border border-white/12 bg-gradient-to-r from-indigo-500/14 via-violet-500/10 to-cyan-400/10 px-6 py-4 backdrop-blur-md">
                <p className="text-sm text-white/85">
                  Building modern web experiences with{" "}
                  <span className={strongGradientText}>clean UX + solid engineering</span>.
                </p>
                <p className="mt-1 text-xs text-white/55">
                  React · Next.js · TypeScript · Tailwind
                </p>
              </div>
            </motion.div>

            {/* RIGHT */}
            <div className="relative">
              <motion.div
                variants={fade}
                initial="hidden"
                animate="visible"
                custom={1}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-white/60"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                Bibek · Full-stack · Data / AI
              </motion.div>

              <AnimatedHeroHeadline />

              <motion.p
                variants={fade}
                initial="hidden"
                animate="visible"
                custom={3}
                className="mt-4 max-w-xl text-sm text-white/55 sm:text-base"
              >
                I blend clean UX, solid engineering, and practical problem-solving to ship modern web
                experiences. From frontend systems to data workflows and cloud-ready builds.
              </motion.p>

              <motion.div
                variants={fade}
                initial="hidden"
                animate="visible"
                custom={4}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <a
                  href="#projects"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full border border-white/15",
                    "bg-white/[0.04] px-5 py-2.5 text-sm text-white/90",
                    "shadow-[0_18px_45px_rgba(0,0,0,0.6)] hover:bg-white/[0.07]"
                  )}
                >
                  View Projects <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="/resume.pdf"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full border border-white/12",
                    "bg-white/[0.02] px-5 py-2.5 text-sm text-white/75 hover:bg-white/[0.05]"
                  )}
                >
                  Download Resume <Download className="h-4 w-4" />
                </a>
              </motion.div>

              <motion.div
                variants={fade}
                initial="hidden"
                animate="visible"
                custom={5}
                className="mt-10 flex items-center gap-3 text-xs text-white/45"
              >
                <span className="h-1 w-1 rounded-full bg-white/30" />
                Focus: React · Next.js · TypeScript · Tailwind · Data · Cloud
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
