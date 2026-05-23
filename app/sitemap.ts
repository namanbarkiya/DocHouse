import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = "https://dochouse.nbarkiya.xyz";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("slug, created_at")
      .order("created_at", { ascending: false })
      .limit(5000);
    postRoutes = (data ?? []).map((p) => ({
      url: `${SITE_URL}/p/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Sitemap should still render even if the DB is unreachable at build time.
  }

  return [...staticRoutes, ...postRoutes];
}
