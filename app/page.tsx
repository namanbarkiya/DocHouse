import Link from "next/link";
import { Brand } from "@/components/brand";
import { Hairline } from "@/components/hairline";
import { ArrowRight } from "@/components/arrow";

const FAQ = [
  {
    q: "How do I share a markdown file as a link?",
    a: "Paste your markdown into mdshare, pick a reading theme, and click Publish & get link. You get a public URL with a readable slug — no static site, no repo, no copy-pasting into a Gist.",
  },
  {
    q: "What's the difference between mdshare and a GitHub Gist?",
    a: "A Gist renders markdown inside a code-viewer chrome. mdshare renders it as an actual web page — editorial typography, real headings, Shiki-highlighted code blocks, a clean URL — so what you share looks designed, not like source code.",
  },
  {
    q: "Do I need an account to publish?",
    a: "No account is needed to write or preview. You only sign in with Google at the exact moment you click Publish & get link, so we can attach the post to you and let you edit, delete, or track views later.",
  },
  {
    q: "Is mdshare a good HackMD or Telegraph alternative?",
    a: "Yes. HackMD asks you to sign up before you can do anything; Telegraph is plain and has no code highlighting. mdshare lets you start instantly, ships three designed themes (Paper, Ink, Console), and highlights code with Shiki by default.",
  },
  {
    q: "Can I publish a long README or a technical doc?",
    a: "Yes. Pick the Console theme for changelogs, READMEs, and developer-facing docs — it's monospace, dense, and built for code-heavy writing. Tables, fenced code, GFM, and footnotes all render cleanly.",
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function Home() {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="min-h-screen flex flex-col px-8 sm:px-14 lg:px-20 pt-8 pb-10">
      <header className="flex items-center justify-between">
        <Brand size={18} />
        <nav className="flex items-center gap-7 text-[13px] text-ink-muted font-sans">
          <Link
            href="/create"
            className="hover:text-ink transition-colors duration-300"
          >
            Write
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-ink transition-colors duration-300"
          >
            Dashboard
          </Link>
        </nav>
      </header>

      <section className="stage flex-1 flex flex-col justify-center max-w-[1400px] mx-auto w-full pt-16 sm:pt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint mb-10 sm:mb-14">
          <span className="text-vermillion">●</span> No 001 &nbsp;·&nbsp; The
          markdown press
        </p>

        <h1
          className="font-display text-ink"
          style={{
            fontSize: "clamp(52px, 10vw, 132px)",
            lineHeight: 0.95,
            letterSpacing: "-0.035em",
            fontWeight: 400,
          }}
        >
          Markdown,
          <br />
          <span
            style={{ fontStyle: "italic", fontWeight: 300 }}
            className="text-vermillion"
          >
            beautifully
          </span>{" "}
          published.
        </h1>

        <p className="mt-10 max-w-2xl font-sans text-[18px] sm:text-[19px] leading-[1.55] text-ink-muted">
          Paste a <strong className="text-ink font-normal">markdown file</strong>{" "}
          and get a shareable link that reads like a real publication — three
          editorial themes, syntax-highlighted code, a clean URL from your
          title. No raw gist. No signup wall.
        </p>

        <div className="mt-12 flex items-center gap-10 flex-wrap">
          <Link href="/create" className="editorial-link text-[16px]">
            Start writing
            <ArrowRight size={14} />
          </Link>
          <span className="font-mono text-[11px] text-ink-faint uppercase tracking-[0.16em]">
            Free · No signup until you publish
          </span>
        </div>
      </section>

      <section
        aria-labelledby="faq"
        className="stage max-w-[1400px] mx-auto w-full mt-32 sm:mt-48 pb-8"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint mb-8">
          <span className="text-vermillion">●</span> Notes from the press
        </p>
        <h2
          id="faq"
          className="font-display text-ink mb-14"
          style={{
            fontSize: "clamp(34px, 5vw, 56px)",
            lineHeight: 1.04,
            letterSpacing: "-0.025em",
            fontWeight: 400,
          }}
        >
          Frequently asked.
        </h2>
        <dl className="border-t border-hairline max-w-[980px]">
          {FAQ.map(({ q, a }) => (
            <div
              key={q}
              className="py-8 border-b border-hairline grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4 sm:gap-10"
            >
              <dt
                className="font-display text-ink"
                style={{
                  fontSize: "20px",
                  lineHeight: 1.3,
                  letterSpacing: "-0.012em",
                  fontWeight: 400,
                }}
              >
                {q}
              </dt>
              <dd className="font-sans text-[15.5px] leading-[1.65] text-ink-muted">
                {a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="stage pt-10 mt-20">
        <Hairline />
        <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-faint">
          <span>
            Vol. mdshare &nbsp;·&nbsp; Published with care &nbsp;·&nbsp;{" "}
            {today}
          </span>
          <span>
            Paste &nbsp;·&nbsp; Preview &nbsp;·&nbsp; Publish &nbsp;·&nbsp;
            Share
          </span>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
    </main>
  );
}
