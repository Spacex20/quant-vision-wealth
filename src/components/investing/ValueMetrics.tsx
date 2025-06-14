
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StockSearch } from "@/components/stocks/StockSearch";
import { financialApi, StockQuote, CompanyProfile } from "@/services/financialApi";

export const ValueMetrics = () => {
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [stockData, setStockData] = useState<StockQuote | null>(null);
  const [companyData, setCompanyData] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [quote, profile] = await Promise.all([
          financialApi.getStockQuote(selectedStock),
          financialApi.getCompanyProfile(selectedStock)
        ]);
        setStockData(quote);
        setCompanyData(profile);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedStock]);

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stockData || !companyData) return null;

  // Calculate derived metrics
  const pbRatio = (stockData.price / (stockData.marketCap / 1000000000 * 4)).toFixed(2); // Simplified calculation
  const roe = (15 + Math.random() * 10).toFixed(1); // Mock calculation
  const roa = (8 + Math.random() * 5).toFixed(1); // Mock calculation
  const debtEquity = (0.3 + Math.random() * 0.4).toFixed(2); // Mock calculation
  const currentRatio = (1.5 + Math.random() * 1).toFixed(1); // Mock calculation

  const metrics = [
    { 
      name: "P/E Ratio", 
      value: stockData.peRatio.toString(), 
      benchmark: "22.0", 
      status: stockData.peRatio < 25 ? "good" : "fair", 
      description: "Price to Earnings" 
    },
    { 
      name: "P/B Ratio", 
      value: pbRatio, 
      benchmark: "3.2", 
      status: parseFloat(pbRatio) < 3 ? "good" : "fair", 
      description: "Price to Book" 
    },
    { 
      name: "ROE", 
      value: `${roe}%`, 
      benchmark: "12.0%", 
      status: parseFloat(roe) > 12 ? "good" : "fair", 
      description: "Return on Equity" 
    },
    { 
      name: "ROA", 
      value: `${roa}%`, 
      benchmark: "6.5%", 
      status: parseFloat(roa) > 6.5 ? "good" : "fair", 
      description: "Return on Assets" 
    },
    { 
      name: "Debt/Equity", 
      value: debtEquity, 
      benchmark: "0.60", 
      status: parseFloat(debtEquity) < 0.5 ? "good" : "fair", 
      description: "Debt to Equity Ratio" 
    },
    { 
      name: "Current Ratio", 
      value: currentRatio, 
      benchmark: "1.5", 
      status: parseFloat(currentRatio) > 1.5 ? "good" : "fair", 
      description: "Current Assets / Current Liabilities" 
    },
    { 
      name: "Dividend Yield", 
      value: `${stockData.dividendYield}%`, 
      benchmark: "2.0%", 
      status: stockData.dividendYield > 2 ? "good" : "fair", 
      description: "Annual Dividends / Price" 
    },
    { 
      name: "Market Cap", 
      value: `$${(stockData.marketCap / 1000000000).toFixed(1)}B`, 
      benchmark: "Large Cap", 
      status: "good", 
      description: "Total Market Value" 
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-green-600";
      case "fair": return "text-yellow-600";
      case "poor": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good": return "default";
      case "fair": return "secondary";
      case "poor": return "destructive";
      default: return "outline";
    }
  };

  const goodMetrics = metrics.filter(m => m.status === "good").length;
  const fairMetrics = metrics.filter(m => m.status === "fair").length;
  const poorMetrics = metrics.filter(m => m.status === "poor").length;
  const overallScore = ((goodMetrics * 1 + fairMetrics * 0.5) / metrics.length * 10).toFixed(1);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stock Analysis</CardTitle>
          <CardDescription>Search and analyze any stock</CardDescription>
        </CardHeader>
        <CardContent>
          <StockSearch 
            onStockSelect={handleStockSelect}
            placeholder="Search for a stock to analyze..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company: {companyData.name} ({stockData.symbol})</CardTitle>
          <CardDescription>
            {companyData.sector} • {companyData.industry} • Current Price: ${stockData.price.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <div key={metric.name} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{metric.name}</h4>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                  <Badge variant={getStatusBadge(metric.status)}>
                    {metric.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xl font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Benchmark: {metric.benchmark}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>vs Industry</span>
                    <span className={getStatusColor(metric.status)}>
                      {metric.status === "good" ? "Better" : metric.status === "fair" ? "Average" : "Worse"}
                    </span>
                  </div>
                  <Progress 
                    value={metric.status === "good" ? 75 : metric.status === "fair" ? 50 : 25} 
                    className="h-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Value Score Summary</CardTitle>
          <CardDescription>Overall value assessment for {stockData.symbol}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Overall Value Score</p>
              <p className="text-4xl font-bold text-green-600">{overallScore}/10</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{goodMetrics}</p>
                <p className="text-xs text-muted-foreground">Strong Metrics</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{fairMetrics}</p>
                <p className="text-xs text-muted-foreground">Fair Metrics</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{poorMetrics}</p>
                <p className="text-xs text-muted-foreground">Weak Metrics</p>
              </div>
            </div>

            <Badge variant={parseFloat(overallScore) >= 7 ? "default" : parseFloat(overallScore) >= 5 ? "secondary" : "destructive"} className="text-sm">
              {parseFloat(overallScore) >= 7 ? "STRONG BUY" : parseFloat(overallScore) >= 5 ? "MODERATE BUY" : "HOLD/SELL"} RECOMMENDATION
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
