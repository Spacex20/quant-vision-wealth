
import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onJoined: () => void;
}
export function JoinPublicServerDialog({ open, setOpen, onJoined }: Props) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [publicServers, setPublicServers] = useState<any[]>([]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    supabase
      .from("investment_servers")
      .select('*')
      .eq("is_public", true)
      .then(({ data }) => {
        setPublicServers(data || []);
        setLoading(false);
      });
  }, [open]);

  const handleJoin = async (server: any) => {
    if (!user) return;
    setLoading(true);
    // Create membership if not exists
    await supabase.from("investment_server_memberships").upsert({
      user_id: user.id,
      server_id: server.id,
      role: "member"
    });
    setOpen(false);
    onJoined();
    setLoading(false);
  };

  const filteredServers = publicServers.filter((server) =>
    server.name.toLowerCase().includes(search.toLowerCase()) ||
    (server.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Public Server</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Search servers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-3"
        />
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredServers.length === 0 && <div className="text-xs text-muted-foreground">No servers found.</div>}
            {filteredServers.map(server => (
              <div key={server.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-bold text-sm">{server.name}</div>
                  <div className="text-xs text-muted-foreground">{server.description}</div>
                </div>
                <Button size="sm" onClick={() => handleJoin(server)} disabled={loading}>Join</Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
