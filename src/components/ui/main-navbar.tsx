"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { cn } from "@/lib/utils";

const SOCIALS = [
  { name: "GitHub",   href: "https://github.com/RavangDai",                        Icon: FaGithub     },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/bibek-pathak-10398a301/", Icon: FaLinkedinIn },
];

export function MainNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname();
  const router   = useRouter();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Active link tracks the current path (every chrome route is a standalone page).
  const activeSection = pathname === "/" ? "home" : pathname.replace("/", "");

  const links = [
    { name: "Projects",      href: "/projects",      id: "projects"      },
    { name: "Certificates",  href: "/certificates",  id: "certificates"  },
    { name: "Achievements",  href: "/achievements",  id: "achievements"  },
    { name: "Contact",       href: "/contact",       id: "contact"       },
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

  // Homepage is the full-screen hero; its EXPLORE beat handles navigation, so no global nav there.
  // The admin panel ships its own chrome (see app/admin/layout.tsx), so suppress the public nav too.
  if (pathname === "/" || pathname.startsWith("/admin")) return null;

  // ── Light "neon brutalism" navbar (projects / certificates / achievements / contact) ──
  return (
    <>
      <motion.header
        className="theme-brut fixed top-0 z-50 w-full"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 360, damping: 34, mass: 0.85 }}
      >
        {/* Scroll progress bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 z-10 h-[2px] origin-left bg-[var(--accent)]"
          style={{ scaleX }}
        />
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-8">
          <nav className="flex items-center justify-between gap-4 rounded-[6px] border-2 border-[var(--ink)] bg-[var(--paper)] px-5 py-3 shadow-[4px_4px_0_0_var(--ink)]">
            {/* Brand */}
            <button onClick={handleBrandClick} className="group flex shrink-0 items-center gap-2">
              <Image
                src="/brand/mark.png"
                alt="Bibek Pathak"
                width={219}
                height={326}
                priority
                className="h-[1.35rem] w-auto"
              />
              <span className="brut-h text-[0.95rem] tracking-tight text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
                BIBEK.TECH
              </span>
            </button>

            {/* Desktop links */}
            <div className="hidden items-center gap-1 md:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "rounded-[4px] px-3 py-1.5 brut-mono text-[0.7rem] font-bold uppercase tracking-[0.1em] transition-colors",
                    isActive(link)
                      ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                      : "text-[var(--ink-2)] hover:text-[var(--accent)]"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right: CTA + hamburger */}
            <div className="flex items-center gap-2">
              <button onClick={() => router.push("/contact")} className="hidden brut-btn md:inline-flex">
                Hire Me
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-[4px] border-2 border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] md:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : (
                  <span className="flex flex-col items-end gap-[3px]">
                    <span className="block h-[2px] w-4 bg-current" />
                    <span className="block h-[2px] w-2.5 bg-current" />
                    <span className="block h-[2px] w-4 bg-current" />
                  </span>
                )}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="brut-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="theme-brut fixed inset-0 z-40 flex flex-col bg-[var(--paper)] md:hidden"
          >
            <div className="flex items-center justify-between border-b-2 border-[var(--ink)] px-7 pt-6 pb-4">
              <button onClick={handleBrandClick} className="flex items-center gap-2">
                <Image src="/brand/mark.png" alt="Bibek Pathak" width={219} height={326} className="h-[1.4rem] w-auto" />
                <span className="brut-h text-base text-[var(--ink)]">BIBEK.TECH</span>
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-[4px] border-2 border-[var(--ink)] text-[var(--ink)]"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-3 px-7">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.06 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center gap-4 border-b-2 border-[var(--ink)]/15 py-4",
                      isActive(link) ? "text-[var(--accent)]" : "text-[var(--ink)]"
                    )}
                  >
                    <span className="brut-mono text-[0.6rem] text-[var(--ink-3)]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="brut-h text-3xl uppercase">{link.name}</span>
                    <ArrowUpRight className="ml-auto h-5 w-5 text-[var(--ink-3)]" />
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t-2 border-[var(--ink)] px-7 pt-5 pb-8">
              <div className="flex items-center gap-2.5">
                {SOCIALS.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name}
                    className="flex h-9 w-9 items-center justify-center rounded-[4px] border-2 border-[var(--ink)] text-[var(--ink)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <button onClick={() => { setMobileOpen(false); router.push("/contact"); }} className="brut-btn">
                Hire Me
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
