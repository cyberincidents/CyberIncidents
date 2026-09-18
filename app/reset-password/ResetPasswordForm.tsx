"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

function EyeIcon({
  open,
}: {
  open: boolean;
}) {
  if (open) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M2.062 12.348a1 1 0 0 1 0-.696C3.423 7.59 7.36 5 12 5c4.64 0 8.577 2.59 9.938 6.652a1 1 0 0 1 0 .696C20.577 16.41 16.64 19 12 19c-4.64 0-8.577-2.59-9.938-6.652Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="m3 3 18 18" />
      <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
      <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c4.64 0 8.577 2.59 9.938 6.652a1 1 0 0 1 0 .696 10.95 10.95 0 0 1-4.123 5.102" />
      <path d="M6.61 6.61a10.94 10.94 0 0 0-4.548 5.041 10.94 10.94 0 0 0 5.102 4.123" />
    </svg>
  );
}

function PasswordInput({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
  autoComplete,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  placeholder: string;
  autoComplete: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
        >
          <EyeIcon open={visible} />
        </button>
      </div>
    </div>
  );
}

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Password requirements
  // --------------------------------------------------

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const passwordStrong =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial;

  // --------------------------------------------------
  // Validate token
  // --------------------------------------------------

  useEffect(() => {
    if (!token) {
      setError(
        "This password reset link is invalid or incomplete."
      );
    }
  }, [token]);

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError(
        "This password reset link is invalid or incomplete."
      );
      return;
    }

    if (!passwordStrong) {
      setError(
        "Password does not meet all security requirements."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to reset your password."
        );
      }

      setSuccess(
        data.message ||
          "Your password has been reset successfully."
      );

      setPassword("");
      setConfirmPassword("");
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
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
        <div className="w-full">

          {/* BRAND */}

          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-block text-xl font-black tracking-[0.2em] text-slate-950"
            >
              CYBER
              <span className="text-cyan-500">
                INCIDENTS
              </span>
            </Link>

            <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-cyan-400">
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

            <h1 className="mt-5 text-3xl font-bold text-slate-950">
              Reset your password
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Create a new password for your
              CyberIncidents account.
            </p>
          </div>

          {/* CARD */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            {!success ? (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <PasswordInput
                  id="reset-password"
                  label="New Password"
                  value={password}
                  onChange={setPassword}
                  visible={showPassword}
                  onToggle={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  disabled={loading}
                />

                {/* PASSWORD REQUIREMENTS */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Password requirements
                  </p>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      {
                        valid: hasMinLength,
                        text: "At least 8 characters",
                      },
                      {
                        valid: hasUppercase,
                        text: "One uppercase letter",
                      },
                      {
                        valid: hasLowercase,
                        text: "One lowercase letter",
                      },
                      {
                        valid: hasNumber,
                        text: "One number",
                      },
                      {
                        valid: hasSpecial,
                        text: "One special character",
                      },
                    ].map((requirement) => (
                      <div
                        key={requirement.text}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                            requirement.valid
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-slate-200 text-slate-400"
                          }`}
                        >
                          {requirement.valid
                            ? "✓"
                            : "•"}
                        </span>

                        <span
                          className={
                            requirement.valid
                              ? "text-emerald-700"
                              : "text-slate-500"
                          }
                        >
                          {requirement.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <PasswordInput
                  id="reset-confirm-password"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  visible={showConfirmPassword}
                  onToggle={() =>
                    setShowConfirmPassword(
                      (value) => !value
                    )
                  }
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  disabled={loading}
                />

                {confirmPassword &&
                  password !== confirmPassword && (
                    <p className="-mt-2 text-xs text-red-600">
                      Passwords do not match.
                    </p>
                  )}

                {/* ERROR */}

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600"
                  >
                    {error}
                  </div>
                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full rounded-xl bg-[#00a8ff] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#0088cc] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Resetting Password..."
                    : "Reset Password"}
                </button>
              </form>
            ) : (
              /* SUCCESS */

              <div className="space-y-5 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-7 w-7"
                    aria-hidden="true"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    Password reset successful
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Your password has been updated.
                    You can now sign in with your new
                    password.
                  </p>
                </div>

                <Link
                  href="/login"
                  className="block w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Go to Login
                </Link>
              </div>
            )}

            {!success && (
              <div className="mt-6 border-t border-slate-200 pt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-[#0284c7] transition hover:text-[#0369a1] hover:underline"
                >
                  ← Back to Login
                </Link>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            Reset links expire after 1 hour and can only
            be used once.
          </p>
        </div>
      </div>
    </main>
  );
}