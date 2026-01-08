"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.08 * i },
  }),
};

export function NewHero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-white/[0.06] bg-gradient-to-b from-[#050509] to-[#030308]"
    >
      {/* ambient background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(129,140,248,0.22),transparent_60%)] blur-2xl" />
        <div className="absolute -bottom-40 left-[-140px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.14),transparent_62%)] blur-3xl" />
        <div className="absolute -bottom-44 right-[-180px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.12),transparent_62%)] blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-24 md:px-6 md:pb-24 md:pt-28">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
          {/* LEFT: framed image card */}
          <motion.div
            variants={fade}
            initial="hidden"
            animate="visible"
            custom={0}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.10] bg-white/[0.03] shadow-[0_25px_90px_rgba(0,0,0,0.75)] backdrop-blur-md">
              {/* gradient border frame vibe */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
              <div className="pointer-events-none absolute -inset-[2px] rounded-3xl bg-[linear-gradient(135deg,_rgba(129,140,248,0.55),_rgba(244,114,182,0.35),_rgba(34,211,238,0.25))] opacity-40 blur-xl" />

              {/* “tech frame” lines like your reference but subtle */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-5 top-5 h-[2px] w-20 bg-white/20" />
                <div className="absolute left-5 top-5 h-20 w-[2px] bg-white/20" />

                <div className="absolute right-5 top-5 h-[2px] w-28 bg-white/20" />
                <div className="absolute right-5 top-5 h-16 w-[2px] bg-white/20" />

                <div className="absolute bottom-5 left-5 h-[2px] w-28 bg-white/15" />
                <div className="absolute bottom-5 left-5 h-16 w-[2px] bg-white/15" />
              </div>

              <div className="relative aspect-[16/10] w-full bg-white/[0.02]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),transparent_60%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.12),transparent_60%)]" />
                <Image
    src="/hero-me.png"
    alt="Bibek Pathak"
    fill
    priority
    className="object-contain p-6 md:p-8"
  />
                {/* overlays to match your theme */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),transparent_60%)]" />
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/20" />
                
              </div>

              {/* bottom caption strip */}
              <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] px-5 py-4">
                <div className="flex flex-col">
                  <span className="text-[0.7rem] uppercase tracking-[0.28em] text-white/45">
                  
                    Snapshot
                  </span>
                  <span className="text-sm font-medium text-white/85">
                    CS Student · Full-stack & Data / AI
                  </span>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-white/60">
                  Open to internships
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: headline + copy + CTAs */}
          <div className="relative">
            <motion.div
              variants={fade}
              initial="hidden"
              animate="visible"
              custom={1}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-white/60"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              Bibek · Full-stack · Data / AI
            </motion.div>

            <motion.h1
              variants={fade}
              initial="hidden"
              animate="visible"
              custom={2}
              className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              Building across design, data & full-stack engineering.
            </motion.h1>

            <motion.p
              variants={fade}
              initial="hidden"
              animate="visible"
              custom={3}
              className="mt-4 max-w-xl text-sm text-white/55 sm:text-base"
            >
              I blend clean UX, solid engineering, and practical problem-solving
              to ship modern web experiences. From frontend systems to data
              workflows and cloud-ready builds.
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
                  "shadow-[0_18px_45px_rgba(0,0,0,0.6)]",
                  "hover:bg-white/[0.07]"
                )}
              >
                View Projects <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="/resume.pdf"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full border border-white/12",
                  "bg-white/[0.02] px-5 py-2.5 text-sm text-white/75",
                  "hover:bg-white/[0.05] hover:text-white"
                )}
              >
                Download Resume <Download className="h-4 w-4" />
              </a>
            </motion.div>

            {/* tiny footer note */}
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
