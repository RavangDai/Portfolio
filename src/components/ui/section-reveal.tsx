"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const revealVariants = {
    hidden: {
        opacity: 0,
        y: 40,
        filter: "blur(6px)",
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
};

export function SectionReveal({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
