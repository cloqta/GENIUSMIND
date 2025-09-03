-- Enable Row Level Security
alter table public.events enable row level security;
alter table public.categories enable row level security;

-- Events policies
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'events' and policyname = 'Events readable by owner'
  ) then
    create policy "Events readable by owner"
      on public.events
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'events' and policyname = 'Insert allowed for owner'
  ) then
    create policy "Insert allowed for owner"
      on public.events
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'events' and policyname = 'Update allowed for owner'
  ) then
    create policy "Update allowed for owner"
      on public.events
      for update
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'events' and policyname = 'Delete allowed for owner'
  ) then
    create policy "Delete allowed for owner"
      on public.events
      for delete
      using (auth.uid() = user_id);
  end if;
end $$;

-- Categories policies
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'categories' and policyname = 'Categories readable by owner'
  ) then
    create policy "Categories readable by owner"
      on public.categories
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'categories' and policyname = 'Insert categories for owner'
  ) then
    create policy "Insert categories for owner"
      on public.categories
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'categories' and policyname = 'Update categories for owner'
  ) then
    create policy "Update categories for owner"
      on public.categories
      for update
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'categories' and policyname = 'Delete categories for owner'
  ) then
    create policy "Delete categories for owner"
      on public.categories
      for delete
      using (auth.uid() = user_id);
  end if;
end $$;
