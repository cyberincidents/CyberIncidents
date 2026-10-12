
"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

export default function BlogSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();
  const currentSearch = searchParams.get("search") ?? "";

  const [value, setValue] = useState(currentSearch);
  const [isPending, startTransition] = useTransition();

  const submittedSearch = useRef<string | null>(null);

  // Sync with URL changes from browser navigation or other controls,
  // without overwriting text during our own search navigation.
  useEffect(() => {
    if (submittedSearch.current !== null) {
      if (submittedSearch.current === currentSearch) {
        submittedSearch.current = null;
      }
      return;
    }

    setValue(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    const search = value.trim();

    if (search === currentSearch) return;

    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(queryString);

      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }

      params.delete("page");

      const query = params.toString();
      submittedSearch.current = search;

      startTransition(() => {
        router.replace(
          query ? `${pathname}?${query}` : pathname,
          { scroll: false }
        );
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [value, currentSearch, queryString, pathname, router]);

  function clearSearch() {
    setValue("");
    submittedSearch.current = "";

    const params = new URLSearchParams(queryString);
    params.delete("search");
    params.delete("page");

    const query = params.toString();

    startTransition(() => {
      router.replace(
        query ? `${pathname}?${query}` : pathname,
        { scroll: false }
      );
    });
  }

  return (
    <section className="rounded-xl border border-white/10 bg-[#111113] p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">
            Search Blogs
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Find articles by title, slug or excerpt.
          </p>
        </div>

        {isPending && (
          <span className="animate-pulse text-xs font-medium text-[var(--cyber-blue)]">
            Searching...
          </span>
        )}
      </div>

      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="9"
            cy="9"
            r="6"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M13.5 13.5L17 17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        <input
          id="blog-search"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search..."
          autoComplete="off"
          className="w-full rounded-lg border border-white/10 bg-[#0a0a0c] px-4 py-2.5 pl-10 pr-20 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 transition focus:border-[var(--cyber-blue)] focus:ring-1 focus:ring-[var(--cyber-blue)]"
        />

        {value && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100"
          >
            Clear
          </button>
        )}
      </div>
    </section>
  );
}
