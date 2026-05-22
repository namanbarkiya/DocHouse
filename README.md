# mdshare

> Share markdown as a real web page — not a raw gist, not a signup wall.

**mdshare** turns a `.md` file into a designed, shareable URL in two clicks.
Paste your markdown, pick one of three editorial themes (Paper, Ink, Console),
hit *Publish & get link* — you get a slug from your title, Shiki-highlighted
code, and a page that looks like a publication, not source.

Designed as a fast alternative to **HackMD**, **Telegraph**, **GitHub Gist**,
and **Notion public pages** for anyone who wants to share a README, a note, an
AI-generated doc, or an essay with one link and zero setup.

Built with Next.js 16, React 19, Tailwind v4, Supabase (Postgres + Auth + RLS),
`react-markdown` + `@shikijs/rehype` (sync, pre-loaded highlighter) for code
highlighting.

---

## Stack at a glance

- **Editorial Paper** site chrome — Fraunces serif, warm cream paper, single
  vermillion accent. Awwwards-level reading experience.
- **Three publish themes** the author picks per post — Paper, Ink, Console.
- **Lazy Google OAuth** — the user only signs in at the moment they click
  *Publish & get link*. Draft is stashed in `sessionStorage` and auto-submitted
  after callback.
- **Slug strategy** — slugified title, with `nanoid` suffix retry on collision.
- **RLS** — anyone can read; only the author can write/update/delete their own
  posts.

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
2. **Run the schema** — open the SQL editor and paste the contents of
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
  not-found.tsx            # editorial 404
  globals.css              # design tokens, grain, theme CSS

components/
  brand.tsx, hairline.tsx, arrow.tsx        # primitives
  editor.tsx                                # the main client component
  theme-picker.tsx                          # 3-chip selector
  markdown-preview.tsx                      # client-side preview render
  markdown-published.tsx                    # server-side render with shiki
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
| `--vermillion`    | `#d63a1f` | THE accent — CTA, cursor, links   |

Fonts: **Fraunces** (display + reading body), **Geist Sans** (UI chrome),
**Geist Mono** (code, small-caps labels). All free via `next/font/google`.

## Verification

End-to-end with Supabase configured:

1. Visit `/` — Fraunces hero renders, "Start writing →" goes to `/create`.
2. Paste a markdown fixture, switch between Paper / Ink / Console themes,
   confirm the preview restyles in place.
3. Click *Publish & get link* logged out → routed to `/login?next=…` → Google
   sign-in → `/auth/callback` → returns to `/create?resume=1` → draft
   auto-submits → redirected to `/p/<slug>?just=1`.
4. Floating "Your post is live" toast appears on `/p/<slug>` once.
5. Visit `/dashboard` — your new post is listed. Hover/tap → Copy link /
   Delete. Sign out returns to `/`.
6. Visit `/p/<slug>` directly without auth — public read works, view counter
   increments.
