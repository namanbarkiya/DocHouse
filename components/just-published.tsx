"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function JustPublished({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Strip the ?just=1 from the URL after mount so refresh doesn't show it again.
    if (typeof window !== "undefined") {
      const u = new URL(window.location.href);
      if (u.searchParams.has("just")) {
        u.searchParams.delete("just");
        window.history.replaceState({}, "", u.toString());
      }
    }
  }, [router]);

  if (!visible) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/p/${slug}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: 18,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        background: "#181613",
        color: "#faf7f2",
        padding: "10px 14px 10px 18px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        fontSize: 13,
        boxShadow: "0 18px 38px -16px rgba(0,0,0,0.45)",
        borderRadius: 2,
        animation: "paper-rise 600ms cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            display: "inline-block",
            width: 7,
            height: 7,
            borderRadius: 999,
            background: "#d63a1f",
            boxShadow: "0 0 0 4px rgba(214,58,31,0.18)",
          }}
        />
        Your post is live — link ready to share.
      </span>
      <button
        type="button"
        onClick={copy}
        style={{
          background: "transparent",
          color: "#faf7f2",
          border: "1px solid rgba(250,247,242,0.25)",
          padding: "5px 10px",
          fontFamily: "inherit",
          fontSize: 11.5,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          cursor: "pointer",
          transition: "border-color 280ms cubic-bezier(0.16,1,0.3,1)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = "rgba(250,247,242,0.6)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = "rgba(250,247,242,0.25)")
        }
      >
        {copied ? "Copied" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss"
        style={{
          background: "transparent",
          color: "rgba(250,247,242,0.55)",
          border: 0,
          padding: 0,
          marginLeft: -6,
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}
