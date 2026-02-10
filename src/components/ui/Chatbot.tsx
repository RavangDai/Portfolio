"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
}

// --- ANIMATION VARIANTS ---
const panelVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
        y: 20,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 25,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: { duration: 0.2 },
    },
};

const messageVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
    },
};

// --- TYPING INDICATOR COMPONENT ---
function TypingIndicator() {
    return (
        <div className="flex items-center gap-1 px-3 py-2">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="h-2 w-2 rounded-full bg-indigo-400/60"
                    animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1, 0.8] }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.15,
                    }}
                />
            ))}
        </div>
    );
}

// --- MESSAGE BUBBLE COMPONENT ---
function MessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
    const isUser = role === "user";

    return (
        <motion.div
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}
        >
            {!isUser && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600">
                    <Bot className="h-4 w-4 text-white" />
                </div>
            )}

            <div
                className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    isUser
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-white/[0.08] text-slate-200 border border-white/10 rounded-bl-sm"
                )}
            >
                {content}
            </div>

            {isUser && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/10">
                    <User className="h-4 w-4 text-slate-300" />
                </div>
            )}
        </motion.div>
    );
}

// --- MAIN CHATBOT COMPONENT ---
export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hey! 👋 I'm Bibek's AI assistant. Ask me anything about his projects, skills, or experience!",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
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

            if (!response.ok) throw new Error("Failed to get response");

            // Handle streaming response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantContent = "";
            const assistantId = (Date.now() + 1).toString();

            // Add empty assistant message that we'll update
            setMessages((prev) => [
                ...prev,
                { id: assistantId, role: "assistant", content: "" },
            ]);

            while (reader) {
                const { done, value } = await reader.read();
                if (done) break;

                assistantContent += decoder.decode(value, { stream: true });
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantId ? { ...m, content: assistantContent } : m
                    )
                );
            }

            // If stream ended but no content came through, show fallback
            if (!assistantContent.trim()) {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantId
                            ? { ...m, content: "Sorry, I couldn't get a response. Please try again." }
                            : m
                    )
                );
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => {
                // Remove any empty assistant messages left from failed stream
                const cleaned = prev.filter((m) => !(m.role === "assistant" && m.content === ""));
                return [
                    ...cleaned,
                    {
                        id: (Date.now() + 1).toString(),
                        role: "assistant",
                        content: "Sorry, I encountered an error. Please try again.",
                    },
                ];
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* FLOATING TRIGGER BUTTON */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
                className={cn(
                    "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full",
                    "bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600",
                    "shadow-lg shadow-indigo-500/30",
                    "transition-transform hover:scale-105 active:scale-95",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 focus:ring-offset-slate-950"
                )}
                whileHover={{ boxShadow: "0 0 30px rgba(129, 140, 248, 0.5)" }}
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="h-6 w-6 text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageCircle className="h-6 w-6 text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pulsing glow effect */}
                {!isOpen && (
                    <motion.div
                        className="absolute inset-0 -z-10 rounded-full bg-indigo-500/40"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
            </motion.button>

            {/* CHAT PANEL */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={cn(
                            "fixed z-50 flex flex-col overflow-hidden",
                            // Mobile: full-width bottom sheet
                            "bottom-0 left-0 right-0 rounded-t-2xl rounded-b-none",
                            // Desktop: floating card at bottom-right
                            "sm:bottom-24 sm:left-auto sm:right-6 sm:w-[360px] sm:rounded-2xl",
                            "border border-white/10",
                            "bg-[#0a0a12]/95 backdrop-blur-xl",
                            "shadow-2xl shadow-black/40"
                        )}
                        style={{ maxHeight: "min(600px, calc(100dvh - 2rem))" }}
                    >
                        {/* HEADER */}
                        <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.02] px-4 py-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-white">Ask Bibek&apos;s AI</h3>
                                <p className="text-xs text-slate-400">Powered by Gemini</p>
                            </div>
                        </div>

                        {/* MESSAGES CONTAINER */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <MessageBubble
                                    key={message.id}
                                    role={message.role}
                                    content={message.content}
                                />
                            ))}

                            {isLoading && (messages[messages.length - 1]?.role === "user" || messages[messages.length - 1]?.content === "") && (
                                <div className="flex gap-2">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600">
                                        <Bot className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="rounded-2xl rounded-bl-sm bg-white/[0.08] border border-white/10">
                                        <TypingIndicator />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* INPUT AREA */}
                        <form
                            onSubmit={handleSubmit}
                            className="border-t border-white/10 bg-white/[0.02] p-3"
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about projects, skills..."
                                    className={cn(
                                        "flex-1 rounded-xl border border-white/10 bg-white/[0.05]",
                                        "px-4 py-2.5 text-sm text-white placeholder:text-slate-500",
                                        "focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30",
                                        "transition-colors"
                                    )}
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-xl",
                                        "bg-indigo-600 text-white",
                                        "transition-all hover:bg-indigo-500",
                                        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
                                    )}
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
