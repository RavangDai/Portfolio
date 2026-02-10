"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, ArrowRight, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    important?: boolean;
    timestamp: number;
}

type IntentColor = "blue" | "violet" | "gold" | "warm" | "neutral";

/* ─── Intent Detection ─── */
const INTENT_MAP: { keywords: string[]; color: IntentColor }[] = [
    { keywords: ["project", "built", "shipped", "karya", "watch", "grid", "tick"], color: "blue" },
    { keywords: ["architecture", "stack", "system", "design", "infra", "scale"], color: "violet" },
    { keywords: ["hire", "hiring", "impact", "resume", "role", "position", "recruiter", "team"], color: "gold" },
    { keywords: ["story", "journey", "why", "personal", "background", "who"], color: "warm" },
];

const ACCENT_COLORS: Record<IntentColor, { primary: string; glow: string; bg: string }> = {
    blue: { primary: "rgb(96, 165, 250)", glow: "rgba(96, 165, 250, 0.3)", bg: "rgba(96, 165, 250, 0.06)" },
    violet: { primary: "rgb(167, 139, 250)", glow: "rgba(167, 139, 250, 0.3)", bg: "rgba(167, 139, 250, 0.06)" },
    gold: { primary: "rgb(251, 191, 36)", glow: "rgba(251, 191, 36, 0.25)", bg: "rgba(251, 191, 36, 0.05)" },
    warm: { primary: "rgb(251, 146, 60)", glow: "rgba(251, 146, 60, 0.25)", bg: "rgba(251, 146, 60, 0.05)" },
    neutral: { primary: "rgb(148, 163, 184)", glow: "rgba(148, 163, 184, 0.2)", bg: "rgba(148, 163, 184, 0.04)" },
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
    { icon: "📊", label: "show impact", primary: true },
    { icon: "📖", label: "show story" },
    { icon: "⚖️", label: "compare projects" },
    { icon: "🧠", label: "explain like CTO" },
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
                "You're looking at Bibek's work. I surface what matters. Say \"show impact\" or \"show story\".",
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
            {/* ─── COLLAPSED DOT (resting state) ─── */}
            <AnimatePresence>
                {isCollapsed && !isOpen && (
                    <motion.button
                        onClick={handleOpen}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5
                                   cursor-pointer focus:outline-none group"
                        style={{
                            borderRadius: "14px 10px 12px 16px",
                            background: "rgba(8, 8, 16, 0.85)",
                            backdropFilter: "blur(20px)",
                            border: `1px solid rgba(255, 255, 255, 0.08)`,
                            boxShadow: `0 0 30px ${accent.glow}, 0 8px 24px rgba(0,0,0,0.4)`,
                        }}
                        whileHover={{ scale: 1.04 }}
                        aria-label="Reopen chat"
                    >
                        <motion.div
                            className="h-2 w-2 rounded-full"
                            style={{ background: accent.primary }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        />
                        <span className="text-[11px] text-white/50 group-hover:text-white/80 transition-colors tracking-wide">
                            resume
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ─── TRIGGER (first load — impossible to miss) ─── */}
            {!isCollapsed && !isOpen && (
                <motion.button
                    onClick={handleOpen}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24, delay: 1.5 }}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3
                               cursor-pointer focus:outline-none group overflow-hidden"
                    style={{
                        borderRadius: "18px 12px 14px 20px",
                        background: "rgba(8, 8, 16, 0.88)",
                        backdropFilter: "blur(24px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: `
                            0 0 40px rgba(99, 102, 241, 0.25),
                            0 8px 32px rgba(0, 0, 0, 0.5),
                            inset 0 1px 0 rgba(255, 255, 255, 0.06)
                        `,
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    aria-label="Open AI chat"
                >
                    {/* Pulsing orb */}
                    <motion.div
                        className="relative h-3 w-3 rounded-full bg-indigo-400"
                        animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    >
                        <motion.div
                            className="absolute inset-0 rounded-full bg-indigo-400"
                            animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        />
                    </motion.div>

                    <span className="text-[13px] font-medium text-white/70 group-hover:text-white/95 transition-colors">
                        Ask Bibek&apos;s AI
                    </span>

                    {/* Background breathing glow */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            borderRadius: "inherit",
                            background: "radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.15), transparent 70%)",
                        }}
                        animate={{ opacity: [0, 0.6, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                </motion.button>
            )}

            {/* ─── THE SHARD (chat panel) ─── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={containerRef}
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20, transition: { duration: 0.2 } }}
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        className={cn(
                            "fixed z-50 flex flex-col overflow-hidden",
                            // Mobile: full width
                            "bottom-0 left-0 right-0",
                            // Desktop: positioned bottom-right
                            "sm:bottom-6 sm:left-auto sm:right-6",
                            // Width: expands after interaction
                            hasInteracted ? "sm:w-[420px]" : "sm:w-[360px]"
                        )}
                        style={{
                            // Height expands after first interaction
                            maxHeight: hasInteracted
                                ? "min(80vh, calc(100dvh - 2rem))"
                                : "min(520px, calc(100dvh - 2rem))",
                            borderRadius: "20px 14px 16px 24px",
                            background: "rgba(8, 8, 16, 0.94)",
                            backdropFilter: "blur(40px) saturate(1.2)",
                            WebkitBackdropFilter: "blur(40px) saturate(1.2)",
                            border: `1px solid rgba(255, 255, 255, 0.06)`,
                            boxShadow: `
                                0 0 0 1px rgba(255, 255, 255, 0.03),
                                0 24px 48px -12px rgba(0, 0, 0, 0.6),
                                0 0 60px -20px ${accent.glow}
                            `,
                            transform: "perspective(800px) rotateY(-0.3deg)",
                            transition: "max-height 0.5s cubic-bezier(0.22, 1, 0.36, 1), width 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                    >
                        {/* ─── Header ─── */}
                        <div className={cn(
                            "flex items-center justify-between border-b border-white/[0.04] transition-all duration-500",
                            hasInteracted ? "px-4 py-1.5" : "px-4 py-2.5"
                        )}>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{ background: accent.primary }}
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                                <span className={cn(
                                    "font-medium text-white/40 tracking-widest uppercase transition-all duration-500",
                                    hasInteracted ? "text-[10px]" : "text-[11px]"
                                )}>
                                    signal
                                </span>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-[10px] text-white/20 hover:text-white/50 transition-colors tracking-wider uppercase"
                            >
                                rest
                            </button>
                        </div>

                        {/* ─── Messages ─── */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth chat-scroll">
                            {visibleMessages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: message.opacity, y: 0 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className={cn(
                                        "transition-opacity duration-1000",
                                        message.role === "user" ? "flex justify-end" : "flex justify-start"
                                    )}
                                >
                                    {message.role === "assistant" ? (
                                        /* ─── Assistant bubble: darker panel with border glow ─── */
                                        <div
                                            className="max-w-[92%] relative"
                                            style={{
                                                background: "rgba(12, 12, 28, 0.85)",
                                                borderRadius: "14px 10px 12px 16px",
                                                padding: "14px 16px",
                                                border: "1px solid rgba(255, 255, 255, 0.07)",
                                                boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 0 20px -8px ${accent.glow}`,
                                            }}
                                        >
                                            {/* Subtle top-left shine */}
                                            <div
                                                className="absolute inset-0 rounded-[inherit] pointer-events-none"
                                                style={{
                                                    background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)`,
                                                    borderRadius: "inherit",
                                                }}
                                            />
                                            <div className="relative text-[13px] leading-[1.75] text-white/[0.85]" style={{ letterSpacing: "0.015em" }}>
                                                {message.content ? (
                                                    <FormattedMessage text={message.content} />
                                                ) : null}
                                            </div>
                                        </div>
                                    ) : (
                                        /* ─── User bubble: lighter bg, proper bubble ─── */
                                        <div
                                            className="max-w-[80%] text-[13px] leading-[1.6] text-white/[0.92]"
                                            style={{
                                                background: "rgba(255, 255, 255, 0.08)",
                                                borderRadius: "14px 16px 4px 14px",
                                                padding: "10px 14px",
                                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                                letterSpacing: "-0.01em",
                                            }}
                                        >
                                            {message.content}
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div
                                        className="px-3.5 py-2.5"
                                        style={{
                                            background: "rgba(12, 12, 28, 0.85)",
                                            borderRadius: "14px 10px 12px 16px",
                                            border: "1px solid rgba(255, 255, 255, 0.06)",
                                        }}
                                    >
                                        <motion.div
                                            className="h-[2px] w-4 rounded-full"
                                            style={{ background: accent.primary }}
                                            animate={{ opacity: [0.2, 0.6, 0.2], width: ["16px", "24px", "16px"] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* ─── Smart prompts (first load — lively buttons) ─── */}
                        {messages.length <= 1 && (
                            <div className="px-4 pb-2 flex flex-wrap gap-2">
                                {PROMPTS.map((p) => (
                                    <button
                                        key={p.label}
                                        onClick={() => { setInput(p.label); inputRef.current?.focus(); }}
                                        className={cn(
                                            "chat-prompt-btn text-[11px] px-3 py-1.5 flex items-center gap-1.5",
                                            "border rounded-lg",
                                            "focus:outline-none",
                                            p.primary
                                                ? "text-indigo-300/80 border-indigo-500/25 bg-indigo-500/[0.08] hover:text-indigo-200 hover:border-indigo-400/40 hover:bg-indigo-500/[0.14]"
                                                : "text-white/35 border-white/[0.07] bg-white/[0.02] hover:text-white/65 hover:border-white/[0.15] hover:bg-white/[0.05]"
                                        )}
                                    >
                                        <span className="text-[13px]">{p.icon}</span>
                                        <span>{p.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ─── Input ─── */}
                        <form onSubmit={handleSubmit} className="px-4 pb-3 pt-2">
                            <div className="relative flex items-center gap-2">
                                <div className="flex-1 relative">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="think..."
                                        disabled={isLoading}
                                        className="w-full bg-transparent text-[13px] text-white/80
                               placeholder:text-white/15 focus:outline-none py-1.5
                               caret-transparent"
                                        style={{ letterSpacing: "-0.01em" }}
                                    />
                                    {/* The glowing line */}
                                    <motion.div
                                        className="absolute bottom-0 left-0 h-[1px] rounded-full"
                                        style={{ background: accent.primary }}
                                        animate={{
                                            width: input.length > 0 ? "100%" : "32px",
                                            opacity: input.length > 0 ? 0.6 : 0.2,
                                        }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    />
                                    {/* Floating cursor indicator */}
                                    {input.length > 0 && (
                                        <motion.div
                                            className="absolute right-0 bottom-[3px] h-[14px] w-[1.5px] rounded-full"
                                            style={{ background: accent.primary }}
                                            animate={{ opacity: [0.8, 0.2, 0.8] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        />
                                    )}
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="flex items-center justify-center h-7 w-7 rounded-lg
                             disabled:opacity-10 disabled:cursor-default transition-all"
                                    style={{ color: accent.primary }}
                                    animate={{
                                        rotate: isSending ? 15 : 0,
                                        scale: isSending ? 0.85 : 1,
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <ArrowRight className="h-4 w-4" />
                                </motion.button>
                            </div>
                        </form>

                        {/* ─── Breathing overlay (when idle) ─── */}
                        {!isLoading && messages.length > 1 && (
                            <motion.div
                                className="absolute inset-0 pointer-events-none rounded-[inherit]"
                                style={{
                                    background: `radial-gradient(ellipse at 30% 80%, ${accent.glow}, transparent 60%)`,
                                }}
                                animate={{ opacity: [0, 0.04, 0] }}
                                transition={{ duration: 6, repeat: Infinity }}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
