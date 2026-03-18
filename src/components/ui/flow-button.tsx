"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

// ─── Shared inner structure ─────────────────────────────────────────────────

function FlowInner({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "primary" | "ghost";
}) {
  const fillColor = variant === "primary" ? "bg-emerald-500" : "bg-white/[0.12]";
  const arrowColor =
    variant === "primary"
      ? "stroke-white/80 group-hover:stroke-white"
      : "stroke-white/40 group-hover:stroke-white";

  return (
    <>
      <ArrowRight
        className={cn(
          "absolute h-3.5 w-3.5 z-10 fill-none",
          "left-[-20%] group-hover:left-[14px]",
          "transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          arrowColor
        )}
      />
      <span
        className={cn(
          "relative z-10 -translate-x-2 group-hover:translate-x-2",
          "transition-all duration-[800ms] ease-out",
          "flex items-center gap-2"
        )}
      >
        {children}
      </span>
      <span
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "h-4 w-4 rounded-full opacity-0",
          "group-hover:h-[220px] group-hover:w-[220px] group-hover:opacity-100",
          "transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
          fillColor
        )}
      />
      <ArrowRight
        className={cn(
          "absolute h-3.5 w-3.5 z-10 fill-none",
          "right-[14px] group-hover:right-[-20%]",
          "transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          arrowColor
        )}
      />
    </>
  );
}

// ─── Shared class builder ────────────────────────────────────────────────────

function buttonClass(variant: "primary" | "ghost", className?: string) {
  return cn(
    "group relative inline-flex items-center gap-1 overflow-hidden rounded-full cursor-pointer",
    "px-7 py-2.5 text-sm font-semibold",
    "transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
    "active:scale-[0.96]",
    variant === "primary"
      ? [
          "border border-emerald-500/30 bg-emerald-600/10 text-white",
          "hover:border-emerald-400/50 hover:shadow-[0_0_28px_rgba(16,185,129,0.4)]",
        ]
      : [
          "border border-white/10 bg-white/[0.02] text-white/55",
          "hover:border-white/20 hover:text-white",
        ],
    className
  );
}

// ─── Button (submit / onClick) ───────────────────────────────────────────────

export interface FlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export const FlowButton = React.forwardRef<HTMLButtonElement, FlowButtonProps>(
  ({ variant = "primary", className, children, ...props }, ref) => (
    <button ref={ref} className={buttonClass(variant, className)} {...props}>
      <FlowInner variant={variant}>{children}</FlowInner>
    </button>
  )
);
FlowButton.displayName = "FlowButton";

// ─── Link variant (for <a> navigation) ──────────────────────────────────────

export interface FlowLinkProps {
  href: string;
  variant?: "primary" | "ghost";
  className?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

export function FlowLink({ href, variant = "primary", className, target, rel, children }: FlowLinkProps) {
  return (
    <a href={href} target={target} rel={rel} className={buttonClass(variant, className)}>
      <FlowInner variant={variant}>{children}</FlowInner>
    </a>
  );
}
