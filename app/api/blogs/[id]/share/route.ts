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

    const body = await request.json().catch(() => ({}));
    const platform = body.platform;

    const validPlatforms = [
      "WHATSAPP",
      "LINKEDIN",
      "X",
      "FACEBOOK",
      "COPY_LINK",
      "OTHER",
    ];

    const selectedPlatform = validPlatforms.includes(platform)
      ? platform
      : "OTHER";

    const blog = await prisma.blog.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
      },
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    if (blog.status !== "PUBLISHED") {
      return NextResponse.json(
        { success: false, message: "Blog is not published" },
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

    const event = await prisma.shareEvent.create({
      data: {
        blogId: blog.id,
        platform: selectedPlatform,
        ipHash: hashIp(ip),
        userAgent,
        referer,
      },
    });

    return NextResponse.json({
      success: true,
      shareId: event.id,
    });
  } catch (error) {
    console.error("BLOG SHARE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to record share",
      },
      { status: 500 }
    );
  }
}