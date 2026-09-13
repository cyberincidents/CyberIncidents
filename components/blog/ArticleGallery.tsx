"use client";

import Image from "next/image";
import { useState } from "react";

type ArticleGalleryProps = {
  images: string[];
  title: string;
};

export default function ArticleGallery({
  images,
  title,
}: ArticleGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-10">
        {/* Main gallery image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
          <Image
            src={selectedImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 800px"
            priority
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`relative aspect-video overflow-hidden rounded-lg border-2 transition ${
                  selectedImage === image
                    ? "border-cyan-500"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${title} image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}