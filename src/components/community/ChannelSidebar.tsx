
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Hash, 
  ChevronDown, 
  ChevronRight, 
  Volume2, 
  Megaphone, 
  Plus, 
  Search,
  Settings,
  Bell,
  BellOff
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface Channel {
  id: string;
  name: string;
  description: string;
  category: string;
  position: number;
  is_private: boolean;
  unread_count?: number;
}

interface ChannelSidebarProps {
  channels: Channel[];
  activeChannel: string;
  onChannelSelect: (channelId: string) => void;
}

export function ChannelSidebar({ channels, activeChannel, onChannelSelect }: ChannelSidebarProps) {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [mutedChannels, setMutedChannels] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const toggleCategory = (category: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  const toggleMute = (channelId: string) => {
    const newMuted = new Set(mutedChannels);
    if (newMuted.has(channelId)) {
      newMuted.delete(channelId);
    } else {
      newMuted.add(channelId);
    }
    setMutedChannels(newMuted);
  };

  // Filter channels based on search term
  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group channels by category
  const channelsByCategory = filteredChannels.reduce((acc, channel) => {
    if (!acc[channel.category]) {
      acc[channel.category] = [];
    }
    acc[channel.category].push(channel);
    return acc;
  }, {} as Record<string, Channel[]>);

  const getChannelIcon = (channel: Channel) => {
    if (channel.name.includes('voice')) return Volume2;
    if (channel.name.includes('announcement')) return Megaphone;
    return Hash;
  };

  const totalUnreadCount = channels.reduce((sum, channel) => sum + (channel.unread_count || 0), 0);

  return (
    <div className="flex flex-col h-full">
      {/* Server Header */}
      <div className="p-4 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto">
              <div className="text-left">
                <h2 className="font-bold text-lg">Investment Community</h2>
                <p className="text-sm text-muted-foreground">Connect with fellow investors</p>
              </div>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Server Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="w-4 h-4 mr-2" />
              Create Channel
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Bell className="w-4 h-4 mr-2" />
              Notification Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search */}
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search channels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-8"
          />
        </div>
      </div>

      {/* Channels List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {Object.entries(channelsByCategory).map(([category, categoryChannels]) => {
            const isCollapsed = collapsedCategories.has(category);
            const categoryUnreadCount = categoryChannels.reduce((sum, channel) => sum + (channel.unread_count || 0), 0);
            
            return (
              <div key={category}>
                {/* Category Header */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 hover:text-foreground"
                  onClick={() => toggleCategory(category)}
                >
                  {isCollapsed ? <ChevronRight className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                  {category}
                  {categoryUnreadCount > 0 && (
                    <Badge variant="destructive" className="ml-auto text-xs h-4 px-1">
                      {categoryUnreadCount}
                    </Badge>
                  )}
                </Button>

                {/* Channels in Category */}
                {!isCollapsed && (
                  <div className="space-y-0.5 ml-2">
                    {categoryChannels.map((channel) => {
                      const Icon = getChannelIcon(channel);
                      const isActive = channel.id === activeChannel;
                      const isMuted = mutedChannels.has(channel.id);
                      
                      return (
                        <div key={channel.id} className="group relative">
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            size="sm"
                            className={`w-full justify-start text-sm font-normal ${
                              isActive ? 'bg-primary/10 text-primary' : ''
                            } ${isMuted ? 'opacity-50' : ''}`}
                            onClick={() => onChannelSelect(channel.id)}
                          >
                            <Icon className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className="truncate">{channel.name}</span>
                            {channel.unread_count && channel.unread_count > 0 && !isActive && (
                              <Badge variant="destructive" className="ml-auto text-xs h-4 px-1">
                                {channel.unread_count > 99 ? '99+' : channel.unread_count}
                              </Badge>
                            )}
                          </Button>
                          
                          {/* Channel Actions (appear on hover) */}
                          <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Settings className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => toggleMute(channel.id)}>
                                  {isMuted ? (
                                    <>
                                      <Bell className="w-4 h-4 mr-2" />
                                      Unmute Channel
                                    </>
                                  ) : (
                                    <>
                                      <BellOff className="w-4 h-4 mr-2" />
                                      Mute Channel
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Hash className="w-4 h-4 mr-2" />
                                  Copy Channel Link
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Leave Channel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Channel Button */}
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground mt-4 hover:text-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Channel
          </Button>
        </div>
      </ScrollArea>

      {/* User Info */}
      <div className="p-3 border-t bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                User Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
