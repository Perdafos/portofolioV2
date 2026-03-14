create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_image_url text,
  tags text[] not null default '{}',
  is_published boolean not null default false,
  published_at timestamptz,
  reading_minutes int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_posts_published_date
  on public.blog_posts (is_published, published_at desc, created_at desc);

create index if not exists idx_blog_posts_slug
  on public.blog_posts (slug);

create or replace function public.set_blog_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at
before update on public.blog_posts
for each row
execute procedure public.set_blog_posts_updated_at();

alter table public.blog_posts enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_posts'
      and policyname = 'Public read published blog posts'
  ) then
    create policy "Public read published blog posts"
      on public.blog_posts
      for select
      to anon, authenticated
      using (is_published = true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_posts'
      and policyname = 'Authenticated manage blog posts'
  ) then
    create policy "Authenticated manage blog posts"
      on public.blog_posts
      for all
      to authenticated
      using (true)
      with check (true);
  end if;
end
$$;

insert into public.blog_posts
  (slug, title, excerpt, content, tags, is_published, published_at, reading_minutes, cover_image_url)
values
  (
    'building-high-performance-backends',
    'Building high-performance backends',
    'Discover practical backend architecture patterns focused on throughput, resilience, and maintainability.',
    'Membangun backend yang cepat tidak hanya soal memilih bahasa pemrograman. Kunci utamanya ada pada desain query, struktur cache, dan observability.\n\nPada artikel ini saya membahas bagaimana mengukur bottleneck lebih dulu, lalu memilih strategi optimasi yang sesuai konteks.\n\nDengan pendekatan itu, kita bisa meningkatkan performa tanpa mengorbankan maintainability.',
    array['backend', 'performance', 'supabase'],
    true,
    now() - interval '3 days',
    4,
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'getting-started-with-nextjs-and-typescript',
    'Getting started with Next.js and TypeScript',
    'Panduan ringkas menyiapkan project Next.js modern dengan TypeScript dan struktur folder yang rapi.',
    'Next.js dan TypeScript adalah kombinasi yang kuat untuk membangun web app modern.\n\nLangkah pertama adalah menentukan arsitektur route, strategi data fetching, dan boundary antara server dan client components.\n\nSetelah fondasi ini jelas, pengembangan fitur menjadi lebih cepat dan minim rework.',
    array['nextjs', 'typescript', 'frontend'],
    true,
    now() - interval '7 days',
    5,
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'building-rest-api-with-go-and-fiber',
    'Building REST API with Go and Fiber',
    'Implementasi REST API di Go + Fiber dengan struktur modular, validasi, dan error handling yang konsisten.',
    'Go dan Fiber cocok untuk API yang butuh latency rendah.\n\nDengan pattern service-repository, kode menjadi lebih terpisah antara logic bisnis dan akses data.\n\nHasil akhirnya adalah API yang cepat, lebih mudah dites, dan lebih siap untuk scaling.',
    array['go', 'fiber', 'api'],
    true,
    now() - interval '12 days',
    4,
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80'
  )
on conflict (slug) do nothing;
