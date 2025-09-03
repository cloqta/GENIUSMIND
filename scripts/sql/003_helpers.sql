-- Events default user_id
create or replace function public.events_default_user_id()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.user_id is null then
    new.user_id = auth.uid();
  end if;
  return new;
end; $$;

drop trigger if exists trg_events_default_user on public.events;
create trigger trg_events_default_user
before insert on public.events
for each row execute function public.events_default_user_id();

-- Categories default user_id
create or replace function public.categories_default_user_id()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.user_id is null then
    new.user_id = auth.uid();
  end if;
  return new;
end; $$;

drop trigger if exists trg_categories_default_user on public.categories;
create trigger trg_categories_default_user
before insert on public.categories
for each row execute function public.categories_default_user_id();
