
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { BarChart3, AlertTriangle } from "lucide-react";
import { portfolioManager, Portfolio, PortfolioComparison as ComparisonType } from "@/services/portfolioManager";
import { useUserPortfolios } from "@/hooks/useUserPortfolios";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";

export const PortfolioComparison = () => {
  const { user } = useAuth();
  const { portfolios, isLoading, error } = useUserPortfolios();
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([]);
  const [comparison, setComparison] = useState<ComparisonType | null>(null);

  const handlePortfolioSelection = (portfolioId: string) => {
    if (selectedPortfolios.includes(portfolioId)) {
      setSelectedPortfolios(prev => prev.filter(id => id !== portfolioId));
    } else if (selectedPortfolios.length < 4) {
      setSelectedPortfolios(prev => [...prev, portfolioId]);
    }
  };

  const handleCompare = () => {
    if (selectedPortfolios.length < 2) return;
    
    const portfoliosToCompare = portfolios.filter(p => selectedPortfolios.includes(p.id));
    const result = portfolioManager.comparePortfolios(portfoliosToCompare);
    setComparison(result);
  };

  const getComparisonChartData = () => {
    if (!comparison) return [];
    
    return comparison.portfolios.map((portfolio, index) => ({
      name: portfolio.name,
      expectedReturn: (comparison.metrics[index].expectedReturn * 100).toFixed(2),
      volatility: (comparison.metrics[index].volatility * 100).toFixed(2),
      sharpeRatio: comparison.metrics[index].sharpeRatio.toFixed(2),
      maxDrawdown: Math.abs(comparison.metrics[index].maxDrawdown * 100).toFixed(2)
    }));
  };

  const getRadarChartData = () => {
    if (!comparison) return [];
    
    const metrics = ['Return', 'Risk', 'Sharpe', 'Stability'];
    
    return metrics.map(metric => {
      const dataPoint: any = { metric };
      
      comparison.portfolios.forEach((portfolio, index) => {
        const portfolioMetrics = comparison.metrics[index];
        
        switch (metric) {
          case 'Return':
            dataPoint[portfolio.name] = (portfolioMetrics.expectedReturn * 100);
            break;
          case 'Risk':
            dataPoint[portfolio.name] = 100 - (portfolioMetrics.volatility * 100);
            break;
          case 'Sharpe':
            dataPoint[portfolio.name] = Math.max(0, portfolioMetrics.sharpeRatio * 20);
            break;
          case 'Stability':
            dataPoint[portfolio.name] = 100 + (portfolioMetrics.maxDrawdown * 100);
            break;
        }
      });
      
      return dataPoint;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Portfolio Comparison</h3>
        <p className="text-muted-foreground">
          Compare performance metrics across multiple portfolios
        </p>
      </div>

      {/* Portfolio Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Portfolios to Compare</CardTitle>
          <CardDescription>Choose 2-4 portfolios for detailed comparison</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSpinner />}
          {error && <Alert variant="destructive"><AlertDescription>Error loading portfolios: {error.message}</AlertDescription></Alert>}
          {!isLoading && !error && !user && <Alert><AlertDescription>Please log in to compare your portfolios.</AlertDescription></Alert>}
          {!isLoading && !error && user && portfolios.length < 2 && (
             <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You need at least 2 portfolios to perform comparisons. Create more portfolios to use this feature.
              </AlertDescription>
            </Alert>
          )}

          {user && portfolios.length >= 2 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {portfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPortfolios.includes(portfolio.id)
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-muted-foreground'
                    }`}
                    onClick={() => handlePortfolioSelection(portfolio.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{portfolio.name}</h4>
                      {selectedPortfolios.includes(portfolio.id) && (
                        <Badge>Selected</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {portfolio.description || "No description"}
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>Value: ${portfolio.total_value.toLocaleString()}</span>
                      <span>Assets: {portfolio.assets.length}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleCompare}
                disabled={selectedPortfolios.length < 2}
                className="w-full"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Compare Portfolios ({selectedPortfolios.length})
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {comparison.portfolios.map((portfolio, index) => {
              const metrics = comparison.metrics[index];
              return (
                <Card key={portfolio.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected Return</span>
                      <span className="font-medium text-green-600">
                        {(metrics.expectedReturn * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Volatility</span>
                      <span className="font-medium text-orange-600">
                        {(metrics.volatility * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                      <span className="font-medium">
                        {metrics.sharpeRatio.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max Drawdown</span>
                      <span className="font-medium text-red-600">
                        {(metrics.maxDrawdown * 100).toFixed(1)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getComparisonChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="expectedReturn" fill="#10b981" name="Expected Return %" />
                  <Bar dataKey="volatility" fill="#f59e0b" name="Volatility %" />
                  <Bar dataKey="sharpeRatio" fill="#3b82f6" name="Sharpe Ratio" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Characteristics Radar</CardTitle>
              <CardDescription>
                Compare portfolios across key performance dimensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={getRadarChartData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  {comparison.portfolios.map((portfolio, index) => (
                    <Radar
                      key={portfolio.id}
                      name={portfolio.name}
                      dataKey={portfolio.name}
                      stroke={`hsl(${index * 120}, 70%, 50%)`}
                      fill={`hsl(${index * 120}, 70%, 50%)`}
                      fillOpacity={0.1}
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Correlation Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Correlation Matrix</CardTitle>
              <CardDescription>
                Shows how similarly portfolios move relative to each other
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">Portfolio</th>
                      {comparison.portfolios.map((portfolio) => (
                        <th key={portfolio.id} className="border p-2 text-center min-w-[100px]">
                          {portfolio.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.portfolios.map((portfolio, i) => (
                      <tr key={portfolio.id}>
                        <td className="border p-2 font-medium">{portfolio.name}</td>
                        {comparison.correlations[i].map((correlation, j) => (
                          <td
                            key={j}
                            className={`border p-2 text-center ${
                              i === j
                                ? 'bg-primary/10'
                                : correlation > 0.7
                                ? 'bg-red-100'
                                : correlation > 0.3
                                ? 'bg-yellow-100'
                                : 'bg-green-100'
                            }`}
                          >
                            {correlation.toFixed(3)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 border"></div>
                    <span>Low correlation (&lt; 0.3)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-100 border"></div>
                    <span>Medium correlation (0.3 - 0.7)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-100 border"></div>
                    <span>High correlation (&gt; 0.7)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
