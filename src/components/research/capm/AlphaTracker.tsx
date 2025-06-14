
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AlphaResult {
  symbol: string;
  jensensAlpha: number;
  informationRatio: number;
  trackingError: number;
  pValue: number;
  tStat: number;
  significance: 'High' | 'Medium' | 'Low' | 'Not Significant';
  confidence: number;
}

export const AlphaTracker = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [period, setPeriod] = useState('2Y');
  const [loading, setLoading] = useState(false);
  const [alphaResults, setAlphaResults] = useState<AlphaResult[]>([]);
  const [rollingAlphaData, setRollingAlphaData] = useState<any[]>([]);
  const [currentAlpha, setCurrentAlpha] = useState<AlphaResult | null>(null);

  const calculateAlpha = async () => {
    setLoading(true);
    
    // Simulate alpha calculation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const alpha = (Math.random() - 0.5) * 0.08; // Alpha between -4% and +4%
    const trackingError = 0.02 + Math.random() * 0.04; // Tracking error between 2% and 6%
    const informationRatio = alpha / trackingError;
    const tStat = Math.abs(alpha) / (trackingError / Math.sqrt(252)); // Assuming daily data for 1 year
    const pValue = Math.max(0.001, 1 - Math.abs(tStat) / 3); // Simplified p-value calculation
    
    let significance: 'High' | 'Medium' | 'Low' | 'Not Significant';
    if (pValue < 0.01) significance = 'High';
    else if (pValue < 0.05) significance = 'Medium';
    else if (pValue < 0.1) significance = 'Low';
    else significance = 'Not Significant';

    const result: AlphaResult = {
      symbol,
      jensensAlpha: Number((alpha * 100).toFixed(3)),
      informationRatio: Number(informationRatio.toFixed(3)),
      trackingError: Number((trackingError * 100).toFixed(2)),
      pValue: Number(pValue.toFixed(3)),
      tStat: Number(tStat.toFixed(2)),
      significance,
      confidence: Number(((1 - pValue) * 100).toFixed(1))
    };

    setCurrentAlpha(result);
    setAlphaResults(prev => {
      const filtered = prev.filter(r => r.symbol !== symbol);
      return [...filtered, result].slice(-10); // Keep last 10 results
    });

    // Generate rolling alpha data
    const rollingData = Array.from({ length: 60 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (60 - i));
      const variation = Math.sin(i / 10) * 0.02 + (Math.random() - 0.5) * 0.01;
      return {
        date: date.toISOString().split('T')[0],
        alpha: Number(((alpha + variation) * 100).toFixed(3)),
        confidenceUpper: Number(((alpha + variation + 0.01) * 100).toFixed(3)),
        confidenceLower: Number(((alpha + variation - 0.01) * 100).toFixed(3))
      };
    });

    setRollingAlphaData(rollingData);
    setLoading(false);
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'Low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlphaColor = (alpha: number) => {
    if (alpha > 1) return 'text-green-600';
    if (alpha < -1) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Alpha Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Jensen's Alpha Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              <Label htmlFor="period">Analysis Period</Label>
              <select 
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="1Y">1 Year</option>
                <option value="2Y">2 Years</option>
                <option value="3Y">3 Years</option>
                <option value="5Y">5 Years</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={calculateAlpha} disabled={loading} className="w-full">
                {loading ? 'Calculating Alpha...' : 'Calculate Alpha'}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Jensen's Alpha Formula</h4>
            <div className="text-center font-mono text-lg mb-2">
              α<sub>i</sub> = R<sub>i</sub> - [R<sub>f</sub> + β<sub>i</sub> × (R<sub>m</sub> - R<sub>f</sub>)]
            </div>
            <div className="text-sm text-gray-600 text-center">
              Alpha = Actual Return - CAPM Expected Return
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Alpha Results */}
      {currentAlpha && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Jensen's Alpha</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getAlphaColor(currentAlpha.jensensAlpha)}`}>
                {currentAlpha.jensensAlpha > 0 ? '+' : ''}{currentAlpha.jensensAlpha}%
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Annual excess return
              </div>
              <Badge className={getSignificanceColor(currentAlpha.significance)}>
                {currentAlpha.significance}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Information Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {currentAlpha.informationRatio}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Alpha per unit of tracking error
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {currentAlpha.informationRatio > 0.5 ? 'Good' : currentAlpha.informationRatio > 0 ? 'Fair' : 'Poor'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tracking Error</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {currentAlpha.trackingError}%
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Standard deviation of excess returns
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistical Significance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {currentAlpha.confidence}%
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Confidence level
              </div>
              <div className="text-xs text-gray-500 mt-1">
                p-value: {currentAlpha.pValue}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rolling Alpha Chart */}
      {rollingAlphaData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rolling Alpha Trend (60-day window)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rollingAlphaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis 
                    label={{ value: 'Alpha (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value, name) => [`${value}%`, name === 'alpha' ? 'Alpha' : 'Confidence Band']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="confidenceUpper" 
                    stroke="#e5e7eb" 
                    strokeDasharray="3 3"
                    dot={false}
                    name="95% Confidence Upper"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confidenceLower" 
                    stroke="#e5e7eb" 
                    strokeDasharray="3 3"
                    dot={false}
                    name="95% Confidence Lower"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="alpha" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                    name="Alpha"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alpha Contributors */}
      {alphaResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Alpha Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Symbol</th>
                    <th className="text-left p-2">Alpha</th>
                    <th className="text-left p-2">Info Ratio</th>
                    <th className="text-left p-2">Tracking Error</th>
                    <th className="text-left p-2">Significance</th>
                    <th className="text-left p-2">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {alphaResults.sort((a, b) => Math.abs(b.jensensAlpha) - Math.abs(a.jensensAlpha)).map((result) => (
                    <tr key={result.symbol} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{result.symbol}</td>
                      <td className={`p-2 font-medium ${getAlphaColor(result.jensensAlpha)}`}>
                        {result.jensensAlpha > 0 ? '+' : ''}{result.jensensAlpha}%
                      </td>
                      <td className="p-2">{result.informationRatio}</td>
                      <td className="p-2">{result.trackingError}%</td>
                      <td className="p-2">
                        <Badge className={getSignificanceColor(result.significance)}>
                          {result.significance}
                        </Badge>
                      </td>
                      <td className="p-2">{result.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alpha Interpretation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Alpha Interpretation Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Alpha Values</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-green-600 font-medium">Positive Alpha:</span> Outperforming market expectations</li>
                <li><span className="text-red-600 font-medium">Negative Alpha:</span> Underperforming market expectations</li>
                <li><span className="text-gray-600 font-medium">Zero Alpha:</span> Performing as expected by CAPM</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Statistical Significance</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-green-600 font-medium">High (p &lt; 0.01):</span> Very reliable alpha</li>
                <li><span className="text-blue-600 font-medium">Medium (p &lt; 0.05):</span> Moderately reliable</li>
                <li><span className="text-yellow-600 font-medium">Low (p &lt; 0.1):</span> Weak evidence</li>
                <li><span className="text-gray-600 font-medium">Not Significant:</span> Likely due to chance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
