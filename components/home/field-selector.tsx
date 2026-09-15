"use client";

import { useState } from "react";
import { FieldGrid } from "@/components/home/field-grid";
import type { CyberField } from "@/lib/data/fields";
import { Search } from "lucide-react";

export function FieldSelector({ fields }: { fields: CyberField[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFields = fields.filter((field) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      field.name.toLowerCase().includes(query) ||
      field.description?.toLowerCase().includes(query) ||
      field.slug.toLowerCase().includes(query)
    );
  });

  return (
    <section id="fields" className="relative overflow-hidden border-t border-slate-200/80 bg-[#f4f7fb] transition-colors duration-200 dark:border-white/10 dark:bg-[#05070a] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#00a8ff]/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0284c7]/30 dark:via-[#00a8ff]/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#0284c7]/30 bg-[#0284c7]/[0.08] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0284c7] dark:border-[#00a8ff]/25 dark:bg-[#00a8ff]/[0.06] dark:text-[#4fc3ff]">
              <span className="text-[#0284c7] dark:text-[#00a8ff]">▹</span>
              <span>Tactical Taxonomy // Discipline Registry</span>
            </div>

            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              Select Your <span className="text-[#0284c7] dark:text-[#00a8ff]">Operational Domain</span>
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-white/50 sm:text-base">
              Select an operational domain to access verified intelligence briefings,
              adversary analyses, zero-day threat telemetry, and technical post-mortems.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Live Search Input */}
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/40" />
              <input
                type="text"
                placeholder="Search disciplines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white/90 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 shadow-sm backdrop-blur-sm transition-all focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]/50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder-white/40 dark:focus:border-[#00a8ff]/60 dark:focus:bg-white/[0.08] dark:focus:ring-[#00a8ff]/50"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 dark:text-white/40 dark:hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Active Disciplines Badge */}
            <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-[#0284c7]/30 bg-[#0284c7]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#0284c7] dark:border-[#00a8ff]/30 dark:bg-[#00a8ff]/10 dark:text-[#00d9ff]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0284c7] dark:bg-[#00d9ff] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0284c7] dark:bg-[#00d9ff]" />
              </span>
              {fields.length} Disciplines Active
            </span>
          </div>
        </div>

        <div className="mt-12">
          {filteredFields.length > 0 ? (
            <FieldGrid fields={filteredFields} />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white/80 py-16 text-center text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.02] dark:text-white/50">
              <p className="font-mono text-xs uppercase tracking-widest">No matching operational domains found</p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 text-xs font-semibold text-[#0284c7] underline underline-offset-4 hover:text-[#0369a1] dark:text-[#00a8ff] dark:hover:text-[#00d9ff]"
              >
                Clear Search Query
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}