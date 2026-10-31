-- MACHINE MINDS CTF Platform — Initial Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null,
  is_admin boolean default false,
  team_id uuid,
  created_at timestamptz default now()
);

-- Teams
create table public.teams (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  invite_code text unique not null,
  captain_id uuid not null references auth.users(id),
  created_at timestamptz default now()
);

alter table public.profiles
  add constraint profiles_team_id_fkey
  foreign key (team_id) references public.teams(id) on delete set null;

-- Team members
create table public.team_members (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz default now(),
  unique(team_id, user_id),
  unique(user_id)
);

-- Challenges
create table public.challenges (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard', 'expert')),
  points integer not null check (points > 0),
  flag_hash text not null,
  hint text,
  hint_penalty integer default 0,
  attachment_url text,
  is_active boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Submissions (all attempts)
create table public.submissions (
  id uuid primary key default uuid_generate_v4(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  submitted_flag text not null,
  is_correct boolean not null default false,
  created_at timestamptz default now()
);

-- Solves (one per team per challenge)
create table public.solves (
  id uuid primary key default uuid_generate_v4(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  points_awarded integer not null,
  is_first_blood boolean default false,
  solved_at timestamptz default now(),
  unique(challenge_id, team_id)
);

-- Hint unlocks
create table public.hint_unlocks (
  id uuid primary key default uuid_generate_v4(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  unlocked_at timestamptz default now(),
  unique(challenge_id, team_id)
);

-- Competition settings (key-value store)
create table public.competition_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value text not null,
  updated_at timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_profiles_team_id on public.profiles(team_id);
create index idx_team_members_team_id on public.team_members(team_id);
create index idx_team_members_user_id on public.team_members(user_id);
create index idx_challenges_category on public.challenges(category);
create index idx_challenges_is_active on public.challenges(is_active);
create index idx_submissions_challenge_id on public.submissions(challenge_id);
create index idx_submissions_team_id on public.submissions(team_id);
create index idx_submissions_user_id on public.submissions(user_id);
create index idx_solves_challenge_id on public.solves(challenge_id);
create index idx_solves_team_id on public.solves(team_id);
create index idx_solves_solved_at on public.solves(solved_at);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.challenges enable row level security;
alter table public.submissions enable row level security;
alter table public.solves enable row level security;
alter table public.hint_unlocks enable row level security;
alter table public.competition_settings enable row level security;

-- Profiles
create policy "Profiles are viewable by authenticated users"
  on profiles for select to authenticated using (true);
create policy "Users can update own profile"
  on profiles for update to authenticated using (auth.uid() = id);
create policy "Users can insert own profile"
  on profiles for insert to authenticated with check (auth.uid() = id);

-- Teams
create policy "Teams are viewable by authenticated users"
  on teams for select to authenticated using (true);
create policy "Authenticated users can create teams"
  on teams for insert to authenticated with check (auth.uid() = captain_id);
create policy "Captains can update their team"
  on teams for update to authenticated using (auth.uid() = captain_id);

-- Team members
create policy "Team members viewable by authenticated users"
  on team_members for select to authenticated using (true);
create policy "Users can join teams"
  on team_members for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can leave teams"
  on team_members for delete to authenticated using (auth.uid() = user_id);

-- Challenges (only active ones via anon/authenticated; admin uses service role)
create policy "Active challenges viewable by authenticated users"
  on challenges for select to authenticated using (is_active = true);

-- Submissions (own team only)
create policy "Users can view own team submissions"
  on submissions for select to authenticated
  using (team_id in (select team_id from profiles where id = auth.uid()));
create policy "Users can insert submissions"
  on submissions for insert to authenticated
  with check (auth.uid() = user_id);

-- Solves (viewable by all for leaderboard)
create policy "Solves viewable by authenticated users"
  on solves for select to authenticated using (true);
create policy "System can insert solves"
  on solves for insert to authenticated
  with check (auth.uid() = user_id);

-- Hint unlocks (own team only)
create policy "Users can view own team hint unlocks"
  on hint_unlocks for select to authenticated
  using (team_id in (select team_id from profiles where id = auth.uid()));
create policy "Users can unlock hints"
  on hint_unlocks for insert to authenticated
  with check (team_id in (select team_id from profiles where id = auth.uid()));

-- Competition settings (readable by all)
create policy "Settings viewable by everyone"
  on competition_settings for select using (true);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update challenge updated_at on modification
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger challenges_updated_at
  before update on public.challenges
  for each row execute procedure public.update_updated_at();

-- ============================================================
-- DEFAULT COMPETITION SETTINGS
-- ============================================================

insert into public.competition_settings (key, value) values
  ('competition_name', 'MACHINE MINDS'),
  ('event_name', 'PARIVARTAN 2026'),
  ('flag_format', 'MM{...}'),
  ('start_time', ''),
  ('end_time', ''),
  ('is_active', 'false'),
  ('is_paused', 'false'),
  ('leaderboard_frozen', 'false'),
  ('max_team_size', '4'),
  ('min_team_size', '2'),
  ('submission_cooldown_seconds', '10');
