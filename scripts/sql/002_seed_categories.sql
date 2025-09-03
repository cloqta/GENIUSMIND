insert into public.categories (key, name, color)
values
  ('email', 'Email Marketing', '#EF4444'),
  ('social', 'Social Media', '#3B82F6'),
  ('content', 'Content Creation', '#10B981'),
  ('ads', 'Advertising', '#F59E0B'),
  ('events', 'Events', '#8B5CF6'),
  ('analytics', 'Analytics', '#6B7280')
on conflict (key) do update set
  name = excluded.name,
  color = excluded.color;
