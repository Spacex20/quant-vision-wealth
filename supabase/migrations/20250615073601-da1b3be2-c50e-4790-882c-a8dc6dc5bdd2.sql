
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'moderator', 'member', 'guest');

-- Create enum for channel types
CREATE TYPE public.channel_type AS ENUM ('text', 'voice', 'announcement');

-- Create channels table
CREATE TABLE public.channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type channel_type NOT NULL DEFAULT 'text',
  category TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_private BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  thread_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  upvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'member',
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create message reactions table
CREATE TABLE public.message_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Create bookmarks table
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, message_id)
);

-- Enable RLS on all tables
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.user_roles WHERE user_id = user_uuid),
    'guest'::user_role
  );
$$;

-- RLS Policies for channels
CREATE POLICY "Everyone can view public channels" 
  ON public.channels 
  FOR SELECT 
  USING (NOT is_private);

CREATE POLICY "Authenticated users can view private channels" 
  ON public.channels 
  FOR SELECT 
  TO authenticated
  USING (is_private);

-- RLS Policies for messages
CREATE POLICY "Everyone can view messages in public channels" 
  ON public.messages 
  FOR SELECT 
  USING (
    NOT is_deleted AND 
    EXISTS (
      SELECT 1 FROM public.channels 
      WHERE id = channel_id AND NOT is_private
    )
  );

CREATE POLICY "Authenticated users can view messages in private channels" 
  ON public.messages 
  FOR SELECT 
  TO authenticated
  USING (
    NOT is_deleted AND 
    EXISTS (
      SELECT 1 FROM public.channels 
      WHERE id = channel_id AND is_private
    )
  );

CREATE POLICY "Authenticated users can insert messages" 
  ON public.messages 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages" 
  ON public.messages 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins and mods can update any message" 
  ON public.messages 
  FOR UPDATE 
  TO authenticated
  USING (public.get_user_role(auth.uid()) IN ('admin', 'moderator'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" 
  ON public.user_roles 
  FOR ALL 
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for message_reactions
CREATE POLICY "Everyone can view reactions" 
  ON public.message_reactions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage their reactions" 
  ON public.message_reactions 
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for bookmarks
CREATE POLICY "Users can manage their own bookmarks" 
  ON public.bookmarks 
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default channels
INSERT INTO public.channels (name, description, category, position) VALUES
  ('general', 'General discussion about investing', 'Community', 0),
  ('strategy-sharing', 'Share your investment strategies', 'Community', 1),
  ('market-news', 'Latest market news and updates', 'Market', 2),
  ('ask-an-expert', 'Get advice from experienced investors', 'Help', 3),
  ('feedback', 'App feedback and suggestions', 'Meta', 4);

-- Enable realtime for messages
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Enable realtime for reactions
ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON public.channels FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
