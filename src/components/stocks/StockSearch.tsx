
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Plus, AlertTriangle } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { unifiedMarketData, UnifiedSearchResult } from "@/services/unifiedMarketData";

interface StockSearchProps {
  onSelectStock?: (stockData: any) => void;
  placeholder?: string;
}

export const StockSearch = ({ onSelectStock, placeholder = "Search stocks (e.g., RELIANCE, TCS)..." }: StockSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UnifiedSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search term");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await unifiedMarketData.searchStocks(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError("No stocks found matching your search");
      }
    } catch (err) {
      console.error('Search error:', err);
      setError("Failed to search stocks. Please try again.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectStock = async (stock: UnifiedSearchResult) => {
    if (onSelectStock) {
      try {
        // Get detailed quote for the selected stock
        const quote = await unifiedMarketData.getStockQuote(stock.symbol);
        onSelectStock(quote);
      } catch (error) {
        console.error('Error fetching stock details:', error);
        onSelectStock(stock);
      }
    }
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const currentMarket = unifiedMarketData.getCurrentMarket();
  const currentPlaceholder = currentMarket === 'IN' 
    ? "Search Indian stocks (e.g., RELIANCE, TCS, INFY)..."
    : "Search US stocks (e.g., AAPL, MSFT, GOOGL)...";

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder={placeholder || currentPlaceholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setError(null);
          }}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <Button onClick={handleSearch} disabled={isLoading || !searchQuery.trim()}>
          {isLoading ? <LoadingSpinner size="sm" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="text-center py-4">
          <LoadingSpinner text="Searching stocks..." />
        </div>
      )}

      {searchResults.length > 0 && !isLoading && (
        <div className="space-y-2">
          {searchResults.map((stock) => (
            <Card key={`${stock.symbol}-${stock.market}`} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium flex items-center space-x-2">
                      <span>{stock.symbol}</span>
                      <Badge variant="outline" className="text-xs">
                        {stock.exchange || (stock.market === 'IN' ? 'NSE' : 'NASDAQ')}
                      </Badge>
                      {stock.market === 'IN' && <span className="text-xs">🇮🇳</span>}
                      {stock.market === 'US' && <span className="text-xs">🇺🇸</span>}
                    </div>
                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                    {stock.sector && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Sector: {stock.sector}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    {onSelectStock && (
                      <Button
                        size="sm"
                        onClick={() => handleSelectStock(stock)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
