
-- Create main Investment Server table
create table public.investment_servers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by uuid not null references profiles(id) on delete cascade,
  icon_url text,
  color text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Channels per server (text channels)
create table public.investment_server_channels (
  id uuid primary key default gen_random_uuid(),
  server_id uuid not null references investment_servers(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  position integer not null default 0
);

-- Membership table (role = admin, moderator, member, request_pending)
create table public.investment_server_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  server_id uuid not null references investment_servers(id) on delete cascade,
  role text not null default 'member', -- admin, moderator, member, request_pending
  joined_at timestamptz not null default now(),
  unique (user_id, server_id)
);

-- Channel messages (live chat, threads, etc)
create table public.investment_server_messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references investment_server_channels(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  attachments jsonb,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Strategy sharing (linked to strategies table, shared by user in server)
create table public.investment_server_strategy_shares (
  id uuid primary key default gen_random_uuid(),
  server_id uuid not null references investment_servers(id) on delete cascade,
  strategy_id uuid not null references trading_strategies(id) on delete cascade,
  shared_by uuid not null references profiles(id) on delete cascade,
  description text,
  performance jsonb,
  tags text[],
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.investment_servers enable row level security;
alter table public.investment_server_channels enable row level security;
alter table public.investment_server_memberships enable row level security;
alter table public.investment_server_messages enable row level security;
alter table public.investment_server_strategy_shares enable row level security;

-- Public servers - anyone can view, only members can post/join
create policy "Anyone can view public servers" on public.investment_servers for select using (is_public or exists (
  select 1 from public.investment_server_memberships m where m.server_id = id and m.user_id = auth.uid()
));
create policy "Admins can update their server" on public.investment_servers for update using (created_by = auth.uid());
create policy "Admins can delete server" on public.investment_servers for delete using (created_by = auth.uid());
create policy "Any authenticated user can create server" on public.investment_servers for insert with check (auth.uid() = created_by);

-- Only members can see or join channels
create policy "Server members can view channels" on public.investment_server_channels for select using (
  exists (select 1 from public.investment_server_memberships m where m.server_id = server_id and m.user_id = auth.uid())
);
create policy "Admins can create channels" on public.investment_server_channels for insert with check (
  exists (
    select 1 from public.investment_server_memberships m
    where m.server_id = server_id and m.user_id = auth.uid() and m.role = 'admin'
  )
);

-- Only members can write messages, all members can read
create policy "Server members can view messages" on public.investment_server_messages for select using (
  exists (
    select 1 from public.investment_server_channels ch
    join public.investment_server_memberships m on ch.server_id = m.server_id
    where ch.id = channel_id and m.user_id = auth.uid()
  )
);
create policy "Server members can send messages" on public.investment_server_messages for insert with check (
  exists (
    select 1 from public.investment_server_channels ch
    join public.investment_server_memberships m on ch.server_id = m.server_id
    where ch.id = channel_id and m.user_id = auth.uid()
  ) and user_id = auth.uid()
);

-- Membership policy (only current user can see/join/leave their servers)
create policy "User can view/join/leave memberships" on public.investment_server_memberships for all using (
  user_id = auth.uid()
) with check (user_id = auth.uid());

-- Share strategies policy
create policy "Server members can share strategies" on public.investment_server_strategy_shares for insert with check (
  exists (
    select 1 from public.investment_server_memberships m
    where m.server_id = server_id and m.user_id = auth.uid()
  ) and shared_by = auth.uid()
);
create policy "Server members can view shared strategies" on public.investment_server_strategy_shares for select using (
  exists (
    select 1 from public.investment_server_memberships m
    where m.server_id = server_id and m.user_id = auth.uid()
  )
);

-- Anyone can view strategies in public servers
create policy "Anyone can view strategies in public servers" on public.investment_server_strategy_shares for select using (
  exists (
    select 1 from public.investment_servers s where s.id = server_id and s.is_public
  )
);
