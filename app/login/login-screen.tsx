"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Brand } from "@/components/brand";
import { Hairline } from "@/components/hairline";
import { ArrowRight } from "@/components/arrow";

export function LoginScreen() {
  const sp = useSearchParams();
  const next = sp.get("next") || "/dashboard";
  const errored = sp.get("error");
  const [pending, setPending] = useState(false);

  async function go() {
    setPending(true);
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) {
        console.error(error);
        setPending(false);
      }
    } catch (e) {
      console.error(e);
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col px-8 sm:px-14 lg:px-20 pt-8 pb-10">
      <header className="flex items-center justify-between">
        <Brand size={18} />
      </header>
      <section className="stage flex-1 flex flex-col justify-center max-w-[680px]">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint mb-10">
          <span className="text-vermillion">●</span> One step from a live link
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
          Sign in to{" "}
          <span
            style={{ fontStyle: "italic", fontWeight: 300 }}
            className="text-vermillion"
          >
            publish
          </span>
          .
        </h1>
        <p className="mt-9 max-w-md font-sans text-[17px] leading-[1.55] text-ink-muted">
          Google verifies it&apos;s you so the post belongs to your library —
          edit it, delete it, watch the view count later. Your draft is held
          safely in this tab and publishes the second you&apos;re back.
        </p>
        {errored && (
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-vermillion">
            Something went wrong. Please try again.
          </p>
        )}
        <div className="mt-12">
          <button
            type="button"
            onClick={go}
            disabled={pending}
            className="fill-button"
          >
            {pending ? "Opening Google…" : "Continue with Google"}
            {!pending && <ArrowRight size={14} />}
          </button>
        </div>
      </section>
      <footer className="stage pt-10 mt-20">
        <Hairline />
        <p className="pt-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-faint">
          Vol. mdshare &nbsp;·&nbsp; Sign in once · publish anytime
        </p>
      </footer>
    </main>
  );
}
