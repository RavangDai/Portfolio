"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin } from "lucide-react";
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

  const links = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "#projects" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

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
    <header className="fixed top-6 z-50 flex w-full justify-center px-4 sm:px-6">
      <nav
        className={cn(
          "relative flex w-full max-w-5xl items-center justify-between gap-8",
          "rounded-[2.5rem] border border-white/10 bg-white/[0.03]",
          "backdrop-blur-xl shadow-[0_12px_45px_rgba(0,0,0,0.65)]",
          "px-6 py-3 sm:px-8 sm:py-3.5",
          "transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]"
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Magnetic glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]">
          <div
            className={cn(
              "absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full",
              "bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.3),transparent_60%)]",
              "blur-2xl transition-opacity duration-300",
              glow.active ? "opacity-100" : "opacity-0"
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
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }}
  className="group flex items-center gap-2"
>
  <div
    className={cn(
      "relative h-8 w-8 overflow-hidden rounded-full",
      "border border-white/25 bg-white/5",
      "ring-1 ring-white/5",
      "transition-all duration-300",
      "group-hover:ring-indigo-300/70 group-hover:border-indigo-200/70"
    )}
  >
    <Image
      src="/bibek-avatar.jpg"
      alt="Bibek Pathak"
      fill
      sizes="32px"
      className="object-cover"
      priority
    />
  </div>

  <span className="hidden text-[11px] font-medium tracking-[0.24em] text-white/60 sm:inline">
    BIBEK · PATHAK
  </span>
</button>

          {/* Links */}
          <div className="hidden items-center gap-7 sm:flex">
            {links.map((link) => {
              const isActive = pathname === link.href; // only "/" will match
              return (
                <Link
  key={link.href}
  href={link.href}
  className={cn(
    "group relative px-1 py-1 text-xs font-medium tracking-wide text-white/70",
    "transition-colors duration-200 hover:text-white"
  )}
>
  {link.name}
  <span
    className={cn(
      "pointer-events-none absolute left-0 -bottom-1 h-[1.5px]",
      "bg-gradient-to-r from-indigo-300 via-white to-rose-300",
      "transition-all duration-300",
      // animate to full on hover
      "w-0 group-hover:w-full",
      // keep it full if active (for Home on '/')
      isActive && "w-full"
    )}
  />
</Link>

              );
            })}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/RavangDai"
              target="_blank"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white/80 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-400/20 hover:text-white hover:shadow-[0_0_16px_rgba(129,140,248,0.55)]"
            >
              <Github className="h-4 w-4" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/bibek-pathak-10398a301/"
              target="_blank"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white/80 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-400/20 hover:text-white hover:shadow-[0_0_18px_rgba(129,140,248,0.55)]"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
