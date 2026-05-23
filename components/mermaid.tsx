"use client";

import { useEffect, useRef, useState } from "react";

let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;

function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((m) => m.default);
  }
  return mermaidPromise;
}

/**
 * Mermaid emits its <svg> with a `viewBox`, a pixel `width`/`height`, and a
 * `max-width:100%` inline style. We want diagrams to scale UP for legibility
 * but stop before they sprawl. So:
 *
 *  - read the natural width Mermaid picked (whichever of `width` or `viewBox`
 *    is present);
 *  - cap the rendered SVG at `naturalWidth * 1.6`, with a hard floor of
 *    280px so micro state machines stay readable;
 *  - within that cap, fill the container width and keep aspect ratio.
 *
 * Result: simple 3-node diagrams stay small; complex flowcharts still
 * stretch to use the article column.
 */
function fluidSvg(svg: string): string {
  const widthAttr = svg.match(/<svg[^>]*\swidth="([\d.]+)(?:px)?"/)?.[1];
  const viewBox = svg.match(/viewBox="[^"]*\s([\d.]+)\s+[\d.]+\s*"/)?.[1];
  const natural = Number(widthAttr ?? viewBox ?? 0);
  const cap = Math.max(280, Math.min(Math.round(natural * 1.6), 1200));

  return svg
    .replace(/<svg([^>]*?)\swidth="[^"]*"/g, "<svg$1")
    .replace(/<svg([^>]*?)\sheight="[^"]*"/g, "<svg$1")
    .replace(/<svg([^>]*?)\sstyle="([^"]*)"/, (_m, attrs, style) => {
      const cleaned = style.replace(/(?:max-)?width:[^;]+;?/g, "");
      return `<svg${attrs}style="${cleaned}width:100%;height:auto;max-width:${cap}px;"`;
    })
    .replace(
      /<svg(?![^>]*\sstyle=)/,
      `<svg style="width:100%;height:auto;max-width:${cap}px;"`
    );
}

type PostThemeId = "paper" | "ink" | "console";

function pickPostTheme(el: HTMLElement | null): PostThemeId {
  // Walk up to the article element and read its theme class.
  let cur: HTMLElement | null = el;
  while (cur) {
    if (cur.classList?.contains("prose-dochouse-ink")) return "ink";
    if (cur.classList?.contains("prose-dochouse-console")) return "console";
    if (cur.classList?.contains("prose-dochouse-paper")) return "paper";
    cur = cur.parentElement;
  }
  return "paper";
}

// DocHouse brand palette mapped to mermaid theme variables. Uses our
// vermillion accent for node fills and borders, ink/cream for text, and
// muted ink for connector lines. Built on mermaid's `base` theme so every
// variable is honoured.
const MERMAID_THEMES: Record<
  PostThemeId,
  { theme: "base"; themeVariables: Record<string, string> }
> = {
  paper: {
    theme: "base",
    themeVariables: {
      background: "#faf7f2",
      primaryColor: "#f4dfd9",
      primaryBorderColor: "#d63a1f",
      primaryTextColor: "#181613",
      secondaryColor: "#f0e9dc",
      secondaryBorderColor: "#b4ada0",
      secondaryTextColor: "#181613",
      tertiaryColor: "#faf7f2",
      tertiaryBorderColor: "#e8e3d8",
      tertiaryTextColor: "#181613",
      lineColor: "#6b655a",
      textColor: "#181613",
      mainBkg: "#f4dfd9",
      nodeBorder: "#d63a1f",
      noteBkgColor: "#f0e9dc",
      noteBorderColor: "#b4ada0",
      noteTextColor: "#181613",
      edgeLabelBackground: "#faf7f2",
      clusterBkg: "#f0e9dc",
      clusterBorder: "#b4ada0",
      titleColor: "#181613",
      labelTextColor: "#181613",
      // Sequence-diagram specifics
      actorBkg: "#f4dfd9",
      actorBorder: "#d63a1f",
      actorTextColor: "#181613",
      actorLineColor: "#6b655a",
      signalColor: "#181613",
      signalTextColor: "#181613",
      labelBoxBkgColor: "#f0e9dc",
      labelBoxBorderColor: "#b4ada0",
      activationBkgColor: "#f4dfd9",
      activationBorderColor: "#d63a1f",
    },
  },
  ink: {
    theme: "base",
    themeVariables: {
      background: "#0e0c0a",
      primaryColor: "#2a1f1c",
      primaryBorderColor: "#ff5938",
      primaryTextColor: "#faf5e9",
      secondaryColor: "#1a1714",
      secondaryBorderColor: "#6b6256",
      secondaryTextColor: "#faf5e9",
      tertiaryColor: "#0e0c0a",
      tertiaryBorderColor: "#2a241e",
      tertiaryTextColor: "#faf5e9",
      lineColor: "#9a9588",
      textColor: "#faf5e9",
      mainBkg: "#2a1f1c",
      nodeBorder: "#ff5938",
      noteBkgColor: "#1a1714",
      noteBorderColor: "#6b6256",
      noteTextColor: "#faf5e9",
      edgeLabelBackground: "#0e0c0a",
      clusterBkg: "#1a1714",
      clusterBorder: "#2a241e",
      titleColor: "#faf5e9",
      labelTextColor: "#faf5e9",
      actorBkg: "#2a1f1c",
      actorBorder: "#ff5938",
      actorTextColor: "#faf5e9",
      actorLineColor: "#9a9588",
      signalColor: "#faf5e9",
      signalTextColor: "#faf5e9",
      labelBoxBkgColor: "#1a1714",
      labelBoxBorderColor: "#6b6256",
      activationBkgColor: "#2a1f1c",
      activationBorderColor: "#ff5938",
    },
  },
  console: {
    theme: "base",
    themeVariables: {
      background: "#ffffff",
      primaryColor: "#fae0d9",
      primaryBorderColor: "#d63a1f",
      primaryTextColor: "#0a0a0a",
      secondaryColor: "#f7f7f7",
      secondaryBorderColor: "#ececec",
      secondaryTextColor: "#0a0a0a",
      tertiaryColor: "#ffffff",
      tertiaryBorderColor: "#ececec",
      tertiaryTextColor: "#0a0a0a",
      lineColor: "#5e5e5e",
      textColor: "#0a0a0a",
      mainBkg: "#fae0d9",
      nodeBorder: "#d63a1f",
      noteBkgColor: "#f7f7f7",
      noteBorderColor: "#ececec",
      noteTextColor: "#0a0a0a",
      edgeLabelBackground: "#ffffff",
      clusterBkg: "#f7f7f7",
      clusterBorder: "#ececec",
      titleColor: "#0a0a0a",
      labelTextColor: "#0a0a0a",
      actorBkg: "#fae0d9",
      actorBorder: "#d63a1f",
      actorTextColor: "#0a0a0a",
      actorLineColor: "#5e5e5e",
      signalColor: "#0a0a0a",
      signalTextColor: "#0a0a0a",
      labelBoxBkgColor: "#f7f7f7",
      labelBoxBorderColor: "#ececec",
      activationBkgColor: "#fae0d9",
      activationBorderColor: "#d63a1f",
    },
  },
};

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = await loadMermaid();
        const postTheme = pickPostTheme(ref.current);
        const { theme, themeVariables } = MERMAID_THEMES[postTheme];
        mermaid.initialize({
          startOnLoad: false,
          theme,
          themeVariables,
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          securityLevel: "strict",
          flowchart: { curve: "basis", padding: 12 },
        });
        const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`;
        const { svg: rendered } = await mermaid.render(id, chart);
        if (!cancelled) setSvg(rendered);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Render error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <pre
        style={{
          border: "1px solid rgba(214,58,31,0.4)",
          padding: "0.9em 1.1em",
          color: "inherit",
          opacity: 0.9,
          fontSize: "0.82em",
          lineHeight: 1.55,
          overflowX: "auto",
        }}
      >
        <code>{`Diagram failed to render: ${error}\n\n${chart}`}</code>
      </pre>
    );
  }

  return (
    <div
      ref={ref}
      className="mermaid-rendered"
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        margin: "1.6em 0",
        overflowX: "auto",
      }}
    >
      {svg ? (
        <div
          aria-label="Diagram"
          role="img"
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
          // The injected SVG keeps its viewBox; we strip the fixed
          // width/height so it scales up to the container width, but cap it
          // at ~1.6× its natural width so simple diagrams don't sprawl.
          dangerouslySetInnerHTML={{ __html: fluidSvg(svg) }}
        />
      ) : (
        <div
          aria-hidden
          style={{
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            fontSize: "10.5px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            opacity: 0.55,
            padding: "1em",
          }}
        >
          Rendering diagram…
        </div>
      )}
    </div>
  );
}
