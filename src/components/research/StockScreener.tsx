
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, TrendingUp, TrendingDown } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { marketDataService, CompanyFundamentals } from "@/services/marketDataService";

interface ScreenerCriteria {
  sector?: string;
  minMarketCap: number;
  maxMarketCap: number;
  minPE: number;
  maxPE: number;
  minROE: number;
  maxROE: number;
  minDividendYield: number;
  maxDividendYield: number;
  minProfitMargin: number;
  maxProfitMargin: number;
}

export const StockScreener = () => {
  const [criteria, setCriteria] = useState<ScreenerCriteria>({
    minMarketCap: 0,
    maxMarketCap: 5000,
    minPE: 0,
    maxPE: 50,
    minROE: 0,
    maxROE: 50,
    minDividendYield: 0,
    maxDividendYield: 10,
    minProfitMargin: 0,
    maxProfitMargin: 50,
  });
  
  const [results, setResults] = useState<CompanyFundamentals[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const sectors = [
    'Technology', 'Healthcare', 'Financial Services', 'Consumer Cyclical',
    'Communication Services', 'Industrials', 'Consumer Defensive', 'Energy',
    'Utilities', 'Real Estate', 'Basic Materials'
  ];

  const runScreener = async () => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // In a real implementation, this would call a backend API with the screening criteria
      // For demo purposes, we'll generate mock results based on criteria
      const mockSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'PYPL', 'CRM'];
      
      const screenerResults: CompanyFundamentals[] = [];
      
      for (const symbol of mockSymbols) {
        const fundamentals = await marketDataService.getCompanyFundamentals(symbol);
        
        // Apply screening criteria
        const passesScreen = (
          (!criteria.sector || fundamentals.sector === criteria.sector) &&
          (fundamentals.marketCap / 1000000000 >= criteria.minMarketCap) &&
          (fundamentals.marketCap / 1000000000 <= criteria.maxMarketCap) &&
          (fundamentals.peRatio >= criteria.minPE) &&
          (fundamentals.peRatio <= criteria.maxPE) &&
          (fundamentals.roe >= criteria.minROE) &&
          (fundamentals.roe <= criteria.maxROE) &&
          (fundamentals.dividendYield >= criteria.minDividendYield) &&
          (fundamentals.dividendYield <= criteria.maxDividendYield) &&
          (fundamentals.profitMargin >= criteria.minProfitMargin) &&
          (fundamentals.profitMargin <= criteria.maxProfitMargin)
        );
        
        if (passesScreen) {
          screenerResults.push(fundamentals);
        }
      }
      
      setResults(screenerResults);
    } catch (error) {
      console.error('Error running stock screener:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setCriteria({
      minMarketCap: 0,
      maxMarketCap: 5000,
      minPE: 0,
      maxPE: 50,
      minROE: 0,
      maxROE: 50,
      minDividendYield: 0,
      maxDividendYield: 10,
      minProfitMargin: 0,
      maxProfitMargin: 50,
    });
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Stock Screener</h2>
        <p className="text-muted-foreground">
          Find stocks that match your investment criteria
        </p>
      </div>

      {/* Screening Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Screening Criteria</span>
          </CardTitle>
          <CardDescription>Set your investment parameters to filter stocks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sector Selection */}
          <div className="space-y-2">
            <Label>Sector</Label>
            <Select
              value={criteria.sector || ''}
              onValueChange={(value) => setCriteria(prev => ({ ...prev, sector: value || undefined }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All sectors</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Market Cap Range */}
          <div className="space-y-3">
            <Label>Market Cap (Billions)</Label>
            <div className="px-2">
              <Slider
                value={[criteria.minMarketCap, criteria.maxMarketCap]}
                onValueChange={(values) => setCriteria(prev => ({
                  ...prev,
                  minMarketCap: values[0],
                  maxMarketCap: values[1]
                }))}
                max={5000}
                step={10}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${criteria.minMarketCap}B</span>
              <span>${criteria.maxMarketCap}B</span>
            </div>
          </div>

          {/* P/E Ratio Range */}
          <div className="space-y-3">
            <Label>P/E Ratio</Label>
            <div className="px-2">
              <Slider
                value={[criteria.minPE, criteria.maxPE]}
                onValueChange={(values) => setCriteria(prev => ({
                  ...prev,
                  minPE: values[0],
                  maxPE: values[1]
                }))}
                max={50}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{criteria.minPE}</span>
              <span>{criteria.maxPE}</span>
            </div>
          </div>

          {/* ROE Range */}
          <div className="space-y-3">
            <Label>Return on Equity (%)</Label>
            <div className="px-2">
              <Slider
                value={[criteria.minROE, criteria.maxROE]}
                onValueChange={(values) => setCriteria(prev => ({
                  ...prev,
                  minROE: values[0],
                  maxROE: values[1]
                }))}
                max={50}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{criteria.minROE}%</span>
              <span>{criteria.maxROE}%</span>
            </div>
          </div>

          {/* Dividend Yield Range */}
          <div className="space-y-3">
            <Label>Dividend Yield (%)</Label>
            <div className="px-2">
              <Slider
                value={[criteria.minDividendYield, criteria.maxDividendYield]}
                onValueChange={(values) => setCriteria(prev => ({
                  ...prev,
                  minDividendYield: values[0],
                  maxDividendYield: values[1]
                }))}
                max={10}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{criteria.minDividendYield.toFixed(1)}%</span>
              <span>{criteria.maxDividendYield.toFixed(1)}%</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button onClick={runScreener} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Run Screen
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle>Screening Results</CardTitle>
            <CardDescription>
              {isLoading 
                ? 'Searching for stocks...' 
                : `Found ${results.length} stocks matching your criteria`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <LoadingSpinner text="Analyzing stocks..." />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No stocks found matching your criteria. Try adjusting your filters.
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((stock) => (
                  <div key={stock.symbol} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{stock.symbol}</h4>
                          <Badge variant="outline">{stock.sector}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${(stock.marketCap / 1000000000).toFixed(1)}B</div>
                        <div className="text-sm text-muted-foreground">Market Cap</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">P/E Ratio</div>
                        <div className="font-medium">{stock.peRatio.toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">ROE</div>
                        <div className="font-medium">{stock.roe.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Profit Margin</div>
                        <div className="font-medium">{stock.profitMargin.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Dividend Yield</div>
                        <div className="font-medium">{stock.dividendYield.toFixed(2)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Debt/Equity</div>
                        <div className="font-medium">{stock.debtToEquity.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
