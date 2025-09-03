-- Profiles: user can read/update own profile
create policy if not exists "profiles_self_select"
on public.profiles for select
using (auth.uid() = id);

create policy if not exists "profiles_self_upsert"
on public.profiles for insert
with check (auth.uid() = id);

create policy if not exists "profiles_self_update"
on public.profiles for update
using (auth.uid() = id);

-- Categories: anyone authenticated can read
create policy if not exists "categories_read_all"
on public.categories for select
using (auth.role() = 'authenticated');

-- Events: read own or shared
create policy if not exists "events_read_own_or_shared"
on public.events for select
using (
  (user_id = auth.uid()) or (is_shared = true)
);

-- Events: insert by authenticated user; assign user_id = auth.uid() if null
create policy if not exists "events_insert_self"
on public.events for insert
with check (auth.uid() is not null);

-- Events: update if owner or shared (any authenticated can update shared for simplicity)
create policy if not exists "events_update_owner_or_shared"
on public.events for update
using ((user_id = auth.uid()) or (is_shared = true));

-- Events: delete if owner
create policy if not exists "events_delete_owner"
on public.events for delete
using (user_id = auth.uid());
