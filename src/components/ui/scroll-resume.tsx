"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.85, 0.95] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section
      id="resume"
      ref={containerRef}
      className="relative flex h-[60rem] md:h-[80rem] items-center justify-center overflow-visible bg-gradient-to-b from-transparent via-black/40 to-transparent px-4 md:px-8"
    >
      <div
        className="relative w-full py-16 md:py-28"
        style={{ perspective: "1000px" }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </section>
  );
};

const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="mx-auto mb-10 max-w-3xl text-center md:mb-14"
    >
      {titleComponent}
    </motion.div>
  );
};

const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="mx-auto -mt-10 h-[30rem] w-full max-w-5xl rounded-[32px] border border-white/12 bg-[#050509]/90 p-3 shadow-2xl md:h-[40rem] md:p-5"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-neutral-950/80 md:p-4">
        {children}
      </div>
    </motion.div>
  );
};

/* =========================
   Resume Section
   ========================= */

export function ResumeSection() {
  return (
    <ContainerScroll
      titleComponent={
        <>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-indigo-200/70">
            Resume Snapshot
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
            A quick look at my experience.
          </h2>
          <p className="mt-3 text-sm text-white/55 sm:text-base">
            Scroll to explore a live preview of my resume. You can also download
            the full PDF for a closer look.
          </p>
          <a
            href="/Bibek_Pathak_Resume.pdf"
            download
            className="mt-5 inline-flex items-center justify-center rounded-full border border-white/18 bg-white/[0.03] px-5 py-2 text-xs font-medium text-white/85 shadow-[0_12px_35px_rgba(0,0,0,0.7)] backdrop-blur-md transition hover:border-white/40 hover:bg-white/[0.08]"
          >
            Download full resume
          </a>
        </>
      }
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Resume image inside card */}
        <div className="relative h-full w-full max-w-3xl">
          <Image
            src="/Bibek_Pathak_Resume.png"
            alt="Bibek Pathak resume preview"
            fill
            className="object-contain rounded-xl border border-white/10 bg-neutral-900"
            priority
          />
        </div>
      </div>
    </ContainerScroll>
  );
}
