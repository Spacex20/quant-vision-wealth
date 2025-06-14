
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Activity, Plus, Trash2, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PortfolioHolding {
  symbol: string;
  weight: number;
  beta: number;
  expectedReturn: number;
  actualReturn?: number;
  alpha?: number;
}

interface PortfolioMetrics {
  portfolioBeta: number;
  portfolioExpectedReturn: number;
  portfolioAlpha: number;
  weightedAverageAlpha: number;
  totalWeight: number;
}

export const PortfolioCAPM = () => {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([
    { symbol: 'AAPL', weight: 30, beta: 1.23, expectedReturn: 11.27, actualReturn: 12.5, alpha: 1.23 },
    { symbol: 'MSFT', weight: 25, beta: 1.12, expectedReturn: 10.65, actualReturn: 11.2, alpha: 0.55 },
    { symbol: 'GOOGL', weight: 20, beta: 1.05, expectedReturn: 10.28, actualReturn: 9.8, alpha: -0.48 },
    { symbol: 'TSLA', weight: 15, beta: 1.89, expectedReturn: 14.90, actualReturn: 16.2, alpha: 1.30 },
    { symbol: 'BND', weight: 10, beta: 0.15, expectedReturn: 5.33, actualReturn: 5.1, alpha: -0.23 }
  ]);
  
  const [newHolding, setNewHolding] = useState({ symbol: '', weight: 0 });
  const [riskFreeRate] = useState(4.5);
  const [marketReturn] = useState(10.0);
  const [loading, setLoading] = useState(false);

  const calculatePortfolioMetrics = (): PortfolioMetrics => {
    const totalWeight = holdings.reduce((sum, h) => sum + h.weight, 0);
    
    const portfolioBeta = holdings.reduce((sum, h) => 
      sum + (h.weight / 100) * h.beta, 0
    );
    
    const portfolioExpectedReturn = holdings.reduce((sum, h) => 
      sum + (h.weight / 100) * h.expectedReturn, 0
    );
    
    const portfolioActualReturn = holdings.reduce((sum, h) => 
      sum + (h.weight / 100) * (h.actualReturn || h.expectedReturn), 0
    );
    
    const portfolioAlpha = portfolioActualReturn - portfolioExpectedReturn;
    
    const weightedAverageAlpha = holdings.reduce((sum, h) => 
      sum + (h.weight / 100) * (h.alpha || 0), 0
    );

    return {
      portfolioBeta: Number(portfolioBeta.toFixed(3)),
      portfolioExpectedReturn: Number(portfolioExpectedReturn.toFixed(2)),
      portfolioAlpha: Number(portfolioAlpha.toFixed(2)),
      weightedAverageAlpha: Number(weightedAverageAlpha.toFixed(2)),
      totalWeight: Number(totalWeight.toFixed(1))
    };
  };

  const addHolding = async () => {
    if (!newHolding.symbol || newHolding.weight <= 0) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock beta and return calculation
    const beta = 0.5 + Math.random() * 1.5;
    const expectedReturn = riskFreeRate + beta * (marketReturn - riskFreeRate);
    const actualReturn = expectedReturn + (Math.random() - 0.5) * 4;
    const alpha = actualReturn - expectedReturn;
    
    const holding: PortfolioHolding = {
      symbol: newHolding.symbol.toUpperCase(),
      weight: newHolding.weight,
      beta: Number(beta.toFixed(3)),
      expectedReturn: Number(expectedReturn.toFixed(2)),
      actualReturn: Number(actualReturn.toFixed(2)),
      alpha: Number(alpha.toFixed(2))
    };
    
    setHoldings(prev => [...prev, holding]);
    setNewHolding({ symbol: '', weight: 0 });
    setLoading(false);
  };

  const removeHolding = (symbol: string) => {
    setHoldings(prev => prev.filter(h => h.symbol !== symbol));
  };

  const updateWeight = (symbol: string, newWeight: number) => {
    setHoldings(prev => prev.map(h => 
      h.symbol === symbol ? { ...h, weight: newWeight } : h
    ));
  };

  const normalizeWeights = () => {
    const totalWeight = holdings.reduce((sum, h) => sum + h.weight, 0);
    if (totalWeight === 0) return;
    
    setHoldings(prev => prev.map(h => ({
      ...h,
      weight: Number(((h.weight / totalWeight) * 100).toFixed(1))
    })));
  };

  const metrics = calculatePortfolioMetrics();

  const getWeightChartData = () => {
    return holdings.map(h => ({
      symbol: h.symbol,
      weight: h.weight,
      color: `hsl(${holdings.indexOf(h) * 360 / holdings.length}, 70%, 50%)`
    }));
  };

  const getBetaContributionData = () => {
    return holdings.map(h => ({
      symbol: h.symbol,
      betaContribution: Number(((h.weight / 100) * h.beta).toFixed(3)),
      beta: h.beta,
      weight: h.weight
    }));
  };

  const getRiskAssessment = (beta: number) => {
    if (beta < 0.8) return { level: "Conservative", color: "bg-green-100 text-green-800" };
    if (beta < 1.2) return { level: "Moderate", color: "bg-blue-100 text-blue-800" };
    if (beta < 1.5) return { level: "Aggressive", color: "bg-orange-100 text-orange-800" };
    return { level: "High Risk", color: "bg-red-100 text-red-800" };
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Portfolio CAPM Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="newSymbol">Add Stock</Label>
              <Input
                id="newSymbol"
                value={newHolding.symbol}
                onChange={(e) => setNewHolding(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                placeholder="NVDA"
              />
            </div>
            <div>
              <Label htmlFor="newWeight">Weight (%)</Label>
              <Input
                id="newWeight"
                type="number"
                value={newHolding.weight || ''}
                onChange={(e) => setNewHolding(prev => ({ ...prev, weight: Number(e.target.value) }))}
                placeholder="10"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addHolding} disabled={loading} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Holding
              </Button>
            </div>
            <div className="flex items-end">
              <Button onClick={normalizeWeights} variant="outline" className="w-full">
                Normalize Weights
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>Total Weight:</strong> {metrics.totalWeight}%</p>
            {metrics.totalWeight !== 100 && (
              <p className="text-orange-600">⚠ Weights don't sum to 100%</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Portfolio Beta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {metrics.portfolioBeta}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Weighted average beta
            </div>
            <Badge className={getRiskAssessment(metrics.portfolioBeta).color}>
              {getRiskAssessment(metrics.portfolioBeta).level}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Expected Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {metrics.portfolioExpectedReturn}%
            </div>
            <div className="text-sm text-gray-600 mt-2">
              CAPM expected return
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Portfolio Alpha</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${metrics.portfolioAlpha >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.portfolioAlpha > 0 ? '+' : ''}{metrics.portfolioAlpha}%
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Excess return
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {((metrics.portfolioBeta - 1) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {metrics.portfolioBeta > 1 ? 'More risky' : 'Less risky'} than market
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Symbol</th>
                  <th className="text-left p-2">Weight (%)</th>
                  <th className="text-left p-2">Beta</th>
                  <th className="text-left p-2">Expected Return</th>
                  <th className="text-left p-2">Actual Return</th>
                  <th className="text-left p-2">Alpha</th>
                  <th className="text-left p-2">Beta Contribution</th>
                  <th className="text-left p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => (
                  <tr key={holding.symbol} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{holding.symbol}</td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={holding.weight}
                        onChange={(e) => updateWeight(holding.symbol, Number(e.target.value))}
                        className="w-20"
                      />
                    </td>
                    <td className="p-2">{holding.beta}</td>
                    <td className="p-2">{holding.expectedReturn}%</td>
                    <td className="p-2">{holding.actualReturn}%</td>
                    <td className={`p-2 ${(holding.alpha || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(holding.alpha || 0) > 0 ? '+' : ''}{holding.alpha}%
                    </td>
                    <td className="p-2">{((holding.weight / 100) * holding.beta).toFixed(3)}</td>
                    <td className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeHolding(holding.symbol)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Weights */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getWeightChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ symbol, weight }) => `${symbol}: ${weight}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="weight"
                  >
                    {getWeightChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Beta Contributions */}
        <Card>
          <CardHeader>
            <CardTitle>Beta Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getBetaContributionData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="symbol" />
                  <YAxis label={{ value: 'Beta Contribution', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value}`,
                      name === 'betaContribution' ? 'Beta Contribution' : name
                    ]}
                  />
                  <Bar dataKey="betaContribution" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Portfolio Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Risk Characteristics</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Portfolio Beta:</strong> {metrics.portfolioBeta} ({getRiskAssessment(metrics.portfolioBeta).level})</p>
                <p><strong>Market Correlation:</strong> {metrics.portfolioBeta > 1 ? 'Higher than market' : 'Lower than market'}</p>
                <p><strong>Diversification:</strong> {holdings.length} holdings</p>
                <p><strong>Weight Distribution:</strong> {metrics.totalWeight === 100 ? 'Fully invested' : `${metrics.totalWeight}% invested`}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Return Expectations</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Expected Return:</strong> {metrics.portfolioExpectedReturn}% (CAPM)</p>
                <p><strong>Portfolio Alpha:</strong> {metrics.portfolioAlpha > 0 ? '+' : ''}{metrics.portfolioAlpha}%</p>
                <p><strong>Risk Premium:</strong> {(metrics.portfolioExpectedReturn - riskFreeRate).toFixed(2)}%</p>
                <p><strong>Performance:</strong> {metrics.portfolioAlpha > 0 ? 'Outperforming' : metrics.portfolioAlpha < 0 ? 'Underperforming' : 'Market-like'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
