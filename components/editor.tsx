"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "./brand";
import { Hairline } from "./hairline";
import { ArrowRight } from "./arrow";
import { ThemePicker } from "./theme-picker";
import { MarkdownPreview } from "./markdown-preview";
import { DEFAULT_THEME, type PostTheme } from "@/lib/themes";
import { SAMPLE_MARKDOWN } from "@/lib/sample";
import { saveDraft, loadDraft, clearDraft } from "@/lib/draft";
import { extractTitle } from "@/lib/title";

export function Editor({ resumeMode }: { resumeMode: boolean }) {
  const [content, setContent] = useState(SAMPLE_MARKDOWN);
  const [theme, setTheme] = useState<PostTheme>(DEFAULT_THEME);
  const [view, setView] = useState<"write" | "preview">("write");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const didResume = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (resumeMode && !didResume.current) {
      didResume.current = true;
      const draft = loadDraft();
      if (draft) {
        // Hydrating from sessionStorage (client-only API). Can't be a useState
        // initializer because it would cause an SSR/CSR mismatch.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setContent(draft.content);
        setTheme(draft.theme);
        publish(draft.content, draft.theme, draft.title);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeMode]);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  async function publish(c = content, t = theme, title?: string) {
    setPublishing(true);
    setError(null);
    const finalTitle = title ?? extractTitle(c);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: c, theme: t, title: finalTitle }),
      });
      if (res.status === 401) {
        saveDraft({ content: c, theme: t, title: finalTitle });
        router.push("/login?next=" + encodeURIComponent("/create?resume=1"));
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Publish failed (${res.status})`);
      }
      const data = (await res.json()) as { slug: string };
      clearDraft();
      router.push(`/p/${data.slug}?just=1`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setPublishing(false);
    }
  }

  function onFile(file: File) {
    if (file.size > 2_000_000) {
      setError("File too large (max 2MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setContent(String(reader.result || ""));
    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 sm:px-10 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 sm:gap-8">
          <Brand size={18} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="font-sans text-[11.5px] text-ink-muted hover:text-ink uppercase tracking-[0.14em] transition-colors duration-300"
          >
            Upload .md
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,text/markdown,text/plain"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
              e.target.value = "";
            }}
          />
        </div>

        <div className="hidden md:block">
          <ThemePicker value={theme} onChange={setTheme} />
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <span className="hidden sm:inline font-mono text-[11px] text-ink-faint uppercase tracking-[0.16em]">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
          <button
            type="button"
            onClick={() => publish()}
            disabled={publishing || !content.trim()}
            className="fill-button"
          >
            {publishing ? "Publishing…" : "Publish & get link"}
            {!publishing && <ArrowRight size={14} />}
          </button>
        </div>
      </header>

      {/* Mobile-only secondary bar: theme + view toggle */}
      <div className="md:hidden px-6 pb-3 flex items-center justify-between gap-3">
        <ThemePicker value={theme} onChange={setTheme} compact />
        <div className="flex border border-hairline">
          <button
            type="button"
            onClick={() => setView("write")}
            className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] font-sans ${
              view === "write" ? "bg-ink text-paper" : "text-ink-muted"
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setView("preview")}
            className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] font-sans ${
              view === "preview" ? "bg-ink text-paper" : "text-ink-muted"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      <Hairline />

      {error && (
        <div className="px-6 sm:px-10 py-2.5 bg-vermillion-soft text-vermillion font-sans text-[13px] border-b border-hairline">
          {error}
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0">
        {/* Write pane */}
        <div
          className={`${
            view === "preview" ? "hidden md:block" : ""
          } bg-paper-elev md:border-r md:border-hairline overflow-y-auto`}
        >
          <textarea
            className="editor-surface w-full min-h-[calc(100vh-130px)] resize-none bg-transparent text-ink outline-none font-mono text-[14.5px] leading-[1.7] p-10 md:p-14"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Start with a heading — it becomes your title and URL slug"
            spellCheck={false}
            aria-label="Markdown source"
          />
        </div>

        {/* Preview pane */}
        <div
          className={`${
            view === "write" ? "hidden md:block" : ""
          } overflow-y-auto`}
          style={{ background: themeBg(theme) }}
        >
          <MarkdownPreview content={content} theme={theme} fillContainer />
        </div>
      </div>
    </div>
  );
}

function themeBg(t: PostTheme): string {
  if (t === "ink") return "#0e0c0a";
  if (t === "console") return "#ffffff";
  return "#faf7f2";
}
