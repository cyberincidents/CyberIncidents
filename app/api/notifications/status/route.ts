import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "cyberincidents_notification_token";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({
        subscribed: false,
      });
    }

    const subscriber =
      await prisma.notificationSubscriber.findUnique({
        where: {
          unsubscribeToken: token,
        },
        select: {
          id: true,
          active: true,
        },
      });

    if (!subscriber || !subscriber.active) {
      return NextResponse.json({
        subscribed: false,
      });
    }

    return NextResponse.json({
      subscribed: true,
    });
  } catch (error) {
    console.error(
      "Notification status error:",
      error
    );

    return NextResponse.json(
      {
        subscribed: false,
      },
      {
        status: 500,
      }
    );
  }
}