import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/* =====================================================
   CLEAN IMAGE DATA
===================================================== */

function cleanImages(images: unknown) {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .filter(
      (image): image is Record<string, unknown> =>
        typeof image === "object" &&
        image !== null
    )
    .map((image, index) => ({
      publicId:
        typeof image.publicId === "string"
          ? image.publicId
          : "",

      url:
        typeof image.url === "string"
          ? image.url
          : "",

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
        image.isPrimary === true,
    }))
    .filter((image) => image.url);
}

/* =====================================================
   DELETE CLOUDINARY IMAGES
===================================================== */

async function deleteUnusedCloudinaryImages(
  publicIds: string[]
) {
  const uniqueIds = [
    ...new Set(
      publicIds.filter(
        (id) =>
          id &&
          id.startsWith("cyberincidents/blogs/")
      )
    ),
  ];

  if (uniqueIds.length === 0) {
    return;
  }

  for (const publicId of uniqueIds) {
    try {
      const result =
        await cloudinary.uploader.destroy(
          publicId,
          {
            resource_type: "image",
            invalidate: true,
          }
        );

      console.log(
        "CLOUDINARY IMAGE DELETE:",
        publicId,
        result.result
      );
    } catch (error) {
      /*
       * Cloudinary cleanup is secondary.
       *
       * If deletion fails, the blog operation should
       * still remain successful because the database
       * has already been updated/deleted.
       */
      console.error(
        "CLOUDINARY DELETE ERROR:",
        publicId,
        error
      );
    }
  }
}

/* =====================================================
   REQUIRE ADMIN
===================================================== */

async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  if (session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}

/* =====================================================
   GET BLOG
===================================================== */

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await context.params;

    const blog =
      await prisma.blog.findUnique({
        where: {
          id,
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

    if (!blog) {
      return NextResponse.json(
        {
          message: "Blog not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error(
      "GET ADMIN BLOG ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Unable to load blog",
      },
      {
        status: 500,
      }
    );
  }
}

/* =====================================================
   UPDATE BLOG
===================================================== */

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    /* -----------------------------------------------
       Authentication
    ------------------------------------------------ */

    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /* -----------------------------------------------
       Blog ID
    ------------------------------------------------ */

    const { id } = await context.params;

    /* -----------------------------------------------
       Get existing blog
    ------------------------------------------------ */

    const existingBlog =
      await prisma.blog.findUnique({
        where: {
          id,
        },

        include: {
          images: true,
        },
      });

    if (!existingBlog) {
      return NextResponse.json(
        {
          message: "Blog not found",
        },
        {
          status: 404,
        }
      );
    }

    /* -----------------------------------------------
       Request body
    ------------------------------------------------ */

    const body = await request.json();

    /* -----------------------------------------------
       Basic fields
    ------------------------------------------------ */

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const slug =
      typeof body.slug === "string"
        ? body.slug.trim()
        : "";

    const excerpt =
      typeof body.excerpt === "string"
        ? body.excerpt.trim()
        : "";

    const content =
      typeof body.content === "string"
        ? body.content
        : "";

    /* -----------------------------------------------
       Access
    ------------------------------------------------ */

    const access =
      body.access === "PAID"
        ? "PAID"
        : "FREE";

    /* -----------------------------------------------
       Status
    ------------------------------------------------ */

    const status =
      body.status === "PUBLISHED"
        ? "PUBLISHED"
        : body.status === "ARCHIVED"
          ? "ARCHIVED"
          : "DRAFT";

    /* -----------------------------------------------
       Featured
    ------------------------------------------------ */

    const featured =
      body.featured === true;

    /* -----------------------------------------------
       Fields
    ------------------------------------------------ */

    const fieldIds =
      Array.isArray(body.fieldIds)
        ? body.fieldIds.filter(
            (
              fieldId: unknown
            ): fieldId is string =>
              typeof fieldId === "string"
          )
        : [];

    /* -----------------------------------------------
       Validation
    ------------------------------------------------ */

    if (!title) {
      return NextResponse.json(
        {
          message: "Title is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!slug) {
      return NextResponse.json(
        {
          message: "Slug is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!content.trim()) {
      return NextResponse.json(
        {
          message: "Content is required",
        },
        {
          status: 400,
        }
      );
    }

    if (fieldIds.length === 0) {
      return NextResponse.json(
        {
          message:
            "At least one cybersecurity field is required",
        },
        {
          status: 400,
        }
      );
    }

    /* -----------------------------------------------
       Check duplicate slug
    ------------------------------------------------ */

    const duplicate =
      await prisma.blog.findFirst({
        where: {
          slug,

          id: {
            not: id,
          },
        },
      });

    if (duplicate) {
      return NextResponse.json(
        {
          message:
            "Another blog already uses this slug",
        },
        {
          status: 409,
        }
      );
    }

    /* -----------------------------------------------
       Validate fields
    ------------------------------------------------ */

    const fields =
      await prisma.field.findMany({
        where: {
          id: {
            in: fieldIds,
          },
        },

        select: {
          id: true,
        },
      });

    if (
      fields.length !==
      fieldIds.length
    ) {
      return NextResponse.json(
        {
          message:
            "One or more selected fields are invalid",
        },
        {
          status: 400,
        }
      );
    }

    /* -----------------------------------------------
       Images
    ------------------------------------------------ */

    const images =
      cleanImages(body.images);

    if (images.length === 0) {
      return NextResponse.json(
        {
          message:
            "A primary image is required",
        },
        {
          status: 400,
        }
      );
    }

    /* -----------------------------------------------
       Normalize primary image
    ------------------------------------------------ */

    const primaryIndex =
      images.findIndex(
        (image) =>
          image.isPrimary
      );

    const normalizedImages =
      images.map(
        (image, index) => ({
          ...image,

          isPrimary:
            primaryIndex === -1
              ? index === 0
              : index ===
                primaryIndex,

          sortOrder: index,
        })
      );

    /* -----------------------------------------------
       Published date
    ------------------------------------------------ */

    let publishedAt =
      existingBlog.publishedAt;

    if (
      status === "PUBLISHED" &&
      !publishedAt
    ) {
      publishedAt = new Date();
    }

    if (
      status !== "PUBLISHED"
    ) {
      publishedAt = null;
    }

    /* -----------------------------------------------
       Determine removed Cloudinary images
    ------------------------------------------------ */

    const oldPublicIds =
      existingBlog.images
        .map(
          (image) =>
            image.publicId
        )
        .filter(
          (publicId) =>
            typeof publicId ===
              "string" &&
            publicId.length > 0
        );

    const newPublicIds =
      normalizedImages
        .map(
          (image) =>
            image.publicId
        )
        .filter(
          (publicId) =>
            typeof publicId ===
              "string" &&
            publicId.length > 0
        );

    const removedPublicIds =
      oldPublicIds.filter(
        (publicId) =>
          !newPublicIds.includes(
            publicId
          )
      );

    /* -----------------------------------------------
       Find images shared by other blogs
    ------------------------------------------------ */

    const sharedImages =
      removedPublicIds.length > 0
        ? await prisma.blogImage.findMany(
            {
              where: {
                publicId: {
                  in: removedPublicIds,
                },

                blogId: {
                  not: id,
                },
              },

              select: {
                publicId: true,
              },
            }
          )
        : [];

    const sharedPublicIds =
      new Set(
        sharedImages.map(
          (image) =>
            image.publicId
        )
      );

    /*
     * Only delete Cloudinary assets that are no longer
     * referenced by any other blog.
     */

    const safeToDelete =
      removedPublicIds.filter(
        (publicId) =>
          !sharedPublicIds.has(
            publicId
          )
      );

    /* -----------------------------------------------
       Update database
    ------------------------------------------------ */

    const blog =
      await prisma.$transaction(
        async (tx) => {
          /* -----------------------------------------
             Remove old field relations
          ------------------------------------------ */

          await tx.blogField.deleteMany({
            where: {
              blogId: id,
            },
          });

          /* -----------------------------------------
             Remove old image relations
          ------------------------------------------ */

          await tx.blogImage.deleteMany({
            where: {
              blogId: id,
            },
          });

          /* -----------------------------------------
             Update blog
          ------------------------------------------ */

          const updatedBlog =
            await tx.blog.update({
              where: {
                id,
              },

              data: {
                title,
                slug,

                excerpt:
                  excerpt || null,

                content,

                author:
                  "CyberIncidents Team",

                access,
                status,
                featured,
                publishedAt,

                /* -------------------------------
                   Fields
                -------------------------------- */

                    fields: {
                        create: fieldIds.map(
                            (fieldId: string) => ({
                            fieldId,
                            })
                        ),
                        },

                /* -------------------------------
                   Images
                -------------------------------- */

                images: {
                  create:
                    normalizedImages.map(
                      (
                        image
                      ) => ({
                        publicId:
                          image.publicId ||
                          `blog-${Date.now()}-${image.sortOrder}`,

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
                    sortOrder:
                      "asc",
                  },
                },
              },
            });

          return updatedBlog;
        }
      );

    /* -----------------------------------------------
       Cloudinary cleanup
       Only happens AFTER successful DB update
    ------------------------------------------------ */

    if (
      safeToDelete.length > 0
    ) {
      await deleteUnusedCloudinaryImages(
        safeToDelete
      );
    }

    /* -----------------------------------------------
       Response
    ------------------------------------------------ */

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error(
      "UPDATE ADMIN BLOG ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to update blog",
      },
      {
        status: 500,
      }
    );
  }
}

/* =====================================================
   DELETE BLOG
===================================================== */

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    /* -----------------------------------------------
       Authentication
    ------------------------------------------------ */

    const session =
      await requireAdmin();

    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /* -----------------------------------------------
       Blog ID
    ------------------------------------------------ */

    const { id } =
      await context.params;

    /* -----------------------------------------------
       Get blog and images
    ------------------------------------------------ */

    const blog =
      await prisma.blog.findUnique({
        where: {
          id,
        },

        include: {
          images: true,
        },
      });

    if (!blog) {
      return NextResponse.json(
        {
          message:
            "Blog not found",
        },
        {
          status: 404,
        }
      );
    }

    /* -----------------------------------------------
       Collect Cloudinary public IDs
    ------------------------------------------------ */

    const publicIds =
      blog.images
        .map(
          (image) =>
            image.publicId
        )
        .filter(
          (publicId) =>
            typeof publicId ===
              "string" &&
            publicId.length > 0
        );

    /* -----------------------------------------------
       Check shared images
    ------------------------------------------------ */

    const otherImages =
      publicIds.length > 0
        ? await prisma.blogImage.findMany(
            {
              where: {
                publicId: {
                  in: publicIds,
                },

                blogId: {
                  not: id,
                },
              },

              select: {
                publicId: true,
              },
            }
          )
        : [];

    const sharedPublicIds =
      new Set(
        otherImages.map(
          (image) =>
            image.publicId
        )
      );

    const safeToDelete =
      publicIds.filter(
        (publicId) =>
          !sharedPublicIds.has(
            publicId
          )
      );

    /* -----------------------------------------------
       Delete blog from database
    ------------------------------------------------ */

    await prisma.blog.delete({
      where: {
        id,
      },
    });

    /* -----------------------------------------------
       Delete unused Cloudinary assets
    ------------------------------------------------ */

    if (
      safeToDelete.length > 0
    ) {
      await deleteUnusedCloudinaryImages(
        safeToDelete
      );
    }

    /* -----------------------------------------------
       Response
    ------------------------------------------------ */

    return NextResponse.json({
      success: true,
      message:
        "Blog deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE ADMIN BLOG ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to delete blog",
      },
      {
        status: 500,
      }
    );
  }
}