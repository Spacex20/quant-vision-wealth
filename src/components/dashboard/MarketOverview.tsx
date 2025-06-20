
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { unifiedMarketData, UnifiedStockQuote } from "@/services/unifiedMarketData";
import { MarketSelector } from "@/components/common/MarketSelector";

export const MarketOverview = () => {
  const [quotes, setQuotes] = useState<UnifiedStockQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      const topStocks = unifiedMarketData.getTopStocks();
      const marketQuotes = await unifiedMarketData.getMultipleQuotes(topStocks);
      setQuotes(marketQuotes);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const handleMarketChange = () => {
    fetchMarketData();
  };

  return (
    <div className="space-y-4">
      <MarketSelector onMarketChange={handleMarketChange} />
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Market Overview</CardTitle>
              <CardDescription>
                {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMarketData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && quotes.length === 0 ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-3 border rounded">
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {quotes.map((quote) => {
                const isPositive = quote.change >= 0;
                return (
                  <div key={quote.symbol} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium flex items-center space-x-2">
                          <span>{quote.symbol}</span>
                          {quote.market === 'IN' && <Badge variant="outline" className="text-xs">NSE</Badge>}
                          {quote.market === 'US' && <Badge variant="outline" className="text-xs">NASDAQ</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {unifiedMarketData.formatCurrency(quote.price)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span className="text-sm font-medium">
                          {isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isPositive ? '+' : ''}{unifiedMarketData.formatCurrency(quote.change)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
