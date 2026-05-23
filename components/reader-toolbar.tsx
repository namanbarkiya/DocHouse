"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Settings2, PenLine, LibraryBig, Pencil, X } from "lucide-react";
import { POST_THEMES, type PostTheme } from "@/lib/themes";

const STORAGE_KEY = "dochouse:reader-theme";

const BG_BY_THEME: Record<PostTheme, string> = {
  paper: "#faf7f2",
  ink: "#0e0c0a",
  console: "#ffffff",
};

export function ReaderToolbar({
  authorTheme,
  editSlug = null,
}: {
  authorTheme: PostTheme;
  editSlug?: string | null;
}) {
  const [theme, setTheme] = useState<PostTheme>(authorTheme);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Restore reader override if present
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "paper" || saved === "ink" || saved === "console") {
        setTheme(saved);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply theme to article + background wrapper
  useEffect(() => {
    const article = document.querySelector<HTMLElement>("article.prose-dochouse");
    if (article) {
      article.classList.remove(
        "prose-dochouse-paper",
        "prose-dochouse-ink",
        "prose-dochouse-console"
      );
      article.classList.add(`prose-dochouse-${theme}`);
    }
    const wrapper = document.querySelector<HTMLElement>("[data-post-bg]");
    if (wrapper) wrapper.style.background = BG_BY_THEME[theme];
    document.body.style.background = BG_BY_THEME[theme];
  }, [theme]);

  // Close popover on click outside
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function pick(t: PostTheme) {
    setTheme(t);
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {}
  }

  const surfaceBg = theme === "ink" ? "#181613" : "#ffffff";
  const surfaceText = theme === "ink" ? "#faf5e9" : "#181613";
  const surfaceMuted = theme === "ink" ? "#9a9588" : "#6b655a";
  const surfaceHair = theme === "ink" ? "#2a241e" : "#e8e3d8";
  const triggerBg = "#d63a1f";
  const triggerText = "#faf7f2";

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed",
        right: "max(16px, env(safe-area-inset-right))",
        bottom: "max(16px, env(safe-area-inset-bottom))",
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 12,
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      {open && (
        <div
          role="dialog"
          aria-label="Reader settings"
          style={{
            background: surfaceBg,
            color: surfaceText,
            border: `1px solid ${surfaceHair}`,
            boxShadow: "0 24px 60px -22px rgba(0,0,0,0.45)",
            padding: 18,
            width: "min(280px, calc(100vw - 32px))",
            animation: "paper-rise 380ms cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <span
              style={{
                fontFamily:
                  "var(--font-geist-mono), ui-monospace, monospace",
                fontSize: 10.5,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: surfaceMuted,
              }}
            >
              <span style={{ color: triggerBg }}>●</span> &nbsp; Reader
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                background: "transparent",
                border: 0,
                padding: 4,
                cursor: "pointer",
                color: surfaceMuted,
                display: "inline-flex",
              }}
            >
              <X size={16} strokeWidth={1.75} />
            </button>
          </div>

          <p
            style={{
              fontFamily:
                "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: 10.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: surfaceMuted,
              margin: "0 0 10px",
            }}
          >
            Theme
          </p>
          <div
            role="radiogroup"
            aria-label="Reading theme"
            style={{ display: "flex", gap: 6, marginBottom: 18 }}
          >
            {POST_THEMES.map((t) => {
              const active = t.id === theme;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => pick(t.id)}
                  title={t.hint}
                  style={{
                    flex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "8px 10px",
                    border: `1px solid ${active ? surfaceText : surfaceHair}`,
                    background: active
                      ? theme === "ink"
                        ? "#221d18"
                        : "#f5efe2"
                      : "transparent",
                    color: surfaceText,
                    fontFamily:
                      "var(--font-geist-sans), system-ui, sans-serif",
                    fontSize: 12.5,
                    letterSpacing: "-0.005em",
                    cursor: "pointer",
                    transition:
                      "border-color 220ms cubic-bezier(0.16,1,0.3,1), background 220ms cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 9,
                      height: 9,
                      background: t.swatch,
                      boxShadow: "inset 0 0 0 1px rgba(24,22,19,0.18)",
                      flex: "none",
                    }}
                  />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div
            style={{
              borderTop: `1px solid ${surfaceHair}`,
              paddingTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {editSlug && (
              <Link
                href={`/edit/${editSlug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 4px",
                  color: surfaceText,
                  textDecoration: "none",
                  fontSize: 14,
                  letterSpacing: "-0.005em",
                }}
              >
                <Pencil size={16} strokeWidth={1.75} />
                <span>Edit this post</span>
              </Link>
            )}
            <Link
              href="/create"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 4px",
                color: surfaceText,
                textDecoration: "none",
                fontSize: 14,
                letterSpacing: "-0.005em",
              }}
            >
              <PenLine size={16} strokeWidth={1.75} />
              <span>Write your own</span>
            </Link>
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 4px",
                color: surfaceText,
                textDecoration: "none",
                fontSize: 14,
                letterSpacing: "-0.005em",
              }}
            >
              <LibraryBig size={16} strokeWidth={1.75} />
              <span>Your posts</span>
            </Link>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close reader settings" : "Open reader settings"}
        aria-expanded={open}
        style={{
          background: triggerBg,
          color: triggerText,
          border: 0,
          width: 44,
          height: 44,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 14px 30px -12px rgba(214,58,31,0.55)",
          transition: "transform 220ms cubic-bezier(0.16,1,0.3,1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <Settings2 size={18} strokeWidth={1.75} />
      </button>
    </div>
  );
}
