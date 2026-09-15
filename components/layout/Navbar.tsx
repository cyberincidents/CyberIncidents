"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import { fields } from "@/lib/data/fields";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  /*
   * IMPORTANT:
   * This ref covers the WHOLE navbar, including the mobile menu.
   * Previously it only covered the desktop nav row, which caused
   * mobile category clicks to be treated as outside clicks.
   */
  const navRef = useRef<HTMLElement>(null);

  const { data: session, status } = useSession();
  const user = session?.user;

  /*
   * Admin pages have their own navigation.
   */
  if (pathname?.startsWith("/cyberadmin")) {
    return null;
  }

  /*
   * Close dropdowns when clicking outside the ENTIRE navbar.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setFieldsOpen(false);
        setAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayName =
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "Account";

  const email = user?.email || "";

  const firstLetter =
    displayName.charAt(0).toUpperCase() || "U";

  const isAdmin = user?.role === "ADMIN";

  function closeMenus() {
    setMobileMenuOpen(false);
    setFieldsOpen(false);
    setAccountOpen(false);
  }

  function toggleMobileMenu() {
    setMobileMenuOpen((current) => !current);
    setFieldsOpen(false);
    setAccountOpen(false);
  }

  function toggleFields() {
    setFieldsOpen((current) => !current);
    setAccountOpen(false);
  }

  function toggleAccount() {
    setAccountOpen((current) => !current);
    setFieldsOpen(false);
  }

  async function handleLogout() {
    closeMenus();

    await signOut({
      callbackUrl: "/",
    });
  }

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 border-b border-white/10 text-zinc-100 shadow-xl"
    >
      {/* =========================================================
          VIDEO BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#050607]">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source
            src="/home/navbar-background.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-[#050607]/80 backdrop-blur-[1px]" />
      </div>

      {/* =========================================================
          NAVBAR CONTENT
      ========================================================= */}

      <div className="relative z-10">
        {/* =======================================================
            LOGO
        ======================================================= */}

        <div className="flex flex-col items-center justify-center overflow-hidden pt-2.5 pb-0 sm:pt-3">
          <Link
            href="/"
            onClick={closeMenus}
            className="relative block h-24 w-auto transition-transform hover:scale-[1.02] sm:h-32 lg:h-36"
          >
            <Image
              src="/brand/logo-transp.png"
              alt="CyberIncidents Logo"
              width={1000}
              height={300}
              priority
              className="h-full w-auto object-contain drop-shadow-md"
            />
          </Link>
        </div>

        {/* =======================================================
            NAV ROW
        ======================================================= */}

        <div className="relative z-[100] border-t border-white/5">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-x-8 gap-y-2 px-5 pt-1 pb-2 sm:px-8 sm:pt-1 sm:pb-2.5 lg:flex-wrap lg:px-10">
            {/* =================================================
                DESKTOP NAV
            ================================================= */}

            <nav className="hidden flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:flex">
              {/* HOME */}

              <Link
                href="/"
                onClick={closeMenus}
                className="relative z-10 text-sm font-bold uppercase tracking-wide text-zinc-300 transition-colors hover:text-[#00a8ff]"
              >
                Home
              </Link>

              {/* =================================================
                  FIELDS
              ================================================= */}

              <div className="relative z-[200]">
                <button
                  type="button"
                  onClick={toggleFields}
                  className="flex cursor-pointer items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-zinc-300 transition-colors hover:text-[#00a8ff]"
                  aria-expanded={fieldsOpen}
                  aria-haspopup="menu"
                >
                  Fields

                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`transition-transform duration-200 ${
                      fieldsOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="M2.5 4.5L6 8L9.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {fieldsOpen && (
                  <div
                    className="absolute left-1/2 top-[calc(100%+14px)] z-[9999] w-64 -translate-x-1/2 overflow-hidden rounded-xl border border-white/15 bg-[#0b0f12] p-2 shadow-2xl backdrop-blur-md"
                    role="menu"
                  >
                    <div className="px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00a8ff]">
                        Explore Fields
                      </p>
                    </div>

                    {fields.map((field) => (
                      <Link
                        key={field.slug}
                        href={`/field/${field.slug}`}
                        onClick={closeMenus}
                        className="group flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-sm text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
                        role="menuitem"
                      >
                        <span>{field.name}</span>

                        <span className="translate-x-[-4px] text-[#00a8ff] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* ABOUT */}

              <Link
                href="/about-us"
                onClick={closeMenus}
                className="relative z-10 text-sm font-bold uppercase tracking-wide text-zinc-300 transition-colors hover:text-[#00a8ff]"
              >
                About Us
              </Link>

              {/* CONTACT */}

              <Link
                href="/contact-us"
                onClick={closeMenus}
                className="relative z-10 text-sm font-bold uppercase tracking-wide text-zinc-300 transition-colors hover:text-[#00a8ff]"
              >
                Contact Us
              </Link>

              {/* PRIVACY */}

              <Link
                href="/privacy-policy"
                onClick={closeMenus}
                className="relative z-10 text-sm font-bold uppercase tracking-wide text-zinc-300 transition-colors hover:text-[#00a8ff]"
              >
                Privacy Policy
              </Link>
            </nav>

            {/* =================================================
                SEARCH + THEME + ACCOUNT
            ================================================= */}

            <div className="hidden items-center gap-3.5 lg:absolute lg:right-10 lg:flex">
              <ThemeToggle />

              {/* SEARCH */}

              <Link
                href="/search"
                aria-label="Search"
                onClick={closeMenus}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-zinc-100 shadow-sm transition hover:border-[#00a8ff] hover:bg-[#00a8ff]/20 hover:text-[#00a8ff]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="6.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M16 16L21 21"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>

              {/* ACCOUNT */}

              {status === "loading" ? (
                <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />
              ) : user ? (
                <div className="relative z-[200]">
                  {/* AVATAR */}

                  <button
                    type="button"
                    onClick={toggleAccount}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#00a8ff]/50 bg-[#00a8ff]/15 text-sm font-bold text-[#00a8ff] shadow-[0_0_10px_rgba(0,168,255,0.2)] transition hover:border-[#00a8ff] hover:bg-[#00a8ff] hover:text-white"
                    aria-expanded={accountOpen}
                    aria-haspopup="menu"
                    aria-label="Open account menu"
                  >
                    {firstLetter}
                  </button>

                  {/* ACCOUNT DROPDOWN */}

                  {accountOpen && (
                    <div className="absolute right-0 top-[calc(100%+14px)] z-[9999] w-64 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-2xl backdrop-blur-md dark:border-white/15 dark:bg-[#0b0f12]">
                      {/* USER INFORMATION */}

                      <div className="border-b border-slate-200 px-3 py-3 dark:border-white/10">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-zinc-100">
                          {displayName}
                        </p>

                        <p className="truncate text-xs text-slate-500 dark:text-zinc-400">
                          {email}
                        </p>
                      </div>

                      {/* MY ACCOUNT */}

                      <Link
                        href="/account"
                        onClick={closeMenus}
                        className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        <svg
                          className="h-4 w-4 text-[#0284c7] dark:text-[#00a8ff]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>

                        My Account
                      </Link>

                      {/* ADMIN DASHBOARD */}

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={closeMenus}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                          <svg
                            className="h-4 w-4 text-[#0284c7] dark:text-[#00a8ff]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z"
                            />
                          </svg>

                          Dashboard
                        </Link>
                      )}

                      {/* LOGOUT */}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>

                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenus}
                  className="rounded-lg border border-[#00a8ff]/50 bg-[#00a8ff]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#00a8ff] shadow-sm transition hover:bg-[#00a8ff] hover:text-white"
                >
                  Login
                </Link>
              )}
            </div>

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <div className="flex items-center gap-3 lg:hidden">
              <ThemeToggle />

              <button
                type="button"
                onClick={toggleMobileMenu}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-zinc-300"
                aria-label={
                  mobileMenuOpen
                    ? "Close menu"
                    : "Open menu"
                }
                aria-expanded={mobileMenuOpen}
              >
                <div className="flex w-5 flex-col gap-[5px]">
                  <span
                    className={`h-[2px] w-full rounded-full bg-current transition-all duration-300 ${
                      mobileMenuOpen
                        ? "translate-y-[7px] rotate-45"
                        : ""
                    }`}
                  />

                  <span
                    className={`h-[2px] w-full rounded-full bg-current transition-all duration-300 ${
                      mobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />

                  <span
                    className={`h-[2px] w-full rounded-full bg-current transition-all duration-300 ${
                      mobileMenuOpen
                        ? "-translate-y-[7px] -rotate-45"
                        : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* =======================================================
            MOBILE NAVIGATION
        ======================================================= */}

        <div
          className={`overflow-hidden border-t border-white/5 bg-[#050607]/95 backdrop-blur-md transition-all duration-300 lg:hidden ${
            mobileMenuOpen
              ? "max-h-[1000px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <nav className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
            {/* HOME */}

            <Link
              href="/"
              onClick={closeMenus}
              className="block border-b border-white/5 py-4 text-sm font-bold uppercase tracking-wide text-zinc-300"
            >
              Home
            </Link>

            {/* =================================================
                MOBILE CATEGORY
            ================================================= */}

            <div className="border-b border-white/5">
              <button
                type="button"
                onClick={toggleFields}
                className="flex w-full cursor-pointer items-center justify-between py-4 text-sm font-bold uppercase tracking-wide text-zinc-300"
                aria-expanded={fieldsOpen}
                aria-haspopup="menu"
              >
                <span>Category</span>

                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className={`transition-transform duration-200 ${
                    fieldsOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {fieldsOpen && (
                <div
                  className="relative z-[9999] pb-3 pl-3"
                  role="menu"
                >
                  {fields.map((field) => (
                    <Link
                      key={field.slug}
                      href={`/field/${field.slug}`}
                      onClick={closeMenus}
                      className="block w-full cursor-pointer rounded-lg py-3 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-[#00a8ff]"
                      role="menuitem"
                    >
                      {field.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* ABOUT */}

            <Link
              href="/about-us"
              onClick={closeMenus}
              className="block border-b border-white/5 py-4 text-sm font-bold uppercase tracking-wide text-zinc-300"
            >
              About Us
            </Link>

            {/* CONTACT */}

            <Link
              href="/contact-us"
              onClick={closeMenus}
              className="block border-b border-white/5 py-4 text-sm font-bold uppercase tracking-wide text-zinc-300"
            >
              Contact Us
            </Link>

            {/* PRIVACY */}

            <Link
              href="/privacy-policy"
              onClick={closeMenus}
              className="block border-b border-white/5 py-4 text-sm font-bold uppercase tracking-wide text-zinc-300"
            >
              Privacy Policy
            </Link>

            {/* =================================================
                MOBILE ACCOUNT
            ================================================= */}

            {status === "loading" ? (
              <div className="mt-5 h-16 animate-pulse rounded-xl bg-white/5" />
            ) : user ? (
              <div className="mt-5 space-y-3">
                {/* ACCOUNT */}

                <Link
                  href="/account"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 font-bold text-zinc-300">
                    {firstLetter}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-100">
                      {displayName}
                    </p>

                    <p className="truncate text-xs text-zinc-500">
                      {email}
                    </p>
                  </div>
                </Link>

                {/* ADMIN DASHBOARD */}

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={closeMenus}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#00a8ff]/30 bg-[#00a8ff]/10 px-5 py-3 text-sm font-bold text-[#00a8ff] transition hover:bg-[#00a8ff]/20"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z"
                      />
                    </svg>

                    Dashboard
                  </Link>
                )}

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full cursor-pointer rounded-lg border border-red-500/20 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={closeMenus}
                className="mt-5 block rounded-lg border border-white/10 px-5 py-3 text-center text-sm font-bold uppercase tracking-wide text-zinc-300 transition hover:bg-white/5"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}