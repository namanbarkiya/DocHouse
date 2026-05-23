import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isPostTheme, DEFAULT_THEME } from "@/lib/themes";

const MAX_CONTENT = 200_000;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { content, title, theme } = (body ?? {}) as {
    content?: unknown;
    title?: unknown;
    theme?: unknown;
  };

  if (typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Empty content" }, { status: 400 });
  }
  if (content.length > MAX_CONTENT) {
    return NextResponse.json({ error: "Content too long" }, { status: 413 });
  }

  const finalTitle = (
    typeof title === "string" && title.trim() ? title : "Untitled"
  ).slice(0, 120);
  const finalTheme = isPostTheme(theme) ? theme : DEFAULT_THEME;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { data, error, count } = await supabase
    .from("posts")
    .update(
      {
        content,
        title: finalTitle,
        theme: finalTheme,
      },
      { count: "exact" }
    )
    .eq("slug", slug)
    .eq("user_id", user.id)
    .select("slug")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!count || !data) {
    return NextResponse.json(
      { error: "Post not found or you do not own it" },
      { status: 404 }
    );
  }
  return NextResponse.json({ slug: data.slug });
}
