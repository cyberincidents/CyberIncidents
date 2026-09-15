import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import BlogCard from "@/components/blog/BlogCard";
import {
  getBlogsByField,
  getFieldBySlug,
  getLatestBlogs,
} from "@/lib/data/db-blogs";
import { getFields, getFieldSlugs } from "@/lib/data/db-fields";
import LatestBlogs from "@/components/blog/LatestBlogs";

export const dynamic = "force-dynamic";

type FieldPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function FieldPage({ params }: FieldPageProps) {
  const { slug } = await params;

  const field = await getFieldBySlug(slug);

  if (!field) {
    notFound();
  }

  const blogs = await getBlogsByField(slug);
  const fields = await getFields();

  const featuredBlog = blogs.find((blog) => blog.featured);
  const regularBlogs = blogs.filter((blog) => blog.id !== featuredBlog?.id);
  const latestBlogs = await getLatestBlogs(3);

  const currentIndex = fields.findIndex((item) => item.slug === slug);
  const otherFields = fields.filter((item) => item.slug !== slug);

  const getPrimaryImage = (blog: (typeof blogs)[number]) => {
    return blog.images.find((image) => image.isPrimary) ?? blog.images[0];
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#05070a] text-gray-900 dark:text-white transition-colors duration-300">
      {/* FIELD HEADER */}
      <section className="border-b border-gray-100 dark:border-white/10 bg-white dark:bg-[#05070a]">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24 lg:pt-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-white/40">
            <Link href="/" className="transition-colors hover:text-[#00a8ff]">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-600 dark:text-white/70">{field.name}</span>
          </div>

          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                {currentIndex >= 0 && (
                  <span className="font-mono text-xs font-semibold tracking-widest text-[#00a8ff]">
                    {String(currentIndex + 1).padStart(2, "0")}
                  </span>
                )}
                <span className="h-px w-8 bg-[#00a8ff]" />
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#00a8ff]">
                  Cybersecurity Field
                </p>
              </div>

              <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                {field.name}
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-gray-500 dark:text-white/60 sm:text-base sm:leading-8">
                {field.description}
              </p>
            </div>

            {/* Meta stats */}
            <div className="flex shrink-0 gap-8 border-t border-gray-100 dark:border-white/10 pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
              <div>
                <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                  {blogs.length}
                </span>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">
                  Articles
                </span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                  {fields.length}
                </span>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">
                  Total Fields
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      {featuredBlog && (
        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-8 bg-[#00a8ff]" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-white/40">
              Featured
            </p>
          </div>

          <article className="group grid overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#090d14] shadow-lg lg:grid-cols-2">
            {/* Image */}
            <Link
              href={`/blog/${featuredBlog.slug}`}
              className="relative block aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-white/5 lg:aspect-auto lg:min-h-[460px]"
            >
              {(() => {
                const image = getPrimaryImage(featuredBlog);
                return image?.url ? (
                  <Image
                    src={image.url}
                    alt={image.altText ?? featuredBlog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 dark:bg-white/5" />
                );
              })()}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <span className="absolute left-6 top-6 rounded-full bg-black/80 border border-[#00a8ff]/30 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#00d9ff] backdrop-blur">
                {field.name}
              </span>
            </Link>

            {/* Content */}
            <div className="flex flex-col justify-center p-8 sm:p-11 lg:p-14">
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-white/40">
                <span>
                  {featuredBlog.publishedAt
                    ? new Date(featuredBlog.publishedAt).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )
                    : "Unpublished"}
                </span>
                <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-white/20" />
                <span>
                  {featuredBlog.readTime
                    ? `${featuredBlog.readTime} min read`
                    : "Read article"}
                </span>
              </div>

              <Link href={`/blog/${featuredBlog.slug}`}>
                <h2 className="mt-6 text-3xl font-bold leading-[1.15] tracking-tight text-gray-900 dark:text-white transition-colors group-hover:text-[#00d9ff] sm:text-4xl">
                  {featuredBlog.title}
                </h2>
              </Link>

              <p className="mt-6 border-l-2 border-gray-100 dark:border-white/10 pl-5 text-sm leading-7 text-gray-500 dark:text-white/60 sm:text-base">
                {featuredBlog.excerpt}
              </p>

              <div className="mt-9">
                <Link
                  href={`/blog/${featuredBlog.slug}`}
                  className="inline-flex items-center gap-3 rounded-lg bg-[#050607] dark:bg-[#00a8ff] px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-[#008fd6] dark:hover:bg-[#00d9ff] dark:text-black"
                >
                  Read Article
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* FIELD ARTICLES */}
      {regularBlogs.length > 0 && (
        <section className="border-t border-gray-100 dark:border-white/10 bg-[#fafafa] dark:bg-[#080c10]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
            <div className="mb-10 flex items-end justify-between gap-6 border-b border-gray-200 dark:border-white/10 pb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00a8ff]">
                  {field.name}
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Latest Articles
                </h2>
              </div>

              <span className="hidden text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40 sm:block">
                {regularBlogs.length} article
                {regularBlogs.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {regularBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={{
                    id: blog.id,
                    title: blog.title,
                    slug: blog.slug,
                    field: field.name,
                    fieldSlug: field.slug,
                    excerpt: blog.excerpt ?? "",
                    content: blog.content,
                    image:
                      getPrimaryImage(blog)?.url ??
                      "/images/blogs/placeholder.jpg",
                    gallery: blog.images
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((image) => image.url)
                      .filter((url): url is string => Boolean(url)),
                    author: blog.author,
                    publishedAt: blog.publishedAt
                      ? new Date(blog.publishedAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )
                      : "",
                    readTime: blog.readTime
                      ? `${blog.readTime} min read`
                      : "",
                    tags: blog.tags.map((item) => item.tag.name),
                    featured: blog.featured,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LATEST CONTENT */}
      <LatestBlogs blogs={latestBlogs} />

      {/* OTHER FIELDS */}
      {otherFields.length > 0 && (
        <section className="border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#05070a]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400 dark:text-white/40">
              Explore other Categories
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {otherFields.map((item) => (
                <Link
                  key={item.slug}
                  href={`/field/${item.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-4 py-2 text-sm font-semibold text-gray-600 dark:text-white/70 transition-all hover:-translate-y-0.5 hover:border-[#00a8ff]/40 hover:text-[#00a8ff] dark:hover:text-[#00d9ff] hover:shadow-[0_8px_20px_rgba(0,168,255,0.12)]"
                >
                  {item.name}
                  <span className="text-gray-300 dark:text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-[#00a8ff]">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export async function generateStaticParams() {
  const fields = await getFieldSlugs();

  return fields.map((field) => ({
    slug: field.slug,
  }));
}