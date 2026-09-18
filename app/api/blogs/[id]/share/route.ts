import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function hashIp(ip: string) {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  return crypto
    .createHash("sha256")
    .update(`${ip}:${secret}`)
    .digest("hex");
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const firstIp = forwardedFor
      .split(",")[0]
      ?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = request.headers.get("x-real-ip")?.trim();

  if (realIp) {
    return realIp;
  }

  return "unknown";
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

    // --------------------------------------------------
    // Identify requester
    // --------------------------------------------------

    const ip = getClientIp(request);
    const ipHash = hashIp(ip);

    // --------------------------------------------------
    // Rate limit
    //
    // Maximum 30 share requests from the same IP
    // within a rolling 60-second window.
    // --------------------------------------------------

    const windowStart = new Date(
      Date.now() - RATE_LIMIT_WINDOW_MS
    );

    const recentShareCount =
      await prisma.shareEvent.count({
        where: {
          ipHash,
          createdAt: {
            gte: windowStart,
          },
        },
      });

    if (recentShareCount >= RATE_LIMIT) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many share requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
          },
        }
      );
    }

    // --------------------------------------------------
    // Verify blog
    // --------------------------------------------------

    const blog = await prisma.blog.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
      },
    });

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    if (blog.status !== "PUBLISHED") {
      return NextResponse.json(
        {
          success: false,
          message: "Blog is not published",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // Request metadata
    // --------------------------------------------------

    const userAgent =
      request.headers.get("user-agent") || undefined;

    const referer =
      request.headers.get("referer") || undefined;

    // --------------------------------------------------
    // Record share event
    // --------------------------------------------------

    const event = await prisma.shareEvent.create({
      data: {
        blogId: blog.id,
        platform: selectedPlatform,
        ipHash,
        userAgent,
        referer,
      },
    });

    // --------------------------------------------------
    // Response
    // --------------------------------------------------

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