
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useYFinanceFundamentals } from "@/hooks/useYFinanceData";
import { Search, FileText, Calculator, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface TerminalResearchProps {
  selectedSymbol: string;
}

export const TerminalResearch = ({ selectedSymbol }: TerminalResearchProps) => {
  const { data: fundamentals, isLoading } = useYFinanceFundamentals(selectedSymbol);
  
  const [analystRatings] = useState({
    strongBuy: 8,
    buy: 12,
    hold: 15,
    sell: 3,
    strongSell: 1,
    averageTarget: 175.50,
    currentPrice: 155.23
  });

  const [keyMetrics, setKeyMetrics] = useState({
    valuation: "FAIR",
    growth: "STRONG",
    profitability: "HIGH",
    financial_health: "EXCELLENT"
  });

  const getValuationColor = (metric: string) => {
    switch (metric.toLowerCase()) {
      case 'strong':
      case 'excellent':
      case 'high':
        return 'text-green-400 border-green-600';
      case 'fair':
      case 'good':
      case 'moderate':
        return 'text-yellow-400 border-yellow-600';
      case 'weak':
      case 'poor':
      case 'low':
        return 'text-red-400 border-red-600';
      default:
        return 'text-green-400 border-green-600';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num?.toLocaleString()}`;
  };

  const formatRatio = (ratio: number) => ratio?.toFixed(2) || "N/A";

  return (
    <div className="space-y-4">
      {/* Research overview */}
      <Card className="bg-gray-900 border-green-800">
        <CardHeader className="border-b border-green-800">
          <CardTitle className="text-yellow-400 font-mono flex items-center gap-2">
            <Search className="w-5 h-5" />
            RESEARCH OVERVIEW - {selectedSymbol}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-green-400 font-semibold">VALUATION</div>
              <Badge className={`mt-1 ${getValuationColor(keyMetrics.valuation)}`}>
                {keyMetrics.valuation}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-semibold">GROWTH</div>
              <Badge className={`mt-1 ${getValuationColor(keyMetrics.growth)}`}>
                {keyMetrics.growth}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-semibold">PROFITABILITY</div>
              <Badge className={`mt-1 ${getValuationColor(keyMetrics.profitability)}`}>
                {keyMetrics.profitability}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-semibold">FINANCIAL HEALTH</div>
              <Badge className={`mt-1 ${getValuationColor(keyMetrics.financial_health)}`}>
                {keyMetrics.financial_health}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main research content */}
      <div className="grid grid-cols-3 gap-4">
        {/* Fundamental analysis */}
        <Card className="col-span-2 bg-gray-900 border-green-800">
          <CardHeader className="border-b border-green-800">
            <CardTitle className="text-yellow-400 font-mono text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              FUNDAMENTAL ANALYSIS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {isLoading ? (
              <div className="text-center text-green-400">LOADING FUNDAMENTALS...</div>
            ) : fundamentals ? (
              <div className="space-y-4">
                {/* Key ratios */}
                <div>
                  <h4 className="text-green-400 font-semibold mb-2">VALUATION RATIOS</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-green-400">P/E RATIO:</span>
                        <span className="text-white">{formatRatio(fundamentals.peRatio)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400">PEG RATIO:</span>
                        <span className="text-white">{formatRatio(fundamentals.pegRatio)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400">P/B RATIO:</span>
                        <span className="text-white">{formatRatio(fundamentals.priceToBook)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400">P/S RATIO:</span>
                        <span className="text-white">{formatRatio(fundamentals.priceToSales)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-green-400">EV/EBITDA:</span>
                        <span className="text-white">{formatRatio(fundamentals.enterpriseValue / fundamentals.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400">DEBT/EQUITY:</span>
                        <span className="text-white">{formatRatio(fundamentals.debtToEquity)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400">ROE:</span>
                        <span className="text-white">{formatRatio(fundamentals.roe)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400">ROA:</span>
                        <span className="text-white">{formatRatio(fundamentals.roa)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial health */}
                <div className="border-t border-green-800 pt-4">
                  <h4 className="text-green-400 font-semibold mb-2">FINANCIAL METRICS</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-green-400">MARKET CAP:</span>
                        <span className="text-white">{formatNumber(fundamentals.marketCap)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400">REVENUE:</span>
                        <span className="text-white">{formatNumber(fundamentals.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400">NET INCOME:</span>
                        <span className="text-white">{formatNumber(fundamentals.netIncome)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-green-400">FREE CASH FLOW:</span>
                        <span className="text-white">{formatNumber(fundamentals.freeCashFlow)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400">DIVIDEND YIELD:</span>
                        <span className="text-white">{formatRatio(fundamentals.dividendYield)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400">EMPLOYEES:</span>
                        <span className="text-white">{fundamentals.employees?.toLocaleString() || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Growth metrics */}
                <div className="border-t border-green-800 pt-4">
                  <h4 className="text-green-400 font-semibold mb-2">GROWTH METRICS</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-green-400">EARNINGS GROWTH:</span>
                      <span className={`text-white ${fundamentals.earningsGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {fundamentals.earningsGrowth >= 0 ? '+' : ''}{formatRatio(fundamentals.earningsGrowth)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-400">REVENUE GROWTH:</span>
                      <span className={`text-white ${fundamentals.revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {fundamentals.revenueGrowth >= 0 ? '+' : ''}{formatRatio(fundamentals.revenueGrowth)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-red-400">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                FUNDAMENTAL DATA UNAVAILABLE
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analyst ratings */}
        <Card className="bg-gray-900 border-green-800">
          <CardHeader className="border-b border-green-800">
            <CardTitle className="text-yellow-400 font-mono text-sm">
              ANALYST CONSENSUS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Price target */}
              <div className="text-center p-3 bg-black border border-green-600 rounded">
                <div className="text-green-400 text-sm font-semibold">PRICE TARGET</div>
                <div className="text-2xl font-bold text-white">
                  ${analystRatings.averageTarget.toFixed(2)}
                </div>
                <div className={`text-sm ${
                  analystRatings.averageTarget > analystRatings.currentPrice 
                    ? 'text-green-400' : 'text-red-400'
                }`}>
                  {analystRatings.averageTarget > analystRatings.currentPrice ? 
                    <TrendingUp className="inline w-4 h-4 mr-1" /> :
                    <TrendingDown className="inline w-4 h-4 mr-1" />
                  }
                  {((analystRatings.averageTarget - analystRatings.currentPrice) / analystRatings.currentPrice * 100).toFixed(1)}% upside
                </div>
              </div>

              {/* Rating breakdown */}
              <div>
                <h4 className="text-green-400 font-semibold mb-2">RATING BREAKDOWN</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-400">STRONG BUY</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-700 rounded">
                        <div 
                          className="h-full bg-green-500 rounded"
                          style={{ width: `${(analystRatings.strongBuy / 39) * 100}%` }}
                        />
                      </div>
                      <span className="text-white text-xs w-6">{analystRatings.strongBuy}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-400">BUY</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-700 rounded">
                        <div 
                          className="h-full bg-green-400 rounded"
                          style={{ width: `${(analystRatings.buy / 39) * 100}%` }}
                        />
                      </div>
                      <span className="text-white text-xs w-6">{analystRatings.buy}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-400">HOLD</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-700 rounded">
                        <div 
                          className="h-full bg-yellow-400 rounded"
                          style={{ width: `${(analystRatings.hold / 39) * 100}%` }}
                        />
                      </div>
                      <span className="text-white text-xs w-6">{analystRatings.hold}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-400">SELL</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-700 rounded">
                        <div 
                          className="h-full bg-red-400 rounded"
                          style={{ width: `${(analystRatings.sell / 39) * 100}%` }}
                        />
                      </div>
                      <span className="text-white text-xs w-6">{analystRatings.sell}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-400">STRONG SELL</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-700 rounded">
                        <div 
                          className="h-full bg-red-500 rounded"
                          style={{ width: `${(analystRatings.strongSell / 39) * 100}%` }}
                        />
                      </div>
                      <span className="text-white text-xs w-6">{analystRatings.strongSell}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research reports */}
              <div className="border-t border-green-800 pt-4">
                <h4 className="text-green-400 font-semibold mb-2">RECENT REPORTS</h4>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start border-green-600 text-green-400"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Q4 EARNINGS PREVIEW
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start border-green-600 text-green-400"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    SECTOR ANALYSIS
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start border-green-600 text-green-400"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    TECHNICAL UPDATE
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
