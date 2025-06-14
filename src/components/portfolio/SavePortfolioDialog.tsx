
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { portfolioManager } from '@/services/portfolioManager';
import { toast } from 'sonner';

interface Asset {
  symbol: string;
  name: string;
  allocation: number;
}

interface SavePortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assets: Asset[];
  totalValue: number;
  onSave: () => void;
}

export const SavePortfolioDialog = ({ open, onOpenChange, assets, totalValue, onSave }: SavePortfolioDialogProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = () => {
        if (!name.trim()) {
            toast.error("Portfolio name is required.");
            return;
        }
        
        portfolioManager.savePortfolio({
            name,
            description,
            assets: assets.map(a => ({ symbol: a.symbol, name: a.name, allocation: a.allocation })),
            totalValue,
        });
        
        onSave();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Save Portfolio</DialogTitle>
                    <DialogDescription>
                        Give your new portfolio a name and a description to save it for later.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" placeholder="e.g., My Growth Portfolio" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input id="description" value={description} onChange={e => setDescription(e.target.value)} className="col-span-3" placeholder="e.g., Long-term tech focus" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!name.trim()}>Save Portfolio</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
