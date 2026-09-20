-- =============================================================
-- Car Dealership Management Panel — Supabase Schema
-- Run this in: Supabase Dashboard -> SQL Editor -> New query
-- =============================================================

-- 1. CARS TABLE
create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  trim text,
  year integer not null,
  color text,
  mileage integer,
  price numeric not null,
  license_plate text,
  vin text,
  owner_name text,
  owner_phone text,
  status text not null default 'available' check (status in ('available', 'reserved', 'sold')),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. CAR IMAGES TABLE
create table if not exists public.car_images (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references public.cars(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3. INDEXES for frequently searched fields
create index if not exists idx_cars_brand on public.cars (brand);
create index if not exists idx_cars_model on public.cars (model);
create index if not exists idx_cars_year on public.cars (year);
create index if not exists idx_cars_license_plate on public.cars (license_plate);
create index if not exists idx_cars_vin on public.cars (vin);
create index if not exists idx_cars_owner_phone on public.cars (owner_phone);
create index if not exists idx_cars_status on public.cars (status);
create index if not exists idx_car_images_car_id on public.car_images (car_id);

-- 4. Keep updated_at fresh automatically
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_cars_updated_at on public.cars;
create trigger trg_cars_updated_at
  before update on public.cars
  for each row
  execute function public.set_updated_at();

-- 5. ROW LEVEL SECURITY
alter table public.cars enable row level security;
alter table public.car_images enable row level security;

-- Only authenticated users (the single dealership admin) may read/write.
drop policy if exists "Authenticated users can read cars" on public.cars;
create policy "Authenticated users can read cars"
  on public.cars for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert cars" on public.cars;
create policy "Authenticated users can insert cars"
  on public.cars for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update cars" on public.cars;
create policy "Authenticated users can update cars"
  on public.cars for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete cars" on public.cars;
create policy "Authenticated users can delete cars"
  on public.cars for delete
  to authenticated
  using (true);

drop policy if exists "Authenticated users can read car_images" on public.car_images;
create policy "Authenticated users can read car_images"
  on public.car_images for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert car_images" on public.car_images;
create policy "Authenticated users can insert car_images"
  on public.car_images for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update car_images" on public.car_images;
create policy "Authenticated users can update car_images"
  on public.car_images for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete car_images" on public.car_images;
create policy "Authenticated users can delete car_images"
  on public.car_images for delete
  to authenticated
  using (true);

-- =============================================================
-- 6. STORAGE BUCKET + POLICIES
-- Run this after creating a bucket named "car-images" from the
-- Storage section of the dashboard (Public bucket: ON), OR run
-- the insert below to create it via SQL.
-- =============================================================

insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can upload car images" on storage.objects;
create policy "Authenticated users can upload car images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'car-images');

drop policy if exists "Authenticated users can update car images" on storage.objects;
create policy "Authenticated users can update car images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'car-images');

drop policy if exists "Authenticated users can delete car images" on storage.objects;
create policy "Authenticated users can delete car images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'car-images');

-- Public read so uploaded photos display in the app via public URLs.
drop policy if exists "Public can view car images" on storage.objects;
create policy "Public can view car images"
  on storage.objects for select
  to public
  using (bucket_id = 'car-images');
