import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

import {
  sendUnsubscriptionConfirmationEmail,
} from "@/lib/notifications/email";

const COOKIE_NAME = "cyberincidents_notification_token";

type UnsubscribeResult =
  | {
      success: true;
      status: 200;
      alreadyUnsubscribed: boolean;
      email: string;
      message: string;
    }
  | {
      success: false;
      status: 400 | 404;
      error: string;
    };

/* =====================================================
   COOKIE CLEARING
===================================================== */

function clearSubscriptionCookie(response: NextResponse) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/* =====================================================
   UNSUBSCRIBE USING TOKEN
===================================================== */

async function unsubscribeWithToken(
  token: string
): Promise<UnsubscribeResult> {
  if (!token || token.length !== 64) {
    return {
      success: false,
      status: 400,
      error: "Invalid unsubscribe token.",
    };
  }

  const subscriber =
    await prisma.notificationSubscriber.findUnique({
      where: {
        unsubscribeToken: token,
      },
      select: {
        id: true,
        email: true,
        active: true,
        tokenExpiresAt: true,
      },
    });

  if (!subscriber) {
    return {
      success: false,
      status: 404,
      error: "Invalid or expired unsubscribe link.",
    };
  }

  /* -------------------------------------------------
     TOKEN EXPIRATION
  ------------------------------------------------- */

  if (
    subscriber.tokenExpiresAt &&
    subscriber.tokenExpiresAt < new Date()
  ) {
    return {
      success: false,
      status: 400,
      error: "This unsubscribe link has expired.",
    };
  }

  /* -------------------------------------------------
     ALREADY UNSUBSCRIBED
  ------------------------------------------------- */

  if (!subscriber.active) {
    return {
      success: true,
      status: 200,
      alreadyUnsubscribed: true,
      email: subscriber.email,
      message:
        "You are already unsubscribed from CyberIncidents.",
    };
  }

  /* -------------------------------------------------
     DEACTIVATE SUBSCRIBER
  ------------------------------------------------- */

  await prisma.notificationSubscriber.update({
    where: {
      id: subscriber.id,
    },
    data: {
      active: false,
      unsubscribeToken: null,
      tokenExpiresAt: null,
    },
  });

  /* -------------------------------------------------
     SEND CONFIRMATION EMAIL
  ------------------------------------------------- */

  try {
    await sendUnsubscriptionConfirmationEmail(
      subscriber.email
    );
  } catch (error) {
    /*
     * The unsubscribe action has already succeeded.
     * Do not reactivate the subscriber if email sending
     * fails.
     */
    console.error(
      "UNSUBSCRIPTION CONFIRMATION EMAIL ERROR:",
      error
    );
  }

  return {
    success: true,
    status: 200,
    alreadyUnsubscribed: false,
    email: subscriber.email,
    message:
      "You have been unsubscribed from CyberIncidents.",
  };
}

/* =====================================================
   FOOTER UNSUBSCRIBE
   POST /api/notifications/unsubscribe
===================================================== */

export async function POST() {
  try {
    const cookieStore = await cookies();

    const token =
      cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: "You are not subscribed.",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await unsubscribeWithToken(token);

    const response = NextResponse.json(
      result.success
        ? {
            success: true,
            subscribed: false,
            message: result.message,
          }
        : {
            error: result.error,
          },
      {
        status: result.status,
      }
    );

    /* Always clear the browser cookie */
    clearSubscriptionCookie(response);

    return response;
  } catch (error) {
    console.error(
      "Notification unsubscribe error:",
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

/* =====================================================
   EMAIL UNSUBSCRIBE
   GET /api/notifications/unsubscribe?token=...
===================================================== */

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const token =
      url.searchParams.get("token")?.trim() || "";

    if (!token) {
      return new NextResponse(
        createResultPage(
          "Invalid unsubscribe link",
          "This unsubscribe link is missing its security token.",
          false
        ),
        {
          status: 400,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        }
      );
    }

    const result =
      await unsubscribeWithToken(token);

    if (!result.success) {
      return new NextResponse(
        createResultPage(
          "Unsubscribe failed",
          result.error,
          false
        ),
        {
          status: result.status,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        }
      );
    }

    const response = new NextResponse(
      createResultPage(
        result.alreadyUnsubscribed
          ? "Already unsubscribed"
          : "Successfully unsubscribed",
        result.message,
        true
      ),
      {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      }
    );

    /*
     * If this request came from the browser that has the
     * subscription cookie, remove it as well.
     */
    clearSubscriptionCookie(response);

    return response;
  } catch (error) {
    console.error(
      "Notification email unsubscribe error:",
      error
    );

    return new NextResponse(
      createResultPage(
        "Something went wrong",
        "We could not process your unsubscribe request. Please try again later.",
        false
      ),
      {
        status: 500,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      }
    );
  }
}

/* =====================================================
   SIMPLE UNSUBSCRIBE RESULT PAGE
===================================================== */

function createResultPage(
  title: string,
  message: string,
  success: boolean
) {
  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);

  const icon = success ? "✓" : "!";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>${safeTitle} - CyberIncidents</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: #050607;
      color: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
    }

    .card {
      width: 100%;
      max-width: 520px;
      padding: 40px;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 18px;
      background: #0b0d0f;
      text-align: center;
    }

    .accent {
      height: 2px;
      width: 100%;
      margin-bottom: 32px;
      background: linear-gradient(
        90deg,
        transparent,
        #00d9ff,
        transparent
      );
    }

    .icon {
      width: 52px;
      height: 52px;
      margin: 0 auto 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: ${
        success
          ? "rgba(52,211,153,0.1)"
          : "rgba(248,113,113,0.1)"
      };
      color: ${
        success ? "#34d399" : "#f87171"
      };
      font-size: 24px;
      font-weight: 700;
    }

    .brand {
      margin-bottom: 8px;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 2px;
    }

    .brand span {
      color: #00d9ff;
    }

    h1 {
      margin: 24px 0 0;
      font-size: 28px;
      line-height: 1.25;
    }

    p {
      margin: 14px 0 0;
      color: rgba(255,255,255,0.5);
      font-size: 14px;
      line-height: 1.7;
    }

    .button {
      display: inline-block;
      margin-top: 28px;
      padding: 12px 20px;
      border-radius: 8px;
      background: #00d9ff;
      color: #020405;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
    }
  </style>
</head>

<body>
  <main class="card">
    <div class="accent"></div>

    <div class="brand">
      CYBER<span>INCIDENTS</span>
    </div>

    <div class="icon">${icon}</div>

    <h1>${safeTitle}</h1>

    <p>${safeMessage}</p>

    <a
      href="/"
      class="button"
    >
      Visit CyberIncidents
    </a>
  </main>
</body>
</html>
`;
}

/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}