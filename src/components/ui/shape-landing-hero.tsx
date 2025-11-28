"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type ElegantShapeProps = {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
};

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -120,
        rotate: rotate - 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate,
      }}
      transition={{
        duration: 1.8,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.0 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border border-white/10",
            "shadow-[0_16px_40px_rgba(0,0,0,0.5)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.18),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

type HeroGeometricProps = {
  badge?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
};

function HeroGeometric({ badge = "Bibek ·Full-stack · Data / AI ", title, subtitle, }: HeroGeometricProps) {
  const [showFullQuote, setShowFullQuote] = useState(false);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        delay: 0.4 + i * 0.18,
        ease: [0.25, 0.4, 0.25, 1] as any,
      },
    }),
  };

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050509]">
      {/* subtle background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(244,114,182,0.12),_transparent_60%)]" />

      {/* geometric shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.25}
          width={520}
          height={120}
          rotate={10}
          gradient="from-indigo-500/[0.14]"
          className="left-[-12%] md:left-[-8%] top-[18%] md:top-[22%]"
        />
        <ElegantShape
          delay={0.45}
          width={460}
          height={110}
          rotate={-14}
          gradient="from-rose-500/[0.14]"
          className="right-[-10%] md:right-[-4%] top-[65%] md:top-[70%]"
        />
        <ElegantShape
          delay={0.4}
          width={280}
          height={72}
          rotate={-6}
          gradient="from-violet-500/[0.14]"
          className="left-[4%] md:left-[10%] bottom-[6%] md:bottom-[12%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={56}
          rotate={18}
          gradient="from-amber-500/[0.14]"
          className="right-[16%] md:right-[20%] top-[12%] md:top-[16%]"
        />
      </div>

      {/* content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* badge */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 backdrop-blur-sm md:mb-10"
          >
            <Circle className="h-2 w-2 fill-rose-500/80 text-rose-500" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
              {badge}
            </span>
          </motion.div>

          {/* main quote */}
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl md:mb-5 md:text-6xl">
              <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                {title ?? (
                  <>
                    A jack of all trades is a master of none,
                  </>
                )}
              </span>
              <br />
              <AnimatePresence mode="wait">
                {showFullQuote && (
                  <motion.span
                    key="full-quote"
                    initial={{
                      opacity: 0,
                      y: 14,
                      filter: "blur(10px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                      filter: "blur(6px)",
                    }}
                    transition={{
                      duration: 0.9,
                      ease: [0.16, 0.84, 0.44, 1],
                    }}
                    className="inline-block bg-gradient-to-r from-indigo-200 via-white/90 to-rose-200 bg-clip-text text-transparent"
                  >
                    but oftentimes better than a master of one.
                  </motion.span>
                )}
              </AnimatePresence>
            </h1>
          </motion.div>

          {/* See full quote button with fade-out */}
          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {!showFullQuote && (
                <motion.button
                  key="see-full-quote"
                  onClick={() => setShowFullQuote(true)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{
                    duration: 0.45,
                    ease: [0.25, 0.4, 0.25, 1],
                  }}
                  className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-white/55 underline-offset-4 hover:text-white/80 hover:underline"
                >
                  See full quote
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* subtitle */}
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="mx-auto mb-8 max-w-xl px-2 text-sm leading-relaxed text-white/50 sm:text-base md:mb-10 md:text-lg">
              {subtitle ?? (
                "I blend data, design, and engineering not just mastering one thing, but combining many to build thoughtful digital experiences."
              )}
            </p>
          </motion.div>
{/* CTAs */}
<motion.div
  custom={4}
  variants={fadeUpVariants}
  initial="hidden"
  animate="visible"
  className="flex flex-wrap items-center justify-center gap-3"
>
  {/* View Projects → scroll to #projects */}
  <a
    href="#projects"
    className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/[0.04] px-5 py-2 text-sm font-medium text-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.65)] backdrop-blur-md transition hover:border-white/35 hover:bg-white/[0.06]"
  >
    View Projects
  </a>

  {/* Download Resume → download PDF from /public */}
  <a
    href="/Bibek_Pathak_Resume.png"
    download
    className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/[0.04] px-5 py-2 text-sm font-medium text-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.65)] backdrop-blur-md transition hover:border-white/35 hover:bg-white/[0.06]"
  >
    Download Resume
  </a>
</motion.div>

        </div>
      </div>

      {/* soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050509] via-transparent to-[#050509]/80" />
    </section>
  );
}

export { HeroGeometric };
