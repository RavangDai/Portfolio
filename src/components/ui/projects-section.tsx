// # verified: react, framer-motion, lucide-react, clsx, tailwind-merge
"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
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
};

// --- DATA ---
const projects: Project[] = [
  {
    name: "WatchThis!AI",
    tag: "Full-stack · AI",
    description: "A recommendation platform with modern architecture and AI-driven personalization.",
    tech: ["Next.js", "FastAPI", "PostgreSQL", "Docker"],
    github: "https://github.com/RavangDai/WatchThisAI",
    year: 2026,
    status: "In progress",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "GridNavigator",
    tag: "Algorithms · Visualization",
    description: "Interactive grid & maze visualizer exploring pathfinding algorithms.",
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
    description: "Distraction-free Pomodoro app built as a PWA for deep work sessions.",
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
    description: "Dynamic quote generator with theme toggling and micro-interactions.",
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

// --- COMPONENT ---
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
    <section id="projects" className="relative w-full border-t border-white/[0.08] bg-[#030308] py-24 md:py-32 overflow-hidden">
      {/* Background Ambience (Subtle Purple) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_center,_rgba(168,85,247,0.04),_transparent_60%)]" />
    
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6">
        
        {/* HEADER SECTION */}
        <motion.div 
          variants={sectionVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }}
          className="mb-20 flex flex-col justify-between gap-12 md:flex-row md:items-end"
        >
          {/* Left Side: Title & Subtitle */}
          <div className="max-w-3xl space-y-6">
             
             {/* Green Dot Badge */}
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

          {/* Right Side: Sort Toggle */}
          <div className="flex shrink-0 gap-1 rounded-full border border-white/[0.08] bg-white/[0.02] p-1.5 backdrop-blur-md">
            {(["newest", "oldest"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSort(option)}
                className={cn(
                  "relative px-6 py-2 text-xs font-semibold rounded-full transition-all duration-300 z-10 tracking-wide",
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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.name}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover={{ y: -8, scale: 1.01 }} // Physics-based lift
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              viewport={{ once: true, amount: 0.1 }}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-[2rem]",
                "border border-white/[0.05] bg-[#08080a]", // Dark Base
                "transition-all duration-500 ease-out",
                "hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.15)]", // Purple Glow
                "hover:border-purple-500/30" // Purple Border
              )}
            >
              
              {/* 1. VISUAL AREA - UPDATED FOR BETTER FIT */}
              {/* Changed 'aspect-[16/11]' to 'aspect-video' (16/9) for standard screenshots */}
              {/* Reduced 'p-4' to 'p-2' to allow image to be larger */}
              <div className="relative aspect-video overflow-hidden bg-[#030305] p-2">
                <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] shadow-lg z-10">
                   {/* Used 'object-top' to ensure header of website is always seen */}
                   <img 
                    src={project.image} 
                    alt={project.name}
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105"
                   />
                   <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.07] to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <div className="absolute inset-0 z-0 bg-purple-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40" />
              </div>

              {/* 2. CONTENT AREA */}
              <div className="flex flex-1 flex-col justify-between p-6 relative z-20 bg-[#08080a]">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-2 text-purple-300">{project.tag}</p>
                        <h3 className="text-2xl font-bold text-white">{project.name}</h3>
                    </div>
                    
                    {/* DYNAMIC STATUS BADGE */}
                    <span className={cn(
                      "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider",
                      project.status === "Completed" 
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" // Green for Completed
                        : "border-amber-500/20 bg-amber-500/10 text-amber-300"   // Amber for In Progress
                    )}>
                      {project.status}
                    </span>
                  </div>
                  
                  <p className="mt-4 text-sm leading-relaxed text-slate-400 line-clamp-2">
                    {project.description}
                  </p>
                </div>

                {/* Footer: Tech & Links */}
                <div className="mt-6 flex flex-col gap-4 border-t border-white/[0.06] pt-4">
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

                  <div className="flex items-center gap-3 mt-2">
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
                        className="flex items-center gap-2 text-sm font-semibold text-purple-300 transition-colors hover:text-purple-200 group/live"
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

      </div>
    </section>
  );
}