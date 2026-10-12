
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminBlogs } from "@/lib/data/db-blogs";
import { getFields } from "@/lib/data/db-fields";

import BlogSearch from "@/components/admin/BlogSearch";
import BlogFilters from "@/components/admin/BlogFilters";
import BlogTablePagination from "@/components/admin/BlogTablePagination";

type SearchParams = {
  search?: string;
  field?: string;
  status?: string;
  access?: string;
  featured?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function AdminBlogsPage({ searchParams }: Props) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const params = await searchParams;

  const search =
    typeof params.search === "string" ? params.search : "";
  const fieldId =
    typeof params.field === "string" ? params.field : "";

  const status = ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(
    params.status || ""
  )
    ? (params.status as "DRAFT" | "PUBLISHED" | "ARCHIVED")
    : undefined;

  const access = ["FREE", "PAID"].includes(params.access || "")
    ? (params.access as "FREE" | "PAID")
    : undefined;

  const featured =
    params.featured === "true"
      ? true
      : params.featured === "false"
        ? false
        : undefined;

  const [blogs, fields] = await Promise.all([
    getAdminBlogs({
      search,
      fieldId: fieldId || undefined,
      status,
      access,
      featured,
    }),
    getFields(),
  ]);

  const activeFilterCount = [
    fieldId,
    status,
    access,
    params.featured,
  ].filter(Boolean).length;

  // Changing search or filters creates a fresh table with page 1 selected.
  const tableKey = [
    search,
    fieldId,
    status ?? "",
    access ?? "",
    params.featured ?? "",
  ].join("|");

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Control Panel
              </p>
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Manage Blogs
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              View, edit, and organize your cybersecurity publications.
            </p>
          </div>

          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-cyan-500/25"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Create New Blog
          </Link>
        </div>

        {/* Search and filters */}
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <BlogSearch />
          </div>

          <div className="md:col-span-7">
            <BlogFilters fields={fields} />
          </div>
        </div>

        {/* Results summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <p className="text-sm text-zinc-400">
            <span className="font-semibold text-zinc-100">
              {blogs.length}
            </span>{" "}
            {blogs.length === 1 ? "blog" : "blogs"} found
          </p>

          {activeFilterCount > 0 && (
            <p className="text-xs font-medium text-zinc-500">
              {activeFilterCount} active{" "}
              {activeFilterCount === 1 ? "filter" : "filters"}
            </p>
          )}
        </div>

        {/* Client-side pagination: page changes do not navigate */}
        <BlogTablePagination key={tableKey} blogs={blogs} />
      </main>
    </div>
  );
}
