import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Portfolio {
  name: string;
  totalValue: number;
}

const generateMockData = (count: number) => {
  const data = [];
  let currentValue = 100;
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.5) * 5;
    currentValue += change;
    data.push({
      date: `Day ${i + 1}`,
      value: currentValue.toFixed(2),
    });
  }
  return data;
};

export const RiskMetrics = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("portfolio1");
  
  const portfolios = {
    portfolio1: { name: "Growth Portfolio", totalValue: 125000 },
    portfolio2: { name: "Conservative Portfolio", totalValue: 85000 },
    portfolio3: { name: "Balanced Portfolio", totalValue: 105000 }
  };

  const calculateVolatility = (portfolioValue: number) => {
    return (Math.random() * 0.1 + 0.05) * portfolioValue;
  };

  const calculateSharpeRatio = () => {
    return Math.random() * 1.5;
  };

  const calculateMaxDrawdown = () => {
    return Math.random() * 0.2;
  };

  const volatility = calculateVolatility(portfolios[selectedPortfolio].totalValue);
  const sharpeRatio = calculateSharpeRatio();
  const maxDrawdown = calculateMaxDrawdown();

  const lineChartData = generateMockData(30);

  const drawdownData = generateMockData(30).map((item, index) => ({
    date: item.date,
    drawdown: Math.max(0, (Math.random() * 15) - 5)
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Risk Metrics</h3>
          <p className="text-muted-foreground">Analyze portfolio risk and performance</p>
        </div>
        <select
          className="border rounded px-4 py-2"
          value={selectedPortfolio}
          onChange={(e) => setSelectedPortfolio(e.target.value)}
        >
          {Object.entries(portfolios).map(([key, portfolio]) => (
            <option key={key} value={key}>
              {portfolio.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Volatility</span>
            </CardTitle>
            <CardDescription>Annualized standard deviation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${volatility.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">
              Higher volatility indicates higher risk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Sharpe Ratio</span>
            </CardTitle>
            <CardDescription>Risk-adjusted return</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sharpeRatio.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">
              Higher Sharpe Ratio indicates better risk-adjusted performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span>Max Drawdown</span>
            </CardTitle>
            <CardDescription>Maximum loss from peak to trough</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(maxDrawdown * 100).toFixed(2)}%</div>
            <p className="text-sm text-muted-foreground">
              Lower drawdown indicates lower potential loss
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>Value at Risk (VaR)</span>
            </CardTitle>
            <CardDescription>Potential loss at a confidence level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-${(Math.random() * 5000).toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">
              Estimated potential loss under normal market conditions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="drawdown" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="drawdown">Drawdown Analysis</TabsTrigger>
          <TabsTrigger value="volatility">Volatility Trends</TabsTrigger>
          <TabsTrigger value="correlation">Risk Correlation</TabsTrigger>
        </TabsList>

        <TabsContent value="drawdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maximum Drawdown Over Time</CardTitle>
              <CardDescription>Portfolio decline from peak to trough</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={drawdownData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="drawdown" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volatility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Volatility Trends</CardTitle>
              <CardDescription>Historical volatility of the portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Correlation Matrix</CardTitle>
              <CardDescription>Correlation between different assets in the portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Correlation matrix data will be displayed here.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          High volatility detected. Consider rebalancing your portfolio.
        </AlertDescription>
      </Alert>
    </div>
  );
};
