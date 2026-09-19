"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function HeroContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* =================================================
          TOP CYBER BADGE
      ================================================= */}

      <motion.div
        variants={fadeUp}
        className="inline-flex items-center gap-2 rounded border border-[#0284c7]/30 bg-[#0284c7]/[0.08] px-3.5 py-1.5 backdrop-blur-sm dark:border-[#38bdf8]/30 dark:bg-[#38bdf8]/[0.07]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#0284c7] shadow-[0_0_8px_#0284c7] dark:bg-[#38bdf8] dark:shadow-[0_0_8px_#38bdf8]" />

        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#0284c7] dark:text-[#38bdf8]">
          INTELLIGENCE INITIATIVE // DEFENSE FORENSICS
        </span>
      </motion.div>

      {/* =================================================
          MAIN TITLE

          IMPORTANT:
          This is the LCP element.

          It intentionally does NOT use Framer Motion.
      ================================================= */}

      <h1 className="mt-6 text-4xl font-extrabold uppercase leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
        EXPLORE THE THREATS.
        <br />
        <span className="text-[#0284c7] dark:text-[#38bdf8]">
          UNDERSTAND THE TECH.
        </span>
        <br />
        STAY SECURE.
      </h1>

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <motion.p
        variants={fadeUp}
        className="mt-6 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-gray-300 sm:text-base"
      >
        A cybersecurity publication covering the threats,
        technologies, and adversarial tactics shaping the
        digital world. Built for security teams, engineers,
        and digital defenders.
      </motion.p>
    </motion.div>
  );
}