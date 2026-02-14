"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionReveal } from "@/components/ui/section-reveal";

// --- TYPES ---
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

// --- DATA ---
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
    image: "KaryaAI.png",
    video: "https://youtu.be/sQ7IdpM0jQg",
  },
  {
    name: "WatchThis!AI",
    tag: "Full-stack · AI",
    description: "Movie/show recommender powered by AI. Still cooking.",
    tech: ["Next.js", "FastAPI", "PostgreSQL", "Docker"],
    github: "https://github.com/RavangDai/WatchThisAI",
    year: 2026,
    status: "In progress",
    image: "watchthisai.png",
  },
  {
    name: "GridNavigator",
    tag: "Algorithms · Visualization",
    description: "Visualize pathfinding algorithms like A*, Dijkstra, and BFS on interactive grids.",
    tech: ["TypeScript", "React", "Vite"],
    github: "https://github.com/RavangDai/GridNavigator",
    live: "https://grid-navigator-mu.vercel.app/",
    year: 2025,
    status: "Completed",
    image: "gridnav.png",
  },
  {
    name: "TickTickFocus",
    tag: "Productivity · PWA",
    description: "Minimal Pomodoro timer PWA — no distractions, just focus.",
    tech: ["React", "Tailwind", "PWA"],
    github: "https://github.com/RavangDai/TickTickFocus",
    live: "https://tick-tick-focus.vercel.app/",
    year: 2025,
    status: "Completed",
    image: "Ticktick.png",
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
    image: "quotex.png",
  }
];

// --- ANIMATIONS ---
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// --- HELPERS ---
function getYouTubeEmbedUrl(url: string): string | null {
  try {
    // Handle youtu.be/ID format
    const shortMatch = url.match(/youtu\.be\/([\w-]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&rel=0`;
    // Handle youtube.com/watch?v=ID format
    const longMatch = url.match(/[?&]v=([\w-]+)/);
    if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}?autoplay=1&rel=0`;
  } catch { /* ignore */ }
  return null;
}

// --- COMPONENT ---
export function ProjectsSection() {
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [statusFilter, setStatusFilter] = useState<"All" | ProjectStatus>("All");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const activeProject = useMemo(
    () => projects.find((p) => p.name === activeVideo),
    [activeVideo]
  );

  const handlePlayVideo = useCallback((projectName: string) => {
    setActiveVideo(projectName);
  }, []);

  const handleCloseVideo = useCallback(() => {
    setActiveVideo(null);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    if (!activeVideo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseVideo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeVideo, handleCloseVideo]);

  const filteredProjects = useMemo(() => {
    let list = [...projects];
    if (statusFilter !== "All") {
      list = list.filter((p) => p.status === statusFilter);
    }
    list.sort((a, b) => (sort === "newest" ? b.year - a.year : a.year - b.year));
    return list;
  }, [sort, statusFilter]);

  return (
    <section id="projects" className="section-divider relative w-full bg-[#040410] py-16 md:py-24 lg:py-32 overflow-hidden">

      {/* 1. BACKGROUND GRID PATTERN */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Background Ambience (Subtle Purple) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_center,_rgba(168,85,247,0.04),_transparent_60%)]" />

      <SectionReveal className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6">

        {/* HEADER SECTION */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12 md:mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end"
        >
          {/* Left Side: Title & Subtitle */}
          <div className="max-w-3xl space-y-4 md:space-y-6">

            {/* Green Dot Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              Selected Projects
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
              Stuff I&apos;ve <br className="hidden sm:block" />
              <span className="text-indigo-100">built & shipped.</span>
            </h2>

            <p className="max-w-xl text-base md:text-lg text-slate-400 leading-relaxed">
              Real projects, real problems. From full-stack apps to algorithm visualizers.
            </p>
          </div>

          {/* Right Side: Sort Toggle */}
          <div className="flex shrink-0 self-start md:self-auto gap-1 rounded-full border border-white/[0.08] bg-white/[0.02] p-1 backdrop-blur-md">
            {(["newest", "oldest"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSort(option)}
                className={cn(
                  "relative px-4 py-2 md:px-6 text-xs font-semibold rounded-full transition-all duration-300 z-10 tracking-wide",
                  sort === option
                    ? "text-white"
                    : "text-slate-500 hover:text-white"
                )}
              >
                {sort === option && (
                  <motion.span
                    layoutId="filter-pill-v5"
                    className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/[0.08] -z-10 shadow-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* PROJECTS GRID */}
        <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.name}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              viewport={{ once: true, amount: 0.1 }}
              className={cn(
                "group relative flex flex-col overflow-hidden",
                "rounded-2xl md:rounded-[2rem]",
                // Main Background is here on the parent
                "bg-[#08080a]",
                // Default Border
                "border border-white/[0.08]",
                "transition-all duration-500 ease-out",
              )}
            >

              {/* --- GLOW EFFECTS --- */}

              {/* 1. Border Glow (Top Layer) */}
              <div className="pointer-events-none absolute -inset-px z-30 rounded-[inherit] border border-transparent opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:border-purple-500/50" />

              {/* 2. Background Gradient Glow (Bottom Layer) */}
              <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-purple-500/[0.08] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* 3. Corner Accents (Top Layer) */}
              <div className="absolute top-4 right-4 h-2 w-2 border-t border-r border-white/10 transition-colors group-hover:border-purple-500/50 z-20" />
              <div className="absolute bottom-4 left-4 h-2 w-2 border-b border-l border-white/10 transition-colors group-hover:border-purple-500/50 z-20" />


              {/* --- CONTENT --- */}

              {/* Visual Area */}
              <div className="relative aspect-video overflow-hidden bg-[#030305] p-2 z-10">
                <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] shadow-lg">

                  {/* Thumbnail Image */}
                  {project.live ? (
                    <a href={project.live} target="_blank" className="block h-full w-full">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="h-full w-full object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105"
                      />
                    </a>
                  ) : (
                    <img
                      src={project.image}
                      alt={project.name}
                      className="h-full w-full object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />
                  )}

                  {/* Image Glint */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.07] to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Play Button Overlay (only for projects with video) */}
                  {project.video && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePlayVideo(project.name);
                      }}
                      className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition-all duration-300 hover:bg-black/40 group/play"
                      aria-label={`Play ${project.name} demo video`}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-purple-500/80 group-hover/play:border-purple-400/50 group-hover/play:shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                        <Play className="h-6 w-6 fill-current ml-0.5" />
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex flex-1 flex-col justify-between p-5 md:p-6 relative z-10">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2 text-indigo-300">{project.tag}</p>
                      <h3 className="text-xl md:text-2xl font-bold text-white transition-colors group-hover:text-purple-100">{project.name}</h3>
                    </div>

                    <span className={cn(
                      "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider",
                      project.status === "Completed"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                        : "border-amber-500/20 bg-amber-500/10 text-amber-300"
                    )}>
                      {project.status}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-400 line-clamp-2">
                    {project.description}
                  </p>
                </div>

                {/* Footer: Tech & Links */}
                <div className="mt-6 flex flex-col gap-4 border-t border-white/[0.06] pt-4 group-hover:border-white/[0.1] transition-colors">
                  <div className="flex flex-wrap gap-2 items-center">
                    {project.tech.slice(0, 3).map((t) => (
                      <span key={t} className="text-[0.75rem] font-medium text-slate-500">
                        {t}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="text-[0.7rem] text-slate-600">+{project.tech.length - 3}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <a
                      href={project.github}
                      target="_blank"
                      className="flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white group/github"
                    >
                      <Github className="h-4 w-4 transition-transform group-hover/github:scale-110" />
                      <span>Code</span>
                    </a>

                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        className="flex items-center gap-2 text-sm font-semibold text-indigo-300 transition-colors hover:text-purple-200 group/live"
                      >
                        <ExternalLink className="h-4 w-4 transition-transform group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

            </motion.article>
          ))}
        </div>

      </SectionReveal>

      {/* ====== FULLSCREEN VIDEO MODAL ====== */}
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
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-[92vw] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <Play className="h-4 w-4 fill-purple-400 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{activeProject.name}</h3>
                    <p className="text-xs text-slate-400">{activeProject.tag}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseVideo}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 transition-all hover:bg-white/10 hover:text-white hover:scale-105 hover:border-white/20"
                  aria-label="Close video"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Video Container */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-purple-500/5">
                {/* Subtle purple glow behind video */}
                <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 blur-xl" />

                <iframe
                  src={getYouTubeEmbedUrl(activeProject.video!) || activeProject.video}
                  title={`${activeProject.name} demo video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="relative z-10 w-full aspect-video bg-black"
                />
              </div>

              {/* Footer hint */}
              <p className="mt-3 text-center text-xs text-slate-500">
                Press <kbd className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-white/5">Esc</kbd> or click outside to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}