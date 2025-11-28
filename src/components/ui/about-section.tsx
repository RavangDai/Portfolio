"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TechIcons } from "@/components/ui/tech-icons";

// at the top you already have: import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      // no ease → use default easing
    },
  },
};

const item = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      // no ease here either
    },
  },
});

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-20 md:px-6 md:py-28"
    >
      {/* subtle top gradient line */}
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center"
      >
        {/* Left: copy + tech stack */}
        <motion.div variants={item(0)}>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-white/55">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
            About
          </div>

          <h2 className="mt-6 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
            Building across{" "}
            <span className="bg-gradient-to-r from-indigo-200 via-white to-rose-200 bg-clip-text text-transparent">
              design, data & full-stack engineering.
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            I&apos;m Bibek, a developer who loves turning abstract ideas into
            clear, interactive experiences. From algorithms and data
            visualizations to focused productivity tools, I enjoy working across
            the stack where UX, performance, and detail all matter.
          </p>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
            Right now I&apos;m sharpening my skills in{" "}
            <span className="text-white/80">
              TypeScript, React, Next.js, full-stack workflows, data/AI, and
              modern interfaces
            </span>
            , while building a portfolio of thoughtful, real-world projects.
          </p>

          {/* Tech stack icons */}
          <div className="mt-8">
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-white/45 mb-4">
              Tech Stack
            </p>
            <TechIcons />
          </div>
        </motion.div>

        {/* Right: glass card with stats */}
        <motion.div
          variants={item(0.15)}
          className="relative"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* glow behind card */}
          <div className="pointer-events-none absolute -inset-1 rounded-[28px] bg-gradient-to-br from-indigo-500/25 via-transparent to-rose-500/25 blur-2xl" />

          <div
            className={cn(
              "relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.02] px-6 py-5 md:px-7 md:py-6",
              "backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.75)]"
            )}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/45">
                    Snapshot
                  </p>
                  <p className="mt-1 text-sm text-white/80">
                    CS Student · Full-stack & Data / AI
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
                  Open to internships
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs sm:text-sm">
                <Stat
                  label="Projects"
                  value="3+"
                  hint="Shipped & deployed apps"
                />
                <Stat
                  label="Focus"
                  value="Full-stack · Data"
                  hint="Practical problem solving"
                />
                <Stat
                  label="Stack"
                  value="TS · React"
                  hint="Modern web tooling"
                />
              </div>

              <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-white/55">
                <span className="text-white/70">
                  “Curiosity is my framework. Execution is my discipline.”
                </span>
                
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

type StatProps = {
  label: string;
  value: string;
  hint: string;
};

function Stat({ label, value, hint }: StatProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.18 }}
      className="flex flex-col items-center gap-0.5 rounded-2xl border border-white/8 bg-white/[0.02] px-3 py-2"
    >
      <span className="text-xs uppercase tracking-[0.22em] text-white/40">
        {label}
      </span>
      <span className="text-sm font-semibold text-white/90">{value}</span>
      <span className="text-[0.67rem] text-white/45">{hint}</span>
    </motion.div>
  );
}
