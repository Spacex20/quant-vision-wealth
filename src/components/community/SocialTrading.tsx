
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Copy, Eye, Star, Users, Target } from "lucide-react";

export function SocialTrading() {
  const [followedTraders, setFollowedTraders] = useState<string[]>([]);

  const topTraders = [
    {
      id: "1",
      name: "Alexandra Smith",
      username: "@alextrader",
      avatar: "AS",
      followers: 12400,
      winRate: 78.5,
      totalReturn: 45.2,
      monthlyReturn: 8.7,
      riskScore: "Medium",
      specialties: ["Tech Stocks", "Growth"],
      recentTrades: [
        { symbol: "AAPL", action: "BUY", return: 12.5 },
        { symbol: "MSFT", action: "SELL", return: 8.3 }
      ],
      verified: true
    },
    {
      id: "2",
      name: "Michael Chen",
      username: "@valuemike",
      avatar: "MC",
      followers: 8900,
      winRate: 82.1,
      totalReturn: 38.9,
      monthlyReturn: 6.2,
      riskScore: "Low",
      specialties: ["Value Investing", "Dividends"],
      recentTrades: [
        { symbol: "BRK.B", action: "BUY", return: 15.2 },
        { symbol: "JNJ", action: "HOLD", return: 4.1 }
      ],
      verified: true
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      username: "@cryptoemma",
      avatar: "ER",
      followers: 15600,
      winRate: 71.3,
      totalReturn: 89.5,
      monthlyReturn: 12.4,
      riskScore: "High",
      specialties: ["Crypto", "DeFi"],
      recentTrades: [
        { symbol: "BTC", action: "BUY", return: 22.1 },
        { symbol: "ETH", action: "SELL", return: 18.7 }
      ],
      verified: true
    }
  ];

  const popularStrategies = [
    {
      id: "1",
      name: "AI Growth Portfolio",
      creator: "Alexandra Smith",
      followers: 3200,
      performance: 34.5,
      riskLevel: "Medium-High",
      assets: ["NVDA", "GOOGL", "TSLA", "AMD"],
      description: "Focused on AI and automation companies with strong growth potential"
    },
    {
      id: "2",
      name: "Dividend Aristocrats Plus",
      creator: "Michael Chen",
      followers: 2800,
      performance: 18.2,
      riskLevel: "Low",
      assets: ["JNJ", "KO", "PG", "MMM"],
      description: "Conservative dividend strategy with companies that have increased dividends for 25+ years"
    },
    {
      id: "3",
      name: "Crypto DeFi Yield",
      creator: "Emma Rodriguez",
      followers: 4100,
      performance: 67.8,
      riskLevel: "High",
      assets: ["BTC", "ETH", "UNI", "AAVE"],
      description: "High-yield DeFi strategy with staking and liquidity provision"
    }
  ];

  const toggleFollow = (traderId: string) => {
    setFollowedTraders(prev => 
      prev.includes(traderId) 
        ? prev.filter(id => id !== traderId)
        : [...prev, traderId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Social Trading</h2>
        <Button>
          <Target className="w-4 h-4 mr-2" />
          Share My Strategy
        </Button>
      </div>

      <Tabs defaultValue="traders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="traders">Top Traders</TabsTrigger>
          <TabsTrigger value="strategies">Popular Strategies</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="traders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {topTraders.map((trader) => (
              <Card key={trader.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white">
                          {trader.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {trader.name}
                          {trader.verified && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{trader.username}</p>
                      </div>
                    </div>
                    <Button
                      variant={followedTraders.includes(trader.id) ? "default" : "outline"}
                      onClick={() => toggleFollow(trader.id)}
                    >
                      {followedTraders.includes(trader.id) ? "Following" : "Follow"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {trader.totalReturn > 0 ? "+" : ""}{trader.totalReturn}%
                      </p>
                      <p className="text-xs text-muted-foreground">Total Return</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{trader.winRate}%</p>
                      <p className="text-xs text-muted-foreground">Win Rate</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {trader.followers.toLocaleString()} followers
                    </div>
                    <Badge variant={trader.riskScore === "Low" ? "secondary" : trader.riskScore === "Medium" ? "default" : "destructive"}>
                      {trader.riskScore} Risk
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {trader.specialties.map(specialty => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Recent Trades:</p>
                    {trader.recentTrades.map((trade, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span>{trade.symbol} - {trade.action}</span>
                        <span className={`font-medium ${trade.return > 0 ? "text-green-600" : "text-red-600"}`}>
                          {trade.return > 0 ? "+" : ""}{trade.return}%
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Trades
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularStrategies.map((strategy) => (
              <Card key={strategy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{strategy.name}</CardTitle>
                  <CardDescription>by {strategy.creator}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      +{strategy.performance}%
                    </p>
                    <p className="text-sm text-muted-foreground">12-month performance</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {strategy.followers} followers
                    </div>
                    <Badge variant={strategy.riskLevel.includes("Low") ? "secondary" : strategy.riskLevel.includes("High") ? "destructive" : "default"}>
                      {strategy.riskLevel}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Top Holdings:</p>
                    <div className="flex flex-wrap gap-1">
                      {strategy.assets.map(asset => (
                        <Badge key={asset} variant="outline" className="text-xs">
                          {asset}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{strategy.description}</p>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                    <Button className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Strategy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="following" className="space-y-6">
          {followedTraders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">You're not following anyone yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start following successful traders to see their strategies and trades
                </p>
                <Button>Browse Top Traders</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {topTraders
                .filter(trader => followedTraders.includes(trader.id))
                .map((trader) => (
                  <Card key={trader.id} className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white">
                              {trader.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{trader.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{trader.username}</p>
                          </div>
                        </div>
                        <Badge variant="default">Following</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span>Monthly Return:</span>
                        <span className="font-medium text-green-600">
                          +{trader.monthlyReturn}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
