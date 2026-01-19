"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LayoutGrid, FileText, Code2, Database, Terminal, Cpu, Globe, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";

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

// --- MARQUEE COMPONENT ---
function TechMarquee() {
  return (
    <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex gap-3 pr-3"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 40,
            ease: "linear",
          },
        }}
        whileHover={{ animationPlayState: "paused" }} 
      >
        {/* Doubled list for seamless loop */}
        {[...TECH_STACK, ...TECH_STACK].map((tech, index) => {
          const Icon = tech.icon;
          return (
            <div
              key={`${tech.name}-${index}`}
              className="group relative flex shrink-0 items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.03] px-3 py-1.5 transition-colors hover:bg-white/[0.08] hover:border-white/10"
            >
              <Icon className="h-3 w-3 text-indigo-400/70 transition-colors group-hover:text-indigo-400" />
              <span className="text-xs font-medium text-slate-300">{tech.name}</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

function AnimatedHeroHeadline() {
  return (
    <div className="relative z-10">
      <div className="pointer-events-none absolute -inset-x-10 -top-20 h-32 bg-indigo-500/10 blur-3xl" />
      <motion.h1
        initial="hidden"
        animate="visible"
        className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1]"
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

// --- MAIN HERO COMPONENT ---
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

      {/* RESPONSIVE PADDING: pt-24 for mobile, pt-32 for desktop */}
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-12 pt-24 md:px-6 md:pb-20 md:pt-32">
        
        {/* RESPONSIVE GRID: grid-cols-1 (stack) for mobile, 2 columns for lg screens */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          
          {/* LEFT COLUMN (Photo) */}
          <motion.div
            variants={fade}
            initial="hidden"
            animate="visible"
            custom={0}
            className="relative flex flex-col items-center justify-center lg:items-end"
          >
            {/* Responsive sizing: h-56/w-56 on mobile, h-72/w-72 on larger screens */}
            <div className="group relative h-56 w-56 sm:h-72 sm:w-72">
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
            
            <div className="relative -mt-8 max-w-[260px] sm:-mt-10 sm:max-w-xs text-center z-20">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:px-5 sm:py-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                <p className="text-xs sm:text-sm italic leading-relaxed text-indigo-100/90">
                  "A jack of all trades is a master of none,{" "}
                  <span className="text-white italic font-semibold">but oftentimes better than a master of one."</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN (Content + Marquee) */}
          <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.div
              variants={fade}
              initial="hidden"
              animate="visible"
              custom={1}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.6rem] sm:text-[0.7rem] uppercase tracking-[0.28em] text-white/60"
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
              className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg text-slate-400 leading-relaxed"
            >
              I blend clean UX, solid engineering, and practical problem-solving to ship modern web
              experiences. From frontend systems to data workflows and cloud-ready builds.
            </motion.p>

            <motion.div
              variants={fade}
              initial="hidden"
              animate="visible"
              custom={4}
              className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-4 lg:justify-start"
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

            {/* --- TECH STACK (MARQUEE) --- */}
            {/* Added max-w-[90vw] to ensure it doesn't break mobile layout */}
            <motion.div
              variants={fade}
              initial="hidden"
              animate="visible"
              custom={5}
              className="mt-10 sm:mt-12 w-full max-w-[90vw] sm:max-w-2xl" 
            >
              <div className="mb-4 text-center text-[10px] sm:text-xs font-medium uppercase tracking-widest text-slate-500 lg:text-left">
                Tech Stack Focus
              </div>
              
              <TechMarquee />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}