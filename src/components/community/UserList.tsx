
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Users, Crown, Shield, User, Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface OnlineUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'idle' | 'offline';
  role: 'admin' | 'moderator' | 'member' | 'guest';
  last_seen?: string;
}

interface UserListProps {
  onlineUsers: OnlineUser[];
}

export function UserList({ onlineUsers }: UserListProps) {
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOffline, setShowOffline] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          avatar_url,
          user_roles(role)
        `)
        .limit(50);

      if (error) throw error;

      const formattedUsers: OnlineUser[] = (profiles || []).map(profile => ({
        id: profile.id,
        name: profile.full_name || 'Anonymous',
        avatar: profile.full_name?.split(' ').map(n => n[0]).join('') || 'A',
        status: Math.random() > 0.3 ? 'online' : 'offline' as 'online' | 'offline',
        role: (profile.user_roles as any)?.[0]?.role || 'member' as 'admin' | 'moderator' | 'member' | 'guest',
        last_seen: new Date(Date.now() - Math.random() * 3600000).toISOString()
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown;
      case 'moderator': return Shield;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-yellow-600';
      case 'moderator': return 'text-blue-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showOffline || user.status !== 'offline';
    return matchesSearch && matchesStatus;
  });

  const onlineCount = users.filter(u => u.status === 'online').length;
  const idleCount = users.filter(u => u.status === 'idle').length;
  const offlineCount = users.filter(u => u.status === 'offline').length;

  const trendingTopics = [
    { topic: '#AAPL earnings', mentions: 45, trend: 'up' },
    { topic: '#crypto surge', mentions: 32, trend: 'up' },
    { topic: '#portfolio tips', mentions: 28, trend: 'stable' },
    { topic: '#market analysis', mentions: 24, trend: 'down' },
    { topic: '#dividend stocks', mentions: 18, trend: 'up' }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Members</span>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <UserPlus className="w-3 h-3" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>

        {/* Status counts */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>{onlineCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span>{idleCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span>{offlineCount}</span>
          </div>
        </div>
      </div>

      {/* Users List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {/* Online Users */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground mb-2 px-2 font-medium">
              Online — {filteredUsers.filter(u => u.status === 'online').length}
            </div>
            {filteredUsers
              .filter(u => u.status === 'online')
              .map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                
                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium truncate">
                          {user.name}
                        </span>
                        <RoleIcon className={`w-3 h-3 ${getRoleColor(user.role)}`} />
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {user.status}
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>

          {/* Idle Users */}
          {filteredUsers.filter(u => u.status === 'idle').length > 0 && (
            <div className="space-y-1 mt-4">
              <div className="text-xs text-muted-foreground mb-2 px-2 font-medium">
                Idle — {filteredUsers.filter(u => u.status === 'idle').length}
              </div>
              {filteredUsers
                .filter(u => u.status === 'idle')
                .map((user) => {
                  const RoleIcon = getRoleIcon(user.role);
                  
                  return (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors opacity-75"
                    >
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`}></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium truncate">
                            {user.name}
                          </span>
                          <RoleIcon className={`w-3 h-3 ${getRoleColor(user.role)}`} />
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {user.status}
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          )}

          {/* Offline Users Toggle */}
          {!showOffline && offlineCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-4 text-xs"
              onClick={() => setShowOffline(true)}
            >
              Show {offlineCount} offline members
            </Button>
          )}

          {/* Offline Users */}
          {showOffline && filteredUsers.filter(u => u.status === 'offline').length > 0 && (
            <div className="space-y-1 mt-4">
              <div className="text-xs text-muted-foreground mb-2 px-2 font-medium flex items-center justify-between">
                <span>Offline — {filteredUsers.filter(u => u.status === 'offline').length}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 text-xs"
                  onClick={() => setShowOffline(false)}
                >
                  ×
                </Button>
              </div>
              {filteredUsers
                .filter(u => u.status === 'offline')
                .slice(0, 10) // Limit offline users shown
                .map((user) => {
                  const RoleIcon = getRoleIcon(user.role);
                  
                  return (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors opacity-50"
                    >
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`}></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium truncate">
                            {user.name}
                          </span>
                          <RoleIcon className={`w-3 h-3 ${getRoleColor(user.role)}`} />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last seen {Math.floor(Math.random() * 24)}h ago
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Trending Topics Panel */}
      <div className="p-3 border-t space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">🔥 Trending</span>
        </div>
        <ScrollArea className="h-32">
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate">{topic.topic}</span>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">{topic.mentions}</span>
                  <div className={`w-1 h-1 rounded-full ${
                    topic.trend === 'up' ? 'bg-green-500' : 
                    topic.trend === 'down' ? 'bg-red-500' : 'bg-gray-400'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-t">
        <div className="text-xs text-muted-foreground mb-2">
          💡 AI Summary: Market sentiment is bullish on tech stocks this week
        </div>
        <Button variant="outline" size="sm" className="w-full text-xs h-7">
          View Daily Digest
        </Button>
      </div>
    </div>
  );
}
