"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { FolderGit2, BadgeCheck, Trophy, Mail, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { HireMeModal } from "./hire-me-modal";

// Single-page anchors — every destination is a section of the home page now.
const links = [
  { name: "Projects",     short: "Projects", id: "projects",     Icon: FolderGit2 },
  { name: "Certificates", short: "Certs",    id: "certificates", Icon: BadgeCheck },
  { name: "Achievements", short: "Awards",   id: "achievements", Icon: Trophy     },
  { name: "Contact",      short: "Contact",  id: "contact",      Icon: Mail       },
];

export function MainNavbar() {
  const [hireOpen, setHireOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState("home");

  const pathname = usePathname();
  const reduce = useReducedMotion();

  // Scroll-spy: mark the section sitting in a band near the top of the viewport as active.
  // Runs only on the single-page home (the only place the sections exist).
  useEffect(() => {
    if (pathname !== "/") return;
    const els = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
        else if (window.scrollY < window.innerHeight * 0.6) setActive("home");
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  const handleBrandClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // The admin panel ships its own chrome (see app/admin/layout.tsx); suppress the public nav there.
  if (pathname.startsWith("/admin")) return null;

  // Hover wins; falls back to the scroll-spy active section so the pill rests on the current one.
  const highlight = hovered ?? active;
  const slide = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 400, damping: 28 };

  return (
    <>
      {/* ── Top bar: desktop full nav, mobile brand only ── */}
      <motion.header
        className="theme-brut fixed top-0 z-50 w-full"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 360, damping: 34, mass: 0.85 }}
      >
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-8">
          <nav className="mx-auto flex w-full items-center gap-3 rounded-[6px] border-2 border-[var(--ink)] bg-[var(--paper)] px-5 py-3 shadow-[4px_4px_0_0_#1a1714]">
            {/* Brand */}
            <div className="flex flex-1 items-center">
              <button onClick={handleBrandClick} className="group flex shrink-0 items-center gap-2">
                <span className="inline-flex">
                  <Image
                    src="/brand/mark.png"
                    alt="Bibek Pathak"
                    width={219}
                    height={326}
                    priority
                    className="h-[1.35rem] w-auto"
                  />
                </span>
                <span className="brut-h text-[0.95rem] tracking-tight text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
                  BIBEK.TECH
                </span>
              </button>
            </div>

            {/* Desktop anchors — centered, sliding hover/active pill */}
            <div className="hidden items-center gap-1 md:flex" onMouseLeave={() => setHovered(null)}>
              {links.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onMouseEnter={() => setHovered(link.id)}
                  className={cn(
                    "relative rounded-[4px] px-3 py-1.5 brut-mono text-[0.8rem] font-bold uppercase tracking-[0.1em] transition will-change-transform motion-safe:active:scale-[0.93]",
                    highlight === link.id ? "text-[var(--accent-ink)]" : "text-[var(--ink-2)]"
                  )}
                >
                  {highlight === link.id && (
                    <motion.span
                      layoutId="nav-highlight"
                      className="absolute inset-0 -z-10 rounded-[4px] bg-[var(--accent)]"
                      transition={slide}
                    />
                  )}
                  {link.name}
                </a>
              ))}
            </div>

            {/* Hire CTA */}
            <div className="flex flex-1 justify-end">
              <button onClick={() => setHireOpen(true)} className="brut-btn hidden md:inline-flex">
                Hire Me
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* ── Mobile bottom tab bar ── */}
      <motion.nav
        className="theme-brut fixed inset-x-0 bottom-0 z-50 border-t-2 border-[var(--ink)] bg-[var(--paper)] shadow-[0_-4px_0_0_var(--ink)] md:hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 360, damping: 34, mass: 0.85 }}
      >
        <div className="mx-auto flex max-w-md items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
          {links.map((link) => {
            const isActive = active === link.id;
            const Icon = link.Icon;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-1 py-2.5 brut-mono text-[0.72rem] font-bold uppercase tracking-[0.06em] transition will-change-transform motion-safe:active:scale-90",
                  isActive ? "text-[var(--accent)]" : "text-[var(--ink-3)]"
                )}
              >
                {isActive && (
                  <span className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
                    <motion.span
                      layoutId="nav-ind-mobile"
                      className="h-[3px] w-8 rounded-b-[2px] bg-[var(--accent)]"
                      transition={slide}
                    />
                  </span>
                )}
                <motion.span
                  className="inline-flex"
                  initial={false}
                  animate={{ y: isActive ? -2 : 0, scale: isActive ? 1.12 : 1 }}
                  transition={slide}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.6 : 2} />
                </motion.span>
                {link.short}
              </a>
            );
          })}
          <button
            onClick={() => setHireOpen(true)}
            className="flex flex-1 flex-col items-center gap-1 py-2.5 brut-mono text-[0.72rem] font-bold uppercase tracking-[0.06em] text-[var(--accent)]"
          >
            <Sparkles className="h-5 w-5" strokeWidth={2.6} />
            Hire
          </button>
        </div>
      </motion.nav>

      <HireMeModal open={hireOpen} onClose={() => setHireOpen(false)} />
    </>
  );
}
