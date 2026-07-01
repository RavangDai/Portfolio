"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Play, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { HighlightText } from "@/components/ui/highlight";
import { Tape } from "@/components/ui/tape";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// rotating flat pastel accents per card
const PASTELS = ["var(--butter)", "var(--lavender)", "var(--mint)", "var(--blush)"];
const ease = [0.22, 1, 0.36, 1] as const;

function StatusBadge({ status }: { status: Project["status"] }) {
  if (status === "In progress") return <span className="brut-chip">In progress</span>;
  return <span className="brut-chip-accent brut-chip">Shipped</span>;
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {project.github && (
        <a href={project.github} target="_blank" rel="noreferrer" className="brut-btn-ghost">
          <GithubIcon className="h-3.5 w-3.5" />
          Source
        </a>
      )}
      {project.live && (
        <a href={project.live} target="_blank" rel="noreferrer" className="brut-btn">
          Live
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      )}
      {project.video && (
        <a href={project.video} target="_blank" rel="noreferrer" className="brut-btn-ghost">
          <Play className="h-3 w-3 fill-current" />
          Demo
        </a>
      )}
    </div>
  );
}

function TechChips({ tech, max = 6 }: { tech: string[]; max?: number }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tech.slice(0, max).map((t) => (
        <span key={t} className="brut-chip">{t}</span>
      ))}
      {tech.length > max && (
        <span className="brut-chip">+{tech.length - max}</span>
      )}
    </div>
  );
}

function ProjectImage({ project, pastel }: { project: Project; pastel: string }) {
  return (
    <div
      className="relative w-full overflow-hidden border-b-2 border-[var(--ink)]"
      style={{ background: pastel }}
    >
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={project.image}
          alt={`${project.name} · ${project.tag}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

function FeaturedCard({ project, index, pastel }: { project: Project; index: number; pastel: string }) {
  return (
    <article className="brut-card-i group overflow-hidden md:col-span-2">
      <div className="grid md:grid-cols-2">
        <ProjectImage project={project} pastel={pastel} />
        <div className="flex flex-col gap-4 p-6 md:p-7">
          <div className="flex items-center justify-between gap-3">
            <span className="brut-kicker">Featured · {project.year}</span>
            <StatusBadge status={project.status} />
          </div>
          <h3 className="brut-h text-3xl md:text-4xl">
            <HighlightText mode="reveal" ink underline inkColor="ink">{project.name}</HighlightText>
          </h3>
          <p className="brut-mono text-[0.8rem] uppercase tracking-[0.12em] text-[var(--ink-2)]">
            {project.tag}
          </p>
          <p className="text-base leading-relaxed text-[var(--ink-2)]">{project.description}</p>
          <div className="mt-auto flex flex-col gap-4 pt-2">
            <TechChips tech={project.tech} max={6} />
            <ProjectLinks project={project} />
          </div>
        </div>
      </div>
      <span className="sr-only">{index + 1}</span>
    </article>
  );
}

function ProjectCard({ project, index, pastel }: { project: Project; index: number; pastel: string }) {
  return (
    <article className="brut-card-i group flex flex-col overflow-hidden">
      <ProjectImage project={project} pastel={pastel} />
      <div className="flex flex-1 flex-col gap-3.5 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="brut-h text-2xl">
            <HighlightText mode="reveal" ink underline inkColor="ink">{project.name}</HighlightText>
          </h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="brut-mono text-[0.78rem] uppercase tracking-[0.1em] text-[var(--ink-2)]">
          {project.tag} · {project.year}
        </p>
        <p className="text-[0.95rem] leading-relaxed text-[var(--ink-2)] line-clamp-3">
          {project.description}
        </p>
        <div className="mt-auto flex flex-col gap-3.5 pt-1">
          <TechChips tech={project.tech} max={5} />
          <ProjectLinks project={project} />
        </div>
      </div>
      <span className="sr-only">{index + 1}</span>
    </article>
  );
}

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [featured, ...rest] = projects;

  if (!featured) {
    return (
      <section
        id="projects"
        className="theme-brut brut-bg relative min-h-screen w-full pt-28 pb-24 md:pt-36"
      >
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
          <p className="text-[var(--ink-2)]">No projects yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      className="theme-brut brut-bg relative min-h-screen w-full pt-28 pb-24 md:pt-36"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mb-12 md:mb-16"
        >
          <p className="brut-kicker mb-4">Selected Work · 2025-2026</p>
          <h1 className="brut-title text-[clamp(2.8rem,9vw,6rem)]">
            Built &amp; <HighlightText mode="scroll" ink underline>Shipped.</HighlightText>
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="max-w-md text-base leading-relaxed text-[var(--ink-2)]">
              Real products taken from zero to deployed: full-stack apps, AI tooling,
              and computer-vision systems.
            </p>
            <span className="brut-mono text-[0.8rem] uppercase tracking-[0.12em] text-[var(--ink-3)]">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </span>
          </div>
        </motion.header>

        {/* ── Bento grid ── */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-6 md:grid-cols-2"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease }}
            className="relative md:col-span-2"
          >
            <Tape color="marigold" rotate={-5} style={{ top: "-0.6rem", left: "1.8rem", width: "4rem", height: "1.35rem" }} />
            <FeaturedCard project={featured} index={0} pastel={PASTELS[0]} />
          </motion.div>

          {rest.map((project, i) => (
            <motion.div
              key={project.id}
              variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease }}
              className="relative"
            >
              {i === 0 && (
                <Tape color="blush" rotate={5} style={{ top: "-0.55rem", right: "1.4rem", width: "3.4rem", height: "1.2rem" }} />
              )}
              <ProjectCard project={project} index={i + 1} pastel={PASTELS[(i + 1) % PASTELS.length]} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
