"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Brand } from "./brand";
import { Hairline } from "./hairline";
import { ArrowRight } from "./arrow";
import { ThemePicker } from "./theme-picker";
import { ThemeDropdown } from "./theme-dropdown";
import { MarkdownPreview } from "./markdown-preview";
import { DEFAULT_THEME, type PostTheme } from "@/lib/themes";
import { SAMPLE_MARKDOWN } from "@/lib/sample";
import { saveDraft, loadDraft, clearDraft } from "@/lib/draft";
import { extractTitle } from "@/lib/title";

type EditorProps =
  | { mode?: "create"; resumeMode: boolean }
  | {
      mode: "edit";
      slug: string;
      initialContent: string;
      initialTheme: PostTheme;
    };

export function Editor(props: EditorProps) {
  const editing = props.mode === "edit";
  const initialContent = editing ? props.initialContent : SAMPLE_MARKDOWN;
  const initialTheme = editing ? props.initialTheme : DEFAULT_THEME;
  const editSlug = editing ? props.slug : null;
  const resumeMode = !editing && props.resumeMode;

  const [content, setContent] = useState(initialContent);
  const [theme, setTheme] = useState<PostTheme>(initialTheme);
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
      const endpoint = editSlug
        ? `/api/posts/${encodeURIComponent(editSlug)}`
        : "/api/posts";
      const method = editSlug ? "PATCH" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: c, theme: t, title: finalTitle }),
      });
      if (res.status === 401) {
        if (editSlug) {
          router.push(
            "/login?next=" + encodeURIComponent(`/edit/${editSlug}`)
          );
          return;
        }
        saveDraft({ content: c, theme: t, title: finalTitle });
        router.push("/login?next=" + encodeURIComponent("/create?resume=1"));
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.error ?? `${editSlug ? "Save" : "Publish"} failed (${res.status})`
        );
      }
      const data = (await res.json()) as { slug: string };
      clearDraft();
      router.push(
        editSlug ? `/p/${data.slug}` : `/p/${data.slug}?just=1`
      );
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
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <header className="flex-none bg-paper px-5 sm:px-10 py-4 sm:py-5 flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <Brand size={22} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 border border-hairline hover:border-ink hover:text-ink px-3 py-1.5 font-sans text-[13px] text-ink-muted transition-colors duration-300"
          >
            <Upload size={14} strokeWidth={1.75} />
            <span className="hidden sm:inline">Upload .md</span>
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
            {publishing
              ? editSlug
                ? "Saving…"
                : "Publishing…"
              : editSlug
              ? "Save changes"
              : "Publish & get link"}
            {!publishing && <ArrowRight size={14} />}
          </button>
        </div>
      </header>

      {/* Mobile-only secondary bar: theme dropdown + view toggle */}
      <div className="flex-none md:hidden px-5 pb-3 flex items-center justify-between gap-3">
        <ThemeDropdown value={theme} onChange={setTheme} />
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

      <div className="flex-none">
        <Hairline />
      </div>

      {error && (
        <div className="flex-none px-5 sm:px-10 py-2.5 bg-vermillion-soft text-vermillion font-sans text-[13px] border-b border-hairline">
          {error}
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0">
        {/* Write pane — textarea owns its own scrolling */}
        <div
          className={`${
            view === "preview" ? "hidden md:block" : ""
          } bg-paper-elev md:border-r md:border-hairline min-h-0 overflow-hidden`}
        >
          <textarea
            className="editor-surface w-full h-full resize-none bg-transparent text-ink outline-none font-mono text-[14.5px] leading-[1.7] p-8 md:p-14 overflow-y-auto"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Start with a heading. It becomes your title and URL slug."
            spellCheck={false}
            aria-label="Markdown source"
          />
        </div>

        {/* Preview pane */}
        <div
          className={`${
            view === "write" ? "hidden md:block" : ""
          } overflow-y-auto min-h-0`}
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
