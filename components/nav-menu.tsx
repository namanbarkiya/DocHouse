"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

export function NavMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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
    <>
      {/* Desktop / tablet: inline */}
      <nav className="hidden sm:flex items-center gap-5 sm:gap-8 font-sans text-[15px] sm:text-[16px] text-ink-muted">
        {children}
      </nav>

      {/* Mobile: hamburger + dropdown */}
      <div ref={rootRef} className="sm:hidden relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="inline-flex items-center justify-center w-10 h-10 border border-hairline hover:border-ink text-ink-muted hover:text-ink transition-colors duration-200"
        >
          {open ? (
            <X size={18} strokeWidth={1.75} />
          ) : (
            <Menu size={18} strokeWidth={1.75} />
          )}
        </button>
        {open && (
          <div
            role="menu"
            onClick={() => setOpen(false)}
            className="absolute right-0 top-[calc(100%+8px)] z-40 w-56 bg-paper-elev border border-hairline shadow-[0_24px_60px_-22px_rgba(0,0,0,0.18)] py-2"
            style={{
              animation: "paper-rise 360ms cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <div className="flex flex-col font-sans text-[15px] text-ink [&_a]:px-4 [&_a]:py-2.5 [&_a]:block [&_a]:hover:bg-paper [&_button]:px-4 [&_button]:py-2.5 [&_button]:text-left [&_button]:w-full [&_button]:hover:bg-paper">
              {children}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
