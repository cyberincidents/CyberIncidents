"use client";

import Image from "next/image";
import { useState } from "react";

type ArticleGalleryProps = {
  images: string[];
  title: string;
};

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="h-5 w-5"
    >
      <path d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

export default function ArticleGallery({ images, title }: ArticleGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const goTo = (index: number) => {
    setSelectedIndex((index + images.length) % images.length);
  };

  return (
    <div className="mt-10">
      {/* ======================================================
          MAIN IMAGE
      ====================================================== */}

      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
        <Image
          src={images[selectedIndex]}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 800px"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(selectedIndex - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition hover:bg-white hover:text-[#0C7FC9]"
            >
              <ChevronIcon direction="left" />
            </button>

            <button
              type="button"
              onClick={() => goTo(selectedIndex + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition hover:bg-white hover:text-[#0C7FC9]"
            >
              <ChevronIcon direction="right" />
            </button>

            <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
              {selectedIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* ======================================================
          THUMBNAILS
      ====================================================== */}

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => {
            const isSelected = index === selectedIndex;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={isSelected}
                className={`relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg border-2 transition sm:w-28 ${
                  isSelected
                    ? "border-[#0C7FC9]"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={image}
                  alt={`${title} image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}