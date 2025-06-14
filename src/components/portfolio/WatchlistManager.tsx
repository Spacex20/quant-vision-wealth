
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Eye, TrendingUp, TrendingDown } from "lucide-react";
import { Watchlist, portfolioManager } from "@/services/portfolioManager";
import { StockSearch } from "@/components/stocks/StockSearch";
import { useToast } from "@/hooks/use-toast";

export const WatchlistManager = () => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState<Watchlist | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const { toast } = useToast();

  // Mock stock data for display
  const mockStockData = {
    'AAPL': { price: 175.43, change: 2.34, changePercent: 1.35 },
    'MSFT': { price: 378.85, change: -1.23, changePercent: -0.32 },
    'GOOGL': { price: 125.67, change: 3.45, changePercent: 2.82 },
    'TSLA': { price: 245.89, change: -8.76, changePercent: -3.44 },
    'NVDA': { price: 875.23, change: 15.67, changePercent: 1.83 },
    'META': { price: 325.45, change: 4.56, changePercent: 1.42 },
  };

  useEffect(() => {
    loadWatchlists();
  }, []);

  const loadWatchlists = () => {
    const allWatchlists = portfolioManager.getAllWatchlists();
    setWatchlists(allWatchlists);
    
    // Create default watchlist if none exist
    if (allWatchlists.length === 0) {
      const defaultWatchlist = portfolioManager.saveWatchlist({
        name: "My Watchlist",
        symbols: ["AAPL", "MSFT", "GOOGL"]
      });
      setWatchlists([defaultWatchlist]);
      setSelectedWatchlist(defaultWatchlist);
    } else {
      setSelectedWatchlist(allWatchlists[0]);
    }
  };

  const handleCreateWatchlist = () => {
    if (!newWatchlistName.trim()) {
      toast({
        title: "Error",
        description: "Watchlist name is required",
        variant: "destructive"
      });
      return;
    }

    const newWatchlist = portfolioManager.saveWatchlist({
      name: newWatchlistName,
      symbols: []
    });

    setWatchlists(prev => [...prev, newWatchlist]);
    setSelectedWatchlist(newWatchlist);
    setNewWatchlistName("");
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Watchlist created successfully"
    });
  };

  const handleDeleteWatchlist = (id: string) => {
    if (portfolioManager.deleteWatchlist(id)) {
      setWatchlists(prev => prev.filter(w => w.id !== id));
      if (selectedWatchlist?.id === id) {
        setSelectedWatchlist(watchlists.find(w => w.id !== id) || null);
      }
      toast({
        title: "Success",
        description: "Watchlist deleted successfully"
      });
    }
  };

  const handleAddToWatchlist = (stockData: any) => {
    if (!selectedWatchlist) return;
    
    if (portfolioManager.addToWatchlist(selectedWatchlist.id, stockData.symbol)) {
      const updated = portfolioManager.getAllWatchlists().find(w => w.id === selectedWatchlist.id);
      if (updated) {
        setSelectedWatchlist(updated);
        setWatchlists(prev => prev.map(w => w.id === updated.id ? updated : w));
        toast({
          title: "Success",
          description: `${stockData.symbol} added to watchlist`
        });
      }
    } else {
      toast({
        title: "Info",
        description: "Stock is already in watchlist",
        variant: "default"
      });
    }
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    if (!selectedWatchlist) return;
    
    if (portfolioManager.removeFromWatchlist(selectedWatchlist.id, symbol)) {
      const updated = portfolioManager.getAllWatchlists().find(w => w.id === selectedWatchlist.id);
      if (updated) {
        setSelectedWatchlist(updated);
        setWatchlists(prev => prev.map(w => w.id === updated.id ? updated : w));
        toast({
          title: "Success",
          description: `${symbol} removed from watchlist`
        });
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Watchlists</h3>
          <p className="text-sm text-muted-foreground">
            Track your favorite stocks and monitor market movements
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Watchlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Watchlist</DialogTitle>
              <DialogDescription>
                Create a custom watchlist to track specific stocks.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="watchlist-name">Watchlist Name</Label>
                <Input
                  id="watchlist-name"
                  value={newWatchlistName}
                  onChange={(e) => setNewWatchlistName(e.target.value)}
                  placeholder="e.g., Tech Stocks"
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button onClick={handleCreateWatchlist} className="flex-1">
                  Create Watchlist
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedWatchlist?.id || ""} onValueChange={(value) => {
        const watchlist = watchlists.find(w => w.id === value);
        setSelectedWatchlist(watchlist || null);
      }}>
        <div className="flex items-center justify-between">
          <TabsList>
            {watchlists.map((watchlist) => (
              <TabsTrigger key={watchlist.id} value={watchlist.id} className="relative">
                {watchlist.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {watchlist.symbols.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {selectedWatchlist && watchlists.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteWatchlist(selectedWatchlist.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {watchlists.map((watchlist) => (
          <TabsContent key={watchlist.id} value={watchlist.id} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Stocks */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Add Stocks</CardTitle>
                    <CardDescription>Search and add stocks to your watchlist</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StockSearch onSelectStock={handleAddToWatchlist} />
                  </CardContent>
                </Card>
              </div>

              {/* Watchlist Stocks */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span>{watchlist.name}</span>
                    </CardTitle>
                    <CardDescription>
                      {watchlist.symbols.length} stocks being tracked
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {watchlist.symbols.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="text-lg font-medium mb-2">No stocks in watchlist</div>
                        <p>Add some stocks to start tracking their performance.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {watchlist.symbols.map((symbol) => {
                          const data = mockStockData[symbol as keyof typeof mockStockData] || {
                            price: 100 + Math.random() * 200,
                            change: (Math.random() - 0.5) * 10,
                            changePercent: (Math.random() - 0.5) * 5
                          };
                          
                          return (
                            <div key={symbol} className="flex items-center justify-between p-3 border rounded hover:bg-muted/30 transition-colors">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <div className="font-medium">{symbol}</div>
                                  <div className="text-sm text-muted-foreground">
                                    Last updated: 2 min ago
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <div className="font-medium">{formatCurrency(data.price)}</div>
                                  <div className={`text-sm flex items-center ${
                                    data.change >= 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {data.change >= 0 ? (
                                      <TrendingUp className="h-3 w-3 mr-1" />
                                    ) : (
                                      <TrendingDown className="h-3 w-3 mr-1" />
                                    )}
                                    {formatCurrency(Math.abs(data.change))} ({formatPercentage(data.changePercent)})
                                  </div>
                                </div>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveFromWatchlist(symbol)}
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {watchlists.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground mb-4">
              <div className="text-lg font-medium mb-2">No watchlists yet</div>
              <p>Create your first watchlist to start tracking stocks.</p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Watchlist
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
