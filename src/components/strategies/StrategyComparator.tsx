
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Target, BarChart3, Plus, X } from 'lucide-react';
import { libraryStrategies, Strategy } from '@/data/strategies';
import { cn } from '@/lib/utils';

interface StrategyComparatorProps {
  className?: string;
}

export const StrategyComparator = ({ className }: StrategyComparatorProps) => {
  const [selectedStrategies, setSelectedStrategies] = useState<Strategy[]>([]);
  const [comparisonMode, setComparisonMode] = useState<'overview' | 'detailed'>('overview');

  const addStrategy = (strategyId: string) => {
    if (selectedStrategies.length >= 4) return; // Limit to 4 strategies
    
    const strategy = libraryStrategies.find(s => s.id === strategyId);
    if (strategy && !selectedStrategies.find(s => s.id === strategyId)) {
      setSelectedStrategies(prev => [...prev, strategy]);
    }
  };

  const removeStrategy = (strategyId: string) => {
    setSelectedStrategies(prev => prev.filter(s => s.id !== strategyId));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'High': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPerformanceIcon = (value: number, comparison: number) => {
    if (value > comparison) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value < comparison) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Target className="h-4 w-4 text-gray-500" />;
  };

  const calculateAverages = () => {
    if (selectedStrategies.length === 0) return { avgReturn: 0, avgVolatility: 0, avgSharpe: 0 };
    
    const avgReturn = selectedStrategies.reduce((sum, s) => sum + s.expectedReturn, 0) / selectedStrategies.length;
    const avgVolatility = selectedStrategies.reduce((sum, s) => sum + s.volatility, 0) / selectedStrategies.length;
    const avgSharpe = selectedStrategies.reduce((sum, s) => sum + s.sharpeRatio, 0) / selectedStrategies.length;
    
    return { avgReturn, avgVolatility, avgSharpe };
  };

  const averages = calculateAverages();

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Strategy Comparator
          </CardTitle>
          <CardDescription>
            Compare up to 4 investment strategies side by side to make informed decisions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Strategy Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Select Strategies to Compare</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStrategies([])}
                disabled={selectedStrategies.length === 0}
              >
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select onValueChange={addStrategy}>
                <SelectTrigger>
                  <SelectValue placeholder="Add strategy to compare..." />
                </SelectTrigger>
                <SelectContent>
                  {libraryStrategies
                    .filter(s => !selectedStrategies.find(selected => selected.id === s.id))
                    .map(strategy => (
                      <SelectItem key={strategy.id} value={strategy.id}>
                        {strategy.name} ({strategy.expectedReturn}% return)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button
                  variant={comparisonMode === 'overview' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setComparisonMode('overview')}
                >
                  Overview
                </Button>
                <Button
                  variant={comparisonMode === 'detailed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setComparisonMode('detailed')}
                >
                  Detailed
                </Button>
              </div>
            </div>

            {/* Selected Strategies Pills */}
            {selectedStrategies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedStrategies.map(strategy => (
                  <Badge
                    key={strategy.id}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => removeStrategy(strategy.id)}
                  >
                    {strategy.name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Comparison Table */}
          {selectedStrategies.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Comparison Results</h3>
              
              {comparisonMode === 'overview' ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Strategy</TableHead>
                      <TableHead>Expected Return</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Volatility</TableHead>
                      <TableHead>Sharpe Ratio</TableHead>
                      <TableHead>Time Horizon</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedStrategies.map(strategy => (
                      <TableRow key={strategy.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <strategy.icon className="h-4 w-4" />
                            {strategy.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getPerformanceIcon(strategy.expectedReturn, averages.avgReturn)}
                            <span className={strategy.expectedReturn > averages.avgReturn ? 'text-green-600 font-semibold' : ''}>
                              {strategy.expectedReturn}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskColor(strategy.riskProfile)} variant="outline">
                            {strategy.riskProfile}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getPerformanceIcon(averages.avgVolatility, strategy.volatility)}
                            <span className={strategy.volatility < averages.avgVolatility ? 'text-green-600 font-semibold' : ''}>
                              {strategy.volatility}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getPerformanceIcon(strategy.sharpeRatio, averages.avgSharpe)}
                            <span className={strategy.sharpeRatio > averages.avgSharpe ? 'text-green-600 font-semibold' : ''}>
                              {strategy.sharpeRatio}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{strategy.timeHorizon}</TableCell>
                      </TableRow>
                    ))}
                    
                    {/* Average Row */}
                    <TableRow className="border-t-2 bg-muted/50">
                      <TableCell className="font-semibold">Average</TableCell>
                      <TableCell className="font-semibold">{averages.avgReturn.toFixed(1)}%</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="font-semibold">{averages.avgVolatility.toFixed(1)}%</TableCell>
                      <TableCell className="font-semibold">{averages.avgSharpe.toFixed(2)}</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedStrategies.map(strategy => (
                    <Card key={strategy.id} className="border-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <strategy.icon className="h-5 w-5" />
                          {strategy.name}
                        </CardTitle>
                        <CardDescription>{strategy.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Expected Return</span>
                            <div className="font-semibold text-lg">{strategy.expectedReturn}%</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Volatility</span>
                            <div className="font-semibold text-lg">{strategy.volatility}%</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Sharpe Ratio</span>
                            <div className="font-semibold text-lg">{strategy.sharpeRatio}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Risk Level</span>
                            <Badge className={getRiskColor(strategy.riskProfile)} variant="outline">
                              {strategy.riskProfile}
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-muted-foreground">Top Holdings</span>
                          <div className="space-y-1 mt-1">
                            {strategy.allocation.slice(0, 3).map(asset => (
                              <div key={asset.asset} className="flex justify-between text-sm">
                                <span>{asset.asset}</span>
                                <span className="font-medium">{asset.weight}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedStrategies.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select strategies above to start comparing their performance and characteristics.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
