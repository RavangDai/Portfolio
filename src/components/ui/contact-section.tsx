"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      // use default easing
    },
  },
};

const item = (delay: number) => ({
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      // no custom ease here either
    },
  },
});

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28"
    >
      {/* soft background glow behind section */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35),transparent_60%)]" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        whileHover={{
          y: -6,
          scale: 1.01,
          boxShadow: "0 32px 120px rgba(0,0,0,0.95)",
          borderColor: "rgba(255,255,255,0.18)",
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn(
          "relative group overflow-hidden rounded-[32px] border border-white/10",
          "bg-white/[0.02] backdrop-blur-xl",
          "shadow-[0_24px_80px_rgba(0,0,0,0.85)]",
          "px-6 py-8 md:px-10 md:py-10"
        )}
      >
        {/* animated border glow */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-[32px]",
            "bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.22),transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.22),transparent_55%)]",
            "opacity-80 transition-all duration-500 ease-out",
            "group-hover:opacity-100 group-hover:scale-105"
          )}
        />

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
              experimental, I&apos;m always open to interesting problems.
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
          {/* === LEFT: FORM === */}
          <motion.form
            variants={item(0.08)}
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              // hook this up to your email service / API route later
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
              />
              <p className="mt-2 text-[0.7rem] text-white/35">
                I usually reply within 24 hours, and always with something
                thoughtful.
              </p>
            </FormField>

            {/* Button */}
            <div className="pt-1">
              <button
                type="submit"
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full border border-white/15",
                  "bg-white/[0.08] px-6 py-2.5 text-sm font-medium text-white",
                  "shadow-[0_18px_45px_rgba(0,0,0,0.7)]",
                  "transition-all duration-300",
                  "hover:border-indigo-300/70 hover:bg-gradient-to-r",
                  "hover:from-indigo-400/40 hover:via-white/10 hover:to-rose-400/40",
                  "hover:shadow-[0_22px_70px_rgba(0,0,0,0.95)]"
                )}
              >
                <span>Send message</span>
                <ArrowRight className="h-4 w-4 translate-x-0 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </motion.form>

          {/* === RIGHT: INFO CARD === */}
          <motion.div
            variants={item(0.16)}
            className="space-y-4 rounded-[24px] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-lg md:p-6"
          >
            {/* Email row */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.22em] text-white/40">
                    Email
                  </p>
                  <a
                    href="mailto:bibekg2029@gmail.com"
                    className="text-sm text-white/85 hover:text-white"
                  >
                    bibekg2029@gmail.com
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText("bibekg2029@gmail.com")
                }
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/65 transition hover:border-white/30 hover:bg-white/[0.08]"
              >
                Copy
              </button>
            </div>

            {/* Location & focus */}
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoBlock
                label="Based in"
                title="Southeastern Louisiana University"
                description="Open to remote & hybrid roles"
              />
              <InfoBlock
                label="Focus"
                title="Full-stack · Data / AI"
                description="Building useful, clean interfaces"
              />
            </div>

            {/* Quote */}
            <div className="mt-2 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-xs text-white/60">
              <p>
                “Clear communication, fast iteration, and thoughtful UX. That&apos;s
                how I like to work on every project.”
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/90 placeholder:text-white/30 outline-none transition focus:border-indigo-300/80 focus:bg-white/[0.03] focus:ring-2 focus:ring-indigo-400/40";

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
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
      <p className="text-[0.7rem] uppercase tracking-[0.22em] text-white/40">
        {label}
      </p>
      <p className="mt-1 text-sm text-white/85">{title}</p>
      <p className="mt-1 text-[0.75rem] text-white/40">{description}</p>
    </div>
  );
}
