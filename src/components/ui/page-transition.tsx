"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const pageVariants = {
    hidden: {
        opacity: 0,
        y: 12,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as const,
            staggerChildren: 0.08,
        },
    },
};

export function PageTransition({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={pageVariants}
        >
            {/* Overlay wipe that fades out */}
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="pointer-events-none fixed inset-0 z-[200] bg-[#050509]"
            />
            {children}
        </motion.div>
    );
}
