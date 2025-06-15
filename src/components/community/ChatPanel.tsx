
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Smile, 
  Paperclip, 
  Send, 
  Heart, 
  ThumbsUp, 
  Pin, 
  MoreHorizontal,
  Edit,
  Trash2,
  Reply,
  Image as ImageIcon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  } | null;
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  mentions?: string[];
  reply_to?: {
    id: string;
    content: string;
    user_name: string;
  };
}

interface ChatPanelProps {
  channelId: string;
  messages: Message[];
  typingUsers: string[];
  onSendMessage: (content: string, attachments?: any[], replyTo?: Message) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
  onToggleUpvote: (messageId: string) => void;
  onPinMessage: (messageId: string) => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
}

export function ChatPanel({ 
  channelId, 
  messages, 
  typingUsers,
  onSendMessage, 
  onEditMessage,
  onDeleteMessage,
  onAddReaction, 
  onRemoveReaction,
  onToggleUpvote,
  onPinMessage,
  onStartTyping,
  onStopTyping
}: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const { user } = useAuth();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage, [], replyingTo || undefined);
      setNewMessage("");
      setReplyingTo(null);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (value: string) => {
    setNewMessage(value);
    
    // Handle typing indicators
    if (value.trim()) {
      onStartTyping();
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        onStopTyping();
      }, 3000);
    } else {
      onStopTyping();
    }
  };

  const handleEditMessage = (messageId: string, currentContent: string) => {
    setEditingMessageId(messageId);
    setEditingContent(currentContent);
  };

  const saveEdit = () => {
    if (editingMessageId && editingContent.trim()) {
      onEditMessage(editingMessageId, editingContent);
      setEditingMessageId(null);
      setEditingContent("");
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent("");
  };

  const handleReaction = (messageId: string, emoji: string) => {
    const message = messages.find(m => m.id === messageId);
    const userReacted = message?.reactions?.find(r => 
      r.emoji === emoji && r.users.includes(user?.id || '')
    );
    
    if (userReacted) {
      onRemoveReaction(messageId, emoji);
    } else {
      onAddReaction(messageId, emoji);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Handle file upload logic here
      console.log('Files selected:', files);
      // You would upload these files and get URLs back
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const formatMessageContent = (content: string, mentions: string[] = []) => {
    let formattedContent = content;
    
    // Highlight mentions
    mentions.forEach(mention => {
      const regex = new RegExp(`@${mention}`, 'gi');
      formattedContent = formattedContent.replace(
        regex, 
        `<span class="bg-blue-100 text-blue-600 px-1 rounded">@${mention}</span>`
      );
    });
    
    return formattedContent;
  };

  const commonEmojis = ['👍', '❤️', '😄', '😮', '😢', '🔥', '💯', '🚀'];

  const pinnedMessages = messages.filter(m => m.is_pinned);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold">
            #{channelId.slice(-8)}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {messages.length} messages
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {pinnedMessages.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Pin className="w-4 h-4" />
                  <span className="ml-1">{pinnedMessages.length}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Pinned Messages</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {pinnedMessages.map(message => (
                    <div key={message.id} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={message.user_profile?.avatar_url || undefined} />
                          <AvatarFallback className="text-xs">
                            {getInitials(message.user_profile?.full_name || 'Unknown')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {message.user_profile?.full_name || 'Unknown User'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Reply Banner */}
      {replyingTo && (
        <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Reply className="w-4 h-4" />
            <span className="text-sm">
              Replying to <strong>{replyingTo.user_profile?.full_name || 'Unknown User'}</strong>
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-xs">
              {replyingTo.content}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setReplyingTo(null)}
          >
            ×
          </Button>
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const showAvatar = index === 0 || messages[index - 1]?.user_id !== message.user_id;
            const timeAgo = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });
            const isOwn = message.user_id === user?.id;
            const isEditing = editingMessageId === message.id;
            const userName = message.user_profile?.full_name || 'Unknown User';
            const userAvatar = message.user_profile?.avatar_url;
            
            return (
              <div
                key={message.id}
                className={`group flex gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors ${
                  message.is_pinned ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                } ${message.mentions?.some(mention => mention === user?.email?.split('@')[0]) ? 'bg-blue-50 border-l-4 border-blue-400' : ''}`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {showAvatar ? (
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={userAvatar || undefined} />
                      <AvatarFallback>
                        {getInitials(userName)}
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
                        {userName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {timeAgo}
                      </span>
                      {message.is_pinned && (
                        <Pin className="w-3 h-3 text-yellow-600" />
                      )}
                    </div>
                  )}
                  
                  {/* Reply context */}
                  {message.thread_id && (
                    <div className="text-xs text-muted-foreground mb-1 p-2 bg-muted/50 rounded border-l-2">
                      <Reply className="w-3 h-3 inline mr-1" />
                      Reply to previous message
                    </div>
                  )}
                  
                  {/* Message content */}
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="min-h-[60px]"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit}>Save</Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="text-sm break-words"
                      dangerouslySetInnerHTML={{
                        __html: formatMessageContent(message.content, message.mentions)
                      }}
                    />
                  )}

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, idx) => (
                        <div key={idx} className="border rounded-lg p-3 bg-muted/50">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-sm">{attachment.name || 'Attachment'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {message.reactions.map((reaction, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className={`h-6 px-2 text-xs ${
                            reaction.users.includes(user?.id || '') 
                              ? 'bg-blue-100 border-blue-300' 
                              : ''
                          }`}
                          onClick={() => handleReaction(message.id, reaction.emoji)}
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
                      onClick={() => handleReaction(message.id, '👍')}
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => setReplyingTo(message)}
                    >
                      <Reply className="w-3 h-3" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {isOwn && (
                          <>
                            <DropdownMenuItem onClick={() => handleEditMessage(message.id, message.content)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDeleteMessage(message.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onClick={() => onPinMessage(message.id)}>
                          <Pin className="w-4 h-4 mr-2" />
                          Pin Message
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Heart className="w-4 h-4 mr-2" />
                          Bookmark
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 text-sm text-muted-foreground">
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-end gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message #${channelId.slice(-8)}...`}
              className="min-h-[40px] max-h-32 resize-none pr-20"
              rows={1}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
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
                setNewMessage(prev => prev + emoji);
                inputRef.current?.focus();
              }}
            >
              {emoji}
            </Button>
          ))}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </div>
    </div>
  );
}
