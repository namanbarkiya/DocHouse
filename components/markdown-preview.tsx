"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { PostTheme } from "@/lib/themes";

function ExternalLink({
  href,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isInternal =
    !href || href.startsWith("#") || href.startsWith("/");
  if (isInternal) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" {...rest}>
      {children}
    </a>
  );
}

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
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ a: ExternalLink }}
      >
        {content || "*Start typing on the left…*"}
      </ReactMarkdown>
    </article>
  );
}
