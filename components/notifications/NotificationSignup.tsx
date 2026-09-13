"use client";

import { FormEvent, useEffect, useState } from "react";

type SubscriptionStatus =
  | "loading"
  | "subscribed"
  | "unsubscribed";

export default function NotificationSignup() {
  const [email, setEmail] = useState("");

  const [status, setStatus] =
    useState<SubscriptionStatus>("loading");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =====================================================
     CHECK SUBSCRIPTION STATUS
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    async function checkSubscriptionStatus() {
      try {
        const response = await fetch(
          "/api/notifications/status",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (data.subscribed === true) {
          setStatus("subscribed");
        } else {
          setStatus("unsubscribed");
        }
      } catch {
        if (!cancelled) {
          setStatus("unsubscribed");
        }
      }
    }

    checkSubscriptionStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =====================================================
     SUBSCRIBE
  ===================================================== */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/notifications/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: trimmedEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Something went wrong. Please try again."
        );

        return;
      }

      setStatus("subscribed");
      setMessage(
        data.message ||
          "You're subscribed to CyberIncidents."
      );

      setEmail("");
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     UNSUBSCRIBE
  ===================================================== */

  async function handleUnsubscribe() {
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/notifications/unsubscribe",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to unsubscribe. Please try again."
        );

        return;
      }

      setStatus("unsubscribed");

      setMessage(
        data.message ||
          "You have been unsubscribed from CyberIncidents."
      );
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (status === "loading") {
    return (
      <div className="mt-10 max-w-md">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#00d9ff]">
          Stay Updated
        </h2>

        <div className="mt-5 h-10 w-32 animate-pulse rounded-lg bg-white/5" />
      </div>
    );
  }

  /* =====================================================
     SUBSCRIBED
  ===================================================== */

  if (status === "subscribed") {
    return (
      <div className="mt-10 max-w-md">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#00d9ff]">
          Stay Updated
        </h2>

        <div className="mt-4">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path
                  d="m5 10 3 3 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <span className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-400">
              Subscribed
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-white/50">
            You'll receive an email when a new
            CyberIncidents article is published.
          </p>

          {message && (
            <p
              role="status"
              className="mt-3 text-xs leading-5 text-emerald-400"
            >
              {message}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="mt-3 text-xs leading-5 text-red-400"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleUnsubscribe}
            disabled={loading}
            className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-white/35 underline underline-offset-4 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Unsubscribing..."
              : "Unsubscribe"}
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     NOT SUBSCRIBED
  ===================================================== */

  return (
    <div className="mt-10 max-w-md">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#00d9ff]">
        Stay Updated
      </h2>

      <p className="mt-4 text-sm leading-6 text-white/50">
        Get the latest cybersecurity incidents,
        threats and security insights delivered to
        your inbox.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-5"
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <label
            htmlFor="notification-email"
            className="sr-only"
          >
            Email address
          </label>

          <input
            id="notification-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
              setMessage("");
            }}
            placeholder="Enter your email address"
            autoComplete="email"
            disabled={loading}
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-[#00d9ff]/60 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg border border-[#00d9ff]/40 bg-[#00d9ff]/10 px-5 py-3 text-sm font-semibold text-[#00d9ff] transition hover:border-[#00d9ff] hover:bg-[#00d9ff]/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Subscribing..."
              : "Subscribe"}
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-3 text-xs leading-5 text-red-400"
          >
            {error}
          </p>
        )}

        {message && (
          <p
            role="status"
            className="mt-3 text-xs leading-5 text-emerald-400"
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}