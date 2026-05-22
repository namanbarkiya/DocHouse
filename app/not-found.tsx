import Link from "next/link";
import { Brand } from "@/components/brand";
import { Hairline } from "@/components/hairline";
import { ArrowRight } from "@/components/arrow";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col px-8 sm:px-14 lg:px-20 pt-8 pb-10">
      <header className="flex items-center justify-between">
        <Brand size={18} />
      </header>
      <section className="stage flex-1 flex flex-col justify-center max-w-[680px]">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint mb-10">
          <span className="text-vermillion">●</span> 404
        </p>
        <h1
          className="font-display text-ink"
          style={{
            fontSize: "clamp(44px, 8vw, 92px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontWeight: 400,
          }}
        >
          This page is{" "}
          <span style={{ fontStyle: "italic" }} className="text-vermillion">
            unwritten
          </span>
          .
        </h1>
        <p className="mt-9 max-w-md font-sans text-[17px] leading-[1.55] text-ink-muted">
          No post lives at this slug. The author may have deleted it, or the
          link was copied incompletely.
        </p>
        <div className="mt-12 flex items-center gap-8 flex-wrap">
          <Link href="/create" className="editorial-link text-[15px]">
            Publish your own <ArrowRight size={14} />
          </Link>
          <Link href="/" className="editorial-link text-[15px]">
            Back home <ArrowRight size={14} />
          </Link>
        </div>
      </section>
      <footer className="stage pt-10 mt-20">
        <Hairline />
      </footer>
    </main>
  );
}
