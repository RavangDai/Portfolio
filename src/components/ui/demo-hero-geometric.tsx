"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 pt-24 pb-16 md:px-6 md:pt-28">
      <div className="grid items-center gap-10 md:grid-cols-[1.15fr_0.85fr]">
        {/* LEFT: Text */}
        <div className="text-center md:text-left">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-white/60 md:mx-0">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            Bibek · Full-stack · Data / AI
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            A jack of all trades is a master of none,
          </h1>

          <p className="mt-4 max-w-2xl text-sm text-white/60 sm:text-base md:max-w-xl">
            I blend data, design, and engineering not just mastering one thing,
            but combining many to build thoughtful digital experiences.
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <a
              href="#projects"
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white hover:bg-white/[0.06]"
            >
              View Projects
            </a>
            <a
              href="/resume.pdf"
              className="rounded-full border border-white/10 bg-white/[0.02] px-5 py-2 text-sm text-white/80 hover:text-white hover:bg-white/[0.04]"
            >
              Download Resume
            </a>
          </div>
        </div>

        {/* RIGHT: Photo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-sm md:mx-0 md:justify-self-end"
        >
          <div className="relative">
            {/* gradient glow behind */}
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.35),transparent_60%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.25),transparent_60%)] blur-2xl" />

            {/* glass ring */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.8)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src="/bibek.jpg"   // <-- your image path in /public
                  alt="Bibek Pathak"
                  fill
                  priority
                  className="object-cover"
                />
                {/* subtle overlay to match theme */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
