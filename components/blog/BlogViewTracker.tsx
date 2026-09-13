"use client";

import { useEffect, useRef } from "react";

type BlogViewTrackerProps = {
  blogId: string;
};

export default function BlogViewTracker({
  blogId,
}: BlogViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) {
      return;
    }

    tracked.current = true;

    console.log("Tracking blog view:", blogId);

    fetch(`/api/blogs/${blogId}/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();

        console.log("Blog view response:", response.status, data);
      })
      .catch((error) => {
        console.error("Blog view tracking failed:", error);
      });
  }, [blogId]);

  return null;
}