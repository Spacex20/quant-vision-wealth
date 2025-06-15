
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Hash, Users, TrendingUp, MessageSquare } from "lucide-react";

export function CommunityChat() {
  const [message, setMessage] = useState("");
  const [activeChannel, setActiveChannel] = useState("general");

  const channels = [
    { id: "general", name: "general", members: 1247, unread: 0 },
    { id: "market-analysis", name: "market-analysis", members: 892, unread: 3 },
    { id: "tech-stocks", name: "tech-stocks", members: 654, unread: 12 },
    { id: "crypto-talk", name: "crypto-talk", members: 1156, unread: 0 },
    { id: "beginners", name: "beginners", members: 789, unread: 5 }
  ];

  const messages = [
    {
      id: "1",
      user: "Sarah Chen",
      avatar: "SC",
      timestamp: "2:30 PM",
      content: "Just posted my analysis on AAPL earnings. Looking bullish for Q4! 📈",
      badges: ["Verified", "Pro Trader"]
    },
    {
      id: "2",
      user: "Mike Rodriguez",
      avatar: "MR",
      timestamp: "2:28 PM",
      content: "Anyone else watching the Fed meeting today? Expecting dovish signals",
      badges: ["Analyst"]
    },
    {
      id: "3",
      user: "Emma Thompson",
      avatar: "ET",
      timestamp: "2:25 PM",
      content: "Great breakout session on portfolio diversification! Thanks @Sarah Chen",
      badges: []
    },
    {
      id: "4",
      user: "David Park",
      avatar: "DP",
      timestamp: "2:22 PM",
      content: "VIX is dropping significantly. Good time for growth stocks? 🤔",
      badges: ["Options Expert"]
    },
    {
      id: "5",
      user: "Alex Kim",
      avatar: "AK",
      timestamp: "2:20 PM",
      content: "My dividend portfolio is up 15% this year. Conservative approach paying off!",
      badges: ["Community Helper"]
    }
  ];

  const onlineUsers = [
    { name: "Sarah Chen", avatar: "SC", status: "In Live Session" },
    { name: "Mike Rodriguez", avatar: "MR", status: "Trading" },
    { name: "Emma Thompson", avatar: "ET", status: "Online" },
    { name: "David Park", avatar: "DP", status: "Analyzing Charts" },
    { name: "Alex Kim", avatar: "AK", status: "Online" }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log(`Sending message to ${activeChannel}: ${message}`);
      setMessage("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Channels Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-md text-left hover:bg-secondary transition-colors ${
                    activeChannel === channel.id ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm">{channel.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {channel.unread > 0 && (
                      <Badge variant="destructive" className="text-xs px-1">
                        {channel.unread}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {channel.members}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                <CardTitle className="text-lg">
                  {channels.find(c => c.id === activeChannel)?.name}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                {channels.find(c => c.id === activeChannel)?.members} members
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="text-xs">{msg.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{msg.user}</span>
                        {msg.badges.map(badge => (
                          <Badge key={badge} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                        <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex gap-2">
              <Input
                placeholder={`Message #${channels.find(c => c.id === activeChannel)?.name}`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Online Users */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Online ({onlineUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {onlineUsers.map((user, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">Messages Today</span>
            </div>
            <p className="text-2xl font-bold">1,247</p>
            <p className="text-sm text-muted-foreground">+18% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              <span className="font-semibold">Active Members</span>
            </div>
            <p className="text-2xl font-bold">345</p>
            <p className="text-sm text-muted-foreground">Peak: 892 at market open</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="font-semibold">Trending Topic</span>
            </div>
            <p className="text-2xl font-bold">#AAPL</p>
            <p className="text-sm text-muted-foreground">89 mentions in 1h</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
