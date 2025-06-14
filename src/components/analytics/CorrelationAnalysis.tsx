
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CorrelationData {
  asset1: string;
  asset2: string;
  correlation: number;
}

export const CorrelationAnalysis = () => {
  // Mock correlation data
  const correlations: CorrelationData[] = [
    { asset1: "AAPL", asset2: "MSFT", correlation: 0.67 },
    { asset1: "AAPL", asset2: "GOOGL", correlation: 0.72 },
    { asset1: "AAPL", asset2: "BND", correlation: -0.15 },
    { asset1: "MSFT", asset2: "GOOGL", correlation: 0.81 },
    { asset1: "MSFT", asset2: "BND", correlation: -0.08 },
    { asset1: "GOOGL", asset2: "BND", correlation: -0.22 },
  ];

  const getCorrelationColor = (correlation: number) => {
    if (correlation > 0.7) return "text-red-600";
    if (correlation > 0.3) return "text-yellow-600";
    if (correlation > -0.3) return "text-green-600";
    return "text-blue-600";
  };

  const getCorrelationIcon = (correlation: number) => {
    if (correlation > 0.3) return <TrendingUp className="h-4 w-4" />;
    if (correlation < -0.3) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getCorrelationStatus = (correlation: number) => {
    if (correlation > 0.7) return "High Positive";
    if (correlation > 0.3) return "Moderate Positive";
    if (correlation > -0.3) return "Low/Neutral";
    return "Negative";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Asset Correlation Matrix</CardTitle>
          <CardDescription>
            Correlation analysis between portfolio assets (past 252 trading days)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {correlations.map((item, index) => (
              <div key={`${item.asset1}-${item.asset2}-${index}`} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={getCorrelationColor(item.correlation)}>
                    {getCorrelationIcon(item.correlation)}
                  </div>
                  <div>
                    <div className="font-medium">
                      {item.asset1} vs {item.asset2}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getCorrelationStatus(item.correlation)}
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className={`text-lg font-bold ${getCorrelationColor(item.correlation)}`}>
                    {item.correlation.toFixed(2)}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {Math.abs(item.correlation) > 0.7 ? "Strong" : 
                     Math.abs(item.correlation) > 0.3 ? "Moderate" : "Weak"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Correlation Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>High correlation detected:</strong> MSFT and GOOGL (0.81) move very similarly. 
                Consider diversifying to reduce concentration risk.
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Good diversification:</strong> Bonds show negative correlation with tech stocks, 
                providing portfolio stability during market volatility.
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Recommendation:</strong> Current correlation structure suggests well-balanced 
                risk distribution across asset classes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
