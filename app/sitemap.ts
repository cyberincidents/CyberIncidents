import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = "https://cyberincidents.in";

const MAIN_CATEGORY_SLUGS = [
  "cyber-news",
  "threats-attacks",
  "incident-investigation",
  "security-defense",
  "emerging-security",
  "guides-learning",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [fields, blogs] = await Promise.all([
    prisma.field.findMany({
      select: {
        id: true,
        slug: true,
        parentId: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.blog.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    }),
  ]);

  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  /*
   * ============================================================
   * MAIN CATEGORIES
   * ============================================================
   */

  const mainCategories = fields.filter(
    (field) =>
      !field.parentId &&
      MAIN_CATEGORY_SLUGS.includes(field.slug),
  );

  for (const category of mainCategories) {
    routes.push({
      url: `${SITE_URL}/field/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  /*
   * ============================================================
   * CHILD FIELDS
   * ============================================================
   */

  for (const category of mainCategories) {
    const childFields = fields.filter(
      (field) => field.parentId === category.id,
    );

    for (const field of childFields) {
      routes.push({
        url: `${SITE_URL}/field/${category.slug}/${field.slug}`,
        lastModified: field.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  /*
   * ============================================================
   * PUBLISHED BLOGS
   * ============================================================
   */

  for (const blog of blogs) {
    routes.push({
      url: `${SITE_URL}/blog/${blog.slug}`,
      lastModified:
        blog.updatedAt ?? blog.publishedAt ?? new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  return routes;
}