
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface ChannelInvite {
  id: string;
  channel_id: string;
  inviter_id: string;
  invitee_id: string;
  status: string;
  created_at: string;
}

export function ChannelInviteManager() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [invites, setInvites] = useState<ChannelInvite[]>([]);
  const [loading, setLoading] = useState(false);

  // Load invites for user
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("channel_invites")
      .select("*")
      .eq("invitee_id", user.id)
      .then(({ data }) => setInvites(data || []))
      .catch(() => setInvites([]))
      .finally(() => setLoading(false));
  }, [user, open]);

  const handleAccept = async (invite: ChannelInvite) => {
    if (!user) return;
    await supabase.from("channel_memberships").insert({
      channel_id: invite.channel_id,
      user_id: user.id,
      role: "member"
    });
    await supabase.from("channel_invites").update({ status: "accepted" }).eq("id", invite.id);
    setInvites(invites => invites.map(i => i.id === invite.id ? { ...i, status: "accepted" } : i));
    toast({ title: "Joined Channel", description: "You accepted the invite." });
  };

  const handleReject = async (invite: ChannelInvite) => {
    await supabase.from("channel_invites").update({ status: "rejected" }).eq("id", invite.id);
    setInvites(invites => invites.map(i => i.id === invite.id ? { ...i, status: "rejected" } : i));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start mt-1">
          Invites ({invites.length})
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Channel Invites</DialogTitle>
        </DialogHeader>
        {loading ? "Loading..." : (
          <div className="space-y-2">
            {invites.length === 0 ? (
              <p className="text-sm text-muted-foreground">No invites!</p>
            ) : (
              invites.map(invite => (
                <div key={invite.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-xs">Invite: {invite.id} — Status: {invite.status}</span>
                  {invite.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAccept(invite)}>Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => handleReject(invite)}>Reject</Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
