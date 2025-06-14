
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash, Target, SlidersHorizontal, BarChart } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Asset {
  symbol: string;
  expectedReturn: number;
  volatility: number;
}

interface PortfolioPoint {
  risk: number;
  return: number;
  sharpe: number;
  weights: number[];
}

const defaultAssets: Asset[] = [
  { symbol: 'AAPL', expectedReturn: 0.25, volatility: 0.35 },
  { symbol: 'MSFT', expectedReturn: 0.22, volatility: 0.30 },
  { symbol: 'GOOGL', expectedReturn: 0.20, volatility: 0.32 },
  { symbol: 'AMZN', expectedReturn: 0.28, volatility: 0.40 },
  { symbol: 'JNJ', expectedReturn: 0.10, volatility: 0.18 },
];

// Mock correlation matrix
const correlations = [
  [1.00, 0.65, 0.60, 0.70, 0.30],
  [0.65, 1.00, 0.75, 0.80, 0.35],
  [0.60, 0.75, 1.00, 0.78, 0.25],
  [0.70, 0.80, 0.78, 1.00, 0.40],
  [0.30, 0.35, 0.25, 0.40, 1.00],
];

export const MPTOptimizer = () => {
  const [assets, setAssets] = useState<Asset[]>(defaultAssets);
  const [riskFreeRate, setRiskFreeRate] = useState(0.045);
  const [frontierData, setFrontierData] = useState<PortfolioPoint[]>([]);
  const [optimalPortfolios, setOptimalPortfolios] = useState<Record<string, PortfolioPoint | null>>({
    minVol: null,
    maxSharpe: null,
  });
  const [loading, setLoading] = useState(false);

  const covarianceMatrix = useMemo(() => {
    const numAssets = assets.length;
    const matrix = Array(numAssets).fill(0).map(() => Array(numAssets).fill(0));
    for (let i = 0; i < numAssets; i++) {
      for (let j = 0; j < numAssets; j++) {
        matrix[i][j] = correlations[i][j] * assets[i].volatility * assets[j].volatility;
      }
    }
    return matrix;
  }, [assets]);

  const runOptimization = () => {
    setLoading(true);
    // Using setTimeout to prevent UI freezing during calculation
    setTimeout(() => {
      const numPortfolios = 5000;
      const points: PortfolioPoint[] = [];
      let minVolPortfolio: PortfolioPoint | null = null;
      let maxSharpePortfolio: PortfolioPoint | null = null;

      for (let i = 0; i < numPortfolios; i++) {
        // Generate random weights
        let weights = assets.map(() => Math.random());
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        weights = weights.map(w => w / totalWeight);

        // Calculate portfolio return and risk
        const portfolioReturn = assets.reduce((sum, asset, idx) => sum + asset.expectedReturn * weights[idx], 0);
        
        let portfolioVariance = 0;
        for (let j = 0; j < assets.length; j++) {
          for (let k = 0; k < assets.length; k++) {
            portfolioVariance += weights[j] * weights[k] * covarianceMatrix[j][k];
          }
        }
        const portfolioRisk = Math.sqrt(portfolioVariance);
        const sharpeRatio = (portfolioReturn - riskFreeRate) / portfolioRisk;

        const point = { return: portfolioReturn, risk: portfolioRisk, sharpe: sharpeRatio, weights };
        points.push(point);

        if (!minVolPortfolio || point.risk < minVolPortfolio.risk) {
          minVolPortfolio = point;
        }
        if (!maxSharpePortfolio || point.sharpe > maxSharpePortfolio.sharpe) {
          maxSharpePortfolio = point;
        }
      }

      setFrontierData(points);
      setOptimalPortfolios({ minVol: minVolPortfolio, maxSharpe: maxSharpePortfolio });
      setLoading(false);
    }, 100);
  };
  
  const selectedPortfolio = optimalPortfolios.maxSharpe;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Assets and Config */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5" />Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>E(R)</TableHead>
                    <TableHead>Volatility</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map(asset => (
                    <TableRow key={asset.symbol}>
                      <TableCell>{asset.symbol}</TableCell>
                      <TableCell>{(asset.expectedReturn * 100).toFixed(1)}%</TableCell>
                      <TableCell>{(asset.volatility * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><SlidersHorizontal className="w-5 h-5" />Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="riskFreeRate">Risk-Free Rate</Label>
                <Input id="riskFreeRate" type="number" value={riskFreeRate * 100} onChange={e => setRiskFreeRate(Number(e.target.value) / 100)} step="0.1" />
              </div>
              <Button onClick={runOptimization} className="w-full" disabled={loading}>
                {loading ? 'Optimizing...' : 'Run Optimization'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Chart and Results */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Efficient Frontier</CardTitle>
              <CardDescription>Each point represents a possible portfolio.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="risk" name="Risk (Volatility)" unit="%" domain={[0, 'dataMax + 0.05']} tickFormatter={v => (v * 100).toFixed(0)} />
                    <YAxis type="number" dataKey="return" name="Expected Return" unit="%" domain={[0, 'dataMax + 0.05']} tickFormatter={v => (v * 100).toFixed(0)} />
                    <Tooltip formatter={(value, name) => [`(${(value * 100).toFixed(2)}%)`, name]} />
                    <Legend />
                    <Scatter name="Random Portfolios" data={frontierData} fill="#8884d8" shape="circle" style={{opacity: 0.5}} />
                    {optimalPortfolios.minVol && <Scatter name="Min Volatility" data={[optimalPortfolios.minVol]} fill="#82ca9d" shape="star" />}
                    {optimalPortfolios.maxSharpe && <Scatter name="Max Sharpe Ratio" data={[optimalPortfolios.maxSharpe]} fill="#ffc658" shape="star" />}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
       {selectedPortfolio && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" />Optimal Portfolio (Max Sharpe Ratio)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Expected Return</p>
                <p className="text-2xl font-bold">{(selectedPortfolio.return * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Risk</p>
                <p className="text-2xl font-bold">{(selectedPortfolio.risk * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                <p className="text-2xl font-bold">{selectedPortfolio.sharpe.toFixed(2)}</p>
              </div>
            </div>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Weight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset, idx) => (
                  <TableRow key={asset.symbol}>
                    <TableCell>{asset.symbol}</TableCell>
                    <TableCell>{(selectedPortfolio.weights[idx] * 100).toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
