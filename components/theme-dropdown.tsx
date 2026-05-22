"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { POST_THEMES, type PostTheme } from "@/lib/themes";

export function ThemeDropdown({
  value,
  onChange,
}: {
  value: PostTheme;
  onChange: (t: PostTheme) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = POST_THEMES.find((t) => t.id === value) ?? POST_THEMES[0];

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

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 border border-hairline hover:border-ink px-3 py-1.5 font-sans text-[13px] text-ink transition-colors duration-200"
      >
        <span
          aria-hidden
          className="inline-block w-2.5 h-2.5"
          style={{
            background: current.swatch,
            boxShadow: "inset 0 0 0 1px rgba(24,22,19,0.18)",
          }}
        />
        <span>{current.label}</span>
        <ChevronDown size={14} strokeWidth={1.75} className="text-ink-muted" />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="Reading theme"
          className="absolute left-0 top-[calc(100%+6px)] z-30 min-w-[200px] bg-paper-elev border border-hairline shadow-[0_18px_38px_-16px_rgba(0,0,0,0.18)] py-1"
          style={{
            animation: "paper-rise 320ms cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {POST_THEMES.map((t) => {
            const active = t.id === value;
            return (
              <button
                key={t.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(t.id);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-paper transition-colors duration-150"
              >
                <span
                  aria-hidden
                  className="inline-block w-3 h-3 flex-none"
                  style={{
                    background: t.swatch,
                    boxShadow: "inset 0 0 0 1px rgba(24,22,19,0.18)",
                  }}
                />
                <span className="flex-1 min-w-0">
                  <span className="block font-sans text-[14px] text-ink">
                    {t.label}
                  </span>
                  <span className="block font-sans text-[11.5px] text-ink-faint leading-snug mt-0.5">
                    {t.hint}
                  </span>
                </span>
                {active && (
                  <Check size={14} strokeWidth={2} className="text-vermillion flex-none" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
