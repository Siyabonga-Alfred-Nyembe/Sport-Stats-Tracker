-- Complete Database Schema for Sport Stats Tracker
-- Includes all existing tables plus the new lineups table

-- Drop in dependency order (safe if first run)
drop table if exists lineups cascade;
drop table if exists match_events cascade;
drop table if exists matches cascade;
drop table if exists players cascade;
drop table if exists teams cascade;
drop table if exists user_profiles cascade;

-- TEAMS
create table teams (
  id text primary key,              -- slug (e.g., 'kaizer_chiefs')
  name text not null,
  coach_id text,
  logo_url text,
  created_at timestamptz default now()
);

-- PLAYERS
create table players (
  id uuid primary key default gen_random_uuid(),
  team_id text not null references teams(id) on delete cascade,
  name text not null,
  position text,
  jersey_num text,
  image_url text,
  created_at timestamptz default now()
);

-- MATCHES
create table matches (
  id uuid primary key default gen_random_uuid(),
  team_id text not null references teams(id) on delete cascade,
  opponent_name text not null,
  team_score integer not null default 0,
  opponent_score integer not null default 0,
  date date not null,
  status text check (status in ('scheduled', 'completed')) default 'scheduled',

  -- Team stats
  possession integer check (possession between 0 and 100),
  shots integer check (shots >= 0),
  shots_on_target integer check (shots_on_target >= 0),
  corners integer check (corners >= 0),
  fouls integer check (fouls >= 0),
  offsides integer check (offsides >= 0),
  xg numeric(4,2) check (xg >= 0),
  passes integer check (passes >= 0),
  pass_accuracy integer check (pass_accuracy between 0 and 100),
  tackles integer check (tackles >= 0),
  saves integer check (saves >= 0),

  created_at timestamptz default now()
);

-- MATCH EVENTS
create table match_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  event_type text check (event_type in ('goal', 'assist', 'yellow_card', 'red_card')) not null,
  minute integer check (minute between 0 and 120),
  created_at timestamptz default now()
);

-- LINEUPS (NEW TABLE)
create table lineups (
  id uuid primary key default gen_random_uuid(),
  team_id text not null references teams(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  position_x decimal(5,2) not null default 50.00, -- X coordinate on field (0-100)
  position_y decimal(5,2) not null default 50.00, -- Y coordinate on field (0-100)
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Ensure unique player per team (one player can only be in one lineup per team)
  unique(team_id, player_id)
);

-- USER PROFILES (for profile settings and avatar)
create table user_profiles (
  id uuid primary key,              -- should match auth.users.id
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Indexes
create index idx_matches_team_id on matches(team_id);
create index idx_players_team_id on players(team_id);
create index idx_match_events_match_id on match_events(match_id);
create index idx_lineups_team_id on lineups(team_id);
create index idx_lineups_player_id on lineups(player_id);

-- Create trigger to update the updated_at timestamp for lineups
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_lineups_updated_at 
    before update on lineups 
    for each row 
    execute function update_updated_at_column();

-- Enable RLS
alter table teams enable row level security;
alter table players enable row level security;
alter table matches enable row level security;
alter table match_events enable row level security;
alter table lineups enable row level security;
alter table user_profiles enable row level security;

-- Open policies (public role) for quick development; relax later if needed
-- TEAMS
create policy teams_select_public on teams for select to public using (true);
create policy teams_insert_public on teams for insert to public with check (true);
create policy teams_update_public on teams for update to public using (true) with check (true);
create policy teams_delete_public on teams for delete to public using (true);

-- PLAYERS
create policy players_select_public on players for select to public using (true);
create policy players_insert_public on players for insert to public with check (true);
create policy players_update_public on players for update to public using (true) with check (true);
create policy players_delete_public on players for delete to public using (true);

-- MATCHES
create policy matches_select_public on matches for select to public using (true);
create policy matches_insert_public on matches for insert to public with check (true);
create policy matches_update_public on matches for update to public using (true) with check (true);
create policy matches_delete_public on matches for delete to public using (true);

-- MATCH EVENTS
create policy events_select_public on match_events for select to public using (true);
create policy events_insert_public on match_events for insert to public with check (true);
create policy events_update_public on match_events for update to public using (true) with check (true);
create policy events_delete_public on match_events for delete to public using (true);

-- LINEUPS
create policy lineups_select_public on lineups for select to public using (true);
create policy lineups_insert_public on lineups for insert to public with check (true);
create policy lineups_update_public on lineups for update to public using (true) with check (true);
create policy lineups_delete_public on lineups for delete to public using (true);

-- USER PROFILES (open; tighten later to authenticated/jwt id match)
create policy profiles_select_public on user_profiles for select to public using (true);
create policy profiles_insert_public on user_profiles for insert to public with check (true);
create policy profiles_update_public on user_profiles for update to public using (true) with check (true);
create policy profiles_delete_public on user_profiles for delete to public using (true);
