import Link from "next/link";

type LatestBlog = {
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
};

type LatestBlogsProps = {
  blogs: LatestBlog[];
};

function formatDate(date: Date | null) {
  if (!date) {
    return "";
  }

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function getPrimaryImage(blog: LatestBlog) {
  return blog.images.find((image) => image.isPrimary) ?? blog.images[0];
}

function getShortDescription(blog: LatestBlog, maxLength: number) {
  if (blog.excerpt?.trim()) {
    const excerpt = blog.excerpt.trim();

    if (excerpt.length <= maxLength) {
      return excerpt;
    }

    return `${excerpt.slice(0, maxLength).trim()}...`;
  }

  const plainText = blog.content
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trim()}...`;
}

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function LatestBlogs({ blogs }: LatestBlogsProps) {
  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="bg-white dark:bg-[#05070a]">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-gray-900 dark:text-white sm:text-4xl">
              Latest posts
            </h2>
            <p className="mt-3 max-w-sm text-[15px] leading-6 text-gray-500 dark:text-white/50">
              {blogs.length} {blogs.length === 1 ? "entry" : "entries"}, most
              recent posts.
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#00a8ff]"
          >
            All posts
            <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-white/10">
          {blogs.map((blog, index) => {
            const primaryImage = getPrimaryImage(blog);
            const description = getShortDescription(blog, 150);

            return (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group relative flex items-center gap-5 border-b border-gray-200 dark:border-white/10 py-6 sm:gap-8 sm:py-7"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-5 top-0 h-full w-px bg-gradient-to-b from-[#00a8ff] to-[#00d9ff] opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:-left-8"
                />

                <span className="hidden shrink-0 font-mono text-sm text-gray-400 dark:text-white/30 transition-colors duration-200 group-hover:text-[#00a8ff] sm:block">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[19px] font-bold leading-[1.3] tracking-[-0.01em] text-gray-900 dark:text-white transition-colors duration-200 group-hover:text-[#00a8ff] sm:text-[21px]">
                      {blog.title}
                    </h3>

                    {blog.featured && (
                      <span className="shrink-0 border border-[#00a8ff]/40 bg-[#00a8ff]/10 px-2 py-0.5 font-mono text-[11px] text-[#00d9ff]">
                        featured
                      </span>
                    )}
                  </div>

                  {description && (
                    <p className="mt-2 line-clamp-1 max-w-xl text-[14px] leading-6 text-gray-500 dark:text-white/50">
                      {description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[12px] text-gray-400 dark:text-white/40">
                    {blog.publishedAt && (
                      <time dateTime={new Date(blog.publishedAt).toISOString()}>
                        {formatDate(blog.publishedAt)}
                      </time>
                    )}

                    {blog.publishedAt && blog.readTime && <span>/</span>}

                    {blog.readTime && <span>{blog.readTime} min</span>}
                  </div>
                </div>

                <div className="hidden h-20 w-28 shrink-0 overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 sm:block">
                  {primaryImage?.url ? (
                    <img
                      src={primaryImage.url}
                      alt={primaryImage.altText ?? blog.title}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.06] group-hover:opacity-100"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-mono text-[10px] text-gray-400 dark:text-white/30">
                      no image
                    </div>
                  )}
                </div>

                <ArrowIcon className="hidden h-4 w-4 shrink-0 text-gray-300 dark:text-white/30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#00a8ff] md:block" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}