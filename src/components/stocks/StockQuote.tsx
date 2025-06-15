
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { unifiedMarketData, UnifiedStockQuote } from "@/services/unifiedMarketData";

interface StockQuoteProps {
  symbol: string;
  showDetails?: boolean;
}

export const StockQuote = ({ symbol, showDetails = true }: StockQuoteProps) => {
  const [quote, setQuote] = useState<UnifiedStockQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchQuote = async () => {
    setIsLoading(true);
    try {
      const data = await unifiedMarketData.getStockQuote(symbol);
      setQuote(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchQuote, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  if (isLoading && !quote) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quote) return null;

  const isPositive = quote.change >= 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center space-x-2">
              <span>{quote.symbol}</span>
              <Badge variant="outline">
                {quote.exchange || (quote.market === 'IN' ? 'NSE' : 'NASDAQ')}
              </Badge>
              {quote.market === 'IN' && <span>🇮🇳</span>}
              {quote.market === 'US' && <span>🇺🇸</span>}
            </CardTitle>
            <div className="text-sm text-muted-foreground">{quote.name}</div>
            {lastUpdated && (
              <CardDescription>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </CardDescription>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchQuote}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="text-3xl font-bold">
            {unifiedMarketData.formatCurrency(quote.price)}
          </div>
          <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="font-medium">
              {isPositive ? '+' : ''}{unifiedMarketData.formatCurrency(quote.change)}
            </span>
            <span className="text-sm">
              ({isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {showDetails && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Volume</span>
                <span className="text-sm font-medium">
                  {(quote.volume / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">P/E Ratio</span>
                <span className="text-sm font-medium">{quote.peRatio.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Dividend Yield</span>
                <span className="text-sm font-medium">{quote.dividendYield.toFixed(2)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">52W High</span>
                <span className="text-sm font-medium">
                  {unifiedMarketData.formatCurrency(quote.fiftyTwoWeekHigh)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">52W Low</span>
                <span className="text-sm font-medium">
                  {unifiedMarketData.formatCurrency(quote.fiftyTwoWeekLow)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Market Cap</span>
                <span className="text-sm font-medium">
                  {unifiedMarketData.formatMarketCap(quote.marketCap)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
