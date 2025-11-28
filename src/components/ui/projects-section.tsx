"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type Project = {
  name: string;
  tag: string;
  description: string;
  tech: string[];
  github: string;
  live?: string;
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
  },
  {
    name: "TickTickFocus",
    tag: "Productivity · PWA",
    description:
      "A distraction-free Pomodoro app built as a full PWA, designed to help you stay in deep work with minimal UI.",
    tech: ["TypeScript", "React", "Tailwind", "PWA"],
    github: "https://github.com/RavangDai/TickTickFocus",
    live: "https://tick-tick-focus.vercel.app/",
  },
  {
    name: "Quotex",
    tag: "Frontend · API Integration",
    description:
      "A dynamic quote generator that fetches from external APIs, with theme toggling and subtle micro-interactions.",
    tech: ["JavaScript", "React", "Tailwind"],
    github: "https://github.com/RavangDai/Quotex",
    live: "https://quotex-five.vercel.app/",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.25, 0.4, 0.25, 1] as any,
    },
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

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative w-full border-t border-white/[0.04] bg-gradient-to-b from-[#050509] to-[#030308] py-16 sm:py-20"
    >
      {/* soft glow background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.14),_transparent_55%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 md:px-6">
        {/* header */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-indigo-200/70">
            Selected Projects
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
            A small collection of interactive and data-driven builds.
          </h2>
          <p className="mt-3 text-sm text-white/55 sm:text-base">
            Each project focuses on clean UX, solid engineering, and solving a
            specific problem — from visualizing algorithms to building focused
            productivity tools.
          </p>
        </motion.div>

        {/* cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.name}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/[0.08]",
                "bg-white/[0.02] px-4 py-4 sm:px-4 sm:py-5",
                "shadow-[0_18px_45px_rgba(0,0,0,0.7)] backdrop-blur-md",
                "transition-transform duration-300 ease-out hover:-translate-y-1 hover:border-indigo-300/60"
              )}
            >
              {/* hover glow */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.22),_transparent_55%)]" />
              </div>

              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex flex-col">
                  <h3 className="text-base font-semibold text-white sm:text-lg">
                    {project.name}
                  </h3>
                  <span className="text-xs font-medium text-white/45">
                    {project.tag}
                  </span>
                </div>

                <p className="text-xs text-white/60 sm:text-sm">
                  {project.description}
                </p>

                <div className="mt-1 flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[0.68rem] text-white/60"
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
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-200/90 transition hover:text-white"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>View on GitHub</span>
                  </a>

                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[0.7rem] text-white/55 underline-offset-2 hover:text-white hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Live demo</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
