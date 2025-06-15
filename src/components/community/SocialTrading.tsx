
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Eye, Star, Users, BarChart2, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTopTraders, usePopularStrategies, useUserFeed, useFollowUser, useUnfollowUser } from "@/hooks/useSocialTrading";
import { StrategyCardSocial } from "./StrategyCardSocial";

export function SocialTrading() {
  const { user } = useAuth();
  const [followingTab, setFollowingTab] = useState("feed");
  
  const { data: topTraders = [], isLoading: loadingTraders } = useTopTraders();
  const { data: popularStrategies = [], isLoading: loadingStrategies } = usePopularStrategies();
  const { data: feed = [], isLoading: loadingFeed } = useUserFeed(user?.id || "");

  // --- UI State ---
  // --- Follow/unfollow (would want to know who the user is following; future improvement) ---

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Social Trading</h2>
        <Button>
          <TrendingUp className="w-4 h-4 mr-2" />
          Share My Strategy
        </Button>
      </div>

      <Tabs defaultValue="traders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="traders">Top Traders</TabsTrigger>
          <TabsTrigger value="strategies">Popular Strategies</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        {/* --- TOP TRADERS --- */}
        <TabsContent value="traders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loadingTraders
              ? <div>Loading…</div>
              : topTraders.map((trader: any) => (
                <Card key={trader.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        {trader.avatar_url ? (
                          <AvatarImage src={trader.avatar_url}/>
                        ) : (
                          <AvatarFallback>
                            {trader.full_name
                              ? trader.full_name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                              : "??"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {trader.full_name}
                          {trader.is_curated_trader && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          <span className="text-muted-foreground">
                            {trader.returns != null ? <>Return: <b>{Number(trader.returns).toFixed(2)}%</b></> : "—"}
                            {" • "}
                            Sharpe: {trader.sharpe_ratio ? trader.sharpe_ratio.toFixed(2) : "—"}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-wrap mb-3">
                      <Badge variant="secondary">Returns: {trader.returns ? trader.returns.toFixed(2) : "—"}%</Badge>
                      <Badge variant="secondary">Sharpe: {trader.sharpe_ratio ? trader.sharpe_ratio.toFixed(2) : "—"}</Badge>
                      {trader.bio && <Badge variant="outline">{trader.bio.slice(0,22)}…</Badge>}
                    </div>
                    {/* Strategy breakdown and actions could go here */}
                    <div className="flex gap-2">
                      <Button variant="secondary" className="flex-1">
                        <BarChart2 className="w-4 h-4 mr-2"/> View Profile
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Copy className="w-4 h-4 mr-2"/> Clone Latest Portfolio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* --- POPULAR STRATEGIES --- */}
        <TabsContent value="strategies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingStrategies
              ? <div>Loading…</div>
              : popularStrategies.map((strategy: any) => (
                <StrategyCardSocial key={strategy.id} strategy={strategy}/>
              ))}
          </div>
        </TabsContent>

        {/* --- FOLLOWING FEED --- */}
        <TabsContent value="following" className="space-y-6">
          <div>
            {!user && <Card><CardContent className="py-8 text-center">Please sign in to view your feed!</CardContent></Card>}
            {loadingFeed && user && <Card><CardContent>Loading...</CardContent></Card>}
            {!loadingFeed && user && feed.length === 0 && (
              <Card><CardContent className="text-center py-8">Your feed is empty. Follow traders and clone strategies to see activity here!</CardContent></Card>
            )}
            {!loadingFeed && user && feed.length > 0 && (
              <div className="space-y-4">
                {feed.map((item: any) => (
                  <Card key={item.id}>
                    <CardContent className="py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8" />
                        <div>
                          <span className="font-semibold">{item.type}</span>
                          {item.content ? <span> — {item.content}</span> : null}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(item.created_at).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
