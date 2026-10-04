"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";

import { fields as navbarFields } from "@/lib/data/fields";

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
  author: string;
  content: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  access: "FREE" | "PAID";
  featured: boolean;
  fields: BlogField[];
  images: BlogImage[];
};

type Props = {
  blog?: Blog;
  fields: Field[];
};

type UploadedImage = {
  publicId: string;
  url: string;
  width: number;
  height: number;
};

type RawBlock =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image";
      image: UploadedImage | null;
    };

/*
 * Every block gets a stable `id` so React keeps the right
 * editor / uploader state when blocks are moved or removed.
 * The id is UI-only and is never sent to the API.
 */
type ContentBlock = RawBlock & { id: string };

/* =====================================================
   PARSE CONTENT
===================================================== */

function parseContent(content: string): RawBlock[] {
  try {
    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed)) {
      return [{ type: "text", text: content }];
    }

    return parsed
      .filter(
        (block) => block?.type === "text" || block?.type === "image"
      )
      .map((block): RawBlock => {
        if (block.type === "text") {
          return {
            type: "text",
            text: String(block.text ?? ""),
          };
        }

        return {
          type: "image",
          image: block.url
            ? {
                publicId: String(block.publicId ?? block.url),
                url: String(block.url),
                width: Number(block.width ?? 0),
                height: Number(block.height ?? 0),
              }
            : null,
        };
      });
  } catch {
    return [{ type: "text", text: content }];
  }
}

/* =====================================================
   SLUG HELPERS
===================================================== */

function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* =====================================================
   SHARED STYLES
===================================================== */

/*
 * text-base on mobile prevents iOS Safari from zooming into
 * inputs on focus; it drops to text-sm from the sm breakpoint.
 */
const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 sm:text-sm";

const labelClass = "mb-2 block text-sm font-medium text-slate-300";

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:border-cyan-400/50 hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50";

const dangerButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50";

const iconButtonClass =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-slate-800 px-2 text-sm text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-slate-800";

const sectionClass =
  "rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6";

/* =====================================================
   SMALL UI HELPERS
===================================================== */

function SectionHeader({
  title,
  description,
  right,
}: {
  title: string;
  description?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3 sm:mb-6">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-white sm:text-xl">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        )}
      </div>

      {right}
    </div>
  );
}

function NumberBadge({ value }: { value: string | null }) {
  return (
    <span className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-2 text-xs font-bold text-cyan-400">
      {value}
    </span>
  );
}

function CheckBox({
  selected,
  size = "md",
}: {
  selected: boolean;
  size?: "sm" | "md";
}) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded border transition ${
        size === "md" ? "h-5 w-5 text-xs" : "mt-0.5 h-4 w-4 text-[10px]"
      } ${
        selected
          ? "border-cyan-400 bg-cyan-400 text-slate-950"
          : "border-slate-600"
      }`}
    >
      {selected ? "✓" : ""}
    </span>
  );
}

/* =====================================================
   COMPONENT
===================================================== */

export default function BlogEditForm({ blog, fields }: Props) {
  const router = useRouter();

  /*
   * Supports both:
   *
   * CREATE
   * <BlogEditForm fields={fields} />
   *
   * EDIT
   * <BlogEditForm blog={blog} fields={fields} />
   */

  const formBlog: Blog = blog ?? {
    id: "",
    title: "",
    slug: "",
    excerpt: null,
    author: "CyberIncidents Team",
    content: "",
    status: "DRAFT",
    access: "FREE",
    featured: false,
    fields: [],
    images: [],
  };

  const isEditMode = formBlog.id.length > 0;

  /* ===================================================
     EXISTING PRIMARY IMAGE
  =================================================== */

  const existingPrimaryImage =
    formBlog.images.find((image) => image.isPrimary) ??
    formBlog.images[0] ??
    null;

  /* ===================================================
     EXISTING CONTENT
  =================================================== */

  /*
   * Stable block ids. Initial blocks use their index,
   * new blocks continue from the counter.
   */
  const idCounter = useRef(0);

  function makeId() {
    idCounter.current += 1;
    return `block-${idCounter.current}`;
  }

  function buildInitialBlocks(): ContentBlock[] {
    const rawBlocks: RawBlock[] = formBlog.content.trim()
      ? parseContent(formBlog.content)
      : [{ type: "text", text: "" }];

    /*
     * Match existing inline images with their
     * BlogImage database records.
     */
    const matched = rawBlocks.map((block): RawBlock => {
      if (block.type !== "image" || !block.image) {
        return block;
      }

      const existingImage = formBlog.images.find(
        (image) => !image.isPrimary && image.url === block.image?.url
      );

      if (!existingImage) {
        return block;
      }

      return {
        type: "image",
        image: {
          publicId: existingImage.publicId,
          url: existingImage.url ?? "",
          width: existingImage.width ?? 0,
          height: existingImage.height ?? 0,
        },
      };
    });

    idCounter.current = matched.length;

    return matched.map(
      (block, index): ContentBlock => ({
        ...block,
        id: `block-${index + 1}`,
      })
    );
  }

  /* ===================================================
     STATE
  =================================================== */

  const [title, setTitle] = useState(formBlog.title);

  const [slug, setSlug] = useState(formBlog.slug);

  /*
   * CREATE:
   * Slug is generated automatically while typing the title.
   *
   * EDIT:
   * Keep the existing slug unchanged when the title changes.
   * Once the slug is manually cleared, changing the title will
   * generate a new slug again.
   */
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    isEditMode && Boolean(formBlog.slug.trim())
  );

  const [excerpt, setExcerpt] = useState(formBlog.excerpt ?? "");

  const [author, setAuthor] = useState(
    formBlog.author || "CyberIncidents Team"
  );

  const [blocks, setBlocks] = useState<ContentBlock[]>(buildInitialBlocks);

  /*
   * IMPORTANT:
   *
   * The selected fields are identified by their
   * database IDs.
   *
   * The `fields` prop comes from the same Field
   * records used by the navbar.
   */
  const [selectedFields, setSelectedFields] = useState<string[]>(
    formBlog.fields.map((item) => item.fieldId)
  );

  const [primaryImage, setPrimaryImage] = useState<UploadedImage | null>(
    existingPrimaryImage?.url
      ? {
          publicId: existingPrimaryImage.publicId,
          url: existingPrimaryImage.url,
          width: existingPrimaryImage.width ?? 0,
          height: existingPrimaryImage.height ?? 0,
        }
      : null
  );

  const [status, setStatus] = useState(formBlog.status);

  const [access, setAccess] = useState(formBlog.access);

  const [featured, setFeatured] = useState(formBlog.featured);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  /*
   * Bring the error into view so it is never missed on
   * long forms / small screens.
   */
  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (message) {
      messageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [message]);

  /* ===================================================
     FIELDS
  =================================================== */

  function toggleField(fieldId: string) {
    setSelectedFields((current) =>
      current.includes(fieldId)
        ? current.filter((id) => id !== fieldId)
        : [...current, fieldId]
    );
  }

  /* ===================================================
     CONTENT BLOCKS
  =================================================== */

  function updateTextBlock(index: number, value: string) {
    setBlocks((current) =>
      current.map((block, i) =>
        i === index && block.type === "text"
          ? { ...block, text: value }
          : block
      )
    );
  }

  function updateImageBlock(index: number, image: UploadedImage | null) {
    setBlocks((current) =>
      current.map((block, i) =>
        i === index && block.type === "image" ? { ...block, image } : block
      )
    );
  }

  function addTextBlock() {
    setBlocks((current) => [
      ...current,
      { id: makeId(), type: "text", text: "" },
    ]);
  }

  function addImageBlock() {
    setBlocks((current) => [
      ...current,
      { id: makeId(), type: "image", image: null },
    ]);
  }

  function addTextBlockAfter(index: number) {
    const id = makeId();

    setBlocks((current) => {
      const next = [...current];
      next.splice(index + 1, 0, { id, type: "text", text: "" });
      return next;
    });
  }

  function addImageBlockAfter(index: number) {
    const id = makeId();

    setBlocks((current) => {
      const next = [...current];
      next.splice(index + 1, 0, { id, type: "image", image: null });
      return next;
    });
  }

  function removeBlock(index: number) {
    setBlocks((current) => current.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, direction: "up" | "down") {
    setBlocks((current) => {
      const next = [...current];

      const target = direction === "up" ? index - 1 : index + 1;

      if (target < 0 || target >= next.length) {
        return current;
      }

      [next[index], next[target]] = [next[target], next[index]];

      return next;
    });
  }

  /* ===================================================
     SUBMIT
  =================================================== */

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    /* -----------------------------------------------
       Validate title
    ------------------------------------------------ */

    if (!title.trim()) {
      setMessage("Title is required.");
      return;
    }

    /* -----------------------------------------------
       Validate slug
    ------------------------------------------------ */

    if (!slug.trim()) {
      setMessage("Slug is required.");
      return;
    }

    /* -----------------------------------------------
       Validate author
    ------------------------------------------------ */

    if (!author.trim()) {
      setMessage("Author name is required.");
      return;
    }

    /* -----------------------------------------------
       Validate primary image
    ------------------------------------------------ */

    if (!primaryImage) {
      setMessage("Primary image is required.");
      return;
    }

    /* -----------------------------------------------
       Validate fields
    ------------------------------------------------ */

    if (selectedFields.length === 0) {
      setMessage("Select at least one cybersecurity field.");
      return;
    }

    /* -----------------------------------------------
       Validate article content
    ------------------------------------------------ */

    const hasText = blocks.some(
      (block) => block.type === "text" && block.text.trim().length > 0
    );

    if (!hasText) {
      setMessage("Article content is required.");
      return;
    }

    /* -----------------------------------------------
       Remove empty blocks
    ------------------------------------------------ */

    const cleanedBlocks = blocks.filter((block) => {
      if (block.type === "text") {
        return block.text.trim().length > 0;
      }

      return Boolean(block.image?.url?.trim());
    });

    /* -----------------------------------------------
       Serialize article content
    ------------------------------------------------ */

    const contentBlocks = cleanedBlocks.map((block) => {
      if (block.type === "text") {
        return {
          type: "text",
          text: block.text.trim(),
        };
      }

      return {
        type: "image",
        url: block.image!.url,
      };
    });

    /* -----------------------------------------------
       Collect inline images
    ------------------------------------------------ */

    const inlineImages = cleanedBlocks
      .filter(
        (
          block
        ): block is {
          id: string;
          type: "image";
          image: UploadedImage;
        } => block.type === "image" && !!block.image?.url
      )
      .map((block, index) => ({
        publicId: block.image.publicId,
        url: block.image.url,
        width: block.image.width || null,
        height: block.image.height || null,
        sortOrder: index + 1,
        isPrimary: false,
      }));

    /* -----------------------------------------------
       All images
    ------------------------------------------------ */

    const images = [
      {
        publicId: primaryImage.publicId,
        url: primaryImage.url,
        width: primaryImage.width || null,
        height: primaryImage.height || null,
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

      const response = await fetch(
        isEditMode
          ? `/api/admin/blogs/${formBlog.id}`
          : "/api/admin/blogs",
        {
          method: isEditMode ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim(),
            author: author.trim(),
            content: JSON.stringify(contentBlocks),
            access,
            status,
            featured,

            /*
             * These are the IDs of the SAME
             * cybersecurity fields used by the
             * navbar.
             */
            fieldIds: selectedFields,

            images,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            data.error ||
            `Unable to ${isEditMode ? "update" : "create"} blog.`
        );

        return;
      }

      router.push("/admin/blogs");

      router.refresh();
    } catch (error) {
      console.error("BLOG SAVE ERROR:", error);

      setMessage(
        `Something went wrong while ${
          isEditMode ? "updating" : "creating"
        } the blog.`
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
      noValidate
      className="mx-auto w-full max-w-5xl space-y-6"
    >
      {/* =================================================
          ERROR / STATUS
      ================================================= */}

      {message && (
        <div
          ref={messageRef}
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {message}
        </div>
      )}

      {/* =================================================
          TWO-COLUMN LAYOUT
          Mobile / tablet: single column
          Desktop (lg+):   content + sticky publishing panel
      ================================================= */}

      <div>
        <div className="min-w-0 space-y-6">
          {/* ---------------------------------------------
              BLOG INFORMATION
          --------------------------------------------- */}

          <section className={sectionClass}>
            <SectionHeader title="Blog Information" />

            <div className="space-y-5">
              {/* Title */}

              <div>
                <label htmlFor="blog-title" className={labelClass}>
                  Title
                </label>

                <input
                  id="blog-title"
                  value={title}
                  onChange={(event) => {
                    const nextTitle = event.target.value;

                    setTitle(nextTitle);

                    /*
                     * Automatically generate the slug while the slug
                     * is still controlled by the title.
                     *
                     * In edit mode, the existing slug is preserved
                     * until the admin clears it manually.
                     */
                    if (!slugManuallyEdited || !slug.trim()) {
                      setSlug(generateSlug(nextTitle));
                    }
                  }}
                  className={inputClass}
                  placeholder="Blog title"
                />
              </div>

              {/* Slug + Author side by side on larger screens */}

              <div className="grid gap-5 md:grid-cols-2">
                {/* Slug */}

                <div className="min-w-0">
                  <label htmlFor="blog-slug" className={labelClass}>
                    Slug
                  </label>

                  <input
                    id="blog-slug"
                    value={slug}
                    onChange={(event) => {
                      const nextSlug = generateSlug(event.target.value);

                      setSlug(nextSlug);

                      /*
                       * Once the admin changes the slug manually,
                       * title changes must no longer overwrite it.
                       *
                       * If the admin clears the slug completely,
                       * the title is allowed to generate a new one.
                       */
                      setSlugManuallyEdited(nextSlug.trim().length > 0);
                    }}
                    className={inputClass}
                    placeholder="blog-slug"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Auto-generated from the title. You can edit it manually.
                  </p>
                </div>

                {/* Author */}

                <div className="min-w-0">
                  <label htmlFor="blog-author" className={labelClass}>
                    Author Name
                  </label>

                  <input
                    id="blog-author"
                    value={author}
                    onChange={(event) => setAuthor(event.target.value)}
                    className={inputClass}
                    placeholder="Author name"
                  />
                </div>
              </div>

              {/* Excerpt */}

              <div>
                <label htmlFor="blog-excerpt" className={labelClass}>
                  Excerpt
                </label>

                <textarea
                  id="blog-excerpt"
                  value={excerpt}
                  onChange={(event) => setExcerpt(event.target.value)}
                  rows={4}
                  className={`${inputClass} resize-y`}
                  placeholder="Short blog description"
                />
              </div>
            </div>
          </section>

          {/* ---------------------------------------------
              PRIMARY IMAGE
          --------------------------------------------- */}

          <section className={sectionClass}>
            <SectionHeader
              title="Primary Image"
              description="This image appears at the beginning of the article and on blog cards."
            />

            <div className="space-y-4">
              <ImageUploader
                value={primaryImage?.url ?? undefined}
                onUpload={(image) => setPrimaryImage(image)}
                onRemove={() => setPrimaryImage(null)}
                label="Primary Image"
                required
              />

              {primaryImage && (
                <button
                  type="button"
                  onClick={() => setPrimaryImage(null)}
                  className={`${dangerButtonClass} w-full sm:w-auto`}
                >
                  Remove Image
                </button>
              )}
            </div>
          </section>

          {/* ---------------------------------------------
              ARTICLE CONTENT
          --------------------------------------------- */}

          <section className={sectionClass}>
            <SectionHeader
              title="Article Content"
              description="Text and images can be arranged in any order."
            />

            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  className="rounded-xl border border-slate-700 bg-slate-950 p-3 sm:p-4"
                >
                  {/* Block Header */}

                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold tracking-wide text-cyan-400">
                      {block.type === "text"
                        ? `Text ${index + 1}`
                        : `Image ${index + 1}`}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Move Up */}

                      <button
                        type="button"
                        aria-label={`Move block ${index + 1} up`}
                        disabled={index === 0}
                        onClick={() => moveBlock(index, "up")}
                        className={iconButtonClass}
                      >
                        ↑
                      </button>

                      {/* Move Down */}

                      <button
                        type="button"
                        aria-label={`Move block ${index + 1} down`}
                        disabled={index === blocks.length - 1}
                        onClick={() => moveBlock(index, "down")}
                        className={iconButtonClass}
                      >
                        ↓
                      </button>

                      {/* Remove */}

                      <button
                        type="button"
                        aria-label={`Remove block ${index + 1}`}
                        onClick={() => removeBlock(index)}
                        className="inline-flex h-9 items-center justify-center rounded-lg bg-red-500/10 px-3 text-xs font-medium text-red-400 transition hover:bg-red-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Text Block */}

                  {block.type === "text" && (
                    <div className="min-w-0 overflow-x-auto">
                      <RichTextEditor
                        value={block.text}
                        onChange={(value) => updateTextBlock(index, value)}
                        placeholder="Write your article section..."
                      />
                    </div>
                  )}

                  {/* Image Block */}

                  {block.type === "image" && (
                    <div className="space-y-4">
                      <ImageUploader
                        value={block.image?.url ?? undefined}
                        onUpload={(image) => updateImageBlock(index, image)}
                        onRemove={() => updateImageBlock(index, null)}
                        label={`Article Image ${index + 1}`}
                      />

                      {block.image && (
                        <button
                          type="button"
                          onClick={() => updateImageBlock(index, null)}
                          className={`${dangerButtonClass} w-full sm:w-auto`}
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                  )}

                  {/* Add controls for this block */}

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4">
                    <span className="mr-1 text-xs text-slate-500">
                      Add below
                    </span>

                    <button
                      type="button"
                      onClick={() => addTextBlockAfter(index)}
                      className={`${secondaryButtonClass} flex-1 sm:flex-none`}
                    >
                      + Text
                    </button>

                    <button
                      type="button"
                      onClick={() => addImageBlockAfter(index)}
                      className={`${primaryButtonClass} flex-1 sm:flex-none`}
                    >
                      + Image
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add controls only when there are no blocks */}

            {blocks.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-700 px-4 py-10 text-center text-sm text-slate-500 sm:px-6">
                No article blocks.
                <br />
                Add text or image content below.
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={addTextBlock}
                    className={`${secondaryButtonClass} flex-1 sm:flex-none`}
                  >
                    + Text
                  </button>

                  <button
                    type="button"
                    onClick={addImageBlock}
                    className={`${primaryButtonClass} flex-1 sm:flex-none`}
                  >
                    + Image
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* ---------------------------------------------
              CYBERSECURITY FIELDS
          --------------------------------------------- */}

          <section className={sectionClass}>
            <SectionHeader
              title="Cybersecurity Fields"
              description="Select the cybersecurity topic areas that this article belongs to."
              right={
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-400">
                  {selectedFields.length} selected
                </span>
              }
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {navbarFields.map((category) => {
                /*
                 * Only Threats & Attacks has subcategories.
                 */
                const isThreatsAndAttacks =
                  category.slug === "threats-attacks";

                /*
                 * --------------------------------------------------
                 * NORMAL TOP-LEVEL FIELD
                 * --------------------------------------------------
                 *
                 * Cyber News
                 * Incident Investigation
                 * Security & Defense
                 * Emerging Security
                 * Guides & Learning
                 *
                 * These fields are directly selectable.
                 */
                if (!isThreatsAndAttacks) {
                  const databaseField = fields.find(
                    (field) => field.slug === category.slug
                  );

                  if (!databaseField) {
                    return (
                      <div
                        key={category.id}
                        title="This field is not yet available in the database."
                        className="flex items-center gap-3 rounded-xl border border-dashed border-slate-800 bg-slate-950 p-4 opacity-70 sm:p-5"
                      >
                        <NumberBadge value={category.number} />

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-white">
                            {category.name}
                          </h3>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {category.subcategories.length} topics
                          </p>
                        </div>
                      </div>
                    );
                  }

                  const selected = selectedFields.includes(databaseField.id);

                  return (
                    <button
                      key={category.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleField(databaseField.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 sm:p-5 ${
                        selected
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-slate-800 bg-slate-950 hover:border-slate-600"
                      }`}
                    >
                      <NumberBadge value={category.number} />

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white">
                          {category.name}
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {category.subcategories.length} topics
                        </p>
                      </div>

                      <CheckBox selected={selected} />
                    </button>
                  );
                }

                /*
                 * --------------------------------------------------
                 * THREATS & ATTACKS
                 * --------------------------------------------------
                 *
                 * Keeps the parent/subcategory structure and spans
                 * the full width of the grid.
                 */
                return (
                  <div
                    key={category.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:col-span-2 sm:p-5"
                  >
                    {/* Parent category */}

                    <div className="mb-4 flex items-center gap-3">
                      <NumberBadge value={category.number} />

                      <div className="min-w-0">
                        <h3 className="font-semibold text-white">
                          {category.name}
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {category.subcategories.length} topics
                        </p>
                      </div>
                    </div>

                    {/* Subcategories */}

                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      {category.subcategories.map((subcategory) => {
                        /*
                         * Find the corresponding database Field
                         * using the exact same slug used by
                         * the navbar configuration.
                         */
                        const databaseField = fields.find(
                          (field) => field.slug === subcategory.slug
                        );

                        /*
                         * A category that doesn't yet exist
                         * in PostgreSQL cannot be selected.
                         */
                        if (!databaseField) {
                          return (
                            <div
                              key={subcategory.id}
                              className="rounded-lg border border-dashed border-slate-800 bg-slate-900/50 px-3 py-3 text-sm text-slate-600"
                              title="This field is not yet available in the database."
                            >
                              {subcategory.name}
                            </div>
                          );
                        }

                        const selected = selectedFields.includes(
                          databaseField.id
                        );

                        return (
                          <button
                            key={subcategory.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleField(databaseField.id)}
                            className={`min-h-11 rounded-lg border px-3 py-3 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 ${
                              selected
                                ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                                : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500 hover:text-white"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <CheckBox selected={selected} size="sm" />

                              <span className="min-w-0 break-words">
                                {subcategory.name}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ---------------------------------------------
              PUBLISHING
          --------------------------------------------- */}

          <section className={sectionClass}>
            <SectionHeader title="Publishing" />

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Status */}

              <div>
                <label htmlFor="blog-status" className={labelClass}>
                  Status
                </label>

                <select
                  id="blog-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED"
                    )
                  }
                  className={inputClass}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              {/* Access */}

              <div>
                <label htmlFor="blog-access" className={labelClass}>
                  Access
                </label>

                <select
                  id="blog-access"
                  value={access}
                  onChange={(event) =>
                    setAccess(event.target.value as "FREE" | "PAID")
                  }
                  className={inputClass}
                >
                  <option value="FREE">Free</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
            </div>

            {/* Featured */}

            <label className="mt-5 flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 transition hover:border-slate-600">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) => setFeatured(event.target.checked)}
                className="h-4 w-4 accent-cyan-400"
              />
              Featured blog
            </label>
          </section>
        </div>

      </div>

      {/* =================================================
          ACTIONS
          Sticky so Save is always reachable on long forms
      ================================================= */}

      <div className="sticky bottom-3 z-20 flex flex-col-reverse gap-3 rounded-xl border border-slate-800 bg-slate-950/90 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg shadow-black/30 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <p className="hidden truncate text-sm text-slate-500 sm:block">
          {isEditMode ? "Editing blog" : "New blog"} ·{" "}
          {status === "DRAFT"
            ? "Draft"
            : status === "PUBLISHED"
              ? "Published"
              : "Archived"}
        </p>

        <div className="flex w-full gap-3 sm:w-auto">
          <button
            type="button"
            onClick={() => router.push("/admin/blogs")}
            className={`${secondaryButtonClass} flex-1 px-6 py-3 sm:flex-none`}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className={`${primaryButtonClass} flex-1 px-6 py-3 sm:flex-none`}
          >
            {saving
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Create Blog"}
          </button>
        </div>
      </div>
    </form>
  );
}