
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { portfolioManager } from '@/services/portfolioManager';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

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
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Portfolio name is required.");
            return;
        }
        if (!user) {
            toast.error("You must be logged in to save a portfolio.");
            return;
        }
        
        setIsSaving(true);
        const savedPortfolio = await portfolioManager.savePortfolio({
            name,
            description,
            assets: assets.map(a => ({ symbol: a.symbol, name: a.name, allocation: a.allocation })),
            totalValue,
        }, user.id);
        
        if (savedPortfolio) {
            toast.success(`Portfolio "${name}" saved successfully!`);
            queryClient.invalidateQueries({ queryKey: ['user_portfolios', user.id] });
            onSave();
            setName('');
            setDescription('');
        }
        setIsSaving(false);
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                setName('');
                setDescription('');
            }
            onOpenChange(isOpen);
        }}>
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
                    <Button onClick={handleSave} disabled={!name.trim() || isSaving}>{isSaving ? 'Saving...' : 'Save Portfolio'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
