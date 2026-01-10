"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.08 * i, ease },
  }),
};

const lineVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, delay: 0.18 + i * 0.12, ease },
  }),
};

const wordWrap = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.25 } },
};

const word = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

const strongGradientText =
  "bg-gradient-to-r from-slate-100 via-indigo-200 to-cyan-100 bg-clip-text font-semibold text-transparent";

function AnimatedHeroHeadline() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-x-10 -top-10 h-24 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.16),transparent_70%)] blur-2xl" />

      <motion.h1
        initial="hidden"
        animate="visible"
        className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
      >
        <motion.span custom={0} variants={lineVariants} className="block">
          <motion.span variants={wordWrap} className="inline-block">
            {"Building across design, data &".split(" ").map((w, i) => (
              <motion.span key={`${w}-${i}`} variants={word} className="inline-block">
                {w}&nbsp;
              </motion.span>
            ))}
          </motion.span>
        </motion.span>

        <motion.span custom={1} variants={lineVariants} className="block">
          <motion.span variants={wordWrap} className="inline-block">
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
    <section
      id="home"
      className={cn(
        "relative overflow-hidden border-b border-white/[0.06]",
        "bg-gradient-to-b from-[#050509] to-[#030308]"
      )}
    >
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.14),transparent_55%)]" />
        <div className="absolute -left-56 top-20 h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.16),transparent_62%)] blur-3xl" />
        <div className="absolute -right-64 top-16 h-[760px] w-[760px] rounded-full bg-[radial-gradient(circle,_rgba(129,140,248,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-64 right-[-180px] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.10),transparent_62%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_45%,rgba(0,0,0,0.55)_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)",
          }}
        />
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
            <div className="group relative h-72 w-72">
              {/* ✅ single-line className (no \r\n) */}
              <div className="pointer-events-none absolute inset-[-18px] rounded-full bg-[radial-gradient(circle,_rgba(129,140,248,0.18),transparent_62%)] blur-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-95" />

              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 120 }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full p-[3px] bg-[conic-gradient(from_210deg,_rgba(99,102,241,0.80),_rgba(129,140,248,0.55),_rgba(34,211,238,0.55),_rgba(99,102,241,0.80))] shadow-[0_0_0_1px_rgba(255,255,255,0.10)]"
              >
                <div className="h-full w-full rounded-full bg-[#050509]" />
              </motion.div>

              <div className="absolute inset-[9px] overflow-hidden rounded-full bg-white/[0.04] shadow-[0_14px_55px_rgba(0,0,0,0.60)] transition-transform duration-700 group-hover:scale-[1.03]">
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

              <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/10 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
            </div>

            <div className="mt-8 w-full max-w-md rounded-2xl border border-white/12 bg-gradient-to-r from-indigo-500/14 via-violet-500/10 to-cyan-400/10 px-6 py-4 backdrop-blur-md">
              <p className="text-sm text-white/85">
                Building modern web experiences with{" "}
                <span className={strongGradientText}>clean UX + solid engineering</span>.
              </p>
              <p className="mt-1 text-xs text-white/55">React · Next.js · TypeScript · Tailwind</p>
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
  );
}
