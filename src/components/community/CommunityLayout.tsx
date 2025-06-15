
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
  is_editing?: boolean;
  mentions?: string[];
  reply_to?: {
    id: string;
    content: string;
    user_name: string;
  };
}

interface OnlineUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'idle' | 'offline';
  last_seen?: string;
}

export function CommunityLayout() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
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
      markChannelAsRead(activeChannel);
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
            loadMessages(activeChannel);
          } else {
            // Update unread count for other channels
            updateUnreadCount(payload.new.channel_id);
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

    // Subscribe to typing indicators
    const typingChannel = supabase
      .channel(`typing-${activeChannel}`)
      .on('presence', { event: 'sync' }, () => {
        const newState = typingChannel.presenceState();
        const typingData: Record<string, string[]> = {};
        Object.entries(newState).forEach(([userId, presence]) => {
          if (presence[0]?.typing && userId !== user.id) {
            const channelId = presence[0].channel_id;
            if (!typingData[channelId]) typingData[channelId] = [];
            typingData[channelId].push(presence[0].user_name);
          }
        });
        setTypingUsers(typingData);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(reactionsChannel);
      supabase.removeChannel(typingChannel);
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
        .limit(100);

      if (error) throw error;

      // Process messages and add reactions
      const messagesWithReactions = await Promise.all((data || []).map(async (message) => {
        const { data: reactions } = await supabase
          .from('message_reactions')
          .select('emoji, user_id')
          .eq('message_id', message.id);

        const reactionCounts = reactions?.reduce((acc, reaction) => {
          if (!acc[reaction.emoji]) {
            acc[reaction.emoji] = { count: 0, users: [] };
          }
          acc[reaction.emoji].count++;
          acc[reaction.emoji].users.push(reaction.user_id);
          return acc;
        }, {} as Record<string, { count: number; users: string[] }>) || {};

        const formattedReactions = Object.entries(reactionCounts).map(([emoji, data]) => ({
          emoji,
          count: data.count,
          users: data.users
        }));

        // Process mentions
        const mentions = extractMentions(message.content);

        return {
          ...message,
          attachments: Array.isArray(message.attachments) ? message.attachments : [],
          reactions: formattedReactions,
          mentions,
          user_profile: message.user_profile && typeof message.user_profile === 'object' && 'full_name' in message.user_profile 
            ? message.user_profile as { full_name: string; avatar_url: string }
            : { full_name: 'Unknown User', avatar_url: '' }
        };
      }));

      setMessages(messagesWithReactions);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  const extractMentions = (content: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const updateUnreadCount = async (channelId: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId 
        ? { ...channel, unread_count: (channel.unread_count || 0) + 1 }
        : channel
    ));
  };

  const markChannelAsRead = async (channelId: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId 
        ? { ...channel, unread_count: 0 }
        : channel
    ));
  };

  const subscribeToMessages = (channelId: string) => {
    // This function is handled by the useEffect above
  };

  const sendMessage = async (content: string, attachments: any[] = [], replyTo?: Message) => {
    if (!user || !activeChannel || !content.trim()) return;

    try {
      const messageData: any = {
        channel_id: activeChannel,
        user_id: user.id,
        content: content.trim(),
        attachments
      };

      if (replyTo) {
        messageData.thread_id = replyTo.id;
      }

      const { error } = await supabase
        .from('messages')
        .insert(messageData);

      if (error) throw error;

      // Stop typing indicator
      await stopTyping();

      // Send notifications for mentions
      const mentions = extractMentions(content);
      if (mentions.length > 0) {
        await sendMentionNotifications(mentions, content);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const editMessage = async (messageId: string, newContent: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ 
          content: newContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message updated successfully"
      });
    } catch (error) {
      console.error('Error editing message:', error);
      toast({
        title: "Error",
        description: "Failed to edit message",
        variant: "destructive"
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_deleted: true })
        .eq('id', messageId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
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
      toast({
        title: "Error",
        description: "Failed to add reaction",
        variant: "destructive"
      });
    }
  };

  const removeReaction = async (messageId: string, emoji: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('emoji', emoji);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  };

  const toggleUpvote = async (messageId: string) => {
    if (!user) return;

    try {
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

  const startTyping = async () => {
    if (!user || !activeChannel) return;

    const channel = supabase.channel(`typing-${activeChannel}`);
    await channel.track({
      user_id: user.id,
      user_name: user.email?.split('@')[0] || 'Anonymous',
      typing: true,
      channel_id: activeChannel
    });
  };

  const stopTyping = async () => {
    if (!user || !activeChannel) return;

    const channel = supabase.channel(`typing-${activeChannel}`);
    await channel.untrack();
  };

  const sendMentionNotifications = async (mentions: string[], content: string) => {
    // This would integrate with a notification service
    console.log('Sending mention notifications:', mentions, content);
  };

  const pinMessage = async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_pinned: true })
        .eq('id', messageId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message pinned successfully"
      });
    } catch (error) {
      console.error('Error pinning message:', error);
      toast({
        title: "Error",
        description: "Failed to pin message",
        variant: "destructive"
      });
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
          typingUsers={typingUsers[activeChannel] || []}
          onSendMessage={sendMessage}
          onEditMessage={editMessage}
          onDeleteMessage={deleteMessage}
          onAddReaction={addReaction}
          onRemoveReaction={removeReaction}
          onToggleUpvote={toggleUpvote}
          onPinMessage={pinMessage}
          onStartTyping={startTyping}
          onStopTyping={stopTyping}
        />
      </div>

      {/* Right Sidebar - Online Users */}
      <div className="w-48 bg-muted/20 border-l">
        <UserList onlineUsers={onlineUsers} />
      </div>
    </div>
  );
}
