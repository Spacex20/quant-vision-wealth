
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Activity } from "lucide-react";
import { PortfolioChart } from "./PortfolioChart";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { MarketIntelligence } from "@/components/market/MarketIntelligence";

export const PortfolioOverview = () => {
  // Mock portfolio data - in a real app, this would come from your portfolio service
  const portfolioValue = 125750.50;
  const dayChange = 2450.75;
  const dayChangePercent = 1.98;
  const totalReturn = 25750.50;
  const totalReturnPercent = 25.75;

  const holdings = [
    { symbol: "AAPL", name: "Apple Inc.", shares: 50, value: 9125.00, weight: 7.3, change: 2.1 },
    { symbol: "MSFT", name: "Microsoft", shares: 30, value: 11370.00, weight: 9.0, change: 1.8 },
    { symbol: "GOOGL", name: "Alphabet", shares: 25, value: 3564.00, weight: 2.8, change: -0.5 },
    { symbol: "AMZN", name: "Amazon", shares: 15, value: 2040.00, weight: 1.6, change: 3.2 },
    { symbol: "TSLA", name: "Tesla", shares: 20, value: 4100.00, weight: 3.3, change: -1.2 },
  ];

  const assetAllocation = [
    { category: "US Stocks", percentage: 65, value: 81737.83 },
    { category: "International", percentage: 20, value: 25150.10 },
    { category: "Bonds", percentage: 10, value: 12575.05 },
    { category: "Cash", percentage: 5, value: 6287.52 },
  ];

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
