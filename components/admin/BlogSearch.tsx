"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";

export default function BlogSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  
  const [value, setValue] = useState(currentSearch);
  const [prevSearch, setPrevSearch] = useState(currentSearch);
  const [isPending, startTransition] = useTransition();

  // Sync state during render (React 18+ recommended pattern to avoid useEffect cascading renders)
  if (currentSearch !== prevSearch) {
    setPrevSearch(currentSearch);
    setValue(currentSearch);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }

      params.delete("page");
      const urlSearch = searchParams.get("search") ?? "";

      if (value.trim() === urlSearch) return;

      startTransition(() => {
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [value, pathname, router, searchParams]);

  function clearSearch() {
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");

    startTransition(() => {
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  }

  return (
    <section className="rounded-xl border border-white/10 bg-[#111113] p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Search Blogs</h2>
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
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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