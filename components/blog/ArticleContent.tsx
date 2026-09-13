"use client";

type ContentBlock =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image";
      url: string;
    };

type ArticleContentProps = {
  content: string;
};

function isContentBlockArray(
  value: unknown
): value is ContentBlock[] {
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

    return false;
  });
}

function renderText(text: string) {
  const lines = text.split("\n");

  return lines.map((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return <div key={index} className="h-4" />;
    }

    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={index}
          className="mt-10 mb-4 text-2xl font-bold tracking-tight text-gray-900"
        >
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    }

    if (trimmed.startsWith("### ")) {
      return (
        <h3
          key={index}
          className="mt-8 mb-3 text-xl font-semibold text-gray-900"
        >
          {trimmed.replace(/^###\s+/, "")}
        </h3>
      );
    }

    return (
      <p
        key={index}
        className="mb-5 text-[17px] leading-8 text-gray-700"
      >
        {trimmed}
      </p>
    );
  });
}

export default function ArticleContent({
  content,
}: ArticleContentProps) {
  let parsedContent: unknown = null;

  try {
    parsedContent = JSON.parse(content);
  } catch {
    parsedContent = null;
  }

  // --------------------------------------------------
  // New structured article
  // --------------------------------------------------

  if (isContentBlockArray(parsedContent)) {
    return (
      <div className="relative">
        {/* ZeroTrace watermark */}

        <div
          className="pointer-events-none absolute inset-0 z-0 flex justify-center"
          aria-hidden="true"
        >
          <img
            src="/branding/zerotrace-watermark.png"
            alt=""
            className="sticky top-32 h-fit w-[280px] opacity-[0.035]"
          />
        </div>

        {/* Article content */}

        <div className="relative z-10">
          {parsedContent.map((block, index) => {
            if (block.type === "text") {
              return (
                <div key={index}>
                  {renderText(block.text)}
                </div>
              );
            }

            return (
              <figure
                key={index}
                className="my-10 overflow-hidden rounded-xl"
              >
                <img
                  src={block.url}
                  alt=""
                  className="mx-auto h-auto max-h-[700px] w-full object-contain"
                  loading="lazy"
                />
              </figure>
            );
          })}
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Legacy article content
  // --------------------------------------------------

  return (
    <div className="relative">
      {/* ZeroTrace watermark */}

      <div
        className="pointer-events-none absolute inset-0 z-0 flex justify-center"
        aria-hidden="true"
      >
        <img
          src="/branding/zerotrace-watermark.png"
          alt=""
          className="sticky top-32 h-fit w-[280px] opacity-[0.035]"
        />
      </div>

      <div className="relative z-10">
        {renderText(content)}
      </div>
    </div>
  );
}