"use client";
import { motion } from "framer-motion";

export function RadarCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          Live Feed
        </span>
      </div>

      {/* Embedded Threat Map */}
      <div className="relative mt-2 overflow-hidden rounded-xl border border-slate-800 bg-[#060b13]">
        <iframe
          src="https://live-thread-animation.vercel.app/"
          title="Cyberthreat Real-Time Map"
          className="h-[420px] w-full border-0 sm:h-[450px]"
          allowFullScreen
          loading="lazy"
        />
        
        {/* Overlay to soften the map and tie it into your background color */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060b13] via-transparent to-transparent opacity-80" />
      </div>

      <div className="mt-5 border-t border-slate-200 pt-4 dark:border-white/10">
        <div className="flex items-center justify-between text-[10px] font-mono font-semibold uppercase tracking-wider">
          <span className="text-slate-500 dark:text-slate-400">Network Status</span>
          <span className="text-[#0284c7] dark:text-[#38bdf8]">
            Monitoring Active Nodes
          </span>
        </div>
      </div>
    </motion.div>
  );
}