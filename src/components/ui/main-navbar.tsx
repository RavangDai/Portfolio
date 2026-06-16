"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { FolderGit2, BadgeCheck, Trophy, Mail, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { HireMeModal } from "./hire-me-modal";

const links = [
  { name: "Projects",     short: "Projects", href: "/projects",     id: "projects",     Icon: FolderGit2 },
  { name: "Certificates", short: "Certs",    href: "/certificates", id: "certificates", Icon: BadgeCheck },
  { name: "Achievements", short: "Awards",   href: "/achievements", id: "achievements", Icon: Trophy     },
  { name: "Contact",      short: "Contact",  href: "/contact",      id: "contact",      Icon: Mail       },
];

export function MainNavbar() {
  const [hireOpen, setHireOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const pathname = usePathname();
  const router   = useRouter();
  const reduce   = useReducedMotion();

  // Active link tracks the current path (every chrome route is a standalone page).
  const activeSection = pathname === "/" ? "home" : pathname.replace("/", "");

  const handleBrandClick = () => {
    if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
    else router.push("/");
  };

  // Homepage is the full-screen hero; its EXPLORE beat handles navigation, so no global nav there.
  // The admin panel ships its own chrome (see app/admin/layout.tsx), so suppress the public nav too.
  if (pathname === "/" || pathname.startsWith("/admin")) return null;

  // Hover wins; falls back to the active route so the pill rests on the current page.
  const highlight = hovered ?? activeSection;

  // Spring for the hover/active pill (a small, GPU-composited element); snaps under reduced motion.
  // The condense is handled in CSS (see the nav below), not here.
  const slide = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 400, damping: 28 };

  return (
    <>
      {/* ── Top bar: desktop full nav, mobile brand only. Slab → floating pill on scroll. ── */}
      <motion.header
        className="theme-brut fixed top-0 z-50 w-full"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 360, damping: 34, mass: 0.85 }}
      >
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-8">
          {/* Static bar — no scroll-driven resize. Kept deliberately simple for smooth scrolling. */}
          <nav className="mx-auto flex w-full items-center gap-3 rounded-[6px] border-2 border-[var(--ink)] bg-[var(--paper)] px-5 py-3 shadow-[4px_4px_0_0_#1a1714]">
            {/* Brand (left zone — flex-1 mirrors the right zone so the links stay centered) */}
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

            {/* Desktop links — centered in the bar, with a sliding hover/active pill */}
            <div
              className="hidden items-center gap-1 md:flex"
              onMouseLeave={() => setHovered(null)}
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHovered(link.id)}
                  className={cn(
                    "relative rounded-[4px] px-3 py-1.5 brut-mono text-[0.7rem] font-bold uppercase tracking-[0.1em] transition will-change-transform motion-safe:active:scale-[0.93]",
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
                </Link>
              ))}
            </div>

            {/* Hire CTA (right zone — flex-1 balances the brand zone, keeping links centered) */}
            <div className="flex flex-1 justify-end">
              <button
                onClick={() => setHireOpen(true)}
                className="brut-btn hidden md:inline-flex"
              >
                Hire Me
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* ── Mobile bottom tab bar: thumb-reachable nav, no hamburger digging ── */}
      <motion.nav
        className="theme-brut fixed inset-x-0 bottom-0 z-50 border-t-2 border-[var(--ink)] bg-[var(--paper)] shadow-[0_-4px_0_0_var(--ink)] md:hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 360, damping: 34, mass: 0.85 }}
      >
        <div className="mx-auto flex max-w-md items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
          {links.map((link) => {
            const active = activeSection === link.id;
            const Icon = link.Icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-1 py-2.5 brut-mono text-[0.55rem] font-bold uppercase tracking-[0.06em] transition will-change-transform motion-safe:active:scale-90",
                  active ? "text-[var(--accent)]" : "text-[var(--ink-3)]"
                )}
              >
                {/* Thick indicator slides along the top edge between tabs (no transform on the
                    layout element itself — the wrapper centers it, framer tweens its position). */}
                {active && (
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
                  animate={{ y: active ? -2 : 0, scale: active ? 1.12 : 1 }}
                  transition={slide}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.6 : 2} />
                </motion.span>
                {link.short}
              </Link>
            );
          })}
          {/* Hire — accent-tinted CTA tab */}
          <button
            onClick={() => setHireOpen(true)}
            className="flex flex-1 flex-col items-center gap-1 py-2.5 brut-mono text-[0.55rem] font-bold uppercase tracking-[0.06em] text-[var(--accent)]"
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
