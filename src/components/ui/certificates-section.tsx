"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Code2,
  Database,
  ExternalLink,
  Table2,
  type LucideIcon,
} from "lucide-react";

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
    title: "Introduction to Tableau",
    issuer: "Simplilearn · SkillUp",
    year: 2025,
    category: "Data Visualization",
    summary: "Completion course covering interactive dashboards, charts, and visual analytics workflows in Tableau.",
    skills: ["Tableau", "Data Visualization", "Dashboards", "Analytics"],
    image: "/tablue certificate.png",
    url: "https://www.simplilearn.com/skillup-certificate-landing?token=eyJjb3Vyc2VfaWQiOiI0MDY4IiwiY2VydGlmaWNhdGVfdXJsIjoiaHR0cHM6XC9cL2NlcnRpZmljYXRlcy5zaW1wbGljZG4ubmV0XC9zaGFyZVwvODAyNTU5NV84MzQyNzMxMTc0MTY2MzI1OTE1OC5wbmciLCJ1c2VybmFtZSI6IkJpYmVrIFBhdGhhayJ9&referrer=https%3A%2F%2Flms.simplilearn.com%2Fcourses%2F7062%2FIntroduction-to-Tableau%2Fcertificate%2Fdownload-skillup&%24web_only=true",
    Icon: BarChart3,
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

const PASTELS = ["var(--mint)", "var(--lavender)", "var(--butter)"];
const ease = [0.22, 1, 0.36, 1] as const;

function CertCard({ certificate, pastel }: { certificate: Certificate; pastel: string }) {
  const Icon = certificate.Icon;
  return (
    <article className="brut-card-i group flex flex-col overflow-hidden">
      {/* Thumb */}
      <div
        className="relative w-full overflow-hidden border-b-2 border-[var(--ink)]"
        style={{ background: pastel }}
      >
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={certificate.image}
            alt={`${certificate.title} issued by ${certificate.issuer}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
        <span className="brut-chip-accent brut-chip absolute right-3 top-3">
          <CheckCircle2 className="h-3 w-3" />
          {certificate.year}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border-2 border-[var(--ink)] bg-[var(--paper)]">
            <Icon className="h-4 w-4 text-[var(--accent)]" />
          </span>
          <div className="min-w-0">
            <p className="brut-mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--ink-2)]">
              {certificate.issuer}
            </p>
            <p className="text-[0.66rem] font-medium text-[var(--ink-3)]">{certificate.category}</p>
          </div>
        </div>

        <h3 className="brut-h text-xl leading-tight">{certificate.title}</h3>
        <p className="text-[0.82rem] leading-relaxed text-[var(--ink-2)]">{certificate.summary}</p>

        <div className="flex flex-wrap gap-1.5">
          {certificate.skills.map((skill) => (
            <span key={skill} className="brut-chip">{skill}</span>
          ))}
        </div>

        <div className="mt-auto pt-2">
          <a href={certificate.url} target="_blank" rel="noreferrer" className="brut-btn-ghost w-full">
            View credential
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function CertificatesSection() {
  return (
    <section
      id="certificates"
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
          <p className="brut-kicker mb-4">Certificates · Verified</p>
          <h1 className="brut-h text-[clamp(2.6rem,8vw,5.5rem)]">
            Proof wall. <span className="text-[var(--accent)]">Real receipts.</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--ink-2)]">
            Issuer-backed credentials — each one links to its public verification page.
          </p>
        </motion.header>

        {/* ── Grid ── */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-6 md:grid-cols-3"
        >
          {certificates.map((certificate, i) => (
            <motion.div
              key={certificate.title}
              variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease }}
            >
              <CertCard certificate={certificate} pastel={PASTELS[i % PASTELS.length]} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease }}
          className="mt-12 flex justify-center"
        >
          <a href={certificates[0].url} target="_blank" rel="noreferrer" className="brut-btn">
            Verify latest
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
