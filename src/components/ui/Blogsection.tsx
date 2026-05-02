"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lora } from "next/font/google";
import { BrainCircuit, Sparkles, X, ChevronDown } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";

const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-lora",
});

// ─── Data ─────────────────────────────────────────────────────────────────────

type Thought = {
  id: string;
  number: string;
  title: string;
  raw: string;
  date: string;
  tags: string[];
};

const thoughts: Thought[] = [
  {
    id: "ai-wrappers",
    number: "01",
    title: "On AI tools that actually work",
    raw: "Most AI wrappers are just prompt engineering behind a nice UI. The real work is context management and knowing when NOT to use AI. The best AI feature I've shipped? Knowing when to just use a regex.",
    date: "Apr 2026",
    tags: ["AI", "Engineering"],
  },
  {
    id: "streaming-ux",
    number: "02",
    title: "Why streaming rewired how I think",
    raw: "The moment I saw token streaming in action, I couldn't unsee it. It's not just better UX — it changes how you architect everything downstream. Static responses feel broken to me now.",
    date: "Mar 2026",
    tags: ["UX", "AI"],
  },
  {
    id: "invisible-fullstack",
    number: "03",
    title: "The invisible parts of full-stack",
    raw: "Everyone talks about the stack. Nobody talks about error states, loading skeletons, rate limiting, graceful degradation. That's where apps live or die. That's the real work.",
    date: "Feb 2026",
    tags: ["Engineering", "Craft"],
  },
  {
    id: "learning-algorithms",
    number: "04",
    title: "Learning by building, not reading",
    raw: "I didn't truly understand A* until I watched it paint pixels on a grid I built. Code you can see teaches better than code you only read. That's why I built GridNavigator.",
    date: "Jan 2026",
    tags: ["Algorithms", "Learning"],
  },
];

// ─── Fetch helper ──────────────────────────────────────────────────────────────

async function fetchEnhanced(
  title: string,
  raw: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const prompt = `Expand this raw thought of mine into a deeper reflection — 2 to 3 short, grounded paragraphs. Stay in my voice: direct, specific, honest. No hype, no em dashes. The thought is titled "${title}": ${raw}`;

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
  });

  if (!res.ok || !res.body) throw new Error("Stream failed");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}

// ─── ThoughtCard ──────────────────────────────────────────────────────────────

function ThoughtCard({ thought, index }: { thought: Thought; index: number }) {
  const [enhanced, setEnhanced] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  // Ring is visible when button is hovered, AI is loading, or panel is open
  const ringActive = btnHover || loading || open;

  const handleEnhance = useCallback(async () => {
    if (open) {
      setOpen(false);
      setEnhanced("");
      setError(false);
      return;
    }
    setOpen(true);
    setEnhanced("");
    setError(false);
    setLoading(true);

    try {
      await fetchEnhanced(thought.title, thought.raw, (chunk) => {
        setEnhanced((prev) => prev + chunk);
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [open, thought]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`${lora.variable} group relative`}
    >
      {/* Ghost number watermark */}
      <span
        className="pointer-events-none absolute -top-3 right-4 select-none font-bold leading-none transition-all duration-500 text-white/[0.04] group-hover:text-white/[0.07]"
        style={{ fontSize: "clamp(4rem, 8vw, 6rem)", fontFamily: "ui-monospace, monospace" }}
        aria-hidden="true"
      >
        {thought.number}
      </span>

      {/* ── Ring + Card wrapper ── */}
      <div className="relative">

        {/* ── Animated AI ring (monochrome) ── */}
        <div
          className="pointer-events-none absolute -inset-[2px] rounded-[1.1rem] overflow-hidden transition-opacity duration-500"
          style={{ opacity: ringActive ? 1 : 0 }}
          aria-hidden="true"
        >
          <div
            className="absolute ai-ring-spin"
            style={{
              width: "250%",
              height: "250%",
              top: "50%",
              left: "50%",
              background: loading
                ? "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.6) 8%, rgba(255,255,255,0.9) 20%, rgba(255,255,255,0.6) 32%, transparent 48%)"
                : open
                ? "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.4) 12%, rgba(255,255,255,0.7) 24%, rgba(255,255,255,0.4) 36%, transparent 48%)"
                : "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.3) 10%, rgba(255,255,255,0.5) 18%, transparent 28%)",
              animationDuration: loading ? "1.4s" : "3.5s",
            }}
          />
        </div>

        {/* Soft outer glow */}
        <div
          className="pointer-events-none absolute -inset-[6px] rounded-[1.3rem] blur-[12px] transition-all duration-500"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)",
            opacity: ringActive ? 1 : 0,
          }}
          aria-hidden="true"
        />

        {/* ── Card ── */}
        <div
          className="relative overflow-hidden rounded-2xl p-6 md:p-7 transition-colors duration-500"
          style={{
            background: ringActive ? "#111111" : "#0d0d0d",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {/* Inner radial glow when ring active */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500"
            style={{
              background: "radial-gradient(ellipse 80% 50% at 50% 110%, rgba(255,255,255,0.04) 0%, transparent 70%)",
              opacity: ringActive ? 1 : 0,
            }}
          />

          <div className="relative">

            {/* Meta row */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[0.6rem] font-medium tracking-[0.25em] text-white/30 uppercase">
                {thought.date}
              </span>
              <span className="text-white/10">·</span>
              {thought.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2 py-0.5 text-[0.6rem] font-medium tracking-wide text-white/35 uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3
              className="mb-3 text-lg font-semibold leading-snug text-white/90 transition-colors duration-300 group-hover:text-white md:text-xl"
              style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
            >
              {thought.title}
            </h3>

            {/* Raw thought */}
            <p
              className="text-sm leading-relaxed text-white/50 transition-colors duration-300 group-hover:text-white/65 md:text-[0.9rem]"
              style={{ fontFamily: "var(--font-lora), Georgia, serif", fontStyle: "italic" }}
            >
              &ldquo;{thought.raw}&rdquo;
            </p>

            {/* ── Enhance button ── */}
            <div className="mt-5 flex items-center justify-between">

              <div className="relative">

                {/* Pulse rings on hover */}
                <AnimatePresence>
                  {btnHover && !open && !loading && (
                    <>
                      <motion.span
                        key="pulse-1"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.1, ease: "easeOut", repeat: Infinity }}
                        className="pointer-events-none absolute inset-0 rounded-full border border-white/25"
                      />
                      <motion.span
                        key="pulse-2"
                        initial={{ scale: 1, opacity: 0.35 }}
                        animate={{ scale: 2.8, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.1, ease: "easeOut", delay: 0.3, repeat: Infinity }}
                        className="pointer-events-none absolute inset-0 rounded-full border border-white/15"
                      />
                    </>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleEnhance}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  disabled={loading}
                  className="relative flex items-center gap-2 overflow-hidden rounded-full px-4 py-2 text-[0.7rem] font-semibold tracking-wide uppercase transition-all duration-300"
                  style={{
                    border: open || btnHover || loading
                      ? "1px solid rgba(255,255,255,0.20)"
                      : "1px solid rgba(255,255,255,0.08)",
                    color: open || btnHover || loading
                      ? "rgba(255,255,255,0.85)"
                      : "rgba(255,255,255,0.35)",
                    background: open || loading
                      ? "rgba(255,255,255,0.06)"
                      : btnHover
                      ? "rgba(255,255,255,0.04)"
                      : "transparent",
                    boxShadow: btnHover || open
                      ? "0 0 18px rgba(255,255,255,0.10), 0 0 6px rgba(255,255,255,0.06), inset 0 0 12px rgba(255,255,255,0.04)"
                      : "none",
                    transform: btnHover && !loading ? "translateY(-1.5px)" : "none",
                  }}
                >
                  {/* Shimmer sweep */}
                  {(btnHover || loading) && (
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full btn-shimmer"
                      style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
                      }}
                    />
                  )}

                  {loading ? (
                    <>
                      <span className="thinking-dots inline-flex gap-[3px]">
                        <span className="dot" />
                        <span className="dot" />
                        <span className="dot" />
                      </span>
                      <span>Thinking...</span>
                    </>
                  ) : open ? (
                    <>
                      <X className="h-3 w-3" />
                      <span>Collapse</span>
                    </>
                  ) : (
                    <>
                      <Sparkles
                        className="h-3 w-3 transition-all duration-300"
                        style={{
                          transform: btnHover ? "rotate(20deg) scale(1.3)" : "rotate(0deg) scale(1)",
                          filter: btnHover
                            ? "drop-shadow(0 0 5px rgba(255,255,255,0.6))"
                            : "none",
                        }}
                      />
                      <span>Enhance Thinking</span>
                    </>
                  )}
                </button>
              </div>

              {open && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown className="h-3.5 w-3.5 text-white/30" />
                </motion.div>
              )}
            </div>

            {/* ── Enhanced content panel ── */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-white/[0.06]">
                        <Sparkles className="h-2.5 w-2.5 text-white/50" />
                      </div>
                      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/30">
                        Enhanced Thinking
                      </span>
                    </div>

                    {error ? (
                      <p className="text-sm text-white/40">
                        Couldn&apos;t reach the AI right now. Try again in a moment.
                      </p>
                    ) : (
                      <div
                        className="text-sm leading-relaxed text-white/65 md:text-[0.88rem]"
                        style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
                      >
                        {enhanced}
                        {loading && (
                          <span className="ml-0.5 inline-block h-[1.1em] w-[2px] animate-pulse bg-white/50 align-text-bottom" />
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── BlogSection ──────────────────────────────────────────────────────────────

export function BlogSection() {
  // Cursor-reveal — direct DOM updates, zero re-renders
  const sectionRef      = useRef<HTMLElement>(null);
  const lineRevealRef   = useRef<HTMLDivElement>(null);
  const lineSoftRef     = useRef<HTMLDivElement>(null);
  const spotlightRef    = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const { left, top } = el.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    if (lineRevealRef.current)
      lineRevealRef.current.style.maskImage =
        `radial-gradient(ellipse 280px 160px at ${x}px ${y}px, black 0%, transparent 100%)`;
    if (lineSoftRef.current)
      lineSoftRef.current.style.maskImage =
        `radial-gradient(ellipse 520px 320px at ${x}px ${y}px, black 10%, transparent 100%)`;
    if (spotlightRef.current)
      spotlightRef.current.style.background =
        `radial-gradient(ellipse 600px 340px at ${x}px ${y}px, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 50%, transparent 70%)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const off = "radial-gradient(ellipse 280px 160px at -999px -999px, black 0%, transparent 100%)";
    if (lineRevealRef.current)  lineRevealRef.current.style.maskImage  = off;
    if (lineSoftRef.current)    lineSoftRef.current.style.maskImage    = off;
    if (spotlightRef.current)   spotlightRef.current.style.background  = "transparent";
  }, []);

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="relative w-full bg-[#080808] py-20 md:py-28 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Base ruled lines — always dim */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ruled-base" x="0" y="0" width="100%" height="36" patternUnits="userSpaceOnUse">
              <line x1="0" y1="35.5" x2="100%" y2="35.5" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ruled-base)" />
        </svg>

        {/* Cursor-revealed bright lines — inner zone (wide ellipse, horizontal emphasis) */}
        <div
          ref={lineRevealRef}
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(255,255,255,0.55) 35px, rgba(255,255,255,0.55) 36px)",
            maskImage: "radial-gradient(ellipse 280px 160px at -999px -999px, black 0%, transparent 100%)",
          }}
        />

        {/* Cursor-revealed soft lines — outer zone */}
        <div
          ref={lineSoftRef}
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(255,255,255,0.12) 35px, rgba(255,255,255,0.12) 36px)",
            maskImage: "radial-gradient(ellipse 520px 320px at -999px -999px, black 10%, transparent 100%)",
          }}
        />

        {/* Smooth spotlight */}
        <div ref={spotlightRef} className="absolute inset-0" />

        <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/[0.02] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-white/[0.015] blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_50%,transparent_40%,#080808_100%)]" />
      </div>

      <SectionReveal className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-6">

        {/* Header */}
        <div className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-5 flex items-center gap-3"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
              <BrainCircuit className="h-3.5 w-3.5 text-white/40" />
            </div>
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/40">
              Raw Thoughts
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="leading-[0.92] tracking-tighter"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              fontFamily: "var(--font-lora), Georgia, serif",
            }}
          >
            <span className="text-white">Things I&apos;m</span>
            <br />
            <span className="shimmer-text">working through.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="mt-5 max-w-xl text-sm text-white/30 md:text-base leading-relaxed"
          >
            Unpolished ideas, half-baked opinions, and notes to my future self. Hit{" "}
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.65rem] font-semibold text-white/40 uppercase tracking-wide">
              <Sparkles className="h-2.5 w-2.5" />
              Enhance
            </span>{" "}
            to let the AI expand any thought.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 h-px origin-left"
            style={{
              background: "linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
            }}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {thoughts.map((thought, i) => (
            <ThoughtCard key={thought.id} thought={thought} index={i} />
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center text-[0.7rem] text-white/20"
        >
          More thoughts shipping soon. These are drafts — rough by design.
        </motion.p>

      </SectionReveal>
    </section>
  );
}
