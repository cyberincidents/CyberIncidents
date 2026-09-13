import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/admin/BlogForm";

export default async function NewBlogPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const fields = await prisma.field.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      number: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Admin
          </p>

          <h1 className="text-3xl font-bold">
            Create Blog
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create and publish a new cybersecurity article.
          </p>
        </div>

        <BlogForm fields={fields} />
      </div>
    </main>
  );
}