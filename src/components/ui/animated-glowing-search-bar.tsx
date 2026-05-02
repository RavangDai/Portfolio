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
      <div className="relative flex items-center justify-center group w-full">

        {/* Outer glow ring */}
        <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[3px]
                        before:absolute before:content-[''] before:z-[-2] before:w-[999px] before:h-[999px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[60deg]
                        before:bg-[conic-gradient(#000,#402fb5_5%,#000_38%,#000_50%,#cf30aa_60%,#000_87%)]" />

        {/* Mid glow layer */}
        <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[3px]
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg]
                        before:bg-[conic-gradient(rgba(0,0,0,0),#18116a,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#6e1b60,rgba(0,0,0,0)_60%)]" />

        <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[3px]
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg]
                        before:bg-[conic-gradient(rgba(0,0,0,0),#18116a,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#6e1b60,rgba(0,0,0,0)_60%)]" />

        {/* Bright inner shimmer */}
        <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[2px]
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[83deg]
                        before:bg-[conic-gradient(rgba(0,0,0,0)_0%,#a099d8,rgba(0,0,0,0)_8%,rgba(0,0,0,0)_50%,#dfa2da,rgba(0,0,0,0)_58%)] before:brightness-[1.4]" />

        {/* Dark framing layer */}
        <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[0.5px]
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[70deg]
                        before:bg-[conic-gradient(#1c191c,#402fb5_5%,#1c191c_14%,#1c191c_50%,#cf30aa_60%,#1c191c_64%)] before:brightness-[1.3]" />

        {/* Input row */}
        <div className="relative group w-full">
          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            type="text"
            className="bg-[#010201] border-none w-full h-[50px] rounded-xl text-white pl-[46px] pr-[54px] text-[13px] focus:outline-none placeholder:text-white/20 disabled:opacity-50"
            style={{ letterSpacing: "-0.01em" }}
          />

          {/* Gradient input mask */}
          <div className="pointer-events-none w-[70px] h-[18px] absolute bg-gradient-to-r from-transparent to-[#010201] top-[16px] left-[50px] group-focus-within:hidden" />

          {/* Pink ambient glow */}
          <div className="pointer-events-none w-[24px] h-[16px] absolute bg-[#cf30aa] top-[8px] left-[4px] blur-2xl opacity-70" />

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
            <div className="absolute inset-0 overflow-hidden rounded-lg
                            before:absolute before:content-[''] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-90
                            before:bg-[conic-gradient(rgba(0,0,0,0),#3d3a4f,rgba(0,0,0,0)_50%,rgba(0,0,0,0)_50%,#3d3a4f,rgba(0,0,0,0)_100%)]
                            before:brightness-[1.35]" />
            <button
              type="submit"
              disabled={disabled || !value.trim()}
              className="absolute inset-[1px] flex items-center justify-center z-[2] rounded-lg bg-gradient-to-b from-[#161329] via-black to-[#1d1b4b] disabled:opacity-30 transition-opacity duration-200 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5 text-white/70" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
