"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  blogId: string;
  blogTitle: string;
};

export default function DeleteBlogButton({
  blogId,
  blogTitle,
}: Props) {
  const router = useRouter();

  const [deleting, setDeleting] =
    useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${blogTitle}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/admin/blogs/${blogId}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        window.alert(
          data.message ||
            "Unable to delete blog."
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      window.alert(
        "Something went wrong while deleting the blog."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting
        ? "Deleting..."
        : "Delete"}
    </button>
  );
}