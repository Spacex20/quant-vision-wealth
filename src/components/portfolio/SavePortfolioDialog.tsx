
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface SavePortfolioDialogProps {
  open: boolean;
  defaultName: string;
  onClose: () => void;
  onSave: (data: { name: string; notes: string }) => void;
}

export function SavePortfolioDialog({ open, defaultName, onClose, onSave }: SavePortfolioDialogProps) {
  const [name, setName] = useState(defaultName);
  const [notes, setNotes] = useState("");
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Portfolio</DialogTitle>
          <DialogDescription>
            Give your portfolio a custom name and add some notes for future reference.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label>Portfolio Name</Label>
          <Input value={name} onChange={e => setName(e.target.value)} />
          <Label>Notes</Label>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            onSave({ name, notes });
            onClose();
          }}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
