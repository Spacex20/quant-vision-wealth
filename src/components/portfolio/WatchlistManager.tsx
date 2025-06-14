
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Eye, Trash2, TrendingUp, TrendingDown, Search, X } from "lucide-react";
import { portfolioManager, Watchlist } from "@/services/portfolioManager";
import { StockSearch } from "@/components/stocks/StockSearch";

export const WatchlistManager = () => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>(portfolioManager.getAllWatchlists());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedWatchlist, setSelectedWatchlist] = useState<Watchlist | null>(null);
  const [newWatchlistName, setNewWatchlistName] = useState("");

  // Mock price data for demonstration
  const getStockPrice = (symbol: string) => ({
    price: 100 + Math.random() * 200,
    change: (Math.random() - 0.5) * 10,
    changePercent: (Math.random() - 0.5) * 5
  });

  const handleCreateWatchlist = () => {
    if (!newWatchlistName.trim()) return;
    
    const created = portfolioManager.saveWatchlist({
      name: newWatchlistName,
      symbols: []
    });
    
    setWatchlists(portfolioManager.getAllWatchlists());
    setNewWatchlistName("");
    setIsCreateDialogOpen(false);
  };

  const handleDeleteWatchlist = (id: string) => {
    portfolioManager.deleteWatchlist(id);
    setWatchlists(portfolioManager.getAllWatchlists());
    if (selectedWatchlist?.id === id) {
      setSelectedWatchlist(null);
    }
  };

  const handleAddToWatchlist = (watchlistId: string, symbol: string) => {
    portfolioManager.addToWatchlist(watchlistId, symbol);
    setWatchlists(portfolioManager.getAllWatchlists());
    
    // Update selected watchlist if it's the one being modified
    if (selectedWatchlist?.id === watchlistId) {
      const updated = portfolioManager.getAllWatchlists().find(w => w.id === watchlistId);
      if (updated) setSelectedWatchlist(updated);
    }
  };

  const handleRemoveFromWatchlist = (watchlistId: string, symbol: string) => {
    portfolioManager.removeFromWatchlist(watchlistId, symbol);
    setWatchlists(portfolioManager.getAllWatchlists());
    
    // Update selected watchlist if it's the one being modified
    if (selectedWatchlist?.id === watchlistId) {
      const updated = portfolioManager.getAllWatchlists().find(w => w.id === watchlistId);
      if (updated) setSelectedWatchlist(updated);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Watchlists</h3>
          <p className="text-muted-foreground">
            Track and monitor stocks of interest
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Watchlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Watchlist</DialogTitle>
              <DialogDescription>
                Create a new watchlist to track stocks
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Watchlist Name</label>
                <Input
                  value={newWatchlistName}
                  onChange={(e) => setNewWatchlistName(e.target.value)}
                  placeholder="e.g., Tech Stocks, Dividend Stocks"
                />
              </div>
              <Button onClick={handleCreateWatchlist} className="w-full">
                Create Watchlist
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Watchlist List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>My Watchlists</CardTitle>
            </CardHeader>
            <CardContent>
              {watchlists.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No watchlists yet. Create your first watchlist to get started!
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {watchlists.map((watchlist) => (
                    <div
                      key={watchlist.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedWatchlist?.id === watchlist.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-muted-foreground'
                      }`}
                      onClick={() => setSelectedWatchlist(watchlist)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{watchlist.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {watchlist.symbols.length} stocks
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created {formatDate(watchlist.createdAt)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteWatchlist(watchlist.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Watchlist Details */}
        <div className="lg:col-span-2">
          {selectedWatchlist ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedWatchlist.name}</span>
                    <Badge variant="outline">
                      {selectedWatchlist.symbols.length} stocks
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Last updated {formatDate(selectedWatchlist.updatedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StockSearch
                    onSelectStock={(stock) => handleAddToWatchlist(selectedWatchlist.id, stock.symbol)}
                    placeholder="Add stocks to your watchlist..."
                  />
                </CardContent>
              </Card>

              {selectedWatchlist.symbols.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Stocks in Watchlist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedWatchlist.symbols.map((symbol) => {
                        const priceData = getStockPrice(symbol);
                        return (
                          <div
                            key={symbol}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <div className="font-medium">{symbol}</div>
                              <div className="text-sm text-muted-foreground">
                                Last Price: ${priceData.price.toFixed(2)}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <div className={`flex items-center space-x-1 ${
                                  priceData.change >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {priceData.change >= 0 ? (
                                    <TrendingUp className="h-3 w-3" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3" />
                                  )}
                                  <span className="text-sm">
                                    {priceData.change >= 0 ? '+' : ''}
                                    {priceData.changePercent.toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFromWatchlist(selectedWatchlist.id, symbol)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Alert>
                  <Eye className="h-4 w-4" />
                  <AlertDescription>
                    This watchlist is empty. Use the search above to add stocks to track.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Watchlist</h3>
                  <p className="text-muted-foreground">
                    Choose a watchlist from the left to view and manage its stocks
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
