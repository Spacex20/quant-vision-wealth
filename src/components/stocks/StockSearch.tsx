
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Plus, AlertTriangle } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { financialApi } from "@/services/financialApi";

interface StockSearchProps {
  onSelectStock?: (stockData: any) => void;
  placeholder?: string;
}

export const StockSearch = ({ onSelectStock, placeholder = "Search stocks (e.g., AAPL, Tesla)..." }: StockSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
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
      const results = await financialApi.searchStocks(searchQuery);
      
      // Add mock price data to search results
      const enhancedResults = results.map(stock => ({
        ...stock,
        price: 100 + Math.random() * 200,
        change: (Math.random() - 0.5) * 10
      }));
      
      setSearchResults(enhancedResults);
      
      if (enhancedResults.length === 0) {
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

  const handleSelectStock = (stock: any) => {
    if (onSelectStock) {
      onSelectStock(stock);
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

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder={placeholder}
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
            <Card key={`${stock.symbol}-${stock.name}`} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-medium">${stock.price?.toFixed(2) || 'N/A'}</div>
                      {stock.change !== undefined && (
                        <Badge variant={stock.change >= 0 ? "default" : "destructive"}>
                          {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}
                        </Badge>
                      )}
                    </div>
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
