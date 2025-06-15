
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

// Compute per-channel unseen count
export function useNotificationBadge(channels: any[], activeChannel: string, messages: any[]) {
  const { user } = useAuth();
  const [unseenCounts, setUnseenCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) return setUnseenCounts({});
    const fetch = async () => {
      const res = await supabase
        .from("message_reads")
        .select("message_id, user_id, seen_at")
        .eq("user_id", user.id);

      const lastSeen: Record<string, string> = {};
      res.data?.forEach(read => lastSeen[read.message_id] = read.seen_at);

      const counts: Record<string, number> = {};
      channels.forEach(channel => {
        // Count messages newer than the user's last seen per channel
        const latestSeen = Math.max(
          ...(messages
            .filter((msg: any) => msg.channel_id === channel.id && lastSeen[msg.id])
            .map(msg => new Date(lastSeen[msg.id]).getTime()) || [0]
          )
        );
        counts[channel.id] = messages.filter(msg =>
          msg.channel_id === channel.id &&
          new Date(msg.created_at).getTime() > latestSeen
        ).length;
      });
      setUnseenCounts(counts);
    };
    fetch();
  }, [user, channels, messages, activeChannel]);

  return unseenCounts;
}
