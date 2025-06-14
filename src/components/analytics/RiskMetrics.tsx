
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingDown, AlertTriangle, Shield, Activity } from "lucide-react";
import { portfolioAnalytics, RiskMetrics as RiskMetricsType } from "@/services/portfolioAnalytics";

export const RiskMetrics = () => {
  // Mock portfolio returns data
  const mockReturns = Array.from({ length: 252 }, (_, i) => {
    return (Math.random() - 0.5) * 0.04; // Daily returns between -2% and +2%
  });

  // Mock benchmark returns (S&P 500)
  const mockBenchmarkReturns = Array.from({ length: 252 }, (_, i) => {
    return (Math.random() - 0.5) * 0.03; // Slightly lower volatility
  });

  const riskMetrics = portfolioAnalytics.calculateRiskMetrics(mockReturns, mockBenchmarkReturns);

  // Generate drawdown data
  const drawdownData = Array.from({ length: 252 }, (_, i) => {
    let cumulativeReturn = 1;
    let peak = 1;
    
    for (let j = 0; j <= i; j++) {
      cumulativeReturn *= (1 + mockReturns[j]);
      if (cumulativeReturn > peak) {
        peak = cumulativeReturn;
      }
    }
    
    const drawdown = ((peak - cumulativeReturn) / peak) * 100;
    
    return {
      date: `Day ${i + 1}`,
      drawdown: -drawdown,
      portfolioValue: cumulativeReturn * 100000
    };
  });

  // VaR distribution data
  const varData = Array.from({ length: 50 }, (_, i) => {
    const percentile = (i + 1) * 2;
    const sortedReturns = [...mockReturns].sort((a, b) => a - b);
    const index = Math.floor((percentile / 100) * sortedReturns.length);
    return {
      percentile,
      var: -sortedReturns[index] * 100
    };
  });

  const getRiskRating = (metric: string, value: number) => {
    switch (metric) {
      case 'sharpe':
        if (value > 2) return { rating: 'Excellent', color: 'bg-green-500' };
        if (value > 1.5) return { rating: 'Good', color: 'bg-blue-500' };
        if (value > 1) return { rating: 'Fair', color: 'bg-yellow-500' };
        return { rating: 'Poor', color: 'bg-red-500' };
      case 'volatility':
        if (value < 0.1) return { rating: 'Low', color: 'bg-green-500' };
        if (value < 0.2) return { rating: 'Moderate', color: 'bg-yellow-500' };
        return { rating: 'High', color: 'bg-red-500' };
      case 'drawdown':
        if (value > -0.05) return { rating: 'Low', color: 'bg-green-500' };
        if (value > -0.15) return { rating: 'Moderate', color: 'bg-yellow-500' };
        return { rating: 'High', color: 'bg-red-500' };
      default:
        return { rating: 'Unknown', color: 'bg-gray-500' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Risk Analytics</h3>
        <p className="text-muted-foreground">
          Comprehensive risk assessment and volatility analysis
        </p>
      </div>

      {/* Key Risk Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskMetrics.sharpeRatio}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getRiskRating('sharpe', riskMetrics.sharpeRatio).color}>
                {getRiskRating('sharpe', riskMetrics.sharpeRatio).rating}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Risk-adjusted return measure
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Volatility</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(riskMetrics.volatility * 100).toFixed(1)}%</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getRiskRating('volatility', riskMetrics.volatility).color}>
                {getRiskRating('volatility', riskMetrics.volatility).rating}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Standard deviation of returns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {(riskMetrics.maxDrawdown * 100).toFixed(1)}%
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getRiskRating('drawdown', riskMetrics.maxDrawdown).color}>
                {getRiskRating('drawdown', riskMetrics.maxDrawdown).rating}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Largest peak-to-trough decline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beta</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskMetrics.beta}</div>
            <div className="mt-2">
              <Progress value={Math.abs(riskMetrics.beta) * 50} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Sensitivity to market movements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Risk Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Risk Ratios</CardTitle>
            <CardDescription>Additional risk-adjusted performance measures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Information Ratio", value: riskMetrics.informationRatio, description: "Active return per unit of tracking error" },
                { label: "Treynor Ratio", value: riskMetrics.treynorRatio, description: "Return per unit of systematic risk" },
                { label: "Calmar Ratio", value: riskMetrics.calmarRatio, description: "Annual return divided by maximum drawdown" },
                { label: "Alpha", value: `${(riskMetrics.alpha * 100).toFixed(2)}%`, description: "Excess return vs. expected return" }
              ].map((metric) => (
                <div key={metric.label} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{metric.label}</div>
                    <div className="text-sm text-muted-foreground">{metric.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{metric.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Value at Risk (VaR)</CardTitle>
            <CardDescription>Potential losses at different confidence levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">VaR (95%)</div>
                  <div className="text-xl font-bold text-red-600">
                    {(riskMetrics.var95 * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">CVaR (95%)</div>
                  <div className="text-xl font-bold text-red-600">
                    {(riskMetrics.cvar95 * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={varData.slice(0, 20)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="percentile" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'VaR']} />
                  <Bar dataKey="var" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  VaR estimates potential losses under normal market conditions and may underestimate tail risks.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drawdown Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Drawdown Analysis</CardTitle>
          <CardDescription>
            Track portfolio declines from peak values over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={drawdownData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" interval={50} />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'drawdown' ? `${value}%` : `$${value.toLocaleString()}`,
                  name === 'drawdown' ? 'Drawdown' : 'Portfolio Value'
                ]}
              />
              <Line
                type="monotone"
                dataKey="drawdown"
                stroke="#ef4444"
                strokeWidth={2}
                fill="#ef4444"
                fillOpacity={0.1}
                area={true}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Current Drawdown</div>
              <div className="text-lg font-bold text-red-600">
                {drawdownData[drawdownData.length - 1]?.drawdown.toFixed(2)}%
              </div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Avg Drawdown Duration</div>
              <div className="text-lg font-bold">23 days</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Recovery Time</div>
              <div className="text-lg font-bold">45 days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Interpretation */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskMetrics.sharpeRatio > 1.5 ? (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Good risk-adjusted performance:</strong> Your portfolio shows strong risk-adjusted returns with a Sharpe ratio of {riskMetrics.sharpeRatio}.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Consider risk optimization:</strong> Your portfolio may benefit from risk management improvements to enhance risk-adjusted returns.
                </AlertDescription>
              </Alert>
            )}

            {riskMetrics.volatility > 0.2 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>High volatility detected:</strong> Consider diversification or defensive assets to reduce portfolio volatility.
                </AlertDescription>
              </Alert>
            )}

            {Math.abs(riskMetrics.maxDrawdown) > 0.15 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Significant drawdown risk:</strong> Implement stop-loss strategies or position sizing to limit downside risk.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
