"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%";

function ScrambleLink({
  text,
  href,
  isActive,
  onClick,
}: {
  text: string;
  href: string;
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
        upper.split("").map((char, i) => {
          if (i < iter) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }).join("")
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
        "group relative flex items-center px-4 py-2 text-[0.72rem] font-semibold tracking-[0.1em] uppercase transition-colors duration-300 select-none",
        isActive ? "text-white" : "text-white/55 hover:text-white"
      )}
    >
      {/* Active frosted pill */}
      {isActive && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 rounded-full"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderTopColor: "rgba(255,255,255,0.18)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}

      {/* Hover frosted capsule for inactive */}
      {!isActive && (
        <span
          className="absolute inset-0 rounded-full opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            background: "rgba(255,255,255,0.055)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderTopColor: "rgba(255,255,255,0.14)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
          }}
        />
      )}

      <span className="relative z-10">{display}</span>
    </Link>
  );
}

export function MainNavbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const sections = ["home", "projects", "certificates", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id || "home");
        });
      },
      { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (window.scrollY < 80) setActiveSection("home");
      setScrolled(window.scrollY > 30);
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
  ];

  const handleLinkClick = (href: string) => {
    setMobileOpen(false);
    if (href === "/") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isActive = (link: { id: string }) => activeSection === link.id;

  return (
    <header className="fixed top-0 z-50 w-full">

      {/* Scroll progress bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[1.5px] origin-left z-10"
        style={{ scaleX, background: "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.9), rgba(255,255,255,0.5), rgba(255,255,255,0.9), rgba(255,255,255,0.2))" }}
      />

      <div className={cn("mx-auto max-w-7xl px-4 sm:px-8 transition-all duration-500", scrolled ? "pt-2" : "pt-4")}>
        <nav className={cn(
          "relative flex items-center justify-between rounded-2xl border px-6 py-3 transition-all duration-500",
          scrolled
            ? "border-white/[0.10] border-t-white/[0.20] bg-black/75 backdrop-blur-[40px]"
            : "border-white/[0.08] border-t-white/[0.15] bg-white/[0.04] backdrop-blur-[32px]"
        )}
          style={{
            boxShadow: scrolled
              ? "inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 64px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)"
              : "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.4)"
          }}
        >
          {/* Inner top shimmer */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />

          {/* ── Brand ── */}
          <button
            onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setMobileOpen(false); }}
            className="group flex items-center gap-2.5 shrink-0"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <span className="text-[0.82rem] font-black tracking-tight text-white group-hover:text-white/70 transition-colors duration-200 font-display">
              BIBEK.DEV
            </span>
          </button>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <ScrambleLink
                key={link.href}
                text={link.name}
                href={link.href}
                isActive={isActive(link)}
                onClick={() => handleLinkClick(link.href)}
              />
            ))}
          </div>

          {/* ── Right: CTA ── */}
          <div className="flex items-center gap-2">
            <LiquidButton
              size="sm"
              className="hidden md:inline-flex rounded-full text-[0.72rem] font-bold tracking-wide"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Hire Me
            </LiquidButton>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.12] text-white/50 hover:text-white hover:border-white/25 transition-all duration-200"
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
              className="md:hidden mt-2 rounded-2xl border border-white/[0.10] border-t-white/[0.18] overflow-hidden"
              style={{
                background: "rgba(8,8,8,0.85)",
                backdropFilter: "blur(40px) saturate(180%)",
                WebkitBackdropFilter: "blur(40px) saturate(180%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 64px rgba(0,0,0,0.7)",
              }}
            >
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />

              <div className="flex flex-col p-3 gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-xl text-[0.75rem] font-semibold uppercase tracking-[0.12em] transition-all duration-200",
                      isActive(link)
                        ? "bg-white/[0.08] text-white border border-white/[0.10]"
                        : "text-white/45 hover:text-white/75 hover:bg-white/[0.05] border border-transparent"
                    )}
                  >
                    {isActive(link) && (
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                    )}
                    {link.name}
                  </Link>
                ))}

                <div className="flex items-center gap-2 px-3 pt-3 mt-1 border-t border-white/[0.06]">
                  <LiquidButton
                    size="sm"
                    className="ml-auto rounded-full text-[0.72rem] font-bold"
                    onClick={() => { handleLinkClick("#contact"); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                  >
                    Hire Me
                  </LiquidButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
