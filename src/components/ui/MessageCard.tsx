import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight, Code2, TrendingUp } from "lucide-react";

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
function Tag({ label, variant = "default" }: { label: string; variant?: "default" | "ai" | "production" }) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                variant === "ai" && "bg-violet-500/15 text-violet-300 border border-violet-500/20",
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
                className="text-2xl font-semibold text-indigo-300"
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
function ProjectCard({ data }: { data: ProjectCardData }) {
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
                "rounded-lg border border-white/[0.1] bg-gradient-to-br from-white/[0.08] to-white/[0.04]",
                "p-4 space-y-3 backdrop-blur-sm"
            )}
        >
            {/* Project Name */}
            <div className="flex items-start justify-between">
                <h4 className="text-sm font-medium text-white/90">{data.name}</h4>
            </div>

            {/* Impact */}
            {data.impact && (
                <div className="flex items-center gap-2 text-[13px]">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-slate-300">{data.impact}</span>
                </div>
            )}

            {/* Stack */}
            <div className="flex items-center gap-1.5 text-[12px] text-slate-400">
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
                        />
                    ))}
                </div>
            )}

            {/* Status */}
            {data.status && (
                <p className="text-[11px] text-white/40 italic">{data.status}</p>
            )}

            {/* Prompt for more info */}
            {data.prompt && (
                <div className="flex items-center gap-1.5 text-[12px] text-indigo-400 pt-1">
                    <ArrowRight className="h-3 w-3" />
                    <span>{data.prompt}</span>
                </div>
            )}
        </motion.div>
    );
}

// --- Metric Card Component ---
function MetricCard({ data }: { data: MetricCardData }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className={cn(
                "rounded-lg border border-white/[0.1] bg-gradient-to-br from-indigo-500/10 to-violet-500/5",
                "p-4 space-y-2"
            )}
        >
            <p className="text-[11px] uppercase tracking-wide text-white/50">{data.label}</p>
            <CountUpMetric value={data.value} unit={data.unit} />
            {data.context && <p className="text-[12px] text-slate-400">{data.context}</p>}
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
            className="text-[13px] leading-relaxed text-slate-300"
        >
            {content}
        </motion.div>
    );
}

// --- Main MessageCard Component ---
export function MessageCard({ data }: { data: CardData }) {
    switch (data.type) {
        case "project":
            return <ProjectCard data={data} />;
        case "metric":
            return <MetricCard data={data} />;
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
