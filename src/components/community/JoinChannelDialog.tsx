
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export function JoinChannelDialog({ onJoined }: { onJoined?: () => void }) {
  const [open, setOpen] = useState(false);
  const [inviteId, setInviteId] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleJoin = async () => {
    if (!inviteId || !user) return;
    setLoading(true);
    try {
      // Lookup invite by code or channel
      const { data: invite, error } = await supabase
        .from("channel_invites")
        .select("*")
        .eq("id", inviteId)
        .maybeSingle();
      if (error || !invite) throw new Error("Invite not found");
      if (invite.invitee_id !== user.id) throw new Error("Invite not for you");

      // Accept: add to memberships, update invite
      await supabase.from("channel_memberships").insert({
        channel_id: invite.channel_id,
        user_id: user.id,
        role: "member"
      });
      await supabase.from("channel_invites").update({ status: "accepted" }).eq("id", inviteId);

      toast({ title: "Joined Channel", description: "You joined the channel!" });
      setOpen(false);
      setInviteId("");
      onJoined?.();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          + Join Channel (Invite)
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Channel with Invite</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Paste invite code or ID..."
          value={inviteId}
          onChange={e => setInviteId(e.target.value)}
        />
        <Button onClick={handleJoin} disabled={loading || !inviteId.trim()}>
          {loading ? "Joining..." : "Join"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
