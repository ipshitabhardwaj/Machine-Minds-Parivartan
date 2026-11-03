-- Keep each team's issued password so organisers can read it out / print slips.
-- Supabase Auth only stores a hash, so the plain value is kept here.
-- Browser roles cannot read this column (column-level grants from 005 apply);
-- only the server (service role) can.
alter table public.teams add column if not exists login_password text;
revoke select (login_password) on public.teams from anon, authenticated;
