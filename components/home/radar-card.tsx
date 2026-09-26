"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function RadarCard() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  return (
    <>
      {/* =====================================================
          RADAR CARD
      ===================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          delay: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-sm dark:border-white/10 dark:bg-[#07111c] dark:shadow-none"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
            Global Threat Radar
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            Live Feed
          </span>
        </div>

        {/* =====================================================
            DESKTOP RADAR
        ===================================================== */}
        <div className="relative mt-2 hidden overflow-hidden rounded-xl border border-slate-800 bg-[#060b13] md:block">
          <iframe
            src="https://live-thread-animation.vercel.app/"
            title="Cyberthreat Real-Time Map"
            className="h-[420px] w-full border-0 sm:h-[450px]"
            allowFullScreen
            loading="lazy"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060b13] via-transparent to-transparent opacity-80" />

          {/* Desktop fullscreen button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            aria-label="Open threat radar fullscreen"
            className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/70 px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md transition hover:border-cyan-400/50 hover:bg-black/85 hover:text-cyan-300"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M16 3h3a2 2 0 0 1 2 2v3" />
              <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>

            Fullscreen
          </button>
        </div>

        {/* =====================================================
            MOBILE RADAR PREVIEW
        ===================================================== */}
        <div className="relative mt-2 block overflow-hidden rounded-xl border border-slate-800 bg-[#060b13] md:hidden">
          <div className="relative h-[260px] w-full overflow-hidden">
            <iframe
              src="https://live-thread-animation.vercel.app/"
              title="Cyberthreat Real-Time Map"
              className="absolute left-1/2 top-1/2 h-[430px] w-[170%] -translate-x-1/2 -translate-y-1/2 border-0"
              allowFullScreen
              loading="lazy"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060b13] via-transparent to-transparent opacity-80" />

            {/* Mobile enlarge button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              aria-label="Open threat radar"
              className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur-md transition hover:bg-black/90 hover:text-cyan-300"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
                <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            </button>
          </div>
        </div>

        {/* =====================================================
            STATUS
        ===================================================== */}
        <div className="mt-5 border-t border-slate-200 pt-4 dark:border-white/10">
          <div className="flex items-center justify-between text-[10px] font-mono font-semibold uppercase tracking-wider">
            <span className="text-slate-500 dark:text-slate-400">
              Network Status
            </span>

            <span className="text-[#0284c7] dark:text-[#38bdf8]">
              Monitoring Active Nodes
            </span>
          </div>
        </div>
      </motion.div>

      {/* =====================================================
          DESKTOP FULLSCREEN PRESENTATION VIEW
      ===================================================== */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[99999] flex h-screen w-screen items-center justify-center bg-black">
          {/* Radar */}
          <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#050a11]">
            <iframe
              src="https://live-thread-animation.vercel.app/"
              title="Cyberthreat Real-Time Map Fullscreen"
              className="h-full w-full flex-1 border-0"
              allowFullScreen
              loading="eager"
            />

            {/* Bottom gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              aria-label="Close fullscreen radar"
className="absolute left-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-xl backdrop-blur-md transition hover:border-cyan-400/60 hover:bg-black/90 hover:text-cyan-300"            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>

            {/* Presentation label */}
            <div className="absolute bottom-5 left-5 z-30 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
              Global Threat Radar
            </div>

            {/* ESC hint */}
            <div className="absolute bottom-5 right-5 z-30 hidden rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-[9px] font-mono font-semibold uppercase tracking-wider text-white/50 sm:block">
              ESC to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}