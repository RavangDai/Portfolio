"use client";

import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { name: "Home",         href: "#home"         },
  { name: "Projects",     href: "#projects"     },
  { name: "Certificates", href: "#certificates" },
  { name: "Contact",      href: "#contact"      },
];

const SOCIALS = [
  { name: "GitHub",   href: "https://github.com/RavangDai",                          icon: FaGithub    },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/bibek-pathak-10398a301/",   icon: FaLinkedinIn },
];

/* ── Animated scroll-reveal container ── */
type AnimatedContainerProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>["className"];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: AnimatedContainerProps) {
  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -10, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative w-full overflow-hidden border-t border-white/[0.06]"
      style={{ background: "linear-gradient(to bottom, #080808, #050505)" }}>

      {/* Subtle top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-32 bg-white/[0.03] blur-3xl rounded-full" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-8 pt-14 pb-8">

        {/* Main grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_auto] lg:gap-12 pb-10 border-b border-white/[0.05]">

          {/* Brand */}
          <AnimatedContainer delay={0.05} className="space-y-4">
            <button onClick={scrollToTop} className="group text-left">
              <span className="text-[0.95rem] font-black tracking-tight text-white transition-colors duration-200 group-hover:text-white/70 font-display">
                BIBEK.DEV
              </span>
            </button>
            <p className="max-w-[220px] text-[0.8rem] leading-relaxed text-white/35">
              Full-stack engineer & AI developer building clean, performant web experiences.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className="btn-icon h-9 w-9"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </AnimatedContainer>

          {/* Navigation */}
          <AnimatedContainer delay={0.12} className="space-y-4">
            <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/30">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[0.82rem] text-white/40 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-flex w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </AnimatedContainer>

          {/* Stack */}
          <AnimatedContainer delay={0.2} className="space-y-4">
            <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/30">
              Stack
            </h4>
            <div className="flex flex-col gap-2">
              {["React · Next.js", "Python · FastAPI", "TypeScript", "PostgreSQL · MongoDB", "Docker · Git"].map((item) => (
                <span key={item} className="text-[0.82rem] text-white/35">{item}</span>
              ))}
            </div>
          </AnimatedContainer>

          {/* Back to top */}
          <AnimatedContainer delay={0.28} className="flex flex-col items-start lg:items-end justify-between gap-6">
            <motion.button
              onClick={scrollToTop}
              whileTap={{ scale: 0.97 }}
              className="btn-ghost !py-2.5 !px-5 !text-xs !font-medium group flex items-center gap-2"
            >
              Back to top
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </motion.span>
            </motion.button>
          </AnimatedContainer>
        </div>

        {/* Copyright */}
        <AnimatedContainer delay={0.32}>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[0.72rem] text-white/20">
              © {new Date().getFullYear()} Bibek Pathak. All rights reserved.
            </p>
            <p className="text-[0.72rem] text-white/15">
              Built with Next.js · Tailwind · Framer Motion
            </p>
          </div>
        </AnimatedContainer>
      </div>
    </footer>
  );
}
