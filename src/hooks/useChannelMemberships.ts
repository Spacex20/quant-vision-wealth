
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Membership {
  id: string;
  channel_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export function useChannelMemberships(channelId?: string) {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchMemberships = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("channel_memberships")
          .select("*")
          .eq("user_id", user.id);
        if (channelId) {
          query = query.eq("channel_id", channelId);
        }
        const { data } = await query;
        setMemberships(data || []);
      } catch {
        setMemberships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, [user, channelId]);

  return { memberships, loading };
}
