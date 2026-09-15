"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6 0 9.5 7 9.5 7a17.5 17.5 0 0 1-3.2 3.9" />
      <path d="M6.6 6.6C4 8.2 2.5 12 2.5 12s3.5 6 9.5 6c1.4 0 2.7-.3 3.8-.8" />
    </svg>
  );
}

function Requirement({
  valid,
  children,
}: {
  valid: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-xs transition-colors ${
        valid ? "text-emerald-600" : "text-slate-400"
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          valid
            ? "bg-emerald-100"
            : "bg-slate-100"
        }`}
      >
        {valid ? "✓" : ""}
      </span>

      <span>{children}</span>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] =
    useState(false);

  /* =====================================================
     PASSWORD REQUIREMENTS
  ===================================================== */

  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passwordScore =
    Object.values(passwordRequirements).filter(
      Boolean
    ).length;

  const passwordIsValid =
    passwordRequirements.length &&
    passwordRequirements.uppercase &&
    passwordRequirements.lowercase &&
    passwordRequirements.number &&
    passwordRequirements.special;

  let passwordStrength = "Enter a password";

  if (password.length > 0) {
    if (passwordScore <= 2) {
      passwordStrength = "Weak";
    } else if (passwordScore === 3) {
      passwordStrength = "Fair";
    } else if (passwordScore === 4) {
      passwordStrength = "Good";
    } else {
      passwordStrength = "Strong";
    }
  }

  /* =====================================================
     EMAIL REGISTRATION
  ===================================================== */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const normalizedEmail = email
      .toLowerCase()
      .trim();

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    if (trimmedName.length < 2) {
      setError(
        "Name must contain at least 2 characters."
      );
      return;
    }

    if (trimmedName.length > 100) {
      setError("Name is too long.");
      return;
    }

    if (!normalizedEmail) {
      setError("Email is required.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (!passwordIsValid) {
      setError(
        "Please create a password that meets all the requirements."
      );
      return;
    }

    if (password.length > 128) {
      setError("Password is too long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: trimmedName,
            email: normalizedEmail,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to create your account."
        );
        return;
      }

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        router.push("/login?registered=true");
      }, 1000);
    } catch (error) {
      console.error(
        "REGISTRATION_ERROR:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     GOOGLE
  ===================================================== */

  async function handleGoogleSignIn() {
    setError("");
    setSuccess("");
    setGoogleLoading(true);

    try {
      await signIn("google", {
        callbackUrl: "/",
      });
    } catch (error) {
      console.error(
        "GOOGLE_SIGN_IN_ERROR:",
        error
      );

      setError(
        "Unable to continue with Google. Please try again."
      );

      setGoogleLoading(false);
    }
  }

  const isLoading =
    loading || googleLoading;

  return (
    <main className="min-h-screen bg-white transition-colors duration-200 dark:bg-[#05070a] px-6 py-16">
      <div className="mx-auto flex max-w-md flex-col justify-center">

        {/* =================================================
            BRAND
        ================================================= */}

        <div className="text-center">
          

          <h1 className="mt-8 text-3xl font-bold text-slate-950 dark:text-white">
            Create an account
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
            Join CyberIncidents to access full threat briefings.
          </p>
        </div>

        {/* =================================================
            FORM CARD
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          {/* Error */}

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div
              role="status"
              className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Your name"
                autoComplete="name"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-100"
              />
            </div>

            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-100"
              />
            </div>

            {/* Password */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  disabled={isLoading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                >
                  <EyeIcon
                    visible={showPassword}
                  />
                </button>
              </div>

              {/* Password Strength */}

              <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-3">

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Password strength
                  </span>

                  <span
                    className={`text-xs font-semibold ${
                      password.length === 0
                        ? "text-slate-400"
                        : passwordScore <= 2
                        ? "text-red-500"
                        : passwordScore === 3
                        ? "text-amber-500"
                        : passwordScore === 4
                        ? "text-cyan-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {passwordStrength}
                  </span>
                </div>

                {/* Strength bars */}

                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map(
                    (level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-200 ${
                          level <= passwordScore
                            ? passwordScore <= 2
                              ? "bg-red-400"
                              : passwordScore === 3
                              ? "bg-amber-400"
                              : passwordScore === 4
                              ? "bg-cyan-500"
                              : "bg-emerald-500"
                            : "bg-slate-200"
                        }`}
                      />
                    )
                  )}
                </div>

                {/* Requirements */}

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Requirement
                    valid={
                      passwordRequirements.length
                    }
                  >
                    At least 8 characters
                  </Requirement>

                  <Requirement
                    valid={
                      passwordRequirements.uppercase
                    }
                  >
                    One uppercase letter
                  </Requirement>

                  <Requirement
                    valid={
                      passwordRequirements.lowercase
                    }
                  >
                    One lowercase letter
                  </Requirement>

                  <Requirement
                    valid={
                      passwordRequirements.number
                    }
                  >
                    One number
                  </Requirement>

                  <Requirement
                    valid={
                      passwordRequirements.special
                    }
                  >
                    One special character
                  </Requirement>
                </div>
              </div>
            </div>

            {/* Confirm Password */}

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                  className={`w-full rounded-lg border bg-white px-4 py-3 pr-12 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:bg-slate-100 ${
                    confirmPassword &&
                    password !== confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : confirmPassword &&
                        password ===
                          confirmPassword
                      ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-100"
                      : "border-slate-300 focus:border-cyan-500 focus:ring-cyan-100"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (value) => !value
                    )
                  }
                  disabled={isLoading}
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                >
                  <EyeIcon
                    visible={
                      showConfirmPassword
                    }
                  />
                </button>
              </div>

              {confirmPassword &&
                password !== confirmPassword && (
                  <p className="mt-2 text-xs text-red-500">
                    Passwords do not match.
                  </p>
                )}

              {confirmPassword &&
                password === confirmPassword && (
                  <p className="mt-2 text-xs text-emerald-600">
                    ✓ Passwords match.
                  </p>
                )}
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>
          </form>

          {/* Divider */}

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs font-medium text-slate-400">
              OR
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Google */}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? (
              "Connecting to Google..."
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M21.35 12.27c0-.79-.07-1.55-.22-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.4Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.75 9.75 0 0 0 12 21.5Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.54 13.59A5.86 5.86 0 0 1 6.23 12c0-.55.11-1.09.31-1.59V7.89H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.11l3.24-2.52Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.45 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.7 5.39l3.24 2.52C7.31 8.1 9.46 6.38 12 6.38Z"
                  />
                </svg>

                Continue with Google
              </>
            )}
          </button>

          {/* Login */}

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}

            <Link
              href="/login"
              className="font-medium text-cyan-600 hover:text-cyan-700"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}

        <p className="mt-6 text-center text-xs text-slate-400">
          By creating an account, you agree to use
          CyberIncidents responsibly.
        </p>
      </div>
    </main>
  );
}