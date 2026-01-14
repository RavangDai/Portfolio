"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* TYPES                                   */
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
    highlight:
      "Mastering complex data manipulation, query optimization, and high-performance database design.",
    url: "https://www.hackerrank.com/certificates/a0f6fb1fb4af",
  },
  {
    title: "Excel Fundamentals – Finance",
    issuer: "Corporate Finance Institute®",
    year: 2024,
    tag: "Finance & Analysis",
    status: "Completed",
    highlight:
      "Building strong spreadsheet logic for financial modeling, formulas, and large-scale data analysis.",
    url: "https://credentials.corporatefinanceinstitute.com/88b6efc3-2491-4e1d-9e12-433819361baa",
  },
];

/* -------------------------------------------------------------------------- */
/* VARIANTS                                  */
/* -------------------------------------------------------------------------- */

// Shared easing curve for consistency
const ease = [0.22, 1, 0.36, 1] as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.1 + i * 0.1,
      ease,
    },
  }),
};

/* -------------------------------------------------------------------------- */
/* HELPERS                                  */
/* -------------------------------------------------------------------------- */

function statusBadgeClass(status: CertificateStatus) {
  if (status === "Completed") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }
  return "border-amber-500/20 bg-amber-500/10 text-amber-300";
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                 */
/* -------------------------------------------------------------------------- */

export function CertificatesSection() {
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const sortedCertificates = useMemo(() => {
    return [...certificates].sort((a, b) =>
      sort === "newest" ? b.year - a.year : a.year - b.year
    );
  }, [sort]);

  return (
    <section
      id="certificates"
      className={cn(
        "relative w-full border-t border-white/[0.08] bg-[#030308] py-24 md:py-32"
      )}
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(129,140,248,0.04),_transparent_40%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-6">
        
        {/* HEADER */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between mb-16"
        >
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Certifications
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
              Proof of learning <br className="hidden sm:block" />
              <span className="text-indigo-100">& continuous momentum.</span>
            </h2>

            <p className="max-w-xl text-lg text-slate-400 leading-relaxed">
              A collection of professional certifications and courses that validate my technical expertise in development, data, and cloud.
            </p>
          </div>

          {/* Sort Toggles */}
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

        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCertificates.map((cert, index) => (
            <motion.article
              key={cert.title}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-2xl",
                "border border-white/[0.08] bg-white/[0.02]",
                "p-6 backdrop-blur-sm",
                "transition-all duration-500",
                "hover:border-indigo-500/30 hover:bg-white/[0.04] hover:-translate-y-1"
              )}
            >
              {/* Content Wrapper */}
              <div className="relative z-10 flex flex-col gap-4">
                
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                  {/* Icon Box */}
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-500 group-hover:border-indigo-500/20 group-hover:bg-indigo-500/10">
                    <Award className="h-5 w-5 text-slate-400 transition-colors duration-500 group-hover:text-indigo-300" />
                  </div>
                  
                  {/* Status Badge */}
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider",
                      statusBadgeClass(cert.status)
                    )}
                  >
                    {cert.status}
                  </span>
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-indigo-100">
                    {cert.title}
                  </h3>
                  <div className="text-xs font-medium text-slate-500">
                    {cert.issuer}
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
                  {cert.highlight}
                </p>

                {/* Meta Info */}
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-md border border-white/5 bg-white/[0.03] px-2.5 py-1 text-[0.7rem] text-slate-300">
                    {cert.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md border border-white/5 bg-white/[0.03] px-2.5 py-1 text-[0.7rem] text-slate-300">
                    <Calendar className="h-3 w-3 opacity-70" />
                    {cert.year}
                  </span>
                </div>
              </div>

              {/* Action Area */}
              {cert.url && (
                <div className="relative z-10 mt-6 border-t border-white/[0.06] pt-4">
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200 group/link"
                  >
                    Verify Credential
                    <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </a>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}