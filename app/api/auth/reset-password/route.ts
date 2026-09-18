import { NextResponse } from "next/server";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

function hashResetToken(token: string) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

function isStrongPassword(password: string) {
  return (
    password.length >= MIN_PASSWORD_LENGTH &&
    password.length <= MAX_PASSWORD_LENGTH &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request.",
        },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request.",
        },
        { status: 400 }
      );
    }

    const data = body as {
      token?: unknown;
      password?: unknown;
      confirmPassword?: unknown;
    };

    const token =
      typeof data.token === "string"
        ? data.token.trim()
        : "";

    const password =
      typeof data.password === "string"
        ? data.password
        : "";

    const confirmPassword =
      typeof data.confirmPassword === "string"
        ? data.confirmPassword
        : "";

    // --------------------------------------------------
    // Validate token
    // --------------------------------------------------

    if (!token || token.length > 128) {
  return NextResponse.json(
    {
      success: false,
      error:
        "This password reset link is invalid or incomplete.",
    },
    { status: 400 }
  );
}

    // --------------------------------------------------
    // Validate password
    // --------------------------------------------------

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Confirm password
    // --------------------------------------------------

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Passwords do not match.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Hash the raw token
    // --------------------------------------------------

    const tokenHash = hashResetToken(token);

    // --------------------------------------------------
    // Find user with valid, non-expired token
    // --------------------------------------------------

    const user = await prisma.user.findFirst({
      where: {
        passwordResetTokenHash: tokenHash,

        passwordResetExpiresAt: {
          gt: new Date(),
        },
      },

      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This password reset link is invalid or has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Hash new password
    // --------------------------------------------------

    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    // --------------------------------------------------
    // Update password and invalidate reset token
    // --------------------------------------------------

    const updatedUser = await prisma.user.updateMany({
  where: {
    id: user.id,
    passwordResetTokenHash: tokenHash,
    passwordResetExpiresAt: {
      gt: new Date(),
    },
  },
  data: {
    passwordHash,
    passwordResetTokenHash: null,
    passwordResetExpiresAt: null,
  },
});

if (updatedUser.count !== 1) {
  return NextResponse.json(
    {
      success: false,
      error:
        "This password reset link is invalid or has expired. Please request a new one.",
    },
    { status: 400 }
  );
}

    return NextResponse.json({
      success: true,
      message:
        "Your password has been reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error(
      "RESET PASSWORD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while resetting your password. Please try again later.",
      },
      { status: 500 }
    );
  }
}