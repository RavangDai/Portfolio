"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      staggerChildren: 0.06,
    },
  },
  exit: (d: number) => ({
    opacity: 0,
    y: d * 40,
    filter: "blur(6px)",
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const rowVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  exit:   { opacity: 0, y: -6, transition: { duration: 0.2 } },
};
import { Github, Play, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
    image: "/KaryaAI.png",
    video: "https://youtu.be/sQ7IdpM0jQg",
  },
  {
    name: "CrumbCraft",
    tag: "Full-stack · AI · Productivity",
    description: "Two AI-powered dev tools in one: Crumb compresses messy conversations into structured docs, Craft helps engineer precise AI prompts with guided templates.",
    tech: ["Next.js", "React", "Tailwind CSS", "Gemini 2.5", "Framer Motion"],
    github: "https://github.com/RavangDai/crumb",
    live: "https://crumbcrraft.vercel.app/",
    year: 2026,
    status: "Completed",
    image: "/CrumbCraft.png",
  },
  {
    name: "WatchThis!AI",
    tag: "Full-stack · AI",
    description: "Movie/show recommender powered by AI. Still cooking.",
    tech: ["Next.js", "FastAPI", "PostgreSQL", "Docker"],
    github: "https://github.com/RavangDai/WatchThisAI",
    year: 2026,
    status: "In progress",
    image: "/watchthisai.png",
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
    image: "/gridnav.png",
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

// --- HELPERS ---
function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const shortMatch = url.match(/youtu\.be\/([\w-]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&rel=0`;
    const longMatch = url.match(/[?&]v=([\w-]+)/);
    if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}?autoplay=1&rel=0`;
  } catch { /* ignore */ }
  return null;
}

// --- COMPONENT ---
export function ProjectsSection() {
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const dirRef = useRef(0);

  const handleSort = (option: "newest" | "oldest") => {
    if (option === sort) return;
    dirRef.current = option === "oldest" ? 1 : -1;
    setSort(option);
  };
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

  useEffect(() => {
    if (!activeVideo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseVideo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeVideo, handleCloseVideo]);

  const filteredProjects = useMemo(() => {
    return [...projects].sort((a, b) =>
      sort === "newest" ? b.year - a.year : a.year - b.year
    );
  }, [sort]);

  return (
    <section id="projects" className="relative w-full bg-[#030C08] py-20 md:py-28 overflow-hidden">

      {/* ── Circuit board background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* PCB trace SVG pattern — slowly breathes */}
        <motion.svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ opacity: [0.07, 0.12, 0.07] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <defs>
            <pattern id="pcb" x="0" y="0" width="96" height="96" patternUnits="userSpaceOnUse">
              <line x1="0" y1="48" x2="96" y2="48" stroke="#10b981" strokeWidth="0.6"/>
              <line x1="48" y1="0" x2="48" y2="96" stroke="#10b981" strokeWidth="0.6"/>
              <line x1="0" y1="18" x2="28" y2="18" stroke="#10b981" strokeWidth="0.5"/>
              <line x1="28" y1="18" x2="28" y2="0" stroke="#10b981" strokeWidth="0.5"/>
              <line x1="96" y1="76" x2="68" y2="76" stroke="#10b981" strokeWidth="0.5"/>
              <line x1="68" y1="76" x2="68" y2="96" stroke="#10b981" strokeWidth="0.5"/>
              <line x1="18" y1="48" x2="18" y2="72" stroke="#10b981" strokeWidth="0.4"/>
              <line x1="0" y1="72" x2="36" y2="72" stroke="#10b981" strokeWidth="0.4"/>
              <circle cx="48" cy="48" r="2.5" fill="none" stroke="#34d399" strokeWidth="0.8"/>
              <circle cx="28" cy="18" r="1.5" fill="#34d399"/>
              <circle cx="68" cy="76" r="1.5" fill="#34d399"/>
              <circle cx="18" cy="72" r="1" fill="#34d399"/>
              <circle cx="48" cy="18" r="1" fill="#34d399" opacity="0.5"/>
              <circle cx="78" cy="48" r="1" fill="#34d399" opacity="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pcb)"/>
        </motion.svg>

        {/* 3 data-pulse dots on different horizontal traces */}
        {[
          { top: "22%", delay: "0s",    duration: "3.8s", width: "55%" },
          { top: "50%", delay: "1.4s",  duration: "5.2s", width: "70%" },
          { top: "74%", delay: "2.8s",  duration: "4.4s", width: "45%" },
        ].map((p, i) => (
          <div key={i} className="absolute h-[1px]" style={{ top: p.top, left: "-4px", width: p.width }}>
            <div
              className="absolute h-[3px] w-[3px] rounded-full bg-emerald-400 top-1/2 -translate-y-1/2"
              style={{
                animation: `data-pulse ${p.duration} ease-in-out ${p.delay} infinite`,
                boxShadow: "0 0 6px 2px rgba(52,211,153,0.55)",
              }}
            />
          </div>
        ))}

        {/* Soft corner glows */}
        <div className="absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full bg-cyan-600/[0.06] blur-[100px] animate-aurora-2" />
        <div className="absolute -bottom-20 -left-20 h-[350px] w-[350px] rounded-full bg-emerald-600/[0.05] blur-[90px] animate-aurora-3" />

        {/* Edge vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_50%,transparent_50%,#030C08_100%)]" />
      </div>


      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 md:mb-20 flex flex-col sm:flex-row sm:items-end justify-between gap-8"
        >
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-emerald-400/70 mb-5">
              Selected Work
            </p>
            <h2
              className="font-bold tracking-tighter leading-[0.9]"
              style={{ fontSize: "clamp(2.8rem,7vw,5rem)" }}
            >
              <span className="shimmer-text">Built &amp;</span><br />
              <span className="text-white/20">Shipped.</span>
            </h2>
          </div>

          {/* Sort — underline tabs */}
          <div className="flex shrink-0 self-start sm:self-auto">
            {(["newest", "oldest"] as const).map((option) => (
              <button
                key={option}
                onClick={() => handleSort(option)}
                className={cn(
                  "relative px-4 pb-3 pt-1 text-[0.65rem] font-semibold tracking-[0.2em] uppercase transition-colors duration-300",
                  sort === option ? "text-white" : "text-slate-600 hover:text-slate-400"
                )}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
                {/* Animated gradient underline */}
                <span className={cn(
                  "absolute bottom-0 left-0 h-[1.5px] w-full origin-left transition-all duration-400",
                  sort === option
                    ? "scale-x-100 opacity-100"
                    : "scale-x-0 opacity-0"
                )}
                  style={{ background: "linear-gradient(90deg, #10b981, #22d3ee)" }}
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* PROJECTS LIST */}
        <div className="relative">

          {/* Top rule */}
          <div className="h-px w-full bg-white/[0.05]" />

          <AnimatePresence mode="wait" custom={dirRef.current}>
          <motion.div
            key={sort}
            custom={dirRef.current}
            variants={sortVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.name}
              variants={rowVariants}
              className="group relative border-b border-white/[0.06] py-8 md:py-10"
            >
              {/* Hover wash */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />

              {/* Left accent bar */}
              <motion.div
                className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full bg-gradient-to-b from-emerald-400 to-cyan-400"
                initial={{ scaleY: 0, opacity: 0 }}
                whileHover={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ originY: 0 }}
              />

              <div className="relative flex items-start gap-5 md:gap-8 pl-1">

                {/* Index number */}
                <span
                  className="shrink-0 select-none font-black text-white tracking-tighter leading-none mt-0.5 font-mono hidden sm:block w-8 text-right"
                  style={{ fontSize: "clamp(1.1rem,1.8vw,1.4rem)", opacity: 0.12 }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Main content */}
                <div className="flex-1 min-w-0 flex flex-col md:flex-row gap-6 md:gap-10">

                  {/* Text content */}
                  <div className="flex-1 min-w-0 space-y-3">

                    {/* Top row: name + status + year */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white/90 group-hover:text-white transition-colors duration-200">
                          {project.name}
                        </h3>
                        {project.video && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handlePlayVideo(project.name); }}
                            className="flex items-center justify-center h-6 w-6 rounded-full border border-emerald-500/30 text-emerald-400/60 hover:border-emerald-400/60 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all duration-200"
                            aria-label={`Play ${project.name} demo`}
                          >
                            <Play className="h-2.5 w-2.5 fill-current ml-px" />
                          </button>
                        )}
                      </div>

                      <span className={cn(
                        "text-[0.62rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                        project.status === "Completed"
                          ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                          : "text-amber-400 border-amber-500/30 bg-amber-500/10"
                      )}>
                        {project.status === "Completed" ? "Shipped" : "Building"}
                      </span>

                      <span className="text-xs font-mono text-white/25 ml-auto">
                        {project.year}
                      </span>
                    </div>

                    {/* Category tag */}
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-emerald-400/50">
                      {project.tag}
                    </p>

                    {/* Description — readable by default */}
                    <p className="text-sm text-white/50 leading-relaxed max-w-xl group-hover:text-white/70 transition-colors duration-300">
                      {project.description}
                    </p>

                    {/* Tech pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.slice(0, 5).map((t) => (
                        <span
                          key={t}
                          className="text-[0.65rem] font-medium px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.07] text-white/40 group-hover:text-white/60 group-hover:border-white/[0.12] transition-all duration-300"
                        >
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 5 && (
                        <span className="text-[0.65rem] px-2.5 py-1 rounded-md bg-white/[0.02] border border-white/[0.05] text-white/25">
                          +{project.tech.length - 5}
                        </span>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-5 pt-1">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-[0.7rem] font-medium text-white/35 hover:text-white/80 transition-colors duration-200"
                      >
                        <Github className="h-3.5 w-3.5" />
                        Source
                      </a>
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer"
                          className="group/live flex items-center gap-1 text-[0.7rem] font-medium text-emerald-400/70 hover:text-emerald-300 transition-colors duration-200"
                        >
                          Live Demo
                          <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="shrink-0 w-full md:w-52 lg:w-64">
                    <div className="relative overflow-hidden rounded-xl aspect-video bg-white/[0.02] border border-white/[0.07] group-hover:border-emerald-500/20 transition-all duration-500 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
                      <img
                        src={project.image}
                        alt={`${project.name} screenshot`}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                      {/* Video play overlay */}
                      {project.video && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handlePlayVideo(project.name); }}
                          aria-label={`Play ${project.name} demo`}
                          className="absolute inset-0 flex items-center justify-center group/play"
                        >
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 border border-white/20 backdrop-blur-sm text-white transition-all duration-200 group-hover/play:bg-emerald-500/80 group-hover/play:border-emerald-400/60 group-hover/play:scale-110 active:scale-95">
                            <Play className="h-4 w-4 fill-current ml-0.5" />
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </motion.article>
          ))}
          </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ====== VIDEO MODAL ====== */}
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
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                    <Play className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{activeProject.name}</h3>
                    <p className="text-xs text-slate-400">{activeProject.tag}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseVideo}
                  className="btn-icon h-10 w-10 !text-white/50 hover:!border-red-400/40 hover:!bg-red-500/10 hover:!text-red-300"
                  aria-label="Close video"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-emerald-500/5">
                <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 blur-xl" />
                <iframe
                  src={getYouTubeEmbedUrl(activeProject.video!) || activeProject.video}
                  title={`${activeProject.name} demo video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="relative z-10 w-full aspect-video bg-black"
                />
              </div>

              <p className="mt-3 text-center text-xs text-slate-500">
                Press{" "}
                <kbd className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-white/5">
                  Esc
                </kbd>{" "}
                or click outside to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
