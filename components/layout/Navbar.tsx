"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { signOut, useSession } from "next-auth/react";

import { fields } from "@/lib/data/fields";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

type SearchResult = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  field: string;
  fieldSlug: string;
  publishedAt: string | null;
  readTime: number | null;
};

/* ================================================================
   SEARCH CONTROL

   IMPORTANT:
   Keep this component OUTSIDE Navbar().
   This prevents the input from being remounted on every keystroke.
================================================================ */

function SearchControl({
  mobile = false,
  searchOpen,
  setSearchOpen,
  searchQuery,
  setSearchQuery,
  searchResults,
  searchLoading,
  searchSearched,
  setSearchResults,
  setSearchSearched,
  setSearchLoading,
  searchInputRef,
  closeMenus,
}: {
  mobile?: boolean;
  searchOpen: boolean;
  setSearchOpen: Dispatch<SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  searchResults: SearchResult[];
  searchLoading: boolean;
  searchSearched: boolean;
  setSearchResults: Dispatch<SetStateAction<SearchResult[]>>;
  setSearchSearched: Dispatch<SetStateAction<boolean>>;
  setSearchLoading: Dispatch<SetStateAction<boolean>>;
  searchInputRef: RefObject<HTMLInputElement | null>;
  closeMenus: () => void;
}) {
  function openSearch() {
    setSearchOpen(true);

    window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 120);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setSearchSearched(false);
    setSearchLoading(false);

    requestAnimationFrame(() => {
      searchInputRef.current?.blur();
    });
  }

  function formatSearchDate(date: string | null) {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getSearchExcerpt(excerpt: string | null) {
    if (!excerpt?.trim()) {
      return "";
    }

    const text = excerpt.trim();

    return text.length > 100
      ? `${text.slice(0, 100).trim()}...`
      : text;
  }

  return (
    <div
      className={`relative z-[10000] flex shrink-0 justify-end ${
        mobile ? "h-10" : "h-9"
      }`}
    >
      {/* ==========================================================
          SEARCH BAR

          CLOSED:
          🔍

          OPEN:
          🔍  Search here ...                         ×

          The right edge stays fixed.
          The bar expands toward the LEFT.
      ========================================================== */}

      <div
        className={`relative flex items-center overflow-hidden rounded-full border bg-white/10 text-zinc-100 shadow-sm transition-[width,border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          searchOpen
            ? mobile
              ? "w-[calc(100vw-150px)] max-w-[320px] border-[#00a8ff] bg-white/10"
              : "w-[300px] border-[#00a8ff] bg-white/10"
            : mobile
              ? "h-10 w-10 border-white/20"
              : "h-9 w-9 border-white/20"
        }`}
      >
        {/* ========================================================
            CLOSED SEARCH BUTTON
        ======================================================== */}

        {!searchOpen && (
          <button
            type="button"
            onClick={openSearch}
            aria-label="Open search"
            title="Search"
            className="flex h-full w-full cursor-pointer items-center justify-center rounded-full text-zinc-100 transition-colors duration-200 hover:text-[#00a8ff]"
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
          </button>
        )}

        {/* ========================================================
            OPEN SEARCH

            🔍  text                              ×
        ======================================================== */}

        {searchOpen && (
          <>
            {/* LEFT SEARCH ICON */}

            <div className="ml-3 flex shrink-0 items-center text-[#00a8ff]">
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
            </div>

            {/* ====================================================
                SEARCH INPUT

                appearance-none + webkit rules remove the browser
                generated X.
            ==================================================== */}

            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
              placeholder="Search here ..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="h-full min-w-0 flex-1 appearance-none bg-transparent px-3 text-xs text-white outline-none placeholder:text-zinc-500 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
              aria-label="Search articles"
            />

            {/* ====================================================
                ONLY ONE CLOSE BUTTON
            ==================================================== */}

            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                closeSearch();
              }}
              aria-label="Close search"
              title="Close search"
              className="mr-2 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#00a8ff] transition-all duration-200 hover:bg-[#00a8ff]/10 hover:text-white"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7 7L17 17M17 7L7 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* ==========================================================
          SEARCH RESULTS

          Very high z-index so results stay ABOVE the navbar.
      ========================================================== */}

      {searchOpen && searchQuery.trim() && (
        <div
          className={`absolute top-[calc(100%+10px)] z-[999999] overflow-hidden rounded-xl border border-white/15 bg-[#0b0f12] shadow-2xl ${
            mobile
              ? "left-0 right-0 w-full"
              : "right-0 w-[360px]"
          }`}
        >
          {/* ======================================================
              LOADING
          ====================================================== */}

          {searchLoading ? (
            <div className="flex items-center justify-center gap-3 px-5 py-6 text-xs text-zinc-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-[#00a8ff]" />

              <span>Searching...</span>
            </div>
          ) : searchSearched &&
            searchResults.length === 0 ? (
            /* ====================================================
               NO RESULTS
            ==================================================== */

            <div className="px-5 py-7 text-center">
              <p className="text-sm font-semibold text-zinc-200">
                No articles found
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Try another keyword.
              </p>
            </div>
          ) : (
            <>
              {/* ==================================================
                  RESULTS HEADER
              ================================================== */}

              <div className="border-b border-white/10 px-4 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Search Results
                </p>
              </div>

              {/* ==================================================
                  RESULTS LIST
              ================================================== */}

              <div className="max-h-[65vh] overflow-y-auto">
                {searchResults.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    onClick={closeMenus}
                    className="group flex gap-3 border-b border-white/5 px-4 py-3 transition-colors duration-200 hover:bg-white/5 last:border-b-0"
                  >
                    {/* IMAGE */}

                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-white/5">
                      {blog.image ? (
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          sizes="80px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[9px] text-zinc-600">
                          No image
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-xs font-semibold leading-5 text-zinc-200 transition-colors duration-200 group-hover:text-[#00a8ff]">
                        {blog.title}
                      </h3>

                      {getSearchExcerpt(blog.excerpt) && (
                        <p className="mt-0.5 line-clamp-1 text-[10px] leading-4 text-zinc-500">
                          {getSearchExcerpt(blog.excerpt)}
                        </p>
                      )}

                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[9px] text-zinc-600">
                        <span className="text-[#00a8ff]">
                          {blog.field}
                        </span>

                        {blog.publishedAt && (
                          <>
                            <span>•</span>

                            <span>
                              {formatSearchDate(
                                blog.publishedAt
                              )}
                            </span>
                          </>
                        )}

                        {blog.readTime && (
                          <>
                            <span>•</span>

                            <span>
                              {blog.readTime} min
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* ARROW */}

                    <span className="mt-2 shrink-0 text-[#00a8ff] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* =================================================================
   NAVBAR
================================================================= */

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  /* ================================================================
     STATE
  ================================================================ */

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [openCategory, setOpenCategory] =
    useState<string | null>(null);

  const [accountOpen, setAccountOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [searchResults, setSearchResults] =
    useState<SearchResult[]>([]);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const [searchSearched, setSearchSearched] =
    useState(false);

  const navRef =
    useRef<HTMLElement>(null);

  const searchInputRef =
    useRef<HTMLInputElement>(null);

  /* ================================================================
     USER
  ================================================================ */

  const user = session?.user;

  const displayName =
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "Account";

  const email = user?.email || "";

  const firstLetter =
    displayName.charAt(0).toUpperCase() || "U";

  const isAdmin =
    user?.role === "ADMIN";

  /* ================================================================
     CLOSE SEARCH ON ROUTE CHANGE
  ================================================================ */

  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setSearchSearched(false);
  }, [pathname]);

  /* ================================================================
     CLICK OUTSIDE
  ================================================================ */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        navRef.current &&
        !navRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenCategory(null);
        setAccountOpen(false);
        setSearchOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* ================================================================
     ESCAPE
  ================================================================ */

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setOpenCategory(null);
      setAccountOpen(false);
      setSearchOpen(false);
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* ================================================================
     LIVE SEARCH

     300ms debounce.
     SearchControl is outside Navbar(), so the input stays mounted.
  ================================================================ */

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchSearched(false);
      return;
    }

    const controller =
      new AbortController();

    const timer = window.setTimeout(
      async () => {
        try {
          setSearchLoading(true);

          const response = await fetch(
            `/api/search?q=${encodeURIComponent(
              query
            )}`,
            {
              method: "GET",
              cache: "no-store",
              signal: controller.signal,
            }
          );

          if (!response.ok) {
            throw new Error(
              "Search request failed"
            );
          }

          const data =
            await response.json();

          setSearchResults(
            Array.isArray(data.blogs)
              ? data.blogs
              : []
          );

          setSearchSearched(true);
        } catch (error) {
          if (
            error instanceof DOMException &&
            error.name === "AbortError"
          ) {
            return;
          }

          console.error(
            "Search error:",
            error
          );

          setSearchResults([]);
          setSearchSearched(true);
        } finally {
          if (!controller.signal.aborted) {
            setSearchLoading(false);
          }
        }
      },
      300
    );

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  /* ================================================================
     MENU FUNCTIONS
  ================================================================ */

  function closeMenus() {
    setMobileMenuOpen(false);
    setOpenCategory(null);
    setAccountOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setSearchSearched(false);
  }

  function toggleMobileMenu() {
    setMobileMenuOpen(
      (current) => !current
    );

    setOpenCategory(null);
    setAccountOpen(false);
    setSearchOpen(false);
  }

  function toggleCategory(slug: string) {
    setOpenCategory((current) =>
      current === slug ? null : slug
    );

    setAccountOpen(false);
    setSearchOpen(false);
  }

  function toggleAccount() {
    setAccountOpen(
      (current) => !current
    );

    setOpenCategory(null);
    setSearchOpen(false);
  }

  /* ================================================================
     LOGOUT
  ================================================================ */

  async function handleLogout() {
    closeMenus();

    await signOut({
      callbackUrl: "/",
    });
  }

  /* ================================================================
     CYBERADMIN

     All hooks are above this condition.
  ================================================================ */

  if (
    pathname?.startsWith("/cyberadmin")
  ) {
    return null;
  }

  /* ================================================================
     RENDER
  ================================================================ */

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 border-b border-white/10 text-zinc-100 shadow-xl"
    >
      {/* ==========================================================
          VIDEO BACKGROUND
      ========================================================== */}

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

      {/* ==========================================================
          LOGO AREA

          IMPORTANT:
          overflow-visible allows the search results dropdown
          to extend over the navigation below.
      ========================================================== */}

      <div className="relative flex flex-col items-center justify-center overflow-visible pt-2.5 pb-0 sm:pt-3">
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

        {/* ========================================================
            DESKTOP CONTROLS

            SEARCH → THEME → ACCOUNT
        ======================================================== */}

        <div className="absolute right-5 top-4 z-[9999] hidden items-center gap-2.5 lg:flex xl:right-8">
          {/* SEARCH */}

          <SearchControl
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            searchLoading={searchLoading}
            searchSearched={searchSearched}
            setSearchResults={setSearchResults}
            setSearchSearched={setSearchSearched}
            setSearchLoading={setSearchLoading}
            searchInputRef={searchInputRef}
            closeMenus={closeMenus}
          />

          {/* THEME */}

          <ThemeToggle />

          {/* ACCOUNT */}

          {status === "loading" ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />
          ) : user ? (
            <div className="relative z-[200]">
              <button
                type="button"
                onClick={toggleAccount}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                aria-label="Open account menu"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#00a8ff]/50 bg-[#00a8ff]/15 text-sm font-bold text-[#00a8ff] shadow-[0_0_10px_rgba(0,168,255,0.2)] transition hover:border-[#00a8ff] hover:bg-[#00a8ff] hover:text-white"
              >
                {firstLetter}
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-[calc(100%+14px)] z-[9999] w-64 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-2xl backdrop-blur-md dark:border-white/15 dark:bg-[#0b0f12]">
                  <div className="border-b border-slate-200 px-3 py-3 dark:border-white/10">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-zinc-100">
                      {displayName}
                    </p>

                    <p className="truncate text-xs text-slate-500 dark:text-zinc-400">
                      {email}
                    </p>
                  </div>

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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-5 5h10a7 7 0 00-5-5z"
                      />
                    </svg>

                    My Account
                  </Link>

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
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z"
                        />
                      </svg>

                      Dashboard
                    </Link>
                  )}

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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 013 3v1"
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
      </div>

      {/* ==========================================================
          DESKTOP NAVIGATION

          Kept separate from search.
      ========================================================== */}

      <div className="relative z-[100] mt-1">
        <div className="mx-auto w-full px-3 pb-3 sm:px-5 lg:px-6 xl:px-8">
          <nav className="hidden w-full items-center justify-center lg:flex">
            {/* HOME */}

            <Link
              href="/"
              onClick={closeMenus}
              className="flex min-w-[58px] shrink-0 items-center justify-center px-1 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-zinc-300 transition-colors hover:text-[#00a8ff] xl:text-[11px]"
            >
              Home
            </Link>

            {/* FIELDS */}

            {fields.map((field) => (
              <div
                key={field.slug}
                className="relative z-[200] flex shrink-0 items-center justify-center"
              >
                <button
                  type="button"
                  onClick={() =>
                    toggleCategory(field.slug)
                  }
                  aria-expanded={
                    openCategory === field.slug
                  }
                  aria-haspopup="menu"
                  className="flex w-[105px] cursor-pointer items-center justify-center gap-1 px-1 text-center text-[10px] font-bold uppercase leading-[1.15] tracking-wide text-zinc-300 transition-colors hover:text-[#00a8ff] xl:w-[120px] xl:text-[11px] 2xl:w-[135px] 2xl:text-xs"
                >
                  <span className="whitespace-normal">
                    {field.name}
                  </span>

                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`mt-0.5 shrink-0 transition-transform duration-200 ${
                      openCategory === field.slug
                        ? "rotate-180"
                        : ""
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

                {/* FIELD DROPDOWN */}

                {openCategory === field.slug && (
                  <div
                    role="menu"
                    className="absolute left-1/2 top-[calc(100%+14px)] z-[9999] w-80 -translate-x-1/2 overflow-hidden rounded-xl border border-white/15 bg-[#0b0f12] p-2 shadow-2xl backdrop-blur-md"
                  >
                    <div
                      className="max-h-[min(420px,calc(100vh-180px))] overflow-y-auto overscroll-contain touch-pan-y pr-1"
                      onWheel={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      {field.subcategories.map(
                        (subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={`/field/${field.slug}/${subcategory.slug}`}
                            onClick={closeMenus}
                            role="menuitem"
                            className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
                          >
                            <span>
                              {subcategory.name}
                            </span>

                            <span className="translate-x-[-4px] text-[#00a8ff] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                              →
                            </span>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* ABOUT US */}

            <Link
              href="/about-us"
              onClick={closeMenus}
              className="flex min-w-[75px] shrink-0 items-center justify-center px-1 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-zinc-300 transition-colors hover:text-[#00a8ff] xl:min-w-[85px] xl:text-[11px] 2xl:text-xs"
            >
              About Us
            </Link>
          </nav>
        </div>
      </div>

      {/* ==========================================================
          MOBILE CONTROLS

          SEARCH → THEME → MENU
      ========================================================== */}

      <div className="relative z-[10000] flex w-full items-center justify-center gap-3 px-4 pb-4 pt-1 lg:hidden">
        {/* SEARCH */}

        <SearchControl
          mobile
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          searchLoading={searchLoading}
          searchSearched={searchSearched}
          setSearchResults={setSearchResults}
          setSearchSearched={setSearchSearched}
          setSearchLoading={setSearchLoading}
          searchInputRef={searchInputRef}
          closeMenus={closeMenus}
        />

        {/* THEME */}

        <ThemeToggle />

        {/* MENU */}

        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-label={
            mobileMenuOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={mobileMenuOpen}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-zinc-300 transition-all duration-200 hover:border-[#00a8ff] hover:text-[#00a8ff]"
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
                mobileMenuOpen
                  ? "opacity-0"
                  : ""
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

      {/* ==========================================================
          MOBILE NAVIGATION
      ========================================================== */}

      <div
        className={`border-t border-white/5 bg-[#050607]/95 backdrop-blur-md transition-all duration-300 lg:hidden ${
          mobileMenuOpen
            ? "max-h-[calc(100vh-105px)] overflow-y-auto overscroll-contain opacity-100 touch-pan-y"
            : "max-h-0 overflow-hidden opacity-0"
        }`}
        onWheel={(event) => {
          if (mobileMenuOpen) {
            event.stopPropagation();
          }
        }}
      >
        <nav className="mx-auto max-w-7xl px-5 py-4 pb-8 sm:px-8">
          {/* HOME */}

          <Link
            href="/"
            onClick={closeMenus}
            className="block border-b border-white/5 py-4 text-sm font-bold uppercase tracking-wide text-zinc-300"
          >
            Home
          </Link>

          {/* FIELDS */}

          {fields.map((field) => (
            <div
              key={field.slug}
              className="border-b border-white/5"
            >
              <button
                type="button"
                onClick={() =>
                  toggleCategory(field.slug)
                }
                aria-expanded={
                  openCategory === field.slug
                }
                aria-haspopup="menu"
                className="flex w-full cursor-pointer items-center justify-between py-4 text-left text-sm font-bold uppercase tracking-wide text-zinc-300"
              >
                <span>{field.name}</span>

                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className={`transition-transform duration-200 ${
                    openCategory === field.slug
                      ? "rotate-180"
                      : ""
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

              {openCategory === field.slug && (
                <div
                  role="menu"
                  className="max-h-[55vh] overflow-y-auto overscroll-contain pb-3 pl-3 pr-1 touch-pan-y"
                  onWheel={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <Link
                    href={`/field/${field.slug}`}
                    onClick={closeMenus}
                    className="mb-1 block rounded-lg bg-white/5 px-3 py-3 text-sm font-semibold text-[#00a8ff]"
                  >
                    View All {field.name}
                  </Link>

                  {field.subcategories.map(
                    (subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/field/${field.slug}/${subcategory.slug}`}
                        onClick={closeMenus}
                        role="menuitem"
                        className="block w-full rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-[#00a8ff]"
                      >
                        {subcategory.name}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          ))}

          {/* ABOUT */}

          <Link
            href="/about-us"
            onClick={closeMenus}
            className="block border-b border-white/5 py-4 text-sm font-bold uppercase tracking-wide text-zinc-300"
          >
            About Us
          </Link>

          {/* ======================================================
              MOBILE ACCOUNT
          ====================================================== */}

          {status === "loading" ? (
            <div className="mt-5 h-16 animate-pulse rounded-xl bg-white/5" />
          ) : user ? (
            <div className="mt-5 space-y-3">
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
                      d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z"
                      strokeWidth={2}
                    />
                  </svg>

                  Dashboard
                </Link>
              )}

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
    </header>
  );
}