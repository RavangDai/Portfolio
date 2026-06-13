"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, ExternalLink } from "lucide-react";
import type { Certificate } from "@/lib/content/types";
import { getIcon } from "@/lib/content/icons";

const PASTELS = ["var(--mint)", "var(--lavender)", "var(--butter)"];
const ease = [0.22, 1, 0.36, 1] as const;

function CertCard({ certificate, pastel }: { certificate: Certificate; pastel: string }) {
  const Icon = getIcon(certificate.icon);
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

interface CertificatesSectionProps {
  certificates: Certificate[];
}

export function CertificatesSection({ certificates }: CertificatesSectionProps) {
  if (!certificates.length) {
    return (
      <section
        id="certificates"
        className="theme-brut brut-bg relative min-h-screen w-full pt-28 pb-24 md:pt-36"
      >
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
          <p className="text-[var(--ink-2)]">No certificates yet.</p>
        </div>
      </section>
    );
  }

  const verifyUrl = certificates[0]?.url;

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
          <h1 className="brut-title text-[clamp(2.6rem,8vw,5.5rem)]">
            Proof wall. <span className="text-[var(--accent)]">Real receipts.</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--ink-2)]">
            Issuer-backed credentials, each linking to its public verification page.
          </p>
        </motion.header>

        {/* ── Grid ── */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
        >
          {certificates.map((certificate, i) => (
            <motion.div
              key={certificate.id}
              variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease }}
            >
              <CertCard certificate={certificate} pastel={PASTELS[i % PASTELS.length]} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── CTA ── */}
        {verifyUrl && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease }}
            className="mt-12 flex justify-center"
          >
            <a href={verifyUrl} target="_blank" rel="noreferrer" className="brut-btn">
              Verify latest
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
