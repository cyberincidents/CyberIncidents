import { NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";

import { prisma } from "@/lib/prisma";

import { Resend } from "resend";

const SITE_URL = (
  process.env.SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

const FROM_EMAIL =
  process.env.NOTIFICATION_FROM_EMAIL ||
  "CyberIncidents <onboarding@resend.dev>";

/* =====================================================
   RESEND
===================================================== */

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured."
    );
  }

  return new Resend(apiKey);
}

/* =====================================================
   VALIDATION
===================================================== */

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* =====================================================
   TOKEN HASH
===================================================== */

function hashToken(token: string) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
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

/* =====================================================
   RESET EMAIL
===================================================== */

async function sendPasswordResetEmail(
  email: string,
  resetToken: string
) {
  const resend = getResend();

  const resetUrl =
    `${SITE_URL}/reset-password?token=` +
    encodeURIComponent(resetToken);

  const safeEmail = escapeHtml(email);

  const { data, error } =
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject:
        "Reset your CyberIncidents password",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    Reset your CyberIncidents password
  </title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f8fafc;
    font-family:Arial,Helvetica,sans-serif;
    color:#0f172a;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="padding:40px 16px;"
  >
    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:560px;
            background:#ffffff;
            border:1px solid #e2e8f0;
            border-radius:14px;
            overflow:hidden;
          "
        >

          <!-- Top accent -->

          <tr>
            <td
              style="
                height:3px;
                background:#06b6d4;
                font-size:0;
                line-height:0;
              "
            >
            </td>
          </tr>

          <!-- Content -->

          <tr>
            <td
              style="
                padding:40px 36px;
              "
            >

              <div
                style="
                  font-size:18px;
                  font-weight:800;
                  letter-spacing:2px;
                  margin-bottom:28px;
                "
              >
                CYBER<span style="color:#06b6d4;">
                  INCIDENTS
                </span>
              </div>

              <h1
                style="
                  margin:0;
                  font-size:26px;
                  line-height:1.3;
                  color:#0f172a;
                "
              >
                Reset your password
              </h1>

              <p
                style="
                  margin:18px 0 0;
                  font-size:15px;
                  line-height:1.7;
                  color:#64748b;
                "
              >
                We received a request to reset the
                password for your CyberIncidents account.
              </p>

              <p
                style="
                  margin:12px 0 0;
                  font-size:14px;
                  line-height:1.7;
                  color:#64748b;
                "
              >
                If you made this request, click the
                button below to choose a new password.
              </p>

              <!-- Button -->

              <div
                style="
                  margin:30px 0;
                "
              >
                <a
                  href="${resetUrl}"
                  style="
                    display:inline-block;
                    padding:13px 22px;
                    background:#06b6d4;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:8px;
                    font-size:14px;
                    font-weight:700;
                  "
                >
                  Reset Password →
                </a>
              </div>

              <p
                style="
                  margin:0;
                  font-size:13px;
                  line-height:1.7;
                  color:#94a3b8;
                "
              >
                This password reset link will expire
                in <strong>1 hour</strong>.
              </p>

              <p
                style="
                  margin:18px 0 0;
                  font-size:13px;
                  line-height:1.7;
                  color:#94a3b8;
                "
              >
                If you did not request a password reset,
                you can safely ignore this email.
                Your password will remain unchanged.
              </p>

              <!-- Fallback URL -->

              <div
                style="
                  margin-top:28px;
                  padding-top:20px;
                  border-top:1px solid #e2e8f0;
                "
              >
                <p
                  style="
                    margin:0 0 8px;
                    font-size:12px;
                    color:#94a3b8;
                  "
                >
                  If the button does not work, copy and
                  paste this link into your browser:
                </p>

                <p
                  style="
                    margin:0;
                    word-break:break-all;
                    font-size:12px;
                    color:#64748b;
                  "
                >
                  ${escapeHtml(resetUrl)}
                </p>
              </div>

              <!-- Account -->

              <div
                style="
                  margin-top:24px;
                  font-size:12px;
                  color:#cbd5e1;
                "
              >
                Password reset requested for:
                ${safeEmail}
              </div>

            </td>
          </tr>

          <!-- Footer -->

          <tr>
            <td
              style="
                padding:20px 36px;
                background:#f8fafc;
                border-top:1px solid #e2e8f0;
                text-align:center;
              "
            >
              <p
                style="
                  margin:0;
                  font-size:12px;
                  color:#94a3b8;
                "
              >
                © ${new Date().getFullYear()}
                CyberIncidents
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/* =====================================================
   POST
===================================================== */

export async function POST(
  request: Request
) {
  try {
    // --------------------------------------------------
    // Parse request
    // --------------------------------------------------

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request.",
        },
        { status: 400 }
      );
    }

    if (
      !body ||
      typeof body !== "object"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request.",
        },
        { status: 400 }
      );
    }

    const email =
      typeof (body as { email?: unknown }).email ===
      "string"
        ? (body as { email: string }).email
            .trim()
            .toLowerCase()
        : "";

    // --------------------------------------------------
    // Validate email
    // --------------------------------------------------

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (email.length > 254) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Find user
    // --------------------------------------------------

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          email: true,
          passwordHash: true,
        },
      });

    /*
     * IMPORTANT:
     *
     * Always return the same response whether the
     * email exists or not.
     *
     * This prevents account enumeration.
     */

    if (!user || !user.passwordHash) {
      return NextResponse.json({
        success: true,
        message:
          "If an account with that email exists, you will receive a password reset link shortly.",
      });
    }

    // --------------------------------------------------
    // Generate secure reset token
    // --------------------------------------------------

    const resetToken =
      randomBytes(32).toString("hex");

    const resetTokenHash =
      hashToken(resetToken);

    // --------------------------------------------------
    // Token expires in 1 hour
    // --------------------------------------------------

    const resetTokenExpiresAt =
      new Date(
        Date.now() + 60 * 60 * 1000
      );

    // --------------------------------------------------
    // Save HASH, never raw token
    // --------------------------------------------------

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordResetTokenHash:
          resetTokenHash,

        passwordResetExpiresAt:
          resetTokenExpiresAt,
      },
    });

    // --------------------------------------------------
    // Send email
    // --------------------------------------------------

    try {
      await sendPasswordResetEmail(
        user.email!,
        resetToken
      );
    } catch (error) {
      /*
       * If email sending fails, remove the reset
       * credentials so the token cannot remain active.
       */

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          passwordResetTokenHash: null,
          passwordResetExpiresAt: null,
        },
      });

      console.error(
        "PASSWORD RESET EMAIL ERROR:",
        error
      );

     return NextResponse.json({
  success: true,
  message:
    "If an account with that email exists, you will receive a password reset link shortly.",
});
    }

    // --------------------------------------------------
    // Success
    // --------------------------------------------------

    return NextResponse.json({
      success: true,
      message:
        "If an account with that email exists, you will receive a password reset link shortly.",
    });
  } catch (error) {
    console.error(
      "FORGOT PASSWORD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}