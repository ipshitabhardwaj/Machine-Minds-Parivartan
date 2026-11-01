-- 004_event_rules.sql
-- Align the platform with the official event rules:
-- teams of exactly 2, categories web/crypto/forensics/osint/misc.

update public.competition_settings set value = '2' where key in ('min_team_size', 'max_team_size');

update public.challenges set category = 'misc' where category in ('reverse', 'ai');
