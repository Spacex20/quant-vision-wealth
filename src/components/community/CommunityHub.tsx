import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Video, MessageSquare, TrendingUp, Star, Eye } from "lucide-react";
import { CommunityLayout } from "./CommunityLayout";
import { InvestmentServers } from "./InvestmentServers";
import { LiveSessions } from "./LiveSessions";
import { SocialTrading } from "./SocialTrading";

export function CommunityHub() {
  const [activeTab, setActiveTab] = useState("chat");

  const featuredCommunities = [
    {
      id: "1",
      name: "Value Investing Masters",
      description: "Deep value analysis and long-term strategies",
      members: 12400,
      category: "Value Investing",
      isLive: true,
      avatar: "VI"
    },
    {
      id: "2", 
      name: "Tech Growth Hub",
      description: "Technology sector analysis and growth stocks",
      members: 8900,
      category: "Growth",
      isLive: false,
      avatar: "TG"
    },
    {
      id: "3",
      name: "Dividend Aristocrats",
      description: "High-yield dividend strategies and income investing",
      members: 6750,
      category: "Income",
      isLive: true,
      avatar: "DA"
    }
  ];

  const liveAnalysts = [
    { name: "Sarah Chen", specialty: "Tech Analysis", viewers: 245, avatar: "SC" },
    { name: "Mike Rodriguez", specialty: "Market Overview", viewers: 189, avatar: "MR" },
    { name: "David Park", specialty: "Options Trading", viewers: 156, avatar: "DP" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Investment Community</h1>
          <p className="text-muted-foreground">Connect, learn, and invest together with real-time chat</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Video className="w-4 h-4 mr-2" />
            Go Live
          </Button>
          <Button>
            <Users className="w-4 h-4 mr-2" />
            Create Server
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">Active Members</span>
            </div>
            <p className="text-2xl font-bold">28,456</p>
            <p className="text-sm text-muted-foreground">+12% this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" />
              <span className="font-semibold">Live Messages</span>
            </div>
            <p className="text-2xl font-bold">1,247</p>
            <p className="text-sm text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="font-semibold">Trending: #AAPL</span>
            </div>
            <p className="text-2xl font-bold">89</p>
            <p className="text-sm text-muted-foreground">Mentions in 1h</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="servers">Investment Servers</TabsTrigger>
          <TabsTrigger value="stocks">Stock Chat</TabsTrigger>
          <TabsTrigger value="live">Live Sessions</TabsTrigger>
          <TabsTrigger value="trading">Social Trading</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <CommunityLayout />
        </TabsContent>

        <TabsContent value="servers" className="space-y-6">
          {/* Render new Investment Servers main page */}
          <div className="mt-4">
            <InvestmentServersPage />
          </div>
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          <LiveSessions />
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <SocialTrading />
        </TabsContent>
      </Tabs>
    </div>
  );
}
