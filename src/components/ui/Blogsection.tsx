"use client";

import { motion } from "framer-motion";
import { BookOpen, PenLine, Bell } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";

export function BlogSection() {
  return (
    <section
      id="blog"
      className="relative w-full section-divider bg-[#030308] py-24 md:py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.03),_transparent_70%)]" />

      <SectionReveal className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-6">

        {/* Header */}
        <div className="mb-16 md:mb-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-white/60 mb-6 backdrop-blur-md"
          >
            <BookOpen className="h-3 w-3 text-indigo-400" />
            Blog
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            What I&apos;ve been <span className="bg-gradient-to-r from-indigo-200 via-white to-indigo-200 bg-clip-text text-transparent">writing about.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-2xl text-base text-slate-400 md:text-lg leading-relaxed"
          >
            Notes on building things, lessons learned, and ideas worth sharing.
          </motion.p>
        </div>

        {/* Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl"
        >
          <div className="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/[0.08] bg-white/[0.02] p-10 md:p-14 text-center backdrop-blur-sm">
            {/* Glow */}
            <div className="pointer-events-none absolute -inset-px rounded-[inherit] border border-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:border-indigo-500/20" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-purple-500/[0.04] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] shadow-inner"
            >
              <PenLine className="h-7 w-7 text-indigo-400/80" />
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-semibold text-white mb-3"
            >
              Coming Soon
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-sm md:text-base text-slate-400 leading-relaxed max-w-md mx-auto mb-8"
            >
              I&apos;m working on articles about full-stack architecture, AI workflows, and developer productivity. Stay tuned.
            </motion.p>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-amber-300"
            >
              <Bell className="h-3.5 w-3.5" />
              In Progress
            </motion.div>
          </div>
        </motion.div>

      </SectionReveal>
    </section>
  );
}

