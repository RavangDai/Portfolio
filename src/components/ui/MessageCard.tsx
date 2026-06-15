import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Code2, TrendingUp } from "lucide-react";

// --- Linkify: turn URLs, bare domains, and emails into clickable anchors ---
// Bare-domain TLD whitelist deliberately excludes js/ts so "Next.js"/"Node.js"
// are never mistaken for links.
const LINK_RE =
    /(https?:\/\/[^\s<>]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(www\.[^\s<>]+)|((?:[a-z0-9-]+\.)+(?:com|app|dev|io|org|net|ai|co|me|xyz|tech|page|gg|so)(?:\/[^\s<>]*)?)/gi;

export function linkify(text: string): ReactNode[] {
    const out: ReactNode[] = [];
    let last = 0;
    let key = 0;
    for (const m of text.matchAll(LINK_RE)) {
        const idx = m.index ?? 0;
        if (idx > last) out.push(text.slice(last, idx));
        let token = m[0];
        // Strip trailing punctuation that isn't part of the link
        let trail = "";
        const tm = token.match(/[.,!?;:'")\]]+$/);
        if (tm) { trail = tm[0]; token = token.slice(0, -trail.length); }
        const isEmail = !!m[2];
        const href = isEmail
            ? `mailto:${token}`
            : token.startsWith("http")
            ? token
            : `https://${token}`;
        out.push(
            <a
                key={`lnk-${key++}`}
                href={href}
                target={isEmail ? undefined : "_blank"}
                rel="noreferrer"
                className="font-medium underline underline-offset-2 break-words text-[var(--chat-link,#ffffff)] hover:opacity-80 transition-opacity"
            >
                {token}
            </a>
        );
        if (trail) out.push(trail);
        last = idx + m[0].length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out.length ? out : [text];
}

// --- Card Types ---
export interface ProjectCardData {
    type: "project";
    name: string;
    impact?: string;
    stack: string[];
    tags?: string[];
    status?: string;
    prompt?: string; // e.g., "→ Want architecture?"
}

export interface SkillCardData {
    type: "skill";
    name: string;
    depth: "built" | "knows" | "learning";
    projects?: string[];
}

export interface MetricCardData {
    type: "metric";
    label: string;
    value: number;
    unit: string; // "%", "ms", "users", etc.
    context?: string;
}

export interface TextCardData {
    type: "text";
    content: string;
}

export type CardData = ProjectCardData | SkillCardData | MetricCardData | TextCardData;

// --- Tag Component ---
function Tag({ label, variant = "default", brut = false }: { label: string; variant?: "default" | "ai" | "production"; brut?: boolean }) {
    if (brut) {
        // Light brutalism — square ink-bordered chips regardless of semantic variant.
        return (
            <span className="inline-flex items-center rounded-[3px] border-2 border-[#1a1714] bg-[#f7f1e8] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#1a1714]">
                {label}
            </span>
        );
    }
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                variant === "ai" && "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20",
                variant === "production" && "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
                variant === "default" && "bg-white/[0.06] text-white/60 border border-white/[0.08]"
            )}
        >
            {label}
        </span>
    );
}

// --- Metric Count-Up Component (simple version, no external lib) ---
function CountUpMetric({ value, unit }: { value: number; unit: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex items-baseline gap-1"
        >
            <motion.span
                className="text-2xl font-semibold text-[var(--chat-accent,#34d399)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                {value > 0 && "+"}{value}{unit}
            </motion.span>
        </motion.div>
    );
}

// --- Project Card Component ---
function ProjectCard({ data, brut = false }: { data: ProjectCardData; brut?: boolean }) {
    const tagVariants: Record<string, "ai" | "production" | "default"> = {
        ai: "ai",
        ml: "ai",
        llm: "ai",
        production: "production",
        shipped: "production",
        live: "production",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
                "p-4 space-y-3",
                brut
                    ? "rounded-[6px] border-2 border-[#1a1714] bg-white shadow-[3px_3px_0_0_#bd5232]"
                    : "rounded-lg border border-white/10 bg-[rgba(18,20,26,0.9)]"
            )}
        >
            {/* Project Name */}
            <div className="flex items-start justify-between">
                <h4 className="text-sm font-semibold text-[var(--chat-fg-strong)]">{data.name}</h4>
            </div>

            {/* Impact */}
            {data.impact && (
                <div className="flex items-center gap-2 text-[13px]">
                    <TrendingUp className="h-3.5 w-3.5 text-[var(--chat-accent,#34d399)]" />
                    <span className="text-[var(--chat-fg)]">{linkify(data.impact)}</span>
                </div>
            )}

            {/* Stack */}
            <div className="flex items-center gap-1.5 text-[12px] text-[var(--chat-fg)]">
                <Code2 className="h-3 w-3" />
                <span>{data.stack.join(" • ")}</span>
            </div>

            {/* Tags */}
            {data.tags && data.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {data.tags.map((tag) => (
                        <Tag
                            key={tag}
                            label={tag}
                            variant={tagVariants[tag.toLowerCase()] || "default"}
                            brut={brut}
                        />
                    ))}
                </div>
            )}

            {/* Status */}
            {data.status && (
                <p className="text-[11px] text-[var(--chat-fg-dim)] italic">{linkify(data.status)}</p>
            )}

            {/* Prompt for more info */}
            {data.prompt && (
                <div className="flex items-start gap-1.5 text-[12px] text-[var(--chat-accent,#34d399)] pt-1">
                    <ArrowRight className="h-3 w-3 mt-0.5 shrink-0" />
                    <span>{linkify(data.prompt)}</span>
                </div>
            )}
        </motion.div>
    );
}

// --- Metric Card Component ---
function MetricCard({ data, brut = false }: { data: MetricCardData; brut?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className={cn(
                "p-4 space-y-2",
                brut
                    ? "rounded-[6px] border-2 border-[#1a1714] bg-white shadow-[3px_3px_0_0_#bd5232]"
                    : "rounded-lg border border-emerald-500/[0.15] bg-gradient-to-br from-emerald-500/10 to-cyan-500/5"
            )}
        >
            <p className="text-[11px] uppercase tracking-wide text-[var(--chat-fg-dim)]">{data.label}</p>
            <CountUpMetric value={data.value} unit={data.unit} />
            {data.context && <p className="text-[12px] text-[var(--chat-fg)]">{data.context}</p>}
        </motion.div>
    );
}

// --- Text Card Component (default fallback) ---
function TextCard({ content }: { content: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-[13px] leading-relaxed text-[var(--chat-fg)]"
        >
            {linkify(content)}
        </motion.div>
    );
}

// --- Main MessageCard Component ---
export function MessageCard({ data, brut = false }: { data: CardData; brut?: boolean }) {
    switch (data.type) {
        case "project":
            return <ProjectCard data={data} brut={brut} />;
        case "metric":
            return <MetricCard data={data} brut={brut} />;
        case "text":
        default:
            return <TextCard content={(data as TextCardData).content} />;
    }
}

// --- Utility: Parse AI response into cards ---
export function parseMessageToCards(content: string): CardData[] {
    const cards: CardData[] = [];

    // Try to detect structured project format
    // Example: "Project: KaryaAI\nImpact: +32% completion\nStack: MERN, LLM, Cron\nTags: AI, Production"
    const projectPattern = /Project:\s*(.+?)(?:\n|$)(?:Impact:\s*(.+?)(?:\n|$))?(?:Stack:\s*(.+?)(?:\n|$))?(?:Tags:\s*(.+?)(?:\n|$))?(?:Status:\s*(.+?)(?:\n|$))?(?:Prompt:\s*(.+?)(?:\n|$))?/gi;

    let match;
    let hasStructuredContent = false;

    while ((match = projectPattern.exec(content)) !== null) {
        hasStructuredContent = true;
        cards.push({
            type: "project",
            name: match[1].trim(),
            impact: match[2]?.trim(),
            stack: match[3]?.split(/[,•]/).map(s => s.trim()).filter(Boolean) || [],
            tags: match[4]?.split(/[,]/).map(s => s.trim()).filter(Boolean),
            status: match[5]?.trim(),
            prompt: match[6]?.trim(),
        });
    }

    // If no structured content found, return as simple text
    if (!hasStructuredContent) {
        cards.push({
            type: "text",
            content: content.trim(),
        });
    }

    return cards;
}
