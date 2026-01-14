"use client";

import { motion ,Variants } from "framer-motion";
import { Globe } from "@/components/ui/globe";
import { ArrowUpRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export function BlogSection() {
  return (
    <section
      id="blog"
      className="relative w-full border-t border-white/[0.08] bg-[#030308] py-24 md:py-32 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(129,140,248,0.03),_transparent_50%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-6">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
            Writing
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Signal <span className="text-indigo-100">Incoming.</span>
          </h2>
        </div>

        {/* The Cosmic Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp as Variants}
          className="relative flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.01] p-8 text-center backdrop-blur-sm md:p-16"
        >
          {/* Globe Container */}
          <div className="relative mb-8 h-64 w-64 md:h-80 md:w-80">
             <Globe className="absolute inset-0" />
             {/* Radial overlay to blend globe into background */}
             <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,_#030308_70%)]" />
          </div>

          <h3 className="mb-4 text-2xl font-medium text-white md:text-3xl">
            Transmission Loading...
          </h3>
          
          <p className="max-w-md text-base text-slate-400 leading-relaxed mb-8">
            I haven't started publishing articles just yet. 
            The satellite is still calibrating. Check back soon for thoughts on 
            Code, AI, and Engineering.
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-indigo-500/30"
          >
            Return to Base
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}