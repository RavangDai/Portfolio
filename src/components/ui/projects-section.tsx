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

  // NEW
  year: number;
  status: ProjectStatus;
};

const projects: Project[] = [
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

  // Example in-progress (you can remove this if you don’t want it)
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
];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.4, 0.25, 1] as any },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.15 + i * 0.08,
      ease: [0.25, 0.4, 0.25, 1] as any,
    },
  }),
};

function statusBadgeClass(status: ProjectStatus) {
  if (status === "Completed") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  }
  return "border-amber-400/20 bg-amber-400/10 text-amber-200";
}

export function ProjectsSection() {
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [statusFilter, setStatusFilter] = useState<"All" | ProjectStatus>("All");

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
      className="relative w-full border-t border-white/[0.04] bg-gradient-to-b from-[#050509] to-[#030308] py-16 sm:py-20"
    >
      {/* soft glow background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.14),_transparent_55%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 md:px-6">
        {/* header */}
        {/* header (About-style) */}
<motion.div
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.4 }}
  className="flex max-w-5xl flex-col gap-4 md:flex-row md:items-end md:justify-between"
>
  {/* LEFT */}
  <div className="max-w-3xl space-y-4">
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-white/60">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      Selected Projects
    </div>

    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl">
      <span className="text-hero-gradient">

        A small collection of interactive and data-driven builds.
      </span>
    </h2>

    <p className="max-w-2xl text-sm text-white/55 sm:text-base">
      Each project focuses on clean UX, solid engineering, and solving a specific
      problem from visualizing algorithms to building focused productivity tools.
    </p>
  </div>

  {/* RIGHT: sort buttons */}
  <div className="flex gap-2">
    <button
      onClick={() => setSort("newest")}
      className={cn(
        "rounded-full border px-4 py-1.5 text-xs transition",
        sort === "newest"
          ? "border-white/25 bg-white/[0.08] text-white"
          : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white"
      )}
    >
      Newest
    </button>
    <button
      onClick={() => setSort("oldest")}
      className={cn(
        "rounded-full border px-4 py-1.5 text-xs transition",
        sort === "oldest"
          ? "border-white/25 bg-white/[0.08] text-white"
          : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white"
      )}
    >
      Oldest
    </button>
  </div>
</motion.div>



        {/* cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.name}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
             className={cn(
  "group relative overflow-hidden rounded-2xl",
  "border border-white/[0.08]",
  "bg-white/[0.02] px-4 py-4 sm:px-4 sm:py-5",
  "backdrop-blur-md",
  "shadow-[0_12px_32px_rgba(0,0,0,0.55)]",
  "transition-all duration-500 ease-out",
  "hover:-translate-y-2 hover:scale-[1.02]",
  "hover:border-indigo-400/60",
  "hover:bg-white/[0.04]",
  "cursor-pointer"
)}

            >
              <div className="relative z-10 flex flex-col gap-3 ">
                {/* title row with badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <h3 className="text-base font-semibold text-white transition-all duration-300 group-hover:text-indigo-200 group-hover:translate-x-0.5 sm:text-lg">
                      {project.name}
                    </h3>
                    <span className="text-xs font-medium text-white/45 transition-colors duration-300 group-hover:text-white/60">
                      {project.tag}

                    </span>
                  </div>

                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2 py-0.5 text-[0.7rem]",
                      statusBadgeClass(project.status)
                    )}
                  >
                    {project.status}
                  </span>
                </div>

                {/* meta chips */}
                <div className="flex flex-wrap items-center gap-2 text-[0.7rem]">
                 <span
  key={project.year}
  className={cn(
    "rounded-full px-2.5 py-1 text-[0.68rem] leading-none",
    "border border-white/10 bg-white/[0.03] text-white/70",
    "backdrop-blur-md",
    "transition-all duration-300",
    "group-hover:border-indigo-400/30 group-hover:text-white/90",
    "group-hover:bg-indigo-500/10 group-hover:scale-105"
  )}
>
  {project.year }
</span>

                </div>

                <p className="text-xs text-white/60 transition-colors duration-300 group-hover:text-white/70 sm:text-sm">
                  {project.description}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                   <span
  key={t}
  className={cn(
    "rounded-full px-2.5 py-1 text-[0.68rem] leading-none",
    "border border-white/10 bg-white/[0.03] text-white/70",
    "backdrop-blur-md",
    "transition-all duration-300",
    "group-hover:border-indigo-400/30 group-hover:text-white/90",
    "group-hover:bg-indigo-500/10 group-hover:scale-105"
  )}
>
  {t}
</span>

                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-cyan-200/90 transition-all duration-300 hover:text-white hover:gap-1.5 hover:translate-x-0.5"
                  >
                    <Github className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
                    <span>View on GitHub</span>
                  </a>

                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[0.7rem] text-white/55 underline-offset-2 transition-all duration-300 hover:text-white hover:underline hover:gap-1.5 hover:translate-x-0.5"
                    >
                      <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                      <span>Live demo</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* empty state */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-white/60">
            No projects match this filter.
          </div>
        ) : null}
      </div>
    </section>
  );
}
