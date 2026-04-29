"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FlowButton } from "@/components/ui/flow-button";

const ease = [0.22, 1, 0.36, 1] as const;

export function ContactSection() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);

  // Pixel hover refs — direct DOM update, zero re-renders
  const sectionRef = useRef<HTMLElement>(null);
  const pixelGlowRef = useRef<HTMLDivElement>(null);
  const pixelCyanRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (pixelGlowRef.current) {
      pixelGlowRef.current.style.maskImage = `radial-gradient(ellipse 260px 260px at ${x}px ${y}px, black 0%, transparent 100%)`;
    }
    if (pixelCyanRef.current) {
      pixelCyanRef.current.style.maskImage = `radial-gradient(ellipse 420px 420px at ${x}px ${y}px, black 30%, transparent 100%)`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const offscreen = "radial-gradient(ellipse 260px 260px at -999px -999px, black 0%, transparent 100%)";
    if (pixelGlowRef.current) pixelGlowRef.current.style.maskImage = offscreen;
    if (pixelCyanRef.current) pixelCyanRef.current.style.maskImage = offscreen;
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("bibekg2029@gmail.com");
    setCopied(true);
    setFeedback("Copied to clipboard.");
    setTimeout(() => { setCopied(false); setFeedback(null); }, 2000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#060916] py-20 md:py-28 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Background layers ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Always-dim base dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,83,115,0.09) 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Cursor-revealed coral pixel glow — inner ring */}
        <div
          ref={pixelGlowRef}
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,83,115,1) 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 260px 260px at -999px -999px, black 0%, transparent 100%)",
          }}
        />

        {/* Cursor-revealed cyan glow — outer ring (softer) */}
        <div
          ref={pixelCyanRef}
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(23,231,255,0.45) 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 420px 420px at -999px -999px, black 30%, transparent 100%)",
          }}
        />

        {/* Sonar rings */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-[#FF5373]/[0.07]"
            style={{
              width:  `${(i + 1) * 220}px`,
              height: `${(i + 1) * 220}px`,
              left: "-40px",
              bottom: "-40px",
              animation: `sonar-pulse 5s ease-out ${i * 1.1}s infinite`,
            }}
          />
        ))}

        {/* Ambient aurora */}
        <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-[#17E7FF]/[0.05] blur-[90px] animate-aurora-3" />

        {/* Edge vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_50%_50%,transparent_50%,#060916_100%)]" />
      </div>

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
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#FF5373]/70 mb-5">
                Get In Touch
              </p>
              <h2
                className="font-bold tracking-tighter leading-[0.9]"
                style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)" }}
              >
                <span className="shimmer-text">Let&apos;s build</span><br />
                <span className="text-white/25">something.</span>
              </h2>
              <p className="mt-6 text-slate-500 leading-relaxed max-w-xs text-base">
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
                  <span className="text-base font-medium text-white/60 hover:text-white transition-colors select-all">
                    bibekg2029@gmail.com
                  </span>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "btn-icon h-7 w-7 transition-all duration-300",
                      copied && "!border-[#FF5373]/30 !bg-[#FF5373]/10 !text-[#FF5373] !shadow-[0_0_12px_rgba(255,83,115,0.2)]"
                    )}
                    aria-label="Copy email"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                {feedback && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 text-xs text-[#FF5373]/70"
                  >
                    {feedback}
                  </motion.p>
                )}
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
              <div className="inline-flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-widest text-[#17E7FF]/70">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#17E7FF] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#17E7FF]" />
                </span>
                Open to Internships
              </div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = new FormData(form);
              const name    = (formData.get("name")    as string)?.trim() || "";
              const subject = (formData.get("subject") as string)?.trim() || "New message";
              const message = (formData.get("message") as string)?.trim() || "";
              const mailto  = `mailto:bibekg2029@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\n\n${message}`)}`;
              window.location.href = mailto;
              setIsSent(true);
              setTimeout(() => setIsSent(false), 2500);
              form.reset();
            }}
            className="relative flex flex-col gap-8"
          >
            {/* Soft blur behind inputs */}
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-[#060916]/15 backdrop-blur-[3px]" />
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
              <FlowButton
                type="submit"
                variant="primary"
                disabled={isSent}
                className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              >
                {isSent ? "Opening Mail App..." : "Send Message"}
              </FlowButton>
            </div>
          </motion.form>

        </div>
      </div>
    </section>
  );
}

/* ── Subcomponents ── */

const minimalInput = cn(
  "w-full bg-transparent border-0 border-b border-white/[0.07] py-3 px-0",
  "text-sm text-slate-200 placeholder-white/[0.1]",
  "transition-all duration-300",
  "focus:border-[#17E7FF]/50 focus:outline-none",
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
