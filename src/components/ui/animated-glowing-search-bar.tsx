"use client";

import React from "react";
import { Send } from "lucide-react";

interface GlowingChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function GlowingChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = "ask anything about Bibek...",
  disabled,
  inputRef,
}: GlowingChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="relative flex items-center justify-center w-full">
      <div className="relative flex items-center justify-center w-full">

        {/* Input row */}
        <div className="chat-input-wrapper relative w-full overflow-hidden">
          {/* Shimmer sweep on hover */}
          <div className="input-shimmer pointer-events-none absolute top-0 left-0 h-full w-[60px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent skew-x-[-20deg]" />

          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            type="text"
            className="relative bg-[#010201] border-none w-full h-[50px] rounded-xl text-white pl-[46px] pr-[54px] text-[13px] focus:outline-none placeholder:text-white/20 disabled:opacity-50"
            style={{ letterSpacing: "-0.01em" }}
          />

          {/* Search icon */}
          <div className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" height="18" fill="none">
              <circle stroke="url(#gi-sg)" r="8" cy="11" cx="11" />
              <line stroke="url(#gi-sl)" y2="16.65" y1="22" x2="16.65" x1="22" />
              <defs>
                <linearGradient gradientTransform="rotate(50)" id="gi-sg">
                  <stop stopColor="#f8e7f8" offset="0%" />
                  <stop stopColor="#b6a9b7" offset="50%" />
                </linearGradient>
                <linearGradient id="gi-sl">
                  <stop stopColor="#b6a9b7" offset="0%" />
                  <stop stopColor="#837484" offset="50%" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Send button */}
          <div className="absolute right-[6px] top-1/2 -translate-y-1/2 h-[38px] w-[38px]">
            <button
              type="submit"
              disabled={disabled || !value.trim()}
              className="absolute inset-0 flex items-center justify-center rounded-lg bg-gradient-to-b from-[#161329] via-black to-[#1d1b4b] border border-white/[0.12] disabled:opacity-30 transition-opacity duration-200 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5 text-white/70" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
