"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LayoutGrid, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.1 * i, ease },
  }),
};

const lineVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, delay: 0.2 + i * 0.15, ease },
  }),
};

const wordWrap = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.3 } },
};

const word = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

function AnimatedHeroHeadline() {
  return (
    <div className="relative z-10">
      <div className="pointer-events-none absolute -inset-x-10 -top-20 h-32 bg-indigo-500/10 blur-3xl" />

      <motion.h1
        initial="hidden"
        animate="visible"
        className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1]"
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

        <motion.span custom={1} variants={lineVariants} className="block text-indigo-100">
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
        "relative overflow-hidden border-b border-white/[0.08]",
        "bg-[#030308]"
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.08),transparent_60%)]" />
        <div className="absolute -left-56 top-20 h-[720px] w-[720px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -right-64 top-16 h-[760px] w-[760px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030308]/60 to-[#030308]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-28 md:px-6 md:pb-32 md:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          
          {/* LEFT COLUMN */}
          <motion.div
            variants={fade}
            initial="hidden"
            animate="visible"
            custom={0}
            className="relative flex flex-col items-center justify-center lg:items-end"
          >
            <div className="group relative h-64 w-64 sm:h-72 sm:w-72">
              <div className="pointer-events-none absolute -inset-6 rounded-full bg-indigo-500/20 blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 5 }}
                className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500"
              >
                <div className="h-full w-full rounded-full bg-[#050509] p-1" />
              </motion.div>

              <div className="absolute inset-[6px] overflow-hidden rounded-full border border-white/5 bg-white/[0.02]">
                <Image
                  src="/hero-me.png"
                  alt="Bibek Pathak"
                  fill
                  priority
                  className="object-cover object-[50%_20%] grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
            </div>

            <div className="relative -mt-10 max-w-[280px] sm:max-w-xs text-center z-20">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                <p className="text-sm italic leading-relaxed text-indigo-100/90">
                  "A jack of all trades is a master of none,{" "}
                  <span className="text-white not-italic font-semibold">but oftentimes better than a master of one."</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN */}
          <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
            
            {/* RESTORED PILL COMPONENT EXACTLY AS REQUESTED */}
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
              className="mt-6 max-w-xl text-lg text-slate-400 leading-relaxed"
            >
              I blend clean UX, solid engineering, and practical problem-solving to ship modern web
              experiences. From frontend systems to data workflows and cloud-ready builds.
            </motion.p>

            <motion.div
              variants={fade}
              initial="hidden"
              animate="visible"
              custom={4}
              className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start"
            >
              <a
                href="#projects"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:ring-2 hover:ring-indigo-500/50 hover:ring-offset-2 hover:ring-offset-slate-950"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View Projects
                  <LayoutGrid className="h-4 w-4 transition-transform group-hover:rotate-12" />
                </span>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-100 transition-opacity group-hover:opacity-90" />
              </a>

              <a
                href="/resumebibekjan26.pdf"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-8 py-3 text-sm font-medium text-white transition-all hover:bg-white/[0.08] hover:border-white/20"
              >
                Download Resume
                <FileText className="h-4 w-4 text-white/70 transition-transform group-hover:-translate-y-0.5" />
              </a>
            </motion.div>

            <motion.div
              variants={fade}
              initial="hidden"
              animate="visible"
              custom={5}
              className="mt-12 flex flex-col items-center gap-4 lg:items-start"
            >
              <div className="text-xs font-medium uppercase tracking-widest text-slate-500">
                Tech Stack Focus
              </div>
              <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                {[
                  "React", "TypeScript", "Python", "Tailwind", "Node.js", "SQL", "MongoDB"
                ].map((tech) => (
                  <span 
                    key={tech} 
                    className="inline-flex items-center rounded-md border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300 transition-colors hover:bg-white/[0.08]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}