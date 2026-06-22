"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Achievement, Stat } from "@/lib/content/types";
import { getIcon } from "@/lib/content/icons";
import { HighlightText } from "@/components/ui/highlight";
import { Tape } from "@/components/ui/tape";

const ease = [0.22, 1, 0.36, 1] as const;

interface AchievementsSectionProps {
  achievements: Achievement[];
  stats: Stat[];
}

export function AchievementsSection({ achievements, stats }: AchievementsSectionProps) {
  return (
    <div id="achievements" className="theme-brut brut-bg relative min-h-screen w-full pt-28 pb-24 md:pt-36">
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="mb-14 md:mb-16"
        >
          <p className="brut-kicker mb-4">Track Record</p>
          <h1 className="brut-title text-[clamp(3rem,9vw,6.5rem)]">
            <HighlightText mode="scroll" ink underline>
              Achieve<span className="text-[var(--accent)]">-</span>ments.
            </HighlightText>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--ink-2)]">
            Competition wins, academic recognition, and certifications earned while
            building and shipping real products.
          </p>
        </motion.div>

        {/* ── Stats ── */}
        {stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            className="mb-16 grid grid-cols-2 gap-4 md:mb-20 md:grid-cols-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="brut-stat flex flex-col gap-1.5">
                <span className="brut-h brut-mono text-[clamp(2rem,5vw,3rem)] text-[var(--ink)]">
                  {stat.value}
                </span>
                <span className="brut-kicker text-[0.72rem] tracking-[0.18em]">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Timeline list ── */}
        <div className="space-y-5">
          {achievements.map((item, i) => {
            const Icon = getIcon(item.icon);
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
                    hi && "text-[var(--accent-ink)]"
                  )}
                  // Inline fill so it reliably overrides .brut-card-i's --paper-lit background
                  // (Tailwind v4 dropped the leading-"!" important syntax, which left the card
                  // on light paper with white text — unreadable).
                  style={hi ? { background: "var(--accent-deep)" } : undefined}
                >
                  {hi && (
                    <Tape color="butter" rotate={4} style={{ top: "-0.55rem", right: "1.6rem", width: "3.6rem", height: "1.2rem" }} />
                  )}

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

                    <h3
                      className={cn("brut-h text-xl sm:text-2xl", hi && "text-[var(--accent-ink)]")}
                      // .brut-h sets color:var(--ink) as unlayered CSS, which beats Tailwind's
                      // layered text-* utility — so force white inline on the highlight card.
                      style={hi ? { color: "var(--accent-ink)" } : undefined}
                    >
                      <HighlightText mode="reveal" ink underline inkColor="ink">{item.title}</HighlightText>
                    </h3>
                    <p
                      className={cn(
                        "mt-0.5 brut-mono text-[0.78rem] uppercase tracking-[0.12em]",
                        hi ? "text-[var(--accent-ink)]/90" : "text-[var(--ink-2)]"
                      )}
                    >
                      {item.org}
                    </p>
                    <p
                      className={cn(
                        "mt-3 text-[0.95rem] leading-relaxed",
                        hi ? "text-[var(--accent-ink)]" : "text-[var(--ink-2)]"
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
                          "mt-3.5 inline-flex items-center gap-1.5 brut-mono text-[0.78rem] font-bold uppercase tracking-[0.12em] underline-offset-4 hover:underline",
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
