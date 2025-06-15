
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivitySquare, Copy, Users, BarChart2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { CloneStrategyModal } from "./CloneStrategyModal";

export function StrategyCardSocial({ strategy }: any) {
  const [cloneOpen, setCloneOpen] = useState(false);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {strategy.name}
          <Badge variant="secondary">{strategy.visibility}</Badge>
        </CardTitle>
        <CardDescription>by {strategy.user_id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2 flex-wrap text-xs">
          <Badge variant="outline">Clones: {strategy.clones_count}</Badge>
          <Badge variant="outline">Upvotes: {strategy.upvotes_count}</Badge>
          <Badge variant="outline">Sharpe: {strategy.sharpe_ratio}</Badge>
          <Badge variant="outline">Volatility: {strategy.volatility}%</Badge>
          <Badge variant="outline">Drawdown: {strategy.drawdown}%</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setCloneOpen(true)}>
            <Copy className="w-4 h-4 mr-2"/>Clone
          </Button>
          <Button variant="outline" className="flex-1">
            <ActivitySquare className="w-4 h-4 mr-2"/>Details
          </Button>
          <Button variant="secondary" className="flex-1">
            <MessageCircle className="w-4 h-4 mr-2"/>Discuss
          </Button>
        </div>
      </CardContent>
      <CloneStrategyModal open={cloneOpen} onClose={() => setCloneOpen(false)} strategy={strategy}/>
    </Card>
  );
}
