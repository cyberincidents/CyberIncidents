import { notFound, redirect } from "next/navigation";

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

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;

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
      orderBy: {
        number: "asc",
      },
    }),
  ]);

  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            CyberIncidents
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Edit Blog
          </h1>

          <p className="mt-2 text-slate-400">
            Update your cybersecurity article.
          </p>
        </div>

        <BlogEditForm
          blog={blog}
          fields={fields}
        />
      </div>
    </main>
  );
}