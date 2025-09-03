-- Enable UUID if needed (Supabase usually has gen_random_uuid)
create extension if not exists "uuid-ossp";

-- Basic profiles table (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamp with time zone default now()
);

-- Categories table (fixed set but manageable)
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null, -- 'email', 'social', ...
  name text not null,
  color text not null,
  created_at timestamp with time zone default now()
);

-- Events table
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  category_id uuid references public.categories(id) on delete set null,
  campaign_type text check (campaign_type in ('email','social','content','ads','events','analytics')) not null,
  status text check (status in ('planned','in_progress','completed','cancelled')) not null default 'planned',
  priority text check (priority in ('low','medium','high','urgent')) not null default 'medium',
  budget numeric,
  is_all_day boolean not null default false,
  is_shared boolean not null default false, -- shared across users (team-lite)
  recurrence text check (recurrence in ('none','daily','weekly','monthly')) not null default 'none',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists events_user_time_idx on public.events(user_id, start_time);
create index if not exists events_category_idx on public.events(category_id);

-- RLS
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.categories enable row level security;
