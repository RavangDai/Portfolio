"use client";

import type { ComponentProps, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { setNeatParked } from "@/lib/neat-control";
import { setCurtainOpen } from "@/lib/curtain-state";

// ~150KB gzipped of three.js. Loaded only once the curtain is close to the viewport (see the
// preload observer below) so it never lands in the initial page payload.
const FooterHalftone = dynamic(() => import("./footer-halftone"), { ssr: false });

const NAV_LINKS = [
  { name: "Home",         href: "#top"          },
  { name: "Projects",     href: "#projects"     },
  { name: "Certificates", href: "#certificates" },
  { name: "Achievements", href: "#achievements" },
  { name: "Contact",      href: "#contact"      },
];

const SOCIALS = [
  { name: "GitHub",   href: "https://github.com/RavangDai",                        icon: FaGithub     },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/bibek-pathak-10398a301/", icon: FaLinkedinIn },
];

/* ── Footer column ──
   Was a framer-motion `whileInView` reveal. The curtain is position:fixed, so it is
   technically "in view" the moment it becomes visible and whileInView would fire everything
   at once. The stagger is scrubbed off the curtain's scroll progress instead. */
function Column({ className, children }: { className?: ComponentProps<"div">["className"]; children: ReactNode }) {
  return (
    <div data-curtain-col className={className}>
      {children}
    </div>
  );
}

export function Footer() {
  const pathname = usePathname();
  const slotRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLElement>(null);
  const [scene, setScene] = useState(false);

  const isAdmin = pathname.startsWith("/admin");

  // ── Preload: pull three.js in a viewport early so the scene is warm before the reveal ──
  useEffect(() => {
    if (isAdmin) return;
    const slot = slotRef.current;
    if (!slot) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setScene(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px 150% 0px" }
    );
    io.observe(slot);
    return () => io.disconnect();
  }, [isAdmin]);

  // ── Reveal + curtain progress ──
  useEffect(() => {
    if (isAdmin) return;
    const slot = slotRef.current;
    const curtain = curtainRef.current;
    if (!slot || !curtain) return;

    // Reduced motion drops the whole curtain choreography: CSS puts the footer back in flow
    // as an ordinary full-height block and hides the slot, so there is no scroll range to
    // scrub against. Running the GSAP `from` tweens here would strand the letters at
    // yPercent 118 — off-screen, permanently — because nothing would ever advance them.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      curtain.style.setProperty("--curtain-p", "1");
      curtain.classList.add("is-revealed");
      // The slot is display:none here and the footer is back in normal flow, so there is no
      // scroll range to observe. Watch the curtain itself instead — otherwise publishing
      // "open" unconditionally would hide the navbar from page load, permanently.
      const flat = new IntersectionObserver(
        ([entry]) => {
          const on = Boolean(entry?.isIntersecting);
          setCurtainOpen(on);
          setNeatParked(on);
        },
        { threshold: 0.35 }
      );
      flat.observe(curtain);
      return () => {
        flat.disconnect();
        setCurtainOpen(false);
        setNeatParked(false);
      };
    }

    gsap.registerPlugin(ScrollTrigger);

    // The curtain is only made visible once the slot reaches the viewport. Sections above are
    // 80% opaque (.brut-veil), so a permanently visible curtain would ghost through them. The
    // contact section directly above is opaque (.brut-curtain-edge) for a clean uncovering edge.
    const reveal = new IntersectionObserver(
      ([entry]) => {
        const on = Boolean(entry?.isIntersecting);
        curtain.classList.toggle("is-revealed", on);
        setNeatParked(on); // only one WebGL context animates at a time
        setCurtainOpen(on); // navbar clears out so the signature owns the screen
      },
      { rootMargin: "0px" }
    );
    reveal.observe(slot);

    const ctx = gsap.context(() => {
      // Publish 0..1 progress. The halftone shader reads it to grow its dots, and the CSS
      // parallax on .brut-curtain-inner reads it too.
      ScrollTrigger.create({
        trigger: slot,
        start: "top bottom",
        end: "bottom bottom",
        onUpdate: (self) => {
          curtain.style.setProperty("--curtain-p", self.progress.toFixed(4));
        },
      });

      const scrub = { trigger: slot, start: "top bottom", end: "bottom bottom", scrub: 0.6 };

      // The signature needs no tween — its wipe is a pure-CSS clip-path driven off the
      // --curtain-p var published above.
      gsap.from("[data-curtain-col]", {
        y: 40,
        opacity: 0,
        filter: "blur(5px)",
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: scrub,
      });
    }, curtain);

    return () => {
      reveal.disconnect();
      ctx.revert();
      setNeatParked(false);
      // Never leave the navbar stranded off-screen after a route change.
      setCurtainOpen(false);
    };
  }, [isAdmin]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // The site is one scrolling page now, so the footer is its true end (shown on /). The admin
  // panel ships its own chrome, so skip it there.
  if (isAdmin) return null;

  return (
    <>
      {/* Scroll room for the reveal. The curtain itself is fixed and out of flow, so this
          transparent block is what actually lengthens the document. */}
      <div ref={slotRef} className="brut-curtain-slot" aria-hidden />

      <footer
        ref={curtainRef}
        data-curtain
        className="brut-curtain theme-brut brut-bg relative w-full border-t-2 border-[var(--ink)]"
      >
        {scene && <FooterHalftone />}

        <div className="brut-curtain-inner relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-between px-4 sm:px-6 md:px-8 pt-8 pb-24 sm:pt-12 md:pb-8">
          {/* ── Top: the pitch ── */}
          <Column className="flex items-baseline justify-between gap-4">
            <p className="brut-kicker text-[0.72rem]">Let&apos;s build something</p>
            <a
              href="mailto:drbibekg2029@gmail.com"
              className="brut-mono text-[0.78rem] text-[var(--ink-2)] underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
            >
              drbibekg2029@gmail.com
            </a>
          </Column>

          {/* ── The signature. Each word draws itself left to right via a clip-path wipe
                scrubbed off --curtain-p (pure CSS, no JS tween), BIBEK then PATHAK, with an
                ink nib riding each edge. The halftone field measures this box and bends its
                dot grid around it — see footer-halftone.tsx measureName(). ── */}
          <div data-signature className="brut-signature" aria-label="Bibek Pathak">
            {["BIBEK", "PATHAK"].map((word) => (
              <span key={word} className="brut-sig-line" aria-hidden>
                <span className="brut-sig-word">{word}</span>
                {/* Sibling of the clipped text, not a child — otherwise its own wipe eats it. */}
                <span className="brut-sig-nib" />
              </span>
            ))}
          </div>

          {/* ── Bottom: the utility rail ── */}
          <div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-7 border-t-2 border-[var(--ink)] pt-7 sm:gap-10 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:gap-12">
              <Column className="col-span-2 space-y-3 lg:col-span-1">
                <p className="max-w-[240px] text-[0.88rem] leading-relaxed text-[var(--ink-2)]">
                  Real-time computer vision and full-stack web. IT student at Southeastern
                  Louisiana University.
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
              </Column>

              <Column className="space-y-3">
                <h4 className="brut-kicker text-[0.72rem]">Navigation</h4>
                <nav className="flex flex-col gap-2">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="inline-flex w-fit text-[0.85rem] font-medium text-[var(--ink-2)] transition-colors hover:text-[var(--accent)]"
                    >
                      {link.name}
                    </a>
                  ))}
                </nav>
              </Column>

              <Column className="space-y-3">
                <h4 className="brut-kicker text-[0.72rem]">Stack</h4>
                <div className="flex flex-col gap-2">
                  {["React · Next.js", "Python · FastAPI", "TypeScript", "PostgreSQL · MongoDB", "Docker · Git"].map((item) => (
                    <span key={item} className="flex items-center text-[0.85rem] text-[var(--ink-2)]">
                      <span aria-hidden className="mr-2 inline-block h-1.5 w-1.5 shrink-0 rounded-[1px] bg-[var(--marigold)] align-middle" />
                      {item}
                    </span>
                  ))}
                </div>
              </Column>

              <Column className="col-span-2 flex items-start lg:col-span-1 lg:justify-end">
                <button onClick={scrollToTop} className="brut-btn-ghost">
                  Back to top
                  <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </motion.span>
                </button>
              </Column>
            </div>

            <Column>
              <div className="flex flex-col items-center justify-between gap-2 pt-5 sm:flex-row">
                <p className="brut-mono text-[0.78rem] text-[var(--ink-3)]">
                  © {new Date().getFullYear()} Bibek Pathak. All rights reserved.
                </p>
                <div className="flex items-center gap-3">
                  <p className="brut-mono text-[0.78rem] text-[var(--ink-3)]">
                    Built with Next.js · Tailwind · three.js
                  </p>
                  <span className="text-[var(--ink-3)]/40" aria-hidden>·</span>
                  {/* Discreet owner-only entry point. Middleware redirects to /admin/login when unauthenticated. */}
                  <Link
                    href="/admin"
                    className="brut-mono text-[0.78rem] text-[var(--ink-3)] transition-colors hover:text-[var(--accent)]"
                  >
                    Admin
                  </Link>
                </div>
              </div>
            </Column>
          </div>
        </div>
      </footer>
    </>
  );
}
