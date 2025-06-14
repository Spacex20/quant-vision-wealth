
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Target } from "lucide-react";
import { portfolioAnalytics, RiskMetrics as RiskMetricsType } from '@/services/portfolioAnalytics';
import { financialApi } from '@/services/financialApi';

export const RiskMetrics = () => {
  const [metrics, setMetrics] = useState<RiskMetricsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1y');

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        // Fetch historical data for portfolio and benchmark
        const portfolioData = await financialApi.getHistoricalData('AAPL', timeframe);
        const benchmarkData = await financialApi.getHistoricalData('MSFT', timeframe);
        
        const portfolioPrices = portfolioData.map(d => d.close);
        const benchmarkPrices = benchmarkData.map(d => d.close);
        
        const portfolioReturns = portfolioAnalytics.calculateReturns(portfolioPrices);
        const benchmarkReturns = portfolioAnalytics.calculateReturns(benchmarkPrices);
        
        const calculatedMetrics = portfolioAnalytics.calculateRiskMetrics(portfolioReturns, benchmarkReturns);
        setMetrics(calculatedMetrics);
      } catch (error) {
        console.error('Error calculating risk metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [timeframe]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load risk metrics</p>
        </CardContent>
      </Card>
    );
  }

  const getRiskLevel = (sharpe: number) => {
    if (sharpe > 1.5) return { level: 'Low', color: 'bg-green-500' };
    if (sharpe > 1.0) return { level: 'Medium', color: 'bg-yellow-500' };
    return { level: 'High', color: 'bg-red-500' };
  };

  const riskLevel = getRiskLevel(metrics.sharpeRatio);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Advanced Risk Metrics</span>
        </CardTitle>
        <CardDescription>Comprehensive portfolio risk analysis</CardDescription>
        <div className="flex space-x-2">
          {['1m', '3m', '6m', '1y'].map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Sharpe Ratio</span>
              <div className={`w-2 h-2 rounded-full ${riskLevel.color}`}></div>
            </div>
            <div className="text-2xl font-bold">{metrics.sharpeRatio}</div>
            <div className="text-sm text-muted-foreground">Risk Level: {riskLevel.level}</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Volatility</span>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">{(metrics.volatility * 100).toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Annualized</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Value at Risk (95%)</span>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">{(metrics.var95 * 100).toFixed(2)}%</div>
            <div className="text-sm text-muted-foreground">Daily VaR</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Conditional VaR</span>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{(metrics.cvar95 * 100).toFixed(2)}%</div>
            <div className="text-sm text-muted-foreground">Expected tail loss</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Max Drawdown</span>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">{(metrics.maxDrawdown * 100).toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Peak to trough</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Beta</span>
              <Target className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{metrics.beta}</div>
            <div className="text-sm text-muted-foreground">Market sensitivity</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Alpha</span>
              <Badge variant={metrics.alpha > 0 ? "default" : "destructive"}>
                {metrics.alpha > 0 ? "Outperforming" : "Underperforming"}
              </Badge>
            </div>
            <div className="text-2xl font-bold">{(metrics.alpha * 100).toFixed(2)}%</div>
            <div className="text-sm text-muted-foreground">Excess return</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Information Ratio</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{metrics.informationRatio}</div>
            <div className="text-sm text-muted-foreground">Risk-adj. alpha</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Treynor Ratio</span>
              <Shield className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{metrics.treynorRatio}</div>
            <div className="text-sm text-muted-foreground">Return per unit beta</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Calmar Ratio</span>
              <Target className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">{metrics.calmarRatio}</div>
            <div className="text-sm text-muted-foreground">Return/drawdown</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
