export type PostTheme = "paper" | "ink" | "console";

export const POST_THEMES: ReadonlyArray<{
  id: PostTheme;
  label: string;
  hint: string;
  swatch: string;
}> = [
  {
    id: "paper",
    label: "Paper",
    hint: "Warm cream · serif · for essays and long reads",
    swatch: "#faf7f2",
  },
  {
    id: "ink",
    label: "Ink",
    hint: "Deep dark · serif · for prose and late-night writing",
    swatch: "#0e0c0a",
  },
  {
    id: "console",
    label: "Console",
    hint: "Monospace · technical · for READMEs, changelogs, docs",
    swatch: "#ffffff",
  },
];

export const DEFAULT_THEME: PostTheme = "paper";

export function isPostTheme(value: unknown): value is PostTheme {
  return value === "paper" || value === "ink" || value === "console";
}
