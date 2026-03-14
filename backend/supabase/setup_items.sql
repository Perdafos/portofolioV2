create table if not exists public.setup_items (
  id bigint generated always as identity primary key,
  category text not null check (category in ('hardware', 'peripherals', 'software')),
  label text not null,
  value text not null,
  sort_order int,
  created_at timestamptz not null default now()
);

create index if not exists idx_setup_items_category_sort
  on public.setup_items (category, sort_order, id);

alter table public.setup_items enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'setup_items'
      and policyname = 'Public read setup_items'
  ) then
    create policy "Public read setup_items"
      on public.setup_items
      for select
      to anon, authenticated
      using (true);
  end if;
end
$$;

insert into public.setup_items (category, label, value, sort_order) values
  ('hardware', 'Laptop', 'HP Victus 15', 1),
  ('hardware', 'CPU', 'Intel Core i5-13420H', 2),
  ('hardware', 'GPU', 'RTX 3050', 3),
  ('hardware', 'RAM', '16 GB DDR4', 4),
  ('hardware', 'Storage', '512 GB NVMe SSD', 5),
  ('hardware', 'Display', '15.6" FHD IPS 60Hz', 6),
  ('peripherals', 'Mouse', 'Da Gaming Luna', 1),
  ('peripherals', 'Keyboard', 'NEMESIS Keyboard', 2),
  ('peripherals', 'Headphones', 'Gaming Headset', 3),
  ('software', 'OS', 'Windows 11 Pro', 1),
  ('software', 'Editor', 'VS Code', 2),
  ('software', 'Terminal', 'Windows Terminal', 3),
  ('software', 'Browser', 'Helium', 4)
on conflict do nothing;
