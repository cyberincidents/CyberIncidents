"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import ImageUploader from "@/components/admin/ImageUploader";

type Field = {
  id: string;
  name: string;
};

type UploadedImage = {
  publicId: string;
  url: string;
  width: number;
  height: number;
};

type TextBlock = {
  id: string;
  type: "text";
  text: string;
};

type ImageBlock = {
  id: string;
  type: "image";
  url: string;
  publicId: string;
  width: number;
  height: number;
};

type ContentBlock = TextBlock | ImageBlock;

type BlogFormProps = {
  fields: Field[];
};

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BlogForm({
  fields,
}: BlogFormProps) {
  const router = useRouter();

  const [title, setTitle] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [excerpt, setExcerpt] =
    useState("");

  const [blocks, setBlocks] =
    useState<ContentBlock[]>([
      {
        id: createId(),
        type: "text",
        text: "",
      },
    ]);

  const [access, setAccess] =
    useState<"FREE" | "PAID">("FREE");

  const [status, setStatus] =
    useState<"DRAFT" | "PUBLISHED">(
      "DRAFT"
    );

  const [featured, setFeatured] =
    useState(false);

  const [selectedFields, setSelectedFields] =
    useState<string[]>([]);

  const [primaryImage, setPrimaryImage] =
    useState<UploadedImage | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  // --------------------------------------------------
  // Content blocks
  // --------------------------------------------------

  function updateTextBlock(
    id: string,
    text: string
  ) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === id &&
        block.type === "text"
          ? {
              ...block,
              text,
            }
          : block
      )
    );
  }

  function updateImageBlock(
    id: string,
    image: UploadedImage
  ) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === id &&
        block.type === "image"
          ? {
              ...block,
              url: image.url,
              publicId: image.publicId,
              width: image.width,
              height: image.height,
            }
          : block
      )
    );
  }

  function removeImageFromBlock(
    id: string
  ) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === id &&
        block.type === "image"
          ? {
              ...block,
              url: "",
              publicId: "",
              width: 0,
              height: 0,
            }
          : block
      )
    );
  }

  function addTextBlock(
    afterId?: string
  ) {
    const newBlock: TextBlock = {
      id: createId(),
      type: "text",
      text: "",
    };

    if (!afterId) {
      setBlocks((current) => [
        ...current,
        newBlock,
      ]);

      return;
    }

    setBlocks((current) => {
      const index = current.findIndex(
        (block) =>
          block.id === afterId
      );

      if (index === -1) {
        return [
          ...current,
          newBlock,
        ];
      }

      const next = [...current];

      next.splice(
        index + 1,
        0,
        newBlock
      );

      return next;
    });
  }

  function addImageBlock(
    afterId?: string
  ) {
    const newBlock: ImageBlock = {
      id: createId(),
      type: "image",
      url: "",
      publicId: "",
      width: 0,
      height: 0,
    };

    if (!afterId) {
      setBlocks((current) => [
        ...current,
        newBlock,
      ]);

      return;
    }

    setBlocks((current) => {
      const index = current.findIndex(
        (block) =>
          block.id === afterId
      );

      if (index === -1) {
        return [
          ...current,
          newBlock,
        ];
      }

      const next = [...current];

      next.splice(
        index + 1,
        0,
        newBlock
      );

      return next;
    });
  }

  function removeBlock(id: string) {
    setBlocks((current) => {
      if (current.length === 1) {
        return current;
      }

      return current.filter(
        (block) => block.id !== id
      );
    });
  }

  function moveBlock(
    id: string,
    direction: "up" | "down"
  ) {
    setBlocks((current) => {
      const index =
        current.findIndex(
          (block) =>
            block.id === id
        );

      if (index === -1) {
        return current;
      }

      const newIndex =
        direction === "up"
          ? index - 1
          : index + 1;

      if (
        newIndex < 0 ||
        newIndex >= current.length
      ) {
        return current;
      }

      const next = [...current];

      const [moved] =
        next.splice(index, 1);

      next.splice(
        newIndex,
        0,
        moved
      );

      return next;
    });
  }

  // --------------------------------------------------
  // Fields
  // --------------------------------------------------

  function toggleField(
    fieldId: string
  ) {
    setSelectedFields(
      (current) =>
        current.includes(fieldId)
          ? current.filter(
              (id) => id !== fieldId
            )
          : [
              ...current,
              fieldId,
            ]
    );
  }

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError(
        "Title is required."
      );

      return;
    }

    if (!slug.trim()) {
      setError(
        "Slug is required."
      );

      return;
    }

    if (!primaryImage) {
      setError(
        "Primary image is required."
      );

      return;
    }

    if (selectedFields.length === 0) {
      setError(
        "Select at least one cybersecurity field."
      );

      return;
    }

    const hasText = blocks.some(
      (block) =>
        block.type === "text" &&
        block.text.trim().length > 0
    );

    if (!hasText) {
      setError(
        "Article content is required."
      );

      return;
    }

    const cleanedBlocks =
      blocks.filter((block) => {
        if (block.type === "text") {
          return (
            block.text.trim().length > 0
          );
        }

        return block.url.trim().length > 0;
      });

    if (cleanedBlocks.length === 0) {
      setError(
        "Article content is required."
      );

      return;
    }

    setSaving(true);

    try {
      const contentBlocks =
        cleanedBlocks.map(
          (block) => {
            if (
              block.type === "text"
            ) {
              return {
                type: "text",
                text: block.text.trim(),
              };
            }

            return {
              type: "image",
              url: block.url.trim(),
            };
          }
        );

      const inlineImages =
        cleanedBlocks
          .filter(
            (
              block
            ): block is ImageBlock =>
              block.type ===
                "image" &&
              block.url.trim()
                .length > 0
          )
          .map(
            (block, index) => ({
              publicId:
                block.publicId,
              url: block.url,
              width:
                block.width || null,
              height:
                block.height || null,
              sortOrder:
                index + 1,
              isPrimary: false,
            })
          );

      const images = [
        {
          publicId:
            primaryImage.publicId,

          url:
            primaryImage.url,

          width:
            primaryImage.width,

          height:
            primaryImage.height,

          sortOrder: 0,

          isPrimary: true,
        },

        ...inlineImages,
      ];

      const response =
        await fetch(
          "/api/admin/blogs",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title:
                title.trim(),

              slug:
                slug.trim(),

              excerpt:
                excerpt.trim(),

              content:
                JSON.stringify(
                  contentBlocks
                ),

              access,

              status,

              featured,

              fieldIds:
                selectedFields,

              images,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to create blog."
        );

        return;
      }

      router.push(
        "/admin/blogs"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "CREATE BLOG ERROR:",
        error
      );

      setError(
        "Something went wrong while creating the blog."
      );
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Error */}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Basic Information */}

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="mb-6 text-lg font-semibold text-white">
          Basic Information
        </h2>

        <div className="space-y-5">
          {/* Title */}

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Title
            </label>

            <input
              value={title}
              onChange={(event) => {
                const value =
                  event.target.value;

                setTitle(value);

                if (!slug) {
                  setSlug(
                    generateSlug(
                      value
                    )
                  );
                }
              }}
              placeholder="Enter blog title"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-cyan-400"
            />
          </div>

          {/* Slug */}

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Slug
            </label>

            <input
              value={slug}
              onChange={(event) =>
                setSlug(
                  generateSlug(
                    event.target.value
                  )
                )
              }
              placeholder="blog-url-slug"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-cyan-400"
            />

            <p className="mt-2 text-xs text-gray-500">
              URL: /blog/
              {slug ||
                "your-blog-slug"}
            </p>
          </div>

          {/* Excerpt */}

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Excerpt
            </label>

            <textarea
              value={excerpt}
              onChange={(event) =>
                setExcerpt(
                  event.target.value
                )
              }
              rows={4}
              placeholder="Short description shown on blog cards..."
              className="w-full resize-y rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-cyan-400"
            />
          </div>
        </div>
      </section>

      {/* Primary Image */}

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="mb-2 text-lg font-semibold text-white">
          Primary Image
        </h2>

        <p className="mb-5 text-sm text-gray-500">
          This image appears at the top of the article and on blog cards.
        </p>

        <ImageUploader
          label="Upload Primary Image"
          value={
            primaryImage?.url
          }
          required
          onUpload={(image) =>
            setPrimaryImage(
              image
            )
          }
          onRemove={() =>
            setPrimaryImage(
              null
            )
          }
        />
      </section>

      {/* Article Content */}

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">
            Article Content
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Build the article using text and image blocks. Images will appear exactly where you place them.
          </p>
        </div>

        <div className="space-y-4">
          {blocks.map(
            (block, index) => (
              <div
                key={block.id}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                {/* Block header */}

                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {block.type ===
                    "text"
                      ? `Text ${
                          index + 1
                        }`
                      : `Image ${
                          index + 1
                        }`}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={
                        index === 0
                      }
                      onClick={() =>
                        moveBlock(
                          block.id,
                          "up"
                        )
                      }
                      className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-white/5 hover:text-white disabled:opacity-20"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                        blocks.length -
                          1
                      }
                      onClick={() =>
                        moveBlock(
                          block.id,
                          "down"
                        )
                      }
                      className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-white/5 hover:text-white disabled:opacity-20"
                    >
                      ↓
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removeBlock(
                          block.id
                        )
                      }
                      disabled={
                        blocks.length ===
                        1
                      }
                      className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-400/10 disabled:opacity-20"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Text block */}

                {block.type ===
                  "text" && (
                  <textarea
                    value={
                      block.text
                    }
                    onChange={(
                      event
                    ) =>
                      updateTextBlock(
                        block.id,
                        event.target
                          .value
                      )
                    }
                    rows={8}
                    placeholder="Write a section of your article..."
                    className="w-full resize-y rounded-lg border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm leading-7 text-white outline-none placeholder:text-gray-600 focus:border-cyan-400"
                  />
                )}

                {/* Image block */}

                {block.type ===
                  "image" && (
                  <ImageUploader
                    label="Article Image"
                    value={
                      block.url ||
                      undefined
                    }
                    onUpload={(
                      image
                    ) =>
                      updateImageBlock(
                        block.id,
                        image
                      )
                    }
                    onRemove={() =>
                      removeImageFromBlock(
                        block.id
                      )
                    }
                  />
                )}

                {/* Add block controls */}

                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      addTextBlock(
                        block.id
                      )
                    }
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-gray-400 transition hover:border-white/30 hover:text-white"
                  >
                    + Text
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      addImageBlock(
                        block.id
                      )
                    }
                    className="rounded-lg border border-cyan-400/30 px-3 py-2 text-xs font-medium text-cyan-400 transition hover:bg-cyan-400/10"
                  >
                    + Image
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Add block at bottom */}

        <div className="mt-5 flex justify-center gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={() =>
              addTextBlock()
            }
            className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-400 hover:border-white/30 hover:text-white"
          >
            + Add Text
          </button>

          <button
            type="button"
            onClick={() =>
              addImageBlock()
            }
            className="rounded-lg border border-cyan-400/30 px-4 py-2.5 text-sm text-cyan-400 hover:bg-cyan-400/10"
          >
            + Add Image
          </button>
        </div>
      </section>

      {/* Fields */}

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="mb-2 text-lg font-semibold text-white">
          Cybersecurity Fields
        </h2>

        <p className="mb-5 text-sm text-gray-500">
          Select all fields that apply to this article.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map(
            (field) => {
              const selected =
                selectedFields.includes(
                  field.id
                );

              return (
                <button
                  key={field.id}
                  type="button"
                  onClick={() =>
                    toggleField(
                      field.id
                    )
                  }
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                    selected
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                      : "border-white/10 bg-black/20 text-gray-400 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {field.name}
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* Publishing */}

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="mb-6 text-lg font-semibold text-white">
          Publishing
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Status */}

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target
                    .value as
                    | "DRAFT"
                    | "PUBLISHED"
                )
              }
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="DRAFT">
                Draft
              </option>

              <option value="PUBLISHED">
                Published
              </option>
            </select>
          </div>

          {/* Access */}

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Access
            </label>

            <select
              value={access}
              onChange={(event) =>
                setAccess(
                  event.target
                    .value as
                    | "FREE"
                    | "PAID"
                )
              }
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="FREE">
                Free
              </option>

              <option value="PAID">
                Paid
              </option>
            </select>
          </div>

          {/* Featured */}

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) =>
                setFeatured(
                  event.target
                    .checked
                )
              }
              className="h-4 w-4 accent-cyan-400"
            />

            <span>
              <span className="block text-sm font-medium text-white">
                Featured blog
              </span>

              <span className="text-xs text-gray-500">
                Highlight this article as featured content.
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* Actions */}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/blogs"
            )
          }
          className="rounded-lg border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
        >
          Cancel
        </button>

        <button
  type="submit"
  disabled={saving}
  onClick={() => {
    console.log("CREATE BLOG BUTTON CLICKED");
  }}
  className="rounded-lg bg-cyan-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
>
  {saving ? "Creating..." : "Create Blog"}
</button>
      </div>
    </form>
  );
}