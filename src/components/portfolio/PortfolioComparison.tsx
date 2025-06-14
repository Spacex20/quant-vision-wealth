
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react";
import { Portfolio, PortfolioComparison as ComparisonData, portfolioManager } from "@/services/portfolioManager";

export const PortfolioComparison = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [viewMode, setViewMode] = useState<'metrics' | 'allocation' | 'correlation'>('metrics');

  useEffect(() => {
    const allPortfolios = portfolioManager.getAllPortfolios();
    setPortfolios(allPortfolios);
    
    // Auto-select first two portfolios if available
    if (allPortfolios.length >= 2) {
      setSelectedPortfolios([allPortfolios[0].id, allPortfolios[1].id]);
    }
  }, []);

  useEffect(() => {
    if (selectedPortfolios.length >= 2) {
      const comparison = portfolioManager.comparePortfolios(selectedPortfolios);
      setComparisonData(comparison);
    } else {
      setComparisonData(null);
    }
  }, [selectedPortfolios]);

  const handlePortfolioToggle = (portfolioId: string, checked: boolean) => {
    if (checked) {
      if (selectedPortfolios.length < 4) {
        setSelectedPortfolios(prev => [...prev, portfolioId]);
      }
    } else {
      setSelectedPortfolios(prev => prev.filter(id => id !== portfolioId));
    }
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getMetricsChartData = () => {
    if (!comparisonData) return [];
    
    return comparisonData.portfolios.map((portfolio, index) => ({
      name: portfolio.name,
      'Expected Return': comparisonData.metrics[index].expectedReturn * 100,
      'Volatility': comparisonData.metrics[index].volatility * 100,
      'Sharpe Ratio': comparisonData.metrics[index].sharpeRatio,
      'Max Drawdown': Math.abs(comparisonData.metrics[index].maxDrawdown) * 100
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Portfolio Comparison</h3>
          <p className="text-sm text-muted-foreground">
            Compare performance metrics across your portfolios
          </p>
        </div>
        
        <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metrics">Performance Metrics</SelectItem>
            <SelectItem value="allocation">Asset Allocation</SelectItem>
            <SelectItem value="correlation">Correlation Analysis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Portfolio Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Portfolios to Compare</CardTitle>
          <CardDescription>Choose 2-4 portfolios for comparison analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolios.map((portfolio) => (
              <div key={portfolio.id} className="flex items-center space-x-3 p-3 border rounded">
                <Checkbox
                  checked={selectedPortfolios.includes(portfolio.id)}
                  onCheckedChange={(checked) => 
                    handlePortfolioToggle(portfolio.id, checked as boolean)
                  }
                  disabled={!selectedPortfolios.includes(portfolio.id) && selectedPortfolios.length >= 4}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{portfolio.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(portfolio.totalValue)} • {portfolio.assets.length} assets
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selectedPortfolios.length > 4 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Maximum 4 portfolios can be compared at once.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {comparisonData && (
        <>
          {viewMode === 'metrics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Metrics Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comparisonData.portfolios.map((portfolio, index) => (
                      <div key={portfolio.id} className="p-4 border rounded">
                        <div className="font-medium mb-3">{portfolio.name}</div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expected Return:</span>
                            <span className="font-medium">
                              {formatPercentage(comparisonData.metrics[index].expectedReturn)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Volatility:</span>
                            <span className="font-medium">
                              {formatPercentage(comparisonData.metrics[index].volatility)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sharpe Ratio:</span>
                            <span className="font-medium">
                              {comparisonData.metrics[index].sharpeRatio.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Max Drawdown:</span>
                            <span className="font-medium text-red-600">
                              {formatPercentage(comparisonData.metrics[index].maxDrawdown)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Metrics Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Metrics Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getMetricsChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="Expected Return" fill="#8884d8" />
                      <Bar dataKey="Volatility" fill="#82ca9d" />
                      <Bar dataKey="Sharpe Ratio" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {viewMode === 'allocation' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Asset Allocation Comparison</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {comparisonData.portfolios.map((portfolio) => (
                    <div key={portfolio.id} className="space-y-3">
                      <h4 className="font-medium">{portfolio.name}</h4>
                      <div className="space-y-2">
                        {portfolio.assets.map((asset) => (
                          <div key={asset.symbol} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                            <div>
                              <span className="font-medium text-sm">{asset.symbol}</span>
                              <div className="text-xs text-muted-foreground">{asset.name}</div>
                            </div>
                            <Badge variant="outline">{asset.allocation.toFixed(1)}%</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === 'correlation' && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Correlation Matrix</CardTitle>
                <CardDescription>
                  Correlation coefficients between selected portfolios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2 bg-muted/30"></th>
                        {comparisonData.portfolios.map((portfolio) => (
                          <th key={portfolio.id} className="border p-2 bg-muted/30 text-sm">
                            {portfolio.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.portfolios.map((portfolio, i) => (
                        <tr key={portfolio.id}>
                          <td className="border p-2 bg-muted/30 font-medium text-sm">
                            {portfolio.name}
                          </td>
                          {comparisonData.correlations[i].map((correlation, j) => (
                            <td key={j} className="border p-2 text-center">
                              <Badge 
                                variant={correlation > 0.7 ? "default" : correlation > 0.3 ? "secondary" : "outline"}
                                className="text-xs"
                              >
                                {correlation.toFixed(2)}
                              </Badge>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-sm text-muted-foreground">
                  <p><strong>Correlation Guide:</strong></p>
                  <p>• Strong (0.7+): Portfolios move together closely</p>
                  <p>• Moderate (0.3-0.7): Some correlation in movement</p>
                  <p>• Weak (0-0.3): Little correlation, good for diversification</p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {selectedPortfolios.length < 2 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <div className="text-lg font-medium mb-2">Select portfolios to compare</div>
              <p>Choose at least 2 portfolios to see comparison analysis.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
