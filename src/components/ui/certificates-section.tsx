"use client";

import { useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionGradientBg } from "@/components/ui/section-gradient-bg";

const sortVariants = {
  enter: (d: number) => ({
    opacity: 0,
    y: d * -40,
    filter: "blur(6px)",
  }),
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.07,
    },
  },
  exit: (d: number) => ({
    opacity: 0,
    y: d * 40,
    filter: "blur(6px)",
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const cardVariants = {
  enter: { opacity: 0, y: 14, scale: 0.98 },
  center: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  exit:   { opacity: 0, scale: 0.97, transition: { duration: 0.2 } },
};
import { ExternalLink, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* TYPES & DATA                                                                */
/* -------------------------------------------------------------------------- */

type Certificate = {
  title: string;
  issuer: string;
  year: number;
  tag: string;
  highlight: string;
  skills: string[];
  url?: string;
};

const certificates: Certificate[] = [
  {
    title: "Software Engineer Certificate",
    issuer: "HackerRank",
    year: 2025,
    tag: "Full-stack Engineering",
    highlight: "Problem-solving, REST APIs, and full-stack architecture.",
    skills: ["Problem Solving", "REST API Design", "Full-stack Arch", "Data Structures"],
    url: "https://www.hackerrank.com/certificates/iframe/1ec7df9efdd8",
  },
  {
    title: "SQL (Advanced) Certificate",
    issuer: "HackerRank",
    year: 2025,
    tag: "Data / Backend",
    highlight: "Complex queries, joins, indexing, and performance tuning.",
    skills: ["Complex Queries", "Joins & Subqueries", "Indexing", "Performance Tuning"],
    url: "https://www.hackerrank.com/certificates/a0f6fb1fb4af",
  },
  {
    title: "Excel Fundamentals – Finance",
    issuer: "Corporate Finance Institute®",
    year: 2024,
    tag: "Finance & Analysis",
    highlight: "Financial modeling, formulas, and data analysis in Excel.",
    skills: ["Financial Modeling", "Pivot Tables", "Data Analysis", "Excel Formulas"],
    url: "https://credentials.corporatefinanceinstitute.com/88b6efc3-2491-4e1d-9e12-433819361baa",
  },
];

/* -------------------------------------------------------------------------- */
/* FLIP CARD                                                                  */
/* -------------------------------------------------------------------------- */

function CertFlipCard({ cert, index }: { cert: Certificate; index: number }) {
  const [flipped, setFlipped] = useState(false);

  // Alternate flip axis per card: Y → X → Y
  const flipOnX = index % 2 === 1;
  const flippedTransform    = flipOnX ? "[transform:rotateX(180deg)]"        : "[transform:rotateY(180deg)]";
  const hoverTransform      = flipOnX ? "group-hover:[transform:rotateX(180deg)]" : "group-hover:[transform:rotateY(180deg)]";
  const backFaceBaseTransform = flipOnX ? "[transform:rotateX(180deg)]"      : "[transform:rotateY(180deg)]";

  // Accent line direction changes with axis to reinforce the flip direction visually
  const accentBase   = "absolute left-0 right-0 h-[1.5px]";
  const topAccent    = { background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25) 30%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0.25) 70%, transparent)" };
  const topAccentBrt = { background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45) 30%, rgba(255,255,255,0.70) 50%, rgba(255,255,255,0.45) 70%, transparent)" };
  // For X-flip cards, the accent runs along the bottom edge on the front (the edge that flips up)
  const xFlipEdge    = flipOnX ? "bottom-0" : "top-0";

  return (
    <div
      className="group h-[300px] [perspective:1200px] cursor-pointer"
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className={cn(
          "relative h-full w-full [transform-style:preserve-3d]",
          "transition-transform duration-[750ms] ease-[cubic-bezier(0.4,0.2,0.2,1)]",
          flipped ? flippedTransform : hoverTransform
        )}
      >

        {/* ════════ FRONT ════════ */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0d0d0d] p-7 flex flex-col justify-between shadow-[0_20px_60px_-12px_rgba(0,0,0,0.6)] transition-shadow duration-500 group-hover:shadow-[0_0_48px_-8px_rgba(255,255,255,0.10)]">

          {/* Accent edge — top for Y-flip cards, bottom for X-flip cards */}
          <div className={cn(accentBase, xFlipEdge)} style={topAccent} />

          {/* Flip-axis hint icon */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className={cn(
              "text-white/20 text-[0.5rem] font-mono tracking-widest uppercase",
              flipOnX ? "rotate-90" : ""
            )}>
              {flipOnX ? "↑↓" : "↔"}
            </div>
          </div>

          {/* Issuer + year */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-3.5 w-3.5 text-white/30" />
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/40">
                {cert.issuer}
              </span>
            </div>
            <span className="text-[0.62rem] font-mono text-white/25">{cert.year}</span>
          </div>

          {/* Title + description */}
          <div className="flex-1 flex flex-col justify-center pt-4">
            <h3 className="text-lg font-bold tracking-tight leading-snug text-white">
              {cert.title}
            </h3>
            <p className="mt-2 text-sm text-white/40 leading-relaxed line-clamp-2">
              {cert.highlight}
            </p>
          </div>

          {/* Tag */}
          <div className="flex items-center pt-2">
            <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-white/30">
              {cert.tag}
            </span>
          </div>

          <div className="pointer-events-none absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-white/[0.02] blur-3xl" />
        </div>

        {/* ════════ BACK ════════ */}
        <div className={cn(
          "absolute inset-0 [backface-visibility:hidden] rounded-2xl overflow-hidden border border-white/[0.10] bg-[#111111] p-7 flex flex-col shadow-[0_20px_60px_-12px_rgba(255,255,255,0.05)]",
          backFaceBaseTransform
        )}>

          {/* Accent edge — opposite edge on back so it appears at same visual edge after flip */}
          <div className={cn(accentBase, flipOnX ? "top-0" : "top-0")} style={topAccentBrt} />

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10">
              <BadgeCheck className="h-4 w-4 text-white/50" />
            </div>
            <div>
              <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-white/35">
                Skills Verified
              </p>
              <p className="text-[0.56rem] text-white/30 mt-0.5">
                {cert.issuer} · {cert.year}
              </p>
            </div>
          </div>

          {/* Skills */}
          <ul className="flex-1 space-y-2.5">
            {cert.skills.map((skill) => (
              <li key={skill} className="flex items-center gap-3">
                <span className="h-[4px] w-[4px] shrink-0 rounded-full bg-white/30" />
                <span className="text-sm font-medium text-white/70">{skill}</span>
              </li>
            ))}
          </ul>

          {/* Verify */}
          {cert.url && (
            <a
              href={cert.url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="group/v mt-5 inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-wider text-white/40 hover:border-white/30 hover:text-white/80 hover:bg-white/[0.08] transition-all duration-200"
            >
              <ExternalLink className="h-3 w-3 transition-transform duration-200 group-hover/v:-translate-y-0.5 group-hover/v:translate-x-0.5" />
              Verify Credential
            </a>
          )}

          <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/[0.02] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/[0.015] blur-3xl" />
        </div>

      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SECTION                                                                    */
/* -------------------------------------------------------------------------- */

export function CertificatesSection() {
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const dirRef = useRef(0);

  const handleSort = (option: "newest" | "oldest") => {
    if (option === sort) return;
    dirRef.current = option === "oldest" ? 1 : -1;
    setSort(option);
  };

  const sortedCertificates = useMemo(() => {
    return [...certificates].sort((a, b) =>
      sort === "newest" ? b.year - a.year : a.year - b.year
    );
  }, [sort]);

  // Cursor-reveal — direct DOM updates, zero re-renders
  return (
    <section
      id="certificates"
      className="relative w-full bg-[#080808] py-20 md:py-28 overflow-hidden"
    >
      <SectionGradientBg />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 md:px-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 md:mb-18 flex flex-col sm:flex-row sm:items-end justify-between gap-8"
        >
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/35 mb-5">
              Certifications
            </p>
            <h2
              className="font-black font-display tracking-tighter leading-[0.9]"
              style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)" }}
            >
              <span className="shimmer-text">Skills I&apos;ve</span><br />
              <span className="text-white/20">proven.</span>
            </h2>
          </div>

          <div className="flex shrink-0 self-start sm:self-auto">
            {(["newest", "oldest"] as const).map((option) => (
              <button
                key={option}
                onClick={() => handleSort(option)}
                className={cn(
                  "relative px-4 pb-3 pt-1 text-[0.65rem] font-semibold tracking-[0.2em] uppercase transition-colors duration-300",
                  sort === option ? "text-white" : "text-white/25 hover:text-white/50"
                )}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[1.5px] w-full origin-left transition-all duration-300",
                    sort === option ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                  )}
                  style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2))" }}
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Ambient gradient centered on the card grid */}
        <div className="pointer-events-none relative -mx-6 mb-[-60px]">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-white/[0.025] blur-[90px]" />
        </div>

        {/* GRID */}
        <AnimatePresence mode="wait" custom={dirRef.current}>
          <motion.div
            key={sort}
            custom={dirRef.current}
            variants={sortVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {sortedCertificates.map((cert, index) => (
              <motion.div key={cert.title} variants={cardVariants} className="group/wrap relative">
                {/* Per-card ambient glow — intensifies on hover */}
                <div
                  className="pointer-events-none absolute -inset-3 rounded-3xl opacity-0 group-hover/wrap:opacity-100 transition-opacity duration-700"
                  style={{
                    background: "radial-gradient(ellipse at 50% 60%, rgba(255,255,255,0.07) 0%, transparent 70%)",
                    filter: "blur(12px)",
                  }}
                />
                <CertFlipCard cert={cert} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
