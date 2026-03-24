"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function MainNavbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sections = ["home", "projects", "certificates", "contact", "blog"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id || "home");
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (window.scrollY < 100) setActiveSection("home");
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

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

  const isActive = (link: { href: string; id: string }) =>
    (link.href === "/" && pathname === "/" && activeSection === "home") ||
    (link.href.startsWith("#") && activeSection === link.id);

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className={cn(
        "mx-auto max-w-6xl px-4 sm:px-8 transition-all duration-500",
        scrolled ? "pt-3" : "pt-5"
      )}>
        <nav className={cn(
          "relative flex items-center justify-between rounded-2xl border px-5 py-3 transition-all duration-500",
          scrolled
            ? "border-white/[0.07] bg-[#020A06]/85 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)]"
            : "border-white/[0.04] bg-white/[0.01] backdrop-blur-md"
        )}>

          {/* Top inner accent line */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

          {/* ── Brand ── */}
          <button
            onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setMobileOpen(false); }}
            className="group flex items-center gap-2 shrink-0"
          >
            {/* Availability pulse */}
            <span className="relative flex h-[7px] w-[7px] shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-emerald-500" />
            </span>

            <span className="text-[0.82rem] font-semibold tracking-tight text-white/85 group-hover:text-white transition-colors duration-200">
              Bibek Pathak
            </span>
          </button>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className={cn(
                  "group relative px-3.5 py-2 text-xs uppercase tracking-[0.12em] font-semibold transition-colors duration-300",
                  isActive(link) ? "text-white" : "text-white/50 hover:text-white/80 active:text-white/80"
                )}
              >
                {link.name}

                {/* Animated underline — hover + active */}
                <span
                  className={cn(
                    "absolute bottom-1 left-3.5 right-3.5 h-px origin-left transition-all duration-300",
                    isActive(link)
                      ? "scale-x-100 opacity-100"
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-50 group-active:scale-x-100 group-active:opacity-50"
                  )}
                  style={{ background: "linear-gradient(90deg, #10b981, #22d3ee)" }}
                />

                {/* Active top dot */}
                {isActive(link) && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-emerald-400"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* ── Right: socials + mobile toggle ── */}
          <div className="flex items-center gap-1">
            <div className="hidden md:flex items-center gap-0.5 pl-4 ml-1 border-l border-white/[0.06]">
              <Link
                href="https://github.com/RavangDai"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/45 hover:text-white hover:bg-white/[0.05] active:text-white active:bg-white/[0.05] transition-all duration-200"
              >
                <Github className="h-[14px] w-[14px]" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/bibek-pathak-10398a301/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/45 hover:text-white hover:bg-white/[0.05] active:text-white active:bg-white/[0.05] transition-all duration-200"
              >
                <Linkedin className="h-[14px] w-[14px]" />
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-white/45 hover:text-white hover:bg-white/[0.06] active:text-white active:bg-white/[0.06] transition-all duration-200"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="h-4 w-4" />
                  </motion.span>
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
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden mt-2 rounded-2xl border border-white/[0.07] bg-[#020A06]/92 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden"
            >
              {/* Top accent */}
              <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent" />

              <div className="flex flex-col p-3 gap-0.5">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl text-[0.8rem] uppercase tracking-[0.1em] font-semibold transition-all duration-200",
                      isActive(link)
                        ? "text-white bg-emerald-500/[0.07] border border-emerald-500/[0.12]"
                        : "text-white/50 hover:text-white/80 hover:bg-white/[0.04] active:text-white/80 active:bg-white/[0.04]"
                    )}
                  >
                    {link.name}
                    {isActive(link) && (
                      <span className="h-[5px] w-[5px] rounded-full bg-emerald-400" />
                    )}
                  </Link>
                ))}

                <div className="flex items-center gap-1 px-3 pt-3 mt-1 border-t border-white/[0.05]">
                  <Link
                    href="https://github.com/RavangDai"
                    target="_blank"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/45 hover:text-white hover:bg-white/[0.06] active:text-white active:bg-white/[0.06] transition-all"
                  >
                    <Github className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/bibek-pathak-10398a301/"
                    target="_blank"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/45 hover:text-white hover:bg-white/[0.06] active:text-white active:bg-white/[0.06] transition-all"
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
