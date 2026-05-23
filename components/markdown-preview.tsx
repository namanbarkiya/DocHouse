"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { rehypeExtractDiagrams } from "@/lib/rehype-diagrams";
import { Mermaid } from "./mermaid";
import type { PostTheme } from "@/lib/themes";

function DiagramOrDiv(
  props: React.HTMLAttributes<HTMLDivElement> & {
    node?: { properties?: Record<string, unknown> };
  }
) {
  const properties = props.node?.properties ?? {};
  const source = properties["dataDiagramSource"];
  if (
    properties["dataDiagramType"] === "mermaid" &&
    typeof source === "string" &&
    source.trim().length > 0
  ) {
    return <Mermaid chart={source} />;
  }
  const { node: _node, ...rest } = props;
  return <div {...rest} />;
}

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
        rehypePlugins={[rehypeExtractDiagrams]}
        components={{ a: ExternalLink, div: DiagramOrDiv }}
      >
        {content || "*Start typing on the left…*"}
      </ReactMarkdown>
    </article>
  );
}
