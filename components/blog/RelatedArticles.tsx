import Link from "next/link";

type RelatedBlog = {
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

type RelatedArticlesProps = {
  blogs: RelatedBlog[];
};

function formatDate(date: Date | null) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getPrimaryImage(blog: RelatedBlog) {
  return (
    blog.images.find(
      (image) => image.isPrimary
    ) ?? blog.images[0]
  );
}

function getShortDescription(blog: RelatedBlog) {
  if (blog.excerpt?.trim()) {
    const excerpt = blog.excerpt.trim();

    if (excerpt.length <= 180) {
      return excerpt;
    }

    return `${excerpt.slice(0, 180).trim()}...`;
  }

  const plainText = blog.content
    .replace(/<[^>]*>/g, " ")
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(
      /\[([^\]]+)\]\([^)]+\)/g,
      "$1"
    )
    .replace(
      /!\[([^\]]*)\]\([^)]+\)/g,
      "$1"
    )
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= 180) {
    return plainText;
  }

  return `${plainText.slice(0, 180).trim()}...`;
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[18px] w-[18px]"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2"
      />
      <path d="M16 2v4M8 2v4M3 9h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[18px] w-[18px]"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export default function RelatedArticles({
  blogs,
}: RelatedArticlesProps) {
  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="bg-white dark:bg-[#05070a]">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00a8ff]">
            Continue reading
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-gray-900 dark:text-white sm:text-4xl lg:text-[42px]">
            Related Articles
          </h2>
        </div>

        <div className="border-t border-gray-200 dark:border-white/10">
          {blogs.map((blog) => {
            const primaryImage = getPrimaryImage(blog);
            const description = getShortDescription(blog);

            return (
              <article
                key={blog.id}
                className="border-b border-gray-200 dark:border-white/10 py-8 sm:py-10"
              >
                <Link
                  href={`/blog/${blog.slug}`}
                  className="group block"
                >
                  <div className="grid gap-7 sm:grid-cols-[minmax(0,1fr)_200px] sm:items-center sm:gap-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12">
                    <div className="min-w-0">
                      {blog.fields[0]?.field?.name && (
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#00a8ff]">
                          {blog.fields[0].field.name}
                        </p>
                      )}

                      <h3 className="text-[24px] font-bold leading-[1.2] tracking-[-0.025em] text-gray-900 dark:text-white transition-colors duration-200 group-hover:text-[#00d9ff] sm:text-[27px]">
                        {blog.title}
                      </h3>

                      {description && (
                        <p className="mt-4 line-clamp-2 max-w-3xl text-[16px] leading-7 text-gray-600 dark:text-white/60 sm:text-[17px]">
                          {description}
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-white/40">
                        {blog.publishedAt && (
                          <div className="flex items-center gap-2">
                            <CalendarIcon />
                            <time
                              dateTime={new Date(
                                blog.publishedAt
                              ).toISOString()}
                            >
                              {formatDate(blog.publishedAt)}
                            </time>
                          </div>
                        )}

                        {blog.publishedAt && blog.readTime && (
                          <span
                            aria-hidden="true"
                            className="h-5 w-px bg-gray-300 dark:bg-white/20"
                          />
                        )}

                        {blog.readTime && (
                          <div className="flex items-center gap-2">
                            <ClockIcon />
                            <span>{blog.readTime} min read</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="order-first sm:order-last">
                      <div className="aspect-[16/10] w-full overflow-hidden rounded-sm bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                        {primaryImage?.url ? (
                          <img
                            src={primaryImage.url}
                            alt={primaryImage.altText ?? blog.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-white/5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/30">
                            No image
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}