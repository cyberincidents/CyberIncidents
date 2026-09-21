import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ArticleContent from "@/components/blog/ArticleContent";
import BlogViewTracker from "@/components/blog/BlogViewTracker";
import LatestBlogs from "@/components/blog/LatestBlogs";
import RelatedArticles from "@/components/blog/RelatedArticles";
import ShareButtons from "@/components/blog/ShareButtons";

import {
  getBlogBySlug,
  getBlogsByField,
  getLatestBlogs,
} from "@/lib/data/db-blogs";

const SITE_URL = "https://cyberincidents.in";

/*
 * Blog pages are managed dynamically from the admin panel.
 *
 * This ensures newly published or edited blogs are immediately
 * available without requiring a new deployment.
 *
 * Do not use generateStaticParams() here because blog content
 * is managed dynamically from the admin panel.
 */

type BlogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/* =====================================================
   DATE FORMATTER
===================================================== */

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

/* =====================================================
   PRIMARY IMAGE
===================================================== */

function getPrimaryImage(blog: {
  images: {
    url: string | null;
    altText: string | null;
    isPrimary: boolean;
    sortOrder: number;
  }[];
}) {
  return (
    blog.images.find((image) => image.isPrimary) ??
    blog.images[0]
  );
}

function getFieldUrl(field: {
  slug: string;
  parent?: {
    slug: string;
  } | null;
}) {
  if (field.parent) {
    return `/field/${field.parent.slug}/${field.slug}`;
  }

  return `/field/${field.slug}`;
}

/* =====================================================
   SEO DESCRIPTION
===================================================== */

function getSeoDescription(
  title: string,
  excerpt: string | null
) {
  const fallback = `Read ${title} on CyberIncidents — cybersecurity news, threat intelligence, security research, incident analysis and practical security insights.`;

  const description =
    excerpt?.trim() || fallback;

  /*
   * Keep descriptions reasonably concise for search
   * previews while preserving the actual article meaning.
   */
  if (description.length <= 160) {
    return description;
  }

  return `${description.slice(0, 157).trimEnd()}...`;
}

/* =====================================================
   DYNAMIC SEO METADATA
===================================================== */

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;

  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Article Not Found",
      description:
        "The requested CyberIncidents article could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const primaryImage =
    getPrimaryImage(blog);

  const description =
    getSeoDescription(
      blog.title,
      blog.excerpt
    );

  const canonicalUrl =
    `${SITE_URL}/blog/${blog.slug}`;

  const imageUrl =
    primaryImage?.url ?? undefined;

  const publishedTime =
    blog.publishedAt
      ? new Date(
          blog.publishedAt
        ).toISOString()
      : undefined;

  const modifiedTime =
    blog.updatedAt
      ? new Date(
          blog.updatedAt
        ).toISOString()
      : publishedTime;

  return {
    title: blog.title,

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
      type: "article",
      url: canonicalUrl,
      siteName: "CyberIncidents",
      title: blog.title,
      description,
      locale: "en_US",

      ...(publishedTime
        ? {
            publishedTime,
          }
        : {}),

      ...(modifiedTime
        ? {
            modifiedTime,
          }
        : {}),

      authors: [
        "https://cyberincidents.in",
      ],

      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 675,
                alt:
                  primaryImage?.altText ??
                  blog.title,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: imageUrl
        ? "summary_large_image"
        : "summary",

      title: blog.title,
      description,

      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                alt:
                  primaryImage?.altText ??
                  blog.title,
              },
            ],
          }
        : {}),
    },
  };
}

/* =====================================================
   BLOG PAGE
===================================================== */

export default async function BlogPage({
  params,
}: BlogPageProps) {
  const { slug } = await params;

  /* ===================================================
     GET BLOG
  =================================================== */

  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  /* ===================================================
     PRIMARY FIELD

     A blog can belong to multiple fields.
     The first selected field is used for:
     - breadcrumb
     - field badge
     - filed under
     - related articles
  =================================================== */

  const blogField =
    blog.fields[0]?.field;

  /* ===================================================
     RELATED ARTICLES
  =================================================== */

  const relatedBlogs = blogField
    ? await getBlogsByField(
        blogField.slug
      )
    : [];

  const filteredRelatedBlogs =
    relatedBlogs
      .filter(
        (item) =>
          item.id !== blog.id
      )
      .slice(0, 3);

  /* ===================================================
     LATEST CONTENT

     Global latest published blogs.
  =================================================== */

  const latestBlogs =
    (
      await getLatestBlogs(4)
    )
      .filter(
        (item) =>
          item.id !== blog.id
      )
      .slice(0, 3);

  /* ===================================================
     PRIMARY IMAGE
  =================================================== */

  const primaryImage =
    getPrimaryImage(blog);

  /* ===================================================
     SEO DATA
  =================================================== */

  const canonicalUrl =
    `${SITE_URL}/blog/${blog.slug}`;

  const description =
    getSeoDescription(
      blog.title,
      blog.excerpt
    );

  const publishedTime =
    blog.publishedAt
      ? new Date(
          blog.publishedAt
        ).toISOString()
      : undefined;

  const modifiedTime =
    blog.updatedAt
      ? new Date(
          blog.updatedAt
        ).toISOString()
      : publishedTime;

  /* ===================================================
     BLOGPOSTING STRUCTURED DATA
  =================================================== */

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",

    "@id": `${canonicalUrl}#article`,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },

    headline: blog.title,

    description,

    url: canonicalUrl,

    ...(primaryImage?.url
      ? {
          image: [
            primaryImage.url,
          ],
        }
      : {}),

    ...(publishedTime
      ? {
          datePublished:
            publishedTime,
        }
      : {}),

    ...(modifiedTime
      ? {
          dateModified:
            modifiedTime,
        }
      : {}),

    author: {
      "@type": "Organization",
      name: "CyberIncidents",
      url: SITE_URL,
    },

    publisher: {
      "@type": "Organization",
      name: "CyberIncidents",
      url: SITE_URL,
    },

    isPartOf: {
      "@type": "WebSite",
      name: "CyberIncidents",
      url: SITE_URL,
    },

    ...(blogField
      ? {
          articleSection:
            blogField.name,
        }
      : {}),
  };

  /* ===================================================
     BREADCRUMB STRUCTURED DATA
  =================================================== */

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
  ];

  if (blogField?.parent) {
  breadcrumbItems.push({
    "@type": "ListItem",
    position: 2,
    name: blogField.parent.name,
    item: `${SITE_URL}/field/${blogField.parent.slug}`,
  });

  breadcrumbItems.push({
    "@type": "ListItem",
    position: 3,
    name: blogField.name,
    item: `${SITE_URL}/field/${blogField.parent.slug}/${blogField.slug}`,
  });
} else if (blogField) {
  breadcrumbItems.push({
    "@type": "ListItem",
    position: 2,
    name: blogField.name,
    item: `${SITE_URL}/field/${blogField.slug}`,
  });
}

  breadcrumbItems.push({
  "@type": "ListItem",
  position: blogField?.parent
    ? 4
    : blogField
      ? 3
      : 2,
  name: blog.title,
  item: canonicalUrl,
});

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
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
            blogPostingSchema
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
          VIEW TRACKER
      ================================================= */}

      <BlogViewTracker
        blogId={blog.id}
      />

      {/* =================================================
          ARTICLE HEADER
      ================================================= */}

      <section className="border-b border-gray-100 bg-white dark:border-white/10 dark:bg-[#05070a]">

        <div className="mx-auto max-w-3xl px-5 pb-14 pt-14 sm:px-8 sm:pt-20">

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

           {blogField && (
  <>
    {blogField.parent && (
      <>
        <Link
          href={`/field/${blogField.parent.slug}`}
          className="transition-colors hover:text-[#00a8ff]"
        >
          {blogField.parent.name}
        </Link>

        <span aria-hidden="true">
          /
        </span>
      </>
    )}

    <Link
      href={getFieldUrl(blogField)}
      className="transition-colors hover:text-[#00a8ff]"
    >
      {blogField.name}
    </Link>

    <span aria-hidden="true">
      /
    </span>
  </>
)}

            <span
              aria-current="page"
              className="text-gray-500 dark:text-white/60"
            >
              Article
            </span>

          </nav>

          {/* =================================================
              FIELD BADGE
          ================================================= */}

          <div className="mt-8">

            <span className="inline-flex rounded-full border border-[#00a8ff]/30 bg-[#00a8ff]/10 px-3.5 py-1.5 text-xs font-semibold text-[#00d9ff]">
              {blogField?.name ??
                "Cyber Security"}
            </span>

          </div>

          {/* =================================================
              TITLE
          ================================================= */}

          <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-gray-900 dark:text-white sm:text-5xl">
            {blog.title}
          </h1>

          {/* =================================================
              EXCERPT
          ================================================= */}

          {blog.excerpt && (
            <p className="mt-6 text-base leading-8 text-gray-500 dark:text-white/60 sm:text-lg">
              {blog.excerpt}
            </p>
          )}

          {/* =================================================
              META
          ================================================= */}

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-white/40">

            <span className="font-medium text-gray-600 dark:text-white/80">
              CyberIncidents Team
            </span>

            <span className="h-1 w-1 shrink-0 rounded-full bg-gray-300 dark:bg-white/20" />

            <span>
              {formatDate(
                blog.publishedAt
              )}
            </span>

            {blog.readTime && (
              <>
                <span className="h-1 w-1 shrink-0 rounded-full bg-gray-300 dark:bg-white/20" />

                <span>
                  {blog.readTime}{" "}
                  min read
                </span>
              </>
            )}

          </div>

        </div>

      </section>

      {/* =================================================
          PRIMARY IMAGE
      ================================================= */}

      {primaryImage?.url && (
        <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-12">

          <figure className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5">

            <Image
              src={primaryImage.url}
              alt={
                primaryImage.altText ??
                blog.title
              }
              width={1200}
              height={675}
              className="h-auto max-h-[600px] w-full object-cover"
            />

          </figure>

        </section>
      )}

      {/* =================================================
          ARTICLE CONTENT
      ================================================= */}

      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">

        <ArticleContent
          content={blog.content}
        />

        {/* =================================================
            ARTICLE FOOTER / SHARING
        ================================================= */}

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 px-5 py-5 dark:border-white/10 dark:bg-[#090d14]">

          <div className="text-sm text-gray-500 dark:text-white/70">

            Filed under{" "}

            {blogField ? (
              <Link
                href={getFieldUrl(blogField)}
                className="font-semibold text-gray-800 transition hover:text-[#00a8ff] dark:text-[#00d9ff]"
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

      {/* =================================================
          RELATED ARTICLES
      ================================================= */}

      <RelatedArticles
        blogs={
          filteredRelatedBlogs
        }
      />

      {/* =================================================
          LATEST CONTENT
      ================================================= */}

      <LatestBlogs
        blogs={latestBlogs}
      />

    </main>
  );
}