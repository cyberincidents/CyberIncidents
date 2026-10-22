"use client";

import { useState } from "react";

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

type ContentBlock =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image";
      url: string;
    }
  | {
      type: "table";
      table: TableData;
    }
  | {
      type: "command";
      command: CommandData;
    };

type ArticleContentProps = {
  content: string;
};

/* =====================================================
   CONTENT BLOCK VALIDATION
===================================================== */

function isContentBlockArray(value: unknown): value is ContentBlock[] {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((block) => {
    if (!block || typeof block !== "object") {
      return false;
    }

    const item = block as Record<string, unknown>;

    if (item.type === "text") {
      return typeof item.text === "string";
    }

    if (item.type === "image") {
      return typeof item.url === "string";
    }

    if (item.type === "table") {
      return item.table && typeof item.table === "object";
    }

    if (item.type === "command") {
      return (
        typeof item.command === "string" ||
        (item.command && typeof item.command === "object")
      );
    }

    return false;
  });
}

/* =====================================================
   HTML SANITIZER
===================================================== */

function sanitizeArticleHtml(html: string) {
  let safe = html;

  /* ---------------------------------------------
     Remove dangerous elements completely
  --------------------------------------------- */
  safe = safe.replace(
    /<\s*(script|iframe|object|embed|form|style|link|meta|base|svg|math)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,
    ""
  );

  safe = safe.replace(
    /<\s*(script|iframe|object|embed|form|style|link|meta|base|svg|math)[^>]*\/?\s*>/gi,
    ""
  );

  /* ---------------------------------------------
     Remove inline event handlers (onclick="", etc.)
  --------------------------------------------- */
  safe = safe.replace(
    /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
    ""
  );

  /* ---------------------------------------------
     Remove javascript: URLs
  --------------------------------------------- */
  safe = safe.replace(
    /\s+(href|src)\s*=\s*(?:"[^"]*javascript:[^"]*"|'[^']*javascript:[^']*')/gi,
    ""
  );

  /* ---------------------------------------------
     Keep only the HTML tags supported by the
     article editor.
  --------------------------------------------- */
  const allowedTags = [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "h1",
    "h2",
    "h3",
    "ul",
    "ol",
    "li",
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "caption",
    "colgroup",
    "col",
    "pre",
    "code",
    "kbd",
    "samp",
    "div",
    "span",
  ];

  safe = safe.replace(
    /<\/?([a-z0-9-]+)(?:\s([^>]*))?>/gi,
    (fullMatch, tag: string, rawAttrs?: string) => {
      const lowerTag = tag.toLowerCase();

      if (!allowedTags.includes(lowerTag)) {
        return "";
      }

      const isClosingTag = /^<\s*\//.test(fullMatch);
      if (isClosingTag) {
        return `</${lowerTag}>`;
      }

      if (lowerTag === "br") {
        return "<br />";
      }

      // Preserve safe attributes like class, data-language, colspan, rowspan
      let safeAttrs = "";
      if (rawAttrs) {
        const classMatch = rawAttrs.match(/\bclass=(?:"([^"]*)"|'([^']*)')/i);
        const dataLangMatch = rawAttrs.match(
          /\bdata-language=(?:"([^"]*)"|'([^']*)')/i
        );
        const colSpanMatch = rawAttrs.match(/\bcolspan=(?:"([^"]*)"|'([^']*)')/i);
        const rowSpanMatch = rawAttrs.match(/\browspan=(?:"([^"]*)"|'([^']*)')/i);

        const safeClasses = classMatch ? classMatch[1] || classMatch[2] : "";
        const dataLang = dataLangMatch
          ? dataLangMatch[1] || dataLangMatch[2]
          : "";
        const colSpan = colSpanMatch ? colSpanMatch[1] || colSpanMatch[2] : "";
        const rowSpan = rowSpanMatch ? rowSpanMatch[1] || rowSpanMatch[2] : "";

        if (safeClasses) safeAttrs += ` class="${safeClasses}"`;
        if (dataLang) safeAttrs += ` data-language="${dataLang}"`;
        if (colSpan) safeAttrs += ` colspan="${colSpan}"`;
        if (rowSpan) safeAttrs += ` rowspan="${rowSpan}"`;
      }

      return `<${lowerTag}${safeAttrs}>`;
    }
  );

  // Remove empty pre blocks or pre blocks with only empty code
  safe = safe.replace(/<pre[^>]*>\s*(?:<code[^>]*>\s*<\/code>)?\s*<\/pre>/gi, "");
  // Remove empty code tags
  safe = safe.replace(/<code[^>]*>\s*<\/code>/gi, "");

  return safe;
}

/* =====================================================
   CHECK WHETHER CONTENT CONTAINS HTML
===================================================== */

function containsArticleHtml(text: string) {
  return /<\s*(p|br|strong|b|em|i|u|h1|h2|h3|ul|ol|li|table|thead|tbody|tr|th|td|pre|code)\b/i.test(
    text
  );
}

/* =====================================================
   LEGACY TEXT RENDERER
===================================================== */

function renderPlainText(text: string) {
  const lines = text.split("\n");

  return lines.map((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return <div key={index} className="h-4" />;
    }

    if (trimmed.startsWith("### ")) {
      return (
        <h3
          key={index}
          className="mb-4 mt-8 text-xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-white break-words [overflow-wrap:anywhere]"
        >
          {trimmed.replace(/^###\s+/, "")}
        </h3>
      );
    }

    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={index}
          className="mb-5 mt-10 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white break-words [overflow-wrap:anywhere]"
        >
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    }

    return (
      <p
        key={index}
        className="mb-5 text-[17px] leading-8 text-gray-700 dark:text-white/80 break-words [overflow-wrap:anywhere]"
      >
        {trimmed}
      </p>
    );
  });
}

/* =====================================================
   INTERACTIVE ARTICLE TABLE COMPONENT
===================================================== */

function ArticleTable({ table }: { table: TableData }) {
  const headers = table.headers || [];
  const rows = table.rows || [];

  const hasContent =
    headers.some((h) => h.trim()) ||
    rows.some((r) => r.some((c) => c.trim()));

  if (!hasContent) {
    return null;
  }

  return (
    <div className="my-8 w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#070a10] dark:shadow-black/20">
      {table.caption && (
        <div className="border-b border-gray-200 bg-gray-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.02]">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 break-words [overflow-wrap:anywhere]">
            {table.caption}
          </p>
        </div>
      )}

      <div className="w-full max-w-full min-w-0 overflow-x-auto">
        <table className="w-full min-w-full border-collapse text-left text-sm">
          {table.hasHeader && headers.length > 0 && (
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100/90 dark:border-white/10 dark:bg-slate-900/90">
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-cyan-400 whitespace-nowrap sm:whitespace-normal break-words [overflow-wrap:anywhere]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="px-4 py-3 text-gray-700 dark:text-slate-300 leading-relaxed whitespace-nowrap sm:whitespace-normal break-words [overflow-wrap:anywhere]"
                  >
                    {cell || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =====================================================
   INTERACTIVE ARTICLE COMMAND / TERMINAL COMPONENT
===================================================== */

function ArticleCommand({
  command,
}: {
  command: CommandData | string;
}) {
  const [copied, setCopied] = useState(false);

  const cmdData: CommandData =
    typeof command === "string"
      ? { command }
      : command;

  const codeText = cmdData.command || "";
  const lang = (cmdData.language || "bash").toUpperCase();

  // Do not render empty command box
  if (!codeText.trim() && !cmdData.description?.trim()) {
    return null;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  return (
    <div className="my-8 w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-[#070a10] shadow-xl">
      {/* Terminal Header */}
      <div className="flex w-full min-w-0 items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-3.5 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          {/* macOS / Terminal dots */}
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>

          <span className="ml-1 shrink-0 font-mono text-[11px] font-semibold tracking-wider text-cyan-400">
            {lang}
          </span>

          {cmdData.description && (
            <span className="hidden sm:inline text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
              — {cmdData.description}
            </span>
          )}
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy command to clipboard"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:border-cyan-400/50 hover:bg-slate-700 hover:text-white"
        >
          {copied ? (
            <>
              <svg
                className="h-3.5 w-3.5 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <svg
                className="h-3.5 w-3.5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Command Line */}
      <div className="w-full max-w-full min-w-0 overflow-x-auto p-3.5 sm:p-5">
        <div className="flex w-full min-w-0 items-start gap-2.5 font-mono text-sm sm:text-[15px] leading-relaxed">
          <span className="select-none text-cyan-400/80 font-bold shrink-0">$</span>
          <pre className="w-full min-w-0 flex-1 overflow-x-auto font-mono text-emerald-300 selection:bg-emerald-500/20 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            <code>{codeText}</code>
          </pre>
        </div>
      </div>

      {/* Sample Output (if present) */}
      {cmdData.output && (
        <div className="w-full max-w-full min-w-0 border-t border-slate-800 bg-black/50 p-3.5 sm:p-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Output:
          </p>
          <pre className="w-full max-w-full min-w-0 overflow-x-auto font-mono text-xs leading-relaxed text-slate-400 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            {cmdData.output}
          </pre>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   HTML TEXT BLOCK RENDERER
===================================================== */

function renderHtmlText(text: string) {
  const safeHtml = sanitizeArticleHtml(text);

  return (
    <div
      className="
        article-rich-content
        w-full
        min-w-0
        max-w-full
        break-words
        [overflow-wrap:anywhere]
        text-[17px]
        leading-8
        text-gray-700
        dark:text-white/80

        [&_p]:mb-5
        [&_p]:leading-8
        [&_p]:break-words
        [&_p]:[overflow-wrap:anywhere]

        [&_h1]:mb-5
        [&_h1]:mt-10
        [&_h1]:text-3xl
        [&_h1]:font-bold
        [&_h1]:leading-tight
        [&_h1]:tracking-tight
        [&_h1]:text-gray-900
        dark:[&_h1]:text-white
        [&_h1]:break-words
        [&_h1]:[overflow-wrap:anywhere]

        [&_h2]:mb-4
        [&_h2]:mt-10
        [&_h2]:text-2xl
        [&_h2]:font-bold
        [&_h2]:leading-tight
        [&_h2]:tracking-tight
        [&_h2]:text-gray-900
        dark:[&_h2]:text-white
        [&_h2]:break-words
        [&_h2]:[overflow-wrap:anywhere]

        [&_h3]:mb-3
        [&_h3]:mt-8
        [&_h3]:text-xl
        [&_h3]:font-semibold
        [&_h3]:leading-tight
        [&_h3]:tracking-tight
        [&_h3]:text-gray-900
        dark:[&_h3]:text-white
        [&_h3]:break-words
        [&_h3]:[overflow-wrap:anywhere]

        [&_strong]:font-bold
        [&_b]:font-bold

        [&_em]:italic
        [&_i]:italic

        [&_u]:underline
        [&_u]:decoration-1
        [&_u]:underline-offset-2

        [&_ul]:mb-6
        [&_ul]:list-disc
        [&_ul]:space-y-2
        [&_ul]:pl-7

        [&_ol]:mb-6
        [&_ol]:list-decimal
        [&_ol]:space-y-2
        [&_ol]:pl-7

        [&_li]:leading-8
        [&_li]:break-words
        [&_li]:[overflow-wrap:anywhere]

        [&_br]:leading-8

        [&_table]:w-full
        [&_table]:my-8
        [&_table]:text-sm
        [&_table]:text-left
        [&_table]:border-collapse
        [&_table]:rounded-xl
        [&_table]:border
        [&_table]:border-gray-200
        dark:[&_table]:border-white/10

        [&_th]:bg-gray-100/90
        dark:[&_th]:bg-slate-900/90
        [&_th]:px-4
        [&_th]:py-3.5
        [&_th]:font-bold
        [&_th]:text-gray-900
        dark:[&_th]:text-cyan-400
        [&_th]:border
        [&_th]:border-gray-200
        dark:[&_th]:border-white/10
        [&_th]:text-xs
        [&_th]:uppercase
        [&_th]:tracking-wider
        [&_th]:break-words
        [&_th]:[overflow-wrap:anywhere]

        [&_td]:px-4
        [&_td]:py-3.5
        [&_td]:text-gray-700
        dark:[&_td]:text-slate-300
        [&_td]:border
        [&_td]:border-gray-200
        dark:[&_td]:border-white/10
        [&_td]:break-words
        [&_td]:[overflow-wrap:anywhere]

        [&_pre]:my-6
        [&_pre]:w-full
        [&_pre]:max-w-full
        [&_pre]:min-w-0
        [&_pre]:overflow-x-auto
        [&_pre]:rounded-xl
        [&_pre]:border
        [&_pre]:border-slate-800
        [&_pre]:bg-[#070a10]
        [&_pre]:p-4
        [&_pre]:font-mono
        [&_pre]:text-sm
        [&_pre]:text-emerald-400
        [&_pre]:shadow-lg
        [&_pre]:whitespace-pre-wrap
        [&_pre]:break-words
        [&_pre]:[overflow-wrap:anywhere]

        [&_:not(pre)>code]:rounded
        [&_:not(pre)>code]:bg-gray-100
        dark:[&_:not(pre)>code]:bg-slate-800/90
        [&_:not(pre)>code]:px-1.5
        [&_:not(pre)>code]:py-0.5
        [&_:not(pre)>code]:font-mono
        [&_:not(pre)>code]:text-[0.875em]
        [&_:not(pre)>code]:text-cyan-600
        dark:[&_:not(pre)>code]:text-cyan-300
        [&_:not(pre)>code]:border
        [&_:not(pre)>code]:border-gray-200
        dark:[&_:not(pre)>code]:border-white/10
        [&_:not(pre)>code]:break-words
        [&_:not(pre)>code]:[overflow-wrap:anywhere]

        [&_pre_code]:bg-transparent
        [&_pre_code]:border-0
        [&_pre_code]:p-0
        [&_pre_code]:rounded-none
        [&_pre_code]:text-inherit
        [&_pre_code]:shadow-none

        [&_.article-inline-code]:font-mono
        [&_.article-inline-code]:text-cyan-600
        dark:[&_.article-inline-code]:text-cyan-300
        [&_.article-inline-code]:bg-gray-100
        dark:[&_.article-inline-code]:bg-slate-800/90
        [&_.article-inline-code]:px-1.5
        [&_.article-inline-code]:py-0.5
        [&_.article-inline-code]:rounded
        [&_.article-inline-code]:text-[0.875em]
        [&_.article-inline-code]:border
        [&_.article-inline-code]:border-gray-200
        dark:[&_.article-inline-code]:border-white/10
        [&_.article-inline-code]:break-words
        [&_.article-inline-code]:[overflow-wrap:anywhere]

        [&_.article-table-container]:my-8
        [&_.article-table-container]:w-full
        [&_.article-table-container]:max-w-full
        [&_.article-table-container]:min-w-0
        [&_.article-table-container]:overflow-x-auto
        [&_.article-table-container]:rounded-xl
        [&_.article-table-container]:border
        [&_.article-table-container]:border-gray-200
        dark:[&_.article-table-container]:border-white/10
      "
      dangerouslySetInnerHTML={{
        __html: safeHtml,
      }}
    />
  );
}

/* =====================================================
   TEXT BLOCK RENDERER
===================================================== */

function renderText(text: string) {
  if (containsArticleHtml(text)) {
    return renderHtmlText(text);
  }

  return renderPlainText(text);
}

/* =====================================================
   ZERO TRACE WATERMARK
===================================================== */

function Watermark() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 flex justify-center"
      aria-hidden="true"
    >
      <div
        className="sticky top-32 h-[280px] w-[280px] bg-contain bg-center bg-no-repeat opacity-[0.035] dark:opacity-[0.08]"
        style={{
          backgroundImage: "url('/branding/zerotrace-watermark.png')",
        }}
      />
    </div>
  );
}

/* =====================================================
   ARTICLE CONTENT (MAIN EXPORT)
===================================================== */

export default function ArticleContent({ content }: ArticleContentProps) {
  let parsedContent: unknown = null;

  try {
    parsedContent = JSON.parse(content);
  } catch {
    parsedContent = null;
  }

  if (isContentBlockArray(parsedContent)) {
    return (
      <div className="relative w-full max-w-full min-w-0 overflow-hidden">
        <Watermark />

        <div className="relative z-10 w-full max-w-full min-w-0">
          {parsedContent.map((block, index) => {
            /* 1. TEXT BLOCK */
            if (block.type === "text") {
              return (
                <div
                  key={`text-${index}`}
                  className="w-full max-w-full min-w-0 overflow-hidden"
                >
                  {renderText(block.text)}
                </div>
              );
            }

            /* 2. IMAGE BLOCK */
            if (block.type === "image") {
              return (
                <figure
                  key={`image-${index}`}
                  className="my-12 flex justify-center w-full max-w-full min-w-0"
                >
                  <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-2 shadow-sm dark:border-white/10 dark:bg-white/[0.025] dark:shadow-black/10 sm:p-3">
                    <img
                      src={block.url}
                      alt="CyberIncidents article image"
                      className="mx-auto max-h-[500px] w-auto max-w-full rounded-lg object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </figure>
              );
            }

            /* 3. TABLE BLOCK */
            if (block.type === "table") {
              return (
                <ArticleTable
                  key={`table-${index}`}
                  table={block.table}
                />
              );
            }

            /* 4. COMMAND BLOCK */
            if (block.type === "command") {
              return (
                <ArticleCommand
                  key={`cmd-${index}`}
                  command={block.command}
                />
              );
            }

            return null;
          })}
        </div>
      </div>
    );
  }

  /* LEGACY PLAIN TEXT CONTENT */
  return (
    <div className="relative w-full max-w-full min-w-0 overflow-hidden">
      <Watermark />
      <div className="relative z-10 w-full max-w-full min-w-0">
        {renderText(content)}
      </div>
    </div>
  );
}
