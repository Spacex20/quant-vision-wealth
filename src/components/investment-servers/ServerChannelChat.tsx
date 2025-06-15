
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function ServerChannelChat({ serverId, channelId }: { serverId: string; channelId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const endRef = useRef<HTMLDivElement | null>(null);

  // Fetch messages
  useEffect(() => {
    if (!channelId) return;
    async function fetchMsgs() {
      const { data } = await supabase
        .from("investment_server_messages")
        .select("*, profiles:profiles(full_name)")
        .eq("channel_id", channelId)
        .order("created_at", { ascending: true });
      setMessages(data || []);
    }
    fetchMsgs();
  }, [channelId]);

  // Scroll to bottom on updates
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Send message
  async function handleSend() {
    if (!user || !newMessage.trim()) return;
    await supabase.from("investment_server_messages").insert({
      channel_id: channelId,
      user_id: user.id,
      content: newMessage,
    });
    setNewMessage("");
    // Re-fetch messages
    const { data } = await supabase
      .from("investment_server_messages")
      .select("*, profiles:profiles(full_name)")
      .eq("channel_id", channelId)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 bg-background p-0">
        <CardContent className="p-2 overflow-y-auto h-full">
          <div className="flex flex-col gap-2">
            {messages.map(msg => (
              <div key={msg.id} className="flex gap-2 items-center">
                <span className="text-xs font-semibold">
                  {msg.profiles?.full_name || "User"}
                  <span className="text-[10px] text-muted-foreground ml-2">{new Date(msg.created_at).toLocaleTimeString()}</span>
                </span>
                <span className="ml-2 text-xs">{msg.content}</span>
              </div>
            ))}
            <div ref={endRef}></div>
          </div>
        </CardContent>
      </Card>
      {/* Message input */}
      <div className="flex gap-2 border-t p-2 bg-background">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          className="flex-1"
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
        />
        <Button onClick={handleSend} disabled={!newMessage.trim()}>Send</Button>
      </div>
    </div>
  );
}
