
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";

interface StockSearchProps {
  onSelectStock?: (stockData: any) => void;
}

export const StockSearch = ({ onSelectStock }: StockSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock search results - replace with real API
  const mockResults = [
    { symbol: "TSLA", name: "Tesla Inc.", price: 245.67, change: 2.34 },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 875.23, change: -5.67 },
    { symbol: "AMD", name: "Advanced Micro Devices", price: 165.89, change: 1.23 },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const filtered = mockResults.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setIsLoading(false);
    }, 500);
  };

  const handleSelectStock = (stock: any) => {
    if (onSelectStock) {
      onSelectStock(stock);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Search stocks (e.g., AAPL, Tesla)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-2">
          {searchResults.map((stock) => (
            <Card key={stock.symbol} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-medium">${stock.price}</div>
                      <Badge variant={stock.change >= 0 ? "default" : "destructive"}>
                        {stock.change >= 0 ? "+" : ""}{stock.change}
                      </Badge>
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
