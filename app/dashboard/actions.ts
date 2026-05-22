"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function deletePost(slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { error, count } = await supabase
    .from("posts")
    .delete({ count: "exact" })
    .eq("slug", slug)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  if (!count) throw new Error("Post not found or already removed");
  revalidatePath("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
