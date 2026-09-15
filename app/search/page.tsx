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

function getExcerpt(excerpt: string | null, content: string) {
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

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="h-4 w-4 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";

  const blogs = query ? await searchPublishedBlogs(query) : [];

  return (
    <main className="min-h-screen bg-white dark:bg-[#05070a] text-gray-900 dark:text-white transition-colors duration-300">
      <section className="border-b border-gray-100 dark:border-white/10 bg-white dark:bg-[#05070a]">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-gray-900 dark:text-white sm:text-4xl">
            Search
          </h1>

          <p className="mt-3 max-w-xl text-[15px] leading-6 text-gray-500 dark:text-white/60">
            Search cybersecurity incidents, threats, vulnerabilities,
            privacy, and defensive technologies.
          </p>

          <div className="mt-8">
            <LiveSearchInput />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        {!query ? (
          <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#090d14] px-6 py-16 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#00a8ff]/10 text-[#00a8ff]">
              <SearchIcon />
            </div>

            <h2 className="mt-5 text-base font-semibold text-gray-900 dark:text-white">
              Search CyberIncidents
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-white/50">
              Enter a topic, threat, vulnerability, field, or keyword to
              find relevant articles.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-9 flex flex-col gap-2 border-b border-gray-100 dark:border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-2xl font-bold tracking-[-0.02em] text-gray-900 dark:text-white">
                Results for &ldquo;{query}&rdquo;
              </h2>

              <p className="text-sm text-gray-500 dark:text-white/50">
                {blogs.length} {blogs.length === 1 ? "article" : "articles"}{" "}
                found
              </p>
            </div>

            {blogs.length === 0 ? (
              <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#090d14] px-6 py-16 text-center">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  No articles found
                </h2>

                <p className="mt-2 text-sm text-gray-500 dark:text-white/50">
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
                      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#090d14] transition-all duration-300 hover:-translate-y-1 hover:border-[#00a8ff]/40 hover:shadow-xl hover:shadow-[#00a8ff]/[0.1]"
                    >
                      <Link href={`/blog/${blog.slug}`} className="block">
                        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-white/5">
                          {primaryImage ? (
                            <Image
                              src={primaryImage}
                              alt={blog.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-gray-400 dark:text-white/30">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="p-6 pb-0">
                          <h3 className="flex items-start gap-1.5 text-lg font-bold leading-7 text-gray-900 dark:text-white transition-colors group-hover:text-[#00d9ff]">
                            <span>{blog.title}</span>
                            <ArrowIcon />
                          </h3>

                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500 dark:text-white/50">
                            {getExcerpt(blog.excerpt, blog.content)}
                          </p>
                        </div>
                      </Link>

                      <div className="flex flex-1 flex-col justify-end p-6 pt-4">
                        {blog.fields.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {blog.fields.slice(0, 2).map((item) => (
                              <Link
                                key={item.fieldId}
                                href={`/field/${item.field.slug}`}
                                className="rounded-full bg-[#00a8ff]/10 px-2.5 py-1 text-xs font-semibold text-[#00d9ff] transition hover:bg-[#00a8ff]/20"
                              >
                                {item.field.name}
                              </Link>
                            ))}
                          </div>
                        )}

                        {blog.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {blog.tags.slice(0, 3).map((item) => (
                              <span
                                key={item.tagId}
                                className="rounded-full bg-gray-100 dark:bg-white/10 px-2.5 py-1 text-xs font-medium text-gray-500 dark:text-white/60"
                              >
                                #{item.tag.name}
                              </span>
                            ))}
                          </div>
                        )}
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