import { NextResponse } from "next/server";
import { searchPublishedBlogs } from "@/lib/data/db-blogs";

export async function GET(request: Request) {
  try {
    const { searchParams } =
      new URL(request.url);

    const query =
      searchParams.get("q")?.trim() ?? "";

    /*
     * Empty search.
     */

    if (!query) {
      return NextResponse.json({
        success: true,
        blogs: [],
      });
    }

    /*
     * Limit the query length.
     */

    const safeQuery = query.slice(0, 100);

    /*
     * Search published blogs.
     */

    const blogs =
      await searchPublishedBlogs(
        safeQuery
      );

    /*
     * Return only what the navbar needs.
     */

    const results = blogs
      .slice(0, 8)
      .map((blog) => {
        const primaryImage =
          blog.images.find(
            (image) =>
              image.isPrimary
          ) ?? blog.images[0];

        const firstField =
          blog.fields[0]?.field;

        return {
          id: blog.id,
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          image:
            primaryImage?.url ?? null,
          field:
            firstField?.name ??
            "Cyber Security",
          fieldSlug:
            firstField?.slug ?? "",
          publishedAt:
            blog.publishedAt
              ? blog.publishedAt.toISOString()
              : null,
          readTime:
            blog.readTime ?? null,
        };
      });

    return NextResponse.json({
      success: true,
      blogs: results,
    });
  } catch (error) {
    console.error(
      "SEARCH API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        blogs: [],
        error:
          "Unable to search articles.",
      },
      {
        status: 500,
      }
    );
  }
}