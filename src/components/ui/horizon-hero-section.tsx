"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowRight, Download } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { SiteInfo } from "@/lib/content/types";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { HighlightText } from "@/components/ui/highlight";

// ─── Types ────────────────────────────────────────────────────────────────────

type Beat = {
  title: string;
  line1: string;
  line2: string;
  cta?: "primary" | "explore";
};

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
];

const TOTAL_BEATS = BEATS.length;

// Authored chapter labels for the per-beat "SECTOR" readout (aligned 1:1 with BEATS).
const CHAPTERS = ["IDENTITY", "BUILDER"] as const;

// Beat 01 proof cards — concrete evidence that I build & ship.
const PROOF = [
  { name: "KaryaAI", tag: "Full-stack · AI" },
  { name: "DollarPilot", tag: "Hackathon Winner" },
  { name: "VectorVance", tag: "Computer Vision" },
] as const;

// Editable hero copy + links come from the content doc (`site.*`), so the CMS drives them without
// a redeploy. Falls back to DEFAULT_CONTENT.site for the read-only / no-token case.
export const Component = ({ site = DEFAULT_CONTENT.site }: { site?: SiteInfo } = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const reduceMotion = useReducedMotion();

  // ── Ready on mount (no WebGL boot to wait for) ───────────────────────────────
  useEffect(() => {
    setIsReady(true);
  }, []);

  // ── Tagline statement card — fade/lift in once ──
  useEffect(() => {
    if (!isReady || !taglineRef.current) return;
    const el = taglineRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set(el, { visibility: "visible", opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { visibility: "visible", opacity: 0, y: 16 });
      gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.5 });
    }, el);

    return () => ctx.revert();
  }, [isReady]);

  // ── Scroll handling — GSAP ScrollTrigger scrubs --p across the 300vh container, which drives
  // the camera dolly + fly-past and the beat index. `scrub` eases the catch-up for a smooth,
  // inertial feel; the sticky CSS frame does the pinning. Reduced-motion drops the smoothing. ──
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const proxy = { p: 0 };
    const setVar = (p: number) => sceneRef.current?.style.setProperty("--p", p.toFixed(4));

    const tween = gsap.to(proxy, {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: reduce ? true : 0.8,
      },
      onUpdate: () => {
        setVar(proxy.p);
        const newSection = Math.min(Math.floor(proxy.p * TOTAL_BEATS), TOTAL_BEATS - 1);
        setCurrentSection((s) => (s === newSection ? s : newSection));
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const splitTitle = (text: string) =>
    text.split("").map((char, i) => (
      <span key={i} className="title-char">
        {char}
      </span>
    ));

  const beat = BEATS[currentSection];
  // Both beats' sublines are CMS-editable: IDENTITY uses hero*, BUILDER uses builder*.
  const beatLine1 = currentSection === 0 ? site.heroLine1 : site.builderLine1;
  const beatLine2 = currentSection === 0 ? site.heroLine2 : site.builderLine2;

  return (
    <div ref={containerRef} className="hero-container">
      <div className="hero-sticky">
        {/* Calm creamy scene: just the camera push-in (--p on the wrapper) + the near fly-past
            markers. No grid / drafting marks — the paper stays clean behind the name + portrait. */}
        <div ref={sceneRef} className="hero-blueprint" data-beat={currentSection} aria-hidden>
          <span className="bp-fly bp-fly--a" />
          <span className="bp-fly bp-fly--b" />
          <span className="bp-fly bp-fly--c" />
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
            {/* LEFT — each beat is a "page": the old one tears away sideways as the next turns in */}
            <div className="hero-stage-left-wrap">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentSection}
                  className="hero-stage-left"
                  data-beat={currentSection}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduceMotion ? 0 : -40 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
              <span className="hero-sector">
                SECTOR {String(currentSection).padStart(2, "0")} · {CHAPTERS[currentSection]}
              </span>

              <h1 className="hero-title hero-id-name">
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

              <div className="hero-subtitle hero-id-sub">
                <p className="subtitle-line">
                  <HighlightText mode="reveal" ink>{beatLine1}</HighlightText>
                </p>
                <p className="subtitle-line">{beatLine2}</p>
              </div>

              {/* Beat 00 — CTAs */}
              {currentSection === 0 && (
                <div className="hero-actions">
                  <button className="brut-btn-cobalt group" onClick={() => (window.location.href = "#projects")}>
                    View Projects
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                  <button className="brut-btn-dark" onClick={() => window.open(site.resumeUrl, "_blank")}>
                    Download Resume
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  <a href={site.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className="brut-icon-dark">
                    <FaGithub className="h-5 w-5" />
                  </a>
                  <a href={site.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="brut-icon-dark">
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

                </motion.div>
              </AnimatePresence>
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
                <span className="hero-tagline-key" style={{ color: "var(--cobalt)" }}>
                  intelligence &amp; precision
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
