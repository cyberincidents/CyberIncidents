import { randomBytes } from "crypto";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
  sendSubscriptionConfirmationEmail,
} from "@/lib/notifications/email";

const COOKIE_NAME =
  "cyberincidents_notification_token";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateUnsubscribeToken() {
  return randomBytes(32).toString("hex");
}

function setSubscriptionCookie(
  response: NextResponse,
  token: string
) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    /* -------------------------------------------------
       VALIDATE EMAIL
    ------------------------------------------------- */

    if (!email) {
      return NextResponse.json(
        {
          error: "Email address is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (email.length > 254) {
      return NextResponse.json(
        {
          error: "Email address is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------
       FIND EXISTING SUBSCRIBER
    ------------------------------------------------- */

    const existingSubscriber =
      await prisma.notificationSubscriber.findUnique({
        where: {
          email,
        },
      });

    /* -------------------------------------------------
       EXISTING ACTIVE SUBSCRIBER
    ------------------------------------------------- */

    if (existingSubscriber?.active) {
      const response = NextResponse.json({
        success: true,
        subscribed: true,
        message:
          "You're already subscribed to CyberIncidents.",
      });

      if (existingSubscriber.unsubscribeToken) {
        setSubscriptionCookie(
          response,
          existingSubscriber.unsubscribeToken
        );
      }

      return response;
    }

    /* -------------------------------------------------
       REACTIVATE EXISTING SUBSCRIBER
    ------------------------------------------------- */

    if (existingSubscriber) {
      const unsubscribeToken =
        generateUnsubscribeToken();

      const updatedSubscriber =
        await prisma.notificationSubscriber.update({
          where: {
            id: existingSubscriber.id,
          },
          data: {
            active: true,
            unsubscribeToken,
            tokenExpiresAt: null,
          },
        });

      /*
       * Send subscription confirmation.
       *
       * If the email provider fails, the subscription
       * itself remains active. The error is logged on
       * the server instead of cancelling the subscription.
       */
      try {
        await sendSubscriptionConfirmationEmail(
          updatedSubscriber.email,
          updatedSubscriber.unsubscribeToken!
        );
      } catch (error) {
        console.error(
          "SUBSCRIPTION REACTIVATION EMAIL ERROR:",
          error
        );
      }

      const response = NextResponse.json({
        success: true,
        subscribed: true,
        message:
          "Your subscription has been reactivated.",
      });

      setSubscriptionCookie(
        response,
        updatedSubscriber.unsubscribeToken!
      );

      return response;
    }

    /* -------------------------------------------------
       NEW SUBSCRIBER
    ------------------------------------------------- */

    const unsubscribeToken =
      generateUnsubscribeToken();

    const subscriber =
      await prisma.notificationSubscriber.create({
        data: {
          email,
          verified: false,
          active: true,
          unsubscribeToken,
          tokenExpiresAt: null,
        },
      });

    /*
     * Send subscription confirmation email.
     *
     * The email contains:
     * - Subscription confirmation
     * - CyberIncidents link
     * - Unsubscribe link
     */
    try {
      await sendSubscriptionConfirmationEmail(
        subscriber.email,
        subscriber.unsubscribeToken!
      );
    } catch (error) {
      console.error(
        "SUBSCRIPTION CONFIRMATION EMAIL ERROR:",
        error
      );
    }

    /* -------------------------------------------------
       RESPONSE
    ------------------------------------------------- */

    const response = NextResponse.json(
      {
        success: true,
        subscribed: true,
        message:
          "You're subscribed to CyberIncidents.",
      },
      {
        status: 201,
      }
    );

    setSubscriptionCookie(
      response,
      subscriber.unsubscribeToken!
    );

    return response;
  } catch (error) {
    console.error(
      "Notification subscription error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}