"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

// A pre-written hiring brief the visitor can edit before sending. Unlike the
// general /contact form, this is purpose-built: it ships a ready-to-send message
// so a recruiter only has to add their name/email and hit send.
const DEFAULT_MESSAGE =
  "Hi Bibek,\n\nWe came across your portfolio and would like to talk about a role. " +
  "Here's a quick outline:\n\n" +
  "• Role / project: \n" +
  "• Type: full-time / internship / contract\n" +
  "• Location: remote / hybrid / onsite\n" +
  "• Timeline: \n\n" +
  "Looking forward to hearing from you.";

export function HireMeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Esc to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Reset transient state whenever the modal is reopened.
  useEffect(() => {
    if (open) {
      setSent(false);
      setErrorMsg(null);
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = (fd.get("name") as string)?.trim() || "";
    const email = (fd.get("email") as string)?.trim() || "";
    const message = (fd.get("message") as string)?.trim() || "";

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject: "Hiring inquiry for Bibek Pathak", message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Couldn't send the message. Please try again.");
      }
      setSent(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="hire-overlay"
          className="theme-brut fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease }}
        >
          {/* Backdrop */}
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-[var(--ink)]/35 backdrop-blur-[2px]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Hire Bibek"
            className="brut-card relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-b-none rounded-t-[var(--brut-radius)] p-6 sm:rounded-[var(--brut-radius)] sm:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-[4px] border-2 border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]"
            >
              <X className="h-4 w-4" />
            </button>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="hire-success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease }}
                  className="flex flex-col items-center justify-center gap-6 py-12 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-[6px] border-2 border-[var(--ink)] bg-[var(--accent)]">
                    <svg width="40" height="40" viewBox="0 0 80 80" fill="none">
                      <motion.path
                        d="M24 40 L36 52 L56 30"
                        stroke="white"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, ease }}
                      />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="brut-h text-2xl">Message sent.</h3>
                    <p className="mx-auto max-w-[280px] text-base leading-relaxed text-[var(--ink-2)]">
                      Thanks for reaching out. It landed in my inbox and I&apos;ll get back to you soon.
                    </p>
                  </div>
                  <button onClick={onClose} className="brut-btn">Done</button>
                </motion.div>
              ) : (
                <motion.div
                  key="hire-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease }}
                >
                  <div className="mb-6 pr-10">
                    <p className="brut-kicker mb-2">Let&apos;s work together</p>
                    <h2 className="brut-title text-2xl sm:text-3xl">Hire Me</h2>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--ink-2)]">
                      The message below is ready to go. Tweak it if you like, add your details, and send.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="h-name" className="mb-1.5 block brut-kicker text-[0.72rem]">Name</label>
                        <input id="h-name" name="name" type="text" placeholder="Your name" className="brut-input" required />
                      </div>
                      <div>
                        <label htmlFor="h-email" className="mb-1.5 block brut-kicker text-[0.72rem]">Email</label>
                        <input id="h-email" name="email" type="email" placeholder="you@company.com" className="brut-input" required />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="h-message" className="mb-1.5 block brut-kicker text-[0.72rem]">Message</label>
                      <textarea
                        id="h-message"
                        name="message"
                        rows={8}
                        defaultValue={DEFAULT_MESSAGE}
                        className={cn("brut-input resize-none min-h-[180px]")}
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-3 pt-1">
                      <button type="submit" disabled={submitting} className="brut-btn w-full">
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send to Bibek"
                        )}
                      </button>
                      <AnimatePresence>
                        {errorMsg && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, ease }}
                            className="brut-mono text-xs leading-relaxed text-[#c81e3a]"
                            role="alert"
                          >
                            {errorMsg}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
