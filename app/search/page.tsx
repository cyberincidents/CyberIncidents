import Link from "next/link";
import Image from "next/image";

import { searchPublishedBlogs } from "@/lib/data/db-blogs";
import LiveSearchInput from "@/components/search/LiveSearchInput";


type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

function getPrimaryImage(
  images: {
    url: string | null;
    isPrimary: boolean;
  }[]
) {
  const primary = images.find((image) => image.isPrimary);

  return primary?.url ?? images[0]?.url ?? null;
}

function getExcerpt(
  excerpt: string | null,
  content: string
) {
  if (excerpt?.trim()) {
    return excerpt.trim();
  }

  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= 180) {
    return plainText;
  }

  return `${plainText.slice(0, 180).trim()}...`;
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";

  const blogs = query
    ? await searchPublishedBlogs(query)
    : [];

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">
            CyberIncidents
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Search
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Search cybersecurity incidents, threats, vulnerabilities,
            privacy and defensive technologies.
          </p>

          {/* Search form */}
          <div className="mt-8">
  <LiveSearchInput />
</div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        {!query ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path
                  d="m16 16 4.5 4.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-950">
              Search CyberIncidents
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter a topic, threat, vulnerability, field or keyword
              to find relevant articles.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                  Search Results
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  Results for &ldquo;{query}&rdquo;
                </h2>
              </div>

              <p className="text-sm text-slate-500">
                {blogs.length}{" "}
                {blogs.length === 1 ? "article" : "articles"} found
              </p>
            </div>

            {blogs.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
                <h2 className="text-lg font-semibold text-slate-950">
                  No articles found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Try a different keyword or search for another
                  cybersecurity topic.
                </p>
              </div>
            ) : (
              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => {
                  const primaryImage = getPrimaryImage(blog.images);

                  return (
                    <article
                      key={blog.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                    >
                      {/* Image */}
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="block"
                      >
                        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                          {primaryImage ? (
                            <Image
                              src={primaryImage}
                              alt={blog.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-slate-400">
                              No image
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-6">
                        {/* Fields */}
                        {blog.fields.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {blog.fields.slice(0, 2).map((item) => (
                              <Link
                                key={item.fieldId}
                                href={`/field/${item.field.slug}`}
                                className="text-[11px] font-bold uppercase tracking-[0.12em] text-cyan-600 transition hover:text-cyan-700"
                              >
                                {item.field.name}
                              </Link>
                            ))}
                          </div>
                        )}

                        <Link
                          href={`/blog/${blog.slug}`}
                          className="mt-3 block"
                        >
                          <h3 className="text-lg font-bold leading-7 text-slate-950 transition group-hover:text-cyan-700">
                            {blog.title}
                          </h3>
                        </Link>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                          {getExcerpt(blog.excerpt, blog.content)}
                        </p>

                        {/* Tags */}
                        {blog.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {blog.tags.slice(0, 3).map((item) => (
                              <span
                                key={item.tagId}
                                className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500"
                              >
                                #{item.tag.name}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-6">
                          <Link
                            href={`/blog/${blog.slug}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition group-hover:text-cyan-700"
                          >
                            Read More

                            <span
                              aria-hidden="true"
                              className="transition-transform duration-200 group-hover:translate-x-1"
                            >
                              →
                            </span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}