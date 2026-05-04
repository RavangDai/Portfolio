"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Check } from "lucide-react";
import { SectionGradientBg } from "@/components/ui/section-gradient-bg";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* TYPES & DATA                                                               */
/* -------------------------------------------------------------------------- */

type Certificate = {
    title: string;
    issuer: string;
    year: number;
    tag: string;
    highlight: string;
    skills: string[];
    url?: string;
};

const certificates: Certificate[] = [
    {
        title: "Software Engineer Certificate",
        issuer: "HackerRank",
        year: 2025,
        tag: "Full-stack Engineering",
        highlight: "Problem-solving, REST APIs, and full-stack architecture.",
        skills: ["Problem Solving", "REST API Design", "Full-stack Arch", "Data Structures"],
        url: "https://www.hackerrank.com/certificates/iframe/1ec7df9efdd8",
    },
    {
        title: "SQL (Advanced) Certificate",
        issuer: "HackerRank",
        year: 2025,
        tag: "Data / Backend",
        highlight: "Complex queries, joins, indexing, and performance tuning.",
        skills: ["Complex Queries", "Joins & Subqueries", "Indexing", "Performance Tuning"],
        url: "https://www.hackerrank.com/certificates/a0f6fb1fb4af",
    },
    {
        title: "Excel Fundamentals - Finance",
        issuer: "Corporate Finance Institute",
        year: 2024,
        tag: "Finance & Analysis",
        highlight: "Financial modeling, formulas, and data analysis in Excel.",
        skills: ["Financial Modeling", "Pivot Tables", "Data Analysis", "Excel Formulas"],
        url: "https://credentials.corporatefinanceinstitute.com/88b6efc3-2491-4e1d-9e12-433819361baa",
    },
];

/* -------------------------------------------------------------------------- */
/* CREDENTIAL ROW                                                             */
/* -------------------------------------------------------------------------- */

function CredentialRow({ cert, index, total }: { cert: Certificate; index: number; total: number }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0a0c] transition-colors duration-500 hover:border-white/20"
        >
            {/* One-shot verification scan that fires when row enters the viewport */}
            <motion.div
                aria-hidden
                initial={{ x: "-30%", opacity: 0 }}
                whileInView={{ x: "130%", opacity: [0, 0.9, 0] }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 1.4, delay: index * 0.12 + 0.15, ease: [0.4, 0, 0.2, 1] }}
                className="pointer-events-none absolute inset-y-0 w-[180px]"
                style={{
                    background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.10) 60%, transparent)",
                    filter: "blur(0.5px)",
                }}
            />

            {/* Continuous slow scan on hover */}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 w-[140px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{ x: ["-140px", "calc(100% + 140px)"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                style={{
                    background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
                }}
            />

            {/* Left rail accent bar — fills on hover */}
            <div className="absolute inset-y-0 left-0 w-[2px] overflow-hidden">
                <div className="h-full w-full bg-white/[0.05]" />
                <div
                    className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-gradient-to-b from-white/70 via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:scale-y-100"
                />
            </div>

            <div className="relative px-6 py-7 sm:px-9 sm:py-8">
                {/* TOP: serial / verified / year */}
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-[0.6rem] tracking-[0.22em] text-white/30">
                            {String(index + 1).padStart(3, "0")}
                            <span className="mx-1.5 text-white/15">/</span>
                            {String(total).padStart(3, "0")}
                        </span>
                        <span className="h-3 w-px bg-white/10" />
                        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5">
                            <Check className="h-2.5 w-2.5 text-white/60" strokeWidth={3} />
                            <span className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-white/45">
                                verified
                            </span>
                        </span>
                    </div>
                    <span className="font-mono text-[0.65rem] tracking-[0.2em] text-white/35">
                        {cert.year}
                    </span>
                </div>

                {/* TITLE */}
                <div className="flex items-baseline gap-3">
                    <span
                        aria-hidden
                        className="mt-1 text-base leading-none text-white/45 transition-colors duration-500 group-hover:text-white/80"
                    >
                        ◆
                    </span>
                    <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-white sm:text-[1.55rem]">
                        {cert.title}
                    </h3>
                </div>

                {/* ISSUER + TAG */}
                <div className="ml-7 mt-1.5 flex flex-wrap items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.25em] text-white/40">
                    <span>{cert.issuer}</span>
                    <span className="text-white/15">·</span>
                    <span className="text-white/35">{cert.tag}</span>
                </div>

                {/* HIGHLIGHT */}
                <p className="ml-7 mt-5 max-w-2xl text-[0.92rem] leading-relaxed text-white/55">
                    {cert.highlight}
                </p>

                {/* HAIRLINE DIVIDER */}
                <div className="ml-7 my-6 h-px bg-gradient-to-r from-white/[0.10] via-white/[0.04] to-transparent" />

                {/* SKILLS + VERIFY */}
                <div className="ml-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
                    <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        {cert.skills.map((skill, i) => (
                            <li key={skill} className="flex items-center gap-3">
                                {i > 0 && <span aria-hidden className="text-white/15">·</span>}
                                <span className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-white/55">
                                    {skill}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {cert.url && (
                        <a
                            href={cert.url}
                            target="_blank"
                            rel="noreferrer"
                            className={cn(
                                "group/v shrink-0 inline-flex items-center gap-2",
                                "rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5",
                                "text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/55",
                                "transition-all duration-300",
                                "hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
                            )}
                        >
                            <span>verify</span>
                            <ExternalLink
                                className="h-3 w-3 transition-transform duration-200 group-hover/v:-translate-y-0.5 group-hover/v:translate-x-0.5"
                            />
                        </a>
                    )}
                </div>
            </div>
        </motion.article>
    );
}

/* -------------------------------------------------------------------------- */
/* TICKER-TAPE STAT HEADER                                                    */
/* -------------------------------------------------------------------------- */

function StatBlock({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex items-baseline gap-2">
            <span className="font-mono text-[0.95rem] font-semibold text-white/85">{value}</span>
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-white/35">
                {label}
            </span>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* SECTION                                                                    */
/* -------------------------------------------------------------------------- */

export function CertificatesSection() {
    const sortedCertificates = useMemo(
        () => [...certificates].sort((a, b) => b.year - a.year),
        []
    );

    const stats = useMemo(() => {
        const years = certificates.map((c) => c.year);
        const yearRange =
            Math.min(...years) === Math.max(...years)
                ? `${Math.min(...years)}`
                : `${Math.min(...years)}–${Math.max(...years)}`;
        const issuerCount = new Set(certificates.map((c) => c.issuer)).size;
        return {
            count: String(certificates.length).padStart(2, "0"),
            yearRange,
            issuers: String(issuerCount).padStart(2, "0"),
        };
    }, []);

    return (
        <section
            id="certificates"
            className="relative w-full overflow-hidden bg-[#080808] py-20 md:py-28"
        >
            <SectionGradientBg />

            <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 md:px-8">
                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-12 md:mb-16"
                >
                    <p className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/35">
                        Credentials Ledger
                    </p>
                    <h2
                        className="font-display font-black leading-[0.9] tracking-tighter"
                        style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)" }}
                    >
                        <span className="shimmer-text">Skills I&apos;ve</span>
                        <br />
                        <span className="text-white/20">proven.</span>
                    </h2>

                    {/* Ticker-tape stat row */}
                    <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 border-y border-white/[0.06] py-4">
                        <StatBlock value={stats.count} label="certificates" />
                        <span className="h-3 w-px bg-white/10" />
                        <StatBlock value={stats.yearRange} label="active range" />
                        <span className="h-3 w-px bg-white/10" />
                        <StatBlock value={stats.issuers} label="independent issuers" />
                        <span className="h-3 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                            <motion.span
                                className="h-1.5 w-1.5 rounded-full bg-white/70"
                                animate={{ opacity: [0.35, 1, 0.35] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-white/45">
                                live verifiable
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* CREDENTIAL LIST */}
                <div className="space-y-4">
                    {sortedCertificates.map((cert, i) => (
                        <CredentialRow
                            key={cert.title}
                            cert={cert}
                            index={i}
                            total={sortedCertificates.length}
                        />
                    ))}
                </div>

                {/* FOOTER NOTE */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-10 text-center font-mono text-[0.6rem] uppercase tracking-[0.28em] text-white/25"
                >
                    end of ledger · all credentials independently issued
                </motion.p>
            </div>
        </section>
    );
}
