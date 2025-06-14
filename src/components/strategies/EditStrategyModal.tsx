
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Strategy } from "@/data/strategies";

interface EditStrategyModalProps {
  open: boolean;
  onClose: () => void;
  strategy: Strategy;
  simulationAmount: number;
  onSave: (newAllocation: { allocation: { asset: string; weight: number; etf?: string }[]; name: string }) => void;
}

export function EditStrategyModal({ open, onClose, strategy, simulationAmount, onSave }: EditStrategyModalProps) {
  // Copy allocation for editing
  const [allocations, setAllocations] = useState(
    strategy.allocation.map(a => ({ ...a }))
  );
  const [name, setName] = useState(strategy.name + " (My Custom)");
  const [saving, setSaving] = useState(false);

  // Update allocation weights
  const handleWeightChange = (idx: number, value: number) => {
    const next = [...allocations];
    next[idx].weight = value;
    setAllocations(next);
  };

  // Handle save
  const handleSave = () => {
    setSaving(true);
    onSave({ allocation: allocations, name });
    setSaving(false);
    onClose();
  };

  // Compute weight sum and show a warning if it's not 100
  const totalWeight = allocations.reduce((sum, a) => sum + Number(a.weight), 0);
  const overAllocated = Math.abs(totalWeight - 100) > 0.5;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Strategy Allocation</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Label>Custom Strategy Name</Label>
          <Input value={name} onChange={e => setName(e.target.value)} className="mb-2" />

          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-1">Asset Class</th>
                <th className="text-left py-1">ETF/Example</th>
                <th className="text-right py-1">Weight (%)</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((a, idx) => (
                <tr key={a.asset}>
                  <td>{a.asset}</td>
                  <td>{a.etf || "N/A"}</td>
                  <td>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={a.weight}
                      onChange={e => handleWeightChange(idx, Number(e.target.value))}
                      className="w-20 text-right"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right text-xs">
            Total: <span className={overAllocated ? "text-red-500 font-bold" : "font-semibold"}>{totalWeight}%</span>
            {overAllocated && <span className="ml-2 text-red-500">(Must be 100%)</span>}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleSave} disabled={saving || overAllocated}>{saving ? "Saving..." : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

