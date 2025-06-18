
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useYFinanceQuote, useYFinanceMultipleQuotes } from "@/hooks/useYFinanceData";
import { TrendingUp, TrendingDown, Search, Zap, AlertTriangle } from "lucide-react";

interface TerminalMarketDataProps {
  selectedSymbol: string;
  isRealTime: boolean;
  onSymbolSelect: (symbol: string) => void;
}

export const TerminalMarketData = ({ 
  selectedSymbol, 
  isRealTime, 
  onSymbolSelect 
}: TerminalMarketDataProps) => {
  const [searchSymbol, setSearchSymbol] = useState("");
  const [watchedSymbols] = useState(["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA", "AMZN", "META", "NFLX"]);
  
  const { data: selectedQuote, isLoading: selectedLoading } = useYFinanceQuote(selectedSymbol);
  const { data: multipleQuotes, isLoading: multipleLoading } = useYFinanceMultipleQuotes(watchedSymbols);

  const formatPrice = (price: number) => price?.toFixed(2) || "0.00";
  const formatChange = (change: number) => (change >= 0 ? "+" : "") + change?.toFixed(2);
  const formatPercent = (percent: number) => (percent >= 0 ? "+" : "") + percent?.toFixed(2) + "%";

  const handleSearch = () => {
    if (searchSymbol.trim()) {
      onSymbolSelect(searchSymbol.trim().toUpperCase());
      setSearchSymbol("");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Main quote display */}
      <Card className="col-span-2 bg-gray-900 border-green-800">
        <CardHeader className="border-b border-green-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-yellow-400 font-mono text-xl">
              {selectedSymbol} - REAL-TIME QUOTE
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Symbol..."
                  value={searchSymbol}
                  onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-32 bg-black border-green-600 text-green-400"
                />
                <Button 
                  onClick={handleSearch}
                  size="sm"
                  className="bg-green-800 hover:bg-green-700"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              {isRealTime && (
                <Badge className="bg-red-600 text-white animate-pulse">
                  <Zap className="w-3 h-3 mr-1" />
                  LIVE
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {selectedLoading ? (
            <div className="text-center text-green-400">LOADING QUOTE DATA...</div>
          ) : selectedQuote ? (
            <div className="space-y-4">
              {/* Price display */}
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  ${formatPrice(selectedQuote.price)}
                </div>
                <div className={`text-xl font-semibold ${
                  selectedQuote.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatChange(selectedQuote.change)} ({formatPercent(selectedQuote.changePercent)})
                  {selectedQuote.change >= 0 ? 
                    <TrendingUp className="inline w-5 h-5 ml-2" /> : 
                    <TrendingDown className="inline w-5 h-5 ml-2" />
                  }
                </div>
              </div>

              {/* Key metrics grid */}
              <div className="grid grid-cols-2 gap-4 border-t border-green-800 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-400">VOLUME:</span>
                    <span className="text-white">{selectedQuote.volume?.toLocaleString() || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400">MKT CAP:</span>
                    <span className="text-white">
                      {selectedQuote.marketCap ? `$${(selectedQuote.marketCap / 1e9).toFixed(1)}B` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400">P/E RATIO:</span>
                    <span className="text-white">{selectedQuote.peRatio?.toFixed(2) || "N/A"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-400">52W HIGH:</span>
                    <span className="text-white">${formatPrice(selectedQuote.high52Week)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400">52W LOW:</span>
                    <span className="text-white">${formatPrice(selectedQuote.low52Week)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400">DIV YIELD:</span>
                    <span className="text-white">{selectedQuote.dividendYield?.toFixed(2) || "0.00"}%</span>
                  </div>
                </div>
              </div>

              {/* Real-time timestamp */}
              <div className="text-xs text-green-600 text-center border-t border-green-800 pt-2">
                LAST UPDATE: {new Date(selectedQuote.timestamp).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="text-center text-red-400">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              QUOTE DATA UNAVAILABLE
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market overview */}
      <Card className="bg-gray-900 border-green-800">
        <CardHeader className="border-b border-green-800">
          <CardTitle className="text-yellow-400 font-mono">MARKET OVERVIEW</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {multipleLoading ? (
            <div className="text-center text-green-400">LOADING...</div>
          ) : (
            <div className="space-y-2">
              {watchedSymbols.map((symbol) => {
                const quote = multipleQuotes?.[symbol];
                if (!quote) return (
                  <div key={symbol} className="flex justify-between items-center py-1 border-b border-gray-700">
                    <span className="text-red-400">{symbol}</span>
                    <span className="text-red-400 text-xs">ERROR</span>
                  </div>
                );

                return (
                  <div 
                    key={symbol}
                    className="flex justify-between items-center py-1 border-b border-gray-700 cursor-pointer hover:bg-gray-800"
                    onClick={() => onSymbolSelect(symbol)}
                  >
                    <div>
                      <div className="text-white font-semibold">{symbol}</div>
                      <div className="text-xs text-green-400">${formatPrice(quote.price)}</div>
                    </div>
                    <div className={`text-right ${quote.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <div className="font-semibold">{formatChange(quote.change)}</div>
                      <div className="text-xs">{formatPercent(quote.changePercent)}</div>
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
