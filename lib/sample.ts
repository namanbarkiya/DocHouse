export const SAMPLE_MARKDOWN = `# Hello, doc.

DocHouse turns a markdown file into a public web page. Everything below
shows what that means in practice. Replace this with your own content when
you're ready.

## The basics

You get **bold**, *italic*, ~~strikethrough~~, \`inline code\`, and
[real links](https://nbarkiya.xyz) that open in a new tab with the right
\`rel\` attributes.

> "Anything that can be a markdown file can be a shared link."
> Pasted into DocHouse just now.

Headings get scaled type and a single vermillion accent. On the Paper and
Ink themes, the first letter of the opening paragraph becomes a real drop
cap.

### What renders

- GitHub-flavored markdown (tables, footnotes, task lists, strikethrough).
- Syntax-highlighted code blocks via Shiki, with the highlighter pre-loaded
  on the server so there is no client-side flash.
- Mermaid diagrams as proper interactive SVG, lazy-loaded only when a post
  has them.
- Three reading themes the author picks per post. Readers can override the
  choice for themselves, and it persists across visits.

### Task list

- [x] Paste markdown into the editor on the left.
- [x] Pick a theme up top.
- [ ] Replace this sample with your own writing.
- [ ] Hit **Publish & get link**.

## A table

| Theme   | Background | Font        | Best for                  |
| ------- | ---------- | ----------- | ------------------------- |
| Paper   | Cream      | Fraunces    | Essays, letters, opinion  |
| Ink     | Black      | Fraunces    | Long-form prose, poetry   |
| Console | White      | Geist Mono  | READMEs, changelogs, docs |

## Code blocks, four languages

A TypeScript snippet, highlighted by Shiki:

\`\`\`ts
type Post = {
  slug: string;
  title: string;
  content: string;
  theme: "paper" | "ink" | "console";
};

async function publish(post: Post): Promise<URL> {
  const res = await fetch("/api/posts", {
    method: "POST",
    body: JSON.stringify(post),
  });
  const { slug } = await res.json();
  return new URL(\`/p/\${slug}\`, location.origin);
}
\`\`\`

A Python one, for contrast:

\`\`\`python
import re

def slugify(title: str) -> str:
    words = re.findall(r"[a-zA-Z0-9]+", title.lower())
    return "-".join(words) or "untitled"
\`\`\`

A bash one-liner anyone with the API key can run:

\`\`\`bash
curl -sX POST https://dochouse.nbarkiya.xyz/api/posts \\
  -H "Content-Type: application/json" \\
  -d '{"content":"# hi","title":"hi","theme":"paper"}'
\`\`\`

A SQL query against the actual schema:

\`\`\`sql
select slug, title, view_count
from posts
where user_id = auth.uid()
order by created_at desc
limit 20;
\`\`\`

## Diagrams

A flow chart of the whole publish loop:

\`\`\`mermaid
flowchart LR
  A[Paste markdown] --> B[Pick a theme]
  B --> C[Publish & get link]
  C --> D[Share the URL]
  D --> E{Reader likes the theme?}
  E -->|Yes| F[Reads in peace]
  E -->|No| G[Flips theme via<br/>reader toolbar]
  G --> F
\`\`\`

A sequence diagram of an author and a reader, end to end:

\`\`\`mermaid
sequenceDiagram
  participant A as Author
  participant DH as DocHouse
  participant R as Reader
  A->>DH: paste markdown
  A->>DH: pick a theme
  A->>DH: click publish
  DH-->>A: returns slug
  A->>R: shares /p/slug
  R->>DH: opens the link
  DH-->>R: server-rendered page
  R->>DH: flips reader theme
  DH-->>R: applies before next paint
\`\`\`

A small state machine for a post's lifecycle:

\`\`\`mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> Published: publish
  Published --> Draft: edit
  Published --> [*]: delete
\`\`\`

## Footnotes

Mermaid diagrams are lazy-loaded[^lazy], so posts without any diagrams do
not pay for the library. The same applies to most of the editor's heavier
imports.

[^lazy]: The \`mermaid\` package is only fetched on the client when a fenced
    code block tagged \`mermaid\` appears in the post.

---

That is everything. Replace this with your own markdown on the left, then
hit **Publish & get link** above. You can also upload a \`.md\` file with
the **Upload .md** button.
`;
