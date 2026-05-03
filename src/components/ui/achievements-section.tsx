"use client";

import { motion } from "framer-motion";
import { Trophy, Star, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionGradientBg } from "@/components/ui/section-gradient-bg";

const ease = [0.22, 1, 0.36, 1] as const;

const STATS = [
  { value: "10+", label: "Projects Shipped" },
  { value: "3.5+",label: "GPA"              },
  { value: "1/1", label: "Hackathon Win Rate"},
  { value: "2",   label: "Honors Awards"    },
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
  },
  {
    id: 2,
    date: "Nov 2024",
    title: "Dean's List — Fall 2024",
    org: "Southeastern Louisiana University",
    category: "Academic",
    desc: "Recognized for academic excellence with a semester GPA of 3.5 — consistent academic performance throughout the semester.",
    Icon: GraduationCap,
  },
  {
    id: 3,
    date: "Aug 2023",
    title: "Honors Scholarship",
    org: "Southeastern Louisiana University",
    category: "Academic",
    desc: "Awarded the Honors Scholarship at Southeastern Louisiana University in recognition of outstanding academic achievement and potential.",
    Icon: Star,
  },
];

const CATEGORY_STYLE: Record<Category, string> = {
  Competition:   "border-white/30 text-white/80 bg-white/[0.06]",
  Academic:      "border-white/15 text-white/55 bg-white/[0.03]",
  Certification: "border-white/15 text-white/55 bg-white/[0.03]",
  Project:       "border-white/15 text-white/55 bg-white/[0.03]",
};

export function AchievementsSection() {
  return (
    <div className="relative min-h-screen bg-[#080808] pt-32 pb-24 overflow-hidden">
      <SectionGradientBg />

      <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-10">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="mb-16 md:mb-20"
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/35 mb-5">
            Track Record
          </p>
          <h1
            className="font-black font-display tracking-tighter leading-[0.9]"
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
          >
            <span className="shimmer-text">Achieve</span>
            <span className="text-white">-</span>
            <br />
            <span className="text-white/20">ments.</span>
          </h1>
          <p className="mt-6 text-white/35 leading-relaxed max-w-md text-base">
            Competition wins, academic recognition, and certifications earned while
            building and shipping real products.
          </p>
        </motion.div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden mb-20 md:mb-24"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1.5 px-6 py-5 bg-[#080808]">
              <span
                className="font-black font-display text-white leading-none"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}
              >
                {stat.value}
              </span>
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/35">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Timeline ── */}
        <div className="relative">
          {/* Vertical rule */}
          <div className="absolute left-0 md:left-[7.5rem] top-2 bottom-2 w-px bg-white/[0.07]" />

          <div className="space-y-0">
            {ACHIEVEMENTS.map((item, i) => {
              const Icon = item.Icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.65, delay: i * 0.04, ease }}
                  className="group relative flex gap-6 md:gap-8 pb-8"
                >
                  {/* Date — desktop left column */}
                  <div className="hidden md:flex w-[7rem] shrink-0 justify-end pr-6 pt-[14px]">
                    <span className="text-[0.58rem] font-mono font-medium tracking-[0.15em] text-white/25 uppercase whitespace-nowrap">
                      {item.date}
                    </span>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-[-5px] md:left-[7.5rem] md:-ml-[5px] top-[14px] z-10">
                    <span
                      className={cn(
                        "flex h-[10px] w-[10px] rounded-full border transition-all duration-300",
                        item.highlight
                          ? "border-white/50 bg-white/20 group-hover:bg-white/50"
                          : "border-white/18 bg-[#080808] group-hover:border-white/35"
                      )}
                    />
                  </div>

                  {/* Card */}
                  <div className="flex-1 pl-6 md:pl-8">
                    {/* Mobile date */}
                    <span className="md:hidden block text-[0.58rem] font-mono tracking-[0.15em] text-white/25 uppercase mb-2">
                      {item.date}
                    </span>

                    <div
                      className={cn(
                        "relative rounded-2xl border p-5 transition-all duration-300",
                        item.highlight
                          ? "border-white/[0.14] bg-white/[0.04] group-hover:border-white/[0.24] group-hover:bg-white/[0.06]"
                          : "border-white/[0.06] bg-transparent group-hover:border-white/[0.12] group-hover:bg-white/[0.02]"
                      )}
                    >
                      {/* Top shimmer on highlighted cards */}
                      {item.highlight && (
                        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      )}

                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                            item.highlight
                              ? "border-white/20 bg-white/[0.08]"
                              : "border-white/[0.09] bg-white/[0.04]"
                          )}
                        >
                          <Icon className="h-4 w-4 text-white/60" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-sm font-bold text-white/90 tracking-tight">
                              {item.title}
                            </h3>
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full border px-2 py-0.5 text-[0.52rem] font-bold uppercase tracking-[0.15em]",
                                CATEGORY_STYLE[item.category]
                              )}
                            >
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[0.67rem] font-medium text-white/30 mb-2.5 tracking-wide">
                            {item.org}
                          </p>
                          <p className="text-sm text-white/45 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
