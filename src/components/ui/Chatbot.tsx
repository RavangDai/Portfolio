"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseMessageToCards, MessageCard } from "./MessageCard";

/* ─── Types ─── */
interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    important?: boolean;
    timestamp: number;
}

type IntentColor = "emerald" | "cyan" | "gold" | "warm" | "neutral";

/* ─── Intent Detection ─── */
const INTENT_MAP: { keywords: string[]; color: IntentColor }[] = [
    { keywords: ["project", "built", "shipped", "karya", "watch", "grid", "tick"], color: "emerald" },
    { keywords: ["architecture", "stack", "system", "design", "infra", "scale"], color: "cyan" },
    { keywords: ["hire", "hiring", "impact", "resume", "role", "position", "recruiter", "team"], color: "gold" },
    { keywords: ["story", "journey", "why", "personal", "background", "who"], color: "warm" },
];

const ACCENT_COLORS: Record<IntentColor, { primary: string; glow: string; bg: string }> = {
    emerald: { primary: "rgb(52, 211, 153)", glow: "rgba(52, 211, 153, 0.3)", bg: "rgba(52, 211, 153, 0.06)" },
    cyan: { primary: "rgb(34, 211, 238)", glow: "rgba(34, 211, 238, 0.3)", bg: "rgba(34, 211, 238, 0.06)" },
    gold: { primary: "rgb(251, 191, 36)", glow: "rgba(251, 191, 36, 0.25)", bg: "rgba(251, 191, 36, 0.05)" },
    warm: { primary: "rgb(251, 146, 60)", glow: "rgba(251, 146, 60, 0.25)", bg: "rgba(251, 146, 60, 0.05)" },
    neutral: { primary: "rgb(52, 211, 153)", glow: "rgba(52, 211, 153, 0.2)", bg: "rgba(52, 211, 153, 0.04)" },
};

function detectIntent(text: string): IntentColor {
    const lower = text.toLowerCase();
    for (const { keywords, color } of INTENT_MAP) {
        if (keywords.some((k) => lower.includes(k))) return color;
    }
    return "neutral";
}

/* ─── Formatted Message (Visual Hierarchy) ─── */
function FormattedMessage({ text }: { text: string }) {
    // Parse text into structured segments
    const lines = text.split("\n");

    return (
        <div className="space-y-0.5">
            {lines.map((line, i) => {
                const trimmed = line.trim();

                // Headings: lines starting with ## or **text**
                if (/^#{1,3}\s/.test(trimmed)) {
                    const headingText = trimmed.replace(/^#+\s*/, "");
                    return <span key={i} className="chat-heading">{headingText}</span>;
                }

                // Bold-only lines act as headings too
                if (/^\*\*.+\*\*$/.test(trimmed)) {
                    const boldText = trimmed.replace(/^\*\*|\*\*$/g, "");
                    return <span key={i} className="chat-heading">{boldText}</span>;
                }

                // Code blocks (```...```)
                // This handles single-line fenced code — multi-line is rare in chat
                if (/^```/.test(trimmed)) {
                    return null; // Skip fence markers
                }

                // List items: lines starting with - or •
                if (/^[-•]\s/.test(trimmed)) {
                    const itemText = trimmed.replace(/^[-•]\s*/, "");
                    return (
                        <span key={i} className="chat-list-item">
                            <InlineFormatted text={itemText} />
                        </span>
                    );
                }

                // Numbered list items: lines starting with 1. 2. etc
                if (/^\d+\.\s/.test(trimmed)) {
                    return (
                        <span key={i} className="chat-list-item">
                            <InlineFormatted text={trimmed} />
                        </span>
                    );
                }

                // Empty lines
                if (trimmed === "") {
                    return <span key={i} className="block h-1.5" />;
                }

                // Regular text with inline formatting
                return (
                    <span key={i} className="block">
                        <InlineFormatted text={trimmed} />
                    </span>
                );
            })}
        </div>
    );
}

/* ─── Inline Formatting (bold, code, annotated) ─── */
function InlineFormatted({ text }: { text: string }) {
    // Parse inline **bold** and `code` segments
    const parts: { text: string; type: "text" | "bold" | "code" }[] = [];
    // Match **bold**, `code`, or plain text between them
    const pattern = /(\*\*(.+?)\*\*|`([^`]+?)`)/g;
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
        // Text before match
        if (match.index > lastIndex) {
            parts.push({ text: text.slice(lastIndex, match.index), type: "text" });
        }

        if (match[2]) {
            // **bold**
            parts.push({ text: match[2], type: "bold" });
        } else if (match[3]) {
            // `code`
            parts.push({ text: match[3], type: "code" });
        }

        lastIndex = match.index + match[0].length;
    }

    // Remaining text
    if (lastIndex < text.length) {
        parts.push({ text: text.slice(lastIndex), type: "text" });
    }

    if (parts.length === 0) {
        parts.push({ text, type: "text" });
    }

    return (
        <>
            {parts.map((part, i) => {
                if (part.type === "bold") {
                    return (
                        <span key={i} className="font-semibold text-white/90">
                            {part.text}
                        </span>
                    );
                }
                if (part.type === "code") {
                    return (
                        <span key={i} className="chat-code">
                            {part.text}
                        </span>
                    );
                }
                return <AnnotatedText key={i} text={part.text} />;
            })}
        </>
    );
}

/* ─── Inline Micro-Details ─── */
function AnnotatedText({ text }: { text: string }) {
    const projects = ["WatchThis!AI", "KaryaAI", "GridNavigator", "TickTickFocus"];
    const skills = ["React", "Next.js", "TypeScript", "Python", "FastAPI", "MongoDB", "SQL", "Tailwind", "MERN", "LLM"];

    const parts: { text: string; type: "text" | "project" | "skill" | "number" }[] = [];
    let remaining = text;

    while (remaining.length > 0) {
        let earliest = remaining.length;
        let matchType: "project" | "skill" | "number" = "text" as "project" | "skill" | "number";
        let matchLen = 0;

        for (const p of projects) {
            const idx = remaining.indexOf(p);
            if (idx !== -1 && idx < earliest) {
                earliest = idx;
                matchType = "project";
                matchLen = p.length;
            }
        }

        for (const s of skills) {
            const idx = remaining.indexOf(s);
            if (idx !== -1 && idx < earliest) {
                earliest = idx;
                matchType = "skill";
                matchLen = s.length;
            }
        }

        const numMatch = remaining.match(/[+\-]?\d+[%msusers]*/);
        if (numMatch && numMatch.index !== undefined && numMatch.index < earliest) {
            earliest = numMatch.index;
            matchType = "number";
            matchLen = numMatch[0].length;
        }

        if (earliest === remaining.length) {
            parts.push({ text: remaining, type: "text" });
            break;
        }

        if (earliest > 0) {
            parts.push({ text: remaining.slice(0, earliest), type: "text" });
        }

        parts.push({ text: remaining.slice(earliest, earliest + matchLen), type: matchType });
        remaining = remaining.slice(earliest + matchLen);
    }

    return (
        <>
            {parts.map((part, i) => {
                if (part.type === "project") {
                    return (
                        <span key={i} className="inline-flex items-center gap-1">
                            <span className="text-[10px] opacity-40">◆</span>
                            <span className="text-white/90 font-medium">{part.text}</span>
                        </span>
                    );
                }
                if (part.type === "skill") {
                    return (
                        <span key={i} className="skill-mention">
                            {part.text}
                        </span>
                    );
                }
                if (part.type === "number") {
                    return <CountUpInline key={i} text={part.text} />;
                }
                return <span key={i}>{part.text}</span>;
            })}
        </>
    );
}

/* ─── Inline CountUp ─── */
function CountUpInline({ text }: { text: string }) {
    const numMatch = text.match(/([+\-]?)(\d+)(.*)/);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!numMatch) return;
        const target = parseInt(numMatch[2]);
        const duration = 800;
        const steps = 20;
        const stepTime = duration / steps;
        let current = 0;

        const interval = setInterval(() => {
            current += target / steps;
            if (current >= target) {
                setCount(target);
                clearInterval(interval);
            } else {
                setCount(Math.floor(current));
            }
        }, stepTime);

        return () => clearInterval(interval);
    }, [numMatch]);

    if (!numMatch) return <span>{text}</span>;

    return (
        <span className="text-white/90 font-medium tabular-nums">
            {numMatch[1]}{count}{numMatch[3]}
        </span>
    );
}

/* ─── Smart Prompts (with icons + primary) ─── */
const PROMPTS: { icon: string; label: string; primary?: boolean }[] = [
    { icon: "⚡", label: "what have you shipped", primary: true },
    { icon: "💼", label: "best project for hiring" },
    { icon: "🛠️", label: "what can you build" },
    { icon: "📖", label: "tell me your story" },
];

/* ─── Main Component ─── */
export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false); // tracks first user message
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "welcome",
            role: "assistant",
            content:
                "Hey. I'm Bibek, Ask me anything about what I've built, my stack, or what I'm working on.",
            important: true,
            timestamp: Date.now(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [intent, setIntent] = useState<IntentColor>("neutral");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const accent = ACCENT_COLORS[intent];

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // Focus on open
    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
    }, [isOpen]);

    // Escape to close
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) handleClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen]);



    const handleClose = useCallback(() => {
        setIsOpen(false);
        setIsCollapsed(true);
    }, []);

    const handleOpen = useCallback(() => {
        setIsCollapsed(false);
        setIsOpen(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const trimmed = input.trim();
        const detectedIntent = detectIntent(trimmed);
        setIntent(detectedIntent);
        setIsSending(true);
        setTimeout(() => setIsSending(false), 400);

        // Mark as interacted on first user message
        if (!hasInteracted) setHasInteracted(true);

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: trimmed,
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            if (!response.ok) throw new Error("Failed");

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantContent = "";
            const assistantId = (Date.now() + 1).toString();

            setMessages((prev) => [
                ...prev,
                { id: assistantId, role: "assistant", content: "", important: true, timestamp: Date.now() },
            ]);

            while (reader) {
                const { done, value } = await reader.read();
                if (done) break;
                assistantContent += decoder.decode(value, { stream: true });
                setMessages((prev) =>
                    prev.map((m) => (m.id === assistantId ? { ...m, content: assistantContent } : m))
                );
            }

            if (!assistantContent.trim()) {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantId ? { ...m, content: "Signal lost. Try again." } : m
                    )
                );
            }
        } catch {
            setMessages((prev) => {
                const cleaned = prev.filter((m) => !(m.role === "assistant" && m.content === ""));
                return [
                    ...cleaned,
                    {
                        id: (Date.now() + 1).toString(),
                        role: "assistant",
                        content: "Connection dropped. Try again.",
                        timestamp: Date.now(),
                    },
                ];
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Memory field: older non-important messages fade
    const visibleMessages = useMemo(() => {
        if (messages.length <= 6) return messages.map((m) => ({ ...m, opacity: 1 }));
        return messages.map((m, i) => {
            const age = messages.length - 1 - i;
            if (m.important || m.role === "user" || age < 3) return { ...m, opacity: 1 };
            const fade = Math.max(0.3, 1 - age * 0.15);
            return { ...m, opacity: fade };
        });
    }, [messages]);

    return (
        <>
            {/* ─── COLLAPSED (resume pill) ─── */}
            <AnimatePresence>
                {isCollapsed && !isOpen && (
                    <motion.button
                        onClick={handleOpen}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.04, y: -1 }}
                        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 cursor-pointer focus:outline-none"
                        style={{
                            borderRadius: "14px",
                            background: "rgba(7, 10, 9, 0.95)",
                            backdropFilter: "blur(28px)",
                            border: `1px solid ${accent.primary}30`,
                            boxShadow: `0 0 24px ${accent.glow}, 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
                        }}
                        aria-label="Reopen chat"
                    >
                        <motion.div
                            className="h-1.5 w-1.5 rounded-full shrink-0"
                            style={{ background: accent.primary }}
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-[11px] font-medium text-white/55 tracking-wide">resume chat</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ─── TRIGGER BUTTON ─── */}
            {!isCollapsed && !isOpen && (
                <motion.button
                    onClick={handleOpen}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22, delay: 1.5 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 px-5 py-3.5 cursor-pointer focus:outline-none overflow-hidden"
                    style={{
                        borderRadius: "16px",
                        background: "rgba(7, 10, 9, 0.96)",
                        backdropFilter: "blur(32px)",
                        border: "1px solid rgba(52, 211, 153, 0.2)",
                        boxShadow: `
                            0 0 0 1px rgba(52,211,153,0.06),
                            0 0 32px rgba(52,211,153,0.14),
                            0 20px 48px rgba(0,0,0,0.55),
                            inset 0 1px 0 rgba(255,255,255,0.05)
                        `,
                    }}
                    aria-label="Open AI chat"
                >
                    {/* Live orb */}
                    <div className="relative h-2.5 w-2.5 shrink-0">
                        <motion.span
                            className="absolute inset-0 rounded-full bg-emerald-400"
                            animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        />
                        <span className="relative flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] font-semibold text-white/82 tracking-tight leading-none">Ask Bibek&apos;s AI</span>
                        <span className="text-[9px] font-medium tracking-[0.16em] uppercase text-emerald-400/50 leading-none">6 projects · live</span>
                    </div>
                    {/* Shimmer sweep */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(105deg, transparent 30%, rgba(52,211,153,0.07) 50%, transparent 70%)" }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
                    />
                </motion.button>
            )}

            {/* ─── CHAT PANEL ─── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={containerRef}
                        initial={{ opacity: 0, y: 18, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.16 } }}
                        transition={{ type: "spring", stiffness: 360, damping: 30 }}
                        className={cn(
                            "fixed z-50 flex flex-col",
                            "bottom-0 left-0 right-0",
                            "sm:bottom-6 sm:left-auto sm:right-6 sm:w-[400px]",
                            "rounded-t-[22px] sm:rounded-[20px]"
                        )}
                        style={{
                            maxHeight: "min(84vh, calc(100dvh - 1rem))",
                            background: "rgba(7, 10, 9, 0.97)",
                            backdropFilter: "blur(64px) saturate(1.5)",
                            WebkitBackdropFilter: "blur(64px) saturate(1.5)",
                            border: "1px solid rgba(255,255,255,0.075)",
                            borderBottom: "none",
                            boxShadow: `
                                0 0 0 1px rgba(255,255,255,0.03),
                                0 40px 80px -20px rgba(0,0,0,0.75),
                                0 0 100px -32px ${accent.glow},
                                inset 0 1px 0 rgba(255,255,255,0.06)
                            `,
                            overflow: "hidden",
                        }}
                    >
                        {/* Top accent line */}
                        <motion.div
                            className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none z-10"
                            style={{ background: `linear-gradient(90deg, transparent 0%, ${accent.primary}80 50%, transparent 100%)` }}
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 3.5, repeat: Infinity }}
                        />

                        {/* ─── Header ─── */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05] shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="relative flex h-2 w-2 shrink-0">
                                    <motion.span
                                        className="absolute inset-0 rounded-full"
                                        style={{ background: accent.primary }}
                                        animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
                                        transition={{ duration: 2.8, repeat: Infinity }}
                                    />
                                    <span className="relative flex h-2 w-2 rounded-full" style={{ background: accent.primary }} />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[12px] font-bold tracking-widest text-white/78 leading-none">
                                        BIBEK<span style={{ color: accent.primary }}>.AI</span>
                                    </span>
                                    <span className="text-[9px] tracking-[0.22em] uppercase text-white/25 leading-none">
                                        available · let&apos;s talk
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/28 hover:text-white/75 hover:bg-white/[0.07] transition-all duration-200"
                                aria-label="Close"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        {/* ─── Messages ─── */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 chat-scroll">
                            {visibleMessages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: message.opacity, y: 0 }}
                                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                                    className={cn(message.role === "user" ? "flex justify-end" : "flex justify-start")}
                                >
                                    {message.role === "assistant" ? (
                                        <div
                                            className="max-w-[95%] text-[13px] leading-[1.8] text-white/75"
                                            style={{
                                                borderLeft: `2px solid ${accent.primary}48`,
                                                paddingLeft: "13px",
                                                letterSpacing: "0.012em",
                                            }}
                                        >
                                            {message.content ? (() => {
                                                const cards = parseMessageToCards(message.content);
                                                const hasCards = cards.some(c => c.type !== "text");
                                                if (hasCards) {
                                                    return (
                                                        <div className="space-y-2">
                                                            {cards.map((card, i) => (
                                                                <MessageCard key={i} data={card} />
                                                            ))}
                                                        </div>
                                                    );
                                                }
                                                return <FormattedMessage text={message.content} />;
                                            })() : null}
                                        </div>
                                    ) : (
                                        <div
                                            className="max-w-[76%] text-[13px] leading-[1.65] text-white/88"
                                            style={{
                                                background: "rgba(255,255,255,0.075)",
                                                border: "1px solid rgba(255,255,255,0.09)",
                                                borderRadius: "16px 16px 4px 16px",
                                                padding: "10px 14px",
                                                letterSpacing: "-0.01em",
                                            }}
                                        >
                                            {message.content}
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Loading — 3 bouncing dots */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div
                                        className="flex items-center gap-[5px] py-0.5"
                                        style={{
                                            borderLeft: `2px solid ${accent.primary}48`,
                                            paddingLeft: "13px",
                                            minHeight: "28px",
                                        }}
                                    >
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                className="h-[5px] w-[5px] rounded-full"
                                                style={{ background: accent.primary }}
                                                animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
                                                transition={{ duration: 0.72, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* ─── Prompts (first load only) ─── */}
                        {messages.length <= 1 && (
                            <div className="px-5 pb-3 flex flex-wrap gap-1.5">
                                {PROMPTS.map((p) => (
                                    <button
                                        key={p.label}
                                        onClick={() => { setInput(p.label); setTimeout(() => inputRef.current?.focus(), 0); }}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium",
                                            "border transition-all duration-200 focus:outline-none",
                                            p.primary
                                                ? "border-emerald-500/22 bg-emerald-500/[0.07] text-emerald-300/75 hover:bg-emerald-500/[0.13] hover:border-emerald-400/38 hover:text-emerald-200"
                                                : "border-white/[0.07] bg-transparent text-white/32 hover:bg-white/[0.05] hover:border-white/[0.13] hover:text-white/62"
                                        )}
                                    >
                                        <span className="text-[12px]">{p.icon}</span>
                                        <span>{p.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ─── Separator ─── */}
                        <div className="h-px mx-5 bg-white/[0.045]" />

                        {/* ─── Input ─── */}
                        <form onSubmit={handleSubmit} className="px-4 py-3.5">
                            <motion.div
                                className="flex items-center gap-2.5 rounded-[13px] px-4 py-2.5"
                                animate={{
                                    borderColor: input.length > 0 ? `${accent.primary}45` : "rgba(255,255,255,0.065)",
                                    boxShadow: input.length > 0 ? `0 0 20px -6px ${accent.glow}` : "none",
                                }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.065)",
                                }}
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="ask anything about Bibek..."
                                    disabled={isLoading}
                                    className="flex-1 min-w-0 bg-transparent text-[13px] text-white/78 placeholder:text-white/22 focus:outline-none caret-transparent"
                                    style={{ letterSpacing: "-0.01em" }}
                                />
                                {input.length > 0 && !isLoading && (
                                    <motion.div
                                        className="h-[13px] w-[1.5px] rounded-full shrink-0"
                                        style={{ background: accent.primary }}
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ duration: 0.85, repeat: Infinity }}
                                    />
                                )}
                                <motion.button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="flex items-center justify-center h-7 w-7 rounded-[10px] shrink-0 disabled:opacity-15 disabled:cursor-default"
                                    style={{
                                        background: input.trim() ? `${accent.primary}22` : "transparent",
                                        color: input.trim() ? accent.primary : "rgba(255,255,255,0.2)",
                                        transition: "background 0.2s, color 0.2s",
                                    }}
                                    animate={{ rotate: isSending ? 18 : 0, scale: isSending ? 0.84 : 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                    whileHover={input.trim() ? { scale: 1.08 } : {}}
                                >
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </motion.button>
                            </motion.div>
                        </form>

                        {/* Ambient floor glow */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: `radial-gradient(ellipse at 50% 110%, ${accent.glow}, transparent 65%)` }}
                            animate={{ opacity: [0, 0.08, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
