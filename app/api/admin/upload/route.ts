import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    // --------------------------------------------------
    // Check authentication
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

    // --------------------------------------------------
    // Check admin role
    // --------------------------------------------------

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
    // Check Cloudinary configuration
    // --------------------------------------------------

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cloudinary is not configured correctly.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // Get uploaded file
    // --------------------------------------------------

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No image file provided.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Validate file type
    // --------------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only JPG, PNG, WebP and GIF images are allowed.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Validate file size
    // --------------------------------------------------

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Image must be smaller than 10MB.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Convert file to Buffer
    // --------------------------------------------------

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    // --------------------------------------------------
    // Upload to Cloudinary
    // --------------------------------------------------

    const result =
      await new Promise<{
        public_id: string;
        secure_url: string;
        width: number;
        height: number;
      }>((resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder:
                "cyberincidents/blogs",
              resource_type: "image",
            },
            (error, result) => {
              if (error || !result) {
                reject(
                  error ??
                    new Error(
                      "Cloudinary upload failed."
                    )
                );

                return;
              }

              resolve({
                public_id:
                  result.public_id,

                secure_url:
                  result.secure_url,

                width:
                  result.width,

                height:
                  result.height,
              });
            }
          );

        uploadStream.end(buffer);
      });

    // --------------------------------------------------
    // Return uploaded image information
    // --------------------------------------------------

    return NextResponse.json({
      success: true,

      image: {
        publicId:
          result.public_id,

        url:
          result.secure_url,

        width:
          result.width,

        height:
          result.height,
      },
    });
  } catch (error) {
    console.error(
      "CLOUDINARY UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to upload image.",
      },
      { status: 500 }
    );
  }
}