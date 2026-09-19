"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const NAVIGATION_TIMEOUT = 12000;
const MIN_LOADER_TIME = 500;

export default function PageLoader() {
  const pathname = usePathname();

  /*
   * IMPORTANT:
   *
   * Start the intro loader as TRUE.
   *
   * This prevents the homepage from appearing for a moment
   * before React hydrates.
   */
  const [showIntroLoader, setShowIntroLoader] = useState(true);

  const [showNavigationLoader, setShowNavigationLoader] =
    useState(false);

  const [progress, setProgress] = useState(0);

  const previousPath = useRef(pathname);

  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const navigationTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const finishTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigationStartedAt = useRef<number | null>(null);

  /* =====================================================
     INITIAL LOADER CONTROL

     This runs only once.

     MP4 is allowed only when the actual initial URL
     is the homepage.

     Direct loading of a blog/field page will immediately
     hide the intro loader.
  ===================================================== */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    /*
     * The PageLoader is mounted globally.
     *
     * Check the actual browser URL rather than pathname
     * changes so internal navigation cannot trigger MP4.
     */
    const isHomepage =
      window.location.pathname === "/";

    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming | undefined;

    const isInitialDocumentLoad =
      navigation?.type === "navigate" ||
      navigation?.type === "reload";

    /*
     * Only keep the MP4 for an actual initial homepage load.
     */
    if (!isHomepage || !isInitialDocumentLoad) {
      setShowIntroLoader(false);
    }
  }, []);

  /* =====================================================
     MP4 FINISHED
  ===================================================== */

  const handleVideoEnded = () => {
    setShowIntroLoader(false);
  };

  /* =====================================================
     ROUTE CHANGE
  ===================================================== */

  useEffect(() => {
    if (previousPath.current === pathname) {
      return;
    }

    previousPath.current = pathname;

    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }

    if (navigationTimeout.current) {
      clearTimeout(navigationTimeout.current);
      navigationTimeout.current = null;
    }

    const startedAt =
      navigationStartedAt.current ?? Date.now();

    const elapsed = Date.now() - startedAt;

    const remainingTime = Math.max(
      0,
      MIN_LOADER_TIME - elapsed
    );

    finishTimeout.current = setTimeout(() => {
      setProgress(100);

      setTimeout(() => {
        setShowNavigationLoader(false);
        setProgress(0);
        navigationStartedAt.current = null;
      }, 180);
    }, remainingTime);

    return () => {
      if (finishTimeout.current) {
        clearTimeout(finishTimeout.current);
      }
    };
  }, [pathname]);

  /* =====================================================
     INTERNAL NAVIGATION
  ===================================================== */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      /*
       * Normal left click only.
       */
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;

      const link = target?.closest("a");

      if (!link) {
        return;
      }

      const href = link.getAttribute("href");

      if (!href) {
        return;
      }

      /*
       * Ignore downloads.
       */
      if (link.hasAttribute("download")) {
        return;
      }

      /*
       * Ignore disabled links.
       */
      if (
        link.getAttribute("aria-disabled") === "true"
      ) {
        return;
      }

      /*
       * Ignore anchors.
       */
      if (href.startsWith("#")) {
        return;
      }

      /*
       * Ignore mail / telephone.
       */
      if (
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      let url: URL;

      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      /*
       * Ignore external links.
       */
      if (url.origin !== window.location.origin) {
        return;
      }

      /*
       * Ignore same-page links.
       */
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash === window.location.hash
      ) {
        return;
      }

      /*
       * Clear existing navigation state.
       */

      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }

      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }

      if (finishTimeout.current) {
        clearTimeout(finishTimeout.current);
      }

      navigationStartedAt.current = Date.now();

      /*
       * Start full-screen secondary loader.
       */
      setShowNavigationLoader(true);
      setProgress(5);

      /*
       * Gradually move toward 90%.
       */
      progressInterval.current = setInterval(() => {
        setProgress((current) => {
          if (current >= 90) {
            return 90;
          }

          const remaining = 90 - current;

          return Math.min(
            90,
            current + Math.max(0.5, remaining * 0.08)
          );
        });
      }, 120);

      /*
       * Safety fallback.
       */
      navigationTimeout.current = setTimeout(() => {
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
          progressInterval.current = null;
        }

        setProgress(100);

        finishTimeout.current = setTimeout(() => {
          setShowNavigationLoader(false);
          setProgress(0);
          navigationStartedAt.current = null;
        }, 250);
      }, NAVIGATION_TIMEOUT);
    };

    /*
     * Capture phase.
     */
    document.addEventListener(
      "click",
      handleClick,
      true
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClick,
        true
      );

      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }

      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }

      if (finishTimeout.current) {
        clearTimeout(finishTimeout.current);
      }
    };
  }, []);

  /* =====================================================
     CLEANUP
  ===================================================== */

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }

      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }

      if (finishTimeout.current) {
        clearTimeout(finishTimeout.current);
      }
    };
  }, []);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      {/* =================================================
          PRIMARY MP4 LOADER
      ================================================= */}

      {showIntroLoader && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black"
          role="status"
          aria-label="Loading CyberIncidents"
        >
          <video
            src="/preloader3.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnded}
            className="h-auto max-h-full w-full max-w-full object-contain"
          />
        </div>
      )}

      {/* =================================================
          SECONDARY FULL-SCREEN LOADER
      ================================================= */}

      {showNavigationLoader && !showIntroLoader && (
        <div
          className="pointer-events-none fixed inset-0 z-[99998] flex items-center justify-center bg-white dark:bg-[#05070a]"
          role="status"
          aria-label="Loading page"
        >
          <div className="w-[min(420px,80vw)] text-center">
            <div className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.3em] text-slate-700 dark:text-gray-300">
              Loading
            </div>

            <div className="h-[4px] w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
              <div
                className="relative h-full rounded-full transition-[width] duration-150 ease-out"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, #0284c7, #38bdf8)",
                }}
              >
                <div
                  className="absolute right-0 top-0 h-full w-16"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
                    animation:
                      "cyberincidents-loader-shine 0.8s linear infinite",
                  }}
                />
              </div>
            </div>

            <div className="mt-4 font-mono text-sm font-bold tracking-widest text-[#0284c7] dark:text-[#38bdf8]">
              {Math.round(progress)}%
            </div>

            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Establishing secure connection
            </div>
          </div>

          <style jsx>{`
            @keyframes cyberincidents-loader-shine {
              from {
                transform: translateX(100%);
              }

              to {
                transform: translateX(-100%);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}