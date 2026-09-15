import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BlogEditForm from "@/components/admin/BlogEditForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBlogPage({
  params,
}: Props) {
  const session = await auth();

  /* =====================================================
     AUTHENTICATION
  ===================================================== */

  if (!session?.user) {
    redirect("/admin/login");
  }

  /* =====================================================
     ADMIN CHECK
  ===================================================== */

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  /* =====================================================
     PARAMS
  ===================================================== */

  const { id } = await params;

  /* =====================================================
     LOAD BLOG + FIELDS
  ===================================================== */

  const [blog, fields] = await Promise.all([
    prisma.blog.findUnique({
      where: {
        id,
      },

      include: {
        fields: {
          include: {
            field: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    }),

    prisma.field.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        number: true,
        parentId: true,
      },

      orderBy: [
        {
          parentId: "asc",
        },
        {
          number: "asc",
        },
        {
          name: "asc",
        },
      ],
    }),
  ]);

  /* =====================================================
     BLOG NOT FOUND
  ===================================================== */

  if (!blog) {
    notFound();
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link
            href="/admin"
            className="transition-colors hover:text-cyan-400"
          >
            Dashboard
          </Link>

          <span>/</span>

          <Link
            href="/admin/blogs"
            className="transition-colors hover:text-cyan-400"
          >
            Blogs
          </Link>

          <span>/</span>

          <span className="text-slate-300">
            Edit
          </span>
        </div>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mt-6 flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              CyberIncidents // Admin
            </p>

            <h1 className="mt-3 truncate text-3xl font-bold tracking-tight sm:text-4xl">
              {blog.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-slate-400">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                  blog.publishedAt
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                    : "border-amber-400/30 bg-amber-400/10 text-amber-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    blog.publishedAt
                      ? "bg-emerald-400"
                      : "bg-amber-400"
                  }`}
                />

                {blog.publishedAt
                  ? "Published"
                  : "Draft"}
              </span>

              <span className="text-slate-600">
                •
              </span>

              <span>
                Last updated{" "}
                {new Date(
                  blog.updatedAt
                ).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
          </div>

          {/* =================================================
              VIEW LIVE
          ================================================= */}

          <Link
            href={`/blog/${blog.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-400"
          >
            View Live
            <span>↗</span>
          </Link>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <div className="mt-10">
          <BlogEditForm
            blog={blog}
            fields={fields}
          />
        </div>
      </div>
    </main>
  );
}