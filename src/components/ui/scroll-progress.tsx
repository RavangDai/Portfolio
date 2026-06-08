"use client";

import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useVelocity,
} from "framer-motion";
import { useIsBrut } from "@/lib/theme";

export function ScrollProgress() {
    const isBrut = useIsBrut();
    // On brutalist (light) routes the white comet would be invisible — swap to ink + cobalt.
    const c = isBrut
        ? {
              rail: "rgba(10,10,10,0.10)",
              fill: "linear-gradient(90deg, rgba(46,91,255,0) 0%, rgba(46,91,255,0.35) 55%, rgba(46,91,255,1) 100%)",
              streak: "linear-gradient(90deg, rgba(46,91,255,0) 0%, rgba(46,91,255,0.8) 100%)",
              halo: "radial-gradient(ellipse at center, rgba(46,91,255,0.85) 0%, rgba(46,91,255,0.35) 35%, rgba(46,91,255,0) 75%)",
              pin: "#2e5bff",
              pinShadow: "0 0 6px rgba(46,91,255,0.9), 0 0 14px rgba(46,91,255,0.5)",
          }
        : {
              rail: "rgba(255,255,255,0.05)",
              fill: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 55%, rgba(255,255,255,0.18) 100%)",
              streak: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 100%)",
              halo: "radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.35) 35%, rgba(255,255,255,0) 75%)",
              pin: "white",
              pinShadow:
                  "0 0 6px rgba(255,255,255,0.95), 0 0 14px rgba(255,255,255,0.55), 0 0 28px rgba(255,255,255,0.2)",
          };

    const { scrollYProgress, scrollY } = useScroll();

    const progress = useSpring(scrollYProgress, {
        stiffness: 220,
        damping: 32,
        restDelta: 0.001,
    });

    // Velocity drives the comet's "energy" — bigger and blurrier when scrolling fast
    const rawVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(rawVelocity, { stiffness: 80, damping: 24 });

    const headLeft = useTransform(progress, (p) => `${p * 100}%`);

    const haloWidth = useTransform(smoothVelocity, (v) =>
        Math.min(28 + Math.abs(v) / 18, 140)
    );
    const haloBlur = useTransform(
        smoothVelocity,
        (v) => `blur(${Math.min(0.6 + Math.abs(v) / 220, 3)}px)`
    );
    const haloOpacity = useTransform(smoothVelocity, (v) =>
        Math.min(0.45 + Math.abs(v) / 1200, 1)
    );

    // Trailing streak that lags slightly behind the head when scrolling fast
    const streakWidth = useTransform(smoothVelocity, (v) =>
        Math.min(Math.abs(v) / 8, 220)
    );
    const streakOpacity = useTransform(smoothVelocity, (v) =>
        Math.min(Math.abs(v) / 600, 0.7)
    );

    return (
        <div
            aria-hidden
            className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
        >
            {/* Always-on hairline so the rail has structure even at rest */}
            <div className="absolute inset-0" style={{ background: c.rail }} />

            {/* Filled track — everything you've already scrolled past, brightest near the head */}
            <motion.div
                className="absolute inset-y-0 left-0 right-0 origin-left"
                style={{
                    scaleX: progress,
                    background: c.fill,
                }}
            />

            {/* Velocity streak — a soft horizontal smear behind the head when moving */}
            <motion.div
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                    left: headLeft,
                    width: streakWidth,
                    height: 2,
                    marginLeft: -4,
                    transform: "translate(-100%, -50%)",
                    background: c.streak,
                    opacity: streakOpacity,
                    filter: "blur(0.5px)",
                }}
            />

            {/* Soft halo — radial bloom around the head, scales with velocity */}
            <motion.div
                className="absolute top-1/2 rounded-full"
                style={{
                    left: headLeft,
                    width: haloWidth,
                    height: 10,
                    x: "-50%",
                    y: "-50%",
                    opacity: haloOpacity,
                    filter: haloBlur,
                    background: c.halo,
                }}
            />

            {/* Pinpoint — the precise scroll position, always crisp */}
            <motion.div
                className="absolute top-1/2 h-[3px] w-[3px] rounded-full"
                style={{
                    left: headLeft,
                    x: "-50%",
                    y: "-50%",
                    background: c.pin,
                    boxShadow: c.pinShadow,
                }}
            />
        </div>
    );
}
