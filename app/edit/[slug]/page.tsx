import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Editor } from "@/components/editor";
import { isPostTheme, DEFAULT_THEME, type PostTheme } from "@/lib/themes";

type Params = { slug: string };

export const metadata = {
  title: "Edit post",
  description: "Edit your DocHouse post.",
  robots: { index: false, follow: false },
};

export default async function EditPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/edit/${slug}`)}`);
  }

  const { data: post } = await supabase
    .from("posts")
    .select("slug, title, content, theme, user_id")
    .eq("slug", slug)
    .maybeSingle();

  if (!post) notFound();
  if (post.user_id !== user.id) {
    // Not the author — pretend it doesn't exist rather than reveal ownership.
    notFound();
  }

  const theme: PostTheme = isPostTheme(post.theme) ? post.theme : DEFAULT_THEME;

  return (
    <Editor
      mode="edit"
      slug={post.slug}
      initialContent={post.content}
      initialTheme={theme}
    />
  );
}
