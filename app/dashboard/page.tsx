import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Brand } from "@/components/brand";
import { Hairline } from "@/components/hairline";
import { ArrowRight } from "@/components/arrow";
import { PostRow } from "@/components/post-row";
import { SignOutForm } from "@/components/sign-out";
import type { PostTheme } from "@/lib/themes";

export const metadata = {
  title: "Your library",
  description:
    "Every post you've published with mdshare — slugs, themes, view counts.",
  robots: { index: false, follow: false },
};

type Row = {
  slug: string;
  title: string;
  theme: PostTheme;
  view_count: number;
  created_at: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data } = await supabase
    .from("posts")
    .select("slug, title, theme, view_count, created_at")
    .order("created_at", { ascending: false });
  const posts = (data ?? []) as Row[];

  return (
    <main className="min-h-screen flex flex-col px-6 sm:px-12 lg:px-24 pt-8 pb-10">
      <header className="flex items-center justify-between">
        <Brand size={18} />
        <nav className="flex items-center gap-7 font-sans text-[13px] text-ink-muted">
          <Link
            href="/create"
            className="hover:text-ink transition-colors duration-300"
          >
            New post
          </Link>
          <SignOutForm />
        </nav>
      </header>

      <section className="stage flex-1 max-w-[920px] w-full mt-16 sm:mt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint mb-8">
          <span className="text-vermillion">●</span> Your library
          &nbsp;·&nbsp; {posts.length}{" "}
          {posts.length === 1 ? "post" : "posts"}
        </p>
        <h1
          className="font-display text-ink mb-14"
          style={{
            fontSize: "clamp(44px, 7vw, 84px)",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            fontWeight: 400,
          }}
        >
          Your library.
        </h1>

        {posts.length === 0 ? (
          <div className="border-t border-hairline pt-10">
            <p
              className="font-display text-ink-muted"
              style={{
                fontSize: "26px",
                lineHeight: 1.4,
                fontStyle: "italic",
              }}
            >
              An empty page is the start of every good one.
            </p>
            <div className="mt-8">
              <Link href="/create" className="editorial-link text-[16px]">
                Publish your first post
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <ul className="border-t border-hairline">
            {posts.map((p) => (
              <li key={p.slug}>
                <PostRow post={p} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="stage pt-10 mt-20">
        <Hairline />
        <p className="pt-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-faint">
          Signed in as &nbsp;·&nbsp; {user.email}
        </p>
      </footer>
    </main>
  );
}
