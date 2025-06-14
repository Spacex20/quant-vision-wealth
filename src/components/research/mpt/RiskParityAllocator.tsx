
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Scaling, BarChart, PieChart as PieChartIcon, Target } from 'lucide-react';

interface Asset {
  symbol: string;
  expectedReturn: number;
  volatility: number;
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

interface AllocationResult {
  weights: { symbol: string; weight: number }[];
  riskContributions: { name: string; value: number }[]; // for pie chart
  portfolioVolatility: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const RiskParityAllocator = () => {
  const [assets] = useState<Asset[]>(defaultAssets);
  const [result, setResult] = useState<AllocationResult | null>(null);

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

  const calculateRiskParity = () => {
    // 1. Calculate inverse volatility weights
    const inverseVols = assets.map(a => 1 / a.volatility);
    const sumInverseVols = inverseVols.reduce((sum, iv) => sum + iv, 0);
    const weights = assets.map((a, i) => ({
      symbol: a.symbol,
      weight: inverseVols[i] / sumInverseVols,
    }));
    const weightVector = weights.map(w => w.weight);

    // 2. Calculate risk contributions
    const numAssets = assets.length;
    let portfolioVariance = 0;
    for (let i = 0; i < numAssets; i++) {
      for (let j = 0; j < numAssets; j++) {
        portfolioVariance += weightVector[i] * weightVector[j] * covarianceMatrix[i][j];
      }
    }
    const portfolioVolatility = Math.sqrt(portfolioVariance);

    const riskContributionsRaw = assets.map((_, i) => {
      let marginalContribution = 0;
      for (let j = 0; j < numAssets; j++) {
        marginalContribution += weightVector[j] * covarianceMatrix[i][j];
      }
      return weightVector[i] * marginalContribution;
    });
    
    const totalRiskContribution = riskContributionsRaw.reduce((sum, rc) => sum + rc, 0);

    const riskContributions = riskContributionsRaw.map((rc, i) => ({
      name: assets[i].symbol,
      value: (rc / totalRiskContribution) * 100,
    }));

    setResult({
      weights,
      riskContributions,
      portfolioVolatility,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scaling className="w-5 h-5" />
            Risk Parity Allocator
          </CardTitle>
          <CardDescription>
            Build a portfolio where assets contribute more equally to total risk using inverse volatility weighting.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <TableHead>Volatility</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map(asset => (
                    <TableRow key={asset.symbol}>
                      <TableCell>{asset.symbol}</TableCell>
                      <TableCell>{(asset.volatility * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Action</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={calculateRiskParity} className="w-full">
                Calculate Allocation
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" />Risk Parity Portfolio</CardTitle>
                <CardDescription>
                  Portfolio Volatility: {(result.portfolioVolatility * 100).toFixed(2)}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Optimal Weights</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Asset</TableHead>
                          <TableHead>Weight</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.weights.map(w => (
                          <TableRow key={w.symbol}>
                            <TableCell>{w.symbol}</TableCell>
                            <TableCell>{(w.weight * 100).toFixed(2)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <PieChartIcon className="w-5 h-5" />
                        Risk Contribution
                    </h3>
                    <div className="h-64">
                       <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={result.riskContributions}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {result.riskContributions.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
             <Card className="flex items-center justify-center h-full">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center text-center">
                        <p className="text-lg text-muted-foreground">
                            Click "Calculate Allocation" to see the risk parity portfolio.
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
