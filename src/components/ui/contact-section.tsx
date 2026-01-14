"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SendHorizonal, Mail, MapPin, Target, Copy, Check } from "lucide-react";
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
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("bibekg2029@gmail.com");
    setCopied(true);
    setFeedback("Email copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      className="relative w-full border-t border-white/[0.04] bg-gradient-to-b from-[#050509] to-[#030308] py-16 sm:py-20"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.14),_transparent_55%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={item(0)} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Contact
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-5xl">
                <span className="text-hero-gradient">Let&apos;s build something together.</span>
              </h2>

              <p className="max-w-2xl text-sm text-white/55 sm:text-base">
                Whether it&apos;s a data project, full-stack app, or something experimental, 
                you can reach me quickly with a short message.
              </p>
            </div>

            <motion.div
              variants={item(0.05)}
              className="group rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-emerald-200 transition-all duration-300 hover:border-emerald-400/50 hover:bg-emerald-400/15 hover:scale-105"
            >
              Open to internships
            </motion.div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* LEFT COLUMN: Contact Info Cards */}
            <motion.div variants={item(0.1)} className="flex flex-col gap-4">
              {/* Email Card */}
              <ContactCard
                icon={Mail}
                label="Email"
                value="bibekg2029@gmail.com"
                onCopy={handleCopy}
                copied={copied}
                className="group"
              />

              {/* Location Card */}
              <ContactCard
                icon={MapPin}
                label="Based in"
                value="Southeastern Louisiana University"
                subtitle="Open to remote and hybrid roles"
                className="group"
              />

              {/* Focus Card */}
              <ContactCard
                icon={Target}
                label="Focus"
                value="Full-stack · Data / AI"
                subtitle="Building useful, clean interfaces"
                className="group"
              />
            </motion.div>

            {/* RIGHT COLUMN: Form */}
            <motion.form
              variants={item(0.15)}
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
              className={cn(
                "lg:col-span-2 group relative overflow-hidden rounded-2xl",
                "border border-white/[0.08] bg-white/[0.02]",
                "backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.55)]",
                "p-6 md:p-8 space-y-6"
              )}
            >
              {/* Name + Email Row */}
              <div className="grid gap-5 sm:grid-cols-2">
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
                  rows={5}
                  placeholder="Tell me a bit about your idea, timeline, and how I can help."
                  className={cn(
                    inputClass,
                    "min-h-[140px] resize-none py-3.5 leading-relaxed"
                  )}
                  required
                />
              </FormField>

              {/* Submit Button + Feedback */}
              <div className="space-y-2 pt-2">
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "group/btn inline-flex items-center gap-2 rounded-full",
                    "border border-white/15 bg-white/[0.04]",
                    "px-6 py-3 text-sm font-medium text-white/90",
                    "shadow-[0_12px_32px_rgba(0,0,0,0.55)]",
                    "transition-all duration-300",
                    "hover:bg-white/[0.07] hover:border-indigo-400/60",
                    "hover:scale-105 hover:shadow-[0_20px_40px_rgba(99,102,241,0.2)]",
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
                    className="inline-flex transition-transform duration-300 group-hover/btn:translate-x-1"
                  >
                    <SendHorizonal className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110" />
                  </motion.span>
                </motion.button>

                {feedback && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-white/60"
                  >
                    {feedback}
                  </motion.p>
                )}
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Contact Card Component
type ContactCardProps = {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle?: string;
  onCopy?: () => void;
  copied?: boolean;
  className?: string;
};

function ContactCard({
  icon: Icon,
  label,
  value,
  subtitle,
  onCopy,
  copied,
  className,
}: ContactCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "border border-white/[0.08] bg-white/[0.02]",
        "backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.55)]",
        "p-5 transition-all duration-500 ease-out",
        "hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-400/60",
        "hover:bg-white/[0.04] cursor-pointer",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-white/80 transition-all duration-300 group-hover:border-indigo-400/30 group-hover:bg-indigo-500/10 group-hover:scale-110">
          <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[0.7rem] uppercase tracking-[0.22em] text-white/40 transition-colors duration-300 group-hover:text-white/50">
            {label}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            {onCopy ? (
              <button
                onClick={onCopy}
                className="text-left text-sm font-medium text-white/85 transition-all duration-300 hover:text-white hover:translate-x-0.5"
              >
                {value}
              </button>
            ) : (
              <p className="text-sm font-medium text-white/85 transition-all duration-300 group-hover:text-indigo-200 group-hover:translate-x-0.5">
                {value}
              </p>
            )}
          </div>
          {subtitle && (
            <p className="mt-1.5 text-xs text-white/40 transition-colors duration-300 group-hover:text-white/55">
              {subtitle}
            </p>
          )}
        </div>

        {onCopy && (
          <button
            onClick={onCopy}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              "border border-white/10 bg-white/[0.03]",
              "text-white/65 transition-all duration-300",
              "hover:border-indigo-400/30 hover:bg-indigo-500/10",
              "hover:text-white hover:scale-110"
            )}
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Input Styling
const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/90 placeholder:text-white/30 outline-none transition-all duration-300 focus:border-indigo-400/60 focus:bg-white/[0.04] focus:ring-2 focus:ring-indigo-400/20 hover:border-white/20";

// Form Field Component
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