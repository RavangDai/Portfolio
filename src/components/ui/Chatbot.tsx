"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX } from "lucide-react";
import GlowingChatInput from "./animated-glowing-search-bar";
import { cn } from "@/lib/utils";
import { parseMessageToCards, MessageCard } from "./MessageCard";
import { ShiningText } from "./shining-text";

/* ─── Follow-up chip parser ─── */
function parseFollowups(content: string): { clean: string; chips: string[] } {
    const fullMatch = content.match(/\[\[FOLLOWUPS:\s*([^\]]+)\]\]/i);
    if (fullMatch) {
        const clean = content.slice(0, fullMatch.index!).replace(/\s+$/, "");
        const chips = fullMatch[1]
            .split(/[|,]/)
            .map((s) => s.trim().replace(/^["']+|["']+$/g, "").trim())
            .filter(Boolean)
            .slice(0, 3);
        return { clean, chips };
    }
    // Hide partial marker during streaming
    const idx = content.indexOf("[[");
    if (idx !== -1) return { clean: content.slice(0, idx).replace(/\s+$/, ""), chips: [] };
    return { clean: content, chips: [] };
}

/* ─── TTS helpers ─── */
function plainTextForSpeech(text: string): string {
    return text
        .replace(/```[\s\S]*?```/g, "")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/^#+\s+/gm, "")
        .replace(/^[-•]\s+/gm, "")
        .replace(/^(Project|Impact|Stack|Tags|Status|Prompt):\s*/gm, "")
        .replace(/\n+/g, ". ")
        .replace(/\s+/g, " ")
        .trim();
}

function speakText(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.05;
    utter.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const preferred =
        voices.find((v) => /Daniel|David|Alex|Mark|Google US English/i.test(v.name) && /en/i.test(v.lang)) ||
        voices.find((v) => /en-US|en-GB/i.test(v.lang) && !/female/i.test(v.name)) ||
        voices.find((v) => /^en/i.test(v.lang)) ||
        null;
    if (preferred) utter.voice = preferred;
    window.speechSynthesis.speak(utter);
}

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

/* ─── Main Component ─── */
export function Chatbot() {
    const [isOpen, setIsOpen]           = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [messages, setMessages]       = useState<ChatMessage[]>([{
        id: "welcome", role: "assistant",
        content: "Hey! I'm Bibek's AI. Ask me anything about what I've built, my stack, or if I'm the right hire for your team.\n[[FOLLOWUPS: what have you shipped | best project for hiring | tell me your story]]",
        important: true, timestamp: Date.now(),
    }]);
    const [input, setInput]       = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [intent, setIntent]     = useState<IntentColor>("neutral");
    const [, setIsSending] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef       = useRef<HTMLInputElement>(null);
    const containerRef   = useRef<HTMLDivElement>(null);

    const accent = ACCENT_COLORS[intent];

    const lastAssistantId = useMemo(() => {
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === "assistant") return messages[i].id;
        }
        return null;
    }, [messages]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);
    useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 200); }, [isOpen]);
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) handleClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen]);

    // Restore voice preference
    useEffect(() => {
        if (typeof window === "undefined") return;
        setVoiceEnabled(localStorage.getItem("bibekai_voice") === "1");
        // Pre-load voices on some browsers
        if (window.speechSynthesis) window.speechSynthesis.getVoices();
    }, []);

    // Stop any speech when chat closes
    useEffect(() => {
        if (!isOpen && typeof window !== "undefined") window.speechSynthesis?.cancel();
    }, [isOpen]);

    const handleClose = useCallback(() => {
        setIsOpen(false); setIsCollapsed(true);
        if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    }, []);
    const handleOpen  = useCallback(() => { setIsCollapsed(false); setIsOpen(true); }, []);

    const toggleVoice = useCallback(() => {
        setVoiceEnabled((v) => {
            const next = !v;
            if (typeof window !== "undefined") {
                localStorage.setItem("bibekai_voice", next ? "1" : "0");
                if (!next) window.speechSynthesis?.cancel();
            }
            return next;
        });
    }, []);

    const sendMessage = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || isLoading) return;
        setIntent(detectIntent(trimmed));
        setIsSending(true);
        setTimeout(() => setIsSending(false), 400);

        const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: trimmed, timestamp: Date.now() };
        setMessages((p) => [...p, userMsg]);
        setIsLoading(true);

        // Cancel any in-flight speech before the new reply lands
        if (typeof window !== "undefined") window.speechSynthesis?.cancel();

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
                setMessages((p) => p.map((m) => m.id === aid ? { ...m, content: "Signal lost. Try again.\n[[FOLLOWUPS: try again | see projects]]" } : m));
            }

            // Speak final response if voice enabled
            if (voiceEnabled && content.trim()) {
                const { clean } = parseFollowups(content);
                speakText(plainTextForSpeech(clean));
            }
        } catch {
            setMessages((p) => {
                const cleaned = p.filter((m) => !(m.role === "assistant" && m.content === ""));
                return [...cleaned, { id: (Date.now() + 1).toString(), role: "assistant", content: "Connection dropped. Try again.\n[[FOLLOWUPS: try again | see projects | how to reach me]]", timestamp: Date.now() }];
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        const text = input.trim();
        setInput("");
        await sendMessage(text);
    };

    const handleChipClick = (label: string) => {
        if (isLoading) return;
        sendMessage(label);
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
                        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 px-4 py-2.5 cursor-pointer focus:outline-none rounded-full"
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
                    className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3 px-5 py-3 cursor-pointer focus:outline-none overflow-hidden"
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
                                <div className="flex items-center gap-1">
                                    <button onClick={toggleVoice}
                                        className={cn(
                                            "h-8 w-8 flex items-center justify-center rounded-full transition-all duration-200",
                                            voiceEnabled
                                                ? "text-white/85 bg-white/[0.08] hover:bg-white/[0.12]"
                                                : "text-white/30 hover:text-white/80 hover:bg-white/[0.08]"
                                        )}
                                        aria-label={voiceEnabled ? "Disable voice" : "Enable voice"}
                                        title={voiceEnabled ? "Voice on" : "Voice off"}>
                                        {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                                    </button>
                                    <button onClick={handleClose}
                                        className="h-8 w-8 flex items-center justify-center rounded-full text-white/30 hover:text-white/80 hover:bg-white/[0.08] transition-all duration-200"
                                        aria-label="Close">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ─── Divider ─── */}
                        <div className="h-px mx-5 bg-white/[0.06]" />

                        {/* ─── Messages ─── */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 no-scrollbar">
                            {visibleMessages.map((msg) => {
                                const isAssistant = msg.role === "assistant";
                                const { clean, chips } = isAssistant
                                    ? parseFollowups(msg.content)
                                    : { clean: msg.content, chips: [] as string[] };
                                const showChips =
                                    isAssistant && msg.id === lastAssistantId && !isLoading && chips.length > 0;

                                return (
                                    <motion.div key={msg.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: msg.opacity, y: 0 }}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        className={cn("flex gap-2.5", isAssistant ? "justify-start items-start" : "justify-end")}
                                    >
                                        {isAssistant && (
                                            <div className="h-6 w-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black text-white mt-0.5"
                                                style={{
                                                    background: "rgba(255,255,255,0.07)",
                                                    border: "1px solid rgba(255,255,255,0.15)",
                                                }}>
                                                B
                                            </div>
                                        )}
                                        {isAssistant ? (
                                            <div className="max-w-[88%] text-[12.5px] leading-[1.75] text-white/72"
                                                style={{ letterSpacing: "0.01em" }}>
                                                {clean ? (() => {
                                                    const cards = parseMessageToCards(clean);
                                                    const hasCards = cards.some((c) => c.type !== "text");
                                                    if (hasCards) return <div className="space-y-2">{cards.map((card, i) => <MessageCard key={i} data={card} />)}</div>;
                                                    return <FormattedMessage text={clean} />;
                                                })() : null}
                                                {showChips && (
                                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                                        {chips.map((c, i) => (
                                                            <motion.button
                                                                key={`${msg.id}-chip-${i}`}
                                                                initial={{ opacity: 0, y: 4 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                                                whileHover={{ y: -1 }}
                                                                whileTap={{ scale: 0.97 }}
                                                                onClick={() => handleChipClick(c)}
                                                                disabled={isLoading}
                                                                className="px-3 py-1.5 rounded-full text-[10.5px] font-medium text-white/55 border border-white/[0.10] hover:border-white/25 hover:text-white/90 hover:bg-white/[0.04] transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                                                                {c}
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                )}
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
                                );
                            })}

                            {/* Thinking indicator */}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className="flex items-start gap-2.5">
                                    <div className="h-6 w-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black text-white"
                                        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}>B</div>
                                    <div className="flex items-center py-[7px]">
                                        <ShiningText text="thinking..." />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* ─── Input bar ─── */}
                        <div className="px-4 pt-3 shrink-0 sm:pb-4"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingBottom: "max(1rem, env(safe-area-inset-bottom, 1rem))" }}>
                            <GlowingChatInput
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onSubmit={handleSubmit}
                                disabled={isLoading}
                                inputRef={inputRef}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
