
-- Add 'category_tags', 'rules', 'guidelines', 'visibility', and 'icon_url' to investment_servers
alter table public.investment_servers add column if not exists category_tags text[];
alter table public.investment_servers add column if not exists rules text;
alter table public.investment_servers add column if not exists guidelines text;
alter table public.investment_servers add column if not exists visibility text not null default 'public';

-- Update 'investment_server_memberships' for more role options
alter table public.investment_server_memberships alter column role set default 'member';
-- Add 'banned' status
alter table public.investment_server_memberships add column if not exists is_banned boolean not null default false;

-- Channel types
alter table public.investment_server_channels add column if not exists type text not null default 'text';

-- Events Table
create table if not exists public.investment_server_events (
  id uuid primary key default gen_random_uuid(),
  server_id uuid not null references investment_servers(id) on delete cascade,
  created_by uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Announcements Table
create table if not exists public.investment_server_announcements (
  id uuid primary key default gen_random_uuid(),
  server_id uuid not null references investment_servers(id) on delete cascade,
  created_by uuid not null references profiles(id) on delete cascade,
  content text not null,
  banner_url text,
  created_at timestamptz not null default now()
);

-- Message Reactions Table
create table if not exists public.investment_server_message_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references investment_server_messages(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now()
);

-- Pins
alter table public.investment_server_messages add column if not exists is_pinned boolean not null default false;

-- Mentions: Add '@mentions' storage
alter table public.investment_server_messages add column if not exists mentions_user uuid[];
alter table public.investment_server_messages add column if not exists mentions_channel uuid[];

-- Audit Log Table
create table if not exists public.investment_server_audit_logs (
  id uuid primary key default gen_random_uuid(),
  server_id uuid not null references investment_servers(id) on delete cascade,
  action text not null,
  performed_by uuid references profiles(id),
  details jsonb,
  created_at timestamptz not null default now()
);

-- Server Discovery and Notification Subscriptions
create table if not exists public.investment_server_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  server_id uuid not null references investment_servers(id) on delete cascade,
  notification_types text[],
  tag_alerts text[]
);

-- Moderate policy upgrades
-- Allow admins/mods extra actions (kicking, banning, audit)
-- Only server admins/moderators can update/delete or ban/kick
create policy "Admins and mods can manage memberships" on public.investment_server_memberships for update using (
  exists (
    select 1 from public.investment_server_memberships m
    where m.server_id = server_id and m.user_id = auth.uid() and m.role in ('admin','moderator')
  )
);

-- Events/Announce/Audit RLS
alter table public.investment_server_events enable row level security;
alter table public.investment_server_announcements enable row level security;
alter table public.investment_server_audit_logs enable row level security;
alter table public.investment_server_message_reactions enable row level security;
alter table public.investment_server_subscriptions enable row level security;

create policy "Server members can view events" on public.investment_server_events for select using (
  exists (select 1 from public.investment_server_memberships m where m.server_id = server_id and m.user_id = auth.uid())
);

create policy "Server members can view announcements" on public.investment_server_announcements for select using (
  exists (select 1 from public.investment_server_memberships m where m.server_id = server_id and m.user_id = auth.uid())
);

create policy "Server members can add reactions" on public.investment_server_message_reactions for insert with check (
  exists (
    select 1 from public.investment_server_memberships m
    join investment_server_messages msg on msg.id = message_id
    join investment_server_channels ch on ch.id = msg.channel_id
    where m.user_id = auth.uid() and ch.server_id = m.server_id
  )
);

create policy "Audit log select (admins only)" on public.investment_server_audit_logs for select using (
  exists (
    select 1 from public.investment_server_memberships m where m.server_id = server_id and m.user_id = auth.uid() and m.role = 'admin'
  )
);

create policy "Allow users to subscribe" on public.investment_server_subscriptions for all using (
  user_id = auth.uid()
) with check (user_id = auth.uid());

-- (Expand other policies as table size grows)
