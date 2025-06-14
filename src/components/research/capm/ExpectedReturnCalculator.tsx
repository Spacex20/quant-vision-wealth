
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, Info, DollarSign } from 'lucide-react';

interface CAPMInputs {
  riskFreeRate: number;
  marketReturn: number;
  beta: number;
  customBeta: boolean;
}

interface CAPMResults {
  expectedReturn: number;
  marketRiskPremium: number;
  riskPremium: number;
  excessReturn: number;
}

export const ExpectedReturnCalculator = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [inputs, setInputs] = useState<CAPMInputs>({
    riskFreeRate: 4.5,
    marketReturn: 10.0,
    beta: 1.23,
    customBeta: false
  });
  const [results, setResults] = useState<CAPMResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentRiskFreeRate, setCurrentRiskFreeRate] = useState(4.5);

  useEffect(() => {
    // Simulate fetching current risk-free rate
    const fetchRiskFreeRate = async () => {
      // Mock API call to get 10-year Treasury yield
      const mockRate = 4.2 + Math.random() * 0.6; // Random rate between 4.2% and 4.8%
      setCurrentRiskFreeRate(Number(mockRate.toFixed(2)));
      setInputs(prev => ({ ...prev, riskFreeRate: Number(mockRate.toFixed(2)) }));
    };

    fetchRiskFreeRate();
  }, []);

  const calculateExpectedReturn = () => {
    setLoading(true);
    
    setTimeout(() => {
      const marketRiskPremium = inputs.marketReturn - inputs.riskFreeRate;
      const riskPremium = inputs.beta * marketRiskPremium;
      const expectedReturn = inputs.riskFreeRate + riskPremium;
      const excessReturn = expectedReturn - inputs.riskFreeRate;

      setResults({
        expectedReturn: Number(expectedReturn.toFixed(2)),
        marketRiskPremium: Number(marketRiskPremium.toFixed(2)),
        riskPremium: Number(riskPremium.toFixed(2)),
        excessReturn: Number(excessReturn.toFixed(2))
      });
      setLoading(false);
    }, 500);
  };

  const fetchBeta = async () => {
    setLoading(true);
    // Simulate fetching beta for the symbol
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockBeta = 0.8 + Math.random() * 1.0;
    setInputs(prev => ({ ...prev, beta: Number(mockBeta.toFixed(3)) }));
    setLoading(false);
  };

  const getRiskAssessment = (beta: number) => {
    if (beta < 0.5) return { level: "Low Risk", color: "bg-green-100 text-green-800", description: "Less risky than market" };
    if (beta < 1.0) return { level: "Moderate Risk", color: "bg-blue-100 text-blue-800", description: "Less risky than market" };
    if (beta < 1.5) return { level: "High Risk", color: "bg-orange-100 text-orange-800", description: "More risky than market" };
    return { level: "Very High Risk", color: "bg-red-100 text-red-800", description: "Much riskier than market" };
  };

  return (
    <div className="space-y-6">
      {/* Market Data Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Current Market Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{currentRiskFreeRate}%</div>
              <div className="text-sm text-gray-600">10-Year Treasury Yield</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">6.5%</div>
              <div className="text-sm text-gray-600">Historical Market Premium</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">10.8%</div>
              <div className="text-sm text-gray-600">S&P 500 Expected Return</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CAPM Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            CAPM Expected Return Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Input Parameters</h3>
              
              <div>
                <Label htmlFor="symbol">Stock Symbol</Label>
                <div className="flex gap-2">
                  <Input
                    id="symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    placeholder="AAPL"
                  />
                  <Button onClick={fetchBeta} variant="outline" disabled={loading}>
                    Get Beta
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="riskFreeRate">Risk-Free Rate (%)</Label>
                <Input
                  id="riskFreeRate"
                  type="number"
                  step="0.1"
                  value={inputs.riskFreeRate}
                  onChange={(e) => setInputs(prev => ({ ...prev, riskFreeRate: Number(e.target.value) }))}
                />
                <div className="text-xs text-gray-500 mt-1">Current 10-Year Treasury: {currentRiskFreeRate}%</div>
              </div>

              <div>
                <Label htmlFor="marketReturn">Expected Market Return (%)</Label>
                <Input
                  id="marketReturn"
                  type="number"
                  step="0.1"
                  value={inputs.marketReturn}
                  onChange={(e) => setInputs(prev => ({ ...prev, marketReturn: Number(e.target.value) }))}
                />
                <div className="text-xs text-gray-500 mt-1">Historical S&P 500 average: ~10%</div>
              </div>

              <div>
                <Label htmlFor="beta">Beta (β)</Label>
                <Input
                  id="beta"
                  type="number"
                  step="0.01"
                  value={inputs.beta}
                  onChange={(e) => setInputs(prev => ({ ...prev, beta: Number(e.target.value) }))}
                />
                <div className="mt-2">
                  <Badge className={getRiskAssessment(inputs.beta).color}>
                    {getRiskAssessment(inputs.beta).level}
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1">
                    {getRiskAssessment(inputs.beta).description}
                  </div>
                </div>
              </div>

              <Button onClick={calculateExpectedReturn} disabled={loading} className="w-full">
                {loading ? 'Calculating...' : 'Calculate Expected Return'}
              </Button>
            </div>

            {/* Formula Visualization */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">CAPM Formula Breakdown</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-center mb-4">
                  <div className="text-lg font-mono">
                    E(R<sub>i</sub>) = R<sub>f</sub> + β<sub>i</sub> × (E(R<sub>m</sub>) - R<sub>f</sub>)
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Risk-Free Rate (R<sub>f</sub>):</span>
                    <span className="font-mono">{inputs.riskFreeRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Beta (β<sub>i</sub>):</span>
                    <span className="font-mono">{inputs.beta}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Return (E(R<sub>m</sub>)):</span>
                    <span className="font-mono">{inputs.marketReturn}%</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Market Risk Premium:</span>
                    <span className="font-mono">{(inputs.marketReturn - inputs.riskFreeRate).toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              {results && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Calculation Result</h4>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {results.expectedReturn}%
                    </div>
                    <div className="text-sm text-gray-600">Expected Annual Return</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Expected Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {results.expectedReturn}%
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Annual expected return based on CAPM
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Market Risk Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {results.marketRiskPremium}%
              </div>
              <div className="text-sm text-gray-600 mt-2">
                E(R<sub>m</sub>) - R<sub>f</sub>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {results.riskPremium}%
              </div>
              <div className="text-sm text-gray-600 mt-2">
                β × Market Risk Premium
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Excess Return</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {results.excessReturn}%
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Return above risk-free rate
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
