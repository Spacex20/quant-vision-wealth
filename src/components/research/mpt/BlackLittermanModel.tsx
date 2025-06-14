
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, Trash, BrainCircuit, Target, PieChart as PieChartIcon, BarChart } from 'lucide-react';

// Mock data, consistent with other MPT tools
const defaultAssets = [
  { symbol: 'AAPL', expectedReturn: 0.25, volatility: 0.35 },
  { symbol: 'MSFT', expectedReturn: 0.22, volatility: 0.30 },
  { symbol: 'GOOGL', expectedReturn: 0.20, volatility: 0.32 },
  { symbol: 'AMZN', expectedReturn: 0.28, volatility: 0.40 },
  { symbol: 'JNJ', expectedReturn: 0.10, volatility: 0.18 },
];

const correlations = [
  [1.00, 0.65, 0.60, 0.70, 0.30],
  [0.65, 1.00, 0.75, 0.80, 0.35],
  [0.60, 0.75, 1.00, 0.78, 0.25],
  [0.70, 0.80, 0.78, 1.00, 0.40],
  [0.30, 0.35, 0.25, 0.40, 1.00],
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface View {
  id: string;
  asset: string;
  returnValue: number;
  confidence: number;
}

interface PortfolioPoint {
  risk: number;
  return: number;
  sharpe: number;
  weights: number[];
}

interface BlendedPortfolio {
  weights: { name: string; value: number }[];
  return: number;
  risk: number;
  sharpe: number;
}

export const BlackLittermanModel = () => {
  const [assets] = useState(defaultAssets);
  const [riskFreeRate] = useState(0.045);
  const [views, setViews] = useState<View[]>([]);
  const [newView, setNewView] = useState({ asset: 'AAPL', returnValue: 0.30, confidence: 50 });
  const [blendedPortfolio, setBlendedPortfolio] = useState<BlendedPortfolio | null>(null);
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

  const handleAddView = () => {
    if (newView.asset && newView.returnValue && newView.confidence) {
      setViews([...views, { ...newView, id: crypto.randomUUID() }]);
    }
  };

  const handleRemoveView = (id: string) => {
    setViews(views.filter(v => v.id !== id));
  };
  
  const calculateBlendedPortfolio = () => {
    setLoading(true);
    setBlendedPortfolio(null);
    setTimeout(() => {
      const blendedAssets = assets.map(asset => {
        const view = views.find(v => v.asset === asset.symbol);
        if (!view) return asset;

        const confidenceWeight = view.confidence / 100;
        const blendedReturn = (1 - confidenceWeight) * asset.expectedReturn + confidenceWeight * view.returnValue;
        return { ...asset, expectedReturn: blendedReturn };
      });

      const numPortfolios = 5000;
      let maxSharpePortfolio: PortfolioPoint | null = null;

      for (let i = 0; i < numPortfolios; i++) {
        let weights = blendedAssets.map(() => Math.random());
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        weights = weights.map(w => w / totalWeight);

        const portfolioReturn = blendedAssets.reduce((sum, asset, idx) => sum + asset.expectedReturn * weights[idx], 0);
        
        let portfolioVariance = 0;
        for (let j = 0; j < blendedAssets.length; j++) {
          for (let k = 0; k < blendedAssets.length; k++) {
            portfolioVariance += weights[j] * weights[k] * covarianceMatrix[j][k];
          }
        }
        const portfolioRisk = Math.sqrt(portfolioVariance);
        const sharpeRatio = (portfolioReturn - riskFreeRate) / portfolioRisk;

        const point = { return: portfolioReturn, risk: portfolioRisk, sharpe: sharpeRatio, weights };
        
        if (!maxSharpePortfolio || point.sharpe > maxSharpePortfolio.sharpe) {
          maxSharpePortfolio = point;
        }
      }

      if (maxSharpePortfolio) {
        setBlendedPortfolio({
          return: maxSharpePortfolio.return,
          risk: maxSharpePortfolio.risk,
          sharpe: maxSharpePortfolio.sharpe,
          weights: maxSharpePortfolio.weights.map((w, idx) => ({ name: assets[idx].symbol, value: w })),
        });
      }
      setLoading(false);
    }, 100);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5" />
            Black-Litterman Model
          </CardTitle>
          <CardDescription>Combine market equilibrium returns with your personal views to generate a blended, optimized portfolio.</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5" />Market Equilibrium</CardTitle>
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
              <CardTitle>Add Investor View</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Asset</Label>
                <Select value={newView.asset} onValueChange={val => setNewView({...newView, asset: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {assets.map(a => <SelectItem key={a.symbol} value={a.symbol}>{a.symbol}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="returnValue">View on Return (%)</Label>
                <Input id="returnValue" type="number" value={newView.returnValue * 100} onChange={e => setNewView({...newView, returnValue: Number(e.target.value) / 100})} step="0.5" />
              </div>
              <div>
                 <Label>Confidence ({newView.confidence}%)</Label>
                 <Slider value={[newView.confidence]} onValueChange={val => setNewView({...newView, confidence: val[0]})} max={100} step={5} />
              </div>
              <Button onClick={handleAddView} className="w-full"><Plus className="w-4 h-4 mr-2"/>Add View</Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
              <CardHeader>
                <CardTitle>Your Views</CardTitle>
              </CardHeader>
              <CardContent>
                {views.length > 0 ? (
                  <Table>
                    <TableHeader><TableRow><TableHead>Asset</TableHead><TableHead>View E(R)</TableHead><TableHead>Confidence</TableHead><TableHead></TableHead></TableRow></TableHeader>
                    <TableBody>
                      {views.map(view => (
                        <TableRow key={view.id}>
                          <TableCell>{view.asset}</TableCell>
                          <TableCell>{(view.returnValue * 100).toFixed(1)}%</TableCell>
                          <TableCell>{view.confidence}%</TableCell>
                          <TableCell><Button variant="ghost" size="icon" onClick={() => handleRemoveView(view.id)}><Trash className="w-4 h-4" /></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : <p className="text-muted-foreground text-center">No views added yet.</p>}
                 <Button onClick={calculateBlendedPortfolio} className="w-full mt-4" disabled={loading || views.length === 0}>
                    {loading ? 'Calculating...' : 'Calculate Blended Portfolio'}
                </Button>
              </CardContent>
          </Card>

          {blendedPortfolio ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" />Optimal Blended Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Return</p>
                    <p className="text-2xl font-bold">{(blendedPortfolio.return * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Portfolio Risk</p>
                    <p className="text-2xl font-bold">{(blendedPortfolio.risk * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                    <p className="text-2xl font-bold">{blendedPortfolio.sharpe.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <PieChartIcon className="w-5 h-5" />
                        Asset Allocation
                    </h3>
                    <div className="h-64">
                       <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={blendedPortfolio.weights}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {blendedPortfolio.weights.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${(value * 100).toFixed(2)}%`} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
              </CardContent>
            </Card>
          ) : (
             <Card className="flex items-center justify-center h-64">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center text-center">
                        <p className="text-lg text-muted-foreground">
                            {loading ? "Calculating optimal portfolio..." : "Your blended portfolio results will appear here."}
                        </p>
                    </div>
                </CardContent>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
};
