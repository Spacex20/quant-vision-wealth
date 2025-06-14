
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { financialApi } from "@/services/financialApi";

interface Stock {
  symbol: string;
  name: string;
}

interface StockSearchProps {
  onStockSelect: (symbol: string) => void;
  placeholder?: string;
}

export const StockSearch = ({ onStockSelect, placeholder = "Search stocks..." }: StockSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length > 1) {
      setIsLoading(true);
      const searchStocks = async () => {
        try {
          const stocks = await financialApi.searchStocks(query);
          setResults(stocks);
          setShowResults(true);
        } catch (error) {
          console.error('Error searching stocks:', error);
        } finally {
          setIsLoading(false);
        }
      };

      const debounceTimer = setTimeout(searchStocks, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  const handleStockSelect = (symbol: string) => {
    onStockSelect(symbol);
    setQuery("");
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
          onFocus={() => query.length > 1 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
      </div>

      {showResults && (
        <Card className="absolute top-full mt-1 w-full z-50 max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                Searching...
              </div>
            ) : results.length > 0 ? (
              results.map((stock) => (
                <Button
                  key={stock.symbol}
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto"
                  onClick={() => handleStockSelect(stock.symbol)}
                >
                  <div className="text-left">
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                  </div>
                  <Plus className="h-4 w-4" />
                </Button>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No stocks found
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
