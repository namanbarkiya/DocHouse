"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deletePost } from "@/app/dashboard/actions";
import type { PostTheme } from "@/lib/themes";

type Row = {
  slug: string;
  title: string;
  theme: PostTheme;
  view_count: number;
  created_at: string;
};

export function PostRow({ post }: { post: Row }) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const link = typeof window !== "undefined"
    ? `${window.location.origin}/p/${post.slug}`
    : `/p/${post.slug}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function onDelete() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    setDeleteError(null);
    startTransition(async () => {
      try {
        await deletePost(post.slug);
        router.refresh();
      } catch (e) {
        setDeleteError(
          e instanceof Error ? e.message : "Could not delete post"
        );
        setConfirming(false);
      }
    });
  }

  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const themeColor =
    post.theme === "ink"
      ? "#0e0c0a"
      : post.theme === "console"
      ? "#0a0a0a"
      : "#d63a1f";

  return (
    <div className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-6 py-7 border-b border-hairline">
      <span
        className="inline-block w-2 h-2 rounded-full translate-y-[-2px]"
        style={{ background: themeColor }}
        aria-hidden
      />
      <div>
        <Link
          href={`/p/${post.slug}`}
          className="font-display text-ink hover:text-vermillion transition-colors duration-300 block"
          style={{
            fontSize: "26px",
            lineHeight: 1.18,
            letterSpacing: "-0.015em",
            fontWeight: 400,
          }}
        >
          {post.title}
        </Link>
        <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-faint">
          {date} &nbsp;·&nbsp; {post.theme} &nbsp;·&nbsp; {post.view_count}{" "}
          {post.view_count === 1 ? "view" : "views"} &nbsp;·&nbsp; /p/
          {post.slug}
        </p>
      </div>
      <div className="flex items-center gap-5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
        <Link
          href={`/edit/${post.slug}`}
          className="font-sans text-[12px] text-ink-muted hover:text-ink uppercase tracking-[0.14em] transition-colors duration-300"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={copy}
          className="font-sans text-[12px] text-ink-muted hover:text-ink uppercase tracking-[0.14em] transition-colors duration-300"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          className={`font-sans text-[12px] uppercase tracking-[0.14em] transition-colors duration-300 ${
            confirming
              ? "text-vermillion"
              : "text-ink-faint hover:text-vermillion"
          }`}
        >
          {pending ? "Deleting…" : confirming ? "Confirm?" : "Delete"}
        </button>
      </div>
      {deleteError && (
        <p
          role="alert"
          className="col-span-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-vermillion -mt-3"
        >
          {deleteError}
        </p>
      )}
    </div>
  );
}
