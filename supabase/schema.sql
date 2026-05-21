-- mdshare — initial schema
-- Run once in the Supabase SQL editor.

create extension if not exists pgcrypto;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'post_theme') then
    create type post_theme as enum ('paper', 'ink', 'console');
  end if;
end $$;

create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null default 'Untitled',
  content     text not null,
  theme       post_theme not null default 'paper',
  user_id     uuid not null references auth.users(id) on delete cascade,
  view_count  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists posts_user_id_created_idx
  on public.posts (user_id, created_at desc);

alter table public.posts enable row level security;

drop policy if exists "public read"  on public.posts;
drop policy if exists "owner insert" on public.posts;
drop policy if exists "owner update" on public.posts;
drop policy if exists "owner delete" on public.posts;

create policy "public read"
  on public.posts for select
  using (true);

create policy "owner insert"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "owner update"
  on public.posts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "owner delete"
  on public.posts for delete
  using (auth.uid() = user_id);

-- View counter that bypasses RLS safely
create or replace function public.increment_view(p_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.posts set view_count = view_count + 1 where slug = p_slug;
$$;

grant execute on function public.increment_view(text) to anon, authenticated;
