
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export const PerformanceMetrics = () => {
  const metrics = [
    { label: "Total Return", value: "27.43%", change: "+2.1%", trend: "up", period: "YTD" },
    { label: "Sharpe Ratio", value: "1.42", change: "+0.08", trend: "up", period: "12M" },
    { label: "Max Drawdown", value: "-8.2%", change: "-1.1%", trend: "down", period: "12M" },
    { label: "Beta", value: "0.89", change: "-0.02", trend: "down", period: "12M" },
    { label: "Alpha", value: "3.2%", change: "+0.8%", trend: "up", period: "12M" },
    { label: "Volatility", value: "12.4%", change: "-0.9%", trend: "down", period: "12M" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Key risk and return measurements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{metric.label}</span>
                <Badge variant="outline" className="text-xs">{metric.period}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">{metric.value}</span>
                <div className={`flex items-center space-x-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
