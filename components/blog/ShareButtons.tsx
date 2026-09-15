"use client";

import { useState } from "react";

type ShareButtonsProps = {
  blogId: string;
  title: string;
  slug: string;
};

export default function ShareButtons({
  blogId,
  title,
  slug,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  async function recordShare(platform: "OTHER" | "COPY_LINK") {
    try {
      await fetch(`/api/blogs/${blogId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform,
        }),
      });
    } catch (error) {
      console.error("Share tracking failed:", error);
    }
  }

  async function handleShare() {
    const shareUrl = `${window.location.origin}/blog/${slug}`;

    setSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Check out this cybersecurity article: ${title}`,
          url: shareUrl,
        });

        await recordShare("OTHER");
      } else {
        await navigator.clipboard.writeText(shareUrl);

        await recordShare("COPY_LINK");

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (error) {
      // User closing/canceling the native share dialog is not an error.
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error("Share failed:", error);
    } finally {
      setSharing(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={sharing}
      className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-[#00a8ff]/40 bg-white dark:bg-[#00a8ff]/10 px-5 py-2.5 text-sm font-semibold text-gray-900 dark:text-[#00d9ff] transition hover:border-gray-900 dark:hover:border-[#00d9ff] hover:bg-gray-50 dark:hover:bg-[#00a8ff]/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {/* Share icon */}
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>

      {sharing
        ? "Sharing..."
        : copied
          ? "Link Copied!"
          : "Share Article"}
    </button>
  );
}