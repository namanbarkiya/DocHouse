import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MarkdownPublished } from "@/components/markdown-published";
import { JustPublished } from "@/components/just-published";
import { ReaderToolbar } from "@/components/reader-toolbar";
import { isPostTheme, type PostTheme } from "@/lib/themes";

type Params = { slug: string };
type Search = { just?: string };

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("title, content, created_at")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) {
    return {
      title: "Post not found",
      description: "This DocHouse post no longer exists or was never published.",
      robots: { index: false, follow: false },
    };
  }
  const description = excerpt(data.content);
  const canonical = `/p/${slug}`;
  const OG_IMAGE =
    "https://res.cloudinary.com/dvt5vkfwz/image/upload/dochouse_og_url.png";
  return {
    title: data.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: data.title,
      description,
      url: canonical,
      publishedTime: data.created_at,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: data.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description,
      images: [OG_IMAGE],
    },
  };
}

function excerpt(markdown: string, max = 180): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_>#~|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("slug, title, content, theme, view_count, created_at, user_id")
    .eq("slug", slug)
    .maybeSingle();
  if (!post) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = !!user && user.id === post.user_id;

  // Fire-and-forget view increment
  supabase.rpc("increment_view", { p_slug: slug }).then(() => undefined);

  const theme: PostTheme = isPostTheme(post.theme) ? post.theme : "paper";
  const bg = themeBg(theme);
  const justPublished = sp?.just === "1";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: excerpt(post.content),
    datePublished: post.created_at,
    url: `/p/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: "DocHouse",
      url: "https://dochouse.nbarkiya.xyz",
    },
  };

  return (
    <div
      data-post-bg
      style={{ background: bg, minHeight: "100vh", overflowX: "hidden" }}
    >
      <script
        dangerouslySetInnerHTML={{ __html: READER_THEME_BOOTSTRAP }}
      />
      {justPublished && <JustPublished slug={post.slug} />}
      <MarkdownPublished content={post.content} theme={theme} />
      <script
        dangerouslySetInnerHTML={{ __html: READER_THEME_APPLY }}
      />
      <PostCTA theme={theme} />
      <PostColophon
        theme={theme}
        createdAt={post.created_at}
        views={post.view_count}
      />
      <ReaderToolbar authorTheme={theme} editSlug={isOwner ? post.slug : null} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </div>
  );
}

const BG_BY_THEME = `{paper:'#faf7f2',ink:'#0e0c0a',console:'#ffffff'}`;

// Runs as soon as the post wrapper enters the DOM, before the article paints.
// Sets the wrapper + body bg to the reader's saved theme so there is no flash.
const READER_THEME_BOOTSTRAP = `(function(){try{var s=localStorage.getItem('dochouse:reader-theme');if(s!=='paper'&&s!=='ink'&&s!=='console')return;var bg=${BG_BY_THEME}[s];var w=document.currentScript&&document.currentScript.parentElement;if(w)w.style.background=bg;document.body.style.background=bg;document.documentElement.style.background=bg;}catch(e){}})();`;

// Runs right after the article enters the DOM. Swaps the article's theme class
// so the saved reader theme is applied before first paint of the body.
const READER_THEME_APPLY = `(function(){try{var s=localStorage.getItem('dochouse:reader-theme');if(s!=='paper'&&s!=='ink'&&s!=='console')return;var a=document.currentScript&&document.currentScript.previousElementSibling;if(!a||!a.classList||!a.classList.contains('prose-dochouse'))a=document.querySelector('article.prose-dochouse');if(a){a.classList.remove('prose-dochouse-paper','prose-dochouse-ink','prose-dochouse-console');a.classList.add('prose-dochouse-'+s);}}catch(e){}})();`;

function PostCTA({ theme }: { theme: PostTheme }) {
  const max = theme === "console" ? 880 : 760;
  const labelColor =
    theme === "ink" ? "#9a9588" : theme === "console" ? "#6b655a" : "#6b655a";
  const headingColor =
    theme === "ink" ? "#faf5e9" : "#181613";
  const buttonBg = "#d63a1f";
  const buttonText = "#faf7f2";
  const headingFont =
    theme === "console"
      ? "var(--font-geist-mono), ui-monospace, monospace"
      : "var(--font-fraunces), Georgia, serif";

  return (
    <section
      aria-label="Publish your own"
      style={{
        maxWidth: max,
        margin: "0 auto",
        padding: "20px clamp(20px, 5vw, 44px) 64px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "1.25rem",
          paddingTop: "1.75rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            fontSize: "10.5px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: labelColor,
            margin: 0,
          }}
        >
          <span style={{ color: buttonBg }}>●</span> &nbsp; Have your own?
        </p>
        <h2
          style={{
            fontFamily: headingFont,
            fontStyle: theme === "console" ? "normal" : "italic",
            fontWeight: theme === "console" ? 600 : 400,
            fontSize: theme === "console" ? "18px" : "28px",
            lineHeight: 1.25,
            letterSpacing: theme === "console" ? "0.02em" : "-0.015em",
            textTransform: theme === "console" ? "uppercase" : "none",
            color: headingColor,
            margin: 0,
            maxWidth: "32ch",
          }}
        >
          {theme === "console"
            ? "// Publish your own markdown."
            : "Paste your markdown, get a link like this."}
        </h2>
        <a
          href="/create"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.55rem",
            padding: "0.85rem 1.4rem",
            background: buttonBg,
            color: buttonText,
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            fontSize: "15px",
            letterSpacing: "-0.005em",
            textDecoration: "none",
            border: `1px solid ${buttonBg}`,
            transition: "background 280ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          Write your own
          <span aria-hidden style={{ display: "inline-block" }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="square"
            >
              <path d="M2 7h10M8 3l4 4-4 4" />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}

function themeBg(t: PostTheme) {
  if (t === "ink") return "#0e0c0a";
  if (t === "console") return "#ffffff";
  return "#faf7f2";
}

function PostColophon({
  theme,
  createdAt,
  views,
}: {
  theme: PostTheme;
  createdAt: string;
  views: number;
}) {
  const color =
    theme === "ink"
      ? "#6b6256"
      : theme === "console"
      ? "#9a9588"
      : "#b4ada0";
  const max = theme === "console" ? 880 : 760;
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <footer
      style={{
        maxWidth: max,
        margin: "0 auto",
        padding: "0 clamp(20px, 5vw, 44px) 80px",
      }}
    >
      <hr
        style={{
          border: 0,
          borderTop: `1px solid ${color}`,
          opacity: 0.4,
          marginBottom: "1.5rem",
        }}
      />
      <p
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "10.5px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color,
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <span>
          Published {date} &nbsp;·&nbsp; {views}{" "}
          {views === 1 ? "view" : "views"}
        </span>
        <Link
          href="/"
          style={{ color, textDecoration: "none" }}
          title="Publish your own markdown as a beautiful link"
        >
          Published with DocHouse ↗
        </Link>
      </p>
    </footer>
  );
}
