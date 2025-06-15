
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMessageReads } from "@/hooks/useMessageReads";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile, Paperclip, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Props {
  channelId: string;
  messages: any[];
  hasMore: boolean;
  loadMore: () => void;
  memberships: any[];
  reloadChannels?: () => void;
}

export default function ChatPanel({ channelId, messages, hasMore, loadMore, memberships }: Props) {
  const { user } = useAuth();
  useMessageReads(channelId, messages);
  const { uploadFiles, uploading } = useFileUpload();
  const [newMessage, setNewMessage] = useState("");
  const [inputFiles, setInputFiles] = useState<FileList | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!user || !channelId || !newMessage.trim()) return;

    let attachmentUrls: string[] = [];
    if (inputFiles) {
      attachmentUrls = await uploadFiles(inputFiles);
    }

    await window.supabase
      .from("messages")
      .insert({
        channel_id: channelId,
        user_id: user.id,
        content: newMessage,
        attachments: attachmentUrls,
      })
      .then();

    setNewMessage("");
    setInputFiles(null);
  };

  // Emoji picker (simplified, can extend)
  const emojis = ["😃", "👍", "❤️", "😂", "🔥", "🚀"];

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center p-2 border-b">
        <div className="font-bold text-md mr-2">Channel: {channelId.slice(-8)}</div>
        {/* Maybe show pinned, members, mod menu here */}
      </div>

      {/* Message List (Infinite Scroll) */}
      <ScrollArea className="flex-1 p-2">
        {hasMore && (
          <Button variant="outline" className="mx-auto block mb-2" onClick={loadMore}>
            Load Older Messages
          </Button>
        )}
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div key={msg.id} className="flex gap-2 items-start">
              <Avatar className="w-8 h-8">
                <AvatarImage src={msg.user_profile?.avatar_url || undefined} />
                <AvatarFallback>
                  {msg.user_profile?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex gap-2 items-center">
                  <span className="font-semibold text-sm">{msg.user_profile?.full_name || "User"}</span>
                  <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}</span>
                </div>
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                {/* Attachments */}
                {msg.attachments && msg.attachments.map((url: string, idx: number) => (
                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block mt-1 text-xs underline text-blue-700">Attachment #{idx+1}</a>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Typing status, seen checkmarks, etc. can be added here */}

      {/* Message Input */}
      <div className="border-t p-3 flex gap-2 items-end bg-background">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Smile />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2 flex gap-2">
            {emojis.map(e => (
              <Button
                key={e}
                variant="ghost"
                size="sm"
                onClick={() => setNewMessage(prev => prev + e)}
                className="h-7 w-7 rounded-full"
              >{e}</Button>
            ))}
          </PopoverContent>
        </Popover>
        <label>
          <input
            type="file"
            multiple
            hidden
            onChange={e => setInputFiles(e.target.files)}
          />
          <Button variant="ghost" size="sm" className="h-10 w-10">
            <Paperclip />
          </Button>
        </label>
        <Textarea
          className="flex-1 min-h-[36px] max-h-32 resize-none"
          placeholder="Message"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim() || uploading}>
          <Send />
        </Button>
      </div>
    </div>
  );
}
