-- 003_event_controls.sql
-- College field for multi-college events + extra competition controls.

alter table public.profiles add column if not exists college text;

-- Recreate the signup trigger so it also stores the college
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, college)
  values (
    new.id,
    new.email,
    left(coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)), 30),
    nullif(left(trim(coalesce(new.raw_user_meta_data->>'college', '')), 80), '')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- New settings (safe to re-run)
insert into public.competition_settings (key, value) values
  ('is_ended', 'false'),
  ('teams_locked', 'false'),
  ('frozen_at', '')
on conflict (key) do nothing;
