"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, ChevronRight } from "lucide-react";
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

const ACCENT_COLORS: Record<IntentColor, { primary: string; glow: string; gradient: string }> = {
    emerald: { primary: "#ffffff", glow: "rgba(255,255,255,0.10)", gradient: "from-white/20 to-white/8" },
    cyan:    { primary: "#e0e0e0", glow: "rgba(255,255,255,0.08)", gradient: "from-white/15 to-white/6" },
    gold:    { primary: "#ffffff", glow: "rgba(255,255,255,0.10)", gradient: "from-white/20 to-white/8" },
    warm:    { primary: "#d0d0d0", glow: "rgba(255,255,255,0.08)", gradient: "from-white/18 to-white/6" },
    neutral: { primary: "#ffffff", glow: "rgba(255,255,255,0.09)", gradient: "from-white/20 to-white/8" },
};

function detectIntent(text: string): IntentColor {
    const lower = text.toLowerCase();
    for (const { keywords, color } of INTENT_MAP) {
        if (keywords.some((k) => lower.includes(k))) return color;
    }
    return "neutral";
}

/* ─── Formatted Message ─── */
function FormattedMessage({ text }: { text: string }) {
    const lines = text.split("\n");
    return (
        <div className="space-y-0.5">
            {lines.map((line, i) => {
                const trimmed = line.trim();
                if (/^#{1,3}\s/.test(trimmed)) {
                    return <span key={i} className="block text-[12px] font-bold text-white/90 mt-2 mb-0.5">{trimmed.replace(/^#+\s*/, "")}</span>;
                }
                if (/^\*\*.+\*\*$/.test(trimmed)) {
                    return <span key={i} className="block text-[12px] font-bold text-white/90 mt-1">{trimmed.replace(/^\*\*|\*\*$/g, "")}</span>;
                }
                if (/^```/.test(trimmed)) return null;
                if (/^[-•]\s/.test(trimmed)) {
                    return (
                        <span key={i} className="flex gap-2 items-start">
                            <span className="mt-[5px] h-1 w-1 rounded-full bg-white/30 shrink-0" />
                            <span className="text-white/70"><InlineFormatted text={trimmed.replace(/^[-•]\s*/, "")} /></span>
                        </span>
                    );
                }
                if (trimmed === "") return <span key={i} className="block h-1.5" />;
                return <span key={i} className="block"><InlineFormatted text={trimmed} /></span>;
            })}
        </div>
    );
}

function InlineFormatted({ text }: { text: string }) {
    const parts: { text: string; type: "text" | "bold" | "code" }[] = [];
    const pattern = /(\*\*(.+?)\*\*|`([^`]+?)`)/g;
    let lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) parts.push({ text: text.slice(lastIndex, match.index), type: "text" });
        if (match[2]) parts.push({ text: match[2], type: "bold" });
        else if (match[3]) parts.push({ text: match[3], type: "code" });
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex), type: "text" });
    if (parts.length === 0) parts.push({ text, type: "text" });
    return (
        <>
            {parts.map((p, i) =>
                p.type === "bold" ? <span key={i} className="font-semibold text-white/90">{p.text}</span>
                : p.type === "code" ? <span key={i} className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-white/[0.08] text-white/70">{p.text}</span>
                : <span key={i}>{p.text}</span>
            )}
        </>
    );
}

/* ─── Prompts ─── */
const PROMPTS = [
    { icon: "⚡", label: "what have you shipped" },
    { icon: "💼", label: "best project for hiring" },
    { icon: "🛠️", label: "what can you build" },
    { icon: "📖", label: "tell me your story" },
];

/* ─── Main Component ─── */
export function Chatbot() {
    const [isOpen, setIsOpen]           = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [messages, setMessages]       = useState<ChatMessage[]>([{
        id: "welcome", role: "assistant",
        content: "Hey! I'm Bibek's AI. Ask me anything about what I've built, my stack, or if I'm the right hire for your team.",
        important: true, timestamp: Date.now(),
    }]);
    const [input, setInput]       = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [intent, setIntent]     = useState<IntentColor>("neutral");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef       = useRef<HTMLInputElement>(null);
    const containerRef   = useRef<HTMLDivElement>(null);

    const accent = ACCENT_COLORS[intent];

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);
    useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 200); }, [isOpen]);
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) handleClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen]);

    const handleClose = useCallback(() => { setIsOpen(false); setIsCollapsed(true); }, []);
    const handleOpen  = useCallback(() => { setIsCollapsed(false); setIsOpen(true); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        const trimmed = input.trim();
        setIntent(detectIntent(trimmed));
        setIsSending(true);
        setTimeout(() => setIsSending(false), 400);

        const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: trimmed, timestamp: Date.now() };
        setMessages((p) => [...p, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })) }),
            });
            if (!res.ok) throw new Error("Failed");

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let content = "";
            const aid = (Date.now() + 1).toString();
            setMessages((p) => [...p, { id: aid, role: "assistant", content: "", important: true, timestamp: Date.now() }]);

            while (reader) {
                const { done, value } = await reader.read();
                if (done) break;
                content += decoder.decode(value, { stream: true });
                setMessages((p) => p.map((m) => m.id === aid ? { ...m, content } : m));
            }
            if (!content.trim()) {
                setMessages((p) => p.map((m) => m.id === aid ? { ...m, content: "Signal lost. Try again." } : m));
            }
        } catch {
            setMessages((p) => {
                const cleaned = p.filter((m) => !(m.role === "assistant" && m.content === ""));
                return [...cleaned, { id: (Date.now() + 1).toString(), role: "assistant", content: "Connection dropped. Try again.", timestamp: Date.now() }];
            });
        } finally {
            setIsLoading(false);
        }
    };

    const visibleMessages = useMemo(() => {
        if (messages.length <= 6) return messages.map((m) => ({ ...m, opacity: 1 }));
        return messages.map((m, i) => {
            const age = messages.length - 1 - i;
            if (m.important || m.role === "user" || age < 3) return { ...m, opacity: 1 };
            return { ...m, opacity: Math.max(0.3, 1 - age * 0.15) };
        });
    }, [messages]);

    return (
        <>
            {/* ─── COLLAPSED pill ─── */}
            <AnimatePresence>
                {isCollapsed && !isOpen && (
                    <motion.button
                        onClick={handleOpen}
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05, y: -1 }}
                        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 cursor-pointer focus:outline-none rounded-full"
                        style={{ background: "rgba(10,12,20,0.95)", backdropFilter: "blur(24px)", border: `1px solid ${accent.primary}40`, boxShadow: `0 0 20px ${accent.glow}` }}
                        aria-label="Reopen chat"
                    >
                        <motion.div className="h-1.5 w-1.5 rounded-full" style={{ background: accent.primary }}
                            animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
                        <span className="text-[11px] font-medium text-white/60">resume chat</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ─── TRIGGER BUTTON ─── */}
            {!isCollapsed && !isOpen && (
                <motion.button
                    onClick={handleOpen}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.5 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 cursor-pointer focus:outline-none overflow-hidden"
                    style={{
                        borderRadius: "999px",
                        background: "rgba(8,8,8,0.92)",
                        border: "1px solid rgba(255,255,255,0.14)",
                        borderTopColor: "rgba(255,255,255,0.24)",
                        backdropFilter: "blur(32px) saturate(180%)",
                        WebkitBackdropFilter: "blur(32px) saturate(180%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(255,255,255,0.04), 0 24px 48px rgba(0,0,0,0.7)",
                    }}
                    aria-label="Open AI chat"
                >
                    {/* White left accent bar */}
                    <div className="h-7 w-[2px] rounded-full shrink-0 bg-white/40" />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] font-bold text-white tracking-tight leading-none" style={{ letterSpacing: "-0.01em" }}>
                            Bibek<span className="text-white/45 font-light">.AI</span>
                        </span>
                        <span className="text-[9px] font-medium tracking-[0.20em] uppercase text-white/30 leading-none">ask me anything</span>
                    </div>
                    {/* Live dot */}
                    <div className="relative h-2 w-2 shrink-0 ml-1">
                        <motion.span className="absolute inset-0 rounded-full bg-white/50"
                            animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2.2, repeat: Infinity }} />
                        <span className="relative flex h-2 w-2 rounded-full bg-white/80" />
                    </div>
                    {/* Shimmer sweep */}
                    <motion.div className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.05) 50%, transparent 80%)" }}
                        animate={{ x: ["-100%", "200%"] }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 2.5 }} />
                </motion.button>
            )}

            {/* ─── CHAT PANEL ─── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={containerRef}
                        initial={{ opacity: 0, y: 20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 14, scale: 0.97, transition: { duration: 0.15 } }}
                        transition={{ type: "spring", stiffness: 340, damping: 28 }}
                        className={cn(
                            "fixed z-50 flex flex-col",
                            "bottom-0 left-0 right-0",
                            "sm:bottom-6 sm:left-auto sm:right-6 sm:w-[420px]",
                            "rounded-t-3xl sm:rounded-2xl overflow-hidden"
                        )}
                        style={{
                            maxHeight: "min(82vh, calc(100dvh - 1.5rem))",
                            background: "rgba(8, 10, 18, 0.98)",
                            backdropFilter: "blur(48px) saturate(1.8)",
                            WebkitBackdropFilter: "blur(48px) saturate(1.8)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 32px 72px -12px rgba(0,0,0,0.8), 0 0 80px -20px ${accent.glow}`,
                        }}
                    >
                        {/* ─── Header ─── */}
                        <div className="relative shrink-0 px-5 pt-5 pb-4"
                            style={{ background: "rgba(255,255,255,0.02)" }}>

                            {/* Thin top line */}
                            <motion.div className="absolute top-0 left-0 right-0 h-[1.5px]"
                                style={{ background: `linear-gradient(90deg, transparent, ${accent.primary}90, transparent)` }}
                                animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {/* Avatar circle */}
                                    <div className="relative h-9 w-9 rounded-full shrink-0 flex items-center justify-center text-[13px] font-black text-white"
                                        style={{
                                            background: "rgba(255,255,255,0.06)",
                                            border: "1px solid rgba(255,255,255,0.18)",
                                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.20), 0 8px 24px rgba(0,0,0,0.5)",
                                        }}>
                                        B
                                        <motion.div className="absolute inset-0 rounded-full"
                                            style={{ border: "1.5px solid rgba(255,255,255,0.15)" }}
                                            animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-bold text-white leading-none" style={{ letterSpacing: "-0.01em" }}>
                                            Bibek<span className="text-white/40 font-light">.AI</span>
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white/50 animate-pulse" />
                                            <span className="text-[10px] text-white/35 tracking-wide">online · ready to chat</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleClose}
                                    className="h-8 w-8 flex items-center justify-center rounded-full text-white/30 hover:text-white/80 hover:bg-white/[0.08] transition-all duration-200"
                                    aria-label="Close">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* ─── Divider ─── */}
                        <div className="h-px mx-5 bg-white/[0.06]" />

                        {/* ─── Messages ─── */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 chat-scroll">
                            {visibleMessages.map((msg) => (
                                <motion.div key={msg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: msg.opacity, y: 0 }}
                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    className={cn("flex gap-2.5", msg.role === "user" ? "justify-end" : "justify-start items-start")}
                                >
                                    {msg.role === "assistant" && (
                                        <div className="h-6 w-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black text-white mt-0.5"
                                            style={{
                                                background: "rgba(255,255,255,0.07)",
                                                border: "1px solid rgba(255,255,255,0.15)",
                                                flexShrink: 0,
                                            }}>
                                            B
                                        </div>
                                    )}
                                    {msg.role === "assistant" ? (
                                        <div className="max-w-[88%] text-[12.5px] leading-[1.75] text-white/72"
                                            style={{ letterSpacing: "0.01em" }}>
                                            {msg.content ? (() => {
                                                const cards = parseMessageToCards(msg.content);
                                                const hasCards = cards.some(c => c.type !== "text");
                                                if (hasCards) return <div className="space-y-2">{cards.map((card, i) => <MessageCard key={i} data={card} />)}</div>;
                                                return <FormattedMessage text={msg.content} />;
                                            })() : null}
                                        </div>
                                    ) : (
                                        <div className="max-w-[78%] text-[12.5px] leading-[1.6] text-white/90 rounded-2xl rounded-br-sm px-4 py-2.5"
                                            style={{
                                                background: "rgba(255,255,255,0.08)",
                                                border: "1px solid rgba(255,255,255,0.14)",
                                                borderTopColor: "rgba(255,255,255,0.20)",
                                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                                            }}>
                                            {msg.content}
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Loading dots */}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-2.5">
                                    <div className="h-6 w-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black text-white"
                                        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}>B</div>
                                    <div className="flex items-center gap-1.5 py-2">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div key={i} className="h-[5px] w-[5px] rounded-full"
                                                style={{ background: accent.primary }}
                                                animate={{ y: [0, -4, 0], opacity: [0.3, 1, 0.3] }}
                                                transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }} />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* ─── Quick prompts (first load) ─── */}
                        {messages.length <= 1 && (
                            <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
                                {PROMPTS.map((p) => (
                                    <button key={p.label}
                                        onClick={() => { setInput(p.label); setTimeout(() => inputRef.current?.focus(), 0); }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-[11px] font-medium text-white/50 border border-white/[0.08] hover:border-white/20 hover:text-white/80 hover:bg-white/[0.04] transition-all duration-200 shrink-0 focus:outline-none">
                                        <span>{p.icon}</span>
                                        <span>{p.label}</span>
                                        <ChevronRight className="h-3 w-3 opacity-40" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ─── Input bar ─── */}
                        <div className="px-4 pb-4 pt-2 shrink-0"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                            <form onSubmit={handleSubmit}>
                                <motion.div className="flex items-center gap-3 rounded-2xl px-4 py-3"
                                    animate={{
                                        borderColor: input.length > 0 ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.07)",
                                        boxShadow: input.length > 0 ? "inset 0 1px 0 rgba(255,255,255,0.10), 0 0 20px rgba(255,255,255,0.04)" : "none",
                                    }}
                                    transition={{ duration: 0.2 }}
                                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="ask anything about Bibek..."
                                        disabled={isLoading}
                                        className="flex-1 min-w-0 bg-transparent text-[13px] text-white/80 placeholder:text-white/20 focus:outline-none"
                                        style={{ letterSpacing: "-0.01em" }}
                                    />
                                    <motion.button type="submit"
                                        disabled={isLoading || !input.trim()}
                                        className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-20 transition-all duration-200"
                                        style={{
                                            background: input.trim() ? "#ffffff" : "rgba(255,255,255,0.06)",
                                            border: input.trim() ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.06)",
                                            boxShadow: input.trim() ? "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 16px rgba(255,255,255,0.12)" : "none",
                                        }}
                                        animate={{ scale: isSending ? 0.88 : 1 }}
                                        whileHover={input.trim() ? { scale: 1.08 } : {}}
                                        transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                                        <Send className={`h-3.5 w-3.5 ${input.trim() ? "text-black" : "text-white/50"}`} />
                                    </motion.button>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
