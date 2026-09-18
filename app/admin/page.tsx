import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
  redirect("/login");
}

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    archivedBlogs,
    totalFields,
    totalViews,
    totalShares,
    featuredBlogs,
    recentBlogs,
  ] = await Promise.all([
    prisma.blog.count(),
    prisma.blog.count({ where: { status: "PUBLISHED" } }),
    prisma.blog.count({ where: { status: "DRAFT" } }),
    prisma.blog.count({ where: { status: "ARCHIVED" } }),
    prisma.field.count(),
    prisma.blogViewEvent.count(),
    prisma.shareEvent.count(),
    prisma.blog.count({ where: { featured: true } }),
    prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        access: true,
        featured: true,
        createdAt: true,
        _count: {
          select: {
            viewEvents: true,
            shareEvents: true,
          },
        },
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-8 sm:px-6 sm:py-12 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* =================================================
            HEADER
        ================================================= */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                CyberIncidents Workspace
              </p>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Overview and management of your cybersecurity publications.
            </p>
          </div>

          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-cyan-500/25"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Create New Blog
          </Link>
        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-100">Overview</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            <StatCard label="Total Blogs" value={totalBlogs} icon={<DocumentIcon />} />
            <StatCard label="Published" value={publishedBlogs} icon={<CheckCircleIcon />} />
            <StatCard label="Drafts" value={draftBlogs} icon={<PencilIcon />} />
            <StatCard label="Archived" value={archivedBlogs} icon={<ArchiveIcon />} />
            <StatCard label="Category" value={totalFields} icon={<FolderIcon />} />
            <StatCard label="Views" value={totalViews} icon={<EyeIcon />} />
            <StatCard label="Shares" value={totalShares} icon={<ShareIcon />} />
            <StatCard label="Featured" value={featuredBlogs} icon={<StarIcon />} />
          </div>
        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-100">Quick Actions</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <AdminAction
              href="/admin/blogs"
              title="Manage Blogs"
              description="View, edit, publish and delete articles."
              icon={<ListIcon />}
            />
            <AdminAction
              href="/admin/blogs/new"
              title="Compose Article"
              description="Write and publish a new cybersecurity article."
              icon={<PenToolIcon />}
            />
            <AdminAction
              href="/"
              title="View Public Site"
              description="Open the public CyberIncidents website."
              icon={<GlobeIcon />}
            />
          </div>
        </section>

        {/* =================================================
            RECENT BLOG PERFORMANCE
        ================================================= */}
        <section>
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">Recent Publications</h2>
              <p className="mt-1 text-sm text-zinc-400">Latest articles and their engagement metrics.</p>
            </div>
            <Link
              href="/admin/blogs"
              className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300 hover:underline underline-offset-4"
            >
              View all →
            </Link>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#111113] shadow-sm">
            {recentBlogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <DocumentIcon className="h-10 w-10 text-zinc-600 mb-3" />
                <p className="text-sm font-medium text-zinc-300">No blogs published yet</p>
                <p className="text-xs text-zinc-500 mt-1">Get started by creating your first article.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="group flex flex-col gap-4 p-5 transition-colors hover:bg-white/[0.02] lg:flex-row lg:items-center lg:justify-between"
                  >
                    {/* Blog Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link href={`/admin/blogs/${blog.id}/edit`} className="truncate text-base font-medium text-zinc-100 transition hover:text-cyan-400">
                          {blog.title}
                        </Link>
                        {blog.featured && (
                          <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-yellow-500">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex items-center gap-3 text-xs text-zinc-500">
                        <span className="truncate">/{blog.slug}</span>
                        <span>•</span>
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                    </div>

                    {/* Metrics & Actions */}
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                      <div className="flex gap-4">
                        <MetricBadge label="Views" value={blog._count.viewEvents} />
                        <MetricBadge label="Shares" value={blog._count.shareEvents} />
                      </div>

                      <div className="hidden h-8 w-px bg-white/10 sm:block" />

                      <div className="flex items-center gap-3">
                        <StatusBadge status={blog.status} />
                        <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                          {blog.access}
                        </span>
                      </div>

                      <Link
                        href={`/admin/blogs/${blog.id}/edit`}
                        className="ml-auto rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white sm:ml-0"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

/* =====================================================
   COMPONENTS & ICONS
===================================================== */

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#111113] p-5 shadow-sm transition hover:border-white/20">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-cyan-400">
          {icon}
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">{label}</p>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-100">{value.toLocaleString()}</p>
    </div>
  );
}

function MetricBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col text-left">
      <span className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
      <span className="text-sm font-semibold text-zinc-200">{value.toLocaleString()}</span>
    </div>
  );
}

function AdminAction({ href, title, description, icon }: { href: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#111113] p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-[#151518] hover:shadow-lg hover:shadow-cyan-500/5"
    >
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition-colors group-hover:bg-cyan-500/20 group-hover:text-cyan-300">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-zinc-400">{description}</p>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isPublished = status === "PUBLISHED";
  const isDraft = status === "DRAFT";
  
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide ${
        isPublished
          ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
          : isDraft
          ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
          : "border-white/10 bg-white/5 text-zinc-400"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isPublished ? "bg-cyan-400" : isDraft ? "bg-amber-400" : "bg-zinc-500"}`} />
      {status}
    </span>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

/* --- SVG Icons --- */
function DocumentIcon({ className = "h-4 w-4" }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
}
function CheckCircleIcon({ className = "h-4 w-4" }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function PencilIcon({ className = "h-4 w-4" }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;
}
function ArchiveIcon({ className = "h-4 w-4" }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;
}
function FolderIcon({ className = "h-4 w-4" }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>;
}
function EyeIcon({ className = "h-4 w-4" }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}
function ShareIcon({ className = "h-4 w-4" }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>;
}
function StarIcon({ className = "h-4 w-4" }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.148.621-.531 1.114-1.059.777l-4.69-2.99a.563.563 0 00-.584 0l-4.69 2.99c-.528.337-1.207-.156-1.059-.777l1.284-5.385a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 00-.182-.557l-4.204-3.602c-.38-.324-.178-.948.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>;
}
function ListIcon({ className = "h-5 w-5" }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
}
function PenToolIcon({ className = "h-5 w-5" }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
}
function GlobeIcon({ className = "h-5 w-5" }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>;
}