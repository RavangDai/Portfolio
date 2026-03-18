"use client";

import Link from "next/link";
import { Github, Linkedin, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

const NAV_LINKS = [
    { name: "Home", href: "#home" },
    { name: "Projects", href: "#projects" },
    { name: "Certificates", href: "#certificates" },
    { name: "Contact", href: "#contact" },
    { name: "Blog", href: "#blog" },
];

const SOCIALS = [
    {
        name: "GitHub",
        href: "https://github.com/RavangDai",
        icon: Github,
    },
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/bibek-pathak-10398a301/",
        icon: Linkedin,
    },
];

export function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="relative w-full bg-[#020A06] pt-16 pb-8 overflow-hidden">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.06),_transparent_60%)]" />

            <div className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-6">
                {/* Top row: Brand + Nav + Socials */}
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_auto] lg:gap-16 pb-10 border-b border-white/[0.06]">
                    {/* Brand */}
                    <div className="space-y-4">
                        <button
                            onClick={scrollToTop}
                            className="group text-left"
                        >
                            <span className="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-emerald-200">
                                Bibek Pathak
                            </span>
                        </button>
                        <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                            Full-stack engineer blending clean UX, solid engineering, and practical problem-solving.
                        </p>

                        {/* Socials */}
                        <div className="flex items-center gap-3 pt-2">
                            {SOCIALS.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <Link
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={social.name}
                                        className="btn-icon h-9 w-9"
                                    >
                                        <Icon className="h-4 w-4 transition-transform group-hover/s:scale-110" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Navigation
                        </h4>
                        <nav className="flex flex-col gap-2.5">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-white hover:translate-x-1 inline-flex items-center gap-1 w-fit"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Back to Top */}
                    <div className="flex flex-col items-start lg:items-end justify-between gap-6">
                        <motion.button
                            onClick={scrollToTop}
                            whileTap={{ scale: 0.97 }}
                            className="btn-ghost !py-2.5 !px-5 !text-xs !font-medium group"
                        >
                            Back to top
                            <motion.span
                              animate={{ y: [0, -3, 0] }}
                              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </motion.span>
                        </motion.button>
                    </div>
                </div>

                <div className="pt-6 text-center">
                    <p className="text-xs text-slate-700">
                        © {new Date().getFullYear()} Bibek Pathak. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
