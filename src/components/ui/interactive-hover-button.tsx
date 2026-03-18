"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ─── Shared inner markup ────────────────────────────────────────────────────

function ButtonInner({ text, variant }: { text: string; variant: "primary" | "ghost" }) {
  return (
    <>
      {/* Default label — slides out on hover */}
      <span className="relative z-10 inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>

      {/* Hover label — slides in from right */}
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center text-white opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <span>{text}</span>
      </div>

      {/* Expanding blob */}
      <div
        className={cn(
          "absolute left-[20%] top-[40%] h-2 w-2 rounded-lg transition-all duration-300",
          "group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8]",
          variant === "primary" ? "bg-indigo-600" : "bg-white/[0.12]",
        )}
      />
    </>
  );
}

// ─── Base class builder ─────────────────────────────────────────────────────

function baseClass(variant: "primary" | "ghost", className?: string) {
  return cn(
    "group relative inline-flex cursor-pointer overflow-hidden rounded-full border",
    "px-7 py-2.5 text-sm font-semibold text-center transition-all duration-300",
    variant === "primary"
      ? "border-indigo-500/30 bg-indigo-600/10 text-white hover:border-indigo-400/50"
      : "border-white/10 bg-white/[0.02] text-white/55 hover:border-white/20 hover:text-white",
    className,
  );
}

// ─── Button (for form submit, onClick actions) ──────────────────────────────

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: "primary" | "ghost";
}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", variant = "primary", className, ...props }, ref) => (
  <button ref={ref} className={baseClass(variant, className)} {...props}>
    <ButtonInner text={text} variant={variant} />
  </button>
));
InteractiveHoverButton.displayName = "InteractiveHoverButton";

// ─── Link (for <a> / href navigation) ──────────────────────────────────────

export interface InteractiveHoverLinkProps {
  text: string;
  href: string;
  variant?: "primary" | "ghost";
  className?: string;
  target?: string;
  rel?: string;
}

export function InteractiveHoverLink({
  text,
  href,
  variant = "primary",
  className,
  target,
  rel,
}: InteractiveHoverLinkProps) {
  return (
    <a href={href} target={target} rel={rel} className={baseClass(variant, className)}>
      <ButtonInner text={text} variant={variant} />
    </a>
  );
}
