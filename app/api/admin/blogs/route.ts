import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import {
  sendNewBlogNotification,
} from "@/lib/notifications/email";

import { revalidatePath } from "next/cache";

/* =====================================================
   CALCULATE READING TIME
===================================================== */

function calculateReadTime(content: string) {
  const cleanContent = content
    // Remove HTML tags
    .replace(/<[^>]*>/g, " ")

    // Remove Markdown images
    .replace(/!\[.*?\]\(.*?\)/g, " ")

    // Keep Markdown link text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")

    // Remove Markdown formatting characters
    .replace(/#{1,6}\s/g, " ")
    .replace(/[*_~`]/g, " ")

    // Normalize whitespace
    .replace(/\s+/g, " ")
    .trim();

  const words = cleanContent
    .split(/\s+/)
    .filter(Boolean);

  const WORDS_PER_MINUTE = 200;

  return Math.max(
    1,
    Math.ceil(words.length / WORDS_PER_MINUTE)
  );
}

export async function POST(request: Request) {
  try {
    // --------------------------------------------------
    // Authentication
    // --------------------------------------------------

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // Request body
    // --------------------------------------------------

    const body = await request.json();

    const {
      title,
      slug,
      excerpt,
      content,
      access,
      status,
      featured,
      fieldIds,
      images,
    } = body;

    // --------------------------------------------------
    // Basic validation
    // --------------------------------------------------

    if (!title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 }
      );
    }

    if (!slug?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug is required",
        },
        { status: 400 }
      );
    }

    if (!content?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Content is required",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(fieldIds) || fieldIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one field is required",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Calculate reading time automatically
    // --------------------------------------------------

    const readTime = calculateReadTime(
      content.trim()
    );

    // --------------------------------------------------
    // Normalize status
    // --------------------------------------------------

    const normalizedStatus =
      status === "PUBLISHED"
        ? "PUBLISHED"
        : "DRAFT";

    const isPublished =
      normalizedStatus === "PUBLISHED";

    // --------------------------------------------------
    // Check duplicate blog slug
    // --------------------------------------------------

    const existingBlog = await prisma.blog.findUnique({
      where: {
        slug: slug.trim(),
      },
      select: {
        id: true,
      },
    });

    if (existingBlog) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A blog with this slug already exists",
        },
        { status: 409 }
      );
    }

    // --------------------------------------------------
    // Clean and validate fields
    // --------------------------------------------------

    const uniqueFieldIds = Array.from(
      new Set(
        fieldIds.filter(
          (fieldId: unknown): fieldId is string =>
            typeof fieldId === "string" &&
            fieldId.trim().length > 0
        )
      )
    );

    if (uniqueFieldIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "At least one valid field is required",
        },
        { status: 400 }
      );
    }

    const existingFields =
      await prisma.field.findMany({
        where: {
          id: {
            in: uniqueFieldIds,
          },
        },
        select: {
          id: true,
        },
      });

    if (
      existingFields.length !==
      uniqueFieldIds.length
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more selected fields do not exist",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Clean images
    // --------------------------------------------------

    const cleanImages = Array.isArray(images)
      ? images
          .filter(
            (image: unknown) =>
              typeof image === "object" &&
              image !== null &&
              typeof (image as { url?: unknown })
                .url === "string" &&
              (
                image as { url: string }
              ).url.trim().length > 0
          )
          .map(
            (
              image: {
                publicId?: string;
                url: string;
                width?: number;
                height?: number;
                sortOrder?: number;
                isPrimary?: boolean;
              },
              index: number
            ) => ({
              publicId:
                image.publicId?.trim() ||
                image.url.trim(),

              url: image.url.trim(),

              width:
                typeof image.width === "number"
                  ? image.width
                  : null,

              height:
                typeof image.height === "number"
                  ? image.height
                  : null,

              sortOrder:
                typeof image.sortOrder === "number"
                  ? image.sortOrder
                  : index,

              isPrimary:
                Boolean(image.isPrimary),
            })
          )
      : [];

    // --------------------------------------------------
    // Ensure only one primary image
    // --------------------------------------------------

    const primaryImageIndex =
      cleanImages.findIndex(
        (image) => image.isPrimary
      );

    const normalizedImages =
      cleanImages.map(
        (image, index) => ({
          ...image,

          isPrimary:
            primaryImageIndex === -1
              ? index === 0
              : index === primaryImageIndex,
        })
      );

    // --------------------------------------------------
    // Create blog
    // --------------------------------------------------

    const blog = await prisma.blog.create({
      data: {
        title: title.trim(),

        slug: slug.trim(),

        excerpt:
          excerpt?.trim() || null,

        content: content.trim(),

        // Automatically calculated from article content.
        // 200 words = approximately 1 minute.
        readTime,

        // All articles are published by the
        // CyberIncidents team.
        author: "CyberIncidents Team",

        access:
          access === "PAID"
            ? "PAID"
            : "FREE",

        status: normalizedStatus,

        featured: Boolean(featured),

        publishedAt:
          isPublished
            ? new Date()
            : null,

        // ------------------------------------------------
        // Blog fields
        // ------------------------------------------------

        fields: {
          create: uniqueFieldIds.map(
            (fieldId) => ({
              field: {
                connect: {
                  id: fieldId,
                },
              },
            })
          ),
        },

        // ------------------------------------------------
        // Blog images
        // ------------------------------------------------

        images: {
          create: normalizedImages.map(
            (image) => ({
              publicId:
                image.publicId,

              url:
                image.url,

              width:
                image.width,

              height:
                image.height,

              sortOrder:
                image.sortOrder,

              isPrimary:
                image.isPrimary,
            })
          ),
        },
      },

      include: {
        fields: {
          include: {
            field: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });
    
    // --------------------------------------------------
    // Revalidate public blog pages
    // --------------------------------------------------

    revalidatePath("/");
    revalidatePath("/field/[slug]", "page");
    revalidatePath("/blog/[slug]", "page");

    // --------------------------------------------------
    // Notify subscribers
    //

    // Only send when the newly created blog is published.
    //
    // The notification is intentionally not awaited so
    // a Resend failure cannot make the blog creation fail.
    // --------------------------------------------------

    if (isPublished) {
      void sendNewBlogNotification({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
      }).catch((error) => {
        console.error(
          "NEW BLOG NOTIFICATION ERROR:",
          error
        );
      });
    }

    // --------------------------------------------------
    // Success
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        blog,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE BLOG ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create blog",
      },
      {
        status: 500,
      }
    );
  }
}