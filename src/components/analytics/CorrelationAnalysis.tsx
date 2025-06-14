
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GitBranch, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";
import { portfolioAnalytics, HoldingData, CorrelationData } from "@/services/portfolioAnalytics";

export const CorrelationAnalysis = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1Y");
  const [selectedAsset1, setSelectedAsset1] = useState("AAPL");
  const [selectedAsset2, setSelectedAsset2] = useState("MSFT");

  // Mock portfolio holdings data
  const mockHoldings: HoldingData[] = [
    {
      symbol: "AAPL",
      weight: 0.25,
      returns: Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.04),
      historicalData: []
    },
    {
      symbol: "MSFT",
      weight: 0.20,
      returns: Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.035),
      historicalData: []
    },
    {
      symbol: "GOOGL",
      weight: 0.15,
      returns: Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.045),
      historicalData: []
    },
    {
      symbol: "AMZN",
      weight: 0.15,
      returns: Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.05),
      historicalData: []
    },
    {
      symbol: "TSLA",
      weight: 0.10,
      returns: Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.08),
      historicalData: []
    },
    {
      symbol: "BND",
      weight: 0.15,
      returns: Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.015),
      historicalData: []
    }
  ];

  const correlationMatrix = portfolioAnalytics.calculateCorrelationMatrix(mockHoldings);

  // Create correlation matrix for heatmap
  const getCorrelationMatrix = () => {
    const matrix: { [key: string]: { [key: string]: number } } = {};
    
    // Initialize matrix
    mockHoldings.forEach(holding1 => {
      matrix[holding1.symbol] = {};
      mockHoldings.forEach(holding2 => {
        if (holding1.symbol === holding2.symbol) {
          matrix[holding1.symbol][holding2.symbol] = 1;
        } else {
          const correlation = correlationMatrix.find(
            c => (c.asset1 === holding1.symbol && c.asset2 === holding2.symbol) ||
                 (c.asset1 === holding2.symbol && c.asset2 === holding1.symbol)
          );
          matrix[holding1.symbol][holding2.symbol] = correlation?.correlation || 0;
        }
      });
    });
    
    return matrix;
  };

  const matrix = getCorrelationMatrix();

  // Generate scatter plot data for two selected assets
  const getScatterData = () => {
    const asset1Data = mockHoldings.find(h => h.symbol === selectedAsset1);
    const asset2Data = mockHoldings.find(h => h.symbol === selectedAsset2);
    
    if (!asset1Data || !asset2Data) return [];
    
    return asset1Data.returns.map((return1, index) => ({
      x: return1 * 100,
      y: asset2Data.returns[index] * 100,
      date: `Day ${index + 1}`
    }));
  };

  const scatterData = getScatterData();

  const getCorrelationLevel = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.8) return { level: "Very High", color: "bg-red-500" };
    if (abs >= 0.6) return { level: "High", color: "bg-orange-500" };
    if (abs >= 0.4) return { level: "Moderate", color: "bg-yellow-500" };
    if (abs >= 0.2) return { level: "Low", color: "bg-blue-500" };
    return { level: "Very Low", color: "bg-green-500" };
  };

  const getCellColor = (correlation: number) => {
    const intensity = Math.abs(correlation);
    if (correlation > 0) {
      return `rgba(239, 68, 68, ${intensity})`;  // Red for positive correlation
    } else {
      return `rgba(59, 130, 246, ${intensity})`; // Blue for negative correlation
    }
  };

  const selectedCorrelation = matrix[selectedAsset1]?.[selectedAsset2] || 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Correlation Analysis</h3>
        <p className="text-muted-foreground">
          Analyze relationships between portfolio assets and market movements
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Time Period</label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1M">1 Month</SelectItem>
                  <SelectItem value="3M">3 Months</SelectItem>
                  <SelectItem value="6M">6 Months</SelectItem>
                  <SelectItem value="1Y">1 Year</SelectItem>
                  <SelectItem value="2Y">2 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Asset 1</label>
              <Select value={selectedAsset1} onValueChange={setSelectedAsset1}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockHoldings.map(holding => (
                    <SelectItem key={holding.symbol} value={holding.symbol}>
                      {holding.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Asset 2</label>
              <Select value={selectedAsset2} onValueChange={setSelectedAsset2}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockHoldings.map(holding => (
                    <SelectItem key={holding.symbol} value={holding.symbol}>
                      {holding.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Correlation Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Correlation Matrix</CardTitle>
          <CardDescription>
            Correlation coefficients between all portfolio assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left font-medium">Asset</th>
                  {mockHoldings.map(holding => (
                    <th key={holding.symbol} className="border p-2 text-center font-medium min-w-[80px]">
                      {holding.symbol}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockHoldings.map(holding1 => (
                  <tr key={holding1.symbol}>
                    <td className="border p-2 font-medium">{holding1.symbol}</td>
                    {mockHoldings.map(holding2 => {
                      const correlation = matrix[holding1.symbol][holding2.symbol];
                      return (
                        <td
                          key={holding2.symbol}
                          className="border p-2 text-center text-sm font-medium"
                          style={{ backgroundColor: getCellColor(correlation) }}
                        >
                          {correlation.toFixed(3)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500"></div>
                <span>Positive Correlation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500"></div>
                <span>Negative Correlation</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Range: -1.0 (perfect negative) to +1.0 (perfect positive)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Pair Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Correlation Scatter Plot</CardTitle>
            <CardDescription>
              {selectedAsset1} vs {selectedAsset2} daily returns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Correlation Coefficient</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold">
                    {selectedCorrelation.toFixed(3)}
                  </span>
                  <Badge className={getCorrelationLevel(selectedCorrelation).color}>
                    {getCorrelationLevel(selectedCorrelation).level}
                  </Badge>
                </div>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={scatterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="x" 
                  domain={['dataMin - 1', 'dataMax + 1']}
                  label={{ value: `${selectedAsset1} Returns (%)`, position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  domain={['dataMin - 1', 'dataMax + 1']}
                  label={{ value: `${selectedAsset2} Returns (%)`, angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name === 'x' ? selectedAsset1 : selectedAsset2]}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Scatter dataKey="y" fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Correlation Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* High correlation warnings */}
              {correlationMatrix
                .filter(c => Math.abs(c.correlation) > 0.7)
                .slice(0, 3)
                .map((correlation, index) => (
                <Alert key={index}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>High correlation detected:</strong> {correlation.asset1} and {correlation.asset2} 
                    have a correlation of {correlation.correlation.toFixed(3)}, indicating they move 
                    {correlation.correlation > 0 ? ' together' : ' in opposite directions'}.
                  </AlertDescription>
                </Alert>
              ))}

              {/* Diversification benefits */}
              {correlationMatrix
                .filter(c => Math.abs(c.correlation) < 0.3)
                .slice(0, 2)
                .map((correlation, index) => (
                <Alert key={`low-${index}`}>
                  <GitBranch className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Good diversification:</strong> {correlation.asset1} and {correlation.asset2} 
                    have low correlation ({correlation.correlation.toFixed(3)}), providing diversification benefits.
                  </AlertDescription>
                </Alert>
              ))}

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Portfolio Diversification Score</h4>
                <div className="space-y-2">
                  {(() => {
                    const avgCorrelation = correlationMatrix
                      .filter(c => c.asset1 !== c.asset2)
                      .reduce((sum, c) => sum + Math.abs(c.correlation), 0) / correlationMatrix.length;
                    
                    const diversificationScore = Math.max(0, 100 - (avgCorrelation * 100));
                    
                    return (
                      <>
                        <div className="flex justify-between">
                          <span>Diversification Score</span>
                          <span className="font-bold">{diversificationScore.toFixed(0)}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              diversificationScore > 70 ? 'bg-green-500' :
                              diversificationScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${diversificationScore}%` }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {diversificationScore > 70 ? 'Well diversified portfolio' :
                           diversificationScore > 50 ? 'Moderately diversified' : 'Consider adding more diverse assets'}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sector Correlation Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Sector Correlation Breakdown</CardTitle>
          <CardDescription>
            How portfolio assets correlate within and across sectors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Technology Sector</h4>
              <div className="space-y-2">
                {correlationMatrix
                  .filter(c => ['AAPL', 'MSFT', 'GOOGL'].includes(c.asset1) && 
                              ['AAPL', 'MSFT', 'GOOGL'].includes(c.asset2))
                  .map((correlation, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">{correlation.asset1} - {correlation.asset2}</span>
                      <Badge variant={Math.abs(correlation.correlation) > 0.6 ? "destructive" : "outline"}>
                        {correlation.correlation.toFixed(3)}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Cross-Sector Correlations</h4>
              <div className="space-y-2">
                {correlationMatrix
                  .filter(c => 
                    (['AAPL', 'MSFT', 'GOOGL'].includes(c.asset1) && c.asset2 === 'BND') ||
                    (['AAPL', 'MSFT', 'GOOGL'].includes(c.asset1) && c.asset2 === 'TSLA')
                  )
                  .slice(0, 4)
                  .map((correlation, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">{correlation.asset1} - {correlation.asset2}</span>
                      <Badge variant={Math.abs(correlation.correlation) > 0.6 ? "destructive" : "outline"}>
                        {correlation.correlation.toFixed(3)}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
