import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, Minus, TrendingUp, TrendingDown, DollarSign, Percent, Target, AlertCircle, CheckCircle } from "lucide-react";
import { marketDataService } from "@/services/marketDataService";

interface Asset {
  id: string;
  symbol: string;
  name: string;
  allocation: number;
  price: number;
  change: number;
  changePercent: number;
  value: number;
}

interface PortfolioMetrics {
  totalValue: number;
  targetAllocation: number;
  currentAllocation: number;
  riskScore: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#d0ed57'];

const initialMetrics: PortfolioMetrics = {
  totalValue: 100000,
  targetAllocation: 100,
  currentAllocation: 0,
  riskScore: 0
};

export const InteractiveBuilder = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newAsset, setNewAsset] = useState({ symbol: "", allocation: "" });
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics>(initialMetrics);
  const [allocationComplete, setAllocationComplete] = useState(false);
  const [riskLevel, setRiskLevel] = useState<"low" | "moderate" | "high">("moderate");

  useEffect(() => {
    updatePortfolioMetrics(assets);
    setAllocationComplete(portfolioMetrics.currentAllocation === portfolioMetrics.targetAllocation);
  }, [assets, portfolioMetrics.currentAllocation, portfolioMetrics.targetAllocation]);

  const addAsset = async () => {
    if (!newAsset.symbol || !newAsset.allocation) return;
    
    try {
      const quote = await marketDataService.getQuote(newAsset.symbol);
      const asset: Asset = {
        id: Date.now().toString(),
        symbol: newAsset.symbol.toUpperCase(),
        name: quote?.name || newAsset.symbol.toUpperCase(),
        allocation: parseFloat(newAsset.allocation),
        price: quote?.price || 0,
        change: quote?.change || 0,
        changePercent: quote?.changePercent || 0,
        value: 0
      };
      
      const newAssets = [...assets, asset];
      const normalizedAssets = normalizeAllocations(newAssets);
      setAssets(normalizedAssets);
      setNewAsset({ symbol: "", allocation: "" });
      updatePortfolioMetrics(normalizedAssets);
    } catch (error) {
      console.error("Error adding asset:", error);
    }
  };

  const removeAsset = (id: string) => {
    const updatedAssets = assets.filter((asset) => asset.id !== id);
    const normalizedAssets = normalizeAllocations(updatedAssets);
    setAssets(normalizedAssets);
    updatePortfolioMetrics(normalizedAssets);
  };

  const updateAllocation = (id: string, newAllocation: number) => {
    const updatedAssets = assets.map((asset) =>
      asset.id === id ? { ...asset, allocation: newAllocation } : asset
    );
    const normalizedAssets = normalizeAllocations(updatedAssets);
    setAssets(normalizedAssets);
    updatePortfolioMetrics(normalizedAssets);
  };

  const normalizeAllocations = (assetList: Asset[]): Asset[] => {
    const totalAllocation = assetList.reduce((sum, asset) => sum + asset.allocation, 0);
    return assetList.map(asset => ({
      ...asset,
      allocation: parseFloat((asset.allocation / totalAllocation * 100).toFixed(2))
    }));
  };

  const updatePortfolioMetrics = (assetList: Asset[]) => {
    const currentAllocation = assetList.reduce((sum, asset) => sum + asset.allocation, 0);
  
    // Basic risk score calculation (can be expanded)
    let riskScore = 0;
    if (assetList.length > 0) {
      riskScore = assetList.reduce((sum, asset) => {
        // Example: Higher allocation to a volatile stock increases risk
        return sum + (Math.abs(asset.changePercent) * asset.allocation);
      }, 0) / assetList.length;
    }
  
    setPortfolioMetrics(prevMetrics => ({
      ...prevMetrics,
      currentAllocation: parseFloat(currentAllocation.toFixed(2)),
      riskScore: parseFloat(riskScore.toFixed(2))
    }));
  
    if (riskScore < 5) setRiskLevel("low");
    else if (riskScore < 10) setRiskLevel("moderate");
    else setRiskLevel("high");
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? "text-green-600" : "text-red-600";
    
    return (
      <div className={`flex items-center space-x-1 ${colorClass}`}>
        <Icon className="h-3 w-3" />
        <span className="text-xs">
          {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Composition</CardTitle>
          <CardDescription>
            Design your ideal portfolio by adding assets and adjusting allocations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="asset-symbol">Asset Symbol</Label>
              <Input
                type="text"
                id="asset-symbol"
                placeholder="e.g., AAPL"
                value={newAsset.symbol}
                onChange={(e) => setNewAsset({ ...newAsset, symbol: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="asset-allocation">Allocation (%)</Label>
              <Input
                type="number"
                id="asset-allocation"
                placeholder="e.g., 25"
                value={newAsset.allocation}
                onChange={(e) => setNewAsset({ ...newAsset, allocation: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={addAsset} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </CardContent>
      </Card>

      {assets.length === 0 ? (
        <Alert>
          <AlertDescription>
            Add assets to your portfolio to start building your investment strategy.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Portfolio</CardTitle>
              <CardDescription>Adjust allocations to meet your investment goals.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asset
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Change
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Allocation
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assets.map((asset) => (
                      <tr key={asset.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                              <div className="text-sm text-gray-500">{asset.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${asset.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatChange(asset.change, asset.changePercent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Input
                              type="number"
                              className="w-24 text-sm"
                              value={asset.allocation}
                              onChange={(e) => {
                                const newAllocation = parseFloat(e.target.value);
                                if (!isNaN(newAllocation)) {
                                  updateAllocation(asset.id, newAllocation);
                                }
                              }}
                            />
                            <Percent className="h-4 w-4 ml-1 text-gray-500" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button variant="ghost" size="sm" onClick={() => removeAsset(asset.id)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Metrics</CardTitle>
              <CardDescription>
                Understand your portfolio's overall composition and risk level.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Current Allocation: {portfolioMetrics.currentAllocation}%
                  </div>
                  <Progress value={portfolioMetrics.currentAllocation} max={100} />
                  {allocationComplete ? (
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Allocation Complete!
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-red-600 mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Allocation Incomplete
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Risk Level: {riskLevel}
                  </div>
                  <div className="text-sm text-gray-500">
                    Based on asset allocation and market volatility.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
              <CardDescription>Visualize your asset allocation.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={assets}
                    dataKey="allocation"
                    nameKey="symbol"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {
                      assets.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))
                    }
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
