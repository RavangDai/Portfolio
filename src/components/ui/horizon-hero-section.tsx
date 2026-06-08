"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download, FolderGit2, BadgeCheck, Trophy, Mail } from "lucide-react";
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

// Narrative beats — the blueprint plane scales/pans underneath as you scroll through them.
const BEATS: Beat[] = [
  {
    title: "BIBEK PATHAK",
    line1: "Full-Stack Engineer",
    line2: "AI & ML Developer",
    cta: "primary",
  },
  {
    title: "BUILDER",
    line1: "10+ projects across React, Next.js,",
    line2: "Python and applied AI",
  },
  {
    title: "EXPLORE",
    line1: "Dive into the work —",
    line2: "pick where to go next",
    cta: "explore",
  },
];

const TOTAL_BEATS = BEATS.length;

// Authored chapter labels for the branded scroll indicator (aligned 1:1 with BEATS).
const CHAPTERS = ["IDENTITY", "WORK", "EXPLORE"] as const;

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
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

  // ── Reveal the scroll indicator once ─────────────────────────────────────────
  useEffect(() => {
    if (!isReady || !scrollProgressRef.current) return;
    gsap.set(scrollProgressRef.current, { visibility: "visible" });
    const tween = gsap.from(scrollProgressRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.4,
      ease: "power2.out",
    });
    return () => {
      tween.kill();
    };
  }, [isReady]);

  // ── Scroll handling — drives the beat, progress bar, and the blueprint parallax ──
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;

      setScrollProgress(progress);
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

  // Chapter markers double as a mini-nav: smooth-scroll to the middle of a beat's range.
  const scrollToBeat = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const range = el.offsetHeight - window.innerHeight;
    const top = el.offsetTop + ((i + 0.5) / TOTAL_BEATS) * range;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="hero-container">
      <div className="hero-sticky">
        {/* ── Blueprint scene — scales/pans with scroll (CSS var --p) ── */}
        <div ref={sceneRef} className="hero-blueprint" data-beat={currentSection} aria-hidden>
          <div className="bp-grid" />
          <div className="bp-grid bp-grid--fine" />

          {/* Geometric monuments — parallax at different speeds */}
          <div className="bp-monument bp-initials">BP</div>
          <div className="bp-monument bp-bar" />
          <div className="bp-monument bp-ring" />
          <div className="bp-monument bp-square" />
          <div className="bp-monument bp-rule bp-rule--a" />
          <div className="bp-monument bp-rule bp-rule--b" />

          {/* Crosshair marker */}
          <div className="bp-cross">
            <span className="bp-cross-h" />
            <span className="bp-cross-v" />
          </div>

          {/* Mono telemetry */}
          <span className="bp-tele bp-tele--tl">30.4515°N / 90.4815°W</span>
          <span className="bp-tele bp-tele--tr">STATUS: AVAILABLE</span>
          <span className="bp-tele bp-tele--bl">BUILD // 2026</span>
          <span className="bp-tele bp-tele--br">SECTOR 0{currentSection + 1}</span>

          {/* Beat-1 stat words (revealed via [data-beat="1"]) */}
          <div className="bp-stats">
            <span>10+</span>
            <span>REACT</span>
            <span>PYTHON</span>
          </div>
        </div>

        {/* ── Beat content ── */}
        <div className="hero-content">
          <div key={currentSection} className="hero-beat-inner">
            {currentSection === 0 && (
              <span className="role-badge">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--cobalt)] opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--cobalt)]" />
                </span>
                Available for Work
              </span>
            )}

            <h1 ref={titleRef} className="hero-title">
              {splitTitle(beat.title)}
            </h1>

            <div ref={subtitleRef} className="hero-subtitle">
              <p className="subtitle-line">{beat.line1}</p>
              <p className="subtitle-line">{beat.line2}</p>
            </div>

            {beat.cta === "primary" && (
              <div className="hero-actions">
                <button
                  className="brut-btn-cobalt group"
                  onClick={() => (window.location.href = "/achievements")}
                >
                  View Achievements
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <button
                  className="brut-btn-dark"
                  onClick={() => window.open("/Bibek_Pathak_Resume_Mar26.pdf", "_blank")}
                >
                  Download Resume
                  <Download className="h-3.5 w-3.5" />
                </button>
                <a
                  href="https://github.com/RavangDai"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="brut-icon-dark"
                >
                  <FaGithub className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/bibek-pathak-10398a301/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="brut-icon-dark"
                >
                  <FaLinkedinIn className="h-5 w-5" />
                </a>
              </div>
            )}

            {beat.cta === "explore" && (
              <div className="hero-explore-grid">
                {EXPLORE_LINKS.map(({ href, label, desc, Icon }) => (
                  <Link key={href} href={href} className="hero-explore-card group">
                    <Icon className="hero-explore-icon" />
                    <span className="hero-explore-label">{label}</span>
                    <span className="hero-explore-desc">{desc}</span>
                    <ArrowUpRight className="hero-explore-arrow" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Branded chapter markers + progress (scoped to the hero) */}
        <div ref={scrollProgressRef} className="scroll-progress" style={{ visibility: "hidden" }}>
          <div className="hero-chapters">
            {CHAPTERS.map((name, i) => (
              <button
                key={name}
                type="button"
                onClick={() => scrollToBeat(i)}
                className={`hero-chapter${i === currentSection ? " is-active" : ""}`}
                aria-label={`Go to ${name}`}
              >
                <span className="hero-chapter-idx">{String(i).padStart(2, "0")}</span>
                <span className="hero-chapter-name">{name}</span>
              </button>
            ))}
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${scrollProgress * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
