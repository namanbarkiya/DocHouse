import { Editor } from "@/components/editor";

export const metadata = {
  title: "Write & publish markdown",
  description:
    "Paste or upload a markdown file, pick a reading theme, and publish it as a shareable web page. Live preview, Shiki syntax highlighting, no signup until you click publish.",
  alternates: { canonical: "/create" },
};

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ resume?: string }>;
}) {
  const sp = await searchParams;
  return <Editor resumeMode={sp?.resume === "1"} />;
}
