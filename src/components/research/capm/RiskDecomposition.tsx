
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

interface RiskBreakdown {
  symbol: string;
  totalRisk: number;
  systematicRisk: number;
  unsystematicRisk: number;
  beta: number;
  rSquared: number;
  marketVariance: number;
}

export const RiskDecomposition = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState<RiskBreakdown | null>(null);

  const analyzeRisk = async () => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const beta = 0.8 + Math.random() * 1.0;
    const rSquared = 0.4 + Math.random() * 0.4;
    const marketVariance = 0.04; // 20% market volatility squared
    const totalVariance = 0.03 + Math.random() * 0.05; // Total stock variance
    
    const systematicVariance = Math.pow(beta, 2) * marketVariance;
    const unsystematicVariance = totalVariance - systematicVariance;
    
    const breakdown: RiskBreakdown = {
      symbol,
      totalRisk: Math.sqrt(totalVariance) * 100,
      systematicRisk: Math.sqrt(systematicVariance) * 100,
      unsystematicRisk: Math.sqrt(Math.max(0, unsystematicVariance)) * 100,
      beta: Number(beta.toFixed(3)),
      rSquared: Number(rSquared.toFixed(3)),
      marketVariance: marketVariance
    };
    
    setRiskData(breakdown);
    setLoading(false);
  };

  const getPieData = () => {
    if (!riskData) return [];
    
    const systematicPortion = Math.pow(riskData.systematicRisk / 100, 2);
    const unsystematicPortion = Math.pow(riskData.unsystematicRisk / 100, 2);
    const total = systematicPortion + unsystematicPortion;
    
    return [
      {
        name: 'Systematic Risk',
        value: Number(((systematicPortion / total) * 100).toFixed(1)),
        color: '#3b82f6'
      },
      {
        name: 'Unsystematic Risk',
        value: Number(((unsystematicPortion / total) * 100).toFixed(1)),
        color: '#ef4444'
      }
    ];
  };

  const getComparisonData = () => {
    if (!riskData) return [];
    
    return [
      {
        type: 'Total Risk',
        value: Number(riskData.totalRisk.toFixed(2)),
        color: '#8b5cf6'
      },
      {
        type: 'Systematic Risk',
        value: Number(riskData.systematicRisk.toFixed(2)),
        color: '#3b82f6'
      },
      {
        type: 'Unsystematic Risk',
        value: Number(riskData.unsystematicRisk.toFixed(2)),
        color: '#ef4444'
      }
    ];
  };

  return (
    <div className="space-y-6">
      {/* Risk Analysis Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Risk Decomposition Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="symbol">Stock Symbol</Label>
              <Input
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="AAPL"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={analyzeRisk} disabled={loading} className="w-full">
                {loading ? 'Analyzing Risk...' : 'Analyze Risk Components'}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Risk Decomposition Formula</h4>
            <div className="text-center space-y-2">
              <div className="font-mono text-lg">
                σ²(R<sub>i</sub>) = β²<sub>i</sub> × σ²(R<sub>m</sub>) + σ²(ε<sub>i</sub>)
              </div>
              <div className="text-sm text-gray-600">
                Total Risk = Systematic Risk + Unsystematic Risk
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Breakdown Results */}
      {riskData && (
        <>
          {/* Risk Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {riskData.totalRisk.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Total volatility (σ)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Systematic Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {riskData.systematicRisk.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Market-related risk
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  β² × σ²(market)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Unsystematic Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {riskData.unsystematicRisk.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Company-specific risk
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Diversifiable risk
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">R-Squared</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {(riskData.rSquared * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Systematic risk proportion
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Composition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Components Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getComparisonData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis label={{ value: 'Risk (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Analysis Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Detailed Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Risk Components</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Total Risk (σ):</span>
                      <span className="text-purple-600 font-bold">{riskData.totalRisk.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Systematic Risk:</span>
                      <span className="text-blue-600 font-bold">{riskData.systematicRisk.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">Unsystematic Risk:</span>
                      <span className="text-red-600 font-bold">{riskData.unsystematicRisk.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Risk Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Beta (β):</span>
                      <span className="font-bold">{riskData.beta}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">R-Squared:</span>
                      <span className="font-bold">{(riskData.rSquared * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Diversification Benefit:</span>
                      <span className="font-bold">{((riskData.unsystematicRisk / riskData.totalRisk) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Key Insights</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>Systematic Risk ({((riskData.systematicRisk / riskData.totalRisk) * 100).toFixed(1)}% of total):</strong> 
                    {' '}Cannot be diversified away as it's correlated with market movements
                  </li>
                  <li>
                    <strong>Unsystematic Risk ({((riskData.unsystematicRisk / riskData.totalRisk) * 100).toFixed(1)}% of total):</strong> 
                    {' '}Can be reduced through diversification
                  </li>
                  <li>
                    <strong>R-Squared ({(riskData.rSquared * 100).toFixed(1)}%):</strong> 
                    {' '}{riskData.rSquared > 0.7 ? 'High correlation with market' : riskData.rSquared > 0.4 ? 'Moderate correlation with market' : 'Low correlation with market'}
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
