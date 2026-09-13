"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
        strokeWidth="2"
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
      strokeWidth="2"
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
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  placeholder: string;
  autoComplete: string;
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
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
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

export default function ChangePassword() {
  const [open, setOpen] = useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  const passwordStrong =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial;

  /*
   * Close modal with Escape.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        if (!saving) {
          closeModal();
        }
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    /*
     * Prevent the page behind the modal
     * from scrolling.
     */
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [open, saving]);

  function openModal() {
    setError("");
    setMessage("");
    setOpen(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setOpen(false);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);

    setError("");
    setMessage("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!currentPassword) {
      setError(
        "Enter your current password."
      );
      return;
    }

    if (!passwordStrong) {
      setError(
        "New password does not meet all security requirements."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New passwords do not match."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "/api/account/password",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to change password."
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage(
        data.message ||
          "Password changed successfully."
      );

      /*
       * Close the modal after a short delay
       * so the user can see the success message.
       */
      setTimeout(() => {
        setOpen(false);
        setMessage("");
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to change password."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* =================================================
          SECURITY CARD
      ================================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-5 p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-cyan-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
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

            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Password
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Change your account password.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="shrink-0 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Change Password
          </button>
        </div>
      </section>

      {/* =================================================
          MODAL
      ================================================= */}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-password-title"
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <h2
                  id="change-password-title"
                  className="text-xl font-bold text-slate-950"
                >
                  Change Password
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Keep your account secure with a
                  strong password.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close change password"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6 6 18" />
                </svg>
              </button>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              <PasswordInput
                id="current-password"
                label="Current Password"
                value={currentPassword}
                onChange={setCurrentPassword}
                visible={showCurrent}
                onToggle={() =>
                  setShowCurrent(
                    (value) => !value
                  )
                }
                placeholder="Enter your current password"
                autoComplete="current-password"
              />

              <PasswordInput
                id="new-password"
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                visible={showNew}
                onToggle={() =>
                  setShowNew(
                    (value) => !value
                  )
                }
                placeholder="Enter your new password"
                autoComplete="new-password"
              />

              {/* =================================================
                  PASSWORD REQUIREMENTS
              ================================================= */}

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
                id="confirm-password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                visible={showConfirm}
                onToggle={() =>
                  setShowConfirm(
                    (value) => !value
                  )
                }
                placeholder="Confirm your new password"
                autoComplete="new-password"
              />

              {confirmPassword &&
                newPassword !==
                  confirmPassword && (
                  <p className="-mt-2 text-xs text-red-600">
                    Passwords do not match.
                  </p>
                )}

              {/* =================================================
                  FORGOT PASSWORD
              ================================================= */}

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  onClick={() => {
                    if (!saving) {
                      closeModal();
                    }
                  }}
                  className="text-sm font-semibold text-cyan-600 transition hover:text-cyan-700 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Error */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Success */}

              {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {message}
                </div>
              )}

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Changing Password..."
                    : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}