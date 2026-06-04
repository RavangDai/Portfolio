"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  Code2,
  Database,
  ExternalLink,
  Sparkles,
  Table2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Certificate = {
  title: string;
  issuer: string;
  year: number;
  category: string;
  summary: string;
  skills: string[];
  image: string;
  url: string;
  Icon: LucideIcon;
  featured?: boolean;
};

const certificates: Certificate[] = [
  {
    title: "Software Engineer Certificate",
    issuer: "HackerRank",
    year: 2025,
    category: "Full-stack Engineering",
    summary: "Role certification covering problem solving, REST APIs, full-stack structure, and data structures.",
    skills: ["Problem Solving", "REST APIs", "Full-stack", "Data Structures"],
    image: "/certificates/software-engineer-crop.png",
    url: "https://www.hackerrank.com/certificates/iframe/1ec7df9efdd8",
    Icon: Code2,
    featured: true,
  },
  {
    title: "SQL (Advanced) Certificate",
    issuer: "HackerRank",
    year: 2025,
    category: "Data / Backend",
    summary: "Advanced SQL certification covering query optimization, indexing, joins, subqueries, and pivots.",
    skills: ["Complex Queries", "Indexing", "Joins", "Performance"],
    image: "/certificates/sql-advanced-crop.png",
    url: "https://www.hackerrank.com/certificates/a0f6fb1fb4af",
    Icon: Database,
  },
  {
    title: "Excel Fundamentals - Finance",
    issuer: "Corporate Finance Institute",
    year: 2024,
    category: "Finance & Analysis",
    summary: "Finance-focused Excel credential covering formulas, analysis workflows, and structured spreadsheet modeling.",
    skills: ["Excel Formulas", "Financial Modeling", "Data Analysis", "Pivot Tables"],
    image: "/certificates/excel-finance-crop.png",
    url: "https://credentials.corporatefinanceinstitute.com/88b6efc3-2491-4e1d-9e12-433819361baa",
    Icon: Table2,
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function ProofPill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.09] bg-black/35 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-white/62">
      <CheckCircle2 className="h-3 w-3" />
      Verified
    </span>
  );
}

function CertificateTile({
  certificate,
  index,
  className,
  imagePriority = false,
  featured: featuredProp,
}: {
  certificate: Certificate;
  index: number;
  className?: string;
  imagePriority?: boolean;
  /** Override the data's `featured` flag (e.g. force uniform tiles in a row). */
  featured?: boolean;
}) {
  const Icon = certificate.Icon;
  const featured = featuredProp ?? certificate.featured;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease }}
      className={cn(
        "group glass-panel relative overflow-hidden rounded-2xl border border-white/[0.08]",
        "shadow-[0_22px_70px_rgba(0,0,0,0.42)] transition-[border-color,transform] duration-300",
        "hover:-translate-y-1 hover:border-white/[0.18]",
        className
      )}
    >
      <a
        href={certificate.url}
        target="_blank"
        rel="noreferrer"
        className="block h-full"
        aria-label={`View ${certificate.title}`}
      >
        <div
          className={cn(
            "relative border-b border-white/[0.06] bg-white/[0.04]",
            featured ? "p-3 sm:p-4" : "p-3"
          )}
        >
          <div className="overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <Image
              src={certificate.image}
              alt={`${certificate.title} issued by ${certificate.issuer}`}
              width={1000}
              height={740}
              priority={imagePriority}
              sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 100vw"}
              className={cn(
                "block w-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]",
                featured ? "aspect-[1.36/1]" : "aspect-[1.35/1]"
              )}
            />
          </div>

          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </div>

        <div className={cn("relative", featured ? "p-5 sm:p-6" : "p-5")}>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.04] text-white/72">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/34">
                  {certificate.issuer}
                </p>
                <p className="mt-1 text-xs font-medium text-white/46">{certificate.category}</p>
              </div>
            </div>
            <ProofPill />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h3
                className={cn(
                  "font-black leading-tight tracking-tight text-white",
                  featured ? "text-2xl sm:text-3xl" : "text-xl"
                )}
              >
                {certificate.title}
              </h3>
              <p className={cn("mt-3 leading-relaxed text-white/52", featured ? "text-sm sm:text-base" : "text-sm")}>
                {certificate.summary}
              </p>
            </div>
            <span className="font-mono text-xs text-white/35">{certificate.year}</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {certificate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-[0.62rem] font-semibold text-white/54"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-white/72 transition-colors duration-200 group-hover:text-white">
            View credential
            <ExternalLink className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </a>
    </motion.article>
  );
}

// ─── Flagship certificate — wide horizontal hero ──────────────────────────────

function FeaturedCertificate({ certificate }: { certificate: Certificate }) {
  const Icon = certificate.Icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease }}
      className="group glass-panel relative overflow-hidden rounded-3xl border border-white/[0.08] shadow-[0_28px_80px_rgba(0,0,0,0.5)] transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-white/[0.18]"
    >
      <a
        href={certificate.url}
        target="_blank"
        rel="noreferrer"
        className="grid lg:grid-cols-[1.25fr_1fr]"
        aria-label={`View ${certificate.title}`}
      >
        {/* Media */}
        <div className="relative border-b border-white/[0.06] bg-white/[0.04] p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <div className="overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <Image
              src={certificate.image}
              alt={`${certificate.title} issued by ${certificate.issuer}`}
              width={1000}
              height={740}
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="block aspect-[1.5/1] w-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
            />
          </div>
          <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

          <span className="glass-chip absolute left-7 top-8 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-white/78">
            <Sparkles className="h-3 w-3" />
            Flagship
          </span>
        </div>

        {/* Details */}
        <div className="relative flex flex-col p-6 sm:p-8">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.04] text-white/72">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-white/34">
                  {certificate.issuer}
                </p>
                <p className="mt-1 text-xs font-medium text-white/46">{certificate.category}</p>
              </div>
            </div>
            <ProofPill />
          </div>

          <h3 className="font-black leading-tight tracking-tight text-white text-3xl sm:text-4xl">
            {certificate.title}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/52 sm:text-base">
            {certificate.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {certificate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-[0.62rem] font-semibold text-white/54"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 pt-8">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-white/72 transition-colors duration-200 group-hover:text-white">
              View credential
              <ExternalLink className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
            <span className="font-mono text-xs text-white/35">{certificate.year}</span>
          </div>
        </div>
      </a>
    </motion.article>
  );
}

export function CertificatesSection() {
  const featured = certificates[0];

  return (
    <section
      id="certificates"
      className="relative w-full overflow-hidden bg-[#080808]/72 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="mb-12 flex flex-col gap-8 md:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5">
              <Award className="h-3.5 w-3.5 text-white/55" />
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/40">
                Certificates
              </span>
            </div>

            <h2 className="font-display text-5xl font-black leading-[0.95] tracking-tighter text-white md:text-7xl">
              Proof wall.
              <br />
              <span className="text-white/22">Real receipts.</span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/42">
              A bento grid of issuer-backed certificates across engineering,
              backend data, and finance workflows.
            </p>
          </motion.div>

          <motion.a
            href={featured.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: 0.08, ease }}
            className="group inline-flex h-11 w-fit items-center gap-2 rounded-full border border-white/12 bg-white px-4 text-sm font-bold text-black transition-[transform,background-color] duration-200 hover:bg-white/86 active:scale-[0.97]"
          >
            Verify latest
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </motion.a>
        </div>

        {/* Asymmetric bento — flagship hero on top, supporting certs in a 2-up row */}
        <div className="flex flex-col gap-4">
          <FeaturedCertificate certificate={certificates[0]} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {certificates.slice(1).map((certificate, index) => (
              <CertificateTile
                key={certificate.title}
                certificate={certificate}
                index={index + 1}
                featured={false}
                className="h-full"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
