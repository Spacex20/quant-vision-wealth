import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Hash } from "lucide-react";
import { ServerStrategyShares } from "./ServerStrategyShares";
import { ServerMembers } from "./ServerMembers";
import { ServerChannelChat } from "./ServerChannelChat";
import { ServerAboutPanel } from "./ServerAboutPanel";

export function ServerDashboard({ serverId, onRefreshSidebar }: { serverId: string, onRefreshSidebar: () => void }) {
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [serverMetadata, setServerMetadata] = useState<any>(null);

  // Load channels for this server
  useEffect(() => {
    async function fetchChannels() {
      const { data } = await supabase
        .from("investment_server_channels")
        .select("*")
        .eq("server_id", serverId)
        .order("position");
      setChannels(data || []);
      if (data?.length && !selectedChannelId) {
        setSelectedChannelId(data[0].id);
      }
    }
    fetchChannels();
  }, [serverId]);

  // Fetch server meta (for guidelines, rules, etc)
  useEffect(() => {
    async function fetchMeta() {
      const { data } = await supabase
        .from("investment_servers")
        .select("*")
        .eq("id", serverId)
        .maybeSingle();
      setServerMetadata(data || null);
    }
    fetchMeta();
  }, [serverId, onRefreshSidebar]);

  return (
    <div className="flex h-full">
      {/* Channel list */}
      <div className="w-56 border-r bg-muted/10 p-2 flex flex-col">
        <h4 className="font-semibold text-xs mb-2">Channels</h4>
        {channels.length === 0 && <div className="text-xs text-muted-foreground mb-2">No channels yet.</div>}
        {channels.map(channel => (
          <Button
            key={channel.id}
            variant={selectedChannelId === channel.id ? "secondary" : "ghost"}
            className="w-full justify-start text-xs mb-1"
            onClick={() => setSelectedChannelId(channel.id)}
          >
            <Hash className="w-4 h-4 mr-1" /> {channel.name}
          </Button>
        ))}
        {/* Channels could be created by admins later */}
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full">
        {selectedChannelId ? (
          <ServerChannelChat channelId={selectedChannelId} serverId={serverId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">Select a channel</div>
        )}
      </div>
      {/* Right sidebar */}
      <div className="w-64 border-l bg-muted/5 flex flex-col p-2 gap-3">
        <ServerAboutPanel server={serverMetadata} />
        <ServerMembers serverId={serverId} onChange={onRefreshSidebar} />
        <hr className="my-2" />
        <ServerStrategyShares serverId={serverId} />
      </div>
    </div>
  );
}
