"use client";

import { useEffect, useRef, useState } from "react";

type BlockFormat =
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "ul"
  | "ol"
  | "pre";

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

  const block = node.closest("h1,h2,h3,p,li,pre");

  if (!block) {
    return "p";
  }

  const tag = block.tagName.toLowerCase();

  if (tag === "h1") return "h1";
  if (tag === "h2") return "h2";
  if (tag === "h3") return "h3";
  if (tag === "pre") return "pre";

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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  const [blockFormat, setBlockFormat] = useState<BlockFormat>("p");

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    code: false,
  });

  /* Table insertion popover state */
  const [showTablePopover, setShowTablePopover] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableHasHeader, setTableHasHeader] = useState(true);

  /* Active table detection & floating position */
  const [activeTable, setActiveTable] = useState<HTMLTableElement | null>(null);
  const [activeCell, setActiveCell] = useState<HTMLTableCellElement | null>(null);
  const [tableBarPos, setTableBarPos] = useState<{ top: number; left: number } | null>(null);

  /* Active code block detection & floating hint position */
  const [activePre, setActivePre] = useState<HTMLElement | null>(null);
  const [preHintPos, setPreHintPos] = useState<{ top: number; right: number } | null>(null);

  /* Load existing HTML */
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (editor.innerHTML !== value) {
      editor.innerHTML = value || "";
    }

    updateToolbarState();
  }, [value]);

  function saveSelection() {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

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
    const selection = typeof window !== "undefined" ? window.getSelection() : null;
    let isInsideCode = false;
    let foundTable: HTMLTableElement | null = null;
    let foundCell: HTMLTableCellElement | null = null;
    let foundPre: HTMLElement | null = null;

    if (selection && selection.rangeCount > 0) {
      let node: Node | null = selection.anchorNode;
      if (node?.nodeType === Node.TEXT_NODE) {
        node = node.parentElement;
      }

      if (node instanceof HTMLElement) {
        if (node.closest("code") && !node.closest("pre")) {
          isInsideCode = true;
        }

        const pre = node.closest("pre") as HTMLElement | null;
        if (pre && editorRef.current?.contains(pre)) {
          foundPre = pre;
        }

        const cell = node.closest("td, th") as HTMLTableCellElement | null;
        const table = node.closest("table") as HTMLTableElement | null;

        if (cell && table && editorRef.current?.contains(table)) {
          foundCell = cell;
          foundTable = table;
        }
      }
    }

    setActiveTable(foundTable);
    setActiveCell(foundCell);
    setActivePre(foundPre);

    if (foundTable && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tableRect = foundTable.getBoundingClientRect();
      const topOffset = tableRect.top - containerRect.top;
      const maxLeft = Math.max(8, (containerRect.width || 320) - 260);
      const leftOffset = Math.max(8, Math.min(tableRect.left - containerRect.left, maxLeft));

      // Position floating bar right above the table (or right inside top of table if near top)
      setTableBarPos({
        top: Math.max(45, topOffset - 36),
        left: leftOffset,
      });
    } else {
      setTableBarPos(null);
    }

    if (foundPre && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const preRect = foundPre.getBoundingClientRect();
      const rightOffset = Math.max(8, Math.min(containerRect.right - preRect.right + 12, (containerRect.width || 320) - 140));

      setPreHintPos({
        top: Math.max(45, preRect.top - containerRect.top + 8),
        right: rightOffset,
      });
    } else {
      setPreHintPos(null);
    }

    setActiveFormats({
      bold: typeof document !== "undefined" && document.queryCommandState("bold"),
      italic: typeof document !== "undefined" && document.queryCommandState("italic"),
      underline: typeof document !== "undefined" && document.queryCommandState("underline"),
      code: isInsideCode,
    });

    setBlockFormat(getCurrentBlockFormat());
  }

  function executeInlineCommand(command: "bold" | "italic" | "underline") {
    focusEditor();
    document.execCommand(command, false);
    emitChange();
  }

  function executeBlockCommand(format: BlockFormat) {
    focusEditor();

    if (format === "ul") {
      document.execCommand("insertUnorderedList", false);
    } else if (format === "ol") {
      document.execCommand("insertOrderedList", false);
    } else if (format === "pre") {
      insertCodeBlock();
      return;
    } else {
      document.execCommand("formatBlock", false, format);
    }

    emitChange();
  }

  function handleBlockFormatChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as BlockFormat;
    executeBlockCommand(next);
  }

  function handleSelectionChange() {
    saveSelection();
    updateToolbarState();
  }

  /* =====================================================
     HELPER: FIND CURRENT BLOCK IN EDITOR
  ===================================================== */
  function getSurroundingBlock(): HTMLElement | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    let node: Node | null = selection.getRangeAt(0).startContainer;
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }

    let blockParent: HTMLElement | null = null;
    let curr: HTMLElement | null = node as HTMLElement;

    while (curr && curr !== editorRef.current) {
      if (curr.parentElement === editorRef.current) {
        blockParent = curr;
        break;
      }
      curr = curr.parentElement;
    }

    return blockParent;
  }

  /* =====================================================
     INSERT CODE / COMMAND BLOCK (Directly at Cursor)
  ===================================================== */
  function insertCodeBlock() {
    focusEditor();
    const selection = window.getSelection();
    if (!selection) return;

    const blockParent = getSurroundingBlock();

    const pre = document.createElement("pre");
    pre.className = "article-command w-full max-w-full min-w-0 overflow-x-auto whitespace-pre-wrap break-words";
    pre.setAttribute("data-language", "bash");

    const code = document.createElement("code");
    code.textContent = "";
    pre.appendChild(code);

    const paragraphAfter = document.createElement("p");
    paragraphAfter.appendChild(document.createElement("br"));

    if (blockParent && editorRef.current?.contains(blockParent)) {
      const isBlockEmpty =
        blockParent.tagName.toLowerCase() === "p" &&
        (!blockParent.textContent || !blockParent.textContent.trim());

      if (isBlockEmpty) {
        editorRef.current.insertBefore(pre, blockParent);
        editorRef.current.insertBefore(paragraphAfter, blockParent);
        blockParent.remove();
      } else {
        if (blockParent.nextSibling) {
          editorRef.current.insertBefore(pre, blockParent.nextSibling);
          editorRef.current.insertBefore(paragraphAfter, pre.nextSibling);
        } else {
          editorRef.current.appendChild(pre);
          editorRef.current.appendChild(paragraphAfter);
        }
      }
    } else if (editorRef.current) {
      editorRef.current.appendChild(pre);
      editorRef.current.appendChild(paragraphAfter);
    }

    // Place caret directly inside the code element
    const newRange = document.createRange();
    newRange.selectNodeContents(code);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);

    emitChange();
  }

  /* =====================================================
     INLINE CODE FORMATTING (Directly at Selection/Cursor)
  ===================================================== */
  function toggleInlineCode() {
    focusEditor();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    let element: HTMLElement | null =
      selection.anchorNode instanceof HTMLElement
        ? selection.anchorNode
        : (selection.anchorNode?.parentElement as HTMLElement | null);

    const existingCode = element?.closest("code");

    if (existingCode && !existingCode.closest("pre") && editorRef.current?.contains(existingCode)) {
      // Unwrap code element
      const parent = existingCode.parentNode;
      while (existingCode.firstChild) {
        parent?.insertBefore(existingCode.firstChild, existingCode);
      }
      parent?.removeChild(existingCode);
      emitChange();
      return;
    }

    if (selectedText) {
      const codeEl = document.createElement("code");
      codeEl.textContent = selectedText;
      codeEl.className = "article-inline-code";
      range.deleteContents();
      range.insertNode(codeEl);

      range.setStartAfter(codeEl);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // Insert inline code snippet at cursor
      const codeEl = document.createElement("code");
      codeEl.textContent = "code";
      codeEl.className = "article-inline-code";
      range.deleteContents();
      range.insertNode(codeEl);

      const newRange = document.createRange();
      newRange.selectNodeContents(codeEl);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    emitChange();
  }

  /* =====================================================
     INSERT TABLE (Directly at Cursor)
  ===================================================== */
  function handleInsertTable() {
    const rowsCount = Math.max(1, Math.min(tableRows, 20));
    const colsCount = Math.max(1, Math.min(tableCols, 10));

    focusEditor();
    const selection = window.getSelection();
    if (!selection) return;

    const blockParent = getSurroundingBlock();

    const tableWrapper = document.createElement("div");
    tableWrapper.className = "article-table-container my-4 w-full max-w-full min-w-0 overflow-x-auto";

    const table = document.createElement("table");
    table.className = "article-table w-full min-w-full border-collapse border border-slate-700 text-sm";

    let firstCell: HTMLElement | null = null;

    if (tableHasHeader) {
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");
      for (let c = 0; c < colsCount; c++) {
        const th = document.createElement("th");
        th.className = "border border-slate-700 bg-slate-800 px-3 py-2 text-left font-semibold text-cyan-300";
        th.textContent = `Header ${c + 1}`;
        if (c === 0) firstCell = th;
        tr.appendChild(th);
      }
      thead.appendChild(tr);
      table.appendChild(thead);
    }

    const tbody = document.createElement("tbody");
    for (let r = 0; r < rowsCount; r++) {
      const tr = document.createElement("tr");
      for (let c = 0; c < colsCount; c++) {
        const td = document.createElement("td");
        td.className = "border border-slate-700 px-3 py-2 text-slate-200";
        td.textContent = `Cell ${r + 1}-${c + 1}`;
        if (!firstCell && r === 0 && c === 0) firstCell = td;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    tableWrapper.appendChild(table);

    const paragraphAfter = document.createElement("p");
    paragraphAfter.appendChild(document.createElement("br"));

    if (blockParent && editorRef.current?.contains(blockParent)) {
      const isBlockEmpty =
        blockParent.tagName.toLowerCase() === "p" &&
        (!blockParent.textContent || !blockParent.textContent.trim());

      if (isBlockEmpty) {
        editorRef.current.insertBefore(tableWrapper, blockParent);
        editorRef.current.insertBefore(paragraphAfter, blockParent);
        blockParent.remove();
      } else {
        if (blockParent.nextSibling) {
          editorRef.current.insertBefore(tableWrapper, blockParent.nextSibling);
          editorRef.current.insertBefore(paragraphAfter, tableWrapper.nextSibling);
        } else {
          editorRef.current.appendChild(tableWrapper);
          editorRef.current.appendChild(paragraphAfter);
        }
      }
    } else if (editorRef.current) {
      editorRef.current.appendChild(tableWrapper);
      editorRef.current.appendChild(paragraphAfter);
    }

    if (firstCell) {
      const newRange = document.createRange();
      newRange.selectNodeContents(firstCell);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    emitChange();
    setShowTablePopover(false);
  }

  /* =====================================================
     ACTIVE TABLE MANIPULATION (Directly on Current Table)
  ===================================================== */
  function addRow(position: "above" | "below") {
    if (!activeTable || !activeCell) return;
    const currentRow = activeCell.closest("tr");
    if (!currentRow) return;

    const colCount = activeTable.rows[0]?.cells.length || 1;
    const newRow = document.createElement("tr");

    for (let i = 0; i < colCount; i++) {
      const td = document.createElement("td");
      td.className = "border border-slate-700 px-3 py-2 text-slate-200";
      td.textContent = "";
      newRow.appendChild(td);
    }

    const parent = currentRow.parentElement;
    if (position === "above") {
      parent?.insertBefore(newRow, currentRow);
    } else {
      parent?.insertBefore(newRow, currentRow.nextSibling);
    }

    emitChange();
  }

  function deleteCurrentRow() {
    if (!activeTable || !activeCell) return;
    const currentRow = activeCell.closest("tr");
    if (!currentRow) return;

    const rowCount = activeTable.querySelectorAll("tr").length;
    if (rowCount <= 1) {
      deleteCurrentTable();
      return;
    }

    currentRow.remove();
    emitChange();
  }

  function addColumn(position: "left" | "right") {
    if (!activeTable || !activeCell) return;
    const cellIndex = activeCell.cellIndex;
    const rows = Array.from(activeTable.querySelectorAll("tr"));

    rows.forEach((row) => {
      const isHeader =
        row.parentElement?.tagName.toLowerCase() === "thead" ||
        row.cells[0]?.tagName.toLowerCase() === "th";
      const newCell = document.createElement(isHeader ? "th" : "td");

      if (isHeader) {
        newCell.className =
          "border border-slate-700 bg-slate-800 px-3 py-2 text-left font-semibold text-cyan-300";
        newCell.textContent = "New Header";
      } else {
        newCell.className = "border border-slate-700 px-3 py-2 text-slate-200";
        newCell.textContent = "";
      }

      const targetCell = row.cells[cellIndex];
      if (position === "left") {
        row.insertBefore(newCell, targetCell);
      } else {
        row.insertBefore(newCell, targetCell?.nextSibling || null);
      }
    });

    emitChange();
  }

  function deleteCurrentColumn() {
    if (!activeTable || !activeCell) return;
    const cellIndex = activeCell.cellIndex;
    const rows = Array.from(activeTable.querySelectorAll("tr"));

    const colCount = rows[0]?.cells.length || 0;
    if (colCount <= 1) {
      deleteCurrentTable();
      return;
    }

    rows.forEach((row) => {
      if (row.cells[cellIndex]) {
        row.cells[cellIndex].remove();
      }
    });

    emitChange();
  }

  function deleteCurrentTable() {
    if (!activeTable) return;
    const container = activeTable.closest(".article-table-container") || activeTable;
    container.remove();
    setActiveTable(null);
    setActiveCell(null);
    setTableBarPos(null);
    emitChange();
  }

  /* =====================================================
     EXIT CODE BLOCK (Directly to Next Paragraph)
     Works seamlessly on mobile tap & desktop Shift+Enter
  ===================================================== */
  function exitCodeBlock(targetPre?: HTMLElement | null) {
    const pre = targetPre || activePre;
    if (!pre || !editorRef.current?.contains(pre)) return;

    let nextBlock = pre.nextElementSibling as HTMLElement | null;

    if (!nextBlock || nextBlock.tagName.toLowerCase() !== "p") {
      const p = document.createElement("p");
      p.appendChild(document.createElement("br"));

      if (pre.nextSibling) {
        editorRef.current.insertBefore(p, pre.nextSibling);
      } else {
        editorRef.current.appendChild(p);
      }
      nextBlock = p;
    }

    if (editorRef.current) {
      editorRef.current.focus();
    }

    const selection = window.getSelection();
    if (selection && nextBlock) {
      const newRange = document.createRange();
      newRange.setStart(nextBlock, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    nextBlock.scrollIntoView({ behavior: "smooth", block: "nearest" });
    emitChange();
  }

  /* Keydown inside editor */
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    // 1. Tab navigation inside table cells
    if (e.key === "Tab") {
      const selection = window.getSelection();
      const node = selection?.anchorNode;
      const cell = (node instanceof HTMLElement ? node : node?.parentElement)?.closest(
        "td, th"
      ) as HTMLTableCellElement | null;

      if (cell && activeTable) {
        e.preventDefault();
        const allCells = Array.from(
          activeTable.querySelectorAll("td, th")
        ) as HTMLTableCellElement[];
        const currentIndex = allCells.indexOf(cell);

        if (e.shiftKey) {
          if (currentIndex > 0) {
            allCells[currentIndex - 1].focus();
          }
        } else {
          if (currentIndex < allCells.length - 1) {
            allCells[currentIndex + 1].focus();
          } else {
            addRow("below");
            setTimeout(() => {
              const updatedCells = Array.from(
                activeTable.querySelectorAll("td, th")
              ) as HTMLTableCellElement[];
              if (updatedCells[currentIndex + 1]) {
                updatedCells[currentIndex + 1].focus();
              }
            }, 50);
          }
        }
        return;
      }
    }

    // 2. Code Block key behaviors: Enter creates newline, Backspace deletes empty block
    const selection = window.getSelection();
    const node = selection?.anchorNode;
    const preBlock = (node instanceof HTMLElement ? node : node?.parentElement)?.closest(
      "pre"
    ) as HTMLElement | null;

    if (preBlock && editorRef.current?.contains(preBlock)) {
      // 1. Shift + Enter: Exit code box to next line in text area
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        exitCodeBlock(preBlock);
        return;
      }

      // 2. Regular Enter: newline inside code block
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        document.execCommand("insertLineBreak");
        emitChange();
        return;
      }

      // 3. Backspace: delete empty code block and convert to p
      if (e.key === "Backspace") {
        const text = preBlock.textContent || "";
        if (!text.trim()) {
          e.preventDefault();
          const p = document.createElement("p");
          p.appendChild(document.createElement("br"));
          preBlock.replaceWith(p);

          const newRange = document.createRange();
          newRange.setStart(p, 0);
          newRange.collapse(true);
          selection?.removeAllRanges();
          selection?.addRange(newRange);
          emitChange();
          return;
        }
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-visible rounded-lg border border-slate-700 bg-slate-950"
    >
      {/* =====================================================
          TOOLBAR
      ===================================================== */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-b border-slate-800 bg-slate-900 p-1.5 sm:p-2">
        {/* INLINE FORMATTING */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Bold (Ctrl+B)"
            aria-label="Bold"
            onMouseDown={(event) => {
              event.preventDefault();
              saveSelection();
              executeInlineCommand("bold");
            }}
            className={`inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md border text-xs sm:text-sm font-bold transition ${
              activeFormats.bold
                ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-300"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/40 hover:text-white"
            }`}
          >
            B
          </button>

          <button
            type="button"
            title="Italic (Ctrl+I)"
            aria-label="Italic"
            onMouseDown={(event) => {
              event.preventDefault();
              saveSelection();
              executeInlineCommand("italic");
            }}
            className={`inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md border text-xs sm:text-sm italic transition ${
              activeFormats.italic
                ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-300"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/40 hover:text-white"
            }`}
          >
            I
          </button>

          <button
            type="button"
            title="Underline (Ctrl+U)"
            aria-label="Underline"
            onMouseDown={(event) => {
              event.preventDefault();
              saveSelection();
              executeInlineCommand("underline");
            }}
            className={`inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md border text-xs sm:text-sm underline transition ${
              activeFormats.underline
                ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-300"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/40 hover:text-white"
            }`}
          >
            U
          </button>

          <button
            type="button"
            title="Inline Code (in text)"
            aria-label="Inline Code"
            onMouseDown={(event) => {
              event.preventDefault();
              saveSelection();
              toggleInlineCode();
            }}
            className={`inline-flex h-8 sm:h-9 items-center gap-1 rounded-md border px-2 sm:px-2.5 text-xs font-mono font-semibold transition ${
              activeFormats.code
                ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-300"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/40 hover:text-white"
            }`}
          >
            <span className="text-cyan-400">&lt;/&gt;</span>
            <span className="hidden xs:inline">Inline</span>
          </button>
        </div>

        <div className="hidden sm:block mx-1 h-6 w-px bg-slate-700" />

        {/* BLOCK FORMAT DROPDOWN */}
        <label className="sr-only" htmlFor="article-block-format">
          Text format
        </label>

        <select
          id="article-block-format"
          value={blockFormat}
          onMouseDown={() => saveSelection()}
          onChange={handleBlockFormatChange}
          className="h-8 sm:h-9 min-w-[120px] sm:min-w-[140px] rounded-md border border-slate-700 bg-slate-900 px-2.5 sm:px-3 text-xs font-medium text-slate-200 outline-none transition focus:border-cyan-400"
          title="Choose block format"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="pre">&gt;_ Code / Command</option>
          <option value="ul">Bulleted List</option>
          <option value="ol">Numbered List</option>
        </select>

        <div className="hidden sm:block mx-1 h-6 w-px bg-slate-700" />

        {/* INSERT CODE BLOCK & TABLE AT CURSOR */}
        <div className="relative flex flex-wrap items-center gap-1.5">
          {/* Insert Code Block Button */}
          <button
            type="button"
            title="Add Code / Command Block directly under text"
            onMouseDown={(event) => {
              event.preventDefault();
              saveSelection();
              insertCodeBlock();
            }}
            className="inline-flex h-8 sm:h-9 items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 sm:px-3 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20 hover:text-emerald-300"
          >
            <span className="font-mono text-emerald-400">&gt;_</span> Code Block
          </button>

          {/* Quick Exit Code Button (appears whenever cursor is inside a code block) */}
          {activePre && (
            <button
              type="button"
              title="Exit from Code Block to normal text line"
              onMouseDown={(event) => {
                event.preventDefault();
                exitCodeBlock(activePre);
              }}
              onTouchEnd={(event) => {
                event.preventDefault();
                exitCodeBlock(activePre);
              }}
              className="inline-flex h-8 sm:h-9 items-center gap-1.5 rounded-md border border-emerald-400 bg-emerald-500/25 px-2.5 sm:px-3 text-xs font-bold text-emerald-300 shadow-sm transition hover:bg-emerald-500/35 active:scale-95 animate-pulse cursor-pointer"
            >
              <span className="font-mono text-sm leading-none">↵</span> Exit Code
            </button>
          )}

          {/* Insert Table Button */}
          <div className="relative">
            <button
              type="button"
              title="Insert Table at cursor position"
              onMouseDown={(event) => {
                event.preventDefault();
                saveSelection();
                setShowTablePopover((prev) => !prev);
              }}
              className="inline-flex h-8 sm:h-9 items-center gap-1.5 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 sm:px-3 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-500/20 hover:text-cyan-300"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
              Table
            </button>

            {/* Table Dimension Popover */}
            {showTablePopover && (
              <div className="absolute left-0 top-full z-40 mt-1 w-64 max-w-[calc(100vw-2.5rem)] rounded-xl border border-cyan-500/40 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-cyan-400">
                    Insert Table
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTablePopover(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Columns</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={tableCols}
                      onChange={(e) =>
                        setTableCols(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))
                      }
                      className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Rows</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={tableRows}
                      onChange={(e) =>
                        setTableRows(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))
                      }
                      className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <label className="mt-2.5 flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={tableHasHeader}
                    onChange={(e) => setTableHasHeader(e.target.checked)}
                    className="accent-cyan-400 rounded"
                  />
                  Header row
                </label>

                <div className="mt-3 flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowTablePopover(false)}
                    className="rounded px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleInsertTable();
                    }}
                    className="rounded bg-cyan-400 px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-cyan-300"
                  >
                    Insert
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          FLOATING TABLE CONTROLS BAR (Directly on Current Table)
      ===================================================== */}
      {activeTable && tableBarPos && (
        <div
          style={{
            position: "absolute",
            top: `${tableBarPos.top}px`,
            left: `${tableBarPos.left}px`,
            zIndex: 30,
          }}
          className="flex max-w-[calc(100%-16px)] overflow-x-auto items-center gap-1 rounded-lg border border-cyan-500/50 bg-slate-900/95 px-2 py-1 text-xs shadow-2xl backdrop-blur-md"
        >
          <span className="font-semibold text-cyan-400 mr-1 text-[11px] shrink-0 flex items-center gap-1">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
            Table:
          </span>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              addRow("above");
            }}
            className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200 hover:border-cyan-400 hover:text-white shrink-0"
            title="Add row above current row"
          >
            + Row Above
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              addRow("below");
            }}
            className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200 hover:border-cyan-400 hover:text-white shrink-0"
            title="Add row below current row"
          >
            + Row Below
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              deleteCurrentRow();
            }}
            className="rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] text-red-300 hover:bg-red-500/20 shrink-0"
            title="Delete current row"
          >
            - Row
          </button>

          <div className="mx-0.5 h-3.5 w-px bg-slate-700 shrink-0" />

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              addColumn("left");
            }}
            className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200 hover:border-cyan-400 hover:text-white shrink-0"
            title="Add column to the left"
          >
            + Col Left
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              addColumn("right");
            }}
            className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200 hover:border-cyan-400 hover:text-white shrink-0"
            title="Add column to the right"
          >
            + Col Right
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              deleteCurrentColumn();
            }}
            className="rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] text-red-300 hover:bg-red-500/20 shrink-0"
            title="Delete current column"
          >
            - Col
          </button>

          <div className="mx-0.5 h-3.5 w-px bg-slate-700 shrink-0" />

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              deleteCurrentTable();
            }}
            className="rounded border border-red-500/50 bg-red-500/20 px-2 py-0.5 text-[11px] font-semibold text-red-400 hover:bg-red-500/30 shrink-0"
            title="Delete entire table"
          >
            Delete Table
          </button>
        </div>
      )}

      {/* FLOATING ACTION BUTTON ON ACTIVE CODE BLOCK (Interactive on Mobile & Desktop) */}
      {activePre && preHintPos && (
        <div
          style={{
            position: "absolute",
            top: `${preHintPos.top}px`,
            right: `${preHintPos.right}px`,
            zIndex: 25,
          }}
          className="max-w-[calc(100%-1rem)]"
        >
          <button
            type="button"
            title="Exit Code Block to next line (or press Shift+Enter)"
            onMouseDown={(e) => {
              e.preventDefault();
              exitCodeBlock(activePre);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              exitCodeBlock(activePre);
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/50 bg-slate-950/95 px-2.5 py-1 font-mono text-[11px] text-emerald-300 shadow-xl backdrop-blur-md transition hover:border-emerald-400 hover:bg-emerald-950 hover:text-emerald-200 active:scale-95 cursor-pointer select-none"
          >
            <span className="font-bold text-emerald-400">↵ Exit Code</span>
            <span className="hidden sm:inline text-slate-400 font-sans">
              (or <kbd className="rounded border border-emerald-500/40 bg-slate-800 px-1 py-0.5 text-[10px] font-bold text-emerald-300">Shift+Enter</kbd>)
            </span>
          </button>
        </div>
      )}

      {/* =====================================================
          EDITOR
      ===================================================== */}
      <div className="relative">
        {!value && (
          <div className="pointer-events-none absolute left-3 sm:left-5 top-3 sm:top-4 z-10 text-xs sm:text-base text-slate-500">
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
          onKeyDown={handleKeyDown}
          className="
            min-h-[220px]
            sm:min-h-[280px]
            w-full
            bg-slate-900
            px-3
            py-3
            sm:px-5
            sm:py-4
            text-sm
            sm:text-base
            leading-relaxed
            sm:leading-7
            text-slate-200
            outline-none
            break-words
            [overflow-wrap:anywhere]

            [&_p]:mb-4

            [&_h1]:mb-4
            [&_h1]:mt-5
            [&_h1]:text-2xl
            [&_h1]:sm:text-3xl
            [&_h1]:font-bold
            [&_h1]:leading-tight
            [&_h1]:text-white

            [&_h2]:mb-3
            [&_h2]:mt-5
            [&_h2]:text-xl
            [&_h2]:sm:text-2xl
            [&_h2]:font-bold
            [&_h2]:leading-tight
            [&_h2]:text-white

            [&_h3]:mb-2.5
            [&_h3]:mt-4
            [&_h3]:text-lg
            [&_h3]:sm:text-xl
            [&_h3]:font-semibold
            [&_h3]:leading-tight
            [&_h3]:text-white

            [&_ul]:mb-4
            [&_ul]:list-disc
            [&_ul]:pl-5
            [&_ul]:sm:pl-6

            [&_ol]:mb-4
            [&_ol]:list-decimal
            [&_ol]:pl-5
            [&_ol]:sm:pl-6

            [&_li]:mb-1

            [&_table]:my-4
            [&_table]:w-full
            [&_table]:border-collapse
            [&_table]:rounded-lg
            [&_table]:border
            [&_table]:border-slate-700

            [&_th]:border
            [&_th]:border-slate-700
            [&_th]:bg-slate-800
            [&_th]:px-2.5
            [&_th]:sm:px-3
            [&_th]:py-2
            [&_th]:text-left
            [&_th]:font-semibold
            [&_th]:text-cyan-300

            [&_td]:border
            [&_td]:border-slate-700
            [&_td]:px-2.5
            [&_td]:sm:px-3
            [&_td]:py-2
            [&_td]:text-slate-200

            [&_pre]:my-4
            [&_pre]:w-full
            [&_pre]:max-w-full
            [&_pre]:min-w-0
            [&_pre]:overflow-x-auto
            [&_pre]:rounded-lg
            [&_pre]:border
            [&_pre]:border-slate-800
            [&_pre]:bg-[#070a10]
            [&_pre]:p-3
            [&_pre]:sm:p-4
            [&_pre]:font-mono
            [&_pre]:text-xs
            [&_pre]:sm:text-sm
            [&_pre]:text-emerald-400

            [&_pre_code]:bg-transparent
            [&_pre_code]:border-0
            [&_pre_code]:p-0
            [&_pre_code]:rounded-none
            [&_pre_code]:text-inherit

            [&_:not(pre)>code]:rounded
            [&_:not(pre)>code]:bg-slate-800
            [&_:not(pre)>code]:px-1.5
            [&_:not(pre)>code]:py-0.5
            [&_:not(pre)>code]:font-mono
            [&_:not(pre)>code]:text-xs
            [&_:not(pre)>code]:text-cyan-300
            [&_:not(pre)>code]:border
            [&_:not(pre)>code]:border-slate-700
          "
        />
      </div>

      <div className="border-t border-slate-800 px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        {activePre ? (
          <div className="flex w-full flex-wrap items-center justify-between gap-2 text-emerald-400 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-emerald-400">&gt;_ Inside Code Block</span>
              <span className="hidden sm:inline text-slate-400">• Press Shift + Enter</span>
            </div>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exitCodeBlock(activePre);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                exitCodeBlock(activePre);
              }}
              className="inline-flex items-center gap-1 rounded bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 active:scale-95 transition cursor-pointer"
            >
              ↵ Exit to Text Line
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            <span>
              Click <strong>&gt;_ Code Block</strong> to add code under text.
            </span>
            <span className="hidden sm:inline">
              Press
              <kbd className="mx-1 rounded border border-slate-700 bg-slate-900 px-1 py-0.5 font-mono text-[10px] text-slate-300">
                Shift + Enter
              </kbd>
              inside code to exit.
            </span>
          </div>
        )}

        <span className="hidden sm:inline text-slate-500">
          Tip: Press Tab to move between table cells or add rows.
        </span>
      </div>
    </div>
  );
}
