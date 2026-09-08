import React from "react";

/** Renders a small, safe subset of markdown (#/##/### headers, **bold**, "- " lists) without a parser dependency. */
export const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  const renderInline = (line: string) =>
    line.split(/(\*\*[^*]+\*\*)/g).map((part, idx) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={idx}>{part.slice(2, -2)}</strong>
      ) : (
        <React.Fragment key={idx}>{part}</React.Fragment>
      )
    );

  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length) {
      blocks.push(
        <ul key={key} className="list-disc pl-5 space-y-1">
          {listBuffer.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listBuffer.push(trimmed.slice(2));
      return;
    }
    flushList(`list-${idx}`);

    if (trimmed.startsWith("### ")) {
      blocks.push(
        <h3 key={idx} className="text-sm font-black font-mono uppercase mt-4 mb-1">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      blocks.push(
        <h2 key={idx} className="text-base font-black font-mono uppercase mt-5 mb-1.5">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith("# ")) {
      blocks.push(
        <h1 key={idx} className="text-lg font-black font-mono uppercase mt-5 mb-2">
          {renderInline(trimmed.slice(2))}
        </h1>
      );
    } else if (trimmed.length > 0) {
      blocks.push(
        <p key={idx} className="leading-relaxed">
          {renderInline(trimmed)}
        </p>
      );
    }
  });

  flushList("list-end");

  return <div className="space-y-1.5 text-sm text-zinc-800">{blocks}</div>;
};
