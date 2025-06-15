
import { useState, useEffect } from "react";
import { InvestmentServersSidebar } from "@/components/investment-servers/InvestmentServersSidebar";
import { ServerDashboard } from "@/components/investment-servers/ServerDashboard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function InvestmentServersPage() {
  const { user } = useAuth();
  const [servers, setServers] = useState<any[]>([]);
  const [activeServerId, setActiveServerId] = useState<string>("");
  const [refresh, setRefresh] = useState(0);

  // Fetch joined servers
  useEffect(() => {
    if (!user) return;
    const fetchServers = async () => {
      const { data, error } = await supabase
        .from("investment_server_memberships")
        .select(`server_id, role, investment_servers!inner(*)`)
        .eq("user_id", user.id);
      if (data) {
        setServers(data.map((row: any) => ({
          ...row.investment_servers,
          membershipRole: row.role,
        })));
        if (data.length && !activeServerId) setActiveServerId(data[0].server_id);
      }
    };
    fetchServers();
  }, [user, refresh]);

  return (
    <div className="flex h-[calc(100vh-60px)] bg-background border rounded-lg overflow-hidden">
      {/* Servers sidebar */}
      <div className="w-60 bg-muted/30 border-r">
        <InvestmentServersSidebar
          servers={servers}
          activeServerId={activeServerId}
          setActiveServerId={setActiveServerId}
          onRefresh={() => setRefresh(r => r + 1)}
        />
      </div>
      {/* Server Dashboard */}
      <div className="flex-1 flex flex-col">
        {activeServerId ? (
          <ServerDashboard serverId={activeServerId} onRefreshSidebar={() => setRefresh(r => r + 1)} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div>
              <p className="mb-4">Select an Investment Server or join/create a new one.</p>
              <Button onClick={() => setRefresh(r => r + 1)}>Refresh</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
