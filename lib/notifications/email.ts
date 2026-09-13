import { Resend } from "resend";

import { prisma } from "@/lib/prisma";

const SITE_URL = (
  process.env.SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

const FROM_EMAIL =
  process.env.NOTIFICATION_FROM_EMAIL ||
  "CyberIncidents <onboarding@resend.dev>";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured."
    );
  }

  return new Resend(apiKey);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getUnsubscribeUrl(token: string) {
  return `${SITE_URL}/api/notifications/unsubscribe?token=${encodeURIComponent(
    token
  )}`;
}

function getSubscribeUrl() {
  return `${SITE_URL}/`;
}

function emailLayout(content: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>CyberIncidents</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f5f7fa;
    font-family:Arial,Helvetica,sans-serif;
    color:#0f172a;
  "
>
  <div style="padding:40px 16px;">
    <div
      style="
        max-width:600px;
        margin:0 auto;
        background:#ffffff;
        border:1px solid #e2e8f0;
        border-radius:16px;
        overflow:hidden;
      "
    >
      <div
        style="
          height:4px;
          background:#00a8ff;
        "
      ></div>

      <div style="padding:32px;">
        <div
          style="
            font-size:20px;
            font-weight:800;
            letter-spacing:1px;
            color:#0f172a;
          "
        >
          CYBER<span style="color:#00a8ff;">INCIDENTS</span>
        </div>

        <div style="margin-top:4px;color:#94a3b8;font-size:11px;letter-spacing:2px;">
          THREATS TODAY. A SAFER TOMORROW.
        </div>

        ${content}
      </div>

      <div
        style="
          border-top:1px solid #e2e8f0;
          padding:20px 32px;
          background:#f8fafc;
          color:#94a3b8;
          font-size:12px;
          line-height:1.6;
        "
      >
        <p style="margin:0;">
          You're receiving this email because you subscribed
          to CyberIncidents notifications.
        </p>

        <p style="margin:10px 0 0;">
          CyberIncidents
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

/* =====================================================
   SUBSCRIPTION CONFIRMATION
===================================================== */

export async function sendSubscriptionConfirmationEmail(
  email: string,
  unsubscribeToken: string
) {
  const resend = getResend();

  const unsubscribeUrl =
    getUnsubscribeUrl(unsubscribeToken);

  const html = emailLayout(`
    <h1
      style="
        margin:32px 0 0;
        font-size:28px;
        line-height:1.2;
      "
    >
      You're subscribed! ✓
    </h1>

    <p
      style="
        margin:16px 0 0;
        color:#475569;
        font-size:15px;
        line-height:1.7;
      "
    >
      Your CyberIncidents notification subscription is now
      active.
    </p>

    <p
      style="
        margin:16px 0 0;
        color:#475569;
        font-size:15px;
        line-height:1.7;
      "
    >
      We'll send you an email when a new cybersecurity
      article is published.
    </p>

    <div style="margin-top:28px;">
      <a
        href="${SITE_URL}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#0f172a;
          color:#ffffff;
          text-decoration:none;
          border-radius:8px;
          font-size:14px;
          font-weight:700;
        "
      >
        Visit CyberIncidents
      </a>
    </div>

    <p
      style="
        margin:28px 0 0;
        color:#94a3b8;
        font-size:12px;
        line-height:1.6;
      "
    >
      Don't want these notifications anymore?
      <a
        href="${unsubscribeUrl}"
        style="color:#0284c7;"
      >
        Unsubscribe
      </a>
    </p>
  `);

  const { data, error } =
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject:
        "You're subscribed to CyberIncidents",
      html,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/* =====================================================
   UNSUBSCRIPTION CONFIRMATION
===================================================== */

export async function sendUnsubscriptionConfirmationEmail(
  email: string
) {
  const resend = getResend();

  const html = emailLayout(`
    <h1
      style="
        margin:32px 0 0;
        font-size:28px;
        line-height:1.2;
      "
    >
      You've been unsubscribed
    </h1>

    <p
      style="
        margin:16px 0 0;
        color:#475569;
        font-size:15px;
        line-height:1.7;
      "
    >
      Your CyberIncidents notification subscription has
      been successfully cancelled.
    </p>

    <p
      style="
        margin:16px 0 0;
        color:#475569;
        font-size:15px;
        line-height:1.7;
      "
    >
      You will no longer receive new article notification
      emails.
    </p>

    <div style="margin-top:28px;">
      <a
        href="${getSubscribeUrl()}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#0f172a;
          color:#ffffff;
          text-decoration:none;
          border-radius:8px;
          font-size:14px;
          font-weight:700;
        "
      >
        Subscribe Again
      </a>
    </div>
  `);

  const { data, error } =
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject:
        "You've been unsubscribed from CyberIncidents",
      html,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/* =====================================================
   NEW BLOG NOTIFICATION
===================================================== */

export async function sendNewBlogNotification(
  blog: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
  }
) {
  const resend = getResend();

  const subscribers =
    await prisma.notificationSubscriber.findMany({
      where: {
        active: true,
        unsubscribeToken: {
          not: null,
        },
      },
      select: {
        email: true,
        unsubscribeToken: true,
      },
    });

  if (subscribers.length === 0) {
    return {
      sent: 0,
      failed: 0,
    };
  }

  const title = escapeHtml(blog.title);

  const excerpt = escapeHtml(
    blog.excerpt?.trim() ||
      "A new cybersecurity article has been published on CyberIncidents."
  );

  const articleUrl =
    `${SITE_URL}/blog/${encodeURIComponent(blog.slug)}`;

  let sent = 0;
  let failed = 0;

  const results = await Promise.allSettled(
    subscribers.map(async (subscriber) => {
      if (!subscriber.unsubscribeToken) {
        throw new Error(
          "Subscriber has no unsubscribe token."
        );
      }

      const unsubscribeUrl =
        getUnsubscribeUrl(
          subscriber.unsubscribeToken
        );

      const html = emailLayout(`
        <p
          style="
            margin:32px 0 0;
            color:#0284c7;
            font-size:12px;
            font-weight:800;
            letter-spacing:2px;
            text-transform:uppercase;
          "
        >
          New Article
        </p>

        <h1
          style="
            margin:10px 0 0;
            font-size:28px;
            line-height:1.25;
          "
        >
          ${title}
        </h1>

        <p
          style="
            margin:18px 0 0;
            color:#475569;
            font-size:15px;
            line-height:1.7;
          "
        >
          ${excerpt}
        </p>

        <div style="margin-top:28px;">
          <a
            href="${articleUrl}"
            style="
              display:inline-block;
              padding:13px 22px;
              background:#0f172a;
              color:#ffffff;
              text-decoration:none;
              border-radius:8px;
              font-size:14px;
              font-weight:700;
            "
          >
            Read Article →
          </a>
        </div>

        <p
          style="
            margin:28px 0 0;
            color:#94a3b8;
            font-size:12px;
            line-height:1.6;
          "
        >
          Don't want these notifications anymore?
          <a
            href="${unsubscribeUrl}"
            style="color:#0284c7;"
          >
            Unsubscribe
          </a>
        </p>
      `);

      const { error } =
        await resend.emails.send({
          from: FROM_EMAIL,
          to: [subscriber.email],
          subject: `New CyberIncidents Article: ${blog.title}`,
          html,
        });

      if (error) {
        throw new Error(error.message);
      }
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      sent++;
    } else {
      failed++;

      console.error(
        "NEW BLOG NOTIFICATION EMAIL ERROR:",
        result.reason
      );
    }
  }

  return {
    sent,
    failed,
  };
}