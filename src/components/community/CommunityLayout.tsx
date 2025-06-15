
import { useState, useEffect } from "react";
import { ChannelSidebar } from "./ChannelSidebar";
import { ChatPanel } from "./ChatPanel";
import { UserList } from "./UserList";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Channel {
  id: string;
  name: string;
  description: string;
  category: string;
  position: number;
  is_private: boolean;
  unread_count?: number;
}

interface Message {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  attachments: any[];
  thread_id?: string;
  is_pinned: boolean;
  upvotes: number;
  created_at: string;
  user_profile?: {
    full_name: string;
    avatar_url: string;
  };
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
}

export function CommunityLayout() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load channels on mount
  useEffect(() => {
    loadChannels();
  }, []);

  // Load messages when channel changes
  useEffect(() => {
    if (activeChannel) {
      loadMessages(activeChannel);
      subscribeToMessages(activeChannel);
    }
  }, [activeChannel]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('community-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          if (payload.new.channel_id === activeChannel) {
            loadMessages(activeChannel); // Reload to get user profile data
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          if (payload.new.channel_id === activeChannel) {
            loadMessages(activeChannel);
          }
        }
      )
      .subscribe();

    // Subscribe to reactions
    const reactionsChannel = supabase
      .channel('community-reactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions'
        },
        () => {
          if (activeChannel) {
            loadMessages(activeChannel);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(reactionsChannel);
    };
  }, [activeChannel, user]);

  const loadChannels = async () => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('position');

      if (error) throw error;

      setChannels(data || []);
      if (data && data.length > 0 && !activeChannel) {
        setActiveChannel(data[0].id);
      }
    } catch (error) {
      console.error('Error loading channels:', error);
      toast({
        title: "Error",
        description: "Failed to load channels",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (channelId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          user_profile:profiles(full_name, avatar_url)
        `)
        .eq('channel_id', channelId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      // Group reactions by message
      const messagesWithReactions = await Promise.all((data || []).map(async (message) => {
        const { data: reactions } = await supabase
          .from('message_reactions')
          .select('emoji')
          .eq('message_id', message.id);

        const reactionCounts = reactions?.reduce((acc, reaction) => {
          acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        const formattedReactions = Object.entries(reactionCounts).map(([emoji, count]) => ({
          emoji,
          count,
          users: [] // We could expand this to show who reacted
        }));

        return {
          ...message,
          reactions: formattedReactions
        };
      }));

      setMessages(messagesWithReactions);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const subscribeToMessages = (channelId: string) => {
    // This function is handled by the useEffect above
  };

  const sendMessage = async (content: string, attachments: any[] = []) => {
    if (!user || !activeChannel || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          channel_id: activeChannel,
          user_id: user.id,
          content: content.trim(),
          attachments
        });

      if (error) throw error;

      // Message will be added via real-time subscription
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('message_reactions')
        .upsert({
          message_id: messageId,
          user_id: user.id,
          emoji
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const toggleUpvote = async (messageId: string) => {
    if (!user) return;

    try {
      // Get current message
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const { error } = await supabase
        .from('messages')
        .update({ upvotes: message.upvotes + 1 })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling upvote:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] bg-background border rounded-lg overflow-hidden">
      {/* Left Sidebar - Channels */}
      <div className="w-64 bg-muted/30 border-r">
        <ChannelSidebar
          channels={channels}
          activeChannel={activeChannel}
          onChannelSelect={setActiveChannel}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatPanel
          channelId={activeChannel}
          messages={messages}
          onSendMessage={sendMessage}
          onAddReaction={addReaction}
          onToggleUpvote={toggleUpvote}
        />
      </div>

      {/* Right Sidebar - Online Users */}
      <div className="w-48 bg-muted/20 border-l">
        <UserList onlineUsers={onlineUsers} />
      </div>
    </div>
  );
}
