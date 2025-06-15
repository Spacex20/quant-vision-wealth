
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash, ChevronDown, ChevronRight, Volume2, Megaphone, Plus } from "lucide-react";

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

  const toggleCategory = (category: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  // Group channels by category
  const channelsByCategory = channels.reduce((acc, channel) => {
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

  return (
    <div className="flex flex-col h-full">
      {/* Server Header */}
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg">Investment Community</h2>
        <p className="text-sm text-muted-foreground">Connect with fellow investors</p>
      </div>

      {/* Channels List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {Object.entries(channelsByCategory).map(([category, categoryChannels]) => {
            const isCollapsed = collapsedCategories.has(category);
            
            return (
              <div key={category}>
                {/* Category Header */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1"
                  onClick={() => toggleCategory(category)}
                >
                  {isCollapsed ? <ChevronRight className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                  {category}
                </Button>

                {/* Channels in Category */}
                {!isCollapsed && (
                  <div className="space-y-0.5 ml-2">
                    {categoryChannels.map((channel) => {
                      const Icon = getChannelIcon(channel);
                      const isActive = channel.id === activeChannel;
                      
                      return (
                        <Button
                          key={channel.id}
                          variant={isActive ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start text-sm font-normal"
                          onClick={() => onChannelSelect(channel.id)}
                        >
                          <Icon className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="truncate">{channel.name}</span>
                          {channel.unread_count && channel.unread_count > 0 && (
                            <Badge variant="destructive" className="ml-auto text-xs">
                              {channel.unread_count}
                            </Badge>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Channel Button */}
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Channel
          </Button>
        </div>
      </ScrollArea>

      {/* User Info */}
      <div className="p-3 border-t bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-medium">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">User</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}
