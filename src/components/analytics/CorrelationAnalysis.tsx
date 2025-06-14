
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, AlertCircle } from "lucide-react";
import { portfolioAnalytics, CorrelationData, HoldingData } from '@/services/portfolioAnalytics';
import { financialApi } from '@/services/financialApi';

export const CorrelationAnalysis = () => {
  const [correlations, setCorrelations] = useState<CorrelationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCorrelationData = async () => {
      setIsLoading(true);
      try {
        // Mock portfolio holdings - in a real app this would come from user's portfolio
        const symbols = ['AAPL', 'MSFT', 'GOOGL'];
        const holdings: HoldingData[] = [];

        for (const symbol of symbols) {
          const historicalData = await financialApi.getHistoricalData(symbol, '1y');
          const prices = historicalData.map(d => d.close);
          const returns = portfolioAnalytics.calculateReturns(prices);
          
          holdings.push({
            symbol,
            weight: 1/symbols.length,
            returns,
            historicalData
          });
        }

        const correlationMatrix = portfolioAnalytics.calculateCorrelationMatrix(holdings);
        setCorrelations(correlationMatrix);
      } catch (error) {
        console.error('Error calculating correlations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCorrelationData();
  }, []);

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.8) return 'bg-red-500';
    if (abs >= 0.6) return 'bg-orange-500';
    if (abs >= 0.4) return 'bg-yellow-500';
    if (abs >= 0.2) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getCorrelationLabel = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.8) return 'Very High';
    if (abs >= 0.6) return 'High';
    if (abs >= 0.4) return 'Moderate';
    if (abs >= 0.2) return 'Low';
    return 'Very Low';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Correlation Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <GitBranch className="h-5 w-5" />
          <span>Asset Correlation Analysis</span>
        </CardTitle>
        <CardDescription>
          Correlation coefficients between portfolio assets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {correlations.map((corr, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{corr.asset1}</span>
                    <span className="text-muted-foreground">×</span>
                    <span className="font-medium">{corr.asset2}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getCorrelationColor(corr.correlation)}`}></div>
                    <Badge variant="outline">{getCorrelationLabel(corr.correlation)}</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {corr.correlation > 0 ? '+' : ''}{corr.correlation}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.abs(corr.correlation) >= 0.7 && (
                      <div className="flex items-center space-x-1 text-orange-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>High correlation risk</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Correlation Guide</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Very Low (0.0-0.2): Good diversification</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Low (0.2-0.4): Moderate diversification</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Moderate (0.4-0.6): Some concentration risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>High (0.6-0.8): Concentration risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Very High (0.8-1.0): High concentration risk</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
