import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { createHighlighter, type Highlighter } from "shiki";
import type { PostTheme } from "@/lib/themes";

const SHIKI_THEME_PER_POST: Record<PostTheme, string> = {
  paper: "github-light",
  ink: "github-dark-dimmed",
  console: "min-light",
};

const SHIKI_THEMES = Object.values(SHIKI_THEME_PER_POST);
const SHIKI_LANGS = [
  "js",
  "jsx",
  "ts",
  "tsx",
  "json",
  "bash",
  "shell",
  "html",
  "css",
  "md",
  "py",
  "go",
  "rust",
  "sql",
  "yaml",
];

let highlighterPromise: Promise<Highlighter> | undefined;
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: SHIKI_THEMES,
      langs: SHIKI_LANGS,
    });
  }
  return highlighterPromise;
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

export async function MarkdownPublished({
  content,
  theme,
}: {
  content: string;
  theme: PostTheme;
}) {
  const highlighter = await getHighlighter();
  const rehypeShiki = () =>
    rehypeShikiFromHighlighter(highlighter, {
      theme: SHIKI_THEME_PER_POST[theme],
    });
  return (
    <article
      suppressHydrationWarning
      className={`prose-dochouse prose-dochouse-${theme} themed-surface`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeShiki]}
        components={{ a: ExternalLink }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
