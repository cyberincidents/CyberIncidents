"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

type LiveSearchInputProps = {
  onClose?: () => void;
};

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path
        d="m16 16 4.5 4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatDate(date: string | null) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getExcerpt(
  excerpt: string | null
) {
  if (!excerpt?.trim()) {
    return "";
  }

  const text = excerpt.trim();

  if (text.length <= 120) {
    return text;
  }

  return `${text.slice(0, 120).trim()}...`;
}

export default function LiveSearchInput({
  onClose,
}: LiveSearchInputProps) {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  /*
   * Focus the search field when the search panel opens.
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);

  /*
   * Close with Escape.
   */
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  /*
   * Lock page scrolling while search is open.
   */
  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, []);

  /*
   * Live search.
   */
  useEffect(() => {
    const query = value.trim();

    if (!query) {
      setResults([]);
      setLoading(false);
      setSearched(false);
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(
      async () => {
        try {
          setLoading(true);

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

          const data = await response.json();

          setResults(
            Array.isArray(data.blogs)
              ? data.blogs
              : []
          );

          setSearched(true);
        } catch (error) {
          if (
            error instanceof DOMException &&
            error.name === "AbortError"
          ) {
            return;
          }

          console.error(
            "Live search error:",
            error
          );

          setResults([]);
          setSearched(true);
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        }
      },
      300
    );

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  return (
    <div className="absolute left-0 right-0 top-full z-[9999]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="fixed inset-0 -z-10 cursor-default bg-black/40 backdrop-blur-[2px]"
      />

      {/* Search panel */}
      <div className="border-b border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#080b0f]">
        <div className="mx-auto max-w-5xl px-5 py-5 sm:px-8 sm:py-7">
          {/* Search input row */}
          <div className="flex items-center gap-3">
            <div className="relative flex min-w-0 flex-1">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500">
                <SearchIcon />
              </div>

              <label
                htmlFor="navbar-search"
                className="sr-only"
              >
                Search cybersecurity articles
              </label>

              <input
                ref={inputRef}
                id="navbar-search"
                type="search"
                value={value}
                onChange={(event) =>
                  setValue(event.target.value)
                }
                placeholder="Search articles, threats, vulnerabilities..."
                autoComplete="off"
                spellCheck={false}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#00a8ff] focus:bg-white focus:ring-2 focus:ring-[#00a8ff]/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-500 dark:focus:bg-white/[0.07]"
              />
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              title="Close search"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#00a8ff] hover:bg-[#00a8ff]/10 hover:text-[#00a8ff] dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-[#00a8ff]/10 dark:hover:text-[#00a8ff]"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Results */}
          <div className="mt-5">
            {!value.trim() ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#00a8ff]/10 text-[#00a8ff]">
                  <SearchIcon />
                </div>

                <p className="mt-3 text-sm font-medium text-slate-700 dark:text-zinc-300">
                  Search CyberIncidents
                </p>

                <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">
                  Find cybersecurity incidents,
                  vulnerabilities, threats, and
                  defensive technologies.
                </p>
              </div>
            ) : loading ? (
              <div className="py-8 text-center">
                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#00a8ff] dark:border-white/10 dark:border-t-[#00a8ff]" />

                <p className="mt-3 text-xs text-slate-500 dark:text-zinc-500">
                  Searching articles...
                </p>
              </div>
            ) : searched &&
              results.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                  No articles found
                </p>

                <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">
                  Try another keyword or
                  cybersecurity topic.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-zinc-500">
                    Search Results
                  </p>

                  <p className="text-xs text-slate-400 dark:text-zinc-500">
                    {results.length}{" "}
                    {results.length === 1
                      ? "article"
                      : "articles"}
                  </p>
                </div>

                <div className="max-h-[60vh] overflow-y-auto rounded-xl border border-slate-200 dark:border-white/10">
                  {results.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      onClick={onClose}
                      className="group flex gap-4 border-b border-slate-100 bg-white p-3.5 transition hover:bg-slate-50 last:border-b-0 dark:border-white/5 dark:bg-[#080b0f] dark:hover:bg-white/[0.04] sm:p-4"
                    >
                      {/* Image */}
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-white/5 sm:h-24 sm:w-36">
                        {blog.image ? (
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            sizes="144px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-slate-400 dark:text-zinc-600">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-900 transition-colors group-hover:text-[#00a8ff] dark:text-zinc-100 dark:group-hover:text-[#00d9ff]">
                            {blog.title}
                          </h3>

                          <span className="mt-0.5 hidden shrink-0 text-[#00a8ff] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 sm:block">
                            <ArrowIcon />
                          </span>
                        </div>

                        {getExcerpt(blog.excerpt) && (
                          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-zinc-500">
                            {getExcerpt(
                              blog.excerpt
                            )}
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium text-slate-400 dark:text-zinc-600">
                          <span className="text-[#0284c7] dark:text-[#00a8ff]">
                            {blog.field}
                          </span>

                          {blog.publishedAt && (
                            <>
                              <span>•</span>
                              <span>
                                {formatDate(
                                  blog.publishedAt
                                )}
                              </span>
                            </>
                          )}

                          {blog.readTime && (
                            <>
                              <span>•</span>
                              <span>
                                {blog.readTime} min read
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}