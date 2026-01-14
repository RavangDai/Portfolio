"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type GlowState = {
  x: number;
  y: number;
  active: boolean;
};

export function MainNavbar() {
  const pathname = usePathname();
  const [glow, setGlow] = useState<GlowState>({
    x: 0,
    y: 0,
    active: false,
  });
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track active section based on scroll
  useEffect(() => {
    const sections = ["home", "projects", "certificates", "contact", "about"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id || "home");
          }
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Handle home section
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection("home");
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const links = [
    { name: "Home", href: "/", id: "home" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "Certificates", href: "#certificates", id: "certificates" },
    { name: "Contact", href: "#contact", id: "contact" },
    { name: "About", href: "#about", id: "about" },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGlow({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    setGlow((prev) => ({ ...prev, active: false }));
  };

  return (
    <header className="fixed top-4 z-50 flex w-full justify-center px-4 sm:top-6 sm:px-6">
      <nav
        className={cn(
          "relative flex w-full max-w-6xl items-center justify-between gap-8",
          "rounded-[2.5rem] border border-white/10 bg-white/[0.03]",
          "backdrop-blur-xl shadow-[0_12px_45px_rgba(0,0,0,0.65)]",
          "px-5 py-3 sm:px-8 sm:py-3.5",
          "transition-all duration-500",
          "hover:border-white/20 hover:bg-white/[0.05]",
          "hover:shadow-[0_20px_60px_rgba(0,0,0,0.75)]"
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Magnetic glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]">
          <div
            className={cn(
              "absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full",
              "bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.35),transparent_65%)]",
              "blur-2xl transition-all duration-500",
              glow.active ? "opacity-100 scale-100" : "opacity-0 scale-75"
            )}
            style={{
              left: glow.x,
              top: glow.y,
            }}
          />
        </div>

        {/* Actual navbar content */}
        <div className="relative z-10 flex flex-1 items-center justify-between gap-6">
          {/* Brand */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setMobileMenuOpen(false);
            }}
            className="group flex items-center gap-2.5 transition-transform duration-300 hover:scale-105"
          >
            <div
              className={cn(
                "relative h-9 w-9 overflow-hidden rounded-full",
                "border border-white/25 bg-white/5",
                "ring-1 ring-white/5",
                "transition-all duration-300",
                "group-hover:ring-indigo-300/70 group-hover:border-indigo-200/70",
                "group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
              )}
            >
              <Image
                src="/bibek-avatar.jpg"
                alt="Bibek Pathak"
                fill
                sizes="36px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>

            <span className="hidden text-[11px] font-medium tracking-[0.24em] text-white/60 transition-colors duration-300 group-hover:text-white/80 sm:inline">
              BIBEK · PATHAK
            </span>
          </button>

          {/* Desktop Links */}
          <div className="hidden items-center gap-1 sm:flex">
            {links.map((link) => {
              const isActive =
                (link.href === "/" && pathname === "/" && activeSection === "home") ||
                (link.href.startsWith("#") && activeSection === link.id);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className={cn(
                    "group relative px-3 py-2 text-xs font-medium tracking-wide",
                    "text-white/70 transition-all duration-300",
                    "hover:text-white hover:translate-y-[-1px]",
                    isActive && "text-white"
                  )}
                >
                  <span className="relative z-10">{link.name}</span>
                  {/* Active underline */}
                  <span
                    className={cn(
                      "pointer-events-none absolute left-1/2 -bottom-0.5 h-[2px]",
                      "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400",
                      "transition-all duration-300 origin-center",
                      isActive ? "w-full -translate-x-1/2 opacity-100" : "w-0 -translate-x-1/2 opacity-0",
                      "group-hover:w-full group-hover:opacity-100"
                    )}
                  />
                  {/* Hover background */}
                  <span
                    className={cn(
                      "pointer-events-none absolute inset-0 -z-0 rounded-full",
                      "bg-white/[0.05] opacity-0 transition-opacity duration-300",
                      "group-hover:opacity-100"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* Social icons + Mobile menu button */}
          <div className="flex items-center gap-3">
            {/* Social icons */}
            <div className="hidden items-center gap-2.5 sm:flex">
              <Link
                href="https://github.com/RavangDai"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "group inline-flex h-9 w-9 items-center justify-center rounded-full",
                  "border border-white/15 bg-white/[0.03] text-white/80",
                  "shadow-sm transition-all duration-300",
                  "hover:border-indigo-400/60 hover:bg-indigo-500/20",
                  "hover:text-white hover:scale-110",
                  "hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                )}
              >
                <Github className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/bibek-pathak-10398a301/"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "group inline-flex h-9 w-9 items-center justify-center rounded-full",
                  "border border-white/15 bg-white/[0.03] text-white/80",
                  "shadow-sm transition-all duration-300",
                  "hover:border-indigo-400/60 hover:bg-indigo-500/20",
                  "hover:text-white hover:scale-110",
                  "hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                )}
              >
                <Linkedin className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full",
                "border border-white/15 bg-white/[0.03] text-white/80",
                "transition-all duration-300 sm:hidden",
                "hover:border-indigo-400/60 hover:bg-indigo-500/20",
                "hover:text-white hover:scale-110"
              )}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute left-0 right-0 top-full mt-2 rounded-2xl",
                "border border-white/10 bg-white/[0.05] backdrop-blur-xl",
                "shadow-[0_20px_60px_rgba(0,0,0,0.75)]",
                "p-4 sm:hidden z-50"
              )}
            >
            <div className="flex flex-col gap-2">
              {links.map((link) => {
                const isActive =
                  (link.href === "/" && pathname === "/" && activeSection === "home") ||
                  (link.href.startsWith("#") && activeSection === link.id);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className={cn(
                      "rounded-xl px-4 py-2.5 text-sm font-medium",
                      "text-white/70 transition-all duration-300",
                      "hover:bg-white/[0.08] hover:text-white",
                      isActive && "bg-white/[0.08] text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="mt-2 flex items-center gap-2 border-t border-white/10 pt-3">
                <Link
                  href="https://github.com/RavangDai"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white/80 transition-all hover:border-indigo-400/60 hover:bg-indigo-500/20"
                >
                  <Github className="h-4 w-4" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/bibek-pathak-10398a301/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white/80 transition-all hover:border-indigo-400/60 hover:bg-indigo-500/20"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
