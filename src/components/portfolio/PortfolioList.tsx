
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Copy, Edit, Plus, Star } from "lucide-react";
import { Portfolio, portfolioManager } from "@/services/portfolioManager";
import { useToast } from "@/hooks/use-toast";

interface PortfolioListProps {
  onSelectPortfolio?: (portfolio: Portfolio) => void;
  selectedPortfolioId?: string;
}

export const PortfolioList = ({ onSelectPortfolio, selectedPortfolioId }: PortfolioListProps) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [newPortfolioDescription, setNewPortfolioDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = () => {
    const allPortfolios = portfolioManager.getAllPortfolios();
    setPortfolios(allPortfolios);
  };

  const handleCreatePortfolio = () => {
    if (!newPortfolioName.trim()) {
      toast({
        title: "Error",
        description: "Portfolio name is required",
        variant: "destructive"
      });
      return;
    }

    const newPortfolio = portfolioManager.savePortfolio({
      name: newPortfolioName,
      description: newPortfolioDescription,
      assets: [],
      totalValue: 0
    });

    setPortfolios(prev => [...prev, newPortfolio]);
    setNewPortfolioName("");
    setNewPortfolioDescription("");
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Portfolio created successfully"
    });
  };

  const handleDeletePortfolio = (id: string) => {
    if (portfolioManager.deletePortfolio(id)) {
      setPortfolios(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Portfolio deleted successfully"
      });
    }
  };

  const handleClonePortfolio = (portfolio: Portfolio) => {
    const cloned = portfolioManager.clonePortfolio(portfolio.id, `${portfolio.name} (Copy)`);
    if (cloned) {
      setPortfolios(prev => [...prev, cloned]);
      toast({
        title: "Success",
        description: "Portfolio cloned successfully"
      });
    }
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">My Portfolios</h3>
          <p className="text-sm text-muted-foreground">Manage and compare your investment portfolios</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
              <DialogDescription>
                Create a new portfolio to start building your investment strategy.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="portfolio-name">Portfolio Name</Label>
                <Input
                  id="portfolio-name"
                  value={newPortfolioName}
                  onChange={(e) => setNewPortfolioName(e.target.value)}
                  placeholder="e.g., Growth Portfolio"
                />
              </div>
              <div>
                <Label htmlFor="portfolio-description">Description (Optional)</Label>
                <Textarea
                  id="portfolio-description"
                  value={newPortfolioDescription}
                  onChange={(e) => setNewPortfolioDescription(e.target.value)}
                  placeholder="Describe your investment strategy..."
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button onClick={handleCreatePortfolio} className="flex-1">Create Portfolio</Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolios.map((portfolio) => (
          <Card 
            key={portfolio.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPortfolioId === portfolio.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectPortfolio?.(portfolio)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <span>{portfolio.name}</span>
                    {portfolio.isDefault && <Star className="h-4 w-4 text-yellow-500" />}
                  </CardTitle>
                  {portfolio.description && (
                    <CardDescription className="text-xs mt-1">
                      {portfolio.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClonePortfolio(portfolio)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  {!portfolio.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePortfolio(portfolio.id)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Value</span>
                  <span className="font-semibold">{formatValue(portfolio.totalValue)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Assets</span>
                  <Badge variant="outline">{portfolio.assets.length}</Badge>
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Top Holdings</span>
                  <div className="flex flex-wrap gap-1">
                    {portfolio.assets.slice(0, 3).map((asset) => (
                      <Badge key={asset.symbol} variant="secondary" className="text-xs">
                        {asset.symbol}
                      </Badge>
                    ))}
                    {portfolio.assets.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{portfolio.assets.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Updated {new Date(portfolio.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {portfolios.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground mb-4">
              <div className="text-lg font-medium mb-2">No portfolios yet</div>
              <p>Create your first portfolio to start managing your investments.</p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Portfolio
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
