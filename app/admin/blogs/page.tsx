import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminBlogs } from "@/lib/data/db-blogs";
import { getFields } from "@/lib/data/db-fields";

import DeleteBlogButton from "@/components/admin/DeleteBlogButton";
import BlogSearch from "@/components/admin/BlogSearch";
import BlogFilters from "@/components/admin/BlogFilters";

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

export default async function AdminBlogsPage({
  searchParams,
}: Props) {
  /* =====================================================
     AUTHENTICATION
  ===================================================== */

  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  /* =====================================================
     SEARCH PARAMS
  ===================================================== */

  const params = await searchParams;

  const search =
    typeof params.search === "string"
      ? params.search
      : "";

  const fieldId =
    typeof params.field === "string"
      ? params.field
      : "";

  const status =
    params.status === "DRAFT" ||
    params.status === "PUBLISHED" ||
    params.status === "ARCHIVED"
      ? params.status
      : undefined;

  const access =
    params.access === "FREE" ||
    params.access === "PAID"
      ? params.access
      : undefined;

  const featured =
    params.featured === "true"
      ? true
      : params.featured === "false"
        ? false
        : undefined;

  /* =====================================================
     DATABASE
  ===================================================== */

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

  /* =====================================================
     ACTIVE FILTER COUNT
     Search is intentionally NOT included here.
  ===================================================== */

  const activeFilterCount = [
    fieldId,
    status,
    access,
    params.featured,
  ].filter(Boolean).length;

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="space-y-8">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Blogs
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage your cybersecurity articles.
          </p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center justify-center rounded-lg bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          + New Blog
        </Link>
      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <BlogSearch />

      {/* =================================================
          FILTERS
      ================================================= */}

      <BlogFilters fields={fields} />

      {/* =================================================
          RESULTS SUMMARY
      ================================================= */}

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {blogs.length}{" "}
          {blogs.length === 1 ? "blog" : "blogs"}{" "}
          found
        </p>

        {activeFilterCount > 0 && (
          <p className="text-xs text-slate-500">
            {activeFilterCount} active{" "}
            {activeFilterCount === 1
              ? "filter"
              : "filters"}
          </p>
        )}
      </div>

      {/* =================================================
          BLOG TABLE
      ================================================= */}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Blog
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Field
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Access
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Views
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Shares
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {blogs.map((blog) => {
                const primaryField =
                  blog.fields[0]?.field;

                return (
                  <tr
                    key={blog.id}
                    className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/40"
                  >
                    {/* Blog */}

                    <td className="max-w-[360px] px-5 py-5">
                      <div className="flex items-start gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/admin/blogs/${blog.id}/edit`}
                              className="font-medium text-white transition hover:text-cyan-400"
                            >
                              {blog.title}
                            </Link>

                            {blog.featured && (
                              <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-yellow-400">
                                Featured
                              </span>
                            )}
                          </div>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            /{blog.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Field */}

                    <td className="px-5 py-5">
                      {primaryField ? (
                        <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300">
                          {primaryField.name}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600">
                          No field
                        </span>
                      )}
                    </td>

                    {/* Access */}

                    <td className="px-5 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          blog.access === "PAID"
                            ? "bg-purple-500/10 text-purple-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {blog.access === "PAID"
                          ? "Paid"
                          : "Free"}
                      </span>
                    </td>

                    {/* Views */}

                    <td className="px-5 py-5 text-sm text-slate-300">
                      {blog._count.viewEvents.toLocaleString()}
                    </td>

                    {/* Shares */}

                    <td className="px-5 py-5 text-sm text-slate-300">
                      {blog._count.shareEvents.toLocaleString()}
                    </td>

                    {/* Status */}

                    <td className="px-5 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          blog.status === "PUBLISHED"
                            ? "bg-cyan-500/10 text-cyan-400"
                            : blog.status === "ARCHIVED"
                              ? "bg-slate-700 text-slate-400"
                              : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {blog.status === "PUBLISHED"
                          ? "Published"
                          : blog.status === "ARCHIVED"
                            ? "Archived"
                            : "Draft"}
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="px-5 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blogs/${blog.id}/edit`}
                          className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
                        >
                          Edit
                        </Link>

                        <DeleteBlogButton
                          blogId={blog.id}
                          blogTitle={blog.title}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {blogs.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-xl">
              🔎
            </div>

            <h3 className="text-lg font-semibold text-white">
              No blogs found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

            <Link
              href="/admin/blogs"
              className="mt-5 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              Clear all filters
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}