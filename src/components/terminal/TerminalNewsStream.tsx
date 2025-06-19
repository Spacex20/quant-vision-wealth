
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Minus, Search, Filter } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  source: string;
  author?: string;
  url?: string;
  image_url?: string;
  published_at: string;
  symbols?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  relevance_score?: number;
}

interface TerminalNewsStreamProps {
  selectedSymbol: string;
  isRealTime: boolean;
}

export const TerminalNewsStream = ({ selectedSymbol, isRealTime }: TerminalNewsStreamProps) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  // Mock news data for demonstration
  const mockNews: NewsArticle[] = [
    {
      id: "1",
      title: `${selectedSymbol} Reports Strong Q4 Earnings, Beats Expectations`,
      summary: "Company delivers exceptional quarterly results with revenue growth of 12% year-over-year",
      source: "Bloomberg",
      author: "Market Analyst",
      published_at: new Date().toISOString(),
      symbols: [selectedSymbol],
      sentiment: "positive",
      relevance_score: 0.95
    },
    {
      id: "2", 
      title: "Federal Reserve Announces Interest Rate Decision",
      summary: "Central bank maintains current rate policy amid inflation concerns",
      source: "Reuters",
      author: "Economic Reporter",
      published_at: new Date(Date.now() - 3600000).toISOString(),
      symbols: ["SPY", "QQQ"],
      sentiment: "neutral",
      relevance_score: 0.8
    },
    {
      id: "3",
      title: `Analysts Downgrade ${selectedSymbol} on Regulatory Concerns`,
      summary: "Multiple investment firms reduce price targets following regulatory headwinds",
      source: "MarketWatch",
      author: "Sector Analyst",
      published_at: new Date(Date.now() - 7200000).toISOString(),
      symbols: [selectedSymbol],
      sentiment: "negative",
      relevance_score: 0.9
    },
    {
      id: "4",
      title: "Tech Sector Shows Resilience Amid Market Volatility",
      summary: "Technology stocks outperform broader market as investors seek growth opportunities",
      source: "CNBC",
      author: "Tech Reporter",
      published_at: new Date(Date.now() - 10800000).toISOString(),
      symbols: ["AAPL", "MSFT", "GOOGL"],
      sentiment: "positive",
      relevance_score: 0.7
    }
  ];

  useEffect(() => {
    // Load mock news data
    setNews(mockNews);
    setLoading(false);

    // Simulate real-time news updates
    if (isRealTime) {
      const interval = setInterval(() => {
        const newArticle: NewsArticle = {
          id: Date.now().toString(),
          title: `Breaking: ${selectedSymbol} ${Math.random() > 0.5 ? 'Surges' : 'Dips'} on Latest Development`,
          summary: "Real-time market update with immediate impact on stock price",
          source: "Bloomberg Terminal",
          published_at: new Date().toISOString(),
          symbols: [selectedSymbol],
          sentiment: Math.random() > 0.5 ? "positive" : "negative",
          relevance_score: 0.85
        };
        
        setNews(prev => [newArticle, ...prev.slice(0, 19)]);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [selectedSymbol, isRealTime]);

  useEffect(() => {
    let filtered = news;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by sentiment
    if (sentimentFilter !== "all") {
      filtered = filtered.filter(article => article.sentiment === sentimentFilter);
    }

    // Filter by symbol relevance
    filtered = filtered.filter(article => 
      !article.symbols || article.symbols.includes(selectedSymbol) || article.symbols.length === 0
    );

    // Sort by relevance and recency
    filtered.sort((a, b) => {
      const relevanceA = a.relevance_score || 0;
      const relevanceB = b.relevance_score || 0;
      const timeA = new Date(a.published_at).getTime();
      const timeB = new Date(b.published_at).getTime();
      
      return (relevanceB - relevanceA) * 0.7 + (timeB - timeA) * 0.3;
    });

    setFilteredNews(filtered);
  }, [news, searchQuery, sentimentFilter, selectedSymbol]);

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'border-green-600 text-green-400';
      case 'negative':
        return 'border-red-600 text-red-400';
      default:
        return 'border-yellow-600 text-yellow-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* News controls */}
      <Card className="bg-gray-900 border-green-800">
        <CardHeader className="border-b border-green-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-yellow-400 font-mono flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              NEWS STREAM - {selectedSymbol}
            </CardTitle>
            {isRealTime && (
              <Badge className="bg-red-600 text-white animate-pulse">
                LIVE FEED
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" />
              <Input
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black border-green-600 text-green-400 pl-10"
              />
            </div>
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger className="w-40 bg-black border-green-600 text-green-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-800">
                <SelectItem value="all">ALL SENTIMENT</SelectItem>
                <SelectItem value="positive">POSITIVE</SelectItem>
                <SelectItem value="negative">NEGATIVE</SelectItem>
                <SelectItem value="neutral">NEUTRAL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* News feed */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-900 border-green-800">
          <CardHeader className="border-b border-green-800">
            <CardTitle className="text-yellow-400 font-mono text-sm">
              BREAKING NEWS & ALERTS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center text-green-400">LOADING NEWS FEED...</div>
            ) : (
              <div className="space-y-3">
                {filteredNews.slice(0, 5).map((article) => (
                  <div 
                    key={article.id}
                    className={`p-3 border rounded ${getSentimentColor(article.sentiment)} bg-black/50`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getSentimentIcon(article.sentiment)}
                        <Badge variant="outline" className="text-xs border-green-600 text-green-400">
                          {article.source}
                        </Badge>
                      </div>
                      <span className="text-xs text-green-600">
                        {new Date(article.published_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-green-400 text-xs line-clamp-2">
                      {article.summary}
                    </p>
                    {article.url && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-xs text-blue-400 p-0 h-auto mt-1"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        READ MORE
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-green-800">
          <CardHeader className="border-b border-green-800">
            <CardTitle className="text-yellow-400 font-mono text-sm">
              MARKET IMPACT ANALYSIS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Sentiment summary */}
              <div>
                <h4 className="text-green-400 font-semibold mb-2">NEWS SENTIMENT</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-green-400 text-xl font-bold">
                      {filteredNews.filter(n => n.sentiment === 'positive').length}
                    </div>
                    <div className="text-xs text-green-600">POSITIVE</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-400 text-xl font-bold">
                      {filteredNews.filter(n => n.sentiment === 'negative').length}
                    </div>
                    <div className="text-xs text-green-600">NEGATIVE</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 text-xl font-bold">
                      {filteredNews.filter(n => n.sentiment === 'neutral').length}
                    </div>
                    <div className="text-xs text-green-600">NEUTRAL</div>
                  </div>
                </div>
              </div>

              {/* Key topics */}
              <div>
                <h4 className="text-green-400 font-semibold mb-2">KEY TOPICS</h4>
                <div className="space-y-1">
                  <Badge variant="outline" className="border-green-600 text-green-400 mr-2">
                    EARNINGS
                  </Badge>
                  <Badge variant="outline" className="border-green-600 text-green-400 mr-2">
                    REGULATION
                  </Badge>
                  <Badge variant="outline" className="border-green-600 text-green-400 mr-2">
                    ANALYST RATINGS
                  </Badge>
                </div>
              </div>

              {/* Market impact indicator */}
              <div>
                <h4 className="text-green-400 font-semibold mb-2">IMPACT SCORE</h4>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {(filteredNews.reduce((acc, n) => acc + (n.relevance_score || 0), 0) / filteredNews.length * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-green-600">MARKET RELEVANCE</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
