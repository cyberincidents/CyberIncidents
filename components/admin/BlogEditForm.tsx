"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ImageUploader from "@/components/admin/ImageUploader";

/* =====================================================
   TYPES
===================================================== */

type Field = {
  id: string;
  name: string;
  slug: string;
  number: string | null;
};

type BlogImage = {
  id: string;
  publicId: string;
  url: string | null;
  width: number | null;
  height: number | null;
  sortOrder: number;
  isPrimary: boolean;
};

type BlogField = {
  fieldId: string;
  field: Field;
};

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  access: "FREE" | "PAID";
  featured: boolean;
  fields: BlogField[];
  images: BlogImage[];
};

type Props = {
  blog: Blog;
  fields: Field[];
};

type UploadedImage = {
  publicId: string;
  url: string;
  width: number;
  height: number;
};

type ContentBlock =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image";
      image: UploadedImage | null;
    };

/* =====================================================
   PARSE CONTENT
===================================================== */

function parseContent(
  content: string
): ContentBlock[] {
  try {
    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed)) {
      return [
        {
          type: "text",
          text: content,
        },
      ];
    }

    return parsed
      .filter(
        (block) =>
          block?.type === "text" ||
          block?.type === "image"
      )
      .map((block) => {
        if (block.type === "text") {
          return {
            type: "text" as const,
            text: String(
              block.text ?? ""
            ),
          };
        }

        return {
          type: "image" as const,
          image: block.url
            ? {
                publicId: String(
                  block.publicId ??
                    block.url
                ),
                url: String(
                  block.url
                ),
                width: Number(
                  block.width ?? 0
                ),
                height: Number(
                  block.height ?? 0
                ),
              }
            : null,
        };
      });
  } catch {
    return [
      {
        type: "text",
        text: content,
      },
    ];
  }
}

/* =====================================================
   COMPONENT
===================================================== */

export default function BlogEditForm({
  blog,
  fields,
}: Props) {
  const router = useRouter();

  /* ===================================================
     EXISTING PRIMARY IMAGE
  =================================================== */

  const existingPrimaryImage =
    blog.images.find(
      (image) => image.isPrimary
    ) ??
    blog.images[0] ??
    null;

  /* ===================================================
     EXISTING CONTENT
  =================================================== */

  const initialBlocks =
    parseContent(blog.content);

  /*
   * Match existing inline content images
   * with their BlogImage database records.
   */

  const initialBlocksWithImages =
    initialBlocks.map((block) => {
      if (
        block.type !== "image" ||
        !block.image
      ) {
        return block;
      }

      const existingImage =
        blog.images.find(
          (image) =>
            !image.isPrimary &&
            image.url ===
              block.image?.url
        );

      if (!existingImage) {
        return block;
      }

      return {
        type: "image" as const,
        image: {
          publicId:
            existingImage.publicId,

          url:
            existingImage.url ?? "",

          width:
            existingImage.width ?? 0,

          height:
            existingImage.height ?? 0,
        },
      };
    });

  /* ===================================================
     STATE
  =================================================== */

  const [title, setTitle] =
    useState(blog.title);

  const [slug, setSlug] =
    useState(blog.slug);

  const [excerpt, setExcerpt] =
    useState(
      blog.excerpt ?? ""
    );

  const [blocks, setBlocks] =
    useState<ContentBlock[]>(
      initialBlocksWithImages
    );

  const [selectedFields, setSelectedFields] =
    useState<string[]>(
      blog.fields.map(
        (item) => item.fieldId
      )
    );

  const [primaryImage, setPrimaryImage] =
    useState<UploadedImage | null>(
      existingPrimaryImage?.url
        ? {
            publicId:
              existingPrimaryImage.publicId,

            url:
              existingPrimaryImage.url,

            width:
              existingPrimaryImage.width ??
              0,

            height:
              existingPrimaryImage.height ??
              0,
          }
        : null
    );

  const [status, setStatus] =
    useState(blog.status);

  const [access, setAccess] =
    useState(blog.access);

  const [featured, setFeatured] =
    useState(blog.featured);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /* ===================================================
     FIELDS
  =================================================== */

  function toggleField(
    fieldId: string
  ) {
    setSelectedFields(
      (current) =>
        current.includes(fieldId)
          ? current.filter(
              (id) =>
                id !== fieldId
            )
          : [
              ...current,
              fieldId,
            ]
    );
  }

  /* ===================================================
     CONTENT BLOCKS
  =================================================== */

  function updateTextBlock(
    index: number,
    value: string
  ) {
    setBlocks((current) =>
      current.map(
        (block, i) =>
          i === index &&
          block.type === "text"
            ? {
                ...block,
                text: value,
              }
            : block
      )
    );
  }

  function updateImageBlock(
    index: number,
    image: UploadedImage | null
  ) {
    setBlocks((current) =>
      current.map(
        (block, i) =>
          i === index &&
          block.type === "image"
            ? {
                ...block,
                image,
              }
            : block
      )
    );
  }

  function addTextBlock() {
    setBlocks((current) => [
      ...current,
      {
        type: "text",
        text: "",
      },
    ]);
  }

  function addImageBlock() {
    setBlocks((current) => [
      ...current,
      {
        type: "image",
        image: null,
      },
    ]);
  }

  function removeBlock(
    index: number
  ) {
    setBlocks((current) =>
      current.filter(
        (_, i) => i !== index
      )
    );
  }

  function moveBlock(
    index: number,
    direction: "up" | "down"
  ) {
    setBlocks((current) => {
      const next = [...current];

      const target =
        direction === "up"
          ? index - 1
          : index + 1;

      if (
        target < 0 ||
        target >= next.length
      ) {
        return current;
      }

      [
        next[index],
        next[target],
      ] = [
        next[target],
        next[index],
      ];

      return next;
    });
  }

  /* ===================================================
     SUBMIT
  =================================================== */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    /* -----------------------------------------------
       Validate title
    ------------------------------------------------ */

    if (!title.trim()) {
      setMessage(
        "Title is required."
      );
      return;
    }

    /* -----------------------------------------------
       Validate slug
    ------------------------------------------------ */

    if (!slug.trim()) {
      setMessage(
        "Slug is required."
      );
      return;
    }

    /* -----------------------------------------------
       Validate primary image
    ------------------------------------------------ */

    if (!primaryImage) {
      setMessage(
        "Primary image is required."
      );
      return;
    }

    /* -----------------------------------------------
       Validate fields
    ------------------------------------------------ */

    if (
      selectedFields.length === 0
    ) {
      setMessage(
        "Select at least one field."
      );
      return;
    }

    /* -----------------------------------------------
       Validate article content
    ------------------------------------------------ */

    const hasText =
      blocks.some(
        (block) =>
          block.type === "text" &&
          block.text.trim().length > 0
      );

    if (!hasText) {
      setMessage(
        "Article content is required."
      );
      return;
    }

    /* -----------------------------------------------
       Remove empty blocks
    ------------------------------------------------ */

    const cleanedBlocks =
      blocks.filter((block) => {
        if (
          block.type === "text"
        ) {
          return (
            block.text.trim()
              .length > 0
          );
        }

        return Boolean(
          block.image?.url?.trim()
        );
      });

    /* -----------------------------------------------
       Serialize article content
    ------------------------------------------------ */

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
            url: block.image!.url,
          };
        }
      );

    /* -----------------------------------------------
       Collect inline images
    ------------------------------------------------ */

    const inlineImages =
      cleanedBlocks
        .filter(
          (
            block
          ): block is {
            type: "image";
            image: UploadedImage;
          } =>
            block.type === "image" &&
            !!block.image?.url
        )
        .map(
          (
            block,
            index
          ) => ({
            publicId:
              block.image.publicId,

            url:
              block.image.url,

            width:
              block.image.width ||
              null,

            height:
              block.image.height ||
              null,

            sortOrder:
              index + 1,

            isPrimary: false,
          })
        );

    /* -----------------------------------------------
       All images
    ------------------------------------------------ */

    const images = [
      {
        publicId:
          primaryImage.publicId,

        url:
          primaryImage.url,

        width:
          primaryImage.width ||
          null,

        height:
          primaryImage.height ||
          null,

        sortOrder: 0,

        isPrimary: true,
      },

      ...inlineImages,
    ];

    /* =================================================
       SAVE
    ================================================= */

    try {
      setSaving(true);

      const response =
        await fetch(
          `/api/admin/blogs/${blog.id}`,
          {
            method: "PUT",

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
        setMessage(
          data.message ||
            "Unable to update blog."
        );

        return;
      }

      router.push(
        "/admin/blogs"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "UPDATE BLOG ERROR:",
        error
      );

      setMessage(
        "Something went wrong while updating the blog."
      );
    } finally {
      setSaving(false);
    }
  }

  /* ===================================================
     UI
  =================================================== */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* =================================================
          ERROR / STATUS
      ================================================= */}

      {message && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {message}
        </div>
      )}

      {/* =================================================
          BLOG INFORMATION
      ================================================= */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">
          Blog Information
        </h2>

        <div className="space-y-5">
          {/* Title */}

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Title
            </label>

            <input
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="Blog title"
            />
          </div>

          {/* Slug */}

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Slug
            </label>

            <input
              value={slug}
              onChange={(event) =>
                setSlug(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="blog-slug"
            />
          </div>

          {/* Excerpt */}

          <div>
            <label className="mb-2 block text-sm text-slate-300">
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
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="Short blog description"
            />
          </div>
        </div>
      </section>

      {/* =================================================
          PRIMARY IMAGE
      ================================================= */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-2 text-xl font-semibold text-white">
          Primary Image
        </h2>

        <p className="mb-5 text-sm text-slate-400">
          This image appears at the beginning
          of the article and on blog cards.
        </p>

        <div className="space-y-4">
          <ImageUploader
            /*
             * ImageUploader expects a URL string.
             * We keep the complete UploadedImage
             * object in our state.
             */
            value={
              primaryImage?.url ??
              undefined
            }
            onUpload={(image) =>
              setPrimaryImage(
                image
              )
            }
            onRemove={() =>
              setPrimaryImage(null)
            }
            label="Primary Image"
            required
          />

          {primaryImage && (
            <button
              type="button"
              onClick={() =>
                setPrimaryImage(
                  null
                )
              }
              className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
            >
              Remove Image
            </button>
          )}
        </div>
      </section>

      {/* =================================================
          ARTICLE CONTENT
      ================================================= */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Article Content
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Text and images can be arranged
              in any order.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={
                addTextBlock
              }
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-800"
            >
              + Text
            </button>

            <button
              type="button"
              onClick={
                addImageBlock
              }
              className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
            >
              + Image
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {blocks.map(
            (block, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-700 bg-slate-950 p-4"
              >
                {/* -----------------------------------------
                    Block Header
                ------------------------------------------ */}

                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    {block.type ===
                    "text"
                      ? `Text ${
                          index + 1
                        }`
                      : `Image ${
                          index + 1
                        }`}
                  </span>

                  <div className="flex gap-2">
                    {/* Move Up */}

                    <button
                      type="button"
                      disabled={
                        index === 0
                      }
                      onClick={() =>
                        moveBlock(
                          index,
                          "up"
                        )
                      }
                      className="rounded bg-slate-800 px-2 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ↑
                    </button>

                    {/* Move Down */}

                    <button
                      type="button"
                      disabled={
                        index ===
                        blocks.length -
                          1
                      }
                      onClick={() =>
                        moveBlock(
                          index,
                          "down"
                        )
                      }
                      className="rounded bg-slate-800 px-2 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ↓
                    </button>

                    {/* Remove Block */}

                    <button
                      type="button"
                      onClick={() =>
                        removeBlock(
                          index
                        )
                      }
                      className="rounded bg-red-500/10 px-2 py-1 text-xs text-red-400 hover:bg-red-500/20"
                    >
                      Remove Block
                    </button>
                  </div>
                </div>

                {/* -----------------------------------------
                    Text Block
                ------------------------------------------ */}

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
                        index,
                        event.target
                          .value
                      )
                    }
                    rows={7}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                    placeholder="Write your article section..."
                  />
                )}

                {/* -----------------------------------------
                    Image Block
                ------------------------------------------ */}

                {block.type ===
                  "image" && (
                  <div className="space-y-4">
                    <ImageUploader
                      /*
                       * ImageUploader expects
                       * string | undefined.
                       */
                      value={
                        block.image?.url ??
                        undefined
                      }
                      onUpload={(
                        image
                      ) =>
                        updateImageBlock(
                          index,
                          image
                        )
                      }
                      onRemove={() =>
                        updateImageBlock(
                          index,
                          null
                        )
                      }
                      label={`Article Image ${
                        index + 1
                      }`}
                    />

                    {block.image && (
                      <button
                        type="button"
                        onClick={() =>
                          updateImageBlock(
                            index,
                            null
                          )
                        }
                        className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {blocks.length ===
          0 && (
          <div className="rounded-xl border border-dashed border-slate-700 px-6 py-10 text-center text-sm text-slate-500">
            No article blocks.
            <br />
            Add text or image content
            above.
          </div>
        )}
      </section>

      {/* =================================================
          CYBERSECURITY FIELDS
      ================================================= */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Cybersecurity Fields
        </h2>

        <div className="flex flex-wrap gap-3">
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
                  className={`rounded-lg border px-4 py-2 text-sm transition ${
                    selected
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                      : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
                  }`}
                >
                  {field.number
                    ? `${field.number}. `
                    : ""}
                  {field.name}
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* =================================================
          PUBLISHING
      ================================================= */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-5 text-xl font-semibold text-white">
          Publishing
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Status */}

          <div>
            <label className="mb-2 block text-sm text-slate-300">
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
                    | "ARCHIVED"
                )
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            >
              <option value="DRAFT">
                Draft
              </option>

              <option value="PUBLISHED">
                Published
              </option>

              <option value="ARCHIVED">
                Archived
              </option>
            </select>
          </div>

          {/* Access */}

          <div>
            <label className="mb-2 block text-sm text-slate-300">
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
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            >
              <option value="FREE">
                Free
              </option>

              <option value="PAID">
                Paid
              </option>
            </select>
          </div>
        </div>

        {/* Featured */}

        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-slate-300">
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

          Featured blog
        </label>
      </section>

      {/* =================================================
          ACTIONS
      ================================================= */}

      <div className="flex flex-wrap gap-3 border-t border-slate-800 pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/blogs"
            )
          }
          className="rounded-lg border border-slate-700 px-6 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}