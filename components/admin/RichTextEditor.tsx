"use client";

import { useEffect, useRef, useState } from "react";

type BlockFormat =
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "ul"
  | "ol";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function getCurrentBlockFormat(): BlockFormat {
  if (typeof document === "undefined") {
    return "p";
  }

  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return "p";
  }

  let node: Node | null = selection.anchorNode;

  if (node?.nodeType === Node.TEXT_NODE) {
    node = node.parentElement;
  }

  if (!(node instanceof HTMLElement)) {
    return "p";
  }

  const block = node.closest(
    "h1,h2,h3,p,li"
  );

  if (!block) {
    return "p";
  }

  const tag = block.tagName.toLowerCase();

  if (tag === "h1") return "h1";
  if (tag === "h2") return "h2";
  if (tag === "h3") return "h3";

  if (tag === "li") {
    const parent = block.parentElement;

    if (parent?.tagName.toLowerCase() === "ol") {
      return "ol";
    }

    return "ul";
  }

  return "p";
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your article section...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const savedSelectionRef =
    useRef<Range | null>(null);

  const [blockFormat, setBlockFormat] =
    useState<BlockFormat>("p");

  const [activeFormats, setActiveFormats] =
    useState({
      bold: false,
      italic: false,
      underline: false,
    });

  /*
   * Load existing HTML when editing.
   */
  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) return;

    if (editor.innerHTML !== value) {
      editor.innerHTML = value || "";
    }

    updateToolbarState();
  }, [value]);

  /*
   * Keep the current text selection before a
   * toolbar button/select takes focus.
   */
  function saveSelection() {
    const editor = editorRef.current;

    if (!editor) return;

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);

    if (editor.contains(range.commonAncestorContainer)) {
      savedSelectionRef.current = range.cloneRange();
    }
  }

  function restoreSelection() {
    const saved = savedSelectionRef.current;

    if (!saved) return;

    const selection = window.getSelection();

    if (!selection) return;

    selection.removeAllRanges();
    selection.addRange(saved);
  }

  function focusEditor() {
    const editor = editorRef.current;

    if (!editor) return;

    editor.focus();
    restoreSelection();
  }

  function emitChange() {
    const editor = editorRef.current;

    if (!editor) return;

    onChange(editor.innerHTML);
    updateToolbarState();
    saveSelection();
  }

  function updateToolbarState() {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });

    setBlockFormat(getCurrentBlockFormat());
  }

  function executeInlineCommand(
    command: "bold" | "italic" | "underline"
  ) {
    focusEditor();

    document.execCommand(command, false);

    emitChange();
  }

  function executeBlockCommand(
    format: BlockFormat
  ) {
    focusEditor();

    if (format === "ul") {
      /*
       * A list is a block format. Selecting it
       * replaces the current paragraph with a list.
       */
      document.execCommand(
        "insertUnorderedList",
        false
      );
    } else if (format === "ol") {
      document.execCommand(
        "insertOrderedList",
        false
      );
    } else {
      document.execCommand(
        "formatBlock",
        false,
        format
      );
    }

    emitChange();
  }

  function handleBlockFormatChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const next =
      event.target.value as BlockFormat;

    executeBlockCommand(next);
  }

  function handleSelectionChange() {
    saveSelection();
    updateToolbarState();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
      {/* =====================================================
          TOOLBAR
      ===================================================== */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-900 p-2">
        {/* INLINE FORMATTING */}

        <button
          type="button"
          title="Bold"
          aria-label="Bold"
          onMouseDown={(event) => {
            event.preventDefault();
            saveSelection();
            executeInlineCommand("bold");
          }}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-bold transition ${
            activeFormats.bold
              ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-300"
              : "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/40 hover:text-white"
          }`}
        >
          B
        </button>

        <button
          type="button"
          title="Italic"
          aria-label="Italic"
          onMouseDown={(event) => {
            event.preventDefault();
            saveSelection();
            executeInlineCommand("italic");
          }}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm italic transition ${
            activeFormats.italic
              ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-300"
              : "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/40 hover:text-white"
          }`}
        >
          I
        </button>

        <button
          type="button"
          title="Underline"
          aria-label="Underline"
          onMouseDown={(event) => {
            event.preventDefault();
            saveSelection();
            executeInlineCommand("underline");
          }}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm underline transition ${
            activeFormats.underline
              ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-300"
              : "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/40 hover:text-white"
          }`}
        >
          U
        </button>

        <div className="mx-1 h-6 w-px bg-slate-700" />

        {/* =================================================
            BLOCK FORMAT

            P / H1 / H2 / H3 / UL / OL are mutually
            exclusive block choices.
        ================================================= */}

        <label className="sr-only" htmlFor="article-block-format">
          Text format
        </label>

        <select
          id="article-block-format"
          value={blockFormat}
          onMouseDown={() => saveSelection()}
          onChange={handleBlockFormatChange}
          className="h-9 min-w-[145px] rounded-md border border-slate-700 bg-slate-900 px-3 text-sm font-medium text-slate-200 outline-none transition focus:border-cyan-400"
          title="Choose paragraph, heading or list format"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="ul">Bulleted List</option>
          <option value="ol">Numbered List</option>
        </select>
      </div>

      {/* =====================================================
          EDITOR
      ===================================================== */}
      <div className="relative">
        {!value && (
          <div className="pointer-events-none absolute left-5 top-4 z-10 text-slate-500">
            {placeholder}
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={emitChange}
          onKeyUp={handleSelectionChange}
          onMouseUp={handleSelectionChange}
          onSelect={handleSelectionChange}
          onFocus={handleSelectionChange}
          onBlur={saveSelection}
          className="
            min-h-[280px]
            w-full
            bg-slate-900
            px-5
            py-4
            text-base
            leading-7
            text-slate-200
            outline-none

            [&_p]:mb-4

            [&_h1]:mb-5
            [&_h1]:mt-6
            [&_h1]:text-3xl
            [&_h1]:font-bold
            [&_h1]:leading-tight
            [&_h1]:text-white

            [&_h2]:mb-4
            [&_h2]:mt-6
            [&_h2]:text-2xl
            [&_h2]:font-bold
            [&_h2]:leading-tight
            [&_h2]:text-white

            [&_h3]:mb-3
            [&_h3]:mt-5
            [&_h3]:text-xl
            [&_h3]:font-semibold
            [&_h3]:leading-tight
            [&_h3]:text-white

            [&_ul]:mb-4
            [&_ul]:list-disc
            [&_ul]:pl-6

            [&_ol]:mb-4
            [&_ol]:list-decimal
            [&_ol]:pl-6

            [&_li]:mb-1
          "
        />
      </div>

      <div className="border-t border-slate-800 px-4 py-2 text-[11px] text-slate-500">
        Select text and use B, I or U for inline formatting.
        Use the format menu for one paragraph, heading or list
        type at a time.
      </div>
    </div>
  );
}
