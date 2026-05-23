import { Logo, LogoMark, LogoWordmark } from "@/components/logo";

export const metadata = {
  title: "Brand artboard",
  robots: { index: false, follow: false },
};

const PAPER = "#faf7f2";
const PAPER_DEEP = "#f3ede2";
const INK = "#181613";
const INK_DEEP = "#0e0c0a";
const VERMILLION = "#d63a1f";
const HAIRLINE = "#e8e3d8";

export default function MarketingArtboard() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#1a1a1a",
        color: "#e5e5e5",
        padding: "48px 32px 96px",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      <header style={{ maxWidth: 1280, margin: "0 auto 56px" }}>
        <p
          style={{
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#888",
            marginBottom: 14,
          }}
        >
          <span style={{ color: VERMILLION }}>●</span> Brand artboard
          &nbsp;·&nbsp; screenshot at 100% zoom
        </p>
        <h1
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontWeight: 400,
            fontSize: 44,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            color: "#fafafa",
          }}
        >
          DocHouse <span style={{ color: "#666" }}>/</span> logo and og card
        </h1>
        <p
          style={{
            marginTop: 16,
            color: "#aaa",
            fontSize: 14,
            lineHeight: 1.55,
            maxWidth: 760,
          }}
        >
          Each artboard renders at its real export dimensions. Take a screenshot
          (Cmd+Shift+4, drag the artboard) and pass it back so it can be wired
          into <code style={{ color: VERMILLION }}>opengraph-image</code>,
          favicons, and social profiles.
        </p>
      </header>

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 64,
        }}
      >
        {/* ─────── OG card 1200×630 (cream) ─────── */}
        <Artboard label="Open Graph card" dims="1200 × 630" filename="og.png">
          <OGCard variant="paper" />
        </Artboard>

        {/* ─────── OG card 1200×630 (ink) ─────── */}
        <Artboard
          label="Open Graph card (Ink)"
          dims="1200 × 630"
          filename="og-dark.png"
        >
          <OGCard variant="ink" />
        </Artboard>

        {/* ─────── Square avatar 1024×1024 ─────── */}
        <Artboard
          label="Social avatar / app icon"
          dims="1024 × 1024"
          filename="avatar.png"
        >
          <Avatar />
        </Artboard>

        {/* ─────── Favicon source 512×512 ─────── */}
        <Artboard
          label="Favicon source"
          dims="512 × 512"
          filename="favicon-512.png"
        >
          <FaviconSource />
        </Artboard>

        {/* ─────── Logo specimens ─────── */}
        <Artboard
          label="Logo specimens"
          dims="reference"
          filename="not for export"
        >
          <LogoSpecimens />
        </Artboard>
      </div>
    </main>
  );
}

function Artboard({
  label,
  dims,
  filename,
  children,
}: {
  label: string;
  dims: string;
  filename: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 14,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: 24,
            letterSpacing: "-0.015em",
            color: "#fafafa",
          }}
        >
          {label}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#888",
          }}
        >
          {dims} &nbsp;·&nbsp; {filename}
        </p>
      </div>
      <div
        style={{
          display: "inline-block",
          boxShadow:
            "0 0 0 1px #2a2a2a, 0 24px 60px -20px rgba(0,0,0,0.7)",
          background: "#0a0a0a",
        }}
      >
        {children}
      </div>
    </section>
  );
}

/* ───────────────────────── OG card ───────────────────────── */

function OGCard({ variant }: { variant: "paper" | "ink" }) {
  const isInk = variant === "ink";
  const bg = isInk ? INK_DEEP : PAPER;
  const fg = isInk ? "#faf5e9" : INK;
  const muted = isInk ? "#9a9588" : "#6b655a";
  const accent = VERMILLION;
  const hairline = isInk ? "#2a241e" : HAIRLINE;
  const markBg = isInk ? PAPER : INK;
  const markGlyph = isInk ? INK : PAPER;

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        background: bg,
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-fraunces), Georgia, serif",
      }}
    >
      {/* Subtle grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isInk ? 0.06 : 0.04,
          mixBlendMode: isInk ? "screen" : "multiply",
          background:
            "radial-gradient(circle at 25% 30%, rgba(214,58,31,0.18), transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
          <LogoMark size={48} background={markBg} glyph={markGlyph} accent={accent} />
          <LogoWordmark size={26} color={fg} />
        </span>
        <span
          style={{
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: muted,
          }}
        >
          <span style={{ color: accent }}>●</span> &nbsp; No 001
        </span>
      </div>

      {/* Headline block */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 180,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontWeight: 400,
            fontSize: 116,
            lineHeight: 0.96,
            letterSpacing: "-0.035em",
            color: fg,
            margin: 0,
          }}
        >
          Share markdown
          <br />
          <span style={{ fontStyle: "italic", fontWeight: 300, color: accent }}>
            as a link.
          </span>
        </h1>

        <p
          style={{
            marginTop: 38,
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            fontSize: 26,
            lineHeight: 1.4,
            color: muted,
            maxWidth: 820,
            letterSpacing: "-0.005em",
          }}
        >
          Paste a markdown file. Pick a reading theme. Get a public URL with
          a slug from your title.
        </p>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          bottom: 52,
          paddingTop: 22,
          borderTop: `1px solid ${hairline}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          fontSize: 13,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: muted,
        }}
      >
        <span>dochouse.nbarkiya.xyz</span>
        <span>
          Paste &nbsp;·&nbsp; Preview &nbsp;·&nbsp; Publish &nbsp;·&nbsp; Share
        </span>
      </div>
    </div>
  );
}

/* ───────────────────────── Avatar ───────────────────────── */

function Avatar() {
  return (
    <div
      style={{
        width: 1024,
        height: 1024,
        background: INK_DEEP,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 30% 30%, rgba(214,58,31,0.18), transparent 60%)",
        }}
      />
      <LogoMark
        size={640}
        background={PAPER}
        glyph={INK}
        accent={VERMILLION}
      />
    </div>
  );
}

/* ───────────────────────── Favicon source ───────────────────────── */

function FaviconSource() {
  return (
    <div
      style={{
        width: 512,
        height: 512,
        background: PAPER,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LogoMark
        size={416}
        background={INK}
        glyph={PAPER}
        accent={VERMILLION}
      />
    </div>
  );
}

/* ───────────────────────── Specimens ───────────────────────── */

function LogoSpecimens() {
  return (
    <div
      style={{
        width: 1200,
        background: PAPER,
        padding: "56px 64px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 56,
      }}
    >
      <SpecimenRow label="Lockup · ink mark">
        <Logo variant="lockup" size={56} />
      </SpecimenRow>
      <SpecimenRow label="Lockup · vermillion mark">
        <Logo
          variant="lockup"
          size={56}
          background={VERMILLION}
          glyph={PAPER}
          accent={INK}
        />
      </SpecimenRow>
      <SpecimenRow label="Lockup · inverted (on ink)">
        <div
          style={{
            background: INK,
            padding: "20px 28px",
            borderRadius: 6,
            display: "inline-block",
          }}
        >
          <Logo
            variant="lockup"
            size={56}
            background={PAPER}
            glyph={INK}
            accent={VERMILLION}
            wordmarkColor={PAPER}
          />
        </div>
      </SpecimenRow>
      <SpecimenRow label="Mark only · scales">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 18 }}>
          <LogoMark size={16} />
          <LogoMark size={24} />
          <LogoMark size={40} />
          <LogoMark size={64} />
          <LogoMark size={96} />
        </span>
      </SpecimenRow>
      <SpecimenRow label="Wordmark only">
        <LogoWordmark size={40} />
      </SpecimenRow>
      <SpecimenRow label="On paper deep">
        <div
          style={{
            background: PAPER_DEEP,
            padding: "20px 28px",
            display: "inline-block",
            border: `1px solid ${HAIRLINE}`,
          }}
        >
          <Logo variant="lockup" size={48} />
        </div>
      </SpecimenRow>
    </div>
  );
}

function SpecimenRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#6b655a",
          marginBottom: 18,
        }}
      >
        {label}
      </p>
      <div>{children}</div>
    </div>
  );
}
