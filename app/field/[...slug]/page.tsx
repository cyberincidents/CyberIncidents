import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import BlogCard from "@/components/blog/BlogCard";
import LatestBlogs from "@/components/blog/LatestBlogs";

import {
  getBlogsByField,
  getBlogsByParentField,
  getFieldBySlug,
  getLatestBlogs,
} from "@/lib/data/db-blogs";

import { getFields } from "@/lib/data/db-fields";

const SITE_URL = "https://cyberincidents.in";

/* =====================================================
   DYNAMIC FIELD PAGE
===================================================== */

export const dynamic = "force-dynamic";

/* =====================================================
   TYPES
===================================================== */

type FieldPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

/* =====================================================
   IMAGE HELPER
===================================================== */

function getPrimaryImage(
  blog: {
    images: {
      url: string | null;
      altText: string | null;
      isPrimary: boolean;
      sortOrder: number;
    }[];
  }
) {
  return (
    blog.images.find(
      (image) => image.isPrimary
    ) ??
    blog.images[0]
  );
}

/* =====================================================
   DATE
===================================================== */

function formatDate(
  date: Date | null
) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}

/* =====================================================
   SEO DESCRIPTION
===================================================== */

function getFieldSeoDescription(
  fieldName: string,
  description: string | null,
  isParentCategory: boolean
) {
  if (description?.trim()) {
    const cleanDescription =
      description.trim();

    if (cleanDescription.length <= 160) {
      return cleanDescription;
    }

    return `${cleanDescription
      .slice(0, 157)
      .trimEnd()}...`;
  }

  if (isParentCategory) {
    return `Explore ${fieldName} cybersecurity articles, threat intelligence, security analysis, incident reports and practical security insights from CyberIncidents.`;
  }

  return `Explore ${fieldName} cybersecurity articles, research, security analysis and practical insights from CyberIncidents.`;
}

/* =====================================================
   DYNAMIC FIELD SEO
===================================================== */

export async function generateMetadata({
  params,
}: FieldPageProps): Promise<Metadata> {
  const { slug } = await params;

  /*
   * Invalid URL structure.
   */
  if (
    !slug ||
    slug.length === 0 ||
    slug.length > 2
  ) {
    return {
      title: "Field Not Found",
      description:
        "The requested CyberIncidents cybersecurity field could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const parentSlug = slug[0];

  const currentSlug =
    slug[slug.length - 1];

  const field =
    await getFieldBySlug(
      currentSlug
    );

  /*
   * Field does not exist.
   */
  if (!field) {
    return {
      title: "Field Not Found",
      description:
        "The requested CyberIncidents cybersecurity field could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  /*
   * A child field must always include
   * its parent in the URL.
   */
  if (
    slug.length === 1 &&
    field.parentId &&
    field.parent
  ) {
    permanentRedirect(
      `/field/${field.parent.slug}/${field.slug}`
    );
  }

  /*
   * A two-level URL must contain an
   * actual child field.
   */
  if (slug.length === 2) {
    if (
      !field.parentId ||
      !field.parent ||
      field.parent.slug !==
        parentSlug
    ) {
      return {
        title: "Field Not Found",
        description:
          "The requested CyberIncidents cybersecurity field could not be found.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }
  }

  const isParentCategory =
    slug.length === 1 &&
    !field.parentId;

  const isSubcategory =
    slug.length === 2 &&
    Boolean(field.parentId);

  /*
   * Canonical URL.
   */
  const canonicalUrl =
    `${SITE_URL}/field/${slug.join("/")}`;

  /*
   * SEO title.
   */
  const title = isParentCategory
    ? `${field.name} Cybersecurity`
    : `${field.name} Cybersecurity`;

  /*
   * SEO description.
   */
  const description =
    getFieldSeoDescription(
      field.name,
      field.description,
      isParentCategory
    );

  /*
   * Open Graph title.
   */
  const ogTitle = isParentCategory
    ? `${field.name} | CyberIncidents`
    : `${field.name} | ${field.parent?.name ?? "Cybersecurity"} | CyberIncidents`;

  return {
    title,

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "CyberIncidents",
      title: ogTitle,
      description,
      locale: "en_US",
    },

    twitter: {
      card: "summary",
      title: ogTitle,
      description,
    },
  };
}

/* =====================================================
   FIELD PAGE
===================================================== */

export default async function FieldPage({
  params,
}: FieldPageProps) {
  const { slug } = await params;

  /* ===================================================
     VALIDATE URL
  =================================================== */

  if (
    !slug ||
    slug.length === 0 ||
    slug.length > 2
  ) {
    notFound();
  }

  /*
   * Examples:
   *
   * ["security-defense"]
   *
   * ["security-defense", "network-security"]
   */

  const parentSlug = slug[0];

  const currentSlug =
    slug[slug.length - 1];

  /* ===================================================
     GET CURRENT FIELD
  =================================================== */

  const field =
    await getFieldBySlug(
      currentSlug
    );

  if (!field) {
    notFound();
  }

  /* ===================================================
     HIERARCHY VALIDATION
  =================================================== */

  /*
   * Parent category:
   *
   * /field/security-defense
   */

  if (
    slug.length === 1 &&
    field.parentId &&
    field.parent
  ) {
    permanentRedirect(
      `/field/${field.parent.slug}/${field.slug}`
    );
  }

  /*
   * Child category:
   *
   * /field/security-defense/network-security
   */

  if (
    slug.length === 2
  ) {
    /*
     * Child must actually have a parent.
     */

    if (!field.parentId) {
      notFound();
    }

    /*
     * Verify that the URL parent matches
     * the actual database parent.
     */

    if (
      !field.parent ||
      field.parent.slug !==
        parentSlug
    ) {
      notFound();
    }
  }

  /* ===================================================
     DETERMINE PAGE TYPE
  =================================================== */

  const isParentCategory =
    slug.length === 1 &&
    !field.parentId;

  const isSubcategory =
    slug.length === 2 &&
    Boolean(field.parentId);

  /* ===================================================
     GET BLOGS
  =================================================== */

  /*
   * IMPORTANT:
   *
   * Parent category:
   *   get ALL blogs from its children.
   *
   * Subcategory:
   *   get ONLY blogs from that field.
   */

  const blogs = isParentCategory
    ? await getBlogsByParentField(
        field.slug
      )
    : await getBlogsByField(
        field.slug
      );

  /* ===================================================
     GET ALL FIELDS
  =================================================== */

  const allFields =
    await getFields();

  /* ===================================================
     CHILD CATEGORIES
  =================================================== */

  const childFields =
    isParentCategory
      ? allFields.filter(
          (item) =>
            item.parentId ===
            field.id
        )
      : [];

  /* ===================================================
     LATEST BLOGS
  =================================================== */

  const latestBlogs =
    (
      await getLatestBlogs(4)
    )
      .filter(
        (blog) =>
          !blogs.some(
            (item) =>
              item.id === blog.id
          )
      )
      .slice(0, 3);

  /* ===================================================
     FEATURED BLOG
  =================================================== */

  const featuredBlog =
    blogs.find(
      (blog) => blog.featured
    );

  const regularBlogs =
    blogs.filter(
      (blog) =>
        blog.id !==
        featuredBlog?.id
    );

  /* ===================================================
     CATEGORY NUMBER
  =================================================== */

  const categoryNumber =
    field.number ??
    "00";

  /* ===================================================
     SEO DATA
  =================================================== */

  const canonicalUrl =
    `${SITE_URL}/field/${slug.join("/")}`;

  const seoDescription =
    getFieldSeoDescription(
      field.name,
      field.description,
      isParentCategory
    );

  /* ===================================================
     COLLECTION PAGE SCHEMA
  =================================================== */

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    "@id": `${canonicalUrl}#collection`,

    url: canonicalUrl,

    name: field.name,

    description:
      seoDescription,

    isPartOf: {
      "@type": "WebSite",
      name: "CyberIncidents",
      url: SITE_URL,
    },

    about: {
      "@type": "Thing",
      name: `${field.name} cybersecurity`,
    },

    mainEntity: {
      "@type": "ItemList",

      numberOfItems:
        blogs.length,

      itemListElement:
        blogs
          .slice(0, 20)
          .map(
            (blog, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: blog.title,
              url: `${SITE_URL}/blog/${blog.slug}`,
            })
          ),
    },
  };

  /* ===================================================
     BREADCRUMB SCHEMA
  =================================================== */

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
  ];

  if (
    isSubcategory &&
    field.parent
  ) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: field.parent.name,
      item: `${SITE_URL}/field/${field.parent.slug}`,
    });

    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: field.name,
      item: canonicalUrl,
    });
  } else {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: field.name,
      item: canonicalUrl,
    });
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement:
      breadcrumbItems,
  };

  /* ===================================================
     RENDER
  =================================================== */

  return (
    <main className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-[#05070a] dark:text-white">

      {/* =================================================
          STRUCTURED DATA
      ================================================= */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionPageSchema
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema
          ),
        }}
      />

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="border-b border-gray-100 bg-white dark:border-white/10 dark:bg-[#05070a]">

        <div className="mx-auto max-w-7xl px-5 pb-14 pt-12 sm:px-8 sm:pb-16 lg:px-10 lg:pb-20 lg:pt-16">

          {/* =================================================
              BREADCRUMB
          ================================================= */}

          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs text-gray-400 dark:text-white/40"
          >

            <Link
              href="/"
              className="transition-colors hover:text-[#00a8ff]"
            >
              Home
            </Link>

            <span aria-hidden="true">
              /
            </span>

            {field.parent && (
              <>
                <Link
                  href={`/field/${field.parent.slug}`}
                  className="transition-colors hover:text-[#00a8ff]"
                >
                  {field.parent.name}
                </Link>

                <span aria-hidden="true">
                  /
                </span>
              </>
            )}

            <span
              aria-current="page"
              className="text-gray-600 dark:text-white/70"
            >
              {field.name}
            </span>

          </nav>

          {/* =================================================
              CATEGORY HEADER
          ================================================= */}

          <div className="mt-9 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-3xl">

              <div className="flex items-center gap-3">

                <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#00a8ff]">
                  [ {categoryNumber} ]
                </span>

                <span className="h-px w-8 bg-[#00a8ff]" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-white/40">
                  {isParentCategory
                    ? "Operational Domain"
                    : "Specialized Topic"}
                </span>

              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                {field.name}
              </h1>

              {field.description && (
                <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-500 dark:text-white/60 sm:text-base sm:leading-8">
                  {field.description}
                </p>
              )}

            </div>

            {/* =================================================
                STATS
            ================================================= */}

            <div className="flex shrink-0 gap-8 border-t border-gray-100 pt-6 dark:border-white/10 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">

              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {blogs.length}
                </p>

                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-white/40">
                  Articles
                </p>
              </div>

              {isParentCategory && (
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {childFields.length}
                  </p>

                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-white/40">
                    Topics
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          TOPICS

          Only shown on parent category pages.
      ================================================= */}

      {isParentCategory &&
        childFields.length > 0 && (
          <section className="border-b border-gray-100 bg-[#f8fafc] dark:border-white/10 dark:bg-[#080c10]">

            <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">

              <div className="mb-6">

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0284c7] dark:text-[#00a8ff]">
                  {field.name}
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Explore Topics
                </h2>

              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                {childFields.map(
                  (child) => (
                    <Link
                      key={
                        child.id
                      }
                      href={`/field/${field.slug}/${child.slug}`}
                      className="group flex min-h-[60px] items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-[#0284c7]/40 hover:shadow-md dark:border-white/10 dark:bg-[#10192d] dark:hover:border-[#00a8ff]/40"
                    >

                      <div className="flex items-center gap-3">

                        <span className="h-2 w-2 rounded-full bg-[#0284c7] dark:bg-[#00a8ff]" />

                        <span className="text-sm font-medium text-gray-600 transition-colors group-hover:text-[#0284c7] dark:text-white/65 dark:group-hover:text-[#00d9ff]">
                          {child.name}
                        </span>

                      </div>

                      <span className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-[#0284c7] dark:text-white/20 dark:group-hover:text-[#00d9ff]">
                        →
                      </span>

                    </Link>
                  )
                )}

              </div>

            </div>

          </section>
        )}

      {/* =================================================
          FEATURED ARTICLE
      ================================================= */}

      {featuredBlog && (
        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">

          <div className="mb-8 flex items-center gap-4">

            <span className="h-px w-8 bg-[#00a8ff]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-white/40">
              Featured Article
            </span>

          </div>

          <article className="group grid overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-[#090d14] lg:grid-cols-2">

            {/* Image */}

            <Link
              href={`/blog/${featuredBlog.slug}`}
              className="relative block aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-white/5 lg:aspect-auto lg:min-h-[430px]"
            >

              {(() => {
                const image =
                  getPrimaryImage(
                    featuredBlog
                  );

                if (image?.url) {
                  return (
                    <Image
                      src={
                        image.url
                      }
                      alt={
                        image.altText ??
                        featuredBlog.title
                      }
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  );
                }

                return (
                  <div className="absolute inset-0 bg-gray-100 dark:bg-white/5" />
                );
              })()}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            </Link>

            {/* Content */}

            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">

              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 dark:text-white/40">

                <span>
                  {formatDate(
                    featuredBlog.publishedAt
                  )}
                </span>

                <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-white/20" />

                <span>
                  {featuredBlog.readTime
                    ? `${featuredBlog.readTime} min read`
                    : "Read article"}
                </span>

              </div>

              <Link
                href={`/blog/${featuredBlog.slug}`}
              >
                <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-gray-900 transition-colors group-hover:text-[#00a8ff] dark:text-white dark:group-hover:text-[#00d9ff] sm:text-4xl">
                  {featuredBlog.title}
                </h2>
              </Link>

              {featuredBlog.excerpt && (
                <p className="mt-5 border-l-2 border-gray-200 pl-4 text-sm leading-7 text-gray-500 dark:border-white/10 dark:text-white/60">
                  {featuredBlog.excerpt}
                </p>
              )}

              <div className="mt-8">

                <Link
                  href={`/blog/${featuredBlog.slug}`}
                  className="inline-flex items-center gap-3 rounded-lg bg-[#050607] px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#008fd6] dark:bg-[#00a8ff] dark:text-black dark:hover:bg-[#00d9ff]"
                >
                  Read Article
                  <span>→</span>
                </Link>

              </div>

            </div>

          </article>

        </section>
      )}

      {/* =================================================
          ARTICLES
      ================================================= */}

      {regularBlogs.length > 0 && (
        <section className="border-t border-gray-100 bg-[#fafafa] dark:border-white/10 dark:bg-[#080c10]">

          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">

            <div className="mb-10 flex items-end justify-between gap-6 border-b border-gray-200 pb-6 dark:border-white/10">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0284c7] dark:text-[#00a8ff]">
                  {isParentCategory
                    ? `${field.name} Intelligence`
                    : field.name}
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Latest Articles
                </h2>

              </div>

              <span className="hidden text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40 sm:block">
                {regularBlogs.length}{" "}
                {regularBlogs.length ===
                1
                  ? "Article"
                  : "Articles"}
              </span>

            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">

              {regularBlogs.map(
                (blog) => {
                  const image =
                    getPrimaryImage(
                      blog
                    );

                  return (
                    <BlogCard
                      key={
                        blog.id
                      }
                      blog={{
                        id: blog.id,

                        title:
                          blog.title,

                        slug:
                          blog.slug,

                        field:
                          field.name,

                        fieldSlug:
                          field.slug,

                        excerpt:
                          blog.excerpt ??
                          "",

                        content:
                          blog.content,

                        image:
                          image?.url ??
                          "/images/blogs/placeholder.jpg",

                        gallery:
                          blog.images
                            .slice()
                            .sort(
                              (
                                a,
                                b
                              ) =>
                                a.sortOrder -
                                b.sortOrder
                            )
                            .map(
                              (
                                item
                              ) =>
                                item.url
                            )
                            .filter(
                              (
                                url
                              ): url is string =>
                                Boolean(
                                  url
                                )
                            ),

                        author:
                          blog.author,

                        publishedAt:
                          blog.publishedAt
                            ? formatDate(
                                blog.publishedAt
                              )
                            : "",

                        readTime:
                          blog.readTime
                            ? `${blog.readTime} min read`
                            : "",

                        tags:
                          blog.tags.map(
                            (
                              item
                            ) =>
                              item.tag
                                .name
                          ),

                        featured:
                          blog.featured,
                      }}
                    />
                  );
                }
              )}

            </div>

          </div>

        </section>
      )}

      {/* =================================================
          NO ARTICLES
      ================================================= */}

      {blogs.length === 0 && (
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">

          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center dark:border-white/10 dark:bg-white/[0.02]">

            <p className="font-mono text-xs uppercase tracking-[0.18em] text-gray-400 dark:text-white/40">
              No intelligence published
            </p>

            <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
              No articles in this field yet
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500 dark:text-white/50">
              There are currently no published
              articles associated with this
              operational domain.
            </p>

          </div>

        </section>
      )}

      {/* =================================================
          GLOBAL LATEST CONTENT
      ================================================= */}

      <LatestBlogs
        blogs={latestBlogs}
      />

    </main>
  );
}