-- create table for work videos
create table if not exists public.work_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  video_url text not null,
  platform text not null check (platform in ('tiktok', 'instagram', 'youtube')),
  embed_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- index for ordering work videos
create index if not exists idx_work_videos_sort_order
  on public.work_videos (sort_order, created_at desc);

-- trigger for updating updated_at field
create or replace function public.set_work_videos_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_work_videos_updated_at on public.work_videos;
create trigger trg_work_videos_updated_at
before update on public.work_videos
for each row
execute procedure public.set_work_videos_updated_at();

-- enable row level security (RLS)
alter table public.work_videos enable row level security;

-- public access (select)
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'work_videos'
      and policyname = 'Public read work_videos'
  ) then
    create policy "Public read work_videos"
      on public.work_videos
      for select
      to anon, authenticated
      using (true);
  end if;

  -- authenticated management (insert, update, delete)
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'work_videos'
      and policyname = 'Authenticated manage work_videos'
  ) then
    create policy "Authenticated manage work_videos"
      on public.work_videos
      for all
      to authenticated
      using (true)
      with check (true);
  end if;
end
$$;
