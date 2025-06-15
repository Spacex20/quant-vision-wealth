
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCloneStrategy } from "@/hooks/useSocialTrading";
import { useAuth } from "@/hooks/useAuth";

interface Strategy {
  id: string;
  name: string;
  description?: string;
}

interface CloneStrategyModalProps {
  open: boolean;
  onClose: () => void;
  strategy: Strategy | null;
}

export function CloneStrategyModal({ open, onClose, strategy }: CloneStrategyModalProps) {
  const [name, setName] = useState(strategy?.name || "");
  const [note, setNote] = useState("");
  const { user } = useAuth();
  const clone = useCloneStrategy();

  const handleClose = () => {
    setName(strategy?.name || "");
    setNote("");
    onClose();
  };

  const handleClone = async () => {
    if (!strategy?.id || !user?.id) return;
    
    try {
      await clone.mutateAsync({ 
        strategy_id: strategy.id, 
        user_id: user.id, 
        name: name || strategy.name, 
        note 
      });
      handleClose();
    } catch (error) {
      console.error("Failed to clone strategy:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clone & Import Strategy</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Portfolio Name" 
          />
          <Textarea 
            value={note} 
            onChange={e => setNote(e.target.value)} 
            placeholder="Short note (optional)" 
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleClone}
            disabled={clone.isPending || !user || !strategy}
          >
            {clone.isPending ? "Cloning..." : "Clone"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
