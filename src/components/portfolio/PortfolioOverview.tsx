
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Activity, Sparkles } from "lucide-react";
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

  // Ray Dalio's All Weather Strategy Demo Portfolio
  const allWeatherDemoPortfolio = {
    name: "All Weather Strategy",
    description: "Ray Dalio's risk-balanced portfolio designed to perform in all economic environments",
    total_value: 50000,
    assets: [
      { symbol: "TLT", name: "Long-Term Treasury Bonds", allocation: 40 },
      { symbol: "VTI", name: "Total Stock Market", allocation: 30 },
      { symbol: "IEF", name: "Intermediate Treasury Bonds", allocation: 15 },
      { symbol: "GLD", name: "Gold ETF", allocation: 7.5 },
      { symbol: "DJP", name: "Commodities ETF", allocation: 7.5 },
    ],
    updated_at: new Date().toISOString(),
    strategy: "All Weather",
    isDemo: true
  };

  const activePortfolio = isLoggedIn && !isLoading && portfolios.length > 0
    ? portfolios[0]
    : allWeatherDemoPortfolio;

  if (isLoggedIn && isLoading) {
    return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;
  }
  
  const portfolioValue = activePortfolio.total_value || 0;
  
  const dayChange = portfolioValue ? +(portfolioValue * 0.008).toFixed(2) : 0;
  const dayChangePercent = portfolioValue ? 0.8 : 0;
  const totalReturn = portfolioValue ? +(portfolioValue * 0.12).toFixed(2) : 0;
  const totalReturnPercent = portfolioValue ? 12.0 : 0;

  // Holdings are just the assets sorted by allocation
  const holdings = activePortfolio.assets
    .slice()
    .sort((a, b) => b.allocation - a.allocation)
    .map((asset) => {
      const typedAsset = asset as typeof asset & { shares?: number };
      return {
        ...asset,
        value: +(portfolioValue * asset.allocation / 100).toFixed(2),
        change: Math.round((Math.random() - 0.3) * 100) / 10,
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
      {/* Demo Portfolio Notice */}
      {activePortfolio.isDemo && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Demo Portfolio - Ray Dalio's All Weather Strategy</h3>
                <p className="text-sm text-blue-700">
                  This balanced portfolio is designed to perform well across all economic environments. 
                  Sign up to create your own custom portfolios and access advanced features! 🚀
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative">
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

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-green-600">+${totalReturn.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{totalReturnPercent}% all time
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{holdings.length}</div>
            <p className="text-xs text-muted-foreground">
              Asset classes
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Strategy</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{activePortfolio.strategy || "Balanced"}</div>
            <p className="text-xs text-muted-foreground">
              Risk-optimized
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Portfolio Performance</span>
            {activePortfolio.isDemo && <Badge variant="outline" className="ml-2">Demo</Badge>}
          </CardTitle>
          <CardDescription>
            {activePortfolio.isDemo 
              ? "Simulated performance of the All Weather strategy over time"
              : "Track your portfolio value over time"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioChart />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Holdings */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>
              {activePortfolio.isDemo 
                ? "Ray Dalio's balanced approach across economic environments"
                : "Your largest positions"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {holdings.map((holding, index) => (
                <div key={holding.symbol} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-orange-500' :
                      index === 3 ? 'bg-purple-500' :
                      'bg-pink-500'
                    }`}></div>
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

        {/* Strategy Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Strategy Breakdown</CardTitle>
            <CardDescription>
              {activePortfolio.isDemo 
                ? "How the All Weather strategy balances risk across economic scenarios"
                : "Portfolio breakdown by asset class"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activePortfolio.isDemo ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                        Long-Term Bonds (40%)
                      </span>
                      <span className="text-sm text-muted-foreground">Deflation Hedge</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                        Stocks (30%)
                      </span>
                      <span className="text-sm text-muted-foreground">Growth Engine</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center">
                        <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                        Intermediate Bonds (15%)
                      </span>
                      <span className="text-sm text-muted-foreground">Rate Hedge</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                        Gold (7.5%)
                      </span>
                      <span className="text-sm text-muted-foreground">Crisis Hedge</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '7.5%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center">
                        <div className="w-3 h-3 bg-pink-500 rounded mr-2"></div>
                        Commodities (7.5%)
                      </span>
                      <span className="text-sm text-muted-foreground">Inflation Hedge</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-pink-500 h-2 rounded-full" style={{ width: '7.5%' }}></div>
                    </div>
                  </div>
                </>
              ) : (
                assetAllocation.map((allocation, index) => (
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
                ))
              )}
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
