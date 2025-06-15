
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, TrendingUp, Star, Copy, Users, Activity } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTopTraders, usePopularStrategies, useUserFeed, useFollowUser, useUnfollowUser } from "@/hooks/useSocialTrading";
import { StrategyCardSocial } from "./StrategyCardSocial";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "sonner";

export function SocialTrading() {
  const { user } = useAuth();
  
  const { data: topTraders = [], isLoading: loadingTraders } = useTopTraders();
  const { data: popularStrategies = [], isLoading: loadingStrategies } = usePopularStrategies();
  const { data: feed = [], isLoading: loadingFeed } = useUserFeed(user?.id || "");
  
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  
  const handleFollowToggle = async (traderId: string, isCurrentlyFollowing: boolean) => {
    if (!user?.id) {
      toast.error("Please sign in to follow traders");
      return;
    }

    try {
      if (isCurrentlyFollowing) {
        await unfollowUser.mutateAsync({ 
          follower_id: user.id, 
          followed_id: traderId 
        });
        toast.success("Unfollowed trader");
      } else {
        await followUser.mutateAsync({ 
          follower_id: user.id, 
          followed_id: traderId 
        });
        toast.success("Following trader");
      }
    } catch (error) {
      toast.error("Failed to update follow status");
    }
  };

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

        <TabsContent value="traders" className="space-y-6">
          {loadingTraders ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-20 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : topTraders.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Top Traders Yet"
              description="Our community is growing! Check back soon to discover talented traders and their strategies."
              actionLabel="Explore Strategies"
              onAction={() => {}} // Could navigate to strategies tab
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {topTraders.map((trader: any) => (
                <Card key={trader.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        {trader.avatar_url ? (
                          <AvatarImage src={trader.avatar_url} alt={trader.full_name || "Trader"} />
                        ) : (
                          <AvatarFallback>
                            {trader.full_name
                              ? trader.full_name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()
                              : "T"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {trader.full_name || "Anonymous Trader"}
                          {trader.is_curated_trader && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          <span className="text-muted-foreground">
                            {trader.returns != null ? (
                              <>Return: <b className="text-green-600">{Number(trader.returns).toFixed(2)}%</b></>
                            ) : (
                              "—"
                            )}
                            {" • "}
                            Sharpe: {trader.sharpe_ratio ? trader.sharpe_ratio.toFixed(2) : "—"}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-wrap mb-3">
                      <Badge variant="secondary">
                        Returns: {trader.returns ? trader.returns.toFixed(2) : "—"}%
                      </Badge>
                      <Badge variant="secondary">
                        Sharpe: {trader.sharpe_ratio ? trader.sharpe_ratio.toFixed(2) : "—"}
                      </Badge>
                      {trader.bio && (
                        <Badge variant="outline" className="max-w-[200px] truncate">
                          {trader.bio.length > 22 ? trader.bio.slice(0, 22) + "…" : trader.bio}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="flex-1">
                        <BarChart2 className="w-4 h-4 mr-2" /> View Profile
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleFollowToggle(trader.id, false)}
                        disabled={followUser.isPending}
                      >
                        <Copy className="w-4 h-4 mr-2" /> Follow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          {loadingStrategies ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : popularStrategies.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No Strategies Available"
              description="Be the first to share a strategy! Create and publish your investment strategy to help others learn."
              actionLabel="Create Strategy"
              onAction={() => {}} // Could navigate to strategy creation
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularStrategies.map((strategy: any) => (
                <StrategyCardSocial key={strategy.id} strategy={strategy} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="following" className="space-y-6">
          <div>
            {!user && (
              <Card>
                <CardContent className="py-8 text-center">
                  <EmptyState
                    icon={Users}
                    title="Sign In Required"
                    description="Please sign in to view your personalized feed and follow your favorite traders."
                  />
                </CardContent>
              </Card>
            )}
            {loadingFeed && user && (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-16 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {!loadingFeed && user && feed.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <EmptyState
                    icon={Activity}
                    title="Your Feed is Empty"
                    description="Follow traders and clone strategies to see their latest activities and performance updates here!"
                    actionLabel="Discover Traders"
                    onAction={() => {}} // Could switch to traders tab
                  />
                </CardContent>
              </Card>
            )}
            {!loadingFeed && user && feed.length > 0 && (
              <div className="space-y-4">
                {feed.map((item: any) => (
                  <Card key={item.id}>
                    <CardContent className="py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {item.user_id?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-semibold">{item.type || "Activity"}</span>
                          {item.content && <span> — {item.content}</span>}
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
