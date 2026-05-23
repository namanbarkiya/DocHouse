# DocHouse

> Share markdown as a public web page. No Gist viewer, no signup wall.

📖 **Read this README on DocHouse → [dochouse.nbarkiya.xyz/p/readme](https://dochouse.nbarkiya.xyz/p/readme)**

**DocHouse** turns a `.md` file into a shareable URL in two clicks. Paste your
markdown, pick one of three reading themes (Paper, Ink, Console), hit
*Publish & get link*. You get a slug from your title, Shiki-highlighted code,
and a page that reads like a publication instead of source.

A fast alternative to **HackMD**, **Telegraph**, **GitHub Gist**, and
**Notion public pages** for anyone who wants to share a README, a note, an
AI-generated doc, or an essay with one link and zero setup.

Built with Next.js 16, React 19, Tailwind v4, Supabase (Postgres + Auth + RLS),
`react-markdown` + `@shikijs/rehype` (sync, pre-loaded highlighter) for code
highlighting.

---

## Stack at a glance

- **Paper site chrome.** Fraunces serif, warm cream background, single
  vermillion accent.
- **Three publish themes** the author picks per post: Paper, Ink, Console.
- **Lazy Google OAuth.** The user only signs in at the moment they click
  *Publish & get link*. The draft is stashed in `sessionStorage` and
  auto-submitted after the callback returns.
- **Slug strategy.** Slugified title, with a `nanoid` suffix retry on
  collision.
- **RLS.** Anyone can read; only the author can write, update, or delete
  their own posts.

---

## Features

### Writing & publishing

- Paste, drop, or upload a `.md` / `.markdown` / `.txt` file (2 MB cap) into the editor.
- Live split preview while typing, with a mobile Write/Preview toggle.
- Word count, draft auto-stash to `sessionStorage`.
- Lazy Google sign-in: account is only required at the moment you click *Publish & get link*. The draft is held in the tab and auto-submits on return from the OAuth callback.
- Slug generated from the post title, with `nanoid` suffix retry on collisions.
- GitHub-flavored markdown: tables, fenced code, footnotes, task lists.
- Shiki syntax highlighting baked into the server response, with a pre-loaded sync highlighter so there is no client-side highlight flash.

### Reading experience

- Three author-selectable themes per post:
  - **Paper.** Cream background, Fraunces serif. For essays and long reads.
  - **Ink.** Deep dark serif. For prose and late-night writing.
  - **Console.** White background, monospace. For READMEs, changelogs, dev docs.
- Fluid typography via `clamp()` so headings, body, and padding scale smoothly from phone to desktop.
- Tables horizontally scroll when narrow. Long URLs and inline code chips wrap so the article never overflows the viewport.
- Per-post view counter incremented through a `security definer` RPC that bypasses RLS safely.
- Theme-aware CTA at the end of every post inviting the reader to publish their own.

### Reader-side controls (floating toolbar)

- Fixed bottom-right `Settings2` trigger on every published post.
- Popover with a theme switcher (Paper / Ink / Console).
- Reader's chosen theme persists in `localStorage` (`dochouse:reader-theme`).
- Saved theme is applied **before first paint** on subsequent visits via an inline bootstrap script, so there is no theme flash.
- Popover also contains direct links to *Write your own* (`/create`) and *Your posts* (`/dashboard`).
- Closes on outside click or `Esc`.

### Author dashboard

- Auth-gated list of every post you've published, newest first.
- Inline copy-link button per row.
- Two-step delete with `count: "exact"` verification and inline error surfacing, so RLS or stale-row failures are not silent.
- View count, theme, slug, and publish date shown per row.

### Sharing surface

- Just-published floating toast with one-click *Copy link*.
- Open Graph and Twitter `summary_large_image` cards wired to a hosted 1200×630 OG image, so links look polished in Slack, X, Discord, iMessage.
- Per-post OG includes the post title as alt text.

### Discoverability (SEO / AEO / GEO)

- Canonical URL on every page, with template-driven `<title>`.
- `WebApplication` JSON-LD on the root layout.
- `FAQPage` JSON-LD on the landing page, paired with a five-question FAQ block shaped the way answer engines (Perplexity, Google AI Overviews, ChatGPT search) extract.
- `Article` JSON-LD per published post with `headline`, `description`, `datePublished`, and `publisher`.
- Per-post meta description auto-derived from the markdown body (fences, links, marks stripped).
- `app/robots.ts` and `app/sitemap.ts`. The sitemap pulls live slugs from Supabase with graceful fallback when the DB is unreachable at build time.
- `noindex` on private routes (`/dashboard`, `/login`, `/create`, `/marketing`).
- Vercel Analytics on every page.

### Identity & assets

- Custom serif "dh." mark: italic Fraunces lowercase + vermillion square endmark.
- Available as `<LogoMark>`, `<LogoWordmark>`, and a composed `<Logo variant="lockup">`.
- Multi-resolution `favicon.ico` (16, 32, 48, 64, 128, 256 px).
- `apple-icon.png` at 180×180, `icon.png` at 512×512.
- `/marketing` artboard route renders the OG card (Paper + Ink), social avatar, favicon source, and logo specimens at real export dimensions for screenshotting.

### Editor chrome

- Editor uses an `h-[100dvh]` layout: header and mobile secondary bar stay pinned at top, write and preview panes scroll independently with no spillover whitespace.
- Upload button rendered as a real bordered icon button (`Upload` lucide icon) instead of a plain text link.
- Mobile-only theme selector collapses to a single labeled dropdown with hint descriptions and a `Check` indicator on the active theme.
- Three-letter view toggle (Write / Preview) on mobile.

### Navigation

- Top-level navbar collapses to a hamburger dropdown on mobile (`< sm`) and shows inline links on tablet and desktop.
- Outside-click and `Esc` dismiss.

### Content ownership & moderation

- Postgres Row-Level Security: anyone can read; only the author can write, update, or delete their own posts.
- Sign-out is a real `<form action={signOut}>` so it works without JS.

### Performance & resilience

- Next.js 16 server components with a pre-loaded sync Shiki highlighter (no async-pipeline race).
- Paper-grain overlay rendered as an inline SVG data URI (no network request).
- All three reading themes share the same fluid padding system so they degrade gracefully on narrow screens.
- Inline reader-theme bootstrap script + `suppressHydrationWarning` on `<html>`, `<body>`, and `<article>` to keep the no-flash theme override hydration-clean.

---

## Local setup

```bash
pnpm install
cp .env.local.example .env.local       # fill in once Supabase is set up
pnpm dev                                # http://localhost:3000
```

The landing, editor, and login pages render without any backend. To publish, you
need a Supabase project.

## Supabase setup (one-time, ~5 minutes)

1. **Create a project** at <https://supabase.com/dashboard>.
2. **Run the schema.** Open the SQL editor and paste the contents of
   `supabase/schema.sql`. Run it. (Creates the `posts` table, the `post_theme`
   enum, RLS policies, and the `increment_view` RPC.)
3. **Enable Google sign-in**:
   - In Supabase: *Authentication → Providers → Google → Enable*.
   - In Google Cloud Console: create an OAuth 2.0 Web Client. Authorized
     redirect URI: `https://<your-ref>.supabase.co/auth/v1/callback` (copy
     from the Supabase Google provider page).
   - Paste the client ID + secret back into Supabase.
4. **Allow the local + prod callback URLs**:
   - Supabase *Authentication → URL Configuration → Redirect URLs*:
     ```
     http://localhost:3000/auth/callback
     https://<your-prod-domain>/auth/callback
     ```
5. **Copy your keys**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `sb_publishable_…` → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `sb_secret_…` → `SUPABASE_SECRET_KEY` *(reserved for future server-side
     admin features)*

Restart `pnpm dev` after editing `.env.local`.

## Deploy

```bash
vercel --prod
```

Set the same env vars in Vercel (Project → Settings → Environment Variables).
Add the production callback URL to Supabase Redirect URLs.

## Architecture

```
app/
  page.tsx                 # landing
  create/page.tsx          # editor (split: source | preview)
  p/[slug]/page.tsx        # public themed post (server-rendered + shiki)
  dashboard/page.tsx       # auth-gated post list
  dashboard/actions.ts     # server actions: deletePost, signOut
  login/                   # Google OAuth trigger
  auth/callback/route.ts   # OAuth code exchange
  api/posts/route.ts       # POST: create post with slug retry
  marketing/page.tsx       # noindex brand artboard (OG card + logo specimens)
  not-found.tsx            # editorial 404
  robots.ts, sitemap.ts    # SEO surface
  globals.css              # design tokens, grain, theme CSS

components/
  brand.tsx, hairline.tsx, arrow.tsx        # primitives
  logo.tsx, nav-menu.tsx                    # mark + mobile hamburger
  editor.tsx                                # the main client component
  theme-picker.tsx, theme-dropdown.tsx      # desktop chips + mobile dropdown
  markdown-preview.tsx                      # client-side preview render
  markdown-published.tsx                    # server-side render with shiki
  reader-toolbar.tsx                        # floating reader theme + CTAs
  post-row.tsx, sign-out.tsx                # dashboard
  just-published.tsx                        # post-publish toast

lib/
  themes.ts, sample.ts, slug.ts, title.ts, draft.ts
  supabase/client.ts                        # createBrowserClient
  supabase/server.ts                        # createServerClient(cookies)

proxy.ts                                    # Next 16 proxy (was middleware)
supabase/schema.sql                         # one-shot SQL
```

## Design system (cheat sheet)

| Token             | Value     | Used for                          |
| ----------------- | --------- | --------------------------------- |
| `--paper`         | `#faf7f2` | site background                   |
| `--paper-elev`    | `#ffffff` | editor pane, cards                |
| `--ink`           | `#181613` | primary text                      |
| `--ink-muted`     | `#6b655a` | secondary text                    |
| `--ink-faint`     | `#b4ada0` | mono small-caps labels            |
| `--hairline`      | `#e8e3d8` | every divider                     |
| `--vermillion`    | `#d63a1f` | THE accent. CTA, cursor, links    |

Fonts: **Fraunces** (display + reading body), **Geist Sans** (UI chrome),
**Geist Mono** (code, small-caps labels). All free via `next/font/google`.

## Verification

End-to-end with Supabase configured:

1. Visit `/`. Fraunces hero renders, "Start writing →" goes to `/create`.
2. Paste a markdown fixture, switch between Paper / Ink / Console themes,
   confirm the preview restyles in place.
3. Click *Publish & get link* logged out → routed to `/login?next=…` → Google
   sign-in → `/auth/callback` → returns to `/create?resume=1` → draft
   auto-submits → redirected to `/p/<slug>?just=1`.
4. Floating "Your post is live" toast appears on `/p/<slug>` once.
5. Visit `/dashboard`. Your new post is listed. Hover/tap → Copy link /
   Delete. Sign out returns to `/`.
6. Visit `/p/<slug>` directly without auth. Public read works, view counter
   increments.
