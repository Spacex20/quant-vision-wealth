
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

export function ServerStrategyShares({ serverId }: { serverId: string }) {
  const [strategies, setStrategies] = useState<any[]>([]);
  useEffect(() => {
    if (!serverId) return;
    async function fetchShares() {
      const { data } = await supabase
        .from("investment_server_strategy_shares")
        .select("*, trading_strategies(name, description)")
        .eq("server_id", serverId);
      setStrategies(data || []);
    }
    fetchShares();
  }, [serverId]);
  return (
    <div>
      <h4 className="font-bold text-xs mb-1">Shared Strategies</h4>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {strategies.length === 0 && <div className="text-xs text-muted-foreground mb-2">No shared strategies yet.</div>}
        {strategies.map(share => (
          <Card key={share.id}>
            <CardContent className="p-2">
              <div className="font-semibold text-xs">{share.trading_strategies?.name || "Strategy"}</div>
              <div className="text-xs text-muted-foreground">{share.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
