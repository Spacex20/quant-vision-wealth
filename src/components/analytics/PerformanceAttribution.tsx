
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, TrendingDown } from "lucide-react";
import { portfolioAnalytics, PerformanceAttribution as AttributionType, HoldingData } from '@/services/portfolioAnalytics';
import { financialApi } from '@/services/financialApi';

export const PerformanceAttribution = () => {
  const [attribution, setAttribution] = useState<AttributionType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttributionData = async () => {
      setIsLoading(true);
      try {
        // Mock portfolio data - in real app this would come from user's actual portfolio
        const portfolioData = await financialApi.getHistoricalData('AAPL', '1y');
        const benchmarkData = await financialApi.getHistoricalData('MSFT', '1y');
        
        const portfolioPrices = portfolioData.map(d => d.close);
        const benchmarkPrices = benchmarkData.map(d => d.close);
        
        const portfolioReturns = portfolioAnalytics.calculateReturns(portfolioPrices);
        const benchmarkReturns = portfolioAnalytics.calculateReturns(benchmarkPrices);
        
        // Mock holdings data
        const holdings: HoldingData[] = [
          {
            symbol: 'AAPL',
            weight: 0.4,
            returns: portfolioReturns.slice(0, 50),
            historicalData: portfolioData.slice(0, 50)
          },
          {
            symbol: 'MSFT',
            weight: 0.3,
            returns: benchmarkReturns.slice(0, 50),
            historicalData: benchmarkData.slice(0, 50)
          },
          {
            symbol: 'GOOGL',
            weight: 0.3,
            returns: portfolioReturns.slice(50, 100),
            historicalData: portfolioData.slice(50, 100)
          }
        ];
        
        const attributionData = portfolioAnalytics.calculatePerformanceAttribution(
          portfolioReturns,
          benchmarkReturns,
          holdings
        );
        
        setAttribution(attributionData);
      } catch (error) {
        console.error('Error calculating performance attribution:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttributionData();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Attribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!attribution) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Attribution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load attribution data</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    {
      name: 'Asset Allocation',
      value: attribution.assetAllocation * 100,
      color: '#3b82f6'
    },
    {
      name: 'Security Selection',
      value: attribution.securitySelection * 100,
      color: '#10b981'
    },
    {
      name: 'Interaction',
      value: attribution.interaction * 100,
      color: '#f59e0b'
    }
  ];

  const formatValue = (value: number) => {
    return `${value > 0 ? '+' : ''}${(value * 100).toFixed(2)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Performance Attribution</span>
        </CardTitle>
        <CardDescription>
          Brinson attribution analysis - sources of portfolio performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Attribution Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Attribution']}
                />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Attribution Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Asset Allocation Effect</span>
                {attribution.assetAllocation >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className={`text-2xl font-bold ${
                attribution.assetAllocation >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatValue(attribution.assetAllocation)}
              </div>
              <div className="text-sm text-muted-foreground">
                Impact of sector/asset allocation decisions
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Security Selection Effect</span>
                {attribution.securitySelection >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className={`text-2xl font-bold ${
                attribution.securitySelection >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatValue(attribution.securitySelection)}
              </div>
              <div className="text-sm text-muted-foreground">
                Impact of individual security picks
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Interaction Effect</span>
                {attribution.interaction >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className={`text-2xl font-bold ${
                attribution.interaction >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatValue(attribution.interaction)}
              </div>
              <div className="text-sm text-muted-foreground">
                Combined allocation and selection effects
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Total Attribution</span>
                <Badge variant={attribution.totalAttribution >= 0 ? "default" : "destructive"}>
                  {attribution.totalAttribution >= 0 ? "Outperforming" : "Underperforming"}
                </Badge>
              </div>
              <div className={`text-2xl font-bold ${
                attribution.totalAttribution >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatValue(attribution.totalAttribution)}
              </div>
              <div className="text-sm text-muted-foreground">
                Total excess return vs benchmark
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Attribution Analysis Explained</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Asset Allocation:</strong> Performance due to over/underweighting sectors or asset classes</p>
              <p><strong>Security Selection:</strong> Performance due to choosing specific securities within sectors</p>
              <p><strong>Interaction:</strong> Combined effect when both allocation and selection decisions work together</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
