
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Plus, Target } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, LineChart, ReferenceLine } from 'recharts';

interface Stock {
  symbol: string;
  name: string;
  beta: number;
  actualReturn: number;
  expectedReturn: number;
  alpha: number;
  valuation: 'Undervalued' | 'Overvalued' | 'Fair Value';
}

export const SMLVisualizer = () => {
  const [riskFreeRate, setRiskFreeRate] = useState(4.5);
  const [marketReturn, setMarketReturn] = useState(10.0);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [newStock, setNewStock] = useState('');
  const [smlData, setSmlData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateSMLLine();
    loadDefaultStocks();
  }, [riskFreeRate, marketReturn]);

  const generateSMLLine = () => {
    const smlPoints = [];
    for (let beta = 0; beta <= 2.5; beta += 0.1) {
      const expectedReturn = riskFreeRate + beta * (marketReturn - riskFreeRate);
      smlPoints.push({
        beta: Number(beta.toFixed(1)),
        expectedReturn: Number(expectedReturn.toFixed(2)),
        isSML: true
      });
    }
    setSmlData(smlPoints);
  };

  const loadDefaultStocks = () => {
    const defaultStocks: Stock[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        beta: 1.23,
        actualReturn: 12.5,
        expectedReturn: riskFreeRate + 1.23 * (marketReturn - riskFreeRate),
        alpha: 0,
        valuation: 'Fair Value'
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        beta: 1.89,
        actualReturn: 18.2,
        expectedReturn: riskFreeRate + 1.89 * (marketReturn - riskFreeRate),
        alpha: 0,
        valuation: 'Fair Value'
      },
      {
        symbol: 'XOM',
        name: 'Exxon Mobil',
        beta: 0.67,
        actualReturn: 6.8,
        expectedReturn: riskFreeRate + 0.67 * (marketReturn - riskFreeRate),
        alpha: 0,
        valuation: 'Fair Value'
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        beta: 1.12,
        actualReturn: 11.8,
        expectedReturn: riskFreeRate + 1.12 * (marketReturn - riskFreeRate),
        alpha: 0,
        valuation: 'Fair Value'
      }
    ];

    // Calculate alpha and valuation for each stock
    const updatedStocks = defaultStocks.map(stock => {
      const expectedReturn = riskFreeRate + stock.beta * (marketReturn - riskFreeRate);
      const alpha = stock.actualReturn - expectedReturn;
      let valuation: 'Undervalued' | 'Overvalued' | 'Fair Value';
      
      if (alpha > 0.5) valuation = 'Undervalued';
      else if (alpha < -0.5) valuation = 'Overvalued';
      else valuation = 'Fair Value';

      return {
        ...stock,
        expectedReturn: Number(expectedReturn.toFixed(2)),
        alpha: Number(alpha.toFixed(2)),
        valuation
      };
    });

    setStocks(updatedStocks);
  };

  const addStock = async () => {
    if (!newStock) return;
    
    setLoading(true);
    
    // Simulate fetching stock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockBeta = 0.5 + Math.random() * 1.5;
    const expectedReturn = riskFreeRate + mockBeta * (marketReturn - riskFreeRate);
    const actualReturn = expectedReturn + (Math.random() - 0.5) * 4; // Add some random alpha
    const alpha = actualReturn - expectedReturn;
    
    let valuation: 'Undervalued' | 'Overvalued' | 'Fair Value';
    if (alpha > 0.5) valuation = 'Undervalued';
    else if (alpha < -0.5) valuation = 'Overvalued';
    else valuation = 'Fair Value';

    const newStockData: Stock = {
      symbol: newStock.toUpperCase(),
      name: `${newStock.toUpperCase()} Company`,
      beta: Number(mockBeta.toFixed(2)),
      actualReturn: Number(actualReturn.toFixed(2)),
      expectedReturn: Number(expectedReturn.toFixed(2)),
      alpha: Number(alpha.toFixed(2)),
      valuation
    };

    setStocks(prev => [...prev, newStockData]);
    setNewStock('');
    setLoading(false);
  };

  const removeStock = (symbol: string) => {
    setStocks(prev => prev.filter(stock => stock.symbol !== symbol));
  };

  const getValuationColor = (valuation: string) => {
    switch (valuation) {
      case 'Undervalued': return 'bg-green-100 text-green-800';
      case 'Overvalued': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockColor = (valuation: string) => {
    switch (valuation) {
      case 'Undervalued': return '#10b981';
      case 'Overvalued': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Security Market Line Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="riskFreeRate">Risk-Free Rate (%)</Label>
              <Input
                id="riskFreeRate"
                type="number"
                step="0.1"
                value={riskFreeRate}
                onChange={(e) => setRiskFreeRate(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="marketReturn">Market Return (%)</Label>
              <Input
                id="marketReturn"
                type="number"
                step="0.1"
                value={marketReturn}
                onChange={(e) => setMarketReturn(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="newStock">Add Stock</Label>
              <div className="flex gap-2">
                <Input
                  id="newStock"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value.toUpperCase())}
                  placeholder="NVDA"
                />
                <Button onClick={addStock} disabled={loading}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SML Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Security Market Line Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="beta"
                  domain={[0, 2.5]}
                  type="number"
                  label={{ value: 'Beta (Systematic Risk)', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  domain={[0, 25]}
                  label={{ value: 'Expected Return (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name, props) => {
                    if (props.payload.isSML) {
                      return [`${value}%`, 'SML Expected Return'];
                    }
                    const stock = stocks.find(s => s.beta === props.payload.beta && s.actualReturn === props.payload.actualReturn);
                    return [
                      `${value}%`,
                      stock ? `${stock.symbol} (${stock.valuation})` : 'Stock'
                    ];
                  }}
                  labelFormatter={(value) => `Beta: ${value}`}
                />
                <Legend />
                
                {/* SML Line */}
                <Scatter 
                  name="Security Market Line"
                  data={smlData}
                  fill="#8884d8"
                  line={{ stroke: '#8884d8', strokeWidth: 2 }}
                  shape="none"
                />
                
                {/* Individual Stocks */}
                {stocks.map((stock, index) => (
                  <Scatter
                    key={stock.symbol}
                    name={stock.symbol}
                    data={[{ beta: stock.beta, actualReturn: stock.actualReturn }]}
                    fill={getStockColor(stock.valuation)}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Interpretation:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Stocks above the SML are undervalued (positive alpha)</li>
              <li>Stocks below the SML are overvalued (negative alpha)</li>
              <li>Stocks on the SML are fairly valued</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Stock Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Stock Valuation Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Symbol</th>
                  <th className="text-left p-2">Beta</th>
                  <th className="text-left p-2">Expected Return</th>
                  <th className="text-left p-2">Actual Return</th>
                  <th className="text-left p-2">Alpha</th>
                  <th className="text-left p-2">Valuation</th>
                  <th className="text-left p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.symbol} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{stock.symbol}</td>
                    <td className="p-2">{stock.beta}</td>
                    <td className="p-2">{stock.expectedReturn}%</td>
                    <td className="p-2">{stock.actualReturn}%</td>
                    <td className={`p-2 ${stock.alpha > 0 ? 'text-green-600' : stock.alpha < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {stock.alpha > 0 ? '+' : ''}{stock.alpha}%
                    </td>
                    <td className="p-2">
                      <Badge className={getValuationColor(stock.valuation)}>
                        {stock.valuation}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeStock(stock.symbol)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
