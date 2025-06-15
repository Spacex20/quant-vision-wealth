
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Props {
  onChannelCreated?: () => void;
}

export default function CreateChannelDialog({ onChannelCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isDM, setIsDM] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("channels")
        .insert({
          name,
          is_dm: isDM,
          is_private: isPrivate,
          category: category || "Community"
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-join creator as member
      await supabase.from("channel_memberships").insert({
        channel_id: data.id,
        user_id: user.id,
        role: "admin"
      });

      toast({
        title: "Channel created",
        description: `#${name} created${isPrivate ? " (Private)" : ""}`,
      });
      setOpen(false);
      setName("");
      setIsDM(false);
      setIsPrivate(false);
      setCategory("");
      onChannelCreated?.();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground mt-4 hover:text-foreground">
          + Create Channel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Channel</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Channel name" />
          <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <Checkbox checked={isPrivate} onCheckedChange={() => setIsPrivate(v => !v)} /> Private
            </label>
            <label className="flex items-center gap-2">
              <Checkbox checked={isDM} onCheckedChange={() => setIsDM(v => !v)} /> Direct Message
            </label>
          </div>
          <Button onClick={handleCreate} disabled={loading || !name.trim()}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
