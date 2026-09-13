import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import BlogCard from "@/components/blog/BlogCard";
import { getBlogsByField, getFieldBySlug } from "@/lib/data/db-blogs";
import {
  getFields,
  getFieldSlugs,
} from "@/lib/data/db-fields";

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

  const regularBlogs = blogs.filter(
    (blog) => blog.id !== featuredBlog?.id
  );

  const latestBlogs = [...blogs]
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() -
        new Date(a.publishedAt ?? 0).getTime()
    )
    .slice(0, 3);

  const getPrimaryImage = (blog: (typeof blogs)[number]) => {
    return (
      blog.images.find((image) => image.isPrimary) ??
      blog.images[0]
    );
  };

  return (
    <main className="min-h-screen bg-white">
      {/* ============================================================
          FIELD HEADER
      ============================================================ */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link
              href="/"
              className="transition-colors hover:text-[#008fd6]"
            >
              Home
            </Link>

            <span>/</span>

            <span className="text-gray-600">{field.name}</span>
          </div>

          <div className="mt-8 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#008fd6]">
              Cybersecurity Field
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {field.name}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base sm:leading-8">
              {field.description}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURED ARTICLE
      ============================================================ */}
      {featuredBlog && (
        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="mb-7 flex items-center gap-4">
            <span className="h-px w-8 bg-[#00a8ff]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Featured
            </p>
          </div>

          <article className="group grid overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:grid-cols-2">
            {/* Image */}
            <Link
              href={`/blog/${featuredBlog.slug}`}
              className="relative block aspect-[16/10] overflow-hidden bg-gray-100 lg:aspect-auto lg:min-h-[430px]"
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
                  <div className="absolute inset-0 bg-gray-100" />
                );
              })()}

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              <span className="absolute left-6 top-6 rounded-full bg-black/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#00d9ff] backdrop-blur">
                {field.name}
              </span>
            </Link>

            {/* Content */}
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>
                  {featuredBlog.publishedAt
                    ? new Date(
                        featuredBlog.publishedAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unpublished"}
                </span>

                <span className="h-1 w-1 rounded-full bg-gray-300" />

                <span>
                  {featuredBlog.readTime
                    ? `${featuredBlog.readTime} min read`
                    : "Read article"}
                </span>
              </div>

              <Link href={`/blog/${featuredBlog.slug}`}>
                <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-gray-900 transition-colors group-hover:text-[#008fd6] sm:text-4xl">
                  {featuredBlog.title}
                </h2>
              </Link>

              <p className="mt-5 text-sm leading-7 text-gray-500 sm:text-base">
                {featuredBlog.excerpt}
              </p>

              <div className="mt-7">
                <Link
                  href={`/blog/${featuredBlog.slug}`}
                  className="inline-flex items-center gap-3 rounded-lg bg-[#050607] px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-[#008fd6]"
                >
                  Read Article

                  <span>→</span>
                </Link>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* ============================================================
          FIELD ARTICLES
      ============================================================ */}
      {regularBlogs.length > 0 && (
        <section className="border-t border-gray-100 bg-[#fafafa]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
            <div className="mb-9 flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008fd6]">
                  {field.name}
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                  Latest Articles
                </h2>
              </div>

              <span className="hidden text-xs text-gray-400 sm:block">
                {regularBlogs.length} articles
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                      ? new Date(
                          blog.publishedAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
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

      {/* ============================================================
          LATEST CONTENT
      ============================================================ */}
      {latestBlogs.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
            <div className="mb-9">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008fd6]">
                Stay informed
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                Latest Content
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {latestBlogs.map((blog) => (
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
                      ? new Date(
                          blog.publishedAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
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

      {/* ============================================================
          OTHER FIELDS
      ============================================================ */}
      <section className="border-t border-gray-100 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
              Explore other fields
            </span>

            {fields
              .filter((item) => item.slug !== slug)
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/field/${item.slug}`}
                  className="text-sm font-semibold text-gray-600 transition-colors hover:text-[#008fd6]"
                >
                  {item.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  const fields = await getFieldSlugs();

  return fields.map((field) => ({
    slug: field.slug,
  }));
}