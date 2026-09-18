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

export default function BlogFilters({
  fields,
}: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // =========================================================
  // CURRENT URL FILTERS
  // =========================================================

  const currentField =
    searchParams.get("field") ?? "";

  const currentStatus =
    searchParams.get("status") ?? "";

  const currentAccess =
    searchParams.get("access") ?? "";

  const currentFeatured =
    searchParams.get("featured") ?? "";

  // =========================================================
  // LOCAL FILTER STATE
  // =========================================================

  const [isOpen, setIsOpen] =
    useState(false);

  const [parentCategory, setParentCategory] =
    useState("");

  const [field, setField] =
    useState(currentField);

  const [status, setStatus] =
    useState(currentStatus);

  const [access, setAccess] =
    useState(currentAccess);

  const [featured, setFeatured] =
    useState(currentFeatured);

  const [isPending, startTransition] =
    useTransition();

  // =========================================================
  // MAIN PARENT CATEGORIES
  // =========================================================

  const parentCategories = useMemo(() => {
    return MAIN_CATEGORY_SLUGS
      .map((slug) =>
        fields.find(
          (item) =>
            item.slug === slug &&
            item.parentId === null
        )
      )
      .filter(
        (item): item is Field =>
          Boolean(item)
      );
  }, [fields]);

  // =========================================================
  // CHILD FIELDS
  //
  // These are the fields belonging to the selected
  // parent category.
  // =========================================================

  const childFields = useMemo(() => {
    if (!parentCategory) {
      return [];
    }

    const parent = parentCategories.find(
      (item) =>
        item.slug === parentCategory
    );

    if (!parent) {
      return [];
    }

    return fields
      .filter(
        (item) =>
          item.parentId === parent.id
      )
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  }, [
    fields,
    parentCategory,
    parentCategories,
  ]);

  // =========================================================
  // FIND PARENT OF CURRENTLY SELECTED FIELD
  //
  // This is useful when the page is opened with:
  //
  // ?field=some-child-id
  //
  // The parent dropdown will automatically show the
  // correct parent category.
  // =========================================================

  useEffect(() => {
    if (!currentField) {
      setParentCategory("");
      return;
    }

    const selectedField = fields.find(
      (item) =>
        item.id === currentField
    );

    if (!selectedField) {
      setParentCategory("");
      return;
    }

    // If this field has a parent,
    // select that parent.

    if (selectedField.parentId) {
      const parent = fields.find(
        (item) =>
          item.id ===
          selectedField.parentId
      );

      if (
        parent &&
        MAIN_CATEGORY_SLUGS.includes(
          parent.slug
        )
      ) {
        setParentCategory(
          parent.slug
        );
      }
    }
  }, [currentField, fields]);

  // =========================================================
  // KEEP LOCAL STATE IN SYNC WITH URL
  // =========================================================

  useEffect(() => {
    setField(currentField);
  }, [currentField]);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  useEffect(() => {
    setAccess(currentAccess);
  }, [currentAccess]);

  useEffect(() => {
    setFeatured(currentFeatured);
  }, [currentFeatured]);

  // =========================================================
  // ACTIVE FILTER COUNT
  // =========================================================

  const activeFilterCount = [
    currentField,
    currentStatus,
    currentAccess,
    currentFeatured,
  ].filter(Boolean).length;

  // =========================================================
  // PARENT CATEGORY CHANGE
  // =========================================================

  function handleParentChange(
    value: string
  ) {
    setParentCategory(value);

    // A field from the previous parent
    // should not remain selected.

    setField("");
  }

  // =========================================================
  // APPLY FILTERS
  // =========================================================

  function applyFilters() {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    // -------------------------------------------------------
    // FIELD
    // -------------------------------------------------------

    if (field) {
      params.set("field", field);
    } else {
      params.delete("field");
    }

    // -------------------------------------------------------
    // STATUS
    // -------------------------------------------------------

    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    // -------------------------------------------------------
    // ACCESS
    // -------------------------------------------------------

    if (access) {
      params.set("access", access);
    } else {
      params.delete("access");
    }

    // -------------------------------------------------------
    // FEATURED
    // -------------------------------------------------------

    if (featured) {
      params.set("featured", featured);
    } else {
      params.delete("featured");
    }

    // Changing filters should always return
    // to page 1.

    params.delete("page");

    startTransition(() => {
      const query = params.toString();

      router.replace(
        query
          ? `${pathname}?${query}`
          : pathname,
        {
          scroll: false,
        }
      );
    });
  }

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  function clearFilters() {
    setParentCategory("");
    setField("");
    setStatus("");
    setAccess("");
    setFeatured("");

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    params.delete("field");
    params.delete("status");
    params.delete("access");
    params.delete("featured");
    params.delete("page");

    startTransition(() => {
      const query = params.toString();

      router.replace(
        query
          ? `${pathname}?${query}`
          : pathname,
        {
          scroll: false,
        }
      );
    });
  }

  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111113] shadow-sm">
      {/* =======================================================
          FILTER HEADER
      ======================================================= */}

      <button
        type="button"
        onClick={() =>
          setIsOpen((prev) => !prev)
        }
        className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-white/[0.02]"
        aria-expanded={isOpen}
      >
        {/* -----------------------------------------------------
            LEFT SIDE
        ----------------------------------------------------- */}

        <div className="flex items-center gap-3">
          {/* Arrow */}

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

        {/* -----------------------------------------------------
            RIGHT SIDE
        ----------------------------------------------------- */}

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

      {/* =======================================================
          FILTER PANEL
      ======================================================= */}

      {isOpen && (
        <div className="border-t border-white/10 bg-[#0a0a0c]/50 px-6 py-5">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {/* =================================================
                PARENT CATEGORY
            ================================================= */}

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
                onChange={(event) =>
                  handleParentChange(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[var(--cyber-blue)] focus:ring-1 focus:ring-[var(--cyber-blue)]"
              >
                <option value="">
                  All Categories
                </option>

                {parentCategories.map(
                  (parent) => (
                    <option
                      key={parent.id}
                      value={parent.slug}
                    >
                      {parent.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* =================================================
                FIELD
            ================================================= */}

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
                onChange={(event) =>
                  setField(
                    event.target.value
                  )
                }
                disabled={!parentCategory}
                className="w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[var(--cyber-blue)] focus:ring-1 focus:ring-[var(--cyber-blue)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <option value="">
                  {parentCategory
                    ? "All Fields"
                    : "Select Category First"}
                </option>

                {childFields.map(
                  (child) => (
                    <option
                      key={child.id}
                      value={child.id}
                    >
                      {child.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* =================================================
                STATUS
            ================================================= */}

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
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[var(--cyber-blue)] focus:ring-1 focus:ring-[var(--cyber-blue)]"
              >
                <option value="">
                  All Statuses
                </option>

                <option value="DRAFT">
                  Draft
                </option>

                <option value="PUBLISHED">
                  Published
                </option>

                <option value="ARCHIVED">
                  Archived
                </option>
              </select>
            </div>

            {/* =================================================
                ACCESS
            ================================================= */}

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
                onChange={(event) =>
                  setAccess(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[var(--cyber-blue)] focus:ring-1 focus:ring-[var(--cyber-blue)]"
              >
                <option value="">
                  All Access
                </option>

                <option value="FREE">
                  Free
                </option>

                <option value="PAID">
                  Paid
                </option>
              </select>
            </div>

            {/* =================================================
                FEATURED
            ================================================= */}

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
                onChange={(event) =>
                  setFeatured(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[var(--cyber-blue)] focus:ring-1 focus:ring-[var(--cyber-blue)]"
              >
                <option value="">
                  All Blogs
                </option>

                <option value="true">
                  Featured
                </option>

                <option value="false">
                  Not Featured
                </option>
              </select>
            </div>
          </div>

          {/* =====================================================
              ACTION BUTTONS
          ===================================================== */}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* Apply */}

            <button
              type="button"
              onClick={applyFilters}
              disabled={isPending}
              className="rounded-lg bg-gradient-to-r from-[var(--cyber-blue)] to-[var(--cyber-cyan)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending
                ? "Applying..."
                : "Apply Filters"}
            </button>

            {/* Clear */}

            <button
              type="button"
              onClick={clearFilters}
              disabled={
                isPending ||
                activeFilterCount === 0
              }
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