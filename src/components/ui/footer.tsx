"use client";

import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { name: "Home",         href: "/"             },
  { name: "Projects",     href: "/projects"     },
  { name: "Certificates", href: "/certificates" },
  { name: "Contact",      href: "/contact"      },
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
  const pathname = usePathname();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Home is the cosmos hero only — its scroll ends in the EXPLORE beat. Hiding the footer
  // there keeps that the true end of the page. The admin panel ships its own chrome, so skip it too.
  if (pathname === "/" || pathname.startsWith("/admin")) return null;

  return (
      <footer className="theme-brut relative w-full border-t-2 border-[var(--ink)] bg-[var(--paper)]">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 pt-14 pb-8">
          <div className="grid gap-10 border-b-2 border-[var(--ink)] pb-10 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_auto] lg:gap-12">
            {/* Brand */}
            <AnimatedContainer delay={0.05} className="space-y-4">
              <button onClick={scrollToTop} className="group flex items-center gap-2.5 text-left">
                <Image src="/brand/mark.png" alt="Bibek Pathak" width={219} height={326} className="h-7 w-auto" />
                <span className="brut-h text-base tracking-tight text-[var(--ink)]">BIBEK.TECH</span>
              </button>
              <p className="max-w-[220px] text-[0.82rem] leading-relaxed text-[var(--ink-2)]">
                Full-stack engineer &amp; AI developer building clean, performant web experiences.
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
                      className="flex h-9 w-9 items-center justify-center rounded-[4px] border-2 border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]"
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </AnimatedContainer>

            {/* Navigation */}
            <AnimatedContainer delay={0.12} className="space-y-4">
              <h4 className="brut-kicker text-[0.62rem]">Navigation</h4>
              <nav className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex w-fit text-[0.85rem] font-medium text-[var(--ink-2)] transition-colors duration-200 hover:text-[var(--accent)]"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </AnimatedContainer>

            {/* Stack */}
            <AnimatedContainer delay={0.2} className="space-y-4">
              <h4 className="brut-kicker text-[0.62rem]">Stack</h4>
              <div className="flex flex-col gap-2">
                {["React · Next.js", "Python · FastAPI", "TypeScript", "PostgreSQL · MongoDB", "Docker · Git"].map((item) => (
                  <span key={item} className="text-[0.85rem] text-[var(--ink-2)]">{item}</span>
                ))}
              </div>
            </AnimatedContainer>

            {/* Back to top */}
            <AnimatedContainer delay={0.28} className="flex flex-col items-start justify-between gap-6 lg:items-end">
              <button onClick={scrollToTop} className="brut-btn-ghost">
                Back to top
                <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </motion.span>
              </button>
            </AnimatedContainer>
          </div>

          <AnimatedContainer delay={0.32}>
            <div className="flex flex-col items-center justify-between gap-2 pt-6 sm:flex-row">
              <p className="brut-mono text-[0.72rem] text-[var(--ink-3)]">
                © {new Date().getFullYear()} Bibek Pathak. All rights reserved.
              </p>
              <p className="brut-mono text-[0.72rem] text-[var(--ink-3)]">
                Built with Next.js · Tailwind · Framer Motion
              </p>
            </div>
          </AnimatedContainer>
        </div>
      </footer>
  );
}
