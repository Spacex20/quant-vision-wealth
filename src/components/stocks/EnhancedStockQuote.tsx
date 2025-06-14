
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, RefreshCw, Building2, DollarSign, Percent } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { marketDataService, RealTimeQuote, CompanyFundamentals } from "@/services/marketDataService";

interface EnhancedStockQuoteProps {
  symbol: string;
}

export const EnhancedStockQuote = ({ symbol }: EnhancedStockQuoteProps) => {
  const [quote, setQuote] = useState<RealTimeQuote | null>(null);
  const [fundamentals, setFundamentals] = useState<CompanyFundamentals | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [quoteData, fundamentalsData] = await Promise.all([
        marketDataService.getRealTimeQuote(symbol),
        marketDataService.getCompanyFundamentals(symbol)
      ]);
      
      setQuote(quoteData);
      setFundamentals(fundamentalsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 30 seconds for real-time data
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  if (isLoading && !quote) {
    return (
      <Card>
        <CardContent className="p-6">
          <LoadingSpinner text="Loading stock data..." />
        </CardContent>
      </Card>
    );
  }

  if (!quote || !fundamentals) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Unable to load stock data for {symbol}</p>
        </CardContent>
      </Card>
    );
  }

  const isPositive = quote.change >= 0;

  const getValuationStatus = (peRatio: number) => {
    if (peRatio < 15) return { status: 'Undervalued', color: 'text-green-600' };
    if (peRatio < 25) return { status: 'Fair Value', color: 'text-yellow-600' };
    return { status: 'Overvalued', color: 'text-red-600' };
  };

  const getFinancialStrength = (roe: number, debtToEquity: number) => {
    const roeScore = roe > 15 ? 100 : roe > 10 ? 75 : roe > 5 ? 50 : 25;
    const debtScore = debtToEquity < 0.3 ? 100 : debtToEquity < 0.6 ? 75 : debtToEquity < 1 ? 50 : 25;
    return Math.round((roeScore + debtScore) / 2);
  };

  const valuationStatus = getValuationStatus(fundamentals.peRatio);
  const financialStrength = getFinancialStrength(fundamentals.roe, fundamentals.debtToEquity);

  return (
    <div className="space-y-6">
      {/* Stock Price Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <span>{quote.symbol}</span>
                <Badge variant="outline">{fundamentals.sector}</Badge>
              </CardTitle>
              <CardDescription>{fundamentals.name}</CardDescription>
              {lastUpdated && (
                <p className="text-sm text-muted-foreground mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6 mb-4">
            <div className="text-4xl font-bold">${quote.price.toFixed(2)}</div>
            <div className={`flex items-center space-x-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              <div>
                <div className="font-semibold">
                  {isPositive ? '+' : ''}{quote.change.toFixed(2)}
                </div>
                <div className="text-sm">
                  ({isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Volume</div>
              <div className="font-medium">{(quote.volume / 1000000).toFixed(1)}M</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Market Cap</div>
              <div className="font-medium">${(fundamentals.marketCap / 1000000000).toFixed(1)}B</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">52W High</div>
              <div className="font-medium">${quote.fiftyTwoWeekHigh.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">52W Low</div>
              <div className="font-medium">${quote.fiftyTwoWeekLow.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs defaultValue="fundamentals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
          <TabsTrigger value="valuation">Valuation</TabsTrigger>
          <TabsTrigger value="company">Company Info</TabsTrigger>
        </TabsList>

        <TabsContent value="fundamentals">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Financial Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'P/E Ratio', value: fundamentals.peRatio.toFixed(2) },
                  { label: 'PEG Ratio', value: fundamentals.pegRatio.toFixed(2) },
                  { label: 'Price-to-Book', value: fundamentals.priceToBook.toFixed(2) },
                  { label: 'Debt-to-Equity', value: fundamentals.debtToEquity.toFixed(2) },
                  { label: 'ROE', value: `${fundamentals.roe.toFixed(1)}%` },
                  { label: 'ROA', value: `${fundamentals.roa.toFixed(1)}%` },
                ].map((metric) => (
                  <div key={metric.label} className="flex justify-between">
                    <span className="text-muted-foreground">{metric.label}</span>
                    <span className="font-medium">{metric.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Percent className="h-5 w-5" />
                  <span>Profitability</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Gross Margin', value: `${fundamentals.grossMargin.toFixed(1)}%` },
                  { label: 'Operating Margin', value: `${fundamentals.operatingMargin.toFixed(1)}%` },
                  { label: 'Profit Margin', value: `${fundamentals.profitMargin.toFixed(1)}%` },
                  { label: 'Revenue Growth', value: `${fundamentals.revenueGrowth.toFixed(1)}%` },
                  { label: 'Earnings Growth', value: `${fundamentals.earningsGrowth.toFixed(1)}%` },
                  { label: 'Dividend Yield', value: `${fundamentals.dividendYield.toFixed(2)}%` },
                ].map((metric) => (
                  <div key={metric.label} className="flex justify-between">
                    <span className="text-muted-foreground">{metric.label}</span>
                    <span className="font-medium">{metric.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="valuation">
          <Card>
            <CardHeader>
              <CardTitle>Valuation Analysis</CardTitle>
              <CardDescription>Assessment based on key valuation metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Overall Valuation</h4>
                  <p className="text-sm text-muted-foreground">Based on P/E ratio analysis</p>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${valuationStatus.color}`}>
                    {valuationStatus.status}
                  </div>
                  <div className="text-sm text-muted-foreground">P/E: {fundamentals.peRatio.toFixed(1)}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Financial Strength</span>
                  <span className="text-sm text-muted-foreground">{financialStrength}/100</span>
                </div>
                <Progress value={financialStrength} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Based on ROE ({fundamentals.roe.toFixed(1)}%) and Debt-to-Equity ({fundamentals.debtToEquity.toFixed(2)})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{fundamentals.currentRatio.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Current Ratio</div>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{fundamentals.quickRatio.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Quick Ratio</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Company Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Industry</div>
                    <div className="font-medium">{fundamentals.industry}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Employees</div>
                    <div className="font-medium">{fundamentals.employees.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Founded</div>
                    <div className="font-medium">{fundamentals.founded}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">CEO</div>
                    <div className="font-medium">{fundamentals.ceo}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Headquarters</div>
                    <div className="font-medium">{fundamentals.headquarters}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Website</div>
                    <div className="font-medium text-blue-600">
                      <a href={fundamentals.website} target="_blank" rel="noopener noreferrer">
                        {fundamentals.website}
                      </a>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Shares Outstanding</div>
                    <div className="font-medium">{(fundamentals.sharesOutstanding / 1000000000).toFixed(2)}B</div>
                  </div>
                </div>
              </div>
              
              {fundamentals.description && (
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">Description</div>
                  <p className="text-sm leading-relaxed">{fundamentals.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
