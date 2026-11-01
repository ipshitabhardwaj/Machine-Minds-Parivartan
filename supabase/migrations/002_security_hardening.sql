-- 002_security_hardening.sql
-- The app does ALL reads/writes server-side with the service-role key
-- (which bypasses RLS). So the browser-facing roles (anon, authenticated)
-- must not be able to write anything or read flag hashes directly via the
-- Supabase REST API using the public anon key.

-- 1. Drop every permissive write policy
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Authenticated users can create teams" on public.teams;
drop policy if exists "Captains can update their team" on public.teams;
drop policy if exists "Users can join teams" on public.team_members;
drop policy if exists "Users can leave teams" on public.team_members;
drop policy if exists "Users can insert submissions" on public.submissions;
drop policy if exists "System can insert solves" on public.solves;
drop policy if exists "Users can unlock hints" on public.hint_unlocks;

-- 2. Belt and braces: no table-level write grants for browser roles
revoke insert, update, delete, truncate on
  public.profiles, public.teams, public.team_members, public.challenges,
  public.submissions, public.solves, public.hint_unlocks,
  public.competition_settings
from anon, authenticated;

-- 3. Never let browser roles read flag hashes (or anything else on challenges;
--    the app reads challenges via the server only)
drop policy if exists "Active challenges viewable by authenticated users" on public.challenges;
revoke select on public.challenges from anon, authenticated;

-- 4. Profiles hold emails + is_admin: don't expose them to every logged-in user
drop policy if exists "Profiles are viewable by authenticated users" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select to authenticated using (auth.uid() = id);
