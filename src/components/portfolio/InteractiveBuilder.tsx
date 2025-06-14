
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Zap, Target, AlertTriangle, CheckCircle, TrendingUp, DollarSign } from "lucide-react";
import { AllocationSlider } from "./AllocationSlider";
import { ConstraintsConfig } from "./ConstraintsConfig";
import { StockSearch } from "@/components/stocks/StockSearch";
import { Asset, OptimizationConstraints, portfolioOptimization } from "@/services/portfolioOptimization";
import { marketDataService } from "@/services/marketDataService";

export const InteractiveBuilder = () => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      allocation: 25,
      expectedReturn: 0.12,
      volatility: 0.22,
      minAllocation: 5,
      maxAllocation: 40
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      allocation: 20,
      expectedReturn: 0.11,
      volatility: 0.20,
      minAllocation: 5,
      maxAllocation: 35
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      allocation: 15,
      expectedReturn: 0.13,
      volatility: 0.25,
      minAllocation: 0,
      maxAllocation: 30
    },
    {
      symbol: "BND",
      name: "Vanguard Total Bond",
      allocation: 25,
      expectedReturn: 0.04,
      volatility: 0.05,
      minAllocation: 10,
      maxAllocation: 60
    },
    {
      symbol: "VTI",
      name: "Vanguard Total Stock",
      allocation: 15,
      expectedReturn: 0.10,
      volatility: 0.18,
      minAllocation: 5,
      maxAllocation: 50
    }
  ]);

  const [constraints, setConstraints] = useState<OptimizationConstraints>({
    minAllocation: 5,
    maxAllocation: 40,
    maxAssets: 10,
    targetReturn: undefined,
    maxRisk: undefined
  });

  const [optimizationResult, setOptimizationResult] = useState(
    portfolioOptimization.optimizePortfolio(assets, constraints)
  );

  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [marketData, setMarketData] = useState<{[key: string]: any}>({});
  const [isLoadingMarketData, setIsLoadingMarketData] = useState(false);

  useEffect(() => {
    const result = portfolioOptimization.optimizePortfolio(assets, constraints);
    setOptimizationResult(result);
  }, [assets, constraints]);

  // Fetch real-time market data for assets
  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoadingMarketData(true);
      const data: {[key: string]: any} = {};
      
      for (const asset of assets) {
        try {
          const quote = await marketDataService.getRealTimeQuote(asset.symbol);
          data[asset.symbol] = quote;
        } catch (error) {
          console.error(`Error fetching data for ${asset.symbol}:`, error);
        }
      }
      
      setMarketData(data);
      setIsLoadingMarketData(false);
    };

    fetchMarketData();
  }, [assets]);

  const handleAllocationChange = (symbol: string, allocation: number) => {
    setAssets(prev => prev.map(asset => 
      asset.symbol === symbol ? { ...asset, allocation } : asset
    ));
  };

  const handleRemoveAsset = (symbol: string) => {
    setAssets(prev => {
      const filtered = prev.filter(asset => asset.symbol !== symbol);
      // Redistribute allocation
      const removedAllocation = prev.find(a => a.symbol === symbol)?.allocation || 0;
      const remaining = filtered.length;
      return filtered.map(asset => ({
        ...asset,
        allocation: asset.allocation + (removedAllocation / remaining)
      }));
    });
  };

  const handleAddAsset = async (stockData: any) => {
    try {
      // Fetch real market data for the new asset
      const fundamentals = await marketDataService.getCompanyFundamentals(stockData.symbol);
      
      const newAsset: Asset = {
        symbol: stockData.symbol,
        name: stockData.name || fundamentals.name,
        allocation: 5,
        expectedReturn: Math.max(0.02, Math.min(0.20, fundamentals.revenueGrowth / 100 || 0.08)),
        volatility: Math.max(0.10, Math.min(0.40, (100 - fundamentals.peRatio) / 100 || 0.20)),
        minAllocation: 0,
        maxAllocation: 30
      };
      
      // Reduce other allocations proportionally
      const totalCurrent = assets.reduce((sum, asset) => sum + asset.allocation, 0);
      const reductionFactor = (totalCurrent - newAsset.allocation) / totalCurrent;
      
      setAssets(prev => [
        ...prev.map(asset => ({
          ...asset,
          allocation: asset.allocation * reductionFactor
        })),
        newAsset
      ]);
    } catch (error) {
      console.error('Error adding asset:', error);
      // Fallback to mock data
      const newAsset: Asset = {
        symbol: stockData.symbol,
        name: stockData.name,
        allocation: 5,
        expectedReturn: 0.08 + Math.random() * 0.06,
        volatility: 0.15 + Math.random() * 0.15,
        minAllocation: 0,
        maxAllocation: 30
      };
      
      const totalCurrent = assets.reduce((sum, asset) => sum + asset.allocation, 0);
      const reductionFactor = (totalCurrent - newAsset.allocation) / totalCurrent;
      
      setAssets(prev => [
        ...prev.map(asset => ({
          ...asset,
          allocation: asset.allocation * reductionFactor
        })),
        newAsset
      ]);
    }
  };

  const handleOptimize = () => {
    setAssets(optimizationResult.assets);
  };

  const totalAllocation = assets.reduce((sum, asset) => sum + asset.allocation, 0);
  const allocationDiff = Math.abs(100 - totalAllocation);

  // Calculate portfolio market value
  const calculatePortfolioMarketValue = () => {
    return assets.reduce((total, asset) => {
      const marketPrice = marketData[asset.symbol]?.price || 100;
      const shares = (portfolioValue * asset.allocation / 100) / marketPrice;
      return total + (shares * marketPrice);
    }, 0);
  };

  const currentMarketValue = calculatePortfolioMarketValue();
  const portfolioGainLoss = currentMarketValue - portfolioValue;
  const portfolioGainLossPercent = (portfolioGainLoss / portfolioValue) * 100;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Asset Allocation Panel */}
      <div className="xl:col-span-2 space-y-4">
        {/* Portfolio Value Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Portfolio Summary</span>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-lg font-bold">${currentMarketValue.toLocaleString()}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Initial Value</div>
                <div className="font-bold">${portfolioValue.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Current Value</div>
                <div className="font-bold">${currentMarketValue.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Gain/Loss</div>
                <div className={`font-bold flex items-center justify-center ${portfolioGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolioGainLoss >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  ${Math.abs(portfolioGainLoss).toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Return %</div>
                <div className={`font-bold ${portfolioGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolioGainLossPercent >= 0 ? '+' : ''}{portfolioGainLossPercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>
              Drag sliders to adjust allocations. Total: {totalAllocation.toFixed(1)}%
              {isLoadingMarketData && <span className="text-blue-600 ml-2">(Loading market data...)</span>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allocationDiff > 1 && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Portfolio allocation is {allocationDiff.toFixed(1)}% off target. 
                  Consider rebalancing.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3">
              {assets.map(asset => {
                const quote = marketData[asset.symbol];
                return (
                  <div key={asset.symbol}>
                    <AllocationSlider
                      asset={asset}
                      onAllocationChange={handleAllocationChange}
                      onRemoveAsset={handleRemoveAsset}
                    />
                    
                    {/* Real-time market data display */}
                    {quote && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div>
                          <span className="text-muted-foreground">Price: </span>
                          <span className="font-medium">${quote.price.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Change: </span>
                          <span className={`font-medium ${quote.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Volume: </span>
                          <span className="font-medium">{(quote.volume / 1000000).toFixed(1)}M</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Shares: </span>
                          <span className="font-medium">
                            {((portfolioValue * asset.allocation / 100) / quote.price).toFixed(0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add New Assets</CardTitle>
            <CardDescription>Search and add stocks with real-time market data</CardDescription>
          </CardHeader>
          <CardContent>
            <StockSearch onSelectStock={handleAddAsset} />
          </CardContent>
        </Card>
      </div>

      {/* Optimization Panel */}
      <div className="space-y-6">
        <ConstraintsConfig
          constraints={constraints}
          onConstraintsChange={setConstraints}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Portfolio Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Expected Return</span>
              <Badge variant="outline">
                {(optimizationResult.expectedReturn * 100).toFixed(1)}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Expected Risk</span>
              <Badge variant="outline">
                {(optimizationResult.expectedRisk * 100).toFixed(1)}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Sharpe Ratio</span>
              <Badge variant={optimizationResult.sharpeRatio > 1.2 ? "default" : "secondary"}>
                {optimizationResult.sharpeRatio.toFixed(2)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Optimization Status</span>
              <Badge variant={optimizationResult.isOptimal ? "default" : "destructive"}>
                {optimizationResult.isOptimal ? (
                  <><CheckCircle className="h-3 w-3 mr-1" />Optimal</>
                ) : (
                  <><AlertTriangle className="h-3 w-3 mr-1" />Suboptimal</>
                )}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Market Value</span>
              <Badge variant="outline">
                ${currentMarketValue.toLocaleString()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {optimizationResult.suggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">{suggestion}</p>
              </div>
            ))}
            
            {/* Market-based suggestions */}
            {portfolioGainLossPercent < -5 && (
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-800">
                  Portfolio is down {Math.abs(portfolioGainLossPercent).toFixed(1)}%. Consider rebalancing or reviewing asset selection.
                </p>
              </div>
            )}
            
            <Button onClick={handleOptimize} className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Apply Optimization
            </Button>
          </CardContent>
        </Card>

        {/* Market Data Status */}
        <Card>
          <CardHeader>
            <CardTitle>Market Data Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {assets.map(asset => (
                <div key={asset.symbol} className="flex justify-between items-center">
                  <span className="text-sm">{asset.symbol}</span>
                  <Badge variant={marketData[asset.symbol] ? "default" : "secondary"}>
                    {marketData[asset.symbol] ? "Live" : "Mock"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
