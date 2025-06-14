
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Calculator, DollarSign, PieChart, BarChart3 } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { marketDataService } from "@/services/marketDataService";
import { toast } from "sonner";

interface ValueAnalysisResult {
  symbol: string;
  currentPrice: number;
  intrinsicValue: number;
  marginOfSafety: number;
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  fairValue: number;
  upside: number;
  peRatio: number;
  pbRatio: number;
  dividendYield: number;
  roe: number;
  debtToEquity: number;
}

interface DCFInputs {
  freeCashFlow: number;
  growthRate: number;
  terminalGrowthRate: number;
  discountRate: number;
  sharesOutstanding: number;
  projectionYears: number;
}

interface DDMInputs {
  currentDividend: number;
  growthRate: number;
  requiredReturn: number;
  dividendGrowthYears: number;
  terminalGrowthRate: number;
}

export const ValueInvestingAnalysis = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ValueAnalysisResult | null>(null);
  
  const [dcfInputs, setDcfInputs] = useState<DCFInputs>({
    freeCashFlow: 100000000000,
    growthRate: 8,
    terminalGrowthRate: 3,
    discountRate: 10,
    sharesOutstanding: 15000000000,
    projectionYears: 5
  });

  const [ddmInputs, setDdmInputs] = useState<DDMInputs>({
    currentDividend: 0.96,
    growthRate: 5,
    requiredReturn: 10,
    dividendGrowthYears: 10,
    terminalGrowthRate: 3
  });

  const runValueAnalysis = async () => {
    if (!selectedSymbol) {
      toast.error("Please select a symbol to analyze");
      return;
    }

    setLoading(true);
    try {
      const [quote, fundamentals] = await Promise.all([
        marketDataService.getRealTimeQuote(selectedSymbol),
        marketDataService.getCompanyFundamentals(selectedSymbol)
      ]);

      // Calculate intrinsic value using simplified DCF
      const intrinsicValue = calculateDCFValue(dcfInputs);
      const marginOfSafety = ((intrinsicValue - quote.price) / quote.price) * 100;
      
      // Determine recommendation based on margin of safety
      let recommendation: ValueAnalysisResult['recommendation'];
      if (marginOfSafety > 30) recommendation = 'strong_buy';
      else if (marginOfSafety > 15) recommendation = 'buy';
      else if (marginOfSafety > -10) recommendation = 'hold';
      else if (marginOfSafety > -25) recommendation = 'sell';
      else recommendation = 'strong_sell';

      setAnalysisResult({
        symbol: selectedSymbol,
        currentPrice: quote.price,
        intrinsicValue,
        marginOfSafety,
        recommendation,
        fairValue: intrinsicValue * 0.9, // 10% discount for conservative estimate
        upside: marginOfSafety,
        peRatio: fundamentals.peRatio,
        pbRatio: fundamentals.priceToBook,
        dividendYield: fundamentals.dividendYield,
        roe: fundamentals.roe,
        debtToEquity: fundamentals.debtToEquity
      });

      toast.success(`Value analysis completed for ${selectedSymbol}`);
    } catch (error) {
      console.error('Error running value analysis:', error);
      toast.error("Failed to run value analysis");
    } finally {
      setLoading(false);
    }
  };

  const calculateDCFValue = (inputs: DCFInputs): number => {
    let totalPV = 0;
    
    // Calculate present value of projected cash flows
    for (let year = 1; year <= inputs.projectionYears; year++) {
      const projectedFCF = inputs.freeCashFlow * Math.pow(1 + inputs.growthRate / 100, year);
      const presentValue = projectedFCF / Math.pow(1 + inputs.discountRate / 100, year);
      totalPV += presentValue;
    }

    // Calculate terminal value
    const terminalFCF = inputs.freeCashFlow * Math.pow(1 + inputs.growthRate / 100, inputs.projectionYears + 1);
    const terminalValue = (terminalFCF * (1 + inputs.terminalGrowthRate / 100)) / 
                         (inputs.discountRate / 100 - inputs.terminalGrowthRate / 100);
    const terminalPV = terminalValue / Math.pow(1 + inputs.discountRate / 100, inputs.projectionYears);

    const enterpriseValue = totalPV + terminalPV;
    return enterpriseValue / inputs.sharesOutstanding;
  };

  const calculateDDMValue = (inputs: DDMInputs): number => {
    let totalPV = 0;
    
    // Growth phase dividends
    for (let year = 1; year <= inputs.dividendGrowthYears; year++) {
      const projectedDividend = inputs.currentDividend * Math.pow(1 + inputs.growthRate / 100, year);
      const presentValue = projectedDividend / Math.pow(1 + inputs.requiredReturn / 100, year);
      totalPV += presentValue;
    }

    // Terminal value using Gordon Growth Model
    const terminalDividend = inputs.currentDividend * 
                           Math.pow(1 + inputs.growthRate / 100, inputs.dividendGrowthYears) *
                           (1 + inputs.terminalGrowthRate / 100);
    const terminalValue = terminalDividend / (inputs.requiredReturn / 100 - inputs.terminalGrowthRate / 100);
    const terminalPV = terminalValue / Math.pow(1 + inputs.requiredReturn / 100, inputs.dividendGrowthYears);

    return totalPV + terminalPV;
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_buy': return 'bg-green-600';
      case 'buy': return 'bg-green-500';
      case 'hold': return 'bg-yellow-500';
      case 'sell': return 'bg-red-500';
      case 'strong_sell': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const popularSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'BRK-B', 'JNJ', 'V', 'PG', 'JPM'];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Value Investing Analysis</h2>
        <p className="text-muted-foreground">
          Comprehensive value analysis with DCF, DDM, and fundamental metrics
        </p>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="symbol">Stock Symbol</Label>
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger>
              <SelectValue placeholder="Select a symbol" />
            </SelectTrigger>
            <SelectContent>
              {popularSymbols.map(symbol => (
                <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={runValueAnalysis} disabled={loading} className="flex items-center gap-2">
          {loading ? <LoadingSpinner size="sm" /> : <Calculator className="h-4 w-4" />}
          Analyze Value
        </Button>
      </div>

      {analysisResult && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Value Analysis: {analysisResult.symbol}</span>
              <Badge className={`text-white ${getRecommendationColor(analysisResult.recommendation)}`}>
                {analysisResult.recommendation.replace('_', ' ').toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-2xl font-bold">${analysisResult.currentPrice.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Intrinsic Value</p>
                <p className="text-2xl font-bold text-blue-600">${analysisResult.intrinsicValue.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Margin of Safety</p>
                <p className={`text-2xl font-bold ${analysisResult.marginOfSafety > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analysisResult.marginOfSafety.toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Upside Potential</p>
                <p className={`text-2xl font-bold ${analysisResult.upside > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analysisResult.upside > 0 ? '+' : ''}{analysisResult.upside.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="dcf" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dcf">DCF Model</TabsTrigger>
          <TabsTrigger value="ddm">Dividend Model</TabsTrigger>
          <TabsTrigger value="ratios">Value Ratios</TabsTrigger>
          <TabsTrigger value="comparison">Peer Compare</TabsTrigger>
        </TabsList>

        <TabsContent value="dcf" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Discounted Cash Flow (DCF) Model
              </CardTitle>
              <CardDescription>Calculate intrinsic value based on future cash flows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fcf">Free Cash Flow ($)</Label>
                  <Input
                    id="fcf"
                    type="number"
                    value={dcfInputs.freeCashFlow}
                    onChange={(e) => setDcfInputs({...dcfInputs, freeCashFlow: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="growth">Growth Rate (%)</Label>
                  <Input
                    id="growth"
                    type="number"
                    value={dcfInputs.growthRate}
                    onChange={(e) => setDcfInputs({...dcfInputs, growthRate: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="terminal">Terminal Growth (%)</Label>
                  <Input
                    id="terminal"
                    type="number"
                    value={dcfInputs.terminalGrowthRate}
                    onChange={(e) => setDcfInputs({...dcfInputs, terminalGrowthRate: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount Rate (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={dcfInputs.discountRate}
                    onChange={(e) => setDcfInputs({...dcfInputs, discountRate: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="shares">Shares Outstanding</Label>
                  <Input
                    id="shares"
                    type="number"
                    value={dcfInputs.sharesOutstanding}
                    onChange={(e) => setDcfInputs({...dcfInputs, sharesOutstanding: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="years">Projection Years</Label>
                  <Input
                    id="years"
                    type="number"
                    value={dcfInputs.projectionYears}
                    onChange={(e) => setDcfInputs({...dcfInputs, projectionYears: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">DCF Intrinsic Value</p>
                <p className="text-3xl font-bold text-blue-600">${calculateDCFValue(dcfInputs).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ddm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Dividend Discount Model (DDM)
              </CardTitle>
              <CardDescription>Value stocks based on projected dividend payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currentDiv">Current Dividend ($)</Label>
                  <Input
                    id="currentDiv"
                    type="number"
                    step="0.01"
                    value={ddmInputs.currentDividend}
                    onChange={(e) => setDdmInputs({...ddmInputs, currentDividend: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="divGrowth">Dividend Growth (%)</Label>
                  <Input
                    id="divGrowth"
                    type="number"
                    value={ddmInputs.growthRate}
                    onChange={(e) => setDdmInputs({...ddmInputs, growthRate: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="requiredReturn">Required Return (%)</Label>
                  <Input
                    id="requiredReturn"
                    type="number"
                    value={ddmInputs.requiredReturn}
                    onChange={(e) => setDdmInputs({...ddmInputs, requiredReturn: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="growthYears">Growth Years</Label>
                  <Input
                    id="growthYears"
                    type="number"
                    value={ddmInputs.dividendGrowthYears}
                    onChange={(e) => setDdmInputs({...ddmInputs, dividendGrowthYears: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="terminalDiv">Terminal Growth (%)</Label>
                  <Input
                    id="terminalDiv"
                    type="number"
                    value={ddmInputs.terminalGrowthRate}
                    onChange={(e) => setDdmInputs({...ddmInputs, terminalGrowthRate: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">DDM Fair Value</p>
                <p className="text-3xl font-bold text-green-600">${calculateDDMValue(ddmInputs).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratios" className="space-y-4">
          {analysisResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Valuation Ratios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>P/E Ratio</span>
                    <span className="font-semibold">{analysisResult.peRatio.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>P/B Ratio</span>
                    <span className="font-semibold">{analysisResult.pbRatio.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dividend Yield</span>
                    <span className="font-semibold">{analysisResult.dividendYield.toFixed(2)}%</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Financial Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>ROE</span>
                    <span className="font-semibold">{analysisResult.roe.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Debt/Equity</span>
                    <span className="font-semibold">{analysisResult.debtToEquity.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Financial Score</span>
                    <Badge variant="outline">
                      {analysisResult.roe > 15 && analysisResult.debtToEquity < 0.5 ? 'Excellent' :
                       analysisResult.roe > 10 && analysisResult.debtToEquity < 1 ? 'Good' :
                       analysisResult.roe > 5 ? 'Fair' : 'Poor'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Peer Comparison</CardTitle>
              <CardDescription>Compare with industry peers (coming soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Peer comparison functionality coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
