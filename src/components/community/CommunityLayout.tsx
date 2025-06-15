import { useState, useEffect } from "react";
import { ChannelSidebar } from "./ChannelSidebar";
import ChatPanel from "./ChatPanel";
import { UserList } from "./UserList";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useInfiniteMessages } from "@/hooks/useInfiniteMessages";
import { useChannelMemberships } from "@/hooks/useChannelMemberships";

export function CommunityLayout() {
  const [channels, setChannels] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => { loadChannels(); }, []);

  const loadChannels = async () => {
    try {
      const { data, error } = await supabase
        .from("channels")
        .select("*")
        .order("position");
      if (error) throw error;
      setChannels(data || []);
      if (data && data.length > 0 && !activeChannel) setActiveChannel(data[0].id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load channels",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get channel memberships (for joining/leaving, permissions, etc)
  const { memberships } = useChannelMemberships();

  // Get paginated/infinite messages for the active channel
  const { messages, loading: messagesLoading, hasMore, loadMore } = useInfiniteMessages(activeChannel);

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
          loadChannels={loadChannels}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatPanel
          channelId={activeChannel}
          messages={messages}
          hasMore={hasMore}
          loadMore={loadMore}
          memberships={memberships}
          reloadChannels={loadChannels}
        />
      </div>

      {/* Right Sidebar - Online Users */}
      <div className="w-48 bg-muted/20 border-l">
        <UserList channelId={activeChannel} />
      </div>
    </div>
  );
}
