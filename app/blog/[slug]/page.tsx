import Link from "next/link";
import { notFound } from "next/navigation";

import ArticleContent from "@/components/blog/ArticleContent";
import BlogViewTracker from "@/components/blog/BlogViewTracker";
import BlogCard from "@/components/blog/BlogCard";
import LatestBlogs from "@/components/blog/LatestBlogs";
import RelatedArticles from "@/components/blog/RelatedArticles";
import ShareButtons from "@/components/blog/ShareButtons";

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
  return (
    blog.images.find(
      (image) => image.isPrimary
    ) ?? blog.images[0]
  );
}

function toBlogCardData(
  blog: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    author: string;
    publishedAt: Date | null;
    readTime: number | null;
    featured: boolean;

    fields: {
      field: {
        name: string;
        slug: string;
      };
    }[];

    tags: {
      tag: {
        name: string;
      };
    }[];

    images: {
      url: string | null;
      altText: string | null;
      isPrimary: boolean;
      sortOrder: number;
    }[];
  }
) {
  const primaryImage = getPrimaryImage(blog);
  const field = blog.fields[0]?.field;

  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,

    field:
      field?.name ?? "Cyber Security",

    fieldSlug:
      field?.slug ?? "",

    excerpt:
      blog.excerpt ?? "",

    content:
      blog.content,

    image:
      primaryImage?.url ??
      "/images/blogs/placeholder.jpg",

    gallery: primaryImage?.url
      ? [primaryImage.url]
      : [],

    author:
      blog.author,

    publishedAt:
      formatDate(blog.publishedAt),

    readTime:
      blog.readTime
        ? `${blog.readTime} min read`
        : "",

    tags: blog.tags.map(
      (item) => item.tag.name
    ),

    featured:
      blog.featured,
  };
}

export default async function BlogPage({
  params,
}: BlogPageProps) {
  const { slug } = await params;

  // --------------------------------------------------
  // Get blog
  // --------------------------------------------------

  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const blogField =
    blog.fields[0]?.field;

  // --------------------------------------------------
  // Related articles
  // --------------------------------------------------

  const relatedBlogs = blogField
    ? await getBlogsByField(
        blogField.slug
      )
    : [];

  const filteredRelatedBlogs =
    relatedBlogs
      .filter(
        (item) => item.id !== blog.id
      )
      .slice(0, 3);

  // --------------------------------------------------
  // Latest articles
  // --------------------------------------------------

  const latestBlogs =
    (await getLatestBlogs(4))
      .filter(
        (item) => item.id !== blog.id
      )
      .slice(0, 3);

  // --------------------------------------------------
  // Primary image
  // --------------------------------------------------

  const primaryImage =
    getPrimaryImage(blog);

  return (
    <main className="min-h-screen bg-white">
      {/* ==========================================================
          VIEW TRACKING
      ========================================================== */}

      <BlogViewTracker
        blogId={blog.id}
      />

      {/* ==========================================================
          ARTICLE HEADER
      ========================================================== */}

      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-5 pb-12 pt-12 sm:px-8 sm:pt-16 lg:px-10 lg:pb-16">
          {/* Breadcrumb */}

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <Link
              href="/"
              className="transition-colors hover:text-[#008fd6]"
            >
              Home
            </Link>

            <span>/</span>

            {blogField && (
              <>
                <Link
                  href={`/field/${blogField.slug}`}
                  className="transition-colors hover:text-[#008fd6]"
                >
                  {blogField.name}
                </Link>

                <span>/</span>
              </>
            )}

            <span className="text-gray-500">
              Article
            </span>
          </div>

          {/* Field */}

          <div className="mt-9">
            <span className="inline-flex rounded-full border border-[#00a8ff]/20 bg-[#00a8ff]/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#008fd6]">
              {blogField?.name ??
                "Cyber Security"}
            </span>
          </div>

          {/* Title */}

          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-gray-900 sm:text-5xl lg:text-6xl">
            {blog.title}
          </h1>

          {/* Excerpt */}

          {blog.excerpt && (
            <p className="mt-6 max-w-3xl text-base leading-8 text-gray-500 sm:text-lg">
              {blog.excerpt}
            </p>
          )}

          {/* Metadata */}

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span className="font-medium text-gray-600">
              CyberIncidents Team
            </span>

            <span className="h-1 w-1 rounded-full bg-gray-300" />

            <span>
              {formatDate(
                blog.publishedAt
              )}
            </span>

            {blog.readTime && (
              <>
                <span className="h-1 w-1 rounded-full bg-gray-300" />

                <span>
                  {blog.readTime} min read
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ==========================================================
          PRIMARY ARTICLE IMAGE
      ========================================================== */}

      {primaryImage?.url && (
        <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={primaryImage.url}
              alt={
                primaryImage.altText ??
                blog.title
              }
              className="h-auto max-h-[700px] w-full object-cover"
            />
          </div>
        </section>
      )}

      {/* ==========================================================
          ARTICLE CONTENT
      ========================================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,760px)_280px] lg:justify-center lg:gap-20">
          {/* Article */}

          <div>
            <ArticleContent
              content={blog.content}
            />

            {/* Share */}

            <div className="mt-12">
              <ShareButtons
                blogId={blog.id}
                title={blog.title}
                slug={blog.slug}
              />
            </div>
          </div>

          {/* Sidebar */}

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="border-l-2 border-[#00a8ff] pl-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#008fd6]">
                  In this article
                </p>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Explore the analysis and key
                  concepts covered in this
                  cybersecurity article.
                </p>
              </div>

              {blogField && (
                <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                    Field
                  </p>

                  <Link
                    href={`/field/${blogField.slug}`}
                    className="mt-2 block text-sm font-semibold text-gray-800 transition hover:text-[#008fd6]"
                  >
                    {blogField.name}
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* ==========================================================
          RELATED CONTENT
      ========================================================== */}

      <RelatedArticles
        blogs={filteredRelatedBlogs}
      />

      {/* ==========================================================
          LATEST CONTENT
      ========================================================== */}

      <LatestBlogs
        blogs={latestBlogs}
      />
    </main>
  );
}

export async function generateStaticParams() {
  const blogs =
    await getAllPublishedBlogSlugs();

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}