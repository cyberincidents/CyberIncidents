"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  type Variants,
} from "framer-motion";

import type { CyberField } from "@/lib/data/fields";

import {
  Terminal,
  ShieldAlert,
  Search,
  Radio,
  Cpu,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";

/* =====================================================
   TYPES
===================================================== */

type FieldWithHierarchy = CyberField & {
  id?: string;
  parentId?: string | null;
};

/* =====================================================
   ONLY THESE SIX ARE HOMEPAGE CATEGORIES
===================================================== */

const MAIN_CATEGORY_SLUGS = [
  "cyber-news",
  "threats-attacks",
  "incident-investigation",
  "security-defense",
  "emerging-security",
  "guides-learning",
];

/* =====================================================
   ANIMATION
===================================================== */

const container: Variants = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =====================================================
   CATEGORY ICON
===================================================== */

function getCategoryIcon(slug: string) {
  switch (slug) {
    case "cyber-news":
      return Radio;

    case "threats-attacks":
      return ShieldAlert;

    case "incident-investigation":
      return Search;

    case "security-defense":
      return Terminal;

    case "emerging-security":
      return Cpu;

    case "guides-learning":
      return BookOpen;

    default:
      return ShieldAlert;
  }
}

/* =====================================================
   FIELD GRID
===================================================== */

export function FieldGrid({
  fields,
}: {
  fields: CyberField[];
}) {
  const router = useRouter();

  const [clickedSlug, setClickedSlug] =
    useState<string | null>(null);

  const hierarchyFields =
    fields as FieldWithHierarchy[];

  /* ===================================================
     ONLY SHOW THE SIX MAIN CATEGORIES
  =================================================== */

  const parentFields =
    hierarchyFields
      .filter(
        (field) =>
          MAIN_CATEGORY_SLUGS.includes(
            field.slug
          )
      )
      .sort(
        (a, b) =>
          MAIN_CATEGORY_SLUGS.indexOf(
            a.slug
          ) -
          MAIN_CATEGORY_SLUGS.indexOf(
            b.slug
          )
      );

  /* ===================================================
     NAVIGATION
  =================================================== */

  function handleClick(
    event: React.MouseEvent,
    slug: string
  ) {
    event.preventDefault();

    if (clickedSlug) {
      return;
    }

    setClickedSlug(slug);

    setTimeout(() => {
      router.push(
        `/field/${slug}`
      );
    }, 320);
  }

  /* ===================================================
     RENDER
  =================================================== */

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{
        once: true,
        margin: "-60px",
      }}
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {parentFields.map(
        (field, index) => {
          const isClicked =
            clickedSlug ===
            field.slug;

          const IconComponent =
            getCategoryIcon(
              field.slug
            );

          const categoryNumber =
            field.number ??
            String(index + 1).padStart(
              2,
              "0"
            );

          return (
            <motion.div
              key={
                field.id ??
                field.slug
              }
              variants={fadeUp}
            >
              <motion.a
                href={`/field/${field.slug}`}
                onClick={(event) =>
                  handleClick(
                    event,
                    field.slug
                  )
                }
                whileHover={{
                  y: -6,
                  scale: 1.015,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                animate={
                  isClicked
                    ? {
                        scale: [
                          1,
                          1.04,
                          0.97,
                        ],
                      }
                    : {
                        scale: 1,
                      }
                }
                transition={{
                  duration: 0.3,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                className="group relative flex min-h-[230px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-md shadow-slate-200/50 backdrop-blur-md transition-all duration-300 hover:border-[#0284c7]/40 hover:bg-white hover:shadow-xl dark:border-white/10 dark:bg-[#090d14]/90 dark:shadow-none dark:hover:border-[#00a8ff]/40 dark:hover:bg-[#0c121c] dark:hover:shadow-[0_20px_45px_rgba(0,168,255,0.18)]"
              >
                {/* =================================================
                    CLICK BURST
                ================================================= */}

                <AnimatePresence>
                  {isClicked && (
                    <motion.span
                      initial={{
                        scale: 0,
                        opacity: 0.6,
                      }}
                      animate={{
                        scale: 4,
                        opacity: 0,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                      className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00a8ff]/40"
                    />
                  )}
                </AnimatePresence>

                {/* =================================================
                    AMBIENT GLOW
                ================================================= */}

                <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#00a8ff]/[0.08] blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-[#00a8ff]/20" />

                {/* =================================================
                    TOP ROW
                ================================================= */}

                <div className="relative flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    {/* Icon */}

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#0284c7]/20 bg-[#0284c7]/[0.08] text-[#0284c7] transition-all duration-300 group-hover:border-[#0284c7]/50 group-hover:bg-[#0284c7]/20 dark:border-[#00a8ff]/20 dark:bg-[#00a8ff]/[0.08] dark:text-[#00a8ff] dark:group-hover:border-[#00a8ff]/50 dark:group-hover:bg-[#00a8ff]/20 dark:group-hover:text-[#00d9ff]"
                    >
                      <IconComponent className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>

                    {/* Number */}

                    <span className="font-mono text-xs font-semibold tracking-widest text-slate-500 dark:text-white/40">
                      {`[ ${categoryNumber} ]`}
                    </span>

                  </div>

                  {/* Arrow */}

                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100/80 text-slate-500 transition-all duration-300 group-hover:border-[#0284c7]/40 group-hover:bg-[#0284c7]/15 group-hover:text-[#0284c7] dark:border-white/10 dark:bg-white/[0.03] dark:text-white/50 dark:group-hover:border-[#00a8ff]/40 dark:group-hover:bg-[#00a8ff]/15 dark:group-hover:text-[#00d9ff]"
                  >
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>

                </div>

                {/* =================================================
                    CATEGORY DETAILS
                ================================================= */}

                <div className="relative mt-6">

                  <h3 className="text-xl font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-[#0284c7] dark:text-white dark:group-hover:text-[#00d9ff]">
                    {field.name}
                  </h3>

                  <p className="mt-2.5 line-clamp-3 text-xs leading-6 text-slate-600 dark:text-white/50">
                    {field.description ??
                      "Explore cybersecurity intelligence, analysis, investigations, and technical resources."}
                  </p>

                </div>

                {/* =================================================
                    STATUS
                ================================================= */}

                <div className="relative mt-6 border-t border-slate-200/80 pt-4 dark:border-white/5">

                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/30">

                    <span className="flex items-center gap-1.5">

                      <span className="h-1.5 w-1.5 rounded-full bg-[#0284c7] dark:bg-[#00a8ff]" />

                      STATUS: ACTIVE

                    </span>

                    <span className="text-[#0284c7] dark:text-[#00a8ff]/80">
                      Explore →
                    </span>

                  </div>

                  {/* Accent rail */}

                  <div className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">

                    <div className="h-full w-full -translate-x-full bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-transparent transition-transform duration-500 group-hover:translate-x-0 dark:from-[#00a8ff] dark:via-[#00d9ff]" />

                  </div>

                </div>

              </motion.a>
            </motion.div>
          );
        }
      )}
    </motion.div>
  );
}