
-- USER FOLLOWS TABLE
create table if not exists public.followers (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references profiles(id) on delete cascade,
  followed_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (follower_id, followed_id)
);

-- STRATEGY CLONE LOG/AUDIT
create table if not exists public.strategy_clones (
  id uuid primary key default gen_random_uuid(),
  strategy_id uuid not null references trading_strategies(id) on delete cascade,
  cloned_by uuid not null references profiles(id) on delete cascade,
  original_owner uuid references profiles(id),
  cloned_from_id uuid references strategy_clones(id), -- allow chain-of-clones
  name text,
  note text,
  created_at timestamptz not null default now()
);

-- ACTIVITY FEED (posts, performance, clones, comments, etc)
create table if not exists public.activity_feed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null, -- e.g. "clone", "performance", "post", "comment", "milestone"
  strategy_id uuid references trading_strategies(id) on delete set null,
  referenced_user uuid references profiles(id) on delete set null, -- e.g. for follows, mentions
  content text,
  data jsonb, -- flexible
  created_at timestamptz not null default now()
);

-- STRATEGY REACTIONS (upvotes/likes on strategies or feed items)
create table if not exists public.strategy_reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  strategy_id uuid references trading_strategies(id) on delete cascade,
  feed_id uuid references activity_feed(id) on delete cascade,
  type text not null, -- e.g. "upvote", "star"
  created_at timestamptz not null default now()
);

-- COMMENTS ON FEED/STRATEGIES
create table if not exists public.strategy_comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  strategy_id uuid references trading_strategies(id) on delete cascade,
  feed_id uuid references activity_feed(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- PERFORMANCE SNAPSHOTS (historical daily/weekly performance for leaderboard/graphs)
create table if not exists public.performance_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  strategy_id uuid references trading_strategies(id) on delete cascade,
  returns numeric,
  volatility numeric,
  drawdown numeric,
  sharpe_ratio numeric,
  snapshot_at timestamptz not null default now()
);

-- Add 'is_curated_trader', 'bio', 'social_links' to profiles for "top traders"
alter table public.profiles add column if not exists is_curated_trader boolean not null default false;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists social_links jsonb;

-- Permissions
alter table public.followers enable row level security;
alter table public.strategy_clones enable row level security;
alter table public.activity_feed enable row level security;
alter table public.strategy_reactions enable row level security;
alter table public.strategy_comments enable row level security;
alter table public.performance_snapshots enable row level security;

-- RLS policies
create policy "user can follow/unfollow" on public.followers for all using (follower_id = auth.uid() or followed_id = auth.uid());
create policy "user can clone strategies" on public.strategy_clones for all using (cloned_by = auth.uid());
create policy "can see activity" on public.activity_feed for select using (true);
create policy "user can post/feed" on public.activity_feed for insert with check (user_id = auth.uid());
create policy "reactions owner" on public.strategy_reactions for all using (user_id = auth.uid());
create policy "comments owner" on public.strategy_comments for all using (user_id = auth.uid());
create policy "can see perf" on public.performance_snapshots for select using (true);

-- Make strategies public/private/clone-only
alter table public.trading_strategies add column if not exists visibility text not null default 'public';

-- Add clones counter, upvotes counter
alter table public.trading_strategies add column if not exists clones_count integer not null default 0;
alter table public.trading_strategies add column if not exists upvotes_count integer not null default 0;
