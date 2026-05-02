"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { SectionGradientBg } from "@/components/ui/section-gradient-bg";

const ease = [0.22, 1, 0.36, 1] as const;

export function ContactSection() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);


  const handleCopy = () => {
    navigator.clipboard.writeText("bibekg2029@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd      = new FormData(form);
    const name    = (fd.get("name")    as string)?.trim() || "";
    const subject = (fd.get("subject") as string)?.trim() || "New message";
    const message = (fd.get("message") as string)?.trim() || "";
    window.location.href = `mailto:bibekg2029@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\n\n${message}`)}`;
    setFormSubmitted(true);
    form.reset();
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <section
      id="contact"
      className="relative w-full bg-[#080808] py-20 md:py-28 overflow-hidden"
    >
      <SectionGradientBg />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-8">
        <div className="grid gap-16 lg:gap-20 xl:gap-28 lg:grid-cols-[1fr_1.3fr]">

          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease }}
            className="flex flex-col gap-12"
          >
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/35 mb-5">
                Get In Touch
              </p>
              <h2
                className="font-black font-display tracking-tighter leading-[0.9]"
                style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)" }}
              >
                <span className="shimmer-text">Let&apos;s build</span><br />
                <span className="text-white/25">something.</span>
              </h2>
              <p className="mt-6 text-white/35 leading-relaxed max-w-xs text-base">
                Whether it&apos;s a data project, full-stack app, or something
                experimental — reach out.
              </p>
            </div>

            <div className="space-y-8">
              {/* Email */}
              <div>
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.28em] text-white/35 mb-2">
                  Email
                </p>
                <div className="flex items-center gap-3">
                  {/* Inline text swap on copy */}
                  <div className="relative overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {copied ? (
                        <motion.span
                          key="copied"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.22, ease }}
                          className="text-base font-medium text-white block"
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
                          className="text-base font-medium text-white/60 hover:text-white transition-colors select-all block"
                        >
                          bibekg2029@gmail.com
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "btn-icon h-7 w-7 transition-all duration-300 shrink-0",
                      copied && "!border-white/20 !bg-white/[0.08] !text-white !shadow-[0_0_12px_rgba(255,255,255,0.12)]"
                    )}
                    aria-label="Copy email"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {copied ? (
                        <motion.span
                          key="check"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1,   opacity: 1 }}
                          exit={{   scale: 0.5, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          <Check className="h-3 w-3" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1,   opacity: 1 }}
                          exit={{   scale: 0.5, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          <Copy className="h-3 w-3" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              {/* Location */}
              <div>
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.28em] text-white/35 mb-2">
                  Based at
                </p>
                <p className="text-base text-white/50">Hammond, Louisiana, USA</p>
                <p className="text-xs text-white/35 mt-1">Open to remote &amp; hybrid</p>
              </div>

              {/* Focus */}
              <div>
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.28em] text-white/35 mb-2">
                  Focus
                </p>
                <p className="text-base text-white/50">Full-stack · Data / AI</p>
              </div>

              {/* Status */}
              <div className="inline-flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-widest text-white/50">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white/70" />
                </span>
                Open to Internships
              </div>
            </div>
          </motion.div>

          {/* Right: form / success */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="relative"
          >
            {/* Soft blur behind inputs */}
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-black/15 backdrop-blur-[3px]" />

            <AnimatePresence mode="wait">
              {formSubmitted ? (
                /* ── Success state ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1,    filter: "blur(0px)" }}
                  exit={{   opacity: 0, scale: 0.96, filter: "blur(6px)" }}
                  transition={{ duration: 0.5, ease }}
                  className="flex flex-col items-center justify-center gap-8 py-16 text-center"
                >
                  {/* Animated checkmark */}
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    {/* Outer ring pulse */}
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: [0.6, 1.3, 1], opacity: [0, 0.2, 0] }}
                      transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full border border-white/30"
                    />
                    {/* Circle */}
                    <svg
                      width="80" height="80"
                      viewBox="0 0 80 80"
                      fill="none"
                      className="absolute inset-0"
                    >
                      <motion.circle
                        cx="40" cy="40" r="35"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1.5"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      />
                      <motion.path
                        d="M24 40 L36 52 L56 30"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </svg>
                  </div>

                  <div className="space-y-3">
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.65, ease }}
                      className="text-2xl font-bold tracking-tighter text-white"
                    >
                      Message queued.
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.78, ease }}
                      className="text-sm text-white/35 max-w-[260px] leading-relaxed"
                    >
                      Your mail client should be opening now. I&apos;ll get back to you soon.
                    </motion.p>
                  </div>

                  {/* Progress bar draining down */}
                  <motion.div className="w-32 h-px bg-white/[0.08] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white/40 rounded-full origin-left"
                      initial={{ scaleX: 1 }}
                      animate={{ scaleX: 0 }}
                      transition={{ duration: 5, ease: "linear", delay: 0.2 }}
                    />
                  </motion.div>
                </motion.div>
              ) : (
                /* ── Form ── */
                <motion.form
                  key="form"
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{   opacity: 0, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-8"
                >
                  <div className="grid gap-8 sm:grid-cols-2">
                    <MinimalField label="Name" htmlFor="f-name">
                      <input
                        id="f-name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        className={minimalInput}
                        required
                      />
                    </MinimalField>
                    <MinimalField label="Email" htmlFor="f-email">
                      <input
                        id="f-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className={minimalInput}
                        required
                      />
                    </MinimalField>
                  </div>

                  <MinimalField label="Subject" htmlFor="f-subject">
                    <input
                      id="f-subject"
                      name="subject"
                      type="text"
                      placeholder="What are we working on?"
                      className={minimalInput}
                      required
                    />
                  </MinimalField>

                  <MinimalField label="Message" htmlFor="f-message">
                    <textarea
                      id="f-message"
                      name="message"
                      rows={5}
                      placeholder="Tell me about your idea, timeline, and how I can help."
                      className={cn(minimalInput, "resize-none min-h-[120px]")}
                      required
                    />
                  </MinimalField>

                  <div className="flex items-center gap-4 pt-2">
                    <LiquidButton
                      type="submit"
                      size="lg"
                      className="rounded-full font-semibold"
                    >
                      Send Message
                    </LiquidButton>
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

const minimalInput = cn(
  "w-full bg-transparent border-0 border-b border-white/[0.07] py-3 px-0",
  "text-sm text-white/80 placeholder-white/[0.1]",
  "transition-all duration-300",
  "focus:border-white/30 focus:outline-none",
  "hover:border-white/[0.14]"
);

function MinimalField({
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
      <label
        htmlFor={htmlFor}
        className="block text-[0.58rem] font-bold uppercase tracking-[0.28em] text-white/35 mb-1"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
