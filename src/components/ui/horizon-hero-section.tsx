"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, FolderGit2, BadgeCheck, Trophy, Mail, Plus } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

// ─── Types ────────────────────────────────────────────────────────────────────

type Beat = {
  title: string;
  line1: string;
  line2: string;
  cta?: "primary" | "explore";
};

// Navigation targets surfaced as the final "EXPLORE" beat — the scroll ends here in a button
// grid instead of falling into stacked sections.
const EXPLORE_LINKS = [
  { href: "/projects", label: "Projects", desc: "10+ builds", Icon: FolderGit2 },
  { href: "/certificates", label: "Certificates", desc: "Credentials", Icon: BadgeCheck },
  { href: "/achievements", label: "Achievements", desc: "Wins & honors", Icon: Trophy },
  { href: "/contact", label: "Contact", desc: "Let's talk", Icon: Mail },
] as const;

// Narrative beats — the pinned blueprint stage swaps its left column across these.
const BEATS: Beat[] = [
  {
    title: "BIBEK PATHAK",
    line1: "Full-Stack Builder",
    line2: "AI / ML Developer",
    cta: "primary",
  },
  {
    title: "BUILDER",
    line1: "10+ shipped projects across full-stack web,",
    line2: "applied AI, and computer vision.",
  },
  {
    title: "EXPLORE",
    line1: "Dive into the work —",
    line2: "pick where to go next.",
    cta: "explore",
  },
];

const TOTAL_BEATS = BEATS.length;

// Authored chapter labels for the branded scroll indicator (aligned 1:1 with BEATS).
const CHAPTERS = ["IDENTITY", "BUILDER", "EXPLORE"] as const;

// Beat 01 proof cards — concrete evidence that I build & ship.
const PROOF = [
  { name: "KaryaAI", tag: "Full-stack · AI" },
  { name: "DollarPilot", tag: "Hackathon Winner" },
  { name: "VectorVance", tag: "Computer Vision" },
] as const;

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // ── Ready on mount (no WebGL boot to wait for) ───────────────────────────────
  useEffect(() => {
    setIsReady(true);
  }, []);

  // ── GSAP text reveal — re-runs on every beat change ──────────────────────────
  useEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.set(titleRef.current, { visibility: "visible" });
        const titleChars = titleRef.current.querySelectorAll(".title-char");
        gsap.from(titleChars, {
          y: 120,
          opacity: 0,
          duration: 1,
          stagger: 0.04,
          ease: "power4.out",
        });
      }

      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { visibility: "visible" });
        const subtitleLines = subtitleRef.current.querySelectorAll(".subtitle-line");
        gsap.from(subtitleLines, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          delay: 0.1,
          ease: "power3.out",
        });
      }
    });

    return () => ctx.revert();
  }, [isReady, currentSection]);

  // ── Tagline statement card — fade/lift in once, then draw the cobalt underline ──
  useEffect(() => {
    if (!isReady || !taglineRef.current) return;
    const el = taglineRef.current;
    const underline = el.querySelector<HTMLElement>(".hero-tagline-underline");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set(el, { visibility: "visible", opacity: 1, y: 0 });
      if (underline) gsap.set(underline, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { visibility: "visible", opacity: 0, y: 16 });
      if (underline) gsap.set(underline, { scaleX: 0, transformOrigin: "left center" });
      const tl = gsap.timeline({ delay: 0.5 });
      tl.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
      if (underline) {
        tl.to(underline, { scaleX: 1, duration: 0.6, ease: "power2.out" }, "-=0.05");
      }
    }, el);

    return () => ctx.revert();
  }, [isReady]);

  // ── Scroll handling — drives the beat and the blueprint parallax ──
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;

      const newSection = Math.min(Math.floor(progress * TOTAL_BEATS), TOTAL_BEATS - 1);
      setCurrentSection((s) => (s === newSection ? s : newSection));

      // Feed raw progress to the scene as a CSS var so the grid + monuments parallax
      // smoothly without forcing a React re-render on every scroll tick.
      sceneRef.current?.style.setProperty("--p", progress.toFixed(4));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const splitTitle = (text: string) =>
    text.split("").map((char, i) => (
      <span key={i} className="title-char">
        {char}
      </span>
    ));

  const beat = BEATS[currentSection];

  return (
    <div ref={containerRef} className="hero-container">
      <div className="hero-sticky">
        {/* ── Blueprint scene — intentional technical layer only (grid · crosshair ·
            coordinates · build year · sector · scan line). Parallax via --p. ── */}
        <div ref={sceneRef} className="hero-blueprint" data-beat={currentSection} aria-hidden>
          <div className="bp-grid" />
          <div className="bp-grid bp-grid--fine" />
          <div className="bp-cross">
            <span className="bp-cross-h" />
            <span className="bp-cross-v" />
          </div>
          <span className="bp-scan" />
          <span className="bp-tele bp-tele--bl">BUILD · IMPACT-DRIVEN</span>
        </div>

        {/* Top bar — monogram + readout */}
        <div className="hero-topbar" aria-hidden>
          <span className="hero-monogram">
            <Image src="/brand/mark.png" alt="Bibek Pathak" width={219} height={326} className="hero-monogram-img" priority />
          </span>
          <span className="hero-coords">PORTFOLIO // 2026</span>
        </div>

        {/* ── Pinned stage: left column swaps per beat, right (photo) persists ── */}
        <div className="hero-content">
          <div className="hero-stage">
            {/* LEFT — keyed so it re-mounts + animates each beat */}
            <div key={currentSection} className="hero-stage-left" data-beat={currentSection}>
              <span className="hero-sector">
                SECTOR {String(currentSection).padStart(2, "0")} — {CHAPTERS[currentSection]}
              </span>

              {currentSection === 0 && (
                <span className="role-badge">
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--cobalt)] opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--cobalt)]" />
                  </span>
                  Status: Available
                </span>
              )}

              <h1 ref={titleRef} className="hero-title hero-id-name">
                {currentSection === 0 ? (
                  <>
                    <span className="title-line">{splitTitle("BIBEK")}</span>
                    <span className="title-line">{splitTitle("PATHAK")}</span>
                  </>
                ) : (
                  splitTitle(beat.title)
                )}
              </h1>

              <div className="hero-id-rule" />

              <div ref={subtitleRef} className="hero-subtitle hero-id-sub">
                <p className="subtitle-line">{beat.line1}</p>
                <p className="subtitle-line">{beat.line2}</p>
              </div>

              {/* Beat 00 — CTAs */}
              {currentSection === 0 && (
                <div className="hero-actions">
                  <button className="brut-btn-cobalt group" onClick={() => (window.location.href = "/projects")}>
                    View Projects
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                  <button className="brut-btn-dark" onClick={() => window.open("/Bibek_Pathak_Resume_Mar26.pdf", "_blank")}>
                    Download Resume
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  <a href="https://github.com/RavangDai" target="_blank" rel="noreferrer" aria-label="GitHub" className="brut-icon-dark">
                    <FaGithub className="h-5 w-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/bibek-pathak-10398a301/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="brut-icon-dark">
                    <FaLinkedinIn className="h-5 w-5" />
                  </a>
                </div>
              )}

              {/* Beat 01 — proof cards */}
              {currentSection === 1 && (
                <div className="hero-proof">
                  {PROOF.map((p, i) => (
                    <div key={p.name} className="hero-proof-card">
                      <span className="hero-proof-idx">{String(i + 1).padStart(2, "0")}</span>
                      <span className="hero-proof-name">{p.name}</span>
                      <span className="hero-proof-tag">{p.tag}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Beat 02 — explore navigation panels */}
              {currentSection === 2 && (
                <div className="hero-explore-grid">
                  {EXPLORE_LINKS.map(({ href, label, desc, Icon }, i) => (
                    <Link key={href} href={href} className="hero-explore-card group">
                      <span className="hero-explore-idx">{String(i + 1).padStart(2, "0")}</span>
                      <Plus className="hero-explore-plus" />
                      <Icon className="hero-explore-icon" />
                      <span className="hero-explore-label">{label}</span>
                      <span className="hero-explore-desc">{desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — persistent portrait (subtly shifts per beat) */}
            <div className="hero-stage-right" data-beat={currentSection}>
              <div className="hero-photo">
                <span className="hero-photo-block" aria-hidden />
                <span className="hero-photo-chip" aria-hidden />
                <Image
                  src="/bibekimage.png"
                  alt="Bibek Pathak"
                  width={560}
                  height={680}
                  priority
                  className="hero-photo-img"
                />
                <span className="hero-bracket hero-bracket--tl" aria-hidden />
                <span className="hero-bracket hero-bracket--br" aria-hidden />
              </div>
              <p ref={taglineRef} className="hero-tagline" style={{ visibility: "hidden" }}>
                I build scalable digital products with{" "}
                <span className="hero-tagline-key">
                  intelligence &amp; precision
                  <span className="hero-tagline-underline" aria-hidden />
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
