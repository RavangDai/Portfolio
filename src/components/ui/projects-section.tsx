"use client";

import {
  useState, useCallback, useEffect, useRef, useMemo,
} from "react";
import {
  motion, AnimatePresence,
  useMotionValue, useSpring, useTransform,
} from "framer-motion";
import { Play, X, ArrowUpRight, RotateCcw, Loader2 } from "lucide-react";
import { SectionGradientBg } from "@/components/ui/section-gradient-bg";
import { cn } from "@/lib/utils";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectStatus = "Completed" | "In progress";

type Project = {
  name: string;
  tag: string;
  description: string;
  tech: string[];
  github: string;
  live?: string;
  year: number;
  status: ProjectStatus;
  image: string;
  video?: string;
};

type ProjectMatch = {
  name: string;
  score: number;
  matchedRequirements: string[];
  whyItMatters: string;
};

type MatchResult = {
  overallMatch: number;
  summary: string;
  rankedProjects: ProjectMatch[];
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const projects: Project[] = [
  {
    name: "KaryaAI",
    tag: "MERN Stack · Productivity",
    description: "Task manager with JWT auth, MongoDB syncing, and AI-powered task sorting.",
    tech: ["React", "Node.js", "MongoDB", "Express", "Tailwind"],
    github: "https://github.com/RavangDai/SmartTodo",
    live: "https://karyaai.vercel.app/",
    year: 2026,
    status: "Completed",
    image: "/KaryaAI.png",
    video: "https://youtu.be/sQ7IdpM0jQg",
  },
  {
    name: "CrumbCraft",
    tag: "Full-stack · AI · Productivity",
    description:
      "Two AI-powered dev tools in one: Crumb compresses messy conversations into structured docs, Craft helps engineer precise AI prompts with guided templates.",
    tech: ["Next.js", "React", "Tailwind CSS", "Gemini 2.5", "Framer Motion"],
    github: "https://github.com/RavangDai/crumb",
    live: "https://crumbcrraft.vercel.app/",
    year: 2026,
    status: "Completed",
    image: "/CrumbCraft.png",
  },
  {
    name: "Revveal",
    tag: "Full-stack · AI · Data",
    description:
      "Finds underpriced used cars before everyone else. An async Celery + Redis pipeline scrapes marketplaces, predicts fair market price, and ranks listings by discount, behind JWT auth and rate-limited APIs.",
    tech: ["FastAPI", "React", "PostgreSQL", "Celery", "Redis", "Docker"],
    github: "https://github.com/RavangDai/car-deal",
    year: 2026,
    status: "In progress",
    image: "/revveal.png",
  },
  {
    name: "VectorVance",
    tag: "Raspberry Pi · Computer Vision · Robotics",
    description:
      "Autonomous car on Raspberry Pi that follows lanes, detects obstacles and traffic signs via SSD MobileNet, navigates colour-coded forks, and streams live telemetry to a web dashboard.",
    tech: ["Python", "OpenCV", "Flask", "Raspberry Pi", "SSD MobileNet", "PID Control", "NumPy", "lgpio"],
    github: "https://github.com/RavangDai/VectorVance",
    year: 2025,
    status: "Completed",
    image: "/vvdash.png",
  },
  {
    name: "GridNavigator",
    tag: "Algorithms · Visualization",
    description:
      "Visualize pathfinding algorithms like A*, Dijkstra, and BFS on interactive grids.",
    tech: ["TypeScript", "React", "Vite"],
    github: "https://github.com/RavangDai/GridNavigator",
    live: "https://grid-navigator-mu.vercel.app/",
    year: 2025,
    status: "Completed",
    image: "/gridnav.png",
  },
  {
    name: "TickTickFocus",
    tag: "Productivity · PWA",
    description: "Minimal Pomodoro timer PWA. No distractions, just focus.",
    tech: ["React", "Tailwind", "PWA"],
    github: "https://github.com/RavangDai/TickTickFocus",
    live: "https://tick-tick-focus.vercel.app/",
    year: 2025,
    status: "Completed",
    image: "/Ticktick.png",
  },
  {
    name: "Quotex",
    tag: "Frontend · API",
    description: "Random quote generator with theme switching and smooth animations.",
    tech: ["JavaScript", "React", "Tailwind"],
    github: "https://github.com/RavangDai/Quotex",
    live: "https://quotex-five.vercel.app/",
    year: 2024,
    status: "Completed",
    image: "/quotex.png",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const shortMatch = url.match(/youtu\.be\/([\w-]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&rel=0`;
    const longMatch = url.match(/[?&]v=([\w-]+)/);
    if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}?autoplay=1&rel=0`;
  } catch { /* ignore */ }
  return null;
}

function BuildingBadge() {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d + 1) % 4), 520);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-[0.58rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border text-white/50 border-white/10 bg-white/[0.03] inline-flex items-center gap-1">
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white/40" />
      </span>
      Building{".".repeat(dots)}
    </span>
  );
}

// ─── JD Mirror Panel ──────────────────────────────────────────────────────────

type JDMode = "idle" | "analyzing" | "results" | "error";

function ScoreRing({ score }: { score: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const bright = score >= 70 ? "rgba(255,255,255,0.9)" : score >= 40 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)";
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="shrink-0">
      <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
      <motion.circle
        cx="26" cy="26" r={r}
        fill="none"
        stroke={bright}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        transform="rotate(-90 26 26)"
      />
      <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="700"
        fill={bright} fontFamily="monospace">
        {score}
      </text>
    </svg>
  );
}

function JDMirrorPanel({
  jdText, setJdText, jdMode, matchResult, wordCount, onClear,
}: {
  jdText: string;
  setJdText: (v: string) => void;
  jdMode: JDMode;
  matchResult: MatchResult | null;
  wordCount: number;
  onClear: () => void;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 220) + "px";
  }, [jdText]);

  const hasContent = jdText.trim().length > 0;
  const isAnalyzing = jdMode === "analyzing";

  const scoreColor = matchResult
    ? matchResult.overallMatch >= 70
      ? "text-white"
      : matchResult.overallMatch >= 40
      ? "text-white/60"
      : "text-white/35"
    : "text-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group/glass mb-12 md:mb-16 relative overflow-hidden rounded-3xl",
        "border border-white/[0.09]",
        "bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-white/[0.005]",
        "backdrop-blur-2xl",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.07),inset_0_-1px_0_rgba(255,255,255,0.025),0_28px_70px_-30px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.015)]",
      )}
    >
      {/* Top-edge refraction highlight (the "lens cap" line) */}
      <div className="pointer-events-none absolute top-0 inset-x-[14%] h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

      {/* Soft corner blooms */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/[0.025] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-white/[0.018] blur-3xl" />

      {/* Inner specular wash that brightens subtly on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-tr from-transparent via-transparent to-white/[0.02] opacity-60 transition-opacity duration-700 group-hover/glass:opacity-100" />

      {/* Scanning glass shimmer when analyzing */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            key="scan"
            initial={{ x: "-25%", opacity: 0 }}
            animate={{ x: "120%", opacity: [0, 0.7, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-[40%]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 35%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 65%, transparent)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Header bar */}
      <div className="relative flex items-center justify-between gap-4 px-5 py-3.5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full",
                isAnalyzing ? "animate-ping bg-white/50" : "bg-white/25",
              )}
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white/60" />
          </span>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/55">
            JD Mirror
          </span>
          <span className="hidden sm:block text-[0.6rem] text-white/25 tracking-wide">
            paste a role, see what fits
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isAnalyzing && (
            <span className="flex items-center gap-1.5 text-[0.62rem] text-white/40 font-mono">
              <Loader2 className="h-3 w-3 animate-spin" />
              reading {wordCount} words
            </span>
          )}
          {hasContent && !isAnalyzing && (
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/35 hover:text-white/70 transition-colors duration-200"
            >
              <RotateCcw className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results banner shown when analysis is done */}
      <AnimatePresence>
        {jdMode === "results" && matchResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden border-b border-white/[0.05]"
          >
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 px-5 py-5">
              <div className="flex items-baseline gap-2 shrink-0">
                <motion.span
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={cn("font-mono font-black leading-none", scoreColor)}
                  style={{ fontSize: "clamp(2.5rem, 6vw, 3.5rem)" }}
                >
                  {matchResult.overallMatch}
                </motion.span>
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/30 leading-none">
                  %<br />match
                </span>
              </div>

              <div className="hidden sm:block h-10 w-px bg-white/[0.08] shrink-0" />

              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/75 leading-relaxed">
                  &ldquo;{matchResult.summary}&rdquo;
                </p>
                <p className="mt-1.5 text-[0.6rem] text-white/30 font-mono tracking-wide">
                  projects re-sorted by relevance, scroll to explore
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Textarea section. Subtle engraved-channel feel with darker recess + top hairline */}
      <div className="relative px-5 py-4 bg-black/[0.18]">
        <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-white/[0.04]" />
        <textarea
          ref={taRef}
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          disabled={isAnalyzing}
          placeholder="Paste a job description. I'll rank my projects by relevance and surface the requirements each one already covers."
          rows={3}
          className={cn(
            "w-full resize-none bg-transparent text-[0.82rem] leading-relaxed outline-none transition-colors duration-200",
            "text-white/75 placeholder:text-white/25",
            "disabled:opacity-50 disabled:cursor-wait",
          )}
          style={{ minHeight: 72, maxHeight: 220 }}
        />
        {!hasContent && (
          <p className="text-[0.58rem] font-mono text-white/25 tracking-wide mt-1">
            your job description stays on this page
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Screenshot card with 3-D tilt ────────────────────────────────────────────

function ScreenshotCard({
  project, visible, onPlay, side,
}: {
  project: Project;
  visible: boolean;
  onPlay: (name: string) => void;
  side: "left" | "right";
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotX = useSpring(useTransform(rawY, [-1, 1], [8, -8]), { stiffness: 260, damping: 26 });
  const rotY = useSpring(useTransform(rawX, [-1, 1], [-8, 8]), { stiffness: 260, damping: 26 });

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width * 2 - 1);
    rawY.set((e.clientY - rect.top) / rect.height * 2 - 1);
  }, [rawX, rawY]);

  const handleLeave = useCallback(() => { rawX.set(0); rawY.set(0); }, [rawX, rawY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="screenshot"
          initial={{ opacity: 0, scale: 0.82, y: 16, x: side === "right" ? -24 : 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.92, y: 6, filter: "blur(6px)", transition: { duration: 0.12, ease: "easeIn" } }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 800 }}
          className="w-full max-w-[320px] lg:max-w-[380px]"
        >
          <motion.div
            ref={cardRef}
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
            className="group/img relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)] cursor-default"
          >
            <div className="aspect-video overflow-hidden bg-black">
              <img
                src={project.image}
                alt={project.name}
                className="h-full w-full object-cover object-top transition-transform duration-700 group-hover/img:scale-[1.06]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-white/[0.03] opacity-0 transition-opacity duration-500 group-hover/img:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-xs font-semibold text-white/90">{project.name}</p>
              <p className="text-[0.65rem] text-white/45 mt-0.5">{project.tag}</p>
            </div>
            {project.video && (
              <button
                onClick={(e) => { e.stopPropagation(); onPlay(project.name); }}
                aria-label={`Play ${project.name} demo`}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 border border-white/20 backdrop-blur-sm text-white opacity-0 group-hover/img:opacity-100 transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-110 active:scale-95">
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                </span>
              </button>
            )}
            <motion.div
              initial={{ x: "-100%", opacity: 0.6 }}
              animate={{ x: "200%", opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent skew-x-12"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Project info card ─────────────────────────────────────────────────────────

function ProjectCard({
  project, index, total, hovered, onPlay, matchData,
}: {
  project: Project;
  index: number;
  total: number;
  hovered: boolean;
  onPlay: (name: string) => void;
  matchData?: ProjectMatch;
}) {
  const hasMatch = !!matchData;
  const scoreColor = hasMatch
    ? matchData.score >= 70
      ? "text-white"
      : matchData.score >= 40
      ? "text-white/55"
      : "text-white/30"
    : null;

  return (
    <motion.div className="w-full max-w-[400px]">
      {/* Index row */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[0.6rem] font-bold tracking-[0.25em] text-white/20 uppercase">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        {hasMatch && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn("font-mono text-[0.65rem] font-bold tracking-[0.1em]", scoreColor)}
          >
            {matchData.score}% match
          </motion.span>
        )}
      </div>

      {/* Name */}
      <div className="flex items-center gap-2.5 mb-1.5">
        <h3
          className="text-2xl font-bold tracking-tight text-white/90 transition-colors duration-300"
          style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.6rem)" }}
        >
          {project.name}
        </h3>
        {project.video && (
          <button
            onClick={(e) => { e.stopPropagation(); onPlay(project.name); }}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-white/35 hover:border-white/40 hover:text-white hover:bg-white/[0.08] transition-all duration-200 flex-shrink-0"
            aria-label={`Play ${project.name} demo`}
          >
            <Play className="h-2.5 w-2.5 fill-current ml-px" />
          </button>
        )}
      </div>

      {/* Tag + status */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <p className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-white/30">{project.tag}</p>
        {project.status === "Completed" ? (
          <span className="text-[0.58rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border text-white/70 border-white/15 bg-white/[0.05]">
            Shipped
          </span>
        ) : (
          <BuildingBadge />
        )}
        <span className="ml-auto font-mono text-[0.6rem] text-white/20">{project.year}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-white/50 leading-relaxed mb-3 max-w-sm">{project.description}</p>

      {/* JD match: why this project matters */}
      <AnimatePresence>
        {hasMatch && matchData.whyItMatters && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="text-[0.75rem] text-white/40 italic leading-relaxed mb-3 max-w-sm border-l border-white/[0.12] pl-3"
          >
            &ldquo;{matchData.whyItMatters}&rdquo;
          </motion.p>
        )}
      </AnimatePresence>

      {/* JD match: requirement chips */}
      <AnimatePresence>
        {hasMatch && matchData.matchedRequirements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="flex flex-wrap gap-1.5 mb-3"
          >
            {matchData.matchedRequirements.map((req) => (
              <span
                key={req}
                className="text-[0.6rem] font-semibold px-2.5 py-1 rounded-md border border-white/[0.18] bg-white/[0.06] text-white/65 tracking-wide"
              >
                ✓ {req}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tech pills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tech.slice(0, 5).map((t) => (
          <span
            key={t}
            className="text-[0.62rem] font-medium px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.07] text-white/40 hover:text-white/65 hover:border-white/[0.14] transition-all duration-300"
          >
            {t}
          </span>
        ))}
        {project.tech.length > 5 && (
          <span className="text-[0.62rem] px-2.5 py-1 rounded-md bg-white/[0.02] border border-white/[0.05] text-white/25">
            +{project.tech.length - 5}
          </span>
        )}
      </div>

      {/* Links */}
      <div className="flex items-center gap-5">
        <a href={project.github} target="_blank" rel="noreferrer"
          className="flex items-center gap-1.5 text-[0.7rem] font-medium text-white/35 hover:text-white/80 transition-colors duration-200">
          <GithubIcon className="h-3.5 w-3.5" />
          Source
        </a>
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer"
            className="group/live flex items-center gap-1 text-[0.7rem] font-medium text-white/50 hover:text-white transition-colors duration-200">
            Live Demo
            <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ─── Desktop tree row ──────────────────────────────────────────────────────────

function ProjectRow({
  project, index, total, onPlay, matchData, dimmed,
}: {
  project: Project;
  index: number;
  total: number;
  onPlay: (name: string) => void;
  matchData?: ProjectMatch;
  dimmed?: boolean;
}) {
  const isLeft = index % 2 === 0;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      animate={{ opacity: dimmed ? 0.35 : 1 }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative grid grid-cols-[1fr_56px_1fr] items-center py-10 md:py-14"
    >
      {/* Left slot */}
      <div className={cn("flex min-h-[180px] items-center", isLeft ? "justify-end pr-6 md:pr-10" : "justify-start pl-6 md:pl-10")}>
        {isLeft ? (
          <ProjectCard project={project} index={index} total={total} hovered={hovered} onPlay={onPlay} matchData={matchData} />
        ) : (
          <div className="flex justify-end w-full">
            <ScreenshotCard project={project} visible={hovered} onPlay={onPlay} side="left" />
          </div>
        )}
      </div>

      {/* Center spine node */}
      <div className="flex flex-col items-center justify-center relative z-10">
        <motion.div
          className="absolute top-1/2 h-px origin-right"
          animate={{ opacity: hovered ? 1 : 0.3, scaleX: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
          style={{ width: 40, right: "50%", background: "linear-gradient(to left, rgba(255,255,255,0.25), transparent)", display: isLeft ? undefined : "none", translateY: "-50%" }}
        />
        <motion.div
          animate={{ scale: hovered ? 1.6 : 1, boxShadow: hovered ? "0 0 0 5px rgba(255,255,255,0.08), 0 0 24px rgba(255,255,255,0.20)" : "0 0 0 3px rgba(255,255,255,0.05)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="h-3 w-3 rounded-full bg-white/70 border border-white/40 relative z-10"
        />
        <div
          className="absolute left-1/2 top-1/2 h-px -translate-y-1/2 transition-opacity duration-300"
          style={{ width: 40, left: "50%", background: "linear-gradient(to right, rgba(255,255,255,0.25), transparent)", opacity: hovered ? 1 : 0.3, display: !isLeft ? undefined : "none" }}
        />
      </div>

      {/* Right slot */}
      <div className={cn("flex min-h-[180px] items-center", !isLeft ? "justify-start pl-6 md:pl-10" : "justify-start pl-6 md:pl-10")}>
        {!isLeft ? (
          <ProjectCard project={project} index={index} total={total} hovered={hovered} onPlay={onPlay} matchData={matchData} />
        ) : (
          <ScreenshotCard project={project} visible={hovered} onPlay={onPlay} side="right" />
        )}
      </div>
    </motion.article>
  );
}

// ─── Mobile card ───────────────────────────────────────────────────────────────

function MobileProjectCard({
  project, index, total, onPlay, matchData, dimmed,
}: {
  project: Project;
  index: number;
  total: number;
  onPlay: (name: string) => void;
  matchData?: ProjectMatch;
  dimmed?: boolean;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      animate={{ opacity: dimmed ? 0.35 : 1 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden p-5"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative space-y-4">
        <div className="relative overflow-hidden rounded-xl aspect-video border border-white/[0.07]">
          <img src={project.image} alt={project.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {project.video && (
            <button onClick={() => onPlay(project.name)} className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:border-white/40 transition-all duration-200">
                <Play className="h-3.5 w-3.5 fill-white text-white ml-0.5" />
              </span>
            </button>
          )}
        </div>
        {/* Score ring in JD mode */}
        {matchData && (
          <div className="flex items-center gap-3">
            <ScoreRing score={matchData.score} />
            <span className="text-[0.6rem] font-mono text-white/35">{matchData.score >= 70 ? "strong match" : matchData.score >= 40 ? "partial match" : "low relevance"}</span>
          </div>
        )}
        <ProjectCard project={project} index={index} total={total} hovered={false} onPlay={onPlay} matchData={matchData} />
      </div>
    </motion.article>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [activeVideo, setActiveVideo]     = useState<string | null>(null);
  const [jdText, setJdText]               = useState("");
  const [jdMode, setJdMode]               = useState<JDMode>("idle");
  const [matchResult, setMatchResult]     = useState<MatchResult | null>(null);
  const debounceRef                       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorResetRef                     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAnalyzedRef                   = useRef<string>("");
  const inFlightRef                       = useRef<boolean>(false);

  const activeProject = projects.find((p) => p.name === activeVideo);

  const wordCount = useMemo(() =>
    jdText.trim() ? jdText.trim().split(/\s+/).length : 0,
    [jdText]
  );

  // Build a map from project name → matchData for O(1) lookup
  const matchMap = useMemo<Record<string, ProjectMatch>>(() => {
    if (!matchResult) return {};
    return Object.fromEntries(matchResult.rankedProjects.map((m) => [m.name, m]));
  }, [matchResult]);

  // Projects sorted by JD score when in results mode
  const displayProjects = useMemo(() => {
    if (jdMode !== "results" || !matchResult) return projects;
    const order = matchResult.rankedProjects.map((m) => m.name);
    return [...projects].sort((a, b) => {
      const ai = order.indexOf(a.name);
      const bi = order.indexOf(b.name);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }, [jdMode, matchResult]);

  const analyzeJD = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length < 30) return;
    if (inFlightRef.current) return;
    if (trimmed === lastAnalyzedRef.current) return;

    inFlightRef.current = true;
    lastAnalyzedRef.current = trimmed;
    setJdMode("analyzing");
    try {
      const res = await fetch("/api/jd-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd: text }),
      });
      if (!res.ok) throw new Error("API error");
      const data: MatchResult = await res.json();
      setMatchResult(data);
      setJdMode("results");
    } catch {
      lastAnalyzedRef.current = "";
      setJdMode("error");
      if (errorResetRef.current) clearTimeout(errorResetRef.current);
      errorResetRef.current = setTimeout(() => setJdMode("idle"), 3000);
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  // Debounce JD text changes. Only depends on jdText so state changes inside
  // analyzeJD never re-trigger this effect.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = jdText.trim();
    if (trimmed.length < 30) {
      lastAnalyzedRef.current = "";
      setJdMode((m) => (m === "idle" ? m : "idle"));
      setMatchResult((r) => (r === null ? r : null));
      return;
    }
    if (trimmed === lastAnalyzedRef.current) return;
    debounceRef.current = setTimeout(() => analyzeJD(jdText), 1500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [jdText, analyzeJD]);

  // Cleanup pending error-reset timer on unmount
  useEffect(() => {
    return () => {
      if (errorResetRef.current) clearTimeout(errorResetRef.current);
    };
  }, []);

  const handleClear = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (errorResetRef.current) clearTimeout(errorResetRef.current);
    lastAnalyzedRef.current = "";
    setJdText("");
    setJdMode("idle");
    setMatchResult(null);
  }, []);

  const handlePlayVideo  = useCallback((name: string) => setActiveVideo(name), []);
  const handleCloseVideo = useCallback(() => setActiveVideo(null), []);

  useEffect(() => {
    if (!activeVideo) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleCloseVideo(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeVideo, handleCloseVideo]);

  const isJDMode = jdMode === "results";

  return (
    <section id="projects" className="relative w-full bg-[#080808] py-20 md:py-28 overflow-hidden">
      <SectionGradientBg />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 md:mb-12"
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/35 mb-5">
            Selected Work
          </p>
          <h2
            className="font-black font-display tracking-tighter leading-[0.9]"
            style={{ fontSize: "clamp(2.8rem,7vw,5rem)" }}
          >
            <span className="shimmer-text">Built &amp;</span><br />
            <span className="text-white/20">Shipped.</span>
          </h2>
        </motion.div>

        {/* ── JD Mirror Panel ── */}
        <JDMirrorPanel
          jdText={jdText}
          setJdText={setJdText}
          jdMode={jdMode}
          matchResult={matchResult}
          wordCount={wordCount}
          onClear={handleClear}
        />

        {/* ── Desktop tree layout ── */}
        <div className="hidden md:block relative">
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex flex-col items-center pointer-events-none">
            <div className="w-px flex-1" style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.10) 8%, rgba(255,255,255,0.06) 90%, transparent)" }} />
          </div>
          <AnimatePresence mode="popLayout">
            {displayProjects.map((project, index) => {
              const md = matchMap[project.name];
              return (
                <ProjectRow
                  key={project.name}
                  project={project}
                  index={index}
                  total={displayProjects.length}
                  onPlay={handlePlayVideo}
                  matchData={isJDMode ? md : undefined}
                  dimmed={isJDMode && !!md && md.score < 25}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* ── Mobile stacked layout ── */}
        <div className="md:hidden space-y-5">
          <AnimatePresence mode="popLayout">
            {displayProjects.map((project, index) => {
              const md = matchMap[project.name];
              return (
                <MobileProjectCard
                  key={project.name}
                  project={project}
                  index={index}
                  total={displayProjects.length}
                  onPlay={handlePlayVideo}
                  matchData={isJDMode ? md : undefined}
                  dimmed={isJDMode && !!md && md.score < 25}
                />
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      {/* ── Video modal ── */}
      <AnimatePresence>
        {activeVideo && activeProject?.video && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={handleCloseVideo}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-[92vw] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] border border-white/15">
                    <Play className="h-4 w-4 fill-white text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{activeProject.name}</h3>
                    <p className="text-xs text-white/40">{activeProject.tag}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseVideo}
                  className="btn-icon h-10 w-10 !text-white/50 hover:!border-white/30 hover:!bg-white/[0.08] hover:!text-white"
                  aria-label="Close video"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent blur-xl" />
                <iframe
                  src={getYouTubeEmbedUrl(activeProject.video!) || activeProject.video}
                  title={`${activeProject.name} demo`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="relative z-10 w-full aspect-video bg-black"
                />
              </div>
              <p className="mt-3 text-center text-xs text-white/25">
                Press{" "}
                <kbd className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-white/40 border border-white/5">Esc</kbd>
                or click outside to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
