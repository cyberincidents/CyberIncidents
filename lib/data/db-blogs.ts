import { prisma } from "@/lib/prisma";
import type {
  BlogAccess,
  BlogStatus,
  Prisma,
} from "@prisma/client";

/* =====================================================
   PUBLIC BLOG QUERIES
===================================================== */

export async function getBlogsByField(
  slug: string
) {
  return prisma.blog.findMany({
    where: {
      status: "PUBLISHED",

      fields: {
        some: {
          field: {
            slug,
          },
        },
      },
    },

    include: {
      fields: {
        include: {
          field: true,
        },
      },

      tags: {
        include: {
          tag: true,
        },
      },

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },

    orderBy: {
      publishedAt: "desc",
    },
  });
}

/* =====================================================
   FIELD
===================================================== */

export async function getFieldBySlug(
  slug: string
) {
  return prisma.field.findUnique({
    where: {
      slug,
    },
  });
}

/* =====================================================
   SINGLE PUBLIC BLOG
===================================================== */

export async function getBlogBySlug(
  slug: string
) {
  return prisma.blog.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },

    include: {
      fields: {
        include: {
          field: true,
        },
      },

      tags: {
        include: {
          tag: true,
        },
      },

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}

/* =====================================================
   LATEST BLOGS
===================================================== */

export async function getLatestBlogs(
  limit = 3
) {
  return prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
    },

    include: {
      fields: {
        include: {
          field: true,
        },
      },

      tags: {
        include: {
          tag: true,
        },
      },

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },

    orderBy: {
      publishedAt: "desc",
    },

    take: limit,
  });
}

/* =====================================================
   RELATED BLOGS
===================================================== */

export async function getRelatedBlogs(
  blogId: string,
  fieldId: string,
  limit = 3
) {
  return prisma.blog.findMany({
    where: {
      id: {
        not: blogId,
      },

      status: "PUBLISHED",

      fields: {
        some: {
          fieldId,
        },
      },
    },

    include: {
      fields: {
        include: {
          field: true,
        },
      },

      tags: {
        include: {
          tag: true,
        },
      },

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },

    orderBy: {
      publishedAt: "desc",
    },

    take: limit,
  });
}

/* =====================================================
   ALL PUBLISHED BLOGS
===================================================== */

export async function getAllPublishedBlogs(
  limit = 20
) {
  return prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
    },

    include: {
      fields: {
        include: {
          field: true,
        },
      },

      tags: {
        include: {
          tag: true,
        },
      },

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },

    orderBy: {
      publishedAt: "desc",
    },

    take: limit,
  });
}

/* =====================================================
   PUBLIC BLOG SEARCH
===================================================== */

export async function searchPublishedBlogs(
  searchTerm: string
) {
  const query = searchTerm.trim();

  if (!query) {
    return [];
  }

  return prisma.blog.findMany({
    where: {
      status: "PUBLISHED",

      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },

        {
          slug: {
            contains: query,
            mode: "insensitive",
          },
        },

        {
          excerpt: {
            contains: query,
            mode: "insensitive",
          },
        },

        {
          content: {
            contains: query,
            mode: "insensitive",
          },
        },

        {
          fields: {
            some: {
              field: {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
          },
        },

        {
          fields: {
            some: {
              field: {
                slug: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
          },
        },

        {
          tags: {
            some: {
              tag: {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
          },
        },

        {
          tags: {
            some: {
              tag: {
                slug: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },

    include: {
      fields: {
        include: {
          field: true,
        },
      },

      tags: {
        include: {
          tag: true,
        },
      },

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },

    orderBy: {
      publishedAt: "desc",
    },

    take: 30,
  });
}

/* =====================================================
   ALL PUBLISHED BLOG SLUGS
===================================================== */

export async function getAllPublishedBlogSlugs() {
  return prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
    },

    select: {
      slug: true,
    },
  });
}

/* =====================================================
   ADMIN BLOGS
===================================================== */

export type AdminBlogFilters = {
  search?: string;
  fieldId?: string;
  status?: BlogStatus;
  access?: BlogAccess;
  featured?: boolean;
};

export async function getAdminBlogs(
  filters: AdminBlogFilters = {}
) {
  const {
    search,
    fieldId,
    status,
    access,
    featured,
  } = filters;

  const where: Prisma.BlogWhereInput = {};

  /* -----------------------------------------------
     Search
  ------------------------------------------------ */

  if (search?.trim()) {
    const searchTerm =
      search.trim();

    where.OR = [
      {
        title: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },

      {
        slug: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },

      {
        excerpt: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  /* -----------------------------------------------
     Field filter
  ------------------------------------------------ */

  if (fieldId) {
    where.fields = {
      some: {
        fieldId,
      },
    };
  }

  /* -----------------------------------------------
     Status filter
  ------------------------------------------------ */

  if (status) {
    where.status = status;
  }

  /* -----------------------------------------------
     Access filter
  ------------------------------------------------ */

  if (access) {
    where.access = access;
  }

  /* -----------------------------------------------
     Featured filter
  ------------------------------------------------ */

  if (
    typeof featured === "boolean"
  ) {
    where.featured = featured;
  }

  /* -----------------------------------------------
     Query
  ------------------------------------------------ */

  return prisma.blog.findMany({
    where,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      fields: {
        include: {
          field: true,
        },
      },

      _count: {
        select: {
          viewEvents: true,
          shareEvents: true,
        },
      },
    },
  });
}

/* =====================================================
   BLOG VIEW COUNT
===================================================== */

export async function getBlogViewCount(
  blogId: string
) {
  return prisma.blogViewEvent.count({
    where: {
      blogId,
    },
  });
}

/* =====================================================
   BLOG VIEW COUNTS
===================================================== */

export async function getBlogViewCounts(
  blogIds: string[]
) {
  const results =
    await prisma.blogViewEvent.groupBy({
      by: ["blogId"],

      where: {
        blogId: {
          in: blogIds,
        },
      },

      _count: {
        blogId: true,
      },
    });

  return results.reduce<
    Record<string, number>
  >(
    (counts, result) => {
      counts[result.blogId] =
        result._count.blogId;

      return counts;
    },
    {}
  );
}