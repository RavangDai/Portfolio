"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SendHorizonal, Mail, MapPin, Target, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionReveal } from "@/components/ui/section-reveal";

/* -------------------------------------------------------------------------- */
/* ANIMATIONS                                 */
/* -------------------------------------------------------------------------- */

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease },
  },
};

const item = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease },
  },
});

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                             */
/* -------------------------------------------------------------------------- */

export function ContactSection() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("bibekg2029@gmail.com");
    setCopied(true);
    setFeedback("Email copied to clipboard.");
    setTimeout(() => {
      setCopied(false);
      setFeedback(null);
    }, 2000);
  };

  return (
    <section
      id="contact"
      className="section-divider relative w-full bg-[#040410] py-24 md:py-32"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(129,140,248,0.03),_transparent_50%)]" />

      <SectionReveal className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-16"
        >

          {/* HEADER */}
          <motion.div variants={item(0)} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Contact
              </div>

              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
                Let’s build something <br />
                <span className="text-indigo-100">together.</span>
              </h2>

              <p className="max-w-xl text-lg text-slate-400 leading-relaxed">
                Whether it's a data project, full-stack app, or something experimental,
                you can reach me quickly with a short message.
              </p>
            </div>

            <motion.div
              variants={item(0.05)}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium uppercase tracking-widest text-emerald-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Open to Internships
            </motion.div>
          </motion.div>

          {/* CONTENT GRID */}
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">

            {/* LEFT COLUMN: CARDS */}
            <motion.div variants={item(0.1)} className="flex flex-col gap-4">
              <ContactCard
                icon={Mail}
                label="Email"
                value="bibekg2029@gmail.com"
                onCopy={handleCopy}
                copied={copied}
              />
              <ContactCard
                icon={MapPin}
                label="Based in"
                value="Southeastern Louisiana University"
                subtitle="Open to remote & hybrid"
              />
              <ContactCard
                icon={Target}
                label="Focus"
                value="Full-stack · Data / AI"

              />
            </motion.div>

            {/* RIGHT COLUMN: FORM */}
            <motion.form
              variants={item(0.15)}
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                const name = (formData.get("name") as string)?.trim() || "";
                const subject = (formData.get("subject") as string)?.trim() || "New message";
                const message = (formData.get("message") as string)?.trim() || "";

                const mailto = `mailto:bibekg2029@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\n\n${message}`)}`;

                window.location.href = mailto;
                setIsSent(true);
                setTimeout(() => setIsSent(false), 2500);
                form.reset();
              }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm sm:p-10"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Name" htmlFor="name">
                  <input id="name" name="name" type="text" placeholder="Your name" className={inputClass} required />
                </FormField>
                <FormField label="Email" htmlFor="email">
                  <input id="email" name="email" type="email" placeholder="you@example.com" className={inputClass} required />
                </FormField>
              </div>

              <div className="mt-6 space-y-6">
                <FormField label="Subject" htmlFor="subject">
                  <input id="subject" name="subject" type="text" placeholder="What are we working on?" className={inputClass} required />
                </FormField>

                <FormField label="Message" htmlFor="message">
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell me a bit about your idea, timeline, and how I can help."
                    className={cn(inputClass, "resize-none min-h-[140px]")}
                    required
                  />
                </FormField>
              </div>

              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  disabled={isSent}
                  className={cn(
                    "group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition-all",
                    "hover:bg-indigo-500 hover:ring-2 hover:ring-indigo-500/50 hover:ring-offset-2 hover:ring-offset-slate-950",
                    "disabled:opacity-70 disabled:cursor-not-allowed sm:w-auto"
                  )}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSent ? "Opening Mail App..." : "Send Message"}
                    <SendHorizonal className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                  </span>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-100 transition-opacity group-hover:opacity-90" />
                </motion.button>

                {feedback && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-emerald-400"
                  >
                    {feedback}
                  </motion.p>
                )}
              </div>
            </motion.form>
          </div>
        </motion.div>
      </SectionReveal>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* SUBCOMPONENTS                              */
/* -------------------------------------------------------------------------- */

// Input Styling - Darker background for better contrast
const inputClass = cn(
  "w-full rounded-lg border border-white/10 bg-[#050509] px-4 py-3",
  "text-sm text-slate-200 placeholder-white/20",
  "transition-all duration-300",
  "focus:border-indigo-500/50 focus:bg-indigo-500/[0.02] focus:outline-none focus:ring-1 focus:ring-indigo-500/50",
  "hover:border-white/20"
);

function FormField({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  subtitle,
  onCopy,
  copied,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle?: string;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div
      onClick={onCopy}
      className={cn(
        "group relative flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all duration-500",
        onCopy && "cursor-pointer active:scale-[0.98]",
        "hover:border-indigo-500/30 hover:bg-white/[0.04]"
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/[0.03] text-slate-400 transition-colors group-hover:border-indigo-500/20 group-hover:bg-indigo-500/10 group-hover:text-indigo-300">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </div>
        <div className="mt-0.5 font-medium text-slate-200 group-hover:text-white transition-colors">
          {value}
        </div>
        {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
      </div>

      {onCopy && (
        <div className="mr-2 text-slate-600 transition-colors group-hover:text-white">
          {copied ? <Check className="h-5 w-5 text-emerald-400" /> : <Copy className="h-5 w-5" />}
        </div>
      )}
    </div>
  );
}