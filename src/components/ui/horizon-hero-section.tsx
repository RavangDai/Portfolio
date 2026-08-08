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

// Narrative beats — the pinned stage swaps its left column across these.
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
    // T-shaped expertise — the finale. Depth (the T's stem) is real-time computer vision; breadth
    // (the crossbar) spans AI/ML + software. Its sublines are used as-is (not CMS-driven like 0/1).
    title: "T-SHAPED",
    line1: "Deep in real-time computer vision,",
    line2: "broad across AI/ML and software.",
  },
];

const TOTAL_BEATS = BEATS.length;

// Beat 01 proof cards — concrete evidence that I build & ship.
const PROOF = [
  { name: "KaryaAI", tag: "Full-stack · AI" },
  { name: "DollarPilot", tag: "Hackathon Winner" },
  { name: "VectorVance", tag: "Computer Vision" },
] as const;

// Tech-stack marquee — a persistent hard-bordered ticker across the hero base (Gumroad-style
// energy, in the warm-brutalist palette). Rendered twice back-to-back for a seamless loop.
const STACK = [
  "REACT", "NEXT.JS", "TYPESCRIPT", "NODE", "PYTHON",
  "AI / ML", "COMPUTER VISION", "TAILWIND", "POSTGRES", "GSAP",
] as const;

// Beat 02 — T-shaped expertise. BREADTH caps the crossbar; DEPTH_LAYERS descend the stem to
// give the vertical "length" concrete weight. Design content, so it lives here like PROOF/STACK.
const BREADTH = ["AI / ML", "SWE"] as const;
// The stem's layers are Cruze's actual perception stages, so the depth claim points at shipped work.
const DEPTH_LAYERS = ["Detection", "Depth", "Tracking"] as const;

// Editable hero copy + links come from the content doc (`site.*`), so the CMS drives them without
// a redeploy. Falls back to DEFAULT_CONTENT.site for the read-only / no-token case.
export const Component = ({ site = DEFAULT_CONTENT.site }: { site?: SiteInfo } = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
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

  // ── Scroll handling — GSAP ScrollTrigger scrubs a 0→1 proxy across the 300vh container, which
  // drives the beat index. `scrub` eases the catch-up for a smooth, inertial feel; the sticky CSS
  // frame does the pinning. Reduced-motion drops the smoothing. ──
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const proxy = { p: 0 };

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
        const newSection = Math.min(Math.floor(proxy.p * TOTAL_BEATS), TOTAL_BEATS - 1);
        setCurrentSection((s) => (s === newSection ? s : newSection));
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  // (The pointer-parallax effect that lived here drove the blueprint's depth planes via
  // --mx/--my. With the backdrop gone it had no consumer, so the pointermove listener and its
  // rAF loop were removed rather than left running for nothing.)

  const splitTitle = (text: string) =>
    text.split("").map((char, i) => (
      <span key={i} className="title-char">
        {char}
      </span>
    ));

  const beat = BEATS[currentSection];
  // Sublines: IDENTITY + BUILDER are CMS-editable (hero* / builder*); the T-SHAPED finale uses its
  // own beat copy (structural, not portfolio data), so it falls through to beat.line1/2.
  const beatLine1 = currentSection === 0 ? site.heroLine1 : currentSection === 1 ? site.builderLine1 : beat.line1;
  const beatLine2 = currentSection === 0 ? site.heroLine2 : currentSection === 1 ? site.builderLine2 : beat.line2;

  // Per-beat entrance for the swapping left column. IDENTITY keeps its left-hinged page-turn; the
  // centered beats (BUILDER + T-SHAPED, portrait gone, one column) rise up + settle. Because
  // AnimatePresence mode="wait" preserves an exiting element's last-rendered props, branching on
  // currentSection gives the leaving page beat-0's exit and the entering page's entrance.
  const stageMotion =
    currentSection >= 1
      ? {
          initial: { opacity: 0, y: reduceMotion ? 0 : 44, scale: reduceMotion ? 1 : 0.965 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.98 },
          origin: "center",
        }
      : {
          initial: { opacity: 0, rotateY: reduceMotion ? 0 : -32, x: reduceMotion ? 0 : 64 },
          animate: { opacity: 1, rotateY: 0, x: 0 },
          exit: { opacity: 0, rotateY: reduceMotion ? 0 : 24, x: reduceMotion ? 0 : -48 },
          origin: "left center",
        };

  return (
    <div ref={containerRef} className="hero-container">
      <div className="hero-sticky">
        {/* No decorative backdrop. The hero is warm paper, the type, and the portrait — the
            abstract drafting marks (grid, dimension line, triangle, target node) were removed
            deliberately: they were ornament that said nothing about the work. */}

        {/* Top bar — monogram */}
        <div className="hero-topbar" aria-hidden>
          <span className="hero-monogram">
            <Image src="/brand/mark.png" alt="Bibek Pathak" width={219} height={326} className="hero-monogram-img" priority />
          </span>
        </div>

        {/* ── Pinned stage: left column swaps per beat, right (photo) persists ── */}
        <div className="hero-content">
          <div className="hero-stage" data-beat={currentSection}>
            {/* LEFT — each beat is a "page" hinged at its left edge: the IDENTITY page swings away
                while the BUILDER page turns in from the right, like leafing through a blueprint. */}
            <div className="hero-stage-left-wrap" style={{ perspective: reduceMotion ? undefined : 1400 }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentSection}
                  className="hero-stage-left"
                  data-beat={currentSection}
                  style={{ transformOrigin: stageMotion.origin }}
                  initial={stageMotion.initial}
                  animate={stageMotion.animate}
                  exit={stageMotion.exit}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
              {/* Visual title only. The page's single real <h1> is the SSR'd sr-only one in
                  app/page.tsx — this hero is ssr:false, so it can't carry the heading for
                  crawlers, and marking it <h1> just produced a duplicate at runtime. */}
              <div className="hero-title hero-id-name">
                {currentSection === 0 ? (
                  <>
                    <span className="title-line">{splitTitle("BIBEK")}</span>
                    <span className="title-line">{splitTitle("PATHAK")}</span>
                  </>
                ) : (
                  splitTitle(beat.title)
                )}
              </div>

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
                  {PROOF.map((p) => (
                    <div key={p.name} className="hero-proof-card">
                      <span className="hero-proof-name">{p.name}</span>
                      <span className="hero-proof-tag">{p.tag}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Beat 02 — a literal, outlined capital T. The disciplines live INSIDE the wide
                  crossbar (breadth); computer vision + its pipeline stages live INSIDE the centered
                  stem (depth), which merges into the bar's underside. BREADTH / DEPTH annotate the
                  two axes from outside the glyph. */}
              {currentSection === 2 && (
                <div
                  className="hero-tee"
                  aria-label="T-shaped skills: broad across AI/ML and software engineering, deep in real-time computer vision"
                >
                  <span className="hero-tee-tag hero-tee-tag--breadth">BREADTH</span>
                  <div className="hero-tee-glyph">
                    <div className="hero-tee-bar">
                      {BREADTH.map((b) => (
                        <span className="hero-tee-cap" key={b}>{b}</span>
                      ))}
                    </div>
                    <div className="hero-tee-stem">
                      <span className="hero-tee-stem-title">COMPUTER VISION</span>
                      <ul className="hero-tee-layers">
                        {DEPTH_LAYERS.map((l) => (
                          <li key={l}>{l}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <span className="hero-tee-tag hero-tee-tag--depth">DEPTH</span>
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

        {/* Tech-stack ticker — persistent hard-bordered marquee pinned to the hero base.
            Rendered twice back-to-back so the -50% scroll loops seamlessly. */}
        <div className="hero-marquee" aria-hidden>
          <div className="hero-marquee-track">
            {[...STACK, ...STACK].map((tech, i) => (
              <span className="hero-marquee-chip" key={i}>{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
