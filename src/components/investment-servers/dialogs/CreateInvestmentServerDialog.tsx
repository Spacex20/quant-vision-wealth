
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreated: () => void;
}
export function CreateInvestmentServerDialog({ open, setOpen, onCreated }: Props) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#60A5FA");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !user) return;
    setLoading(true);
    const { data, error } = await supabase.from("investment_servers").insert([
      {
        name,
        description,
        created_by: user.id,
        color,
        is_public: isPublic,
      }
    ]).select();
    if (!error && data?.[0]?.id) {
      // Add creator as admin
      await supabase.from("investment_server_memberships").insert({
        user_id: user.id,
        server_id: data[0].id,
        role: "admin"
      });
      setOpen(false);
      setName("");
      setDescription("");
      setColor("#60A5FA");
      setIsPublic(true);
      onCreated();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Investment Server</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="Server Name"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={loading}
          />
          <div className="flex items-center gap-2">
            <span className="text-xs">Color:</span>
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-8 h-8 rounded border"
              disabled={loading}
            />
            <label className="text-xs">Public?</label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={e => setIsPublic(e.target.checked)}
              disabled={loading}
            />
          </div>
          <Button className="w-full" onClick={handleCreate} disabled={loading || !name.trim()}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
