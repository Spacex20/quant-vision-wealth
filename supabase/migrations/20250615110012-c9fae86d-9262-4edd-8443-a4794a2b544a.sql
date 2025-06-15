
-- 1. Extend `channels` table for DMs, private, and group chats
ALTER TABLE public.channels
  ADD COLUMN IF NOT EXISTS is_dm boolean NOT NULL DEFAULT false;

-- 2. Channel membership table: tracks users in channels (inc. private/invite)
CREATE TABLE IF NOT EXISTS public.channel_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  role text NOT NULL DEFAULT 'member'
);

-- Unique channel-user pair (1 user can't join twice)
CREATE UNIQUE INDEX IF NOT EXISTS idx_channel_user ON public.channel_memberships(channel_id, user_id);

-- Enable RLS and policies: only members can SELECT/INSERT/DELETE on their own memberships
ALTER TABLE public.channel_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own channel memberships"
  ON public.channel_memberships
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Can join channels for self"
  ON public.channel_memberships
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Can leave channels for self"
  ON public.channel_memberships
  FOR DELETE
  USING (user_id = auth.uid());

-- 3. Channel invites (for private/invite channels)
CREATE TABLE IF NOT EXISTS public.channel_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  inviter_id uuid NOT NULL,
  invitee_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' -- pending/accepted/rejected
);

ALTER TABLE public.channel_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View received invites"
  ON public.channel_invites
  FOR SELECT
  USING (invitee_id = auth.uid());

CREATE POLICY "Send invite for self"
  ON public.channel_invites
  FOR INSERT
  WITH CHECK (inviter_id = auth.uid());

CREATE POLICY "Respond to own invites"
  ON public.channel_invites
  FOR UPDATE
  USING (invitee_id = auth.uid());

-- 4. Message seen/read tracking
CREATE TABLE IF NOT EXISTS public.message_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  seen_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Only users can mark messages as read for themselves
ALTER TABLE public.message_reads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Can read own"
  ON public.message_reads
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Can mark messages as read"
  ON public.message_reads
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 5. Message file attachments (Supabase Storage recommended, make attachment URLs in messages JSON)

-- 6. Add moderator/admin roles to channel_memberships (role field already present).

-- 7. Improve RLS on channels: Only members of private channels, DMs can SELECT.
-- For public channels, allow all authenticated; for private, allow only members.

ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Can view public channels"
  ON public.channels
  FOR SELECT
  USING (is_private = false OR EXISTS (
    SELECT 1 FROM public.channel_memberships
    WHERE channel_id = id AND user_id = auth.uid()
  ));

CREATE POLICY "Join channel for self/user"
  ON public.channels
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.channel_memberships
      WHERE channel_id = id AND user_id = auth.uid()
    )
  );

-- 8. DMs: For DM channels, only allow users in memberships table to view.
CREATE POLICY "View own DMs"
  ON public.channels
  FOR SELECT
  USING (
    is_dm = false
    OR EXISTS (
      SELECT 1 FROM public.channel_memberships
      WHERE channel_id = id AND user_id = auth.uid()
    )
  );
