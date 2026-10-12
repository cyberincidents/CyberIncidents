
"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

type Field = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

type BlogFiltersProps = {
  fields: Field[];
};

const MAIN_CATEGORY_SLUGS = [
  "cyber-news",
  "threats-attacks",
  "incident-investigation",
  "security-defense",
  "emerging-security",
  "guides-learning",
];

export default function BlogFilters({ fields }: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();

  const currentField = searchParams.get("field") ?? "";
  const currentStatus = searchParams.get("status") ?? "";
  const currentAccess = searchParams.get("access") ?? "";
  const currentFeatured = searchParams.get("featured") ?? "";

  const [isOpen, setIsOpen] = useState(false);
  const [parentCategory, setParentCategory] = useState("");
  const [field, setField] = useState(currentField);
  const [status, setStatus] = useState(currentStatus);
  const [access, setAccess] = useState(currentAccess);
  const [featured, setFeatured] = useState(currentFeatured);
  const [isPending, startTransition] = useTransition();

  const parentCategories = useMemo(
    () =>
      MAIN_CATEGORY_SLUGS
        .map((slug) =>
          fields.find(
            (item) => item.slug === slug && item.parentId === null
          )
        )
        .filter((item): item is Field => Boolean(item)),
    [fields]
  );

  const selectedParent = parentCategories.find(
    (item) => item.slug === parentCategory
  );

  const childFields = useMemo(() => {
    if (!selectedParent) return [];

    return fields
      .filter((item) => item.parentId === selectedParent.id)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [fields, selectedParent]);

  // Restore the category dropdown when a field is already in the URL.
  useEffect(() => {
    if (!currentField) {
      setParentCategory("");
      return;
    }

    const selectedField = fields.find(
      (item) => item.id === currentField
    );

    if (!selectedField) {
      setParentCategory("");
      return;
    }

    const parent = selectedField.parentId
      ? fields.find((item) => item.id === selectedField.parentId)
      : selectedField;

    setParentCategory(
      parent && MAIN_CATEGORY_SLUGS.includes(parent.slug)
        ? parent.slug
        : ""
    );
  }, [currentField, fields]);

  useEffect(() => setField(currentField), [currentField]);
  useEffect(() => setStatus(currentStatus), [currentStatus]);
  useEffect(() => setAccess(currentAccess), [currentAccess]);
  useEffect(() => setFeatured(currentFeatured), [currentFeatured]);

  const activeFilterCount = [
    currentField,
    currentStatus,
    currentAccess,
    currentFeatured,
  ].filter(Boolean).length;

  function handleParentChange(value: string) {
    setParentCategory(value);

    const parent = parentCategories.find(
      (item) => item.slug === value
    );

    // The parent itself becomes the selected database field.
    setField(parent?.id ?? "");
  }

  function applyFilters() {
    const params = new URLSearchParams(queryString);

    if (field) params.set("field", field);
    else params.delete("field");

    if (status) params.set("status", status);
    else params.delete("status");

    if (access) params.set("access", access);
    else params.delete("access");

    if (featured) params.set("featured", featured);
    else params.delete("featured");

    params.delete("page");

    const query = params.toString();

    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  }

  function clearFilters() {
    setParentCategory("");
    setField("");
    setStatus("");
    setAccess("");
    setFeatured("");

    const params = new URLSearchParams(queryString);

    params.delete("field");
    params.delete("status");
    params.delete("access");
    params.delete("featured");
    params.delete("page");

    const query = params.toString();

    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  }

  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111113] shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
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
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01.02 1.06l-4.25-4.51a.75.75 0 01.02-1.06z"
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
              {activeFilterCount} active
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
            <div>
              <label
                htmlFor="parent-category"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Parent Category
              </label>

              <select
                id="parent-category"
                value={parentCategory}
                onChange={(event) => handleParentChange(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[var(--cyber-blue)] focus:ring-1 focus:ring-[var(--cyber-blue)]"
              >
                <option value="">All Categories</option>

                {parentCategories.map((parent) => (
                  <option key={parent.id} value={parent.slug}>
                    {parent.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="field"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Field
              </label>

              <select
                id="field"
                value={field}
                onChange={(event) => setField(event.target.value)}
                disabled={!parentCategory}
                className="w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[var(--cyber-blue)] focus:ring-1 focus:ring-[var(--cyber-blue)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <option value={selectedParent?.id ?? ""}>
                  {parentCategory ? "All Fields" : "Select Category First"}
                </option>

                {childFields.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
            </div>

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
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[var(--cyber-blue)] focus:ring-1 focus:ring-[var(--cyber-blue)]"
              >
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

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
                onChange={(event) => setAccess(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[var(--cyber-blue)] focus:ring-1 focus:ring-[var(--cyber-blue)]"
              >
                <option value="">All Access</option>
                <option value="FREE">Free</option>
                <option value="PAID">Paid</option>
              </select>
            </div>

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
                onChange={(event) => setFeatured(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[var(--cyber-blue)] focus:ring-1 focus:ring-[var(--cyber-blue)]"
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
