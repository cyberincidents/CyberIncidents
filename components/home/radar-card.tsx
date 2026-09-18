"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const RADAR_URL =
  "https://live-thread-animation.vercel.app/";

export function RadarCard() {
  const [isFullscreen, setIsFullscreen] =
    useState(false);

  // Lock page scrolling while popup is open
  useEffect(() => {
    if (!isFullscreen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isFullscreen]);

  return (
    <>
      {/* =========================================================
          MAIN RADAR CARD
      ========================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 24,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.7,
          delay: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-sm dark:border-white/10 dark:bg-[#07111c] dark:shadow-none"
      >
        {/* =======================================================
            HEADER
        ======================================================= */}

        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
            Global Threat Radar
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              animate={{
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            Live Feed
          </span>
        </div>

        {/* =======================================================
            DESKTOP RADAR
            md and above
        ======================================================= */}

        <div className="relative mt-2 hidden overflow-hidden rounded-xl border border-slate-800 bg-[#060b13] md:block">
          <iframe
            src={RADAR_URL}
            title="Cyberthreat Real-Time Map"
            className="h-[450px] w-full border-0"
            allowFullScreen
            loading="lazy"
          />

          {/* Bottom gradient */}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060b13] via-transparent to-transparent opacity-80" />

          {/* =====================================================
              DESKTOP FULLSCREEN BUTTON
          ===================================================== */}

          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            aria-label="Open threat radar fullscreen"
            className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-[#050a11]/90 px-3 py-2 text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-300 shadow-lg shadow-black/30 backdrop-blur-md transition-all duration-200 hover:border-cyan-400/70 hover:bg-cyan-500/10 hover:text-cyan-200"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M8 3H3v5" />
              <path d="M3 3l6 6" />

              <path d="M16 3h5v5" />
              <path d="M21 3l-6 6" />

              <path d="M8 21H3v-5" />
              <path d="M3 21l6-6" />

              <path d="M16 21h5v-5" />
              <path d="m21 21-6-6" />
            </svg>

            Fullscreen
          </button>
        </div>

        {/* =======================================================
            MOBILE RADAR PREVIEW
        ======================================================= */}

        <div
          className="relative mt-2 h-[210px] overflow-hidden rounded-xl border border-slate-800 bg-[#060b13] md:hidden"
        >
          {/* =====================================================
              SCALED RADAR PREVIEW

              The iframe is intentionally larger than the container
              and scaled down so the complete radar UI is visible.
          ===================================================== */}

         <div
  className="absolute left-0 top-0 origin-top-left overflow-hidden"
  style={{
    width: "200%",
    height: "420px",
    transform: "scale(0.5)",
  }}
>
  <iframe
    src={RADAR_URL}
    title="Cyberthreat Real-Time Map Preview"
    className="block h-[420px] w-full overflow-hidden border-0"
    loading="lazy"
    scrolling="no"
    tabIndex={-1}
  />
</div>

          {/* Preview darkening layer */}

          <div className="pointer-events-none absolute inset-0 bg-black/10" />

          {/* Bottom fade */}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#060b13] to-transparent" />

          {/* =====================================================
              MOBILE ENLARGE BUTTON
              BOTTOM RIGHT
          ===================================================== */}

          <button
            type="button"
            onClick={() =>
              setIsFullscreen(true)
            }
            aria-label="Open threat radar"
            className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 bg-[#050a11]/95 px-3 py-2 text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-300 shadow-lg shadow-black/40 backdrop-blur-md transition-all duration-200 active:scale-95"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M8 3H3v5" />
              <path d="M3 3l6 6" />

              <path d="M16 3h5v5" />
              <path d="M21 3l-6 6" />

              <path d="M8 21H3v-5" />
              <path d="M3 21l6-6" />

              <path d="M16 21h5v-5" />
              <path d="m21 21-6-6" />
            </svg>

            View Radar
          </button>

          {/* Small live indicator */}

          <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-md border border-emerald-400/20 bg-[#050a11]/85 px-2 py-1 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-[7px] font-mono font-bold uppercase tracking-wider text-emerald-400">
              Live Feed
            </span>
          </div>
        </div>

        {/* =======================================================
            NETWORK STATUS
        ======================================================= */}

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

      {/* ===========================================================
          FULLSCREEN / POPUP RADAR
      =========================================================== */}

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-2 backdrop-blur-sm"
            onClick={() =>
              setIsFullscreen(false)
            }
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                y: 15,
              }}
              transition={{
                duration: 0.2,
              }}
              className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-cyan-400/20 bg-[#050a11] shadow-2xl shadow-black/60 md:h-[95vh] md:w-[96vw]"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              {/* =================================================
                  POPUP HEADER
              ================================================= */}

              <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#050a11]/95 px-3 py-3 backdrop-blur-xl sm:px-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="8"
                      />
                      <path d="M12 4v8l5 3" />
                      <path d="M4 12h16" />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white sm:text-sm">
                      Global Threat Radar
                    </h2>

                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                      <span className="text-[8px] font-mono uppercase tracking-wider text-emerald-400">
                        Live Feed
                      </span>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    CLOSE BUTTON
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    setIsFullscreen(false)
                  }
                  aria-label="Close threat radar"
                  className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-all duration-200 hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-300 active:scale-95"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6 6 18" />
                  </svg>
                </button>
              </div>

              {/* =================================================
                  FULL RADAR
              ================================================= */}

              <div className="relative min-h-0 flex-1 bg-[#060b13]">
                <iframe
                  src={RADAR_URL}
                  title="Cyberthreat Real-Time Map Fullscreen"
                  className="h-full w-full border-0"
                  allowFullScreen
                />
              </div>

              {/* =================================================
                  FOOTER
              ================================================= */}

              <div className="flex shrink-0 items-center justify-between border-t border-white/10 bg-[#050a11] px-3 py-2.5 sm:px-5">
                <span className="text-[7px] font-mono uppercase tracking-wider text-slate-500 sm:text-[9px]">
                  Monitoring Active Nodes
                </span>

                <span className="flex items-center gap-1.5 text-[7px] font-mono uppercase tracking-wider text-emerald-400 sm:text-[9px]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                  Active
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}