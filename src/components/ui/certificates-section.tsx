"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/* animations */
const container = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* types */
type Certificate = {
  title: string;
  issuer: string;
  year: number;
  tag: string;
  highlight: string;
  status?: "Completed" | "In progress";
  url?: string;
};

/* data */
const certificates: Certificate[] = [
  {
    title: "Software Engineer Certificate",
    issuer: "HackerRank",
    year: 2025,
    tag: "Full-stack",
    status: "Completed",
    highlight: "Building the web, end-to-end.",
    url: "https://www.hackerrank.com/certificates/iframe/1ec7df9efdd8",
  },
  {
    title: "SQL (Advanced) Certificate",
    issuer: "HackerRank",
    year: 2025,
    tag: "Data / Backend",
    status: "Completed",
    highlight:
      "Mastering complex data manipulation, query optimization, and high-performance database architecture.",
    url: "https://www.hackerrank.com/certificates/a0f6fb1fb4af",
  },
  {
    title: "Excel Fundamentals – Formulas for Finance",
    issuer: "Corporate Finance Institute® (CFI)",
    year: 2024,
    tag: "Finance",
    status: "Completed",
    highlight:
      "Building strong spreadsheet logic for finance modeling, formulas, and analysis workflows.",
    url: "https://credentials.corporatefinanceinstitute.com/88b6efc3-2491-4e1d-9e12-433819361baa#acc.bE0HptmS",
  },
];

/* helpers */
function statusBadgeClass(status?: Certificate["status"]) {
  if (status === "Completed") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  }
  if (status === "In progress") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-200";
  }
  return "border-white/10 bg-white/[0.02] text-white/55";
}

// clean chip style (same vibe as your projects chips)
const chip =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] leading-none " +
  "border border-white/10 bg-white/[0.03] text-white/70 backdrop-blur-md " +
  "transition-colors duration-200 hover:border-white/15 hover:text-white/85";

/* component */
export function CertificatesSection() {
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const sortedCertificates = [...certificates].sort((a, b) =>
    sort === "newest" ? b.year - a.year : a.year - b.year
  );

  return (
  <section
    id="certificates"
    className="relative w-full border-t border-white/[0.04] bg-gradient-to-b from-[#050509] to-[#030308] py-16 sm:py-20"
  >
    {/*Clean looks */}
    <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(...)] opacity-70" />

    {/* same soft bg as Projects */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.14),_transparent_55%)]" />

    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-6">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="space-y-10"
      >
        {/* header */}
        <motion.div variants={item} className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Certificates
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
                Proof of learning and momentum.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-white/60 sm:text-base">
                A growing collection of certifications and courses that support
                my path in full-stack development, data, and cloud.
              </p>
            </div>

            {/* sort buttons */}
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
          </div>
        </motion.div>

        {/* cards */}
        <motion.div
          variants={container}
          className="grid justify-center gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {sortedCertificates.map((cert) => (
            <motion.article
              key={cert.title}
              variants={item}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.22 }}
              className={cn(
                "group relative w-full max-w-[420px] overflow-hidden rounded-2xl",
                "border border-white/[0.10] bg-white/[0.02] px-5 py-5",
                "shadow-[0_18px_45px_rgba(0,0,0,0.75)] backdrop-blur-md",
                "transition-colors duration-200 hover:border-white/[0.16]"
              )}
            >
              {/* NO glow overlay inside card ✅ */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white/80">
                  <Award className="h-4 w-4" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white sm:text-base">
                        {cert.title}
                      </h3>
                      <p className="mt-1 text-[0.8rem] text-white/55">
                        {cert.issuer}
                      </p>
                    </div>

                    {cert.status && (
                      <span
                        className={cn(
                          "shrink-0 rounded-full border px-2 py-0.5 text-[0.7rem]",
                          statusBadgeClass(cert.status)
                        )}
                      >
                        {cert.status}
                      </span>
                    )}
                  </div>

                  {/* meta row */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={chip}>
                      <span className="h-1 w-1 rounded-full bg-white/30 group-hover:bg-white/50" />
                      {cert.tag}
                    </span>

                    <span className={chip}>{cert.year}</span>

                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(chip, "ml-auto")}
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-white/60">
                    {cert.highlight}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </div>
    </section>
  );
}
