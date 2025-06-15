
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, MessageSquare, TrendingUp, Star, Search, Filter } from "lucide-react";

export function InvestmentServers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const servers = [
    {
      id: "1",
      name: "Value Investing Masters",
      description: "Deep value analysis, Warren Buffett strategies, and long-term wealth building",
      members: 12400,
      category: "Value Investing",
      tags: ["Buffett", "Graham", "DCF"],
      isLive: true,
      avatar: "VI",
      recentActivity: "Sarah just shared a REIT analysis",
      rating: 4.8,
      joinedMembers: ["SC", "MR", "DP"]
    },
    {
      id: "2", 
      name: "Tech Growth Hub",
      description: "Technology sector analysis, growth stocks, and emerging tech trends",
      members: 8900,
      category: "Growth",
      tags: ["Tech", "AI", "Cloud"],
      isLive: false,
      avatar: "TG",
      recentActivity: "New AI stock discussion started",
      rating: 4.6,
      joinedMembers: ["TG", "AL", "JS"]
    },
    {
      id: "3",
      name: "Dividend Aristocrats",
      description: "High-yield dividend strategies and income investing for passive wealth",
      members: 6750,
      category: "Income",
      tags: ["Dividends", "REIT", "Income"],
      isLive: true,
      avatar: "DA",
      recentActivity: "Monthly dividend tracker updated",
      rating: 4.9,
      joinedMembers: ["DA", "RI", "PL"]
    },
    {
      id: "4",
      name: "Crypto & DeFi Hub",
      description: "Cryptocurrency analysis, DeFi protocols, and blockchain investments",
      members: 15600,
      category: "Crypto",
      tags: ["Bitcoin", "Ethereum", "DeFi"],
      isLive: true,
      avatar: "CD",
      recentActivity: "BTC technical analysis posted",
      rating: 4.4,
      joinedMembers: ["BT", "ET", "DF"]
    },
    {
      id: "5",
      name: "Options Trading Pro",
      description: "Advanced options strategies, risk management, and trading psychology",
      members: 4200,
      category: "Options",
      tags: ["Options", "Spreads", "Theta"],
      isLive: false,
      avatar: "OP",
      recentActivity: "Iron condor strategy guide shared",
      rating: 4.7,
      joinedMembers: ["OP", "ST", "IC"]
    },
    {
      id: "6",
      name: "ESG Investors United",
      description: "Sustainable investing, ESG analysis, and impact investment strategies",
      members: 3800,
      category: "ESG",
      tags: ["ESG", "Sustainable", "Impact"],
      isLive: false,
      avatar: "ES",
      recentActivity: "Green energy sector review",
      rating: 4.5,
      joinedMembers: ["GR", "SU", "IM"]
    }
  ];

  const categories = ["all", "Value Investing", "Growth", "Income", "Crypto", "Options", "ESG"];

  const filteredServers = servers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         server.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         server.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || server.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search servers, strategies, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServers.map((server) => (
          <Card key={server.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {server.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {server.name}
                      {server.isLive && (
                        <Badge variant="destructive" className="animate-pulse">
                          LIVE
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-muted-foreground">{server.rating}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{server.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>{server.description}</CardDescription>
              
              <div className="flex flex-wrap gap-1">
                {server.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {server.members.toLocaleString()} members
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  Active now
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {server.joinedMembers.map((member, idx) => (
                    <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-xs">{member}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {server.recentActivity}
                </span>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Join Server</Button>
                <Button variant="outline" size="icon">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No servers found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button>Create New Server</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
