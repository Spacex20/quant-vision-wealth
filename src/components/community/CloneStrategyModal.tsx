
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCloneStrategy } from "@/hooks/useSocialTrading";
import { useAuth } from "@/hooks/useAuth";

export function CloneStrategyModal({ open, onClose, strategy }: any) {
  const [name, setName] = useState(strategy?.name || "");
  const [note, setNote] = useState("");
  const { user } = useAuth();
  const clone = useCloneStrategy();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clone & Import Strategy</DialogTitle>
        </DialogHeader>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Portfolio Name" className="mb-2"/>
        <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Short note (optional)" />
        <DialogFooter>
          <Button 
            onClick={() => {
              if (!strategy?.id) return;
              clone.mutate({ strategy_id: strategy.id, user_id: user?.id, name, note });
              onClose();
            }}
            disabled={clone.isPending || !user}
          >
            {clone.isPending ? "Cloning..." : "Clone"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
