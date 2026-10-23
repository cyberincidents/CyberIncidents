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
  parentId?: string | null;
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

export type TableData = {
  hasHeader: boolean;
  caption?: string;
  headers: string[];
  rows: string[][];
};

export type CommandData = {
  command: string;
  language?: string;
  description?: string;
  output?: string;
};

export type RawBlock =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image";
      image: UploadedImage | null;
    }
  | {
      type: "table";
      table: TableData;
    }
  | {
      type: "command";
      command: CommandData;
    };

/*
 * Every block gets a stable `id` so React keeps the right
 * editor / uploader state when blocks are moved or removed.
 * The id is UI-only and is never sent to the API.
 */
type ContentBlock = RawBlock & { id: string };

/* =====================================================
   DEFAULT DATA CREATORS
===================================================== */

function createDefaultTable(): TableData {
  return {
    hasHeader: true,
    caption: "",
    headers: ["Column 1", "Column 2", "Column 3"],
    rows: [
      ["", "", ""],
      ["", "", ""],
    ],
  };
}

function createDefaultCommand(): CommandData {
  return {
    command: "",
    language: "bash",
    description: "",
    output: "",
  };
}

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
        (block) =>
          block?.type === "text" ||
          block?.type === "image" ||
          block?.type === "table" ||
          block?.type === "command"
      )
      .map((block): RawBlock => {
        if (block.type === "text") {
          return {
            type: "text",
            text: String(block.text ?? ""),
          };
        }

        if (block.type === "table") {
          const rawTable = block.table || {};
          const headers = Array.isArray(rawTable.headers)
            ? rawTable.headers.map(String)
            : ["Column 1", "Column 2", "Column 3"];
          const colCount = Math.max(headers.length, 1);
          const rawRows = Array.isArray(rawTable.rows) ? rawTable.rows : [];
          const rows = rawRows.map((row: unknown) => {
            if (Array.isArray(row)) {
              const padded = row.map(String);
              while (padded.length < colCount) padded.push("");
              return padded.slice(0, colCount);
            }
            return new Array(colCount).fill("");
          });

          return {
            type: "table",
            table: {
              hasHeader: rawTable.hasHeader ?? true,
              caption: rawTable.caption ? String(rawTable.caption) : "",
              headers,
              rows: rows.length > 0 ? rows : [new Array(colCount).fill("")],
            },
          };
        }

        if (block.type === "command") {
          const rawCmd =
            typeof block.command === "object" && block.command !== null
              ? block.command
              : { command: String(block.command ?? "") };
          return {
            type: "command",
            command: {
              command: String(rawCmd.command ?? block.text ?? ""),
              language: String(rawCmd.language ?? "bash"),
              description: String(rawCmd.description ?? ""),
              output: String(rawCmd.output ?? ""),
            },
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

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20";

const labelClass = "mb-2 block text-xs sm:text-sm font-medium text-slate-300";

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:border-cyan-400/50 hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50";

const dangerButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50";

const iconButtonClass =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-slate-800 px-2 text-sm text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-slate-800";

const sectionClass =
  "rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900 p-3.5 sm:p-6";

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
    <div className="mb-4 sm:mb-6 flex flex-wrap items-start justify-between gap-2.5 sm:gap-3">
      <div className="min-w-0 flex-1">
        <h2 className="text-base sm:text-xl font-semibold text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-400">{description}</p>
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

export default function BlogForm({ blog, fields }: Props) {
  const router = useRouter();

  const formBlog: Blog = blog ?? {
    id: "",
    title: "",
    slug: "",
    excerpt: null,
    author: "Rohith Hari",
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

  const idCounter = useRef(0);

  function makeId() {
    idCounter.current += 1;
    return `block-${idCounter.current}`;
  }

  function buildInitialBlocks(): ContentBlock[] {
    const rawBlocks: RawBlock[] = formBlog.content.trim()
      ? parseContent(formBlog.content)
      : [{ type: "text", text: "" }];

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
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    isEditMode && Boolean(formBlog.slug.trim())
  );
  const [excerpt, setExcerpt] = useState(formBlog.excerpt ?? "");
  const [author, setAuthor] = useState(formBlog.author || "Rohith Hari");
  const [blocks, setBlocks] = useState<ContentBlock[]>(buildInitialBlocks);

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

  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(
    isEditMode ? formBlog.status : "PUBLISHED"
  );
  const [access, setAccess] = useState(formBlog.access);
  const [featured, setFeatured] = useState(formBlog.featured);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
     CONTENT BLOCKS - GENERAL
  =================================================== */

  function removeBlock(index: number) {
    setBlocks((current) => current.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, direction: "up" | "down") {
    setBlocks((current) => {
      const next = [...current];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  /* ===================================================
     TEXT BLOCK
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

  function addTextBlock() {
    setBlocks((current) => [
      ...current,
      { id: makeId(), type: "text", text: "" },
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

  /* ===================================================
     IMAGE BLOCK
  =================================================== */

  function updateImageBlock(index: number, image: UploadedImage | null) {
    setBlocks((current) =>
      current.map((block, i) =>
        i === index && block.type === "image" ? { ...block, image } : block
      )
    );
  }

  function addImageBlock() {
    setBlocks((current) => [
      ...current,
      { id: makeId(), type: "image", image: null },
    ]);
  }

  function addImageBlockAfter(index: number) {
    const id = makeId();
    setBlocks((current) => {
      const next = [...current];
      next.splice(index + 1, 0, { id, type: "image", image: null });
      return next;
    });
  }

  /* ===================================================
     TABLE BLOCK
  ===================================================== */

  function addTableBlock() {
    setBlocks((current) => [
      ...current,
      { id: makeId(), type: "table", table: createDefaultTable() },
    ]);
  }

  function addTableBlockAfter(index: number) {
    const id = makeId();
    setBlocks((current) => {
      const next = [...current];
      next.splice(index + 1, 0, {
        id,
        type: "table",
        table: createDefaultTable(),
      });
      return next;
    });
  }

  function updateTableBlock(index: number, updatedTable: TableData) {
    setBlocks((current) =>
      current.map((block, i) =>
        i === index && block.type === "table"
          ? { ...block, table: updatedTable }
          : block
      )
    );
  }

  function updateTableHeader(blockIndex: number, colIndex: number, value: string) {
    const block = blocks[blockIndex];
    if (block?.type !== "table") return;

    const headers = [...block.table.headers];
    headers[colIndex] = value;
    updateTableBlock(blockIndex, { ...block.table, headers });
  }

  function updateTableCell(
    blockIndex: number,
    rowIndex: number,
    colIndex: number,
    value: string
  ) {
    const block = blocks[blockIndex];
    if (block?.type !== "table") return;

    const rows = block.table.rows.map((row, r) => {
      if (r !== rowIndex) return row;
      const nextRow = [...row];
      nextRow[colIndex] = value;
      return nextRow;
    });

    updateTableBlock(blockIndex, { ...block.table, rows });
  }

  function addTableRow(blockIndex: number) {
    const block = blocks[blockIndex];
    if (block?.type !== "table") return;

    const colCount = block.table.headers.length || 1;
    const newRow = new Array(colCount).fill("");
    updateTableBlock(blockIndex, {
      ...block.table,
      rows: [...block.table.rows, newRow],
    });
  }

  function removeTableRow(blockIndex: number, rowIndex: number) {
    const block = blocks[blockIndex];
    if (block?.type !== "table") return;
    if (block.table.rows.length <= 1) return;

    const rows = block.table.rows.filter((_, r) => r !== rowIndex);
    updateTableBlock(blockIndex, { ...block.table, rows });
  }

  function addTableColumn(blockIndex: number) {
    const block = blocks[blockIndex];
    if (block?.type !== "table") return;

    const newColNumber = block.table.headers.length + 1;
    const headers = [...block.table.headers, `Column ${newColNumber}`];
    const rows = block.table.rows.map((row) => [...row, ""]);

    updateTableBlock(blockIndex, { ...block.table, headers, rows });
  }

  function removeTableColumn(blockIndex: number, colIndex: number) {
    const block = blocks[blockIndex];
    if (block?.type !== "table") return;
    if (block.table.headers.length <= 1) return;

    const headers = block.table.headers.filter((_, c) => c !== colIndex);
    const rows = block.table.rows.map((row) =>
      row.filter((_, c) => c !== colIndex)
    );

    updateTableBlock(blockIndex, { ...block.table, headers, rows });
  }

  function toggleTableHeader(blockIndex: number) {
    const block = blocks[blockIndex];
    if (block?.type !== "table") return;

    updateTableBlock(blockIndex, {
      ...block.table,
      hasHeader: !block.table.hasHeader,
    });
  }

  function updateTableCaption(blockIndex: number, caption: string) {
    const block = blocks[blockIndex];
    if (block?.type !== "table") return;

    updateTableBlock(blockIndex, { ...block.table, caption });
  }

  /* ===================================================
     COMMAND BLOCK
  ===================================================== */

  function addCommandBlock() {
    setBlocks((current) => [
      ...current,
      { id: makeId(), type: "command", command: createDefaultCommand() },
    ]);
  }

  function addCommandBlockAfter(index: number) {
    const id = makeId();
    setBlocks((current) => {
      const next = [...current];
      next.splice(index + 1, 0, {
        id,
        type: "command",
        command: createDefaultCommand(),
      });
      return next;
    });
  }

  function updateCommandBlock(index: number, updatedCommand: CommandData) {
    setBlocks((current) =>
      current.map((block, i) =>
        i === index && block.type === "command"
          ? { ...block, command: updatedCommand }
          : block
      )
    );
  }

  function updateCommandField(
    blockIndex: number,
    field: keyof CommandData,
    value: string
  ) {
    const block = blocks[blockIndex];
    if (block?.type !== "command") return;

    updateCommandBlock(blockIndex, {
      ...block.command,
      [field]: value,
    });
  }

  /* ===================================================
     SUBMIT
  =================================================== */

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!title.trim()) {
      setMessage("Title is required.");
      return;
    }

    if (!slug.trim()) {
      setMessage("Slug is required.");
      return;
    }

    if (!author.trim()) {
      setMessage("Author name is required.");
      return;
    }

    if (!excerpt.trim()) {
      setMessage("Excerpt is required.");
      return;
    }

    if (!primaryImage) {
      setMessage("Primary image is required.");
      return;
    }

    if (selectedFields.length === 0) {
      setMessage("Select at least one cybersecurity field.");
      return;
    }

    /* Check if article has content */
    const hasContent = blocks.some((block) => {
      if (block.type === "text") return block.text.trim().length > 0;
      if (block.type === "table") {
        return (
          block.table.headers.some((h) => h.trim().length > 0) ||
          block.table.rows.some((row) =>
            row.some((cell) => cell.trim().length > 0)
          )
        );
      }
      if (block.type === "command") {
        return block.command.command.trim().length > 0;
      }
      return Boolean(block.image?.url?.trim());
    });

    if (!hasContent) {
      setMessage("Article content is required.");
      return;
    }

    /* Filter out completely empty blocks */
    const cleanedBlocks = blocks.filter((block) => {
      if (block.type === "text") {
        return block.text.trim().length > 0;
      }
      if (block.type === "table") {
        return (
          block.table.headers.some((h) => h.trim().length > 0) ||
          block.table.rows.some((row) =>
            row.some((cell) => cell.trim().length > 0)
          )
        );
      }
      if (block.type === "command") {
        return block.command.command.trim().length > 0;
      }
      return Boolean(block.image?.url?.trim());
    });

    /* Serialize content blocks */
    const contentBlocks = cleanedBlocks.map((block) => {
      if (block.type === "text") {
        return {
          type: "text",
          text: block.text.trim(),
        };
      }

      if (block.type === "table") {
        return {
          type: "table",
          table: {
            hasHeader: block.table.hasHeader,
            caption: block.table.caption?.trim() || undefined,
            headers: block.table.headers,
            rows: block.table.rows,
          },
        };
      }

      if (block.type === "command") {
        return {
          type: "command",
          command: {
            command: block.command.command.trim(),
            language: block.command.language?.trim() || "bash",
            description: block.command.description?.trim() || undefined,
            output: block.command.output?.trim() || undefined,
          },
        };
      }

      return {
        type: "image",
        url: block.image!.url,
      };
    });

    /* Collect inline images */
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
      {/* ERROR / STATUS */}
      {message && (
        <div
          ref={messageRef}
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {message}
        </div>
      )}

      <div>
        <div className="min-w-0 space-y-6">
          {/* BLOG INFORMATION */}
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

          {/* PRIMARY IMAGE */}
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

          {/* ARTICLE CONTENT */}
          <section className={sectionClass}>
            <SectionHeader
              title="Article Content"
              description="Create text, tables, commands, and images in any custom order."
            />

            <div className="space-y-5">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  className="rounded-xl border border-slate-700 bg-slate-950 p-3 sm:p-4 shadow-sm w-full max-w-full min-w-0 overflow-hidden"
                >
                  {/* Block Header */}
                  <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                    <span className="flex items-center gap-2 text-xs font-semibold tracking-wide">
                      {block.type === "text" && (
                        <span className="rounded bg-cyan-400/10 px-2 py-0.5 text-cyan-400 border border-cyan-400/20">
                          Text {index + 1}
                        </span>
                      )}
                      {block.type === "image" && (
                        <span className="rounded bg-purple-400/10 px-2 py-0.5 text-purple-400 border border-purple-400/20">
                          Image {index + 1}
                        </span>
                      )}
                      {block.type === "table" && (
                        <span className="rounded bg-sky-400/10 px-2 py-0.5 text-sky-400 border border-sky-400/20 flex items-center gap-1.5">
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <line x1="3" y1="9" x2="21" y2="9" />
                            <line x1="9" y1="3" x2="9" y2="21" />
                          </svg>
                          Table {index + 1} ({block.table.rows.length} × {block.table.headers.length})
                        </span>
                      )}
                      {block.type === "command" && (
                        <span className="rounded bg-emerald-400/10 px-2 py-0.5 text-emerald-400 border border-emerald-400/20 font-mono">
                          &gt;_ Command {index + 1} ({block.command.language || "bash"})
                        </span>
                      )}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Move block ${index + 1} up`}
                        disabled={index === 0}
                        onClick={() => moveBlock(index, "up")}
                        className={iconButtonClass}
                        title="Move Up"
                      >
                        ↑
                      </button>

                      <button
                        type="button"
                        aria-label={`Move block ${index + 1} down`}
                        disabled={index === blocks.length - 1}
                        onClick={() => moveBlock(index, "down")}
                        className={iconButtonClass}
                        title="Move Down"
                      >
                        ↓
                      </button>

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

                  {/* 1. TEXT BLOCK */}
                  {block.type === "text" && (
                    <div className="min-w-0 overflow-x-auto">
                      <RichTextEditor
                        value={block.text}
                        onChange={(value) => updateTextBlock(index, value)}
                        placeholder="Write your article section, insert commands or tables..."
                      />
                    </div>
                  )}

                  {/* 2. IMAGE BLOCK */}
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

                  {/* 3. TABLE BLOCK (CUSTOMIZABLE ROWS & COLUMNS) */}
                  {block.type === "table" && (
                    <div className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/60 p-3 sm:p-4 w-full max-w-full min-w-0 overflow-hidden">
                      {/* Table Settings & Dimensions */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3">
                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                          <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={block.table.hasHeader}
                              onChange={() => toggleTableHeader(index)}
                              className="accent-cyan-400 rounded"
                            />
                            Include Header Row
                          </label>

                          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

                          <input
                            type="text"
                            value={block.table.caption ?? ""}
                            onChange={(e) => updateTableCaption(index, e.target.value)}
                            placeholder="Optional table caption or title..."
                            className="w-full sm:w-64 rounded border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-cyan-400"
                          />
                        </div>

                        {/* Row & Column Action Controls */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => addTableRow(index)}
                            className="inline-flex items-center gap-1 rounded border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-400 hover:bg-cyan-400/20"
                            title="Add a new row to the table"
                          >
                            + Row
                          </button>

                          <button
                            type="button"
                            onClick={() => addTableColumn(index)}
                            className="inline-flex items-center gap-1 rounded border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-400 hover:bg-cyan-400/20"
                            title="Add a new column to the table"
                          >
                            + Column
                          </button>
                        </div>
                      </div>

                      {/* Visual Table Editor */}
                      <div className="w-full max-w-full min-w-0 overflow-x-auto rounded-lg border border-slate-700 bg-slate-950 p-2">
                        <table className="w-full min-w-[360px] sm:min-w-[500px] border-collapse text-left">
                          {/* Column Delete Header Row */}
                          <thead>
                            {block.table.hasHeader && (
                              <tr className="border-b border-slate-700 bg-slate-900/90">
                                <th className="w-10 px-2 py-2 text-center text-[10px] text-slate-500">
                                  #
                                </th>
                                {block.table.headers.map((header, colIndex) => (
                                  <th key={`th-${colIndex}`} className="p-1.5">
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="text"
                                        value={header}
                                        onChange={(e) =>
                                          updateTableHeader(index, colIndex, e.target.value)
                                        }
                                        placeholder={`Header ${colIndex + 1}`}
                                        className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-bold text-cyan-300 placeholder:text-slate-600 outline-none focus:border-cyan-400"
                                      />
                                      {block.table.headers.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => removeTableColumn(index, colIndex)}
                                          title={`Delete column ${colIndex + 1}`}
                                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-slate-500 hover:bg-red-500/20 hover:text-red-400 text-xs"
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </div>
                                  </th>
                                ))}
                                <th className="w-10" />
                              </tr>
                            )}
                          </thead>

                          {/* Table Body Rows */}
                          <tbody>
                            {block.table.rows.map((row, rowIndex) => (
                              <tr
                                key={`tr-${rowIndex}`}
                                className="border-b border-slate-800 hover:bg-slate-900/30"
                              >
                                <td className="px-2 py-2 text-center font-mono text-[11px] text-slate-500">
                                  {rowIndex + 1}
                                </td>

                                {row.map((cell, colIndex) => (
                                  <td key={`td-${rowIndex}-${colIndex}`} className="p-1.5">
                                    <input
                                      type="text"
                                      value={cell}
                                      onChange={(e) =>
                                        updateTableCell(
                                          index,
                                          rowIndex,
                                          colIndex,
                                          e.target.value
                                        )
                                      }
                                      placeholder={`Row ${rowIndex + 1}, Col ${colIndex + 1}`}
                                      className="w-full rounded border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-cyan-400"
                                    />
                                  </td>
                                ))}

                                <td className="px-1 text-center">
                                  {block.table.rows.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeTableRow(index, rowIndex)}
                                      title={`Delete row ${rowIndex + 1}`}
                                      className="flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-red-500/20 hover:text-red-400 text-xs"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                        <span>
                          {block.table.rows.length} rows × {block.table.headers.length} columns
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => addTableRow(index)}
                            className="text-cyan-400 hover:underline"
                          >
                            + Add row
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => addTableColumn(index)}
                            className="text-cyan-400 hover:underline"
                          >
                            + Add column
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 sm:hidden">Tip: Swipe table horizontally to view and edit all cells.</p>
                    </div>
                  )}

                  {/* 4. COMMAND BLOCK */}
                  {block.type === "command" && (
                    <div className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/60 p-3 sm:p-4 w-full max-w-full min-w-0 overflow-hidden">
                      {/* Language and Description header */}
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-400">
                            Shell / Language
                          </label>
                          <select
                            value={block.command.language ?? "bash"}
                            onChange={(e) =>
                              updateCommandField(index, "language", e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-medium text-white outline-none focus:border-emerald-400"
                          >
                            <option value="bash">Bash / Linux</option>
                            <option value="powershell">PowerShell</option>
                            <option value="cmd">Windows CMD</option>
                            <option value="sh">Shell (sh)</option>
                            <option value="python">Python</option>
                            <option value="sql">SQL</option>
                            <option value="terminal">Generic Terminal</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="mb-1 block text-xs font-medium text-slate-400">
                            Command Description (optional)
                          </label>
                          <input
                            type="text"
                            value={block.command.description ?? ""}
                            onChange={(e) =>
                              updateCommandField(index, "description", e.target.value)
                            }
                            placeholder="e.g. Scan target host for open ports and services"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-emerald-400"
                          />
                        </div>
                      </div>

                      {/* Command Code Area */}
                      <div>
                        <div className="flex items-center justify-between pb-1.5">
                          <label className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                            <span className="font-mono">&gt;_</span> Command Script / Syntax
                          </label>
                          <span className="text-[11px] text-slate-500 font-mono">
                            Multi-line supported
                          </span>
                        </div>
                        <textarea
                          value={block.command.command}
                          onChange={(e) =>
                            updateCommandField(index, "command", e.target.value)
                          }
                          rows={4}
                          placeholder="e.g. nmap -sV -sC -p 1-65535 -T4 target.com"
                          className="w-full rounded-lg border border-slate-700 bg-black/90 p-3 font-mono text-sm leading-relaxed text-emerald-400 placeholder:text-slate-600 outline-none focus:border-emerald-400"
                        />
                      </div>

                      {/* Sample Output (Optional) */}
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-400">
                          Sample Output (optional)
                        </label>
                        <textarea
                          value={block.command.output ?? ""}
                          onChange={(e) =>
                            updateCommandField(index, "output", e.target.value)
                          }
                          rows={3}
                          placeholder="Starting Nmap 7.94 ( https://nmap.org )...\nPORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.9p1"
                          className="w-full rounded-lg border border-slate-700 bg-black/60 p-3 font-mono text-xs text-slate-300 placeholder:text-slate-600 outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  )}

                  {/* Add controls below this block */}
                  <div className="mt-5 border-t border-slate-800 pt-4">
                    <span className="mb-2 block text-xs text-slate-500 sm:mb-0 sm:mr-2 sm:inline">
                      Add below:
                    </span>

                    <div className="grid grid-cols-2 sm:inline-flex sm:flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => addTextBlockAfter(index)}
                        className={`${secondaryButtonClass} text-xs py-2`}
                      >
                        + Text
                      </button>

                      <button
                        type="button"
                        onClick={() => addTableBlockAfter(index)}
                        className="inline-flex items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-400 transition hover:bg-sky-500/20"
                      >
                        + Table
                      </button>

                      <button
                        type="button"
                        onClick={() => addCommandBlockAfter(index)}
                        className="inline-flex items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
                      >
                        + Command
                      </button>

                      <button
                        type="button"
                        onClick={() => addImageBlockAfter(index)}
                        className={`${primaryButtonClass} text-xs py-2`}
                      >
                        + Image
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state when there are no blocks */}
            {blocks.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-700 px-4 py-8 sm:py-10 text-center text-sm text-slate-500 sm:px-6">
                No article blocks.
                <br />
                Add text, customizable table, terminal command, or image below.
                <div className="mt-5 grid grid-cols-2 sm:inline-flex sm:flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={addTextBlock}
                    className={`${secondaryButtonClass} text-xs sm:text-sm`}
                  >
                    + Text
                  </button>

                  <button
                    type="button"
                    onClick={addTableBlock}
                    className="inline-flex items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-sky-400 transition hover:bg-sky-500/20"
                  >
                    + Table
                  </button>

                  <button
                    type="button"
                    onClick={addCommandBlock}
                    className="inline-flex items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
                  >
                    + Command
                  </button>

                  <button
                    type="button"
                    onClick={addImageBlock}
                    className={`${primaryButtonClass} text-xs sm:text-sm`}
                  >
                    + Image
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* CYBERSECURITY FIELDS */}
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
                const isThreatsAndAttacks =
                  category.slug === "threats-attacks";

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

                return (
                  <div
                    key={category.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:col-span-2 sm:p-5"
                  >
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

                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      {category.subcategories.map((subcategory) => {
                        const databaseField = fields.find(
                          (field) => field.slug === subcategory.slug
                        );

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

          {/* PUBLISHING */}
          <section className={sectionClass}>
            <SectionHeader title="Publishing" />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="blog-status" className={labelClass}>
                  Status
                </label>

                <select
                  id="blog-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as "PUBLISHED" | "DRAFT" | "ARCHIVED"
                    )
                  }
                  className={inputClass}
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

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

      {/* STICKY ACTIONS */}
      <div className="sticky bottom-2 sm:bottom-3 z-20 flex flex-col-reverse gap-2.5 sm:gap-3 rounded-xl border border-slate-800 bg-slate-950/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-xl shadow-black/40 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <p className="hidden truncate text-sm text-slate-500 sm:block">
          {isEditMode ? "Editing blog" : "New blog"} ·{" "}
          {status === "DRAFT"
            ? "Draft"
            : status === "PUBLISHED"
              ? "Published"
              : "Archived"}
        </p>

        <div className="flex w-full gap-2.5 sm:gap-3 sm:w-auto">
          <button
            type="button"
            onClick={() => router.push("/admin/blogs")}
            className={`${secondaryButtonClass} flex-1 px-4 sm:px-6 py-2.5 sm:py-3 sm:flex-none text-xs sm:text-sm`}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className={`${primaryButtonClass} flex-1 px-4 sm:px-6 py-2.5 sm:py-3 sm:flex-none text-xs sm:text-sm`}
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

export { BlogForm as BlogEditForm };
