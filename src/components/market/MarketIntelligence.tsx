
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Newspaper, 
  BarChart3,
  RefreshCw,
  Activity,
  DollarSign 
} from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { marketDataService, EconomicIndicator, MarketNews, SectorPerformance } from "@/services/marketDataService";

export const MarketIntelligence = () => {
  const [economicData, setEconomicData] = useState<EconomicIndicator[]>([]);
  const [marketNews, setMarketNews] = useState<MarketNews[]>([]);
  const [sectorData, setSectorData] = useState<SectorPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      const [economic, news, sectors] = await Promise.all([
        marketDataService.getEconomicIndicators(),
        marketDataService.getMarketNews(),
        marketDataService.getSectorPerformance()
      ]);
      
      setEconomicData(economic);
      setMarketNews(news);
      setSectorData(sectors);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching market intelligence data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchMarketData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'default';
      case 'negative': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading && economicData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner text="Loading market data..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Market Intelligence</h2>
          <p className="text-muted-foreground">
            {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
          </p>
        </div>
        <Button onClick={fetchMarketData} disabled={isLoading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="economic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="economic">Economic Indicators</TabsTrigger>
          <TabsTrigger value="sectors">Sector Performance</TabsTrigger>
          <TabsTrigger value="news">Market News</TabsTrigger>
        </TabsList>

        <TabsContent value="economic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Economic Indicators</span>
              </CardTitle>
              <CardDescription>Key economic metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {economicData.map((indicator, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{indicator.indicator}</h4>
                      <Badge variant="outline">{indicator.frequency}</Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold">
                        {indicator.value.toFixed(2)}{indicator.unit === 'Percent' ? '%' : ''}
                      </div>
                      <div className={`flex items-center space-x-1 ${
                        indicator.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {indicator.change >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                          {indicator.change >= 0 ? '+' : ''}{indicator.changePercent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Previous: {indicator.previousValue.toFixed(2)}{indicator.unit === 'Percent' ? '%' : ''}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Sector Performance</span>
              </CardTitle>
              <CardDescription>Performance across different market sectors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sectorData.map((sector, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium">{sector.sector}</div>
                      <div className="text-sm text-muted-foreground">
                        Market Cap: ${(sector.marketCap / 1000000000000).toFixed(1)}T • 
                        P/E: {sector.peRatio.toFixed(1)} • 
                        Div Yield: {sector.dividendYield.toFixed(2)}%
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <div className="text-xs text-muted-foreground">1D</div>
                        <div className={`text-sm font-medium ${
                          sector.performance1D >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {sector.performance1D >= 0 ? '+' : ''}{sector.performance1D.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">1W</div>
                        <div className={`text-sm font-medium ${
                          sector.performance1W >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {sector.performance1W >= 0 ? '+' : ''}{sector.performance1W.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">1M</div>
                        <div className={`text-sm font-medium ${
                          sector.performance1M >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {sector.performance1M >= 0 ? '+' : ''}{sector.performance1M.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">1Y</div>
                        <div className={`text-sm font-medium ${
                          sector.performance1Y >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {sector.performance1Y >= 0 ? '+' : ''}{sector.performance1Y.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Newspaper className="h-5 w-5" />
                <span>Market News</span>
              </CardTitle>
              <CardDescription>Latest market news and sentiment analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketNews.map((article, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium line-clamp-2">{article.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                          {article.summary}
                        </p>
                      </div>
                      <Badge variant={getSentimentBadge(article.sentiment)} className="ml-2">
                        {article.sentiment}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-muted-foreground">{article.source}</span>
                        <span className="text-muted-foreground">
                          {new Date(article.timePublished).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {article.symbols.slice(0, 3).map((symbol) => (
                          <Badge key={symbol} variant="outline" className="text-xs">
                            {symbol}
                          </Badge>
                        ))}
                        {article.symbols.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{article.symbols.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
