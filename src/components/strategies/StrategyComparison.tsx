
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { strategyEngine, StrategyResult, StrategyType } from "@/services/strategyEngine";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { TrendingUp, Shield, Target, Clock } from "lucide-react";

export const StrategyComparison = () => {
  const [results, setResults] = useState<StrategyResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType | null>(null);

  const executeComparison = async () => {
    setLoading(true);
    try {
      const comparisonResults = await strategyEngine.compareStrategies(portfolioValue);
      setResults(comparisonResults);
    } catch (error) {
      console.error('Error comparing strategies:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeStrategy = async (strategyType: StrategyType) => {
    setLoading(true);
    try {
      const result = await strategyEngine.executeStrategy(strategyType, portfolioValue);
      setSelectedStrategy(strategyType);
      // Update only the selected strategy in results
      setResults(prev => {
        const updated = [...prev];
        const index = updated.findIndex(r => r.strategy === strategyType);
        if (index >= 0) {
          updated[index] = result;
        } else {
          updated.push(result);
        }
        return updated;
      });
    } catch (error) {
      console.error(`Error executing ${strategyType} strategy:`, error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getRiskColor = (risk: number) => {
    if (risk < 10) return 'text-green-600';
    if (risk < 18) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStrategyIcon = (strategy: StrategyType) => {
    switch (strategy) {
      case 'coffee_can': return <Target className="h-5 w-5" />;
      case 'all_weather': return <Shield className="h-5 w-5" />;
      case 'value_momentum': return <TrendingUp className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const strategies = strategyEngine.getAvailableStrategies();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Investment Strategy Comparison</h2>
        <p className="text-muted-foreground">
          Compare different investment strategies and find the best approach for your goals
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Configuration</CardTitle>
          <CardDescription>Set your portfolio parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Portfolio Value</label>
              <input
                type="number"
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
                min="1000"
                step="1000"
              />
            </div>
            <Button onClick={executeComparison} disabled={loading} className="mt-6">
              {loading ? 'Analyzing...' : 'Compare All Strategies'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="strategies" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="strategies">Strategy Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="allocations">Asset Allocations</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strategies.map((strategy) => (
              <Card key={strategy.type} className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStrategyIcon(strategy.type)}
                    {strategy.name}
                  </CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Risk Level:</span>
                    <Badge variant={strategy.riskLevel === 'low' ? 'secondary' : 
                                  strategy.riskLevel === 'medium' ? 'default' : 'destructive'}>
                      {strategy.riskLevel}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time Horizon:</span>
                    <Badge variant="outline">{strategy.timeHorizon}</Badge>
                  </div>
                  <Button 
                    onClick={() => executeStrategy(strategy.type)}
                    disabled={loading}
                    className="w-full"
                    variant={selectedStrategy === strategy.type ? "default" : "outline"}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Execute Strategy
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {results.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Return vs Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={results}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="strategy" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="expectedReturn" fill="#8884d8" name="Expected Return %" />
                        <Bar dataKey="expectedRisk" fill="#82ca9d" name="Expected Risk %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Strategy Metrics Radar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={results.map(r => ({
                        strategy: r.strategy,
                        return: r.expectedReturn,
                        sharpe: r.sharpeRatio * 20, // Scale for visibility
                        stability: (20 - r.expectedRisk) // Inverse of risk
                      }))}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="strategy" />
                        <PolarRadiusAxis />
                        <Radar name="Performance" dataKey="return" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Radar name="Risk-Adjusted" dataKey="sharpe" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.map((result) => (
                  <Card key={result.strategy}>
                    <CardHeader>
                      <CardTitle className="capitalize">{result.strategy.replace('_', ' ')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Expected Return:</span>
                        <span className="font-semibold text-green-600">{result.expectedReturn.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Expected Risk:</span>
                        <span className={`font-semibold ${getRiskColor(result.expectedRisk)}`}>
                          {result.expectedRisk.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Sharpe Ratio:</span>
                        <span className="font-semibold">{result.sharpeRatio.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Rebalance:</span>
                        <span className="text-xs">{result.rebalanceFrequency}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Alert>
              <AlertDescription>
                Run the strategy comparison to see performance metrics.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="allocations" className="space-y-6">
          {results.length > 0 ? (
            <div className="space-y-6">
              {results.map((result) => (
                <Card key={result.strategy}>
                  <CardHeader>
                    <CardTitle className="capitalize">{result.strategy.replace('_', ' ')} Allocation</CardTitle>
                    <CardDescription>
                      {result.allocation.length} assets • Total Value: {formatCurrency(portfolioValue)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {result.allocation.slice(0, 12).map((asset, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <span className="font-medium">{asset.symbol || asset.name}</span>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(asset.amount)}
                            </div>
                          </div>
                          <Badge>{asset.allocation.toFixed(1)}%</Badge>
                        </div>
                      ))}
                    </div>
                    {result.allocation.length > 12 && (
                      <p className="text-sm text-muted-foreground mt-4">
                        Showing top 12 of {result.allocation.length} assets
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                Execute strategies to see their asset allocations.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
