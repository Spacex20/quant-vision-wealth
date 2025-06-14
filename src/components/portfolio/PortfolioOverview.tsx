import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Activity } from "lucide-react";
import { PortfolioChart } from "./PortfolioChart";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { MarketIntelligence } from "@/components/market/MarketIntelligence";
import { useAuth } from "@/hooks/useAuth";
import { useUserPortfolios } from "@/hooks/useUserPortfolios";
import { LoadingSpinner } from "../common/LoadingSpinner";

export const PortfolioOverview = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { portfolios, isLoading } = useUserPortfolios();

  const demoPortfolio = {
    name: "Demo Portfolio",
    total_value: 125000,
    assets: [
      { symbol: "AAPL", name: "Apple Inc.", allocation: 40 },
      { symbol: "MSFT", name: "Microsoft", allocation: 25 },
      { symbol: "GOOGL", name: "Alphabet", allocation: 15 },
      { symbol: "AMZN", name: "Amazon", allocation: 10 },
      { symbol: "TSLA", name: "Tesla", allocation: 10 },
    ],
    updated_at: new Date().toISOString(),
  };

  const activePortfolio = isLoggedIn && !isLoading && portfolios.length > 0
    ? portfolios[0]
    : demoPortfolio;

  if (isLoggedIn && isLoading) {
    return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;
  }
  
  const portfolioValue = activePortfolio.total_value || 0;
  
  const dayChange = portfolioValue ? +(portfolioValue * 0.010).toFixed(2) : 0;
  const dayChangePercent = portfolioValue ? 1.0 : 0;
  const totalReturn = portfolioValue ? +(portfolioValue * 0.20).toFixed(2) : 0;
  const totalReturnPercent = portfolioValue ? 20.0 : 0;

  // Holdings are just the assets sorted by allocation
  const holdings = activePortfolio.assets
    .slice()
    .sort((a, b) => b.allocation - a.allocation)
    .map((asset) => {
      // Use type assertion to allow optional properties like shares
      const typedAsset = asset as typeof asset & { shares?: number };
      return {
        ...asset,
        value: +(portfolioValue * asset.allocation / 100).toFixed(2),
        change: Math.round((Math.random() - 0.4) * 100) / 10, // random short-term move
        weight: asset.allocation,
        shares: typeof typedAsset.shares !== "undefined" ? typedAsset.shares : null,
      };
    });

  const assetAllocation = activePortfolio.assets.map((a) => ({
    category: a.name,
    percentage: a.allocation,
    value: +(portfolioValue * a.allocation / 100).toFixed(2),
  }));

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioValue.toLocaleString()}</div>
            <div className={`flex items-center text-xs ${dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {dayChange >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {dayChange >= 0 ? '+' : ''}${dayChange.toLocaleString()} ({dayChangePercent >= 0 ? '+' : ''}{dayChangePercent}%) today
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+${totalReturn.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{totalReturnPercent}% all time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holdings.length}</div>
            <p className="text-xs text-muted-foreground">
              Individual positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diversification</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetAllocation.length}</div>
            <p className="text-xs text-muted-foreground">
              Asset classes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>Track your portfolio value over time</CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioChart />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Holdings */}
        <Card>
          <CardHeader>
            <CardTitle>Top Holdings</CardTitle>
            <CardDescription>Your largest positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {holdings.map((holding) => (
                <div key={holding.symbol} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="font-medium">{holding.symbol}</div>
                      <div className="text-sm text-muted-foreground">{holding.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${holding.value.toLocaleString()}</div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{holding.weight}%</Badge>
                      <div className={`text-sm ${holding.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {holding.change >= 0 ? '+' : ''}{holding.change}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Portfolio breakdown by asset class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assetAllocation.map((allocation) => (
                <div key={allocation.category} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{allocation.category}</span>
                    <span className="text-sm text-muted-foreground">
                      {allocation.percentage}% (${allocation.value.toLocaleString()})
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${allocation.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketOverview />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Market Intelligence</span>
            </CardTitle>
            <CardDescription>Real-time market data and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <MarketIntelligence />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
