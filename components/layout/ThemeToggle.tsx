"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  /*
   * Hide the theme toggle on all admin pages.
   *
   * This covers:
   * /admin
   * /admin/*
   *
   * and the new admin route:
   * /cyberadmin
   * /cyberadmin/*
   */
  const isAdminPage =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/cyberadmin" ||
    pathname.startsWith("/cyberadmin/");

  if (isAdminPage) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-zinc-100 shadow-sm transition-all duration-300 hover:border-[#00a8ff] hover:bg-[#00a8ff]/20 hover:text-[#00a8ff] focus:outline-none focus:ring-2 focus:ring-[#00a8ff]/50 ${className}`}
      aria-label={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
      title={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      <div className="relative h-4 w-4">
        <Sun
          className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100 text-amber-400"
          }`}
        />

        <Moon
          className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
            isDark
              ? "rotate-0 scale-100 opacity-100 text-[#00d9ff]"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
    </button>
  );
}