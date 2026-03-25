"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Github, Linkedin, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Blinking cursor ────────────────────────────────────────────────────────────
function BlinkingCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "steps(1)" }}
      className="ml-[2px] inline-block w-[2px] h-[0.72em] bg-emerald-400 align-middle"
    />
  );
}

// ── Text scramble link ─────────────────────────────────────────────────────────
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%";

function ScrambleLink({
  text,
  href,
  index,
  isActive,
  onClick,
}: {
  text: string;
  href: string;
  index: number;
  isActive: boolean;
  onClick?: () => void;
}) {
  const upper = text.toUpperCase();
  const [display, setDisplay] = useState(upper);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = useCallback(() => {
    let iter = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDisplay(
        upper
          .split("")
          .map((char, i) => {
            if (i < iter) return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );
      iter += 0.7;
      if (iter > upper.length) {
        clearInterval(timerRef.current!);
        setDisplay(upper);
      }
    }, 35);
  }, [upper]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={scramble}
      className={cn(
        "group relative flex items-center gap-1.5 px-3 py-2 transition-colors duration-300 select-none",
        isActive ? "text-white" : "text-white/35 hover:text-white/70"
      )}
    >
      {/* Index number */}
      <span className={cn(
        "font-mono text-[0.48rem] tabular-nums leading-none transition-colors duration-300",
        isActive ? "text-emerald-400" : "text-white/15 group-hover:text-emerald-400/50"
      )}>
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Left bracket */}
      <motion.span
        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 5 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="font-mono text-[0.75rem] text-emerald-400 leading-none"
      >
        [
      </motion.span>

      {/* Label */}
      <span className="font-mono text-[0.64rem] tracking-[0.22em] leading-none">
        {display}
      </span>

      {/* Right bracket */}
      <motion.span
        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -5 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="font-mono text-[0.75rem] text-emerald-400 leading-none"
      >
        ]
      </motion.span>

      {/* Hover underline (inactive only) */}
      {!isActive && (
        <span className="absolute bottom-1 left-7 right-3 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 bg-gradient-to-r from-emerald-500/40 to-cyan-500/40" />
      )}

      {/* Active top beam */}
      {isActive && (
        <motion.span
          layoutId="nav-beam"
          className="absolute -top-px left-2 right-2 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}
    </Link>
  );
}

// ── Main Navbar ────────────────────────────────────────────────────────────────
export function MainNavbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const sections = ["home", "projects", "certificates", "contact", "blog"];

    // Middle-of-viewport detection — reliable for tall sections like projects
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id || "home");
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "-45% 0px -45% 0px",
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (window.scrollY < 80) setActiveSection("home");
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const links = [
    { name: "Projects",     href: "#projects",     id: "projects"     },
    { name: "Certificates", href: "#certificates", id: "certificates" },
    { name: "Contact",      href: "#contact",      id: "contact"      },
    { name: "Blog",         href: "#blog",         id: "blog"         },
  ];

  const handleLinkClick = (href: string) => {
    setMobileOpen(false);
    if (href === "/") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isActive = (link: { id: string }) => activeSection === link.id;

  return (
    <header className="fixed top-0 z-50 w-full">

      {/* ── Scroll progress bar ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[1.5px] origin-left z-10"
        style={{ scaleX, background: "linear-gradient(90deg, #10b981, #22d3ee, #10b981)" }}
      />

      <div className={cn(
        "mx-auto max-w-6xl px-4 sm:px-8 transition-all duration-500",
        scrolled ? "pt-2" : "pt-5"
      )}>
        <nav className={cn(
          "relative flex items-center justify-between rounded-2xl border px-5 py-3 transition-all duration-500",
          scrolled
            ? "border-white/[0.07] bg-[#020A06]/90 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.04)]"
            : "border-white/[0.03] bg-transparent"
        )}>

          {/* Inner top accent line */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent" />

          {/* ── Brand ── */}
          <button
            onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setMobileOpen(false); }}
            className="group flex items-center gap-2.5 shrink-0"
          >
            <span className="relative flex h-[7px] w-[7px] shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[0.78rem] font-bold tracking-tight text-white/85 group-hover:text-white transition-colors duration-200 flex items-center">
              BIBEK.DEV
              <BlinkingCursor />
            </span>
          </button>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center">
            {links.map((link, i) => (
              <ScrambleLink
                key={link.href}
                text={link.name}
                href={link.href}
                index={i}
                isActive={isActive(link)}
                onClick={() => handleLinkClick(link.href)}
              />
            ))}
          </div>

          {/* ── Socials + mobile toggle ── */}
          <div className="flex items-center gap-1">
            <div className="hidden md:flex items-center gap-0.5 pl-3 ml-1 border-l border-white/[0.06]">
              <Link
                href="https://github.com/RavangDai"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
              >
                <Github className="h-[14px] w-[14px]" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/bibek-pathak-10398a301/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
              >
                <Linkedin className="h-[14px] w-[14px]" />
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-white/50 hover:text-white hover:border-emerald-500/30 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div
                    key="x"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="bars"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-[4px] items-end"
                  >
                    <span className="h-px w-4 bg-current block" />
                    <span className="h-px w-2.5 bg-current block" />
                    <span className="h-px w-4 bg-current block" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* ── Mobile dropdown ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden mt-2 rounded-2xl border border-white/[0.07] bg-[#020A06]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden"
            >
              <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent" />

              <div className="px-5 pt-3 pb-1">
                <span className="font-mono text-[0.55rem] text-emerald-400/40 tracking-[0.3em] uppercase">
                  // navigate
                </span>
              </div>

              <div className="flex flex-col p-3 gap-0.5">
                {links.map((link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                      isActive(link)
                        ? "bg-emerald-500/[0.07] border border-emerald-500/[0.15] text-white"
                        : "text-white/40 hover:text-white/75 hover:bg-white/[0.03] border border-transparent"
                    )}
                  >
                    <span className="font-mono text-[0.52rem] text-emerald-400/50 tabular-nums w-4 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={cn(
                      "font-mono text-[0.72rem] tracking-[0.22em] uppercase",
                      isActive(link) ? "text-emerald-300" : ""
                    )}>
                      {isActive(link) ? `[ ${link.name.toUpperCase()} ]` : link.name.toUpperCase()}
                    </span>
                    {isActive(link) && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "steps(1)" }}
                        className="ml-auto font-mono text-emerald-400 text-xs"
                      >
                        ▸
                      </motion.span>
                    )}
                  </Link>
                ))}

                <div className="flex items-center gap-1 px-3 pt-3 mt-1 border-t border-white/[0.05]">
                  <Link
                    href="https://github.com/RavangDai"
                    target="_blank"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
                  >
                    <Github className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/bibek-pathak-10398a301/"
                    target="_blank"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
