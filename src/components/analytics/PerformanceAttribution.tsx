
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Target, TrendingUp, TrendingDown, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { portfolioAnalytics, HoldingData, PerformanceAttribution as AttributionType } from "@/services/portfolioAnalytics";

export const PerformanceAttribution = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("1Y");
  const [attributionMethod, setAttributionMethod] = useState("brinson");

  // Mock portfolio data
  const mockHoldings: HoldingData[] = [
    {
      symbol: "AAPL",
      weight: 0.25,
      returns: Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.04),
      historicalData: []
    },
    {
      symbol: "MSFT",
      weight: 0.20,
      returns: Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.035),
      historicalData: []
    },
    {
      symbol: "GOOGL",
      weight: 0.15,
      returns: Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.045),
      historicalData: []
    },
    {
      symbol: "AMZN",
      weight: 0.15,
      returns: Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.05),
      historicalData: []
    },
    {
      symbol: "TSLA",
      weight: 0.10,
      returns: Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.08),
      historicalData: []
    },
    {
      symbol: "BND",
      weight: 0.15,
      returns: Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.015),
      historicalData: []
    }
  ];

  // Mock benchmark and portfolio returns
  const portfolioReturns = Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.03);
  const benchmarkReturns = Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.025);

  const attribution = portfolioAnalytics.calculatePerformanceAttribution(
    portfolioReturns,
    benchmarkReturns,
    mockHoldings
  );

  // Generate sector attribution data
  const sectorAttribution = [
    { sector: "Technology", allocation: 2.3, selection: 1.8, interaction: 0.2, total: 4.3 },
    { sector: "Healthcare", allocation: -0.5, selection: 0.8, interaction: -0.1, total: 0.2 },
    { sector: "Finance", allocation: 1.2, selection: -0.3, interaction: 0.1, total: 1.0 },
    { sector: "Consumer", allocation: -0.8, selection: 1.5, interaction: 0.2, total: 0.9 },
    { sector: "Energy", allocation: 0.3, selection: -1.2, interaction: -0.2, total: -1.1 },
    { sector: "Bonds", allocation: -0.2, selection: 0.1, interaction: 0.0, total: -0.1 }
  ];

  // Individual stock contribution
  const stockContribution = mockHoldings.map(holding => {
    const totalReturn = holding.returns.reduce((sum, ret) => sum + ret, 0) * 100;
    const contribution = holding.weight * totalReturn;
    
    return {
      symbol: holding.symbol,
      weight: holding.weight * 100,
      return: totalReturn,
      contribution: contribution,
      excessReturn: totalReturn - 8.5 // Assuming 8.5% benchmark return
    };
  });

  // Time series attribution
  const timeSeriesData = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    assetAllocation: (Math.random() - 0.5) * 2,
    securitySelection: (Math.random() - 0.5) * 1.5,
    interaction: (Math.random() - 0.5) * 0.5,
    total: 0
  })).map(item => ({
    ...item,
    total: item.assetAllocation + item.securitySelection + item.interaction
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const totalPortfolioReturn = stockContribution.reduce((sum, stock) => sum + stock.contribution, 0);
  const totalBenchmarkReturn = 8.5; // Mock benchmark return
  const activeReturn = totalPortfolioReturn - totalBenchmarkReturn;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Performance Attribution Analysis</h3>
        <p className="text-muted-foreground">
          Understand the sources of portfolio performance relative to benchmark
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Time Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1M">1 Month</SelectItem>
                  <SelectItem value="3M">3 Months</SelectItem>
                  <SelectItem value="6M">6 Months</SelectItem>
                  <SelectItem value="1Y">1 Year</SelectItem>
                  <SelectItem value="3Y">3 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Attribution Method</label>
              <Select value={attributionMethod} onValueChange={setAttributionMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brinson">Brinson Model</SelectItem>
                  <SelectItem value="fachler">Brinson-Fachler</SelectItem>
                  <SelectItem value="factor">Factor-Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalPortfolioReturn.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Total return for {selectedPeriod}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Benchmark Return</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBenchmarkReturn.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              S&P 500 benchmark
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Return</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${activeReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {activeReturn >= 0 ? '+' : ''}{activeReturn.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Excess over benchmark
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Information Ratio</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(activeReturn / 3.2).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Risk-adjusted active return
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attribution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attribution Sources</CardTitle>
            <CardDescription>
              Breakdown of active return by attribution factor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Asset Allocation</div>
                  <div className="text-sm text-muted-foreground">
                    Effect of sector/asset weight decisions
                  </div>
                </div>
                <div className={`text-lg font-bold ${attribution.assetAllocation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {attribution.assetAllocation >= 0 ? '+' : ''}{(attribution.assetAllocation * 100).toFixed(2)}%
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Security Selection</div>
                  <div className="text-sm text-muted-foreground">
                    Effect of individual stock picking
                  </div>
                </div>
                <div className={`text-lg font-bold ${attribution.securitySelection >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {attribution.securitySelection >= 0 ? '+' : ''}{(attribution.securitySelection * 100).toFixed(2)}%
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Interaction Effect</div>
                  <div className="text-sm text-muted-foreground">
                    Combined allocation and selection effects
                  </div>
                </div>
                <div className={`text-lg font-bold ${attribution.interaction >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {attribution.interaction >= 0 ? '+' : ''}{(attribution.interaction * 100).toFixed(2)}%
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg bg-primary/5">
                <div>
                  <div className="font-bold">Total Attribution</div>
                  <div className="text-sm text-muted-foreground">
                    Sum of all attribution effects
                  </div>
                </div>
                <div className={`text-xl font-bold ${attribution.totalAttribution >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {attribution.totalAttribution >= 0 ? '+' : ''}{(attribution.totalAttribution * 100).toFixed(2)}%
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Asset Allocation', value: Math.abs(attribution.assetAllocation * 100) },
                    { name: 'Security Selection', value: Math.abs(attribution.securitySelection * 100) },
                    { name: 'Interaction', value: Math.abs(attribution.interaction * 100) }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sector Attribution</CardTitle>
            <CardDescription>
              Performance attribution by sector
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={sectorAttribution} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="sector" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="allocation" stackId="a" fill="#8884d8" name="Allocation" />
                <Bar dataKey="selection" stackId="a" fill="#82ca9d" name="Selection" />
                <Bar dataKey="interaction" stackId="a" fill="#ffc658" name="Interaction" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Individual Stock Contribution */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Stock Contribution</CardTitle>
          <CardDescription>
            How each holding contributed to portfolio performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockContribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="symbol" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value}%`,
                      name === 'contribution' ? 'Contribution' : 'Return'
                    ]}
                  />
                  <Bar dataKey="contribution" fill="#3b82f6" name="Contribution" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {stockContribution
                .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
                .map((stock) => (
                <div key={stock.symbol} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      Weight: {stock.weight.toFixed(1)}% | Return: {stock.return.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${stock.contribution >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.contribution >= 0 ? '+' : ''}{stock.contribution.toFixed(2)}%
                    </div>
                    <Badge variant={stock.excessReturn >= 0 ? "default" : "destructive"}>
                      {stock.excessReturn >= 0 ? '+' : ''}{stock.excessReturn.toFixed(1)}% vs Bench
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Series Attribution */}
      <Card>
        <CardHeader>
          <CardTitle>Attribution Over Time</CardTitle>
          <CardDescription>
            Monthly breakdown of attribution sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="assetAllocation" stroke="#8884d8" name="Asset Allocation" />
              <Line type="monotone" dataKey="securitySelection" stroke="#82ca9d" name="Security Selection" />
              <Line type="monotone" dataKey="interaction" stroke="#ffc658" name="Interaction" />
              <Line type="monotone" dataKey="total" stroke="#ff7300" strokeWidth={3} name="Total Attribution" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Attribution Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Attribution Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attribution.assetAllocation > 0.02 && (
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  <strong>Strong asset allocation:</strong> Your sector allocation decisions contributed 
                  +{(attribution.assetAllocation * 100).toFixed(2)}% to performance, indicating good timing and weighting decisions.
                </AlertDescription>
              </Alert>
            )}

            {attribution.securitySelection > 0.015 && (
              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  <strong>Excellent stock picking:</strong> Security selection added 
                  +{(attribution.securitySelection * 100).toFixed(2)}% to returns, showing strong individual stock selection skills.
                </AlertDescription>
              </Alert>
            )}

            {attribution.securitySelection < -0.01 && (
              <Alert>
                <TrendingDown className="h-4 w-4" />
                <AlertDescription>
                  <strong>Stock selection drag:</strong> Individual stock choices reduced returns by 
                  {(attribution.securitySelection * 100).toFixed(2)}%. Consider fundamental analysis improvements.
                </AlertDescription>
              </Alert>
            )}

            {Math.abs(attribution.interaction) > 0.005 && (
              <Alert>
                <BarChart3 className="h-4 w-4" />
                <AlertDescription>
                  <strong>Significant interaction effects:</strong> The combination of allocation and selection decisions 
                  had a {attribution.interaction > 0 ? 'positive' : 'negative'} interaction effect of 
                  {(attribution.interaction * 100).toFixed(2)}%.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
