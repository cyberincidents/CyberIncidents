"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to process your request."
        );
      }

      setMessage(
        data.message ||
          "If an account with that email exists, you will receive a password reset link shortly."
      );

      setEmail("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white transition-colors duration-200 dark:bg-[#05070a] px-6 py-16">
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
        <div className="w-full">
          {/* =================================================
              BRAND
          ================================================= */}

          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-block text-xl font-black tracking-[0.2em] text-slate-950 dark:text-white"
            >
              CYBER
              <span className="text-cyan-500">
                INCIDENTS
              </span>
            </Link>

            <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-cyan-400 dark:bg-white/10 dark:text-cyan-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <rect
                  width="18"
                  height="11"
                  x="3"
                  y="11"
                  rx="2"
                />

                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h1 className="mt-5 text-3xl font-bold text-slate-950 dark:text-white">
              Forgot your password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-gray-400">
              Enter the email address associated with
              your CyberIncidents account and we&apos;ll
              send you a password reset link.
            </p>
          </div>

          {/* =================================================
              CARD
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-[#090d14]">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}

              <div>
                <label
                  htmlFor="forgot-password-email"
                  className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-300"
                >
                  Email Address
                </label>

                <input
                  id="forgot-password-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-white/15 dark:bg-[#060b13] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#00a8ff]"
                />
              </div>

              {/* Error */}

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
                >
                  {error}
                </div>
              )}

              {/* Success */}

              {message && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400"
                >
                  {message}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#00a8ff] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#0088cc] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Sending Reset Link..."
                  : "Send Reset Link"}
              </button>
            </form>

            {/* =================================================
                BACK TO LOGIN
            ================================================= */}

            <div className="mt-6 border-t border-slate-200 pt-6 text-center dark:border-white/10">
              <Link
                href="/login"
                className="text-sm font-semibold text-[#0284c7] transition hover:text-[#0369a1] hover:underline dark:text-[#00a8ff] dark:hover:text-[#00d9ff]"
              >
                ← Back to Login
              </Link>
            </div>
          </div>

          {/* =================================================
              SECURITY NOTE
          ================================================= */}

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            For your security, we don&apos;t reveal whether
            an email address has an account with
            CyberIncidents.
          </p>
        </div>
      </div>
    </main>
  );
}