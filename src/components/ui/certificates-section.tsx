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
    tag: "Data,Backend",
    status: "Completed",
    highlight:
      "Mastering complex data manipulation, query optimization, and high-performance database architecture.",
    url: "https://www.hackerrank.com/certificates/a0f6fb1fb4af",
  },
  {
    title: " Excel Fundamentals – Formulas for Finance.",
    issuer: "Corporate Finance Institute® (CFI)",
    year: 2024,
    tag: "Full-stack",
    status: "Completed",
    highlight:
      "Built end-to-end apps using React, Node.js, REST APIs, and deployments.",
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

/* component */
export function CertificatesSection() {
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const sortedCertificates = [...certificates].sort((a, b) =>
    sort === "newest" ? b.year - a.year : a.year - b.year
  );

  return (
    <section
      id="certificates"
      className="relative mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28"
    >
      {/* section glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-52 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35),transparent_60%)]" />

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

        {/* cards grid */}
        <motion.div
          variants={container}
          className="grid justify-center gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {sortedCertificates.map((cert) => (
            <motion.article
              key={cert.title}
              variants={item}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "relative w-full max-w-[420px] overflow-hidden rounded-2xl",
                "border border-white/10 bg-white/[0.03] px-5 py-5",
                "shadow-[0_18px_60px_rgba(0,0,0,0.85)]"
              )}
            >
              {/* snapshot-style glow */}
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.30),transparent_58%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.22),transparent_58%)] opacity-70" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white/80">
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

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.7rem]">
                    <span className="rounded-full border border-white/12 bg-white/[0.04] px-2 py-0.5 text-white/65">
                      {cert.tag}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.02] px-2 py-0.5 text-white/45">
                      {cert.year}
                    </span>

                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] px-2 py-0.5 text-white/55 hover:text-white"
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
    </section>
  );
}
