"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function BlogSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";

  const [value, setValue] = useState(currentSearch);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }

      // Search always starts from the first page.
      params.delete("page");

      // Don't navigate if the URL already contains this search.
      const urlSearch = searchParams.get("search") ?? "";

      if (value.trim() === urlSearch) {
        return;
      }

      startTransition(() => {
        const query = params.toString();

        router.replace(
          query ? `${pathname}?${query}` : pathname,
          { scroll: false }
        );
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

      router.replace(
        query ? `${pathname}?${query}` : pathname,
        { scroll: false }
      );
    });
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Search Blogs
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Search by title, slug or excerpt.
          </p>
        </div>

        {isPending && (
          <span className="text-xs text-cyan-400">
            Searching...
          </span>
        )}
      </div>

      <div className="relative">
        <input
          id="blog-search"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search by title, slug or excerpt..."
          autoComplete="off"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 pr-20 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-cyan-400"
        />

        {value && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-slate-500 transition hover:bg-slate-800 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>
    </section>
  );
}