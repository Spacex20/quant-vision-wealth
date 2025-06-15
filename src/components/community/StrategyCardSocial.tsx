
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivitySquare, Copy, MessageCircle } from "lucide-react";
import { useState } from "react";
import { CloneStrategyModal } from "./CloneStrategyModal";

interface Strategy {
  id: string;
  name: string;
  description?: string;
  visibility: string;
  user_id: string;
  clones_count: number;
  upvotes_count: number;
  sharpe_ratio?: number;
  volatility?: number;
  drawdown?: number;
  returns?: number;
}

interface StrategyCardSocialProps {
  strategy: Strategy;
}

export function StrategyCardSocial({ strategy }: StrategyCardSocialProps) {
  const [cloneOpen, setCloneOpen] = useState(false);

  if (!strategy) {
    return null;
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {strategy.name || "Untitled Strategy"}
          <Badge variant="secondary">{strategy.visibility || "public"}</Badge>
        </CardTitle>
        <CardDescription>by {strategy.user_id || "Unknown"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2 flex-wrap text-xs">
          <Badge variant="outline">Clones: {strategy.clones_count || 0}</Badge>
          <Badge variant="outline">Upvotes: {strategy.upvotes_count || 0}</Badge>
          {strategy.sharpe_ratio && (
            <Badge variant="outline">Sharpe: {strategy.sharpe_ratio.toFixed(2)}</Badge>
          )}
          {strategy.volatility && (
            <Badge variant="outline">Volatility: {strategy.volatility.toFixed(1)}%</Badge>
          )}
          {strategy.drawdown && (
            <Badge variant="outline">Drawdown: {strategy.drawdown.toFixed(1)}%</Badge>
          )}
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
      <CloneStrategyModal 
        open={cloneOpen} 
        onClose={() => setCloneOpen(false)} 
        strategy={strategy}
      />
    </Card>
  );
}
