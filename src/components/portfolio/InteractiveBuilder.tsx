
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Zap, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { AllocationSlider } from "./AllocationSlider";
import { ConstraintsConfig } from "./ConstraintsConfig";
import { StockSearch } from "@/components/stocks/StockSearch";
import { Asset, OptimizationConstraints, portfolioOptimization } from "@/services/portfolioOptimization";

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

  useEffect(() => {
    const result = portfolioOptimization.optimizePortfolio(assets, constraints);
    setOptimizationResult(result);
  }, [assets, constraints]);

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

  const handleAddAsset = (stockData: any) => {
    const newAsset: Asset = {
      symbol: stockData.symbol,
      name: stockData.name,
      allocation: 5,
      expectedReturn: 0.08 + Math.random() * 0.06,
      volatility: 0.15 + Math.random() * 0.15,
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
  };

  const handleOptimize = () => {
    setAssets(optimizationResult.assets);
  };

  const totalAllocation = assets.reduce((sum, asset) => sum + asset.allocation, 0);
  const allocationDiff = Math.abs(100 - totalAllocation);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Asset Allocation Panel */}
      <div className="xl:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>
              Drag sliders to adjust allocations. Total: {totalAllocation.toFixed(1)}%
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
              {assets.map(asset => (
                <AllocationSlider
                  key={asset.symbol}
                  asset={asset}
                  onAllocationChange={handleAllocationChange}
                  onRemoveAsset={handleRemoveAsset}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add New Assets</CardTitle>
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
            
            <Button onClick={handleOptimize} className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Apply Optimization
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
