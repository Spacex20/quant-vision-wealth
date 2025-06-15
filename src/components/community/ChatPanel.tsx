
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Smile, Paperclip, Send, Heart, ThumbsUp, Pin, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

interface ChatPanelProps {
  channelId: string;
  messages: Message[];
  onSendMessage: (content: string, attachments?: any[]) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onToggleUpvote: (messageId: string) => void;
}

export function ChatPanel({ 
  channelId, 
  messages, 
  onSendMessage, 
  onAddReaction, 
  onToggleUpvote 
}: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const commonEmojis = ['👍', '❤️', '😄', '😮', '😢', '🔥', '💯', '🚀'];

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold">
            {messages[0]?.channel_id ? `#${channelId.slice(-8)}` : '#general'}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {messages.length} messages
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Pin className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const showAvatar = index === 0 || messages[index - 1]?.user_id !== message.user_id;
            const timeAgo = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });
            
            return (
              <div
                key={message.id}
                className={`group flex gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors ${
                  message.is_pinned ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {showAvatar ? (
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={message.user_profile?.avatar_url} />
                      <AvatarFallback>
                        {getInitials(message.user_profile?.full_name || '')}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center text-xs text-muted-foreground">
                      {new Date(message.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  {showAvatar && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {message.user_profile?.full_name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {timeAgo}
                      </span>
                      {message.is_pinned && (
                        <Pin className="w-3 h-3 text-yellow-600" />
                      )}
                    </div>
                  )}
                  
                  <div className="text-sm break-words">
                    {message.content}
                  </div>

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, idx) => (
                        <div key={idx} className="border rounded-lg p-3 bg-muted/50">
                          <p className="text-sm text-muted-foreground">📎 {attachment.name}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {message.reactions.map((reaction, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => onAddReaction(message.id, reaction.emoji)}
                        >
                          {reaction.emoji} {reaction.count}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Message Actions (appear on hover) */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-2 flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => onToggleUpvote(message.id)}
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => onAddReaction(message.id, '❤️')}
                    >
                      <Heart className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-4 py-2 text-sm text-muted-foreground">
          Someone is typing...
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Smile className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Emoji Reactions */}
        <div className="flex gap-1 mt-2">
          {commonEmojis.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-sm"
              onClick={() => {
                // Quick emoji shortcut - could add to message or as reaction
                setNewMessage(prev => prev + emoji);
                inputRef.current?.focus();
              }}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
