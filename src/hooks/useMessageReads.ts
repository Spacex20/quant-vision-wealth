
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useMessageReads(channelId: string, messages: any[]) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !channelId || messages.length === 0) return;
    // Mark the most recent message as read when loaded/changed
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg) return;

    // Insert or update read marker
    supabase
      .from("message_reads")
      .upsert({
        message_id: lastMsg.id,
        user_id: user.id,
        seen_at: new Date().toISOString()
      })
      .then();
  }, [user, channelId, messages]);

  // Returns nothing for now; could query reads for "seen" status etc
}
