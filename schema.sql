-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Crops Table (Album Covers)
create table crops (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  emoji text default '🌱',
  created_at timestamptz default now()
);

-- 2. Create Cultivation Logs Table (Diary Pages)
create table cultivation_logs (
  id uuid primary key default uuid_generate_v4(),
  crop_id uuid references crops(id) on delete cascade not null,
  log_date date default current_date,
  photo_url text,
  weather text,
  temperature numeric,
  is_watered boolean default false,
  notes text,
  created_at timestamptz default now()
);

-- 3. Enable RLS (Row Level Security) - The "AI Doorman"
alter table crops enable row level security;
alter table cultivation_logs enable row level security;

-- 4. Create Security Policies
-- Policy: Users can only see/edit their own crops
create policy "Users can manage their own crops"
on crops for all
using (auth.uid() = user_id);

-- Policy: Users can only see/edit logs of crops they own
-- (Note: Simpler to check crop ownership, but direct user_id check is unavailable in logs table. 
--  Correct approach: Join or check via crop_id. efficient RLS often duplicates user_id or uses exists. 
--  For simplicity/security: Add user_id to logs OR use exists clause.)

-- Let's add user_id to logs for easier RLS (Performance optimization)
alter table cultivation_logs add column user_id uuid references auth.users default auth.uid();
-- Update existing rows if any (none yet)

create policy "Users can manage their own logs"
on cultivation_logs for all
using (auth.uid() = user_id);


-- 5. Storage Bucket (Photo Album)
-- Note: Running this might fail if bucket exists. Ignore if error.
insert into storage.buckets (id, name, public) 
values ('crop_images', 'crop_images', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'crop_images' );

create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check ( bucket_id = 'crop_images' AND auth.uid() = owner );

create policy "Anyone can update their own avatar"
  on storage.objects for update
  using ( bucket_id = 'crop_images' AND auth.uid() = owner );
