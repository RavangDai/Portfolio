"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SendHorizonal, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

const item = (delay: number) => ({
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay },
  },
});

export function ContactSection() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  return (
    <section
      id="contact"
      className="relative w-full border-t border-white/[0.04] bg-gradient-to-b from-[#050509] to-[#030308] py-16 sm:py-20"
    >
      {/* Projects-style soft background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.14),_transparent_55%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className={cn(
            "relative overflow-hidden rounded-[28px] border border-white/[0.08]",
            "bg-white/[0.02] backdrop-blur-md",
            "shadow-[0_12px_32px_rgba(0,0,0,0.55)]",
            "px-6 py-8 md:px-10 md:py-10"
          )}
        >
          {/* subtle inner ring */}
          <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/10" />

          {/* header */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <motion.div variants={item(0)}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Contact
              </div>

              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
                Let&apos;s build something together.
              </h2>

              <p className="mt-2 max-w-xl text-sm text-white/60 sm:text-base">
                Whether it&apos;s a data project, full-stack app, or something
                experimental, you can reach me quickly with a short message.
              </p>
            </motion.div>

            <motion.div
              variants={item(0.05)}
              className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-emerald-200"
            >
              Open to internships
            </motion.div>
          </div>

          <div className="grid gap-8 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:gap-10">
            {/* LEFT: FORM */}
            <motion.form
              variants={item(0.08)}
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);

                const name =
                  (formData.get("name") as string | null)?.trim() || "";
                const email =
                  (formData.get("email") as string | null)?.trim() || "";
                const subject =
                  (formData.get("subject") as string | null)?.trim() ||
                  "New message from portfolio";
                const message =
                  (formData.get("message") as string | null)?.trim() || "";

                const lines = [
                  `Name: ${name}`,
                  `Email: ${email}`,
                  "",
                  "Message:",
                  message,
                ];

                const mailto = `mailto:bibekg2029@gmail.com?subject=${encodeURIComponent(
                  subject
                )}&body=${encodeURIComponent(lines.join("\n"))}`;

                window.location.href = mailto;
                setFeedback(
                  "Your email app should have opened with everything ready."
                );
                setIsSent(true);
                setTimeout(() => setIsSent(false), 2500);
                form.reset();
              }}
            >
              {/* Name + Email */}
              <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Name" htmlFor="name">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    autoComplete="name"
                    className={inputClass}
                    required
                  />
                </FormField>

                <FormField label="Email" htmlFor="email">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={inputClass}
                    required
                  />
                </FormField>
              </div>

              {/* Subject */}
              <FormField label="Subject" htmlFor="subject">
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What would you like to work on?"
                  className={inputClass}
                  required
                />
              </FormField>

              {/* Message */}
              <FormField label="Message" htmlFor="message">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell me a bit about your idea, timeline, and how I can help."
                  className={cn(
                    inputClass,
                    "min-h-[130px] resize-none py-3.5 leading-relaxed"
                  )}
                  required
                />
              
              </FormField>

              {/* Button + feedback */}
              <div className="space-y-2 pt-1">
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-full border border-white/15",
                    "bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-white/90",
                    "shadow-[0_12px_32px_rgba(0,0,0,0.55)]",
                    "transition-all duration-300",
                    "hover:bg-white/[0.07] hover:border-white/25",
                    "disabled:cursor-default disabled:opacity-75"
                  )}
                  disabled={isSent}
                >
                  <span>{isSent ? "Sent" : "Send Message"}</span>
                  <motion.span
                    initial={false}
                    animate={
                      isSent
                        ? { x: 24, y: -18, opacity: 0 }
                        : { x: 0, y: 0, opacity: 1 }
                    }
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="inline-flex"
                  >
                    <SendHorizonal className="h-4 w-4" />
                  </motion.span>
                </motion.button>

                {feedback && <p className="text-xs text-white/60">{feedback}</p>}
              </div>
            </motion.form>

            {/* RIGHT: INFO CARD */}
            <motion.div
              variants={item(0.16)}
              className="space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.55)] md:p-6"
            >
              {/* Email row */}
              <div className="group flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 transition-all duration-300 hover:border-indigo-400/60 hover:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 transition-all duration-300 group-hover:border-indigo-400/30 group-hover:bg-indigo-500/10 group-hover:scale-110">
                    <Mail className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.22em] text-white/40 transition-colors duration-300 group-hover:text-white/50">
                      Email
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("bibekg2029@gmail.com");
                        setFeedback("Email copied to clipboard.");
                      }}
                      className="text-left text-sm text-white/85 transition-all duration-300 hover:text-white hover:translate-x-0.5"
                    >
                      bibekg2029@gmail.com
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("bibekg2029@gmail.com");
                    setFeedback("Email copied to clipboard.");
                  }}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/65 transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-white hover:scale-105"
                >
                  Copy
                </button>
              </div>

              {/* Location & focus */}
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoBlock
                  label="Based in"
                  title="Southeastern Louisiana University"
                  description="Open to remote and hybrid roles"
                />
                <InfoBlock
                  label="Focus"
                  title="Full-stack · Data / AI"
                  description="Building useful, clean interfaces"
                />
              </div>

              
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/90 placeholder:text-white/30 outline-none transition focus:border-white/20 focus:bg-white/[0.03] focus:ring-2 focus:ring-white/10";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};

function FormField({ label, htmlFor, children }: FormFieldProps) {
  return (
    <label className="block text-sm text-white/70" htmlFor={htmlFor}>
      <span className="text-[0.7rem] uppercase tracking-[0.22em] text-white/40">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

type InfoBlockProps = {
  label: string;
  title: string;
  description: string;
};

function InfoBlock({ label, title, description }: InfoBlockProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-400/60 hover:bg-white/[0.04] cursor-pointer">
      <p className="text-[0.7rem] uppercase tracking-[0.22em] text-white/40 transition-colors duration-300 group-hover:text-white/50">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-white/85 transition-all duration-300 group-hover:text-indigo-200 group-hover:translate-x-0.5">{title}</p>
      <p className="mt-1 text-[0.75rem] text-white/40 transition-colors duration-300 group-hover:text-white/55">{description}</p>
    </div>
  );
}
