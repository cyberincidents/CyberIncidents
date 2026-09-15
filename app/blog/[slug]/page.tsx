import Link from "next/link";
import { notFound } from "next/navigation";

import ArticleContent from "@/components/blog/ArticleContent";
import BlogViewTracker from "@/components/blog/BlogViewTracker";
import LatestBlogs from "@/components/blog/LatestBlogs";
import RelatedArticles from "@/components/blog/RelatedArticles";
import ShareButtons from "@/components/blog/ShareButtons";

export const dynamic = "force-dynamic";

import {
  getAllPublishedBlogSlugs,
  getBlogBySlug,
  getBlogsByField,
  getLatestBlogs,
} from "@/lib/data/db-blogs";

type BlogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getPrimaryImage(blog: {
  images: {
    url: string | null;
    altText: string | null;
    isPrimary: boolean;
    sortOrder: number;
  }[];
}) {
  return blog.images.find((image) => image.isPrimary) ?? blog.images[0];
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;

  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const blogField = blog.fields[0]?.field;

  const relatedBlogs = blogField
    ? await getBlogsByField(blogField.slug)
    : [];

  const filteredRelatedBlogs = relatedBlogs
    .filter((item) => item.id !== blog.id)
    .slice(0, 3);

  const latestBlogs = (await getLatestBlogs(4))
    .filter((item) => item.id !== blog.id)
    .slice(0, 3);

  const primaryImage = getPrimaryImage(blog);

  return (
    <main className="min-h-screen bg-white dark:bg-[#05070a] text-gray-900 dark:text-white transition-colors duration-300">
      <BlogViewTracker blogId={blog.id} />

      <section className="border-b border-gray-100 dark:border-white/10 bg-white dark:bg-[#05070a]">
        <div className="mx-auto max-w-3xl px-5 pb-14 pt-14 sm:px-8 sm:pt-20">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 dark:text-white/40">
            <Link href="/" className="transition-colors hover:text-[#00a8ff]">
              Home
            </Link>

            <span>/</span>

            {blogField && (
              <>
                <Link
                  href={`/field/${blogField.slug}`}
                  className="transition-colors hover:text-[#00a8ff]"
                >
                  {blogField.name}
                </Link>

                <span>/</span>
              </>
            )}

            <span className="text-gray-500 dark:text-white/60">Article</span>
          </div>

          <div className="mt-8">
            <span className="inline-flex rounded-full border border-[#00a8ff]/30 bg-[#00a8ff]/10 px-3.5 py-1.5 text-xs font-semibold text-[#00d9ff]">
              {blogField?.name ?? "Cyber Security"}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-gray-900 dark:text-white sm:text-5xl">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mt-6 text-base leading-8 text-gray-500 dark:text-white/60 sm:text-lg">
              {blog.excerpt}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-white/40">
            <span className="font-medium text-gray-600 dark:text-white/80">
              CyberIncidents Team
            </span>

            <span className="h-1 w-1 shrink-0 rounded-full bg-gray-300 dark:bg-white/20" />

            <span>{formatDate(blog.publishedAt)}</span>

            {blog.readTime && (
              <>
                <span className="h-1 w-1 shrink-0 rounded-full bg-gray-300 dark:bg-white/20" />

                <span>{blog.readTime} min read</span>
              </>
            )}
          </div>
        </div>
      </section>

      {primaryImage?.url && (
        <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-12">
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
            <img
              src={primaryImage.url}
              alt={primaryImage.altText ?? blog.title}
              className="h-auto max-h-[600px] w-full object-cover"
            />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <ArticleContent content={blog.content} />

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#090d14] px-5 py-5">
          <div className="text-sm text-gray-500 dark:text-white/70">
            Filed under{" "}
            {blogField ? (
              <Link
                href={`/field/${blogField.slug}`}
                className="font-semibold text-gray-800 dark:text-[#00d9ff] transition hover:text-[#00a8ff]"
              >
                {blogField.name}
              </Link>
            ) : (
              <span className="font-semibold text-gray-800 dark:text-[#00d9ff]">
                Cyber Security
              </span>
            )}
          </div>

          <ShareButtons
            blogId={blog.id}
            title={blog.title}
            slug={blog.slug}
          />
        </div>
      </section>

      <RelatedArticles blogs={filteredRelatedBlogs} />

      <LatestBlogs blogs={latestBlogs} />
    </main>
  );
}

export async function generateStaticParams() {
  const blogs = await getAllPublishedBlogSlugs();

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}