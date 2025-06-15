
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Crown, Shield, User } from "lucide-react";

interface UserListProps {
  onlineUsers: string[];
}

export function UserList({ onlineUsers }: UserListProps) {
  // Mock data for demonstration
  const users = [
    { id: '1', name: 'Alex Chen', role: 'admin', status: 'online', avatar: 'AC' },
    { id: '2', name: 'Sarah Kim', role: 'moderator', status: 'online', avatar: 'SK' },
    { id: '3', name: 'Mike Rodriguez', role: 'member', status: 'online', avatar: 'MR' },
    { id: '4', name: 'Emma Thompson', role: 'member', status: 'idle', avatar: 'ET' },
    { id: '5', name: 'David Park', role: 'member', status: 'online', avatar: 'DP' },
    { id: '6', name: 'Lisa Wang', role: 'guest', status: 'online', avatar: 'LW' },
  ];

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

  const onlineCount = users.filter(u => u.status === 'online').length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Online — {onlineCount}</span>
        </div>
      </div>

      {/* Users List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {/* Trending Topics Panel */}
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
              🔥 Trending Topics
            </h4>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">#AAPL earnings</div>
              <div className="text-xs text-muted-foreground">#crypto surge</div>
              <div className="text-xs text-muted-foreground">#portfolio tips</div>
            </div>
          </div>

          {/* Online Users */}
          {users.map((user) => {
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
          })}

          {/* Offline Users */}
          <div className="mt-4 pt-2 border-t">
            <div className="text-xs text-muted-foreground mb-2 px-2">
              Offline — {users.filter(u => u.status === 'offline').length}
            </div>
            {/* Add offline users here if needed */}
          </div>
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-3 border-t space-y-2">
        <div className="text-xs text-muted-foreground">
          💡 AI Summary: Market is bullish on tech stocks this week
        </div>
        <Badge variant="outline" className="text-xs">
          View Daily Digest
        </Badge>
      </div>
    </div>
  );
}
