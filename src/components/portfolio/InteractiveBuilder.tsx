import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, Search, RefreshCw, Save } from "lucide-react";
import { marketDataService } from "@/services/marketData";
import { SavePortfolioDialog } from "./SavePortfolioDialog";
import { toast } from "sonner";

interface Asset {
  symbol: string;
  name: string;
  allocation: number;
  price: number;
  change: number;
  changePercent: number;
}

interface InteractiveBuilderProps {
  initialAssets?: Asset[];
  initialValue?: number;
}

export const InteractiveBuilder = ({
  initialAssets = [],
  initialValue = 0
}: InteractiveBuilderProps) => {
  // Initialize assets from template/props
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [newAsset, setNewAsset] = useState({ symbol: '', allocation: 5 });
  const [totalAllocation, setTotalAllocation] = useState(0);
  const [balanceError, setBalanceError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  // Re-initialize when template changes
  useEffect(() => {
    setAssets(initialAssets);
  }, [JSON.stringify(initialAssets)]);

  useEffect(() => {
    const sum = assets.reduce((acc, asset) => acc + asset.allocation, 0);
    setTotalAllocation(sum);
    setBalanceError(sum !== 100);
  }, [assets]);

  const handleAddAsset = async () => {
    if (!newAsset.symbol.trim()) return;
    
    try {
      // Use getStockQuote instead of getQuote
      const quote = await marketDataService.getStockQuote(newAsset.symbol);
      
      const asset = {
        symbol: newAsset.symbol.toUpperCase(),
        name: quote?.name || newAsset.symbol,
        allocation: newAsset.allocation,
        price: quote?.price || 0,
        change: quote?.change || 0,
        changePercent: quote?.changePercent || 0
      };

      setAssets([...assets, asset]);
      setNewAsset({ symbol: '', allocation: 5 });
      setSearchTerm('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error fetching asset data:', error);
      // Add asset without market data if API fails
      const asset = {
        symbol: newAsset.symbol.toUpperCase(),
        name: newAsset.symbol,
        allocation: newAsset.allocation,
        price: 0,
        change: 0,
        changePercent: 0
      };

      setAssets([...assets, asset]);
      setNewAsset({ symbol: '', allocation: 5 });
    }
  };

  const handleRemoveAsset = (symbol: string) => {
    setAssets(assets.filter(asset => asset.symbol !== symbol));
  };

  const handleAllocationChange = (symbol: string, allocation: number) => {
    setAssets(assets.map(asset =>
      asset.symbol === symbol ? { ...asset, allocation } : asset
    ));
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const results = await marketDataService.searchStocks(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: any) => {
    setNewAsset({ ...newAsset, symbol: result.symbol });
    setSearchTerm(result.symbol);
    setSearchResults([]);
  };

  // Save or clone functionality can be added here for real use

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Build Your Portfolio</CardTitle>
          <CardDescription>
            Allocate percentages to different assets. Start with a template, then tweak as you wish!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search for asset (e.g., AAPL)"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.length > 2) {
                  handleSearch();
                } else {
                  setSearchResults([]);
                }
              }}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="max-h-40 overflow-y-auto border rounded-md mt-2">
              {searchResults.map((result) => (
                <div
                  key={result.symbol}
                  className="px-3 py-2 hover:bg-secondary cursor-pointer"
                  onClick={() => handleSelectSearchResult(result)}
                >
                  <span className="font-medium">{result.symbol}</span>
                  <span className="text-sm text-muted-foreground ml-2">{result.name}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Asset Symbol (e.g., AAPL)"
              value={newAsset.symbol}
              onChange={(e) => setNewAsset({ ...newAsset, symbol: e.target.value.toUpperCase() })}
            />
            <Input
              type="number"
              placeholder="Allocation (%)"
              value={newAsset.allocation}
              onChange={(e) => setNewAsset({ ...newAsset, allocation: parseFloat(e.target.value) })}
            />
            <Button onClick={handleAddAsset}>
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </div>

          {assets.length === 0 && (
            <Alert>
              <AlertDescription>
                Add assets to your portfolio to start building your investment strategy.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            {assets.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <span className="font-semibold">{asset.name} ({asset.symbol})</span>
                  <Badge variant="outline" className="ml-2">Price: ${asset.price.toFixed(2)}</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <Label className="w-16 text-right font-mono">{asset.allocation}%</Label>
                  <Slider
                    value={[asset.allocation]}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleAllocationChange(asset.symbol, value[0])}
                    className="w-48"
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveAsset(asset.symbol)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {balanceError && (
            <Alert variant="destructive">
              <AlertDescription>
                Total allocation must be 100%. Current total: {totalAllocation}%.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={() => setIsSaveDialogOpen(true)} disabled={balanceError || assets.length === 0}>
                <Save className="h-4 w-4 mr-2" />
                Save Portfolio
            </Button>
          </div>
        </CardContent>
      </Card>
      <SavePortfolioDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        assets={assets}
        totalValue={initialValue}
        onSave={() => {
            toast.success("Portfolio saved successfully!");
            setIsSaveDialogOpen(false);
        }}
      />
    </div>
  );
};
