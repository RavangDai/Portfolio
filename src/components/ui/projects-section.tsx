"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
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

// Bento span per project index — featured (KaryaAI, VectorVance) are 2×2; tiles fit a 4-col mosaic.
const SPANS = [
  "col-span-2 row-span-2",                      // 0 KaryaAI    — featured
  "col-span-2 md:col-span-2",                   // 1 CrumbCraft — wide
  "col-span-2 md:col-span-2",                   // 2 Revveal    — wide
  "col-span-2 row-span-2",                      // 3 VectorVance— featured
  "col-span-2 md:col-span-2",                   // 4 GridNav    — wide
  "col-span-1 md:col-span-1",                   // 5 TickTick   — small
  "col-span-1 md:col-span-1",                   // 6 Quotex     — small
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
    <span className="glass-chip text-[0.55rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full text-white/60 inline-flex items-center gap-1">
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white/40" />
      </span>
      Building{".".repeat(dots)}
    </span>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  if (status === "In progress") return <BuildingBadge />;
  return (
    <span className="glass-chip text-[0.55rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full text-white/75">
      Shipped
    </span>
  );
}

// ─── Bento tile ─────────────────────────────────────────────────────────────────

function BentoTile({
  project, index, featured, onOpen,
}: {
  project: Project;
  index: number;
  featured: boolean;
  onOpen: (i: number) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "bento-tile group relative overflow-hidden text-left",
        SPANS[index]
      )}
      aria-label={`Open ${project.name}`}
    >
      {/* Screenshot */}
      <img
        src={project.image}
        alt={project.name}
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
      />

      {/* Readability gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
      {/* Hover sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Top row: badge + (video marker) */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
        <StatusBadge status={project.status} />
        {project.video && (
          <span className="glass-chip flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-110">
            <Play className="h-3 w-3 fill-current ml-0.5" />
          </span>
        )}
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-4">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <h3
              className={cn(
                "font-bold tracking-tight text-white truncate",
                featured ? "text-xl md:text-2xl" : "text-sm md:text-base"
              )}
            >
              {project.name}
            </h3>
            <p className="mt-0.5 text-[0.6rem] md:text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white/45 truncate">
              {project.tag}
            </p>
          </div>
          <span className="font-mono text-[0.6rem] text-white/30 shrink-0">{project.year}</span>
        </div>

        {/* Featured-only: description + tech, revealed on hover */}
        {featured && (
          <div className="mt-2 max-h-0 overflow-hidden opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:max-h-28 group-hover:opacity-100">
            <p className="text-xs text-white/60 leading-relaxed line-clamp-2">{project.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.tech.slice(0, 4).map((t) => (
                <span key={t} className="text-[0.58rem] font-medium px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.10] text-white/55">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click affordance */}
      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </motion.button>
  );
}

// ─── Gallery lightbox ────────────────────────────────────────────────────────────

function GalleryLightbox({
  index, onClose, onNavigate,
}: {
  index: number;
  onClose: () => void;
  onNavigate: (dir: 1 | -1) => void;
}) {
  const project = projects[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />

      {/* Prev / Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(-1); }}
        aria-label="Previous project"
        className="btn-icon absolute left-3 sm:left-6 top-1/2 z-20 h-11 w-11 -translate-y-1/2 !text-white/60 hover:!text-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(1); }}
        aria-label="Next project"
        className="btn-icon absolute right-3 sm:right-6 top-1/2 z-20 h-11 w-11 -translate-y-1/2 !text-white/60 hover:!text-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <motion.div
        key={project.name}
        initial={{ scale: 0.94, opacity: 0, y: 18 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 10 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="liquid-glass relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl lg:grid-cols-[1.4fr_1fr]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media */}
        <div className="relative aspect-video bg-black lg:aspect-auto">
          {project.video ? (
            <iframe
              src={getYouTubeEmbedUrl(project.video) || project.video}
              title={`${project.name} demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full bg-black"
            />
          ) : (
            <img src={project.image} alt={project.name} className="h-full w-full object-cover object-top" />
          )}
        </div>

        {/* Details */}
        <div className="relative z-10 flex flex-col p-6 md:p-7">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-2xl font-bold tracking-tight text-white">{project.name}</h3>
              <StatusBadge status={project.status} />
            </div>
            <button
              onClick={onClose}
              className="btn-icon h-9 w-9 shrink-0 !text-white/50 hover:!text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/35">
            {project.tag} <span className="text-white/20">· {project.year}</span>
          </p>

          <p className="mt-4 text-sm text-white/65 leading-relaxed">{project.description}</p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-[0.62rem] font-medium px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/[0.12] text-white/60"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-5 pt-6">
            <a href={project.github} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-[0.75rem] font-medium text-white/45 hover:text-white transition-colors duration-200">
              <GithubIcon className="h-4 w-4" />
              Source
            </a>
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer"
                className="group/live flex items-center gap-1 text-[0.75rem] font-semibold text-white/60 hover:text-white transition-colors duration-200">
                Live Demo
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5" />
              </a>
            )}
            <span className="ml-auto font-mono text-[0.6rem] text-white/30">
              {index + 1} / {projects.length}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const open = useCallback((i: number) => setActiveIndex(i), []);
  const close = useCallback(() => setActiveIndex(null), []);
  const navigate = useCallback((dir: 1 | -1) => {
    setActiveIndex((cur) => (cur === null ? cur : (cur + dir + projects.length) % projects.length));
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") navigate(1);
      else if (e.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, close, navigate]);

  return (
    <section id="projects" className="relative w-full bg-[#080808]/72 py-20 md:py-28 overflow-hidden">
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

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[148px] sm:auto-rows-[168px] gap-3 md:gap-4">
          {projects.map((project, index) => (
            <BentoTile
              key={project.name}
              project={project}
              index={index}
              featured={SPANS[index].includes("row-span-2")}
              onOpen={open}
            />
          ))}
        </div>
      </div>

      {/* Gallery lightbox */}
      <AnimatePresence>
        {activeIndex !== null && (
          <GalleryLightbox index={activeIndex} onClose={close} onNavigate={navigate} />
        )}
      </AnimatePresence>
    </section>
  );
}
