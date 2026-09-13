"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { fields } from "@/lib/data/fields";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const { data: session, status } = useSession();

  const user = session?.user;

  const displayName =
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "Account";

  const email = user?.email || "";

  const firstLetter =
    displayName.charAt(0).toUpperCase() || "U";

  function closeMenus() {
    setMobileMenuOpen(false);
    setFieldsOpen(false);
    setAccountOpen(false);
  }

  async function handleLogout() {
    closeMenus();

    await signOut({
      callbackUrl: "/",
    });
  }

  return (
    <header className="sticky top-0 z-50 bg-[#050607] text-white shadow-lg">
      {/* Top accent */}
      <div className="h-[2px] bg-gradient-to-r from-[#008fd6] via-[#00d9ff] to-[#008fd6]" />

      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="relative flex shrink-0 items-center"
          aria-label="CyberIncidents home"
          onClick={closeMenus}
        >
          <Image
            src="/brand/cyberincidents-logo.png"
            alt="CyberIncidents"
            width={420}
            height={100}
            priority
            className="h-auto w-[185px] object-contain sm:w-[215px]"
          />
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-8 lg:flex">
          {/* Home */}
          <Link
            href="/"
            className="group relative py-2 text-sm font-medium text-white/80 transition-colors hover:text-[#00d9ff]"
          >
            Home

            <span className="absolute bottom-0 left-0 h-px w-0 bg-[#00d9ff] transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* Fields */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setFieldsOpen((current) => !current)
              }
              className="flex items-center gap-2 py-2 text-sm font-medium text-white/80 transition-colors hover:text-[#00d9ff]"
              aria-expanded={fieldsOpen}
            >
              Fields

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
              <div className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-xl border border-white/10 bg-[#0b0f12] p-2 shadow-2xl shadow-black/40">
                <div className="px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00a8ff]">
                    Explore Fields
                  </p>
                </div>

                {fields.map((field) => (
                  <Link
                    key={field.slug}
                    href={`/field/${field.slug}`}
                    onClick={() => setFieldsOpen(false)}
                    className="group flex items-center justify-between rounded-lg px-3 py-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <span>{field.name}</span>

                    <span className="translate-x-[-4px] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <Link
            href="/search"
            className="flex items-center gap-2 py-2 text-sm font-medium text-white/80 transition-colors hover:text-[#00d9ff]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />

              <path
                d="M16 16L21 21"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>

            Search
          </Link>

          {/* Authentication */}
          {status === "loading" ? (
            <div className="h-10 w-28 animate-pulse rounded-lg bg-white/5" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setAccountOpen((current) => !current)
                }
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-1.5 transition hover:border-[#00a8ff]/40 hover:bg-white/[0.06]"
                aria-expanded={accountOpen}
                aria-label="Open account menu"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={displayName}
                    width={38}
                    height={38}
                    className="h-[38px] w-[38px] rounded-full border border-white/10 object-cover"
                  />
                ) : (
                  <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#00a8ff]/15 text-sm font-bold text-[#00d9ff]">
                    {firstLetter}
                  </span>
                )}

                <div className="hidden min-w-0 text-left xl:block">
                  <p className="max-w-[130px] truncate text-sm font-semibold text-white">
                    {displayName}
                  </p>

                  <p className="max-w-[130px] truncate text-[11px] text-white/40">
                    {email}
                  </p>
                </div>

                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className={`text-white/40 transition-transform ${
                    accountOpen ? "rotate-180" : ""
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

              {accountOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-72 overflow-hidden rounded-xl border border-white/10 bg-[#0b0f12] p-2 shadow-2xl shadow-black/50">
                  <div className="border-b border-white/10 px-3 py-3">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={displayName}
                          width={44}
                          height={44}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00a8ff]/15 font-bold text-[#00d9ff]">
                          {firstLetter}
                        </span>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {displayName}
                        </p>

                        <p className="truncate text-xs text-white/40">
                          {email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/account"
                    onClick={() => setAccountOpen(false)}
                    className="mt-2 flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    <span>👤</span>
                    <span>My Account</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-red-300 transition hover:bg-red-400/10"
                  >
                    <span>↪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border border-[#00a8ff]/60 px-5 py-2.5 text-sm font-semibold text-[#00cfff] transition-all duration-200 hover:border-[#00d9ff] hover:bg-[#00a8ff]/10"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile button */}
        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen((current) => !current)
          }
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white transition hover:border-[#00a8ff]/60 hover:text-[#00d9ff] lg:hidden"
          aria-label={
            mobileMenuOpen ? "Close menu" : "Open menu"
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

      {/* Mobile navigation */}
      <div
        className={`overflow-hidden border-t border-white/10 bg-[#080b0d] transition-all duration-300 lg:hidden ${
          mobileMenuOpen
            ? "max-h-[800px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <Link
            href="/"
            onClick={closeMenus}
            className="block border-b border-white/5 py-4 text-sm font-medium text-white/80 hover:text-[#00d9ff]"
          >
            Home
          </Link>

          <div className="border-b border-white/5">
            <button
              type="button"
              onClick={() =>
                setFieldsOpen((current) => !current)
              }
              className="flex w-full items-center justify-between py-4 text-sm font-medium text-white/80"
            >
              Fields

              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={`transition-transform ${
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
              <div className="pb-3 pl-3">
                {fields.map((field) => (
                  <Link
                    key={field.slug}
                    href={`/field/${field.slug}`}
                    onClick={closeMenus}
                    className="block py-3 text-sm text-white/50 transition hover:text-[#00d9ff]"
                  >
                    {field.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/search"
            onClick={closeMenus}
            className="flex items-center gap-2 border-b border-white/5 py-4 text-sm font-medium text-white/80 hover:text-[#00d9ff]"
          >
            Search
          </Link>

          {status === "loading" ? (
            <div className="mt-5 h-16 animate-pulse rounded-xl bg-white/5" />
          ) : user ? (
            <div className="mt-5 space-y-3">
              <Link
                href="/account"
                onClick={closeMenus}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={displayName}
                    width={46}
                    height={46}
                    className="h-[46px] w-[46px] rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#00a8ff]/15 font-bold text-[#00d9ff]">
                    {firstLetter}
                  </span>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {displayName}
                  </p>

                  <p className="truncate text-xs text-white/40">
                    {email}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg border border-red-400/20 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={closeMenus}
              className="mt-5 block rounded-lg border border-[#00a8ff]/50 px-5 py-3 text-center text-sm font-semibold text-[#00d9ff] transition hover:bg-[#00a8ff]/10"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}