import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function hashIp(ip: string) {
  return crypto
    .createHash("sha256")
    .update(`${ip}:${process.env.AUTH_SECRET}`)
    .digest("hex");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("VIEW API CALLED:", id);

    const blog = await prisma.blog.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!blog) {
      console.log("BLOG NOT FOUND:", id);

      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    if (blog.status !== "PUBLISHED") {
      console.log("BLOG NOT PUBLISHED:", id);

      return NextResponse.json(
        {
          success: false,
          message: "Blog is not published",
        },
        { status: 403 }
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for");

    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const userAgent =
      request.headers.get("user-agent") || undefined;

    const referer =
      request.headers.get("referer") || undefined;

    const event = await prisma.blogViewEvent.create({
      data: {
        blogId: blog.id,
        ipHash: hashIp(ip),
        userAgent,
        referer,
      },
    });

    console.log("VIEW EVENT CREATED:", event.id);

    return NextResponse.json({
      success: true,
      viewId: event.id,
    });
  } catch (error) {
    console.error("BLOG VIEW ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to record view",
      },
      { status: 500 }
    );
  }
}