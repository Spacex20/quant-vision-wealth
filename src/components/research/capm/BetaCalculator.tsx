
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calculator, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

interface BetaResult {
  beta: number;
  adjustedBeta: number;
  rSquared: number;
  alpha: number;
  standardError: number;
  confidence: [number, number];
}

export const BetaCalculator = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [period, setPeriod] = useState('2Y');
  const [frequency, setFrequency] = useState('daily');
  const [benchmark, setBenchmark] = useState('SPY');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BetaResult | null>(null);
  const [regressionData, setRegressionData] = useState<any[]>([]);
  const [rollingBetaData, setRollingBetaData] = useState<any[]>([]);

  const calculateBeta = async () => {
    setLoading(true);
    
    // Simulate beta calculation with mock data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock beta calculation results
    const baseBeta = 0.8 + Math.random() * 1.0; // Random beta between 0.8 and 1.8
    const mockResult: BetaResult = {
      beta: Number(baseBeta.toFixed(3)),
      adjustedBeta: Number((0.67 * baseBeta + 0.33 * 1.0).toFixed(3)),
      rSquared: Number((0.4 + Math.random() * 0.4).toFixed(3)),
      alpha: Number(((Math.random() - 0.5) * 0.02).toFixed(4)),
      standardError: Number((0.05 + Math.random() * 0.1).toFixed(3)),
      confidence: [
        Number((baseBeta - 0.15).toFixed(3)),
        Number((baseBeta + 0.15).toFixed(3))
      ]
    };

    // Generate mock regression data (stock returns vs market returns)
    const mockRegressionData = Array.from({ length: 100 }, (_, i) => {
      const marketReturn = (Math.random() - 0.5) * 0.08;
      const stockReturn = mockResult.alpha + mockResult.beta * marketReturn + (Math.random() - 0.5) * 0.04;
      return {
        marketReturn: Number((marketReturn * 100).toFixed(2)),
        stockReturn: Number((stockReturn * 100).toFixed(2))
      };
    });

    // Generate mock rolling beta data
    const mockRollingBeta = Array.from({ length: 252 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (252 - i));
      const variation = Math.sin(i / 50) * 0.2 + (Math.random() - 0.5) * 0.1;
      return {
        date: date.toISOString().split('T')[0],
        beta: Number((baseBeta + variation).toFixed(3))
      };
    });

    setResult(mockResult);
    setRegressionData(mockRegressionData);
    setRollingBetaData(mockRollingBeta);
    setLoading(false);
  };

  const getBetaInterpretation = (beta: number) => {
    if (beta < 0.5) return { text: "Low Risk - Less volatile than market", color: "bg-green-100 text-green-800" };
    if (beta < 1.0) return { text: "Conservative - Less volatile than market", color: "bg-blue-100 text-blue-800" };
    if (beta < 1.5) return { text: "Aggressive - More volatile than market", color: "bg-orange-100 text-orange-800" };
    return { text: "High Risk - Much more volatile than market", color: "bg-red-100 text-red-800" };
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Beta Calculator & Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="symbol">Stock Symbol</Label>
              <Input
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="AAPL"
              />
            </div>
            <div>
              <Label htmlFor="period">Time Period</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1Y">1 Year</SelectItem>
                  <SelectItem value="2Y">2 Years</SelectItem>
                  <SelectItem value="3Y">3 Years</SelectItem>
                  <SelectItem value="5Y">5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="frequency">Return Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="benchmark">Market Benchmark</Label>
              <Select value={benchmark} onValueChange={setBenchmark}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SPY">S&P 500 (SPY)</SelectItem>
                  <SelectItem value="QQQ">NASDAQ (QQQ)</SelectItem>
                  <SelectItem value="VTI">Total Market (VTI)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={calculateBeta} disabled={loading} className="w-full">
            {loading ? 'Calculating Beta...' : 'Calculate Beta'}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <>
          {/* Beta Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Beta Coefficient</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {result.beta}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  95% Confidence: [{result.confidence[0]}, {result.confidence[1]}]
                </div>
                <Badge className={getBetaInterpretation(result.beta).color}>
                  {getBetaInterpretation(result.beta).text}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Adjusted Beta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {result.adjustedBeta}
                </div>
                <div className="text-sm text-gray-600">
                  Blume Adjustment:<br />
                  0.67 × {result.beta} + 0.33 × 1.0
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">R-Squared</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {(result.rSquared * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">
                  Proportion of variance<br />
                  explained by market
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regression Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Regression Analysis: Stock Returns vs Market Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={regressionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="marketReturn" 
                      label={{ value: 'Market Returns (%)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      label={{ value: 'Stock Returns (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value}%`, 
                        name === 'stockReturn' ? `${symbol} Return` : 'Market Return'
                      ]}
                    />
                    <Scatter 
                      dataKey="stockReturn" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Slope (Beta):</strong> {result.beta}</p>
                <p><strong>R²:</strong> {(result.rSquared * 100).toFixed(1)}%</p>
                <p><strong>Alpha:</strong> {(result.alpha * 100).toFixed(2)}%</p>
              </div>
            </CardContent>
          </Card>

          {/* Rolling Beta Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Rolling Beta Trend (252-day window)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rollingBetaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis 
                      label={{ value: 'Beta', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value) => [`${value}`, 'Beta']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="beta" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
