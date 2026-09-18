import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.toLowerCase().trim()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const image =
      typeof body.image === "string"
        ? body.image.trim()
        : null;

    /* =====================================================
       VALIDATION
    ===================================================== */

    /* -------------------------------
       Name
    -------------------------------- */

    if (!name) {
      return NextResponse.json(
        {
          error: "Name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          error:
            "Name must contain at least 2 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          error: "Name is too long.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------
       Email
    -------------------------------- */

    if (!email) {
  return NextResponse.json(
    {
      error: "Email is required.",
    },
    {
      status: 400,
    }
  );
}

if (email.length > 254) {
  return NextResponse.json(
    {
      error: "Please enter a valid email address.",
    },
    {
      status: 400,
    }
  );
}

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------
       Password
    -------------------------------- */

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password must contain at least 8 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        {
          error: "Password is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password must contain at least one uppercase letter.",
        },
        {
          status: 400,
        }
      );
    }

    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password must contain at least one lowercase letter.",
        },
        {
          status: 400,
        }
      );
    }

    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password must contain at least one number.",
        },
        {
          status: 400,
        }
      );
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password must contain at least one special character.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------
       Profile Image
    -------------------------------- */

    if (image) {
  if (image.length > 2000) {
    return NextResponse.json(
      {
        error:
          "Profile image URL is too long.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const imageUrl = new URL(image);
    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME;

    if (
      imageUrl.protocol !== "https:" ||
      imageUrl.hostname !== "res.cloudinary.com" ||
      !cloudName ||
      imageUrl.pathname.length === 0 ||
      !imageUrl.pathname.startsWith(`/${cloudName}/`)
    ) {
      return NextResponse.json(
        {
          error: "Invalid profile image.",
        },
        {
          status: 400,
        }
      );
    }
  } catch {
    return NextResponse.json(
      {
        error: "Invalid profile image.",
      },
      {
        status: 400,
      }
    );
  }
}

    /* =====================================================
       CHECK EXISTING USER
    ===================================================== */

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "An account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    /* =====================================================
       HASH PASSWORD
    ===================================================== */

    const passwordHash =
      await bcrypt.hash(password, 12);

    /* =====================================================
       CREATE USER
    ===================================================== */

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        image: image || null,

        /*
         * IMPORTANT:
         *
         * Never accept role from the client.
         *
         * Every public registration is always USER.
         */
        role: "USER",
      },

      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        message:
          "Account created successfully.",
        user,
      },
      {
        status: 201,
      }
    );
} catch (error) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return NextResponse.json(
      {
        error:
          "An account with this email already exists.",
      },
      {
        status: 409,
      }
    );
  }

  console.error(
    "USER_REGISTRATION_ERROR:",
    error
  );

  return NextResponse.json(
    {
      error:
        "Something went wrong while creating your account.",
    },
    {
      status: 500,
    }
  );
}
}