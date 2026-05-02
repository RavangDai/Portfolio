"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
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

const SOCIALS = [
  { name: "GitHub",   href: "https://github.com/RavangDai",                        Icon: FaGithub     },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/bibek-pathak-10398a301/", Icon: FaLinkedinIn },
];

export function MainNavbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled]           = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);

  const pathname = usePathname();
  const router   = useRouter();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Active section: pathname-based for non-home pages; observer-based on home
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(pathname.replace("/", ""));
      return;
    }

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
  }, [pathname]);

  // Keep scrolled state up to date on non-home pages
  useEffect(() => {
    if (pathname === "/") return;
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const links = [
    { name: "Projects",      href: "/#projects",      id: "projects"      },
    { name: "Certificates",  href: "/#certificates",  id: "certificates"  },
    { name: "Achievements",  href: "/achievements",   id: "achievements"  },
    { name: "Contact",       href: "/#contact",       id: "contact"       },
  ];

  const handleBrandClick = () => {
    setMobileOpen(false);
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  const handleLinkClick = () => setMobileOpen(false);

  const isActive = (link: { id: string }) => activeSection === link.id;

  return (
    <>
      <header className="fixed top-0 z-50 w-full">
        {/* Scroll progress bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1.5px] origin-left z-10"
          style={{ scaleX, background: "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.9), rgba(255,255,255,0.5), rgba(255,255,255,0.9), rgba(255,255,255,0.2))" }}
        />

        <div className={cn("mx-auto max-w-7xl px-4 sm:px-8 transition-all duration-500", scrolled ? "pt-2" : "pt-4")}>
          <nav
            className={cn(
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
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />

            {/* ── Brand ── */}
            <button
              onClick={handleBrandClick}
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
                  onClick={handleLinkClick}
                />
              ))}
            </div>

            {/* ── Right: CTA + hamburger ── */}
            <div className="flex items-center gap-2">
              <LiquidButton
                size="sm"
                className="hidden md:inline-flex rounded-full text-[0.72rem] font-bold tracking-wide"
                onClick={() => {
                  if (pathname === "/") {
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    router.push("/#contact");
                  }
                }}
              >
                Hire Me
              </LiquidButton>

              {/* Mobile hamburger */}
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
        </div>
      </header>

      {/* ── Full-screen mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 md:hidden flex flex-col"
            style={{
              background: "rgba(5,5,5,0.97)",
              backdropFilter: "blur(48px) saturate(180%)",
              WebkitBackdropFilter: "blur(48px) saturate(180%)",
            }}
          >
            {/* Grain texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat",
                backgroundSize: "128px",
              }}
            />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Header row */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between px-7 pt-6 pb-4"
            >
              <button
                onClick={handleBrandClick}
                className="text-[0.82rem] font-black tracking-tight text-white/80"
              >
                BIBEK.DEV
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/25 transition-all duration-200"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>

            {/* Nav links */}
            <div className="flex-1 flex flex-col justify-center px-7 overflow-hidden">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -24, filter: "blur(4px)" }}
                  transition={{
                    duration: 0.55,
                    delay: 0.08 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="border-b border-white/[0.06] last:border-b-0"
                >
                  <Link
                    href={link.href}
                    onClick={handleLinkClick}
                    className="group flex items-center gap-5 py-5"
                  >
                    <span className="font-mono text-[0.58rem] font-medium tracking-[0.25em] text-white/20 w-6 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-black tracking-tighter leading-none uppercase transition-colors duration-300",
                        isActive(link) ? "shimmer-text" : "text-white/35 group-hover:text-white/75"
                      )}
                      style={{ fontSize: "clamp(2rem, 10vw, 3.5rem)" }}
                    >
                      {link.name}
                    </span>
                    <motion.div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ArrowUpRight className="h-6 w-6 text-white/40" />
                    </motion.div>
                    {isActive(link) && (
                      <span className="relative flex h-1.5 w-1.5 shrink-0 ml-auto">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-50" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="px-7 pt-5 pb-8 flex items-center justify-between border-t border-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                {SOCIALS.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name}
                    className="btn-icon h-9 w-9"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <LiquidButton
                size="sm"
                className="rounded-full text-[0.72rem] font-bold"
                onClick={() => {
                  setMobileOpen(false);
                  if (pathname === "/") {
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    router.push("/#contact");
                  }
                }}
              >
                Hire Me
              </LiquidButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
