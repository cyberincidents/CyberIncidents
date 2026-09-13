"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function LiveSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") ?? "";

  const [value, setValue] = useState(initialQuery);

  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const query = value.trim();

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      const currentUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      if (
        `${pathname}?${searchParams.toString()}` !== currentUrl
      ) {
        router.replace(newUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, pathname, router, searchParams]);

  return (
    <div className="flex max-w-3xl flex-col gap-3 sm:flex-row">
      <label htmlFor="live-search" className="sr-only">
        Search articles
      </label>

      <input
        id="live-search"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search articles, threats, vulnerabilities..."
        autoComplete="off"
        spellCheck={false}
        className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
      />

      <button
        type="button"
        onClick={() => {
          const query = value.trim();

          const params = new URLSearchParams();

          if (query) {
            params.set("q", query);
          }

          const newUrl = params.toString()
            ? `${pathname}?${params.toString()}`
            : pathname;

          router.replace(newUrl, { scroll: false });
        }}
        className="rounded-xl bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Search
      </button>
    </div>
  );
}