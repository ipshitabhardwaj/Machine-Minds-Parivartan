-- MACHINE MINDS: reset to a clean slate
-- Deletes ALL teams, team logins, solves, submissions and hint unlocks, and puts
-- the competition back to "Not Started". Keeps your admin account and all challenges.
-- Run it after testing and before the real event. Never run it during the event.

delete from public.solves;
delete from public.submissions;
delete from public.hint_unlocks;
delete from public.team_members;

do $$
declare ids uuid[];
begin
  select array_agg(captain_id) into ids from public.teams;
  delete from public.teams;
  update public.profiles set team_id = null where team_id is not null;
  -- remove the team login accounts (their profile rows go with them)
  if ids is not null then
    delete from auth.users where id = any(ids);
  end if;
end $$;

update public.competition_settings
  set value = 'false'
  where key in ('is_active', 'is_paused', 'is_ended', 'leaderboard_frozen', 'teams_locked');

update public.competition_settings
  set value = ''
  where key in ('start_time', 'end_time', 'frozen_at');
