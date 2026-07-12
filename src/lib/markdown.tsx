import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Tiny markdown renderer for the blog's controlled subset: ##/### headings,
 * paragraphs, -/1. lists, ``` code fences, > quotes, and inline **bold**,
 * `code`, [link](href). No raw HTML passthrough — content is first-party only.
 */

function renderInline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  // Tokenize links first, then bold, then inline code.
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyBase}-${i++}`;
    if (m[1] !== undefined) {
      const href = m[2];
      out.push(
        href.startsWith("/") ? (
          <Link key={key} href={href} className="font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent">
            {m[1]}
          </Link>
        ) : (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent">
            {m[1]}
          </a>
        ),
      );
    } else if (m[3] !== undefined) {
      out.push(<strong key={key} className="font-semibold text-ink">{m[3]}</strong>);
    } else if (m[4] !== undefined) {
      out.push(
        <code key={key} className="rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[0.85em]">
          {m[4]}
        </code>,
      );
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    // Code fence
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++; // closing fence
      blocks.push(
        <div key={key++} className="my-7 overflow-x-auto rounded-xl border border-line bg-ink p-5">
          <pre className="font-mono text-[13px] leading-relaxed text-bg">
            <code data-lang={lang}>{code.join("\n")}</code>
          </pre>
        </div>,
      );
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={key++} className="font-display mt-10 mb-3 text-xl font-bold leading-snug">
          {renderInline(line.slice(4), `h3-${key}`)}
        </h3>,
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={key++} className="font-display mt-14 mb-4 text-2xl font-bold leading-snug sm:text-3xl">
          {renderInline(line.slice(3), `h2-${key}`)}
        </h2>,
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quote.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <blockquote key={key++} className="my-7 border-l-[3px] border-accent pl-5 italic text-ink-soft">
          {renderInline(quote.join(" "), `q-${key}`)}
        </blockquote>,
      );
      continue;
    }

    // Unordered list
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} className="my-6 space-y-2.5 pl-1">
          {items.map((item, j) => (
            <li key={j} className="flex gap-3 leading-relaxed">
              <span aria-hidden className="mt-[0.7em] block size-1.5 shrink-0 rounded-full bg-accent" />
              <span>{renderInline(item, `li-${key}-${j}`)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      blocks.push(
        <ol key={key++} className="my-6 space-y-2.5 pl-1">
          {items.map((item, j) => (
            <li key={j} className="flex gap-3 leading-relaxed">
              <span className="font-mono text-[13px] font-semibold text-accent">
                {String(j + 1).padStart(2, "0")}
              </span>
              <span>{renderInline(item, `oli-${key}-${j}`)}</span>
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // Paragraph — join consecutive plain lines
    const para: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{2,3} |- |\d+\.\s|> |```)/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={key++} className="my-5 leading-[1.75] text-ink-soft">
        {renderInline(para.join(" "), `p-${key}`)}
      </p>,
    );
  }

  return <>{blocks}</>;
}
