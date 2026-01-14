"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

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
};

const projects: Project[] = [
  {
    name: "WatchThis!AI",
    tag: "Full-stack · AI",
    description:
      "A recommendation platform with modern full-stack architecture and AI-driven personalization.",
    tech: ["Next.js", "FastAPI", "PostgreSQL", "Docker"],
    github: "https://github.com/RavangDai/WatchThisAI",
    live: "",
    year: 2026,
    status: "In progress",
  },
  {
    name: "GridNavigator",
    tag: "Algorithms · Visualization",
    description:
      "Interactive grid & maze visualizer that lets you explore pathfinding and traversal with a clean, futuristic UI.",
    tech: ["TypeScript", "React", "Vite", "Tailwind"],
    github: "https://github.com/RavangDai/GridNavigator",
    live: "https://grid-navigator-mu.vercel.app/",
    year: 2025,
    status: "Completed",
  },
  {
    name: "TickTickFocus",
    tag: "Productivity · PWA",
    description:
      "A distraction-free Pomodoro app built as a full PWA, designed to help you stay in deep work with minimal UI.",
    tech: ["TypeScript", "React", "Tailwind", "PWA"],
    github: "https://github.com/RavangDai/TickTickFocus",
    live: "https://tick-tick-focus.vercel.app/",
    year: 2025,
    status: "Completed",
  },
  {
    name: "Quotex",
    tag: "Frontend · API Integration",
    description:
      "A dynamic quote generator that fetches from external APIs, with theme toggling and subtle micro-interactions.",
    tech: ["JavaScript", "React", "Tailwind"],
    github: "https://github.com/RavangDai/Quotex",
    live: "https://quotex-five.vercel.app/",
    year: 2024,
    status: "Completed",
  },
];

// FIXED: Added "as const" to ease array to fix TypeScript error
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// FIXED: Added "as const" to ease array to fix TypeScript error
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.1 + i * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

function statusBadgeClass(status: ProjectStatus) {
  if (status === "Completed") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }
  return "border-amber-500/20 bg-amber-500/10 text-amber-300";
}

export function ProjectsSection() {
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [statusFilter] = useState<"All" | ProjectStatus>("All");

  const filteredProjects = useMemo(() => {
    let list = [...projects];
    if (statusFilter !== "All") {
      list = list.filter((p) => p.status === statusFilter);
    }
    list.sort((a, b) => (sort === "newest" ? b.year - a.year : a.year - b.year));
    return list;
  }, [sort, statusFilter]);

  return (
    <section
      id="projects"
      className={cn(
        "relative w-full border-t border-white/[0.08] bg-[#030308] py-24 md:py-32"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.04),_transparent_40%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 md:px-6">
        
        {/* HEADER SECTION */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          {/* Left: Title & Subtitle */}
          <div className="max-w-2xl space-y-6">
            
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Selected Projects
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
              A small collection of <br className="hidden sm:block" />
              <span className="text-indigo-100">interactive & data-driven builds.</span>
            </h2>

            <p className="max-w-xl text-lg text-slate-400 leading-relaxed">
              Each project focuses on clean UX, solid engineering, and solving specific problemsfrom visualizing algorithms to productivity tools.
            </p>
          </div>

          {/* Right: Sort Buttons */}
          <div className="flex items-center gap-2">
            {(["newest", "oldest"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSort(option)}
                className={cn(
                  "px-4 py-2 text-xs font-medium rounded-full transition-all duration-300 border",
                  sort === option
                    ? "bg-white/[0.08] border-white/20 text-white"
                    : "bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-white/[0.02]"
                )}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* PROJECTS GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.name}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-2xl",
                "border border-white/[0.08] bg-white/[0.02]",
                "p-6 backdrop-blur-sm",
                "transition-all duration-500 hover:border-indigo-500/30 hover:bg-white/[0.04] hover:-translate-y-1"
              )}
            >
              {/* Card Content */}
              <div className="relative z-10 flex flex-col gap-4">
                
                {/* Top Row: Title & Status */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-indigo-200">
                      {project.name}
                    </h3>
                    <span className="mt-1 block text-xs font-medium text-slate-500 group-hover:text-slate-400">
                      {project.tag}
                    </span>
                  </div>
                  
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider",
                      statusBadgeClass(project.status)
                    )}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
                  {project.description}
                </p>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-md border border-white/5 bg-white/[0.03] px-2.5 py-1 text-[0.7rem] text-slate-300 transition-colors group-hover:bg-white/[0.08] group-hover:text-white"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Row: Links */}
              <div className="relative z-10 mt-8 flex items-center gap-4 border-t border-white/[0.06] pt-4">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs font-medium text-slate-400 transition-colors hover:text-white group/link"
                >
                  <Github className="h-4 w-4 transition-transform group-hover/link:scale-110" />
                  View Code
                </a>

                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200 group/link"
                  >
                    <ExternalLink className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    Live Demo
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="flex justify-center py-20 text-center">
            <p className="text-slate-500">No projects found for this filter.</p>
          </div>
        )}
      </div>
    </section>
  );
}