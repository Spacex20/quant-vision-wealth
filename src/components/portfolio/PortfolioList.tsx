
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit, Trash2, Copy, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { portfolioManager, Portfolio } from "@/services/portfolioManager";

export const PortfolioList = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(portfolioManager.getAllPortfolios());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [newPortfolio, setNewPortfolio] = useState({
    name: "",
    description: "",
    totalValue: 10000
  });

  const handleCreatePortfolio = () => {
    if (!newPortfolio.name.trim()) return;
    
    const created = portfolioManager.savePortfolio({
      name: newPortfolio.name,
      description: newPortfolio.description,
      assets: [],
      totalValue: newPortfolio.totalValue
    });
    
    setPortfolios(portfolioManager.getAllPortfolios());
    setNewPortfolio({ name: "", description: "", totalValue: 10000 });
    setIsCreateDialogOpen(false);
  };

  const handleDeletePortfolio = (id: string) => {
    portfolioManager.deletePortfolio(id);
    setPortfolios(portfolioManager.getAllPortfolios());
  };

  const handleClonePortfolio = (id: string, name: string) => {
    portfolioManager.clonePortfolio(id, `${name} (Copy)`);
    setPortfolios(portfolioManager.getAllPortfolios());
  };

  const handleUpdatePortfolio = () => {
    if (!editingPortfolio) return;
    
    portfolioManager.updatePortfolio(editingPortfolio.id, {
      name: editingPortfolio.name,
      description: editingPortfolio.description
    });
    
    setPortfolios(portfolioManager.getAllPortfolios());
    setEditingPortfolio(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculatePerformance = (portfolio: Portfolio) => {
    const change = (Math.random() - 0.5) * 10;
    return {
      change,
      changePercent: (change / portfolio.totalValue) * 100
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">My Portfolios</h3>
          <p className="text-muted-foreground">Manage and analyze your investment portfolios</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
              <DialogDescription>
                Set up a new portfolio to track your investments
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Portfolio Name</label>
                <Input
                  value={newPortfolio.name}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
                  placeholder="e.g., Growth Portfolio"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                  placeholder="Portfolio strategy and goals..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Initial Value ($)</label>
                <Input
                  type="number"
                  value={newPortfolio.totalValue}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, totalValue: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <Button onClick={handleCreatePortfolio} className="w-full">
                Create Portfolio
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {portfolios.length === 0 && (
        <Alert>
          <AlertDescription>
            You haven't created any portfolios yet. Create your first portfolio to get started!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => {
          const performance = calculatePerformance(portfolio);
          return (
            <Card key={portfolio.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{portfolio.name}</span>
                      {portfolio.isDefault && <Badge variant="outline">Default</Badge>}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {portfolio.description || "No description"}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingPortfolio(portfolio)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleClonePortfolio(portfolio.id, portfolio.name)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {!portfolio.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePortfolio(portfolio.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Total Value</span>
                    </div>
                    <span className="font-medium">${portfolio.totalValue.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {performance.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm text-muted-foreground">Performance</span>
                    </div>
                    <span className={`font-medium ${performance.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {performance.change >= 0 ? '+' : ''}{performance.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Created</span>
                    </div>
                    <span className="text-sm">{formatDate(portfolio.createdAt)}</span>
                  </div>

                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-2">Holdings ({portfolio.assets.length})</div>
                    <div className="space-y-1">
                      {portfolio.assets.slice(0, 3).map((asset) => (
                        <div key={asset.symbol} className="flex justify-between text-xs">
                          <span>{asset.symbol}</span>
                          <span>{asset.allocation.toFixed(1)}%</span>
                        </div>
                      ))}
                      {portfolio.assets.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{portfolio.assets.length - 3} more...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Portfolio Dialog */}
      <Dialog open={!!editingPortfolio} onOpenChange={() => setEditingPortfolio(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Portfolio</DialogTitle>
            <DialogDescription>
              Update portfolio details
            </DialogDescription>
          </DialogHeader>
          {editingPortfolio && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Portfolio Name</label>
                <Input
                  value={editingPortfolio.name}
                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingPortfolio.description || ""}
                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, description: e.target.value })}
                />
              </div>
              <Button onClick={handleUpdatePortfolio} className="w-full">
                Update Portfolio
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
