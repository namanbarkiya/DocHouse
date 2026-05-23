import Link from "next/link";

type LogoSize = number;
type LogoVariant = "lockup" | "mark" | "wordmark";

const INK = "#181613";
const PAPER = "#faf7f2";
const VERMILLION = "#d63a1f";

export function LogoMark({
  size = 40,
  background = INK,
  glyph = PAPER,
  accent = VERMILLION,
}: {
  size?: LogoSize;
  background?: string;
  glyph?: string;
  accent?: string;
}) {
  const dot = Math.max(3, Math.round(size * 0.1));
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        background,
        borderRadius: Math.round(size * 0.12),
        flex: "none",
        fontFamily: "var(--font-fraunces), Georgia, serif",
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: size * 0.46,
        lineHeight: 1,
        letterSpacing: "-0.02em",
        fontFeatureSettings: '"ss01"',
        textAlign: "center",
      }}
    >
      <span
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          transform: `translateY(${Math.round(size * 0.03)}px)`,
        }}
      >
        <span style={{ color: glyph }}>dh</span>
        <span
          style={{
            display: "inline-block",
            width: dot,
            height: dot,
            background: accent,
            marginLeft: Math.max(3, Math.round(size * 0.04)),
            verticalAlign: "baseline",
          }}
        />
      </span>
    </span>
  );
}

export function LogoWordmark({
  size = 22,
  color = INK,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--font-fraunces), Georgia, serif",
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.018em",
        color,
        fontFeatureSettings: '"ss01"',
      }}
    >
      DocHouse
    </span>
  );
}

export function Logo({
  variant = "lockup",
  size = 28,
  background = INK,
  glyph = PAPER,
  accent = VERMILLION,
  wordmarkColor = INK,
  asLink = false,
  ariaLabel = "DocHouse",
}: {
  variant?: LogoVariant;
  size?: LogoSize;
  background?: string;
  glyph?: string;
  accent?: string;
  wordmarkColor?: string;
  asLink?: boolean;
  ariaLabel?: string;
}) {
  const content =
    variant === "mark" ? (
      <LogoMark size={size} background={background} glyph={glyph} accent={accent} />
    ) : variant === "wordmark" ? (
      <LogoWordmark size={size} color={wordmarkColor} />
    ) : (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: Math.round(size * 0.34),
        }}
      >
        <LogoMark
          size={size}
          background={background}
          glyph={glyph}
          accent={accent}
        />
        <LogoWordmark size={size * 0.78} color={wordmarkColor} />
      </span>
    );

  if (asLink) {
    return (
      <Link
        href="/"
        aria-label={ariaLabel}
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        {content}
      </Link>
    );
  }
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      {content}
    </span>
  );
}
