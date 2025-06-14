
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, TrendingUp, PlayCircle } from "lucide-react";

export const PortfolioSimulator = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Portfolio Simulation Lab</h2>
        <p className="text-muted-foreground">
          Backtest strategies and run scenario analyses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PlayCircle className="h-5 w-5" />
              <span>Backtest Engine</span>
            </CardTitle>
            <CardDescription>Test your strategies against historical data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">All Weather Strategy</span>
                <Badge variant="outline">5 years</Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Annual Return: <span className="text-green-600 font-medium">8.7%</span></p>
                <p>Max Drawdown: <span className="text-red-600 font-medium">-6.2%</span></p>
                <p>Sharpe Ratio: <span className="font-medium">1.34</span></p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Value Momentum</span>
                <Badge variant="outline">10 years</Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Annual Return: <span className="text-green-600 font-medium">12.4%</span></p>
                <p>Max Drawdown: <span className="text-red-600 font-medium">-18.1%</span></p>
                <p>Sharpe Ratio: <span className="font-medium">0.89</span></p>
              </div>
            </div>

            <Button className="w-full">
              <PlayCircle className="h-4 w-4 mr-2" />
              Run New Backtest
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="h-5 w-5" />
              <span>Scenario Analysis</span>
            </CardTitle>
            <CardDescription>Stress test your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">2008 Financial Crisis</span>
                  <Badge variant="destructive">-24.5%</Badge>
                </div>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">COVID-19 Crash (Mar 2020)</span>
                  <Badge variant="destructive">-18.2%</Badge>
                </div>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Interest Rate Rise (2022)</span>
                  <Badge variant="secondary">-8.7%</Badge>
                </div>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tech Bubble (2000)</span>
                  <Badge variant="destructive">-31.8%</Badge>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Run Custom Scenario
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Strategy Library</CardTitle>
          <CardDescription>Pre-built quantitative investment strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Risk Parity",
                description: "Equal risk contribution from all assets",
                performance: "+8.9% annually",
                risk: "Low"
              },
              {
                name: "Momentum Factor",
                description: "Buy winners, sell losers strategy",
                performance: "+11.2% annually",
                risk: "Medium"
              },
              {
                name: "Value Factor",
                description: "Buy undervalued stocks",
                performance: "+9.8% annually",
                risk: "Medium"
              },
              {
                name: "Low Volatility",
                description: "Minimum variance portfolio",
                performance: "+7.1% annually",
                risk: "Low"
              },
              {
                name: "Quality Growth",
                description: "High ROE, growing companies",
                performance: "+13.5% annually",
                risk: "High"
              },
              {
                name: "Dividend Aristocrats",
                description: "Consistent dividend growers",
                performance: "+8.6% annually",
                risk: "Low"
              }
            ].map((strategy) => (
              <div key={strategy.name} className="p-4 border rounded-lg space-y-3">
                <div>
                  <h4 className="font-medium">{strategy.name}</h4>
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-600">{strategy.performance}</span>
                  <Badge variant="outline">{strategy.risk} Risk</Badge>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Clone Strategy
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
