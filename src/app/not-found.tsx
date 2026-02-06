"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.43, 0.13, 0.23, 0.96] as const,
            delayChildren: 0.1,
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.43, 0.13, 0.23, 0.96] as const
        }
    }
};

const numberVariants: Variants = {
    hidden: (direction: number) => ({
        opacity: 0,
        x: direction * 40,
        y: 15,
        rotate: direction * 5
    }),
    visible: {
        opacity: 0.7,
        x: 0,
        y: 0,
        rotate: 0,
        transition: {
            duration: 0.8,
            ease: [0.43, 0.13, 0.23, 0.96] as const
        }
    }
};

const ghostVariants: Variants = {
    hidden: {
        scale: 0.8,
        opacity: 0,
        y: 15,
        rotate: -5
    },
    visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        rotate: 0,
        transition: {
            duration: 0.6,
            ease: [0.43, 0.13, 0.23, 0.96] as const
        }
    },
    hover: {
        scale: 1.1,
        y: -10,
        rotate: [0, -5, 5, -5, 0],
        transition: {
            duration: 0.8,
            ease: "easeInOut",
            rotate: {
                duration: 2,
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse"
            }
        }
    },
    floating: {
        y: [-5, 5],
        transition: {
            y: {
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
            }
        }
    }
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#050509] px-4 relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(129,140,248,0.03),_transparent_40%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <AnimatePresence mode="wait">
                <motion.div
                    className="text-center relative z-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 md:mb-12">
                        <motion.span
                            className="text-[80px] md:text-[120px] font-bold text-white/10 select-none"
                            variants={numberVariants}
                            custom={-1}
                        >
                            4
                        </motion.span>
                        <motion.div
                            variants={ghostVariants}
                            whileHover="hover"
                            animate={["visible", "floating"]}
                            className="relative"
                        >
                            {/* Glow for the ghost */}
                            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                            <Image
                                src="https://xubohuah.github.io/xubohua.top/Group.png"
                                alt="Ghost"
                                width={120}
                                height={120}
                                className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] object-contain select-none relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                draggable="false"
                                priority
                            />
                        </motion.div>
                        <motion.span
                            className="text-[80px] md:text-[120px] font-bold text-white/10 select-none"
                            variants={numberVariants}
                            custom={1}
                        >
                            4
                        </motion.span>
                    </div>

                    <motion.h1
                        className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 tracking-tight select-none"
                        variants={itemVariants}
                    >
                        Boo! Page missing!
                    </motion.h1>

                    <motion.p
                        className="text-lg md:text-xl text-slate-400 mb-8 md:mb-12 max-w-md mx-auto leading-relaxed select-none"
                        variants={itemVariants}
                    >
                        Whoops! This page must be a ghost - it&apos;s not here!
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        whileHover={{
                            scale: 1.05,
                            transition: {
                                duration: 0.3,
                                ease: [0.43, 0.13, 0.23, 0.96] as const
                            }
                        }}
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center bg-white text-black px-8 py-3 rounded-full text-base font-medium transition-all hover:bg-slate-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] select-none"
                        >
                            Find shelter
                        </Link>
                    </motion.div>

                    <motion.div
                        className="mt-12"
                        variants={itemVariants}
                    >
                        <Link
                            href="https://en.wikipedia.org/wiki/HTTP_404"
                            target="_blank"
                            className="text-slate-600 hover:text-slate-400 transition-colors text-sm underline select-none"
                        >
                            What means 404?
                        </Link>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
