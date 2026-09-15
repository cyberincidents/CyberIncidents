"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

type Field = {
  id: string;
  name: string;
};

type BlogFiltersProps = {
  fields: Field[];
};

export default function BlogFilters({ fields }: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentField = searchParams.get("field") ?? "";
  const currentStatus = searchParams.get("status") ?? "";
  const currentAccess = searchParams.get("access") ?? "";
  const currentFeatured = searchParams.get("featured") ?? "";

  const [isOpen, setIsOpen] = useState(false);
  const [field, setField] = useState(currentField);
  const [status, setStatus] = useState(currentStatus);
  const [access, setAccess] = useState(currentAccess);
  const [featured, setFeatured] = useState(currentFeatured);

  const [isPending, startTransition] = useTransition();

  const activeFilterCount = [
    currentField,
    currentStatus,
    currentAccess,
    currentFeatured,
  ].filter(Boolean).length;

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    if (field) {
      params.set("field", field);
    } else {
      params.delete("field");
    }

    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    if (access) {
      params.set("access", access);
    } else {
      params.delete("access");
    }

    if (featured) {
      params.set("featured", featured);
    } else {
      params.delete("featured");
    }

    params.delete("page");

    startTransition(() => {
      const query = params.toString();

      router.replace(
        query ? `${pathname}?${query}` : pathname,
        { scroll: false }
      );
    });
  }

  function clearFilters() {
    setField("");
    setStatus("");
    setAccess("");
    setFeatured("");

    const params = new URLSearchParams(searchParams.toString());

    params.delete("field");
    params.delete("status");
    params.delete("access");
    params.delete("featured");
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
    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111113] shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-white/[0.02]"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <svg
            className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>

          <div>
            <h2 className="text-sm font-semibold text-zinc-100">
              Filters
            </h2>

            <p className="mt-0.5 text-xs text-zinc-400">
              Narrow down your results
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <span className="rounded-full border border-[var(--cyber-blue)]/20 bg-[var(--cyber-blue)]/10 px-2.5 py-1 text-xs font-medium text-[var(--cyber-blue)]">
              {activeFilterCount}{" "}
              {activeFilterCount === 1 ? "active" : "active"}
            </span>
          )}

          <span className="text-xs font-medium text-zinc-500">
            {isOpen ? "Hide" : "Show"}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-white/10 bg-[#0a0a0c]/50 px-6 py-5">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {/* Category */}
            <div>
              <label
                htmlFor="field"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Category
              </label>

              <select
                id="field"
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-[var(--cyber-blue)] focus:ring-1 focus:ring-[var(--cyber-blue)]"
              >
                <option value="">All Categories</option>

                {fields.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-[var(--cyber-blue)] focus:ring-1 focus:ring-[var(--cyber-blue)]"
              >
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Access */}
            <div>
              <label
                htmlFor="access"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Access
              </label>

              <select
                id="access"
                value={access}
                onChange={(e) => setAccess(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-[var(--cyber-blue)] focus:ring-1 focus:ring-[var(--cyber-blue)]"
              >
                <option value="">All Access</option>
                <option value="FREE">Free</option>
                <option value="PAID">Paid</option>
              </select>
            </div>

            {/* Featured */}
            <div>
              <label
                htmlFor="featured"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Featured
              </label>

              <select
                id="featured"
                value={featured}
                onChange={(e) => setFeatured(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-[var(--cyber-blue)] focus:ring-1 focus:ring-[var(--cyber-blue)]"
              >
                <option value="">All Blogs</option>
                <option value="true">Featured</option>
                <option value="false">Not Featured</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={applyFilters}
              disabled={isPending}
              className="rounded-lg bg-gradient-to-r from-[var(--cyber-blue)] to-[var(--cyber-cyan)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Applying..." : "Apply Filters"}
            </button>

            <button
              type="button"
              onClick={clearFilters}
              disabled={isPending || activeFilterCount === 0}
              className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
