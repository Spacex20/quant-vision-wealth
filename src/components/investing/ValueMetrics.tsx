
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const ValueMetrics = () => {
  const metrics = [
    { name: "P/E Ratio", value: "18.5", benchmark: "22.0", status: "good", description: "Price to Earnings" },
    { name: "P/B Ratio", value: "2.1", benchmark: "3.2", status: "good", description: "Price to Book" },
    { name: "PEG Ratio", value: "1.2", benchmark: "1.0", status: "fair", description: "Price/Earnings to Growth" },
    { name: "ROE", value: "15.8%", benchmark: "12.0%", status: "good", description: "Return on Equity" },
    { name: "ROA", value: "8.2%", benchmark: "6.5%", status: "good", description: "Return on Assets" },
    { name: "Debt/Equity", value: "0.45", benchmark: "0.60", status: "good", description: "Debt to Equity Ratio" },
    { name: "Current Ratio", value: "2.1", benchmark: "1.5", status: "good", description: "Current Assets / Current Liabilities" },
    { name: "Dividend Yield", value: "2.8%", benchmark: "2.0%", status: "good", description: "Annual Dividends / Price" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-green-600";
      case "fair": return "text-yellow-600";
      case "poor": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good": return "default";
      case "fair": return "secondary";
      case "poor": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company: Apple Inc. (AAPL)</CardTitle>
          <CardDescription>Fundamental analysis metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <div key={metric.name} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{metric.name}</h4>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                  <Badge variant={getStatusBadge(metric.status)}>
                    {metric.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xl font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Benchmark: {metric.benchmark}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>vs Industry</span>
                    <span className={getStatusColor(metric.status)}>
                      {metric.status === "good" ? "Better" : metric.status === "fair" ? "Average" : "Worse"}
                    </span>
                  </div>
                  <Progress 
                    value={metric.status === "good" ? 75 : metric.status === "fair" ? 50 : 25} 
                    className="h-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Value Score Summary</CardTitle>
          <CardDescription>Overall value assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Overall Value Score</p>
              <p className="text-4xl font-bold text-green-600">8.2/10</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">6</p>
                <p className="text-xs text-muted-foreground">Strong Metrics</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">1</p>
                <p className="text-xs text-muted-foreground">Fair Metrics</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">1</p>
                <p className="text-xs text-muted-foreground">Weak Metrics</p>
              </div>
            </div>

            <Badge variant="default" className="text-sm">
              STRONG BUY RECOMMENDATION
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
