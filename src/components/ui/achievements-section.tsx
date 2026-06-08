"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Code2, Zap, BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const STATS = [
  { value: "10+", label: "Projects Shipped" },
  { value: "3.5+", label: "GPA" },
  { value: "1/1", label: "Hackathon Win Rate" },
  { value: "3", label: "Certifications" },
];

type Category = "Academic" | "Certification" | "Competition" | "Project";

interface Achievement {
  id: number;
  date: string;
  title: string;
  org: string;
  category: Category;
  desc: string;
  Icon: React.ElementType;
  highlight?: boolean;
  url?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    date: "Apr 2026",
    title: "1st Place — HackLions 2026",
    org: "SELU 1st Hackathon",
    category: "Competition",
    desc: "Won SELU's hackathon by building DollarPilot — a finance app that makes money management fun and brutal — from zero to shipped in 6 hours.",
    Icon: Trophy,
    highlight: true,
    url: "https://devpost.com/software/dollarpilot",
  },
  {
    id: 3,
    date: "Fall 2024",
    title: "Honors Scholarship",
    org: "Southeastern Louisiana University",
    category: "Academic",
    desc: "Awarded the Honors Scholarship at Southeastern Louisiana University in recognition of outstanding academic achievement and potential.",
    Icon: Star,
  },
  {
    id: 4,
    date: "2025",
    title: "Software Engineer Certificate",
    org: "HackerRank",
    category: "Certification",
    desc: "Demonstrated expertise in problem-solving, REST API design, full-stack architecture, and data structures.",
    Icon: Code2,
    url: "https://www.hackerrank.com/certificates/iframe/1ec7df9efdd8",
  },
  {
    id: 5,
    date: "2025",
    title: "SQL (Advanced) Certificate",
    org: "HackerRank",
    category: "Certification",
    desc: "Validated advanced SQL skills including complex queries, joins, subqueries, indexing, and performance tuning.",
    Icon: Zap,
    url: "https://www.hackerrank.com/certificates/a0f6fb1fb4af",
  },
  {
    id: 6,
    date: "2024",
    title: "Excel Fundamentals – Finance",
    org: "Corporate Finance Institute®",
    category: "Certification",
    desc: "Completed CFI's program covering financial modeling, pivot tables, Excel formulas, and data analysis for finance.",
    Icon: BookOpen,
    url: "https://credentials.corporatefinanceinstitute.com/88b6efc3-2491-4e1d-9e12-433819361baa",
  },
];

export function AchievementsSection() {
  return (
    <div className="theme-brut brut-bg relative min-h-screen w-full pt-28 pb-24 md:pt-36">
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="mb-14 md:mb-16"
        >
          <p className="brut-kicker mb-4">Track Record</p>
          <h1 className="brut-h text-[clamp(3rem,9vw,6.5rem)]">
            Achieve<span className="text-[var(--accent)]">-</span>ments.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--ink-2)]">
            Competition wins, academic recognition, and certifications earned while
            building and shipping real products.
          </p>
        </motion.div>

        {/* ── Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease }}
          className="mb-16 grid grid-cols-2 gap-4 md:mb-20 md:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="brut-stat flex flex-col gap-1.5">
              <span className="brut-h brut-mono text-[clamp(2rem,5vw,3rem)] text-[var(--ink)]">
                {stat.value}
              </span>
              <span className="brut-kicker text-[0.58rem] tracking-[0.18em]">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Timeline list ── */}
        <div className="space-y-5">
          {ACHIEVEMENTS.map((item, i) => {
            const Icon = item.Icon;
            const hi = item.highlight;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: i * 0.05, ease }}
              >
                <article
                  className={cn(
                    "brut-card-i relative flex flex-col gap-4 p-5 sm:flex-row sm:gap-5 sm:p-6",
                    hi && "!bg-[var(--accent)] text-[var(--accent-ink)]"
                  )}
                >
                  {/* Icon box */}
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] border-2",
                      hi
                        ? "border-[var(--accent-ink)] bg-white/15"
                        : "border-[var(--ink)] bg-[var(--paper)]"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", hi ? "text-[var(--accent-ink)]" : "text-[var(--accent)]")} />
                  </div>

                  {/* Body */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "brut-chip",
                          hi && "border-[var(--accent-ink)] bg-transparent text-[var(--accent-ink)]"
                        )}
                      >
                        {item.date}
                      </span>
                      <span
                        className={cn(
                          item.category === "Competition" && !hi
                            ? "brut-chip-accent brut-chip"
                            : "brut-chip",
                          hi && "border-[var(--accent-ink)] bg-transparent text-[var(--accent-ink)]"
                        )}
                      >
                        {item.category}
                      </span>
                    </div>

                    <h3 className={cn("brut-h text-xl sm:text-2xl", hi && "text-[var(--accent-ink)]")}>
                      {item.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-0.5 brut-mono text-[0.66rem] uppercase tracking-[0.12em]",
                        hi ? "text-[var(--accent-ink)]/80" : "text-[var(--ink-2)]"
                      )}
                    >
                      {item.org}
                    </p>
                    <p
                      className={cn(
                        "mt-3 text-[0.86rem] leading-relaxed",
                        hi ? "text-[var(--accent-ink)]/90" : "text-[var(--ink-2)]"
                      )}
                    >
                      {item.desc}
                    </p>

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "mt-3.5 inline-flex items-center gap-1.5 brut-mono text-[0.66rem] font-bold uppercase tracking-[0.12em] underline-offset-4 hover:underline",
                          hi ? "text-[var(--accent-ink)]" : "text-[var(--accent)]"
                        )}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View credential
                      </a>
                    )}
                  </div>
                </article>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
