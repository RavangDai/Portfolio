"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { HighlightText } from "@/components/ui/highlight";
import { Tape } from "@/components/ui/tape";

const ease = [0.22, 1, 0.36, 1] as const;

export function ContactSection() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("drbibekg2029@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const fd      = new FormData(form);
    const name    = (fd.get("name")    as string)?.trim() || "";
    const email   = (fd.get("email")   as string)?.trim() || "";
    const subject = (fd.get("subject") as string)?.trim() || "New message";
    const message = (fd.get("message") as string)?.trim() || "";

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Couldn't send the message. Please try again.");
      }

      form.reset();
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="theme-brut brut-bg relative w-full overflow-hidden pt-28 pb-24 md:pt-36"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">

          {/* ── Left: info ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease }}
            className="flex flex-col gap-10"
          >
            <div>
              <p className="brut-kicker mb-4">Get In Touch</p>
              <h2 className="brut-title text-[clamp(2.6rem,7vw,4.8rem)]">
                Let&apos;s build{" "}
                <HighlightText mode="scroll" ink underline>something.</HighlightText>
              </h2>
              <p className="mt-5 max-w-xs text-base leading-relaxed text-[var(--ink-2)]">
                Whether it&apos;s a data project, full-stack app, or something
                experimental. Reach out.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {/* Email — pinned sticky-note */}
              <div
                className="brut-note flex items-center justify-between gap-3 p-4"
                style={{ "--tilt": "-2deg" } as React.CSSProperties}
              >
                <Tape color="marigold" rotate={-4} style={{ top: "-0.55rem", left: "1.1rem", width: "3.4rem", height: "1.2rem" }} />
                <div className="min-w-0">
                  <p className="brut-kicker mb-1.5 text-[0.72rem]">Email</p>
                  <div className="relative overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {copied ? (
                        <motion.span
                          key="copied"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.22, ease }}
                          className="block text-sm font-semibold text-[var(--accent)]"
                        >
                          Copied!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="email"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.22, ease }}
                          className="block select-all truncate text-sm font-medium text-[var(--ink)]"
                        >
                          drbibekg2029@gmail.com
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border-2 border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]"
                  aria-label="Copy email"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.span key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.18 }}>
                        <Check className="h-3.5 w-3.5" />
                      </motion.span>
                    ) : (
                      <motion.span key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.18 }}>
                        <Copy className="h-3.5 w-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* Location — pinned sticky-note */}
              <div
                className="brut-note p-4"
                style={{ "--tilt": "1.5deg" } as React.CSSProperties}
              >
                <Tape color="blush" rotate={5} style={{ top: "-0.55rem", right: "1.2rem", width: "3rem", height: "1.2rem" }} />
                <p className="brut-kicker mb-1.5 text-[0.72rem]">Based at</p>
                <p className="text-sm font-medium text-[var(--ink)]">Hammond, Louisiana, USA</p>
                <p className="mt-0.5 text-xs text-[var(--ink-3)]">Open to remote &amp; hybrid</p>
              </div>

              {/* Focus — pinned sticky-note */}
              <div
                className="brut-note p-4"
                style={{ "--tilt": "-1deg" } as React.CSSProperties}
              >
                <Tape color="mint" rotate={-6} style={{ top: "-0.55rem", left: "1.4rem", width: "3.2rem", height: "1.2rem" }} />
                <p className="brut-kicker mb-1.5 text-[0.72rem]">Focus</p>
                <p className="text-sm font-medium text-[var(--ink)]">Full-stack · Data / AI</p>
              </div>
            </div>
          </motion.div>

          {/* ── Right: form / success ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            className="brut-card p-6 sm:p-8"
          >
            <AnimatePresence mode="wait">
              {formSubmitted ? (
                /* ── Success state ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease }}
                  className="flex flex-col items-center justify-center gap-7 py-14 text-center"
                >
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-[6px] border-2 border-[var(--ink)] bg-[var(--accent)]">
                    <svg width="48" height="48" viewBox="0 0 80 80" fill="none">
                      <motion.path
                        d="M24 40 L36 52 L56 30"
                        stroke="white"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.25, ease }}
                      />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4, ease }}
                      className="brut-h text-2xl"
                    >
                      Message sent.
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.55, ease }}
                      className="mx-auto max-w-[260px] text-base leading-relaxed text-[var(--ink-2)]"
                    >
                      Thanks for reaching out. It landed in my inbox and I&apos;ll get back to you soon.
                    </motion.p>
                  </div>

                  <div className="h-2 w-40 overflow-hidden rounded-full border-2 border-[var(--ink)]">
                    <motion.div
                      className="h-full origin-left bg-[var(--accent)]"
                      initial={{ scaleX: 1 }}
                      animate={{ scaleX: 0 }}
                      transition={{ duration: 5, ease: "linear", delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              ) : (
                /* ── Form ── */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    <BrutField label="Name" htmlFor="f-name">
                      <input id="f-name" name="name" type="text" placeholder="Your name" className="brut-input" required />
                    </BrutField>
                    <BrutField label="Email" htmlFor="f-email">
                      <input id="f-email" name="email" type="email" placeholder="you@example.com" className="brut-input" required />
                    </BrutField>
                  </div>

                  <BrutField label="Subject" htmlFor="f-subject">
                    <input id="f-subject" name="subject" type="text" placeholder="What are we working on?" className="brut-input" required />
                  </BrutField>

                  <BrutField label="Message" htmlFor="f-message">
                    <textarea
                      id="f-message"
                      name="message"
                      rows={5}
                      placeholder="Tell me about your idea, timeline, and how I can help."
                      className={cn("brut-input resize-none min-h-[130px]")}
                      required
                    />
                  </BrutField>

                  <div className="flex flex-col gap-3 pt-1">
                    <button type="submit" disabled={submitting} className="brut-btn w-full sm:w-fit">
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
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
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* ── Subcomponents ── */

function BrutField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block brut-kicker text-[0.72rem]">
        {label}
      </label>
      {children}
    </div>
  );
}
