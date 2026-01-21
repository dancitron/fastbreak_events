-- Fastbreak Event Dashboard - Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Sport types enum
create type sport_type as enum (
  'soccer',
  'basketball',
  'tennis',
  'baseball',
  'football',
  'hockey',
  'volleyball',
  'golf',
  'swimming',
  'other'
);

-- Venues table
create table venues (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  address text,
  city text,
  state text,
  zip_code text,
  capacity integer,
  supported_sports sport_type[] default '{}',
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Events table
create table events (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  sport_type sport_type not null,
  date_time timestamp with time zone not null,
  description text,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Event-Venues junction table (many-to-many)
create table event_venues (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events(id) on delete cascade not null,
  venue_id uuid references venues(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(event_id, venue_id)
);

-- Row Level Security (RLS)
alter table venues enable row level security;
alter table events enable row level security;
alter table event_venues enable row level security;

-- Policies: Users can only access their own data
create policy "Users can view own venues" on venues for select using (auth.uid() = user_id);
create policy "Users can create own venues" on venues for insert with check (auth.uid() = user_id);
create policy "Users can update own venues" on venues for update using (auth.uid() = user_id);
create policy "Users can delete own venues" on venues for delete using (auth.uid() = user_id);

create policy "Users can view own events" on events for select using (auth.uid() = user_id);
create policy "Users can create own events" on events for insert with check (auth.uid() = user_id);
create policy "Users can update own events" on events for update using (auth.uid() = user_id);
create policy "Users can delete own events" on events for delete using (auth.uid() = user_id);

create policy "Users can view own event_venues" on event_venues for select
  using (exists (select 1 from events where events.id = event_venues.event_id and events.user_id = auth.uid()));
create policy "Users can create own event_venues" on event_venues for insert
  with check (exists (select 1 from events where events.id = event_venues.event_id and events.user_id = auth.uid()));
create policy "Users can delete own event_venues" on event_venues for delete
  using (exists (select 1 from events where events.id = event_venues.event_id and events.user_id = auth.uid()));

-- Indexes for performance
create index idx_events_user_id on events(user_id);
create index idx_events_sport_type on events(sport_type);
create index idx_events_date_time on events(date_time);
create index idx_venues_user_id on venues(user_id);
create index idx_event_venues_event_id on event_venues(event_id);
create index idx_event_venues_venue_id on event_venues(venue_id);