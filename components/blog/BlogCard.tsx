import Image from "next/image";
import Link from "next/link";
import type { Blog } from "@/lib/data/blogs";

type BlogCardProps = {
  blog: Blog;
};

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00a8ff]/40 hover:shadow-xl hover:shadow-[#00a8ff]/[0.08]">
      {/* Image */}
      <Link
        href={`/blog/${blog.slug}`}
        className="relative block aspect-[16/9] overflow-hidden bg-gray-100"
      >
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#00d9ff] backdrop-blur-sm">
          {blog.field}
        </span>
      </Link>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{blog.publishedAt}</span>

          <span className="h-1 w-1 rounded-full bg-gray-300" />

          <span>{blog.readTime}</span>
        </div>

        <Link href={`/blog/${blog.slug}`}>
          <h2 className="mt-3 text-xl font-bold leading-tight tracking-tight text-gray-900 transition-colors group-hover:text-[#008fd6]">
            {blog.title}
          </h2>
        </Link>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
          {blog.excerpt}
        </p>

        <Link
          href={`/blog/${blog.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#008fd6]"
        >
          Read More

          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}