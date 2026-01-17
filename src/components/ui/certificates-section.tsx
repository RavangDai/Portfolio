"use client";

import { useMemo, useState,  } from "react";
import { motion, } from "framer-motion";
import { Award, ExternalLink, CheckCircle2, Loader2} from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type CertificateStatus = "Completed" | "In progress";

type Certificate = {
  title: string;
  issuer: string;
  year: number;
  tag: string;
  highlight: string;
  status: CertificateStatus;
  url?: string;
};

const certificates: Certificate[] = [
  {
    title: "Software Engineer Certificate",
    issuer: "HackerRank",
    year: 2025,
    tag: "Full-stack Engineering",
    status: "Completed",
    highlight: "Validated proficiency in problem-solving, REST APIs, and full-stack architecture.",
    url: "https://www.hackerrank.com/certificates/iframe/1ec7df9efdd8",
  },
  {
    title: "SQL (Advanced) Certificate",
    issuer: "HackerRank",
    year: 2025,
    tag: "Data / Backend",
    status: "Completed",
    highlight: "Mastering complex data manipulation, query optimization, and high-performance database design.",
    url: "https://www.hackerrank.com/certificates/a0f6fb1fb4af",
  },
  {
    title: "Excel Fundamentals – Finance",
    issuer: "Corporate Finance Institute®",
    year: 2024,
    tag: "Finance & Analysis",
    status: "Completed",
    highlight: "Building strong spreadsheet logic for financial modeling, formulas, and large-scale data analysis.",
    url: "https://credentials.corporatefinanceinstitute.com/88b6efc3-2491-4e1d-9e12-433819361baa",
  },
];

/* -------------------------------------------------------------------------- */
/* ANIMATIONS                                                                 */
/* -------------------------------------------------------------------------- */

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } 
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export function CertificatesSection() {
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const sortedCertificates = useMemo(() => {
    return [...certificates].sort((a, b) =>
      sort === "newest" ? b.year - a.year : a.year - b.year
    );
  }, [sort]);

  return (
    <section id="certificates" className="relative w-full border-t border-white/[0.08] bg-[#030308] py-16 md:py-24 lg:py-32 overflow-hidden">
      
      {/* 1. BACKGROUND GRID PATTERN (NEW) */}
      {/* Adds subtle technical depth without overwhelming the content */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Background Ambience (Subtle Indigo) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.05),_transparent_50%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6">
        
        {/* HEADER SECTION */}
        <motion.div 
          variants={sectionVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12 md:mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end"
        >
          {/* Left Side */}
          <div className="max-w-3xl space-y-4 md:space-y-6">
             <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              Certifications
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
              Proof of learning & <br className="hidden sm:block" />
              <span className="text-indigo-100">continuous momentum.</span>
            </h2>

            <p className="max-w-xl text-base md:text-lg text-slate-400 leading-relaxed">
              A collection of professional certifications that validate technical expertise in development, data structures, and system design.
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
                    layoutId="cert-sort-pill" 
                    className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/[0.08] -z-10 shadow-sm" 
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} 
                  />
                )}
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* CERTIFICATES GRID */}
        <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {sortedCertificates.map((cert, index) => (
            <motion.article
              key={cert.title}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              viewport={{ once: true, amount: 0.1 }}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden",
                "rounded-2xl md:rounded-[2rem]", 
                "border border-white/[0.08] bg-[#08080a]", 
                "p-6 md:p-8",
                "transition-all duration-500 ease-out",
                // Hover Effects
                "hover:border-indigo-500/30 hover:bg-[#0a0a0c]"
              )}
            >
              {/* 2. TECH CORNER ACCENTS (NEW) */}
              {/* Creates a "Schematic/Blueprint" feel */}
              <div className="absolute top-4 right-4 h-2 w-2 border-t border-r border-white/10 transition-colors group-hover:border-indigo-500/50" />
              <div className="absolute bottom-4 left-4 h-2 w-2 border-b border-l border-white/10 transition-colors group-hover:border-indigo-500/50" />

              <div>
                {/* Header: Icon & Status */}
                <div className="flex items-start justify-between mb-6">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] shadow-inner transition-all duration-500 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 group-hover:shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]">
                    <Award className="h-6 w-6 text-slate-400 transition-colors duration-500 group-hover:text-indigo-300" />
                  </div>
                  
                  <span className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider",
                    cert.status === "Completed" 
                      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                      : "border-amber-500/20 bg-amber-500/5 text-amber-400"
                  )}>
                    {cert.status === "Completed" ? <CheckCircle2 className="h-3 w-3" /> : <Loader2 className="h-3 w-3 animate-spin" />}
                    {cert.status}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3">
                   <h3 className="text-xl font-bold text-white transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-200">
                    {cert.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                     <span className="text-indigo-400/80">{cert.issuer}</span>
                     <span className="text-slate-700">•</span>
                     <span>{cert.year}</span>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-400 mt-3 border-t border-white/[0.06] pt-3 group-hover:border-white/[0.1] transition-colors">
                    {cert.highlight}
                  </p>
                </div>
              </div>

              {/* Footer / Actions */}
              <div className="mt-8 flex items-center justify-between">
                <span className="inline-flex items-center rounded-md bg-white/[0.03] border border-white/[0.05] px-3 py-1.5 text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                  {cert.tag}
                </span>

                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-indigo-300 transition-all duration-300 hover:text-white hover:translate-x-1 group/link"
                  >
                    <span>Verify</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-70 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </a>
                )}
              </div>
              
              {/* 3. HOVER GLOW GRADIENT (NEW) */}
              <div className="pointer-events-none absolute -inset-px rounded-[inherit] border border-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:border-indigo-500/10" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}