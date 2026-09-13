import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email)
          .toLowerCase()
          .trim();

        const password = String(credentials.password);

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      /*
       * ========================================================
       * GOOGLE AUTHENTICATION
       * ========================================================
       */
      if (account?.provider === "google") {
        if (!user.email) {
          return false;
        }

        const email = user.email
          .toLowerCase()
          .trim();

        const googleProfile = profile as
          | {
              email_verified?: boolean;
              name?: string | null;
              picture?: string | null;
            }
          | undefined;

        /*
         * Only accept a verified Google email.
         */
        if (googleProfile?.email_verified === false) {
          return false;
        }

        const googleName =
          typeof googleProfile?.name === "string"
            ? googleProfile.name.trim()
            : typeof user.name === "string"
              ? user.name.trim()
              : null;

        const googleImage =
          typeof googleProfile?.picture === "string"
            ? googleProfile.picture
            : typeof user.image === "string"
              ? user.image
              : null;

        /*
         * Check whether this Google account is already linked.
         */
        const existingAccount =
          await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId:
                  account.providerAccountId,
              },
            },
          });

        if (existingAccount) {
          /*
           * Existing Google account.
           *
           * Never overwrite locally edited name/image.
           */
          return true;
        }

        /*
         * Find an existing CyberIncidents user by email.
         */
        let dbUser = await prisma.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        });

        /*
         * First Google login.
         */
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email,
              name: googleName || null,
              image: googleImage || null,
              role: "USER",
              emailVerified: new Date(),
            },
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
            },
          });
        } else {
          /*
           * Existing email/password account.
           *
           * Only fill fields that are currently empty.
           * Never overwrite a user's customized values.
           */
          const updateData: {
            name?: string;
            image?: string;
          } = {};

          if (!dbUser.name && googleName) {
            updateData.name = googleName;
          }

          if (!dbUser.image && googleImage) {
            updateData.image = googleImage;
          }

          if (Object.keys(updateData).length > 0) {
            await prisma.user.update({
              where: {
                id: dbUser.id,
              },
              data: updateData,
            });
          }
        }

        /*
         * Convert Auth.js values to Prisma-compatible
         * values before storing them.
         */
        const refreshToken =
          typeof account.refresh_token === "string"
            ? account.refresh_token
            : null;

        const accessToken =
          typeof account.access_token === "string"
            ? account.access_token
            : null;

        const tokenType =
          typeof account.token_type === "string"
            ? account.token_type
            : null;

        const scope =
          typeof account.scope === "string"
            ? account.scope
            : null;

        const idToken =
          typeof account.id_token === "string"
            ? account.id_token
            : null;

        const sessionState =
          typeof account.session_state === "string"
            ? account.session_state
            : null;

        /*
         * Save/link the Google account.
         */
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: "google",
              providerAccountId:
                account.providerAccountId,
            },
          },

          create: {
            userId: dbUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId:
              account.providerAccountId,
            refresh_token: refreshToken,
            access_token: accessToken,
            expires_at: account.expires_at ?? null,
            token_type: tokenType,
            scope,
            id_token: idToken,
            session_state: sessionState,
          },

          update: {
            userId: dbUser.id,
            refresh_token: refreshToken,
            access_token: accessToken,
            expires_at: account.expires_at ?? null,
            token_type: tokenType,
            scope,
            id_token: idToken,
            session_state: sessionState,
          },
        });

        return true;
      }

      /*
       * ========================================================
       * EMAIL / PASSWORD AUTHENTICATION
       * ========================================================
       */
      if (account?.provider === "credentials") {
        return Boolean(user.email);
      }

      return Boolean(user.email);
    },

    /*
     * ==========================================================
     * JWT
     * ==========================================================
     */
    async jwt({
      token,
      user,
      account,
      trigger,
    }) {
      /*
       * Profile update.
       *
       * Called by useSession().update().
       *
       * Always load the values from PostgreSQL rather than
       * trusting values sent by the browser.
       */
      if (trigger === "update" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: token.email
              .toLowerCase()
              .trim(),
          },
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.picture = dbUser.image;
          token.role = dbUser.role;
        }

        return token;
      }

      /*
       * Initial login.
       */
      if (user?.email) {
        const email = user.email
          .toLowerCase()
          .trim();

        const dbUser = await prisma.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.picture = dbUser.image;
        }
      }

      /*
       * Google fallback.
       */
      if (
        account?.provider === "google" &&
        token.email &&
        !token.id
      ) {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: token.email
              .toLowerCase()
              .trim(),
          },
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.picture = dbUser.image;
        }
      }

      return token;
    },

    /*
     * ==========================================================
     * SESSION
     * ==========================================================
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);

        session.user.role =
          token.role === "ADMIN"
            ? "ADMIN"
            : "USER";

        session.user.name =
          typeof token.name === "string"
            ? token.name
            : null;

        session.user.image =
          typeof token.picture === "string"
            ? token.picture
            : null;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },
});