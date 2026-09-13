import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
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
    /* Total blogs */
    prisma.blog.count(),

    /* Published blogs */
    prisma.blog.count({
      where: {
        status: "PUBLISHED",
      },
    }),

    /* Draft blogs */
    prisma.blog.count({
      where: {
        status: "DRAFT",
      },
    }),

    /* Archived blogs */
    prisma.blog.count({
      where: {
        status: "ARCHIVED",
      },
    }),

    /* Total fields */
    prisma.field.count(),

    /* Total views */
    prisma.blogViewEvent.count(),

    /* Total shares */
    prisma.shareEvent.count(),

    /* Featured blogs */
    prisma.blog.count({
      where: {
        featured: true,
      },
    }),

    /* Recent blogs */
    prisma.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
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
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              CyberIncidents
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your cybersecurity publication.
            </p>
          </div>

          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center justify-center rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            + Create Blog
          </Link>
        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="mt-10">
          <h2 className="text-xl font-semibold">
            Overview
          </h2>

          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">

            <StatCard
              label="Total Blogs"
              value={totalBlogs}
            />

            <StatCard
              label="Published"
              value={publishedBlogs}
            />

            <StatCard
              label="Drafts"
              value={draftBlogs}
            />

            <StatCard
              label="Archived"
              value={archivedBlogs}
            />

            <StatCard
              label="Fields"
              value={totalFields}
            />

            <StatCard
              label="Views"
              value={totalViews}
            />

            <StatCard
              label="Shares"
              value={totalShares}
            />

            <StatCard
              label="Featured"
              value={featuredBlogs}
            />

          </div>
        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="mt-10">
          <h2 className="text-xl font-semibold">
            Quick Actions
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">

            <AdminAction
              href="/admin/blogs"
              title="Manage Blogs"
              description="View, edit, publish and delete articles."
            />

            <AdminAction
              href="/admin/blogs/new"
              title="Create Blog"
              description="Write and publish a new cybersecurity article."
            />

            <AdminAction
              href="/"
              title="View Website"
              description="Open the public CyberIncidents website."
            />

          </div>
        </section>

        {/* =================================================
            RECENT BLOG PERFORMANCE
        ================================================= */}

        <section className="mt-10">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Recent Blog Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest articles and their engagement.
              </p>
            </div>

            <Link
              href="/admin/blogs"
              className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
            >
              View all →
            </Link>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

            {recentBlogs.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No blogs have been created yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-800">

                {recentBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between"
                  >

                    {/* Blog information */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="truncate font-semibold text-white">
                          {blog.title}
                        </h3>

                        {blog.featured && (
                          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-yellow-400">
                            Featured
                          </span>
                        )}

                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        /{blog.slug}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Created{" "}
                        {formatDate(blog.createdAt)}
                      </p>

                    </div>

                    {/* Performance */}

                    <div className="flex flex-wrap items-center gap-3">

                      {/* Views */}

                      <MetricBadge
                        label="Views"
                        value={blog._count.viewEvents}
                      />

                      {/* Shares */}

                      <MetricBadge
                        label="Shares"
                        value={blog._count.shareEvents}
                      />

                      {/* Status */}

                      <StatusBadge
                        status={blog.status}
                      />

                      {/* Access */}

                      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                        {blog.access}
                      </span>

                      {/* Edit */}

                      <Link
                        href={`/admin/blogs/${blog.id}/edit`}
                        className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
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
   STAT CARD
===================================================== */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">
      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

/* =====================================================
   METRIC BADGE
===================================================== */

function MetricBadge({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-semibold text-slate-200">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

/* =====================================================
   ADMIN ACTION
===================================================== */

function AdminAction({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-500/50 hover:bg-slate-900/80"
    >
      <h3 className="font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </Link>
  );
}

/* =====================================================
   STATUS BADGE
===================================================== */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles = {
    PUBLISHED:
      "border-emerald-900 bg-emerald-950/40 text-emerald-400",

    DRAFT:
      "border-amber-900 bg-amber-950/40 text-amber-400",

    ARCHIVED:
      "border-slate-700 bg-slate-800 text-slate-400",
  };

  const style =
    styles[status as keyof typeof styles] ??
    "border-slate-700 bg-slate-800 text-slate-400";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs ${style}`}
    >
      {status}
    </span>
  );
}

/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}