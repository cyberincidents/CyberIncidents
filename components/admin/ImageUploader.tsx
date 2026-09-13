"use client";

import { useRef, useState } from "react";

type UploadedImage = {
  publicId: string;
  url: string;
  width: number;
  height: number;
};

type Props = {
  value?: string;
  onUpload: (image: UploadedImage) => void;
  onRemove?: () => void;
  label?: string;
  required?: boolean;
};

export default function ImageUploader({
  value,
  onUpload,
  onRemove,
  label = "Image",
  required = false,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG, WebP and GIF images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "Image must be smaller than 10MB."
      );

      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/admin/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Image upload failed."
        );
      }

      if (
        !data.image?.url ||
        !data.image?.publicId
      ) {
        throw new Error(
          "Invalid response from upload server."
        );
      }

      onUpload({
        publicId:
          data.image.publicId,

        url:
          data.image.url,

        width:
          data.image.width ?? 0,

        height:
          data.image.height ?? 0,
      });
    } catch (error) {
      console.error(
        "IMAGE UPLOAD ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload image."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function removeImage() {
    onRemove?.();
  }

  return (
    <div className="space-y-3">
      {/* Label */}

      <label className="block text-sm font-medium text-slate-300">
        {label}

        {required && (
          <span className="ml-1 text-red-400">
            *
          </span>
        )}
      </label>

      {/* Uploaded Image */}

      {value ? (
        <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
          <div className="p-3">
            <img
              src={value}
              alt=""
              className="max-h-80 w-full rounded-lg object-contain"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 p-3">
            <p className="text-xs text-emerald-400">
              Image uploaded
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  inputRef.current?.click()
                }
                disabled={uploading}
                className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300 disabled:opacity-50"
              >
                Replace
              </button>

              {onRemove && (
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={uploading}
                  className="rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Upload Area */

        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          disabled={uploading}
          className="flex min-h-40 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950 px-6 py-8 text-center transition hover:border-cyan-400 hover:bg-cyan-400/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-3xl">
            {uploading ? "⏳" : "📷"}
          </span>

          <span className="mt-3 font-medium text-slate-200">
            {uploading
              ? "Uploading..."
              : "Click to upload image"}
          </span>

          <span className="mt-1 text-xs text-slate-500">
            JPG, PNG, WebP or GIF · Max 10MB
          </span>
        </button>
      )}

      {/* Hidden File Input */}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error */}

      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}