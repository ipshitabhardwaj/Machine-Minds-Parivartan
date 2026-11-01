-- 005_team_accounts.sql
-- Teams are provisioned by the organisers (CSV import or manual add).
-- Each team has ONE login: Team ID (MM-001, MM-002, ...) + generated password.

alter table public.teams
  add column if not exists team_code text unique,
  add column if not exists member1_name text,
  add column if not exists member2_name text,
  add column if not exists member1_email text,
  add column if not exists member2_email text,
  add column if not exists college text,
  add column if not exists login_email text;

-- Student details are personal data. Browser roles (anon key) may only read
-- non-personal team columns. The app itself reads everything server-side.
revoke select on public.teams from anon, authenticated;
grant select (id, name, college, team_code, created_at) on public.teams to authenticated;
