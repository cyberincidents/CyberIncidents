
"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteBlogButton from "@/components/admin/DeleteBlogButton";

type Blog = {
  id: string;
  title: string;
  slug: string;
  featured: boolean;
  access: "FREE" | "PAID";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  fields: {
    field: {
      name: string;
    };
  }[];
  _count: {
    viewEvents: number;
    shareEvents: number;
  };
};

type Props = {
  blogs: Blog[];
};

const ITEMS_PER_PAGE = 10;

export default function BlogTablePagination({ blogs }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalBlogs = blogs.length;
  const totalPages = Math.ceil(totalBlogs / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));

  const paginatedBlogs = blogs.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const startItem =
    totalBlogs === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(safePage * ITEMS_PER_PAGE, totalBlogs);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111113] shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="border-b border-white/10 bg-[#0a0a0c]">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Blog
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Category
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Access
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Views
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Shares
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {paginatedBlogs.map((blog) => {
              const primaryField = blog.fields[0]?.field;

              return (
                <tr
                  key={blog.id}
                  className="transition-colors hover:bg-white/[0.02]"
                >
                  <td className="max-w-[360px] px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/blogs/${blog.id}/edit`}
                          className="font-medium text-zinc-100 transition hover:text-[var(--cyber-blue)]"
                        >
                          {blog.title}
                        </Link>

                        {blog.featured && (
                          <span className="rounded-full border border-[var(--cyber-blue)]/30 bg-[var(--cyber-blue)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--cyber-blue)]">
                            Featured
                          </span>
                        )}
                      </div>

                      <p className="mt-1 truncate text-xs text-zinc-500">
                        /{blog.slug}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {primaryField ? (
                      <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-300">
                        {primaryField.name}
                      </span>
                    ) : (
                      <span className="text-xs italic text-zinc-500">
                        No field
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        blog.access === "PAID"
                          ? "border border-[var(--cyber-blue)]/20 bg-[var(--cyber-blue)]/10 text-[var(--cyber-cyan)]"
                          : "border border-white/10 text-zinc-400"
                      }`}
                    >
                      {blog.access === "PAID" ? "Paid" : "Free"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-zinc-300">
                    {blog._count.viewEvents.toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-zinc-300">
                    {blog._count.shareEvents.toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                        blog.status === "PUBLISHED"
                          ? "border-[var(--cyber-blue)]/20 bg-[var(--cyber-blue)]/10 text-[var(--cyber-blue)]"
                          : blog.status === "ARCHIVED"
                            ? "border-white/5 bg-white/5 text-zinc-500"
                            : "border-white/10 bg-transparent text-zinc-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          blog.status === "PUBLISHED"
                            ? "bg-[var(--cyber-blue)]"
                            : blog.status === "ARCHIVED"
                              ? "bg-zinc-600"
                              : "bg-zinc-400"
                        }`}
                      />

                      {blog.status === "PUBLISHED"
                        ? "Published"
                        : blog.status === "ARCHIVED"
                          ? "Archived"
                          : "Draft"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/blogs/${blog.id}/edit`}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
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

      {totalBlogs === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-500">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="h-5 w-5"
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
          </div>

          <h3 className="text-sm font-semibold text-zinc-200">
            No blogs found
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            Try adjusting your search or filters to find what you&apos;re
            looking for.
          </p>

          <Link
            href="/admin/blogs"
            className="mt-6 inline-block text-sm font-medium text-[var(--cyber-blue)] underline-offset-4 transition hover:text-[var(--cyber-cyan)] hover:underline"
          >
            Clear all filters
          </Link>
        </div>
      )}

      {/* Results summary and pagination */}
      {totalBlogs > 0 && (
        <div className="flex flex-col gap-4 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="text-sm text-zinc-500">
            <p>
              Showing {startItem}–{endItem} of {totalBlogs} blogs
            </p>
            {totalPages > 1 && (
              <p className="mt-1">
                Page {safePage} of {totalPages}
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Blog table pagination"
              className="flex flex-wrap items-center gap-2"
            >
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => goToPage(safePage - 1)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  aria-current={page === safePage ? "page" : undefined}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm transition ${
                    page === safePage
                      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                      : "border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => goToPage(safePage + 1)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      )}
    </section>
  );
}
