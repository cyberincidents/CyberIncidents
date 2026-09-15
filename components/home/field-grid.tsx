"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { CyberField } from "@/lib/data/fields";
import {
  Terminal,
  ShieldAlert,
  Bug,
  Network,
  Lock,
  Cpu,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function getFieldIcon(slug: string) {
  const normalized = slug.toLowerCase();
  if (normalized.includes("hack")) return Terminal;
  if (normalized.includes("cyber") || normalized.includes("security")) return ShieldAlert;
  if (normalized.includes("malware") || normalized.includes("virus")) return Bug;
  if (normalized.includes("net") || normalized.includes("cloud")) return Network;
  if (normalized.includes("priv") || normalized.includes("data")) return Lock;
  return Cpu;
}

export function FieldGrid({ fields }: { fields: CyberField[] }) {
  const router = useRouter();
  const [clickedSlug, setClickedSlug] = useState<string | null>(null);

  function handleClick(e: React.MouseEvent, slug: string) {
    e.preventDefault();
    if (clickedSlug) return;
    setClickedSlug(slug);
    setTimeout(() => router.push(`/field/${slug}`), 380);
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {fields.map((field) => {
        const isClicked = clickedSlug === field.slug;
        const IconComponent = getFieldIcon(field.slug);

        return (
          <motion.div key={field.slug} variants={fadeUp}>
            <motion.a
              href={`/field/${field.slug}`}
              onClick={(e) => handleClick(e, field.slug)}
              whileHover={{ y: -6, scale: 1.015 }}
              whileTap={{ scale: 0.96 }}
              animate={isClicked ? { scale: [1, 1.04, 0.97] } : { scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-md shadow-slate-200/50 backdrop-blur-md transition-all duration-300 hover:border-[#0284c7]/40 hover:bg-white hover:shadow-xl dark:border-white/10 dark:bg-[#090d14]/90 dark:shadow-none dark:hover:border-[#00a8ff]/40 dark:hover:bg-[#0c121c] dark:hover:shadow-[0_20px_45px_rgba(0,168,255,0.18)]"
            >
              {/* Pop burst on click */}
              <AnimatePresence>
                {isClicked && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0.6 }}
                    animate={{ scale: 4, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00a8ff]/40"
                  />
                )}
              </AnimatePresence>

              {/* Ambient glow on hover */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#00a8ff]/[0.08] blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-[#00a8ff]/20" />

              <div>
                {/* Header row with Icon, Number tag, and Arrow button */}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#0284c7]/20 bg-[#0284c7]/[0.08] text-[#0284c7] transition-colors duration-300 group-hover:border-[#0284c7]/50 group-hover:bg-[#0284c7]/20 group-hover:text-[#0284c7] dark:border-[#00a8ff]/20 dark:bg-[#00a8ff]/[0.08] dark:text-[#00a8ff] dark:group-hover:border-[#00a8ff]/50 dark:group-hover:bg-[#00a8ff]/20 dark:group-hover:text-[#00d9ff] group-hover:shadow-[0_0_15px_rgba(0,168,255,0.3)]">
                      <IconComponent className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>

                    <span className="font-mono text-xs font-semibold tracking-widest text-slate-500 transition-colors duration-300 group-hover:text-[#0284c7] dark:text-white/40 dark:group-hover:text-[#00a8ff]">
                      {`[ ${field.number ?? "—"} ]`}
                    </span>
                  </div>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100/80 text-slate-500 transition-colors duration-300 group-hover:border-[#0284c7]/40 group-hover:bg-[#0284c7]/15 group-hover:text-[#0284c7] dark:border-white/10 dark:bg-white/[0.03] dark:text-white/50 dark:group-hover:border-[#00a8ff]/40 dark:group-hover:bg-[#00a8ff]/15 dark:group-hover:text-[#00d9ff]">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>

                {/* Field Details */}
                <div className="relative mt-6">
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-[#0284c7] dark:text-white dark:group-hover:text-[#00d9ff]">
                    {field.name}
                  </h3>
                  <p className="mt-2.5 text-xs leading-6 text-slate-600 line-clamp-3 dark:text-white/50">
                    {field.description ?? ""}
                  </p>
                </div>
              </div>

              {/* Status & Accent Rail */}
              <div className="relative mt-7 pt-4 border-t border-slate-200/80 dark:border-white/5">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-wider uppercase text-slate-500 transition-colors duration-300 group-hover:text-slate-700 dark:text-white/30 dark:group-hover:text-white/60">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0284c7] dark:bg-[#00a8ff] group-hover:animate-pulse" />
                    STATUS: ACTIVE
                  </span>
                  <span className="flex items-center gap-1 text-[#0284c7] transition-colors duration-300 group-hover:text-[#0369a1] dark:text-[#00a8ff]/80 dark:group-hover:text-[#00d9ff]">
                    Briefings <ChevronRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>

                {/* Bottom accent glow rail */}
                <div className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div className="h-full w-full bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-transparent dark:from-[#00a8ff] dark:via-[#00d9ff] transition-transform duration-500 -translate-x-full group-hover:translate-x-0" />
                </div>
              </div>
            </motion.a>
          </motion.div>
        );
      })}
    </motion.div>
  );
}