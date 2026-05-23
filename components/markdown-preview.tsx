"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { PostTheme } from "@/lib/themes";

export function MarkdownPreview({
  content,
  theme,
  fillContainer = false,
}: {
  content: string;
  theme: PostTheme;
  fillContainer?: boolean;
}) {
  return (
    <article
      className={`prose-dochouse prose-dochouse-${theme} themed-surface ${
        fillContainer ? "preview-fill" : ""
      }`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content || "*Start typing on the left…*"}
      </ReactMarkdown>
    </article>
  );
}
