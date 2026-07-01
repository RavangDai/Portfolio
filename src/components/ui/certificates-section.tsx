"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, ExternalLink } from "lucide-react";
import type { Certificate } from "@/lib/content/types";
import { getIcon } from "@/lib/content/icons";
import { HighlightText } from "@/components/ui/highlight";
import { Tape } from "@/components/ui/tape";
import { Carousel } from "@/components/retroui/Carousel";

const PASTELS = ["var(--mint)", "var(--lavender)", "var(--butter)"];
const ease = [0.22, 1, 0.36, 1] as const;
// Stable reference — passing a fresh opts object each render makes Embla re-init in a loop.
const CAROUSEL_OPTS = { align: "start" as const };

// Swipe is a mobile-only affordance. useSyncExternalStore keeps this SSR-safe (server → false →
// grid) so Embla is mounted ONLY on phones — desktop never touches the carousel.
function useIsMobile() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(max-width: 767px)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );
}

// Card + its decorative washi tape (used by both the desktop grid and the mobile carousel).
function CertCardWithTape({ certificate, i }: { certificate: Certificate; i: number }) {
  const taped = i === 0 || i === 1;
  return (
    <div
      className={taped ? "brut-taped relative h-full pt-2" : "relative h-full pt-2"}
      style={taped ? ({ "--tilt": i === 0 ? "-1.5deg" : "1.4deg" } as React.CSSProperties) : undefined}
    >
      {i === 0 && (
        <Tape color="mint" rotate={-5} style={{ top: "-0.1rem", left: "1.3rem", width: "3.4rem", height: "1.2rem", zIndex: 5 }} />
      )}
      {i === 1 && (
        <Tape color="marigold" rotate={6} style={{ top: "-0.1rem", right: "1.3rem", width: "3rem", height: "1.2rem", zIndex: 5 }} />
      )}
      <CertCard certificate={certificate} pastel={PASTELS[i % PASTELS.length]} />
    </div>
  );
}

function CertCard({ certificate, pastel }: { certificate: Certificate; pastel: string }) {
  const Icon = getIcon(certificate.icon);
  return (
    <article className="brut-card-i group flex h-full flex-col overflow-hidden">
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
            <p className="brut-mono text-[0.72rem] uppercase tracking-[0.16em] text-[var(--ink-2)]">
              {certificate.issuer}
            </p>
            <p className="text-[0.78rem] font-medium text-[var(--ink-3)]">{certificate.category}</p>
          </div>
        </div>

        <h3 className="brut-h text-xl leading-tight">
          <HighlightText mode="reveal" ink underline inkColor="ink">{certificate.title}</HighlightText>
        </h3>
        <p className="text-[0.95rem] leading-relaxed text-[var(--ink-2)]">{certificate.summary}</p>

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
  const isMobile = useIsMobile();

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
          <h1 className="brut-title text-[clamp(2.6rem,8vw,5.5rem)]">
            Proof wall. <HighlightText mode="scroll" ink underline from="right">Real receipts.</HighlightText>
          </h1>
          <span aria-hidden className="mt-5 block h-[4px] w-12 rounded-full bg-[var(--marigold)]" />
        </motion.header>

        {/* ── Desktop: grid. Mobile: swipeable carousel (Embla mounts only on phones). ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease }}
        >
          {isMobile ? (
            <Carousel opts={CAROUSEL_OPTS} className="w-full">
              {/* Arrows — reachable group above the rail (swipe is primary; these are a fallback). */}
              <div className="mb-5 flex justify-end gap-2.5">
                <Carousel.Previous />
                <Carousel.Next />
              </div>
              <Carousel.Content>
                {certificates.map((certificate, i) => (
                  <Carousel.Item key={certificate.id} className="basis-[85%] sm:basis-1/2">
                    {/* p-4 keeps the card's 2px border + offset shadow off the viewport's
                        overflow:hidden clip edge (per RetroUI's default carousel variant). */}
                    <div className="p-4">
                      <CertCardWithTape certificate={certificate} i={i} />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel.Content>
            </Carousel>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {certificates.map((certificate, i) => (
                <CertCardWithTape key={certificate.id} certificate={certificate} i={i} />
              ))}
            </div>
          )}
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
