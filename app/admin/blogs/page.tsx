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

export default async function AdminBlogsPage({ searchParams }: Props) {
  const session = await auth();

  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const params = await searchParams;

  const search = typeof params.search === "string" ? params.search : "";
  const fieldId = typeof params.field === "string" ? params.field : "";
  
  // Explicitly cast the string to the expected Literal Union types to satisfy TypeScript
  const status = ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(params.status || "") 
    ? (params.status as "DRAFT" | "PUBLISHED" | "ARCHIVED") 
    : undefined;
    
  const access = ["FREE", "PAID"].includes(params.access || "") 
    ? (params.access as "FREE" | "PAID") 
    : undefined;
    
  const featured = params.featured === "true" ? true : params.featured === "false" ? false : undefined;

  const [blogs, fields] = await Promise.all([
    getAdminBlogs({ search, fieldId: fieldId || undefined, status, access, featured }),
    getFields(),
  ]);

  const activeFilterCount = [fieldId, status, access, params.featured].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      
      {/* =================================================
          MAIN CONTENT
      ================================================= */}
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
        
        {/* =================================================
            HEADER
        ================================================= */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
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
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Create New Blog
          </Link>
        </div>

        {/* Layout Grid for Search and Filters (Responsive) */}
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <BlogSearch />
          </div>
          <div className="md:col-span-7">
            <BlogFilters fields={fields} />
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-zinc-400">
            <span className="font-semibold text-zinc-100">{blogs.length}</span> {blogs.length === 1 ? "blog" : "blogs"} found
          </p>
          {activeFilterCount > 0 && (
            <p className="text-xs font-medium text-zinc-500">
              {activeFilterCount} active {activeFilterCount === 1 ? "filter" : "filters"}
            </p>
          )}
        </div>

        {/* Table Section */}
        <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111113] shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-[#0a0a0c] border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Blog</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Field</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Access</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Views</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Shares</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {blogs.map((blog) => {
                  const primaryField = blog.fields[0]?.field;
                  return (
                    <tr key={blog.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="max-w-[360px] px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/blogs/${blog.id}/edit`} className="font-medium text-zinc-100 transition hover:text-[var(--cyber-blue)]">
                              {blog.title}
                            </Link>
                            {blog.featured && (
                              <span className="rounded-full border border-[var(--cyber-blue)]/30 bg-[var(--cyber-blue)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--cyber-blue)]">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="mt-1 truncate text-xs text-zinc-500">/{blog.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {primaryField ? (
                          <span className="rounded-md bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-medium text-zinc-300">
                            {primaryField.name}
                          </span>
                        ) : (
                          <span className="text-xs italic text-zinc-500">No field</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${blog.access === "PAID" ? "bg-[var(--cyber-blue)]/10 border border-[var(--cyber-blue)]/20 text-[var(--cyber-cyan)]" : "border border-white/10 text-zinc-400"}`}>
                          {blog.access === "PAID" ? "Paid" : "Free"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">{blog._count.viewEvents.toLocaleString()}</td>
                      <td className="px-6 py-4 text-zinc-300">{blog._count.shareEvents.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${
                          blog.status === "PUBLISHED" ? "border-[var(--cyber-blue)]/20 bg-[var(--cyber-blue)]/10 text-[var(--cyber-blue)]"
                            : blog.status === "ARCHIVED" ? "border-white/5 bg-white/5 text-zinc-500"
                              : "border-white/10 bg-transparent text-zinc-400"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            blog.status === "PUBLISHED" ? "bg-[var(--cyber-blue)]"
                              : blog.status === "ARCHIVED" ? "bg-zinc-600" : "bg-zinc-400"
                          }`} />
                          {blog.status === "PUBLISHED" ? "Published" : blog.status === "ARCHIVED" ? "Archived" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <Link href={`/admin/blogs/${blog.id}/edit`} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white">
                            Edit
                          </Link>
                          <DeleteBlogButton blogId={blog.id} blogTitle={blog.title} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {blogs.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-500">
                <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
                  <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-zinc-200">No blogs found</h3>
              <p className="mt-1 text-sm text-zinc-500">Try adjusting your search or filters to find what you&apos;re looking for.</p>
              <Link href="/admin/blogs" className="mt-6 inline-block text-sm font-medium text-[var(--cyber-blue)] transition hover:text-[var(--cyber-cyan)] hover:underline underline-offset-4">
                Clear all filters
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}