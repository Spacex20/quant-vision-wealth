
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useInfiniteMessages(channelId: string, pageSize = 40) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!channelId) return;
    setLoading(true);
    supabase
      .from("messages")
      .select("*")
      .eq("channel_id", channelId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .range(0, pageSize * page - 1)
      .then(({ data }) => {
        setMessages((data || []).reverse());
        setHasMore((data || []).length >= pageSize * page);
        setLoading(false);
      });
  }, [channelId, page, pageSize]);

  // For loading older messages:  
  const loadMore = () => setPage(page => page + 1);

  // Reset on channel change
  useEffect(() => {
    setMessages([]);
    setPage(1);
    setLoading(true);
  }, [channelId]);

  return { messages, loading, hasMore, loadMore };
}
