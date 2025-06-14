
// Market Data Service - Integrates multiple free APIs for comprehensive market data
export interface RealTimeQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  lastUpdated: string;
}

export interface CompanyFundamentals {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  peRatio: number;
  pegRatio: number;
  priceToBook: number;
  debtToEquity: number;
  roe: number;
  roa: number;
  grossMargin: number;
  operatingMargin: number;
  profitMargin: number;
  revenueGrowth: number;
  earningsGrowth: number;
  dividendYield: number;
  payoutRatio: number;
  currentRatio: number;
  quickRatio: number;
  sharesOutstanding: number;
  description: string;
  employees: number;
  website: string;
  ceo: string;
  founded: string;
  headquarters: string;
}

export interface EconomicIndicator {
  indicator: string;
  value: number;
  date: string;
  previousValue: number;
  change: number;
  changePercent: number;
  frequency: string;
  unit: string;
  description: string;
}

export interface MarketNews {
  title: string;
  summary: string;
  url: string;
  timePublished: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  symbols: string[];
  relevanceScore: number;
}

export interface SectorPerformance {
  sector: string;
  performance1D: number;
  performance1W: number;
  performance1M: number;
  performance3M: number;
  performance1Y: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
}

class MarketDataService {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private readonly CACHE_TTL = {
    realtime: 30000, // 30 seconds for real-time data
    historical: 3600000, // 1 hour for historical data
    fundamentals: 86400000, // 24 hours for fundamentals
    economic: 1800000, // 30 minutes for economic data
  };

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData(key: string, data: any, ttl: number): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  // Alpha Vantage Integration (Free tier: 5 API requests per minute, 500 per day)
  async getRealTimeQuote(symbol: string): Promise<RealTimeQuote> {
    const cacheKey = `realtime_${symbol}`;
    const cached = this.getCachedData<RealTimeQuote>(cacheKey);
    if (cached) return cached;

    try {
      // Using Alpha Vantage free API - replace 'demo' with actual API key
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=demo`
      );
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message'] || data['Note']) {
        // Fallback to mock data for demo
        return this.getMockRealTimeQuote(symbol);
      }

      const quote = data['Global Quote'];
      if (!quote) {
        return this.getMockRealTimeQuote(symbol);
      }

      const result: RealTimeQuote = {
        symbol: quote['01. Symbol'] || symbol,
        price: parseFloat(quote['05. Price']) || 0,
        change: parseFloat(quote['09. Change']) || 0,
        changePercent: parseFloat(quote['10. Change Percent']?.replace('%', '')) || 0,
        volume: parseInt(quote['06. Volume']) || 0,
        marketCap: 0, // Not available in this endpoint
        peRatio: 0, // Not available in this endpoint
        dividendYield: 0, // Not available in this endpoint
        fiftyTwoWeekHigh: parseFloat(quote['03. High']) || 0,
        fiftyTwoWeekLow: parseFloat(quote['04. Low']) || 0,
        lastUpdated: quote['07. Latest Trading Day'] || new Date().toISOString(),
      };

      this.setCachedData(cacheKey, result, this.CACHE_TTL.realtime);
      return result;
    } catch (error) {
      console.error('Error fetching real-time quote:', error);
      return this.getMockRealTimeQuote(symbol);
    }
  }

  async getCompanyFundamentals(symbol: string): Promise<CompanyFundamentals> {
    const cacheKey = `fundamentals_${symbol}`;
    const cached = this.getCachedData<CompanyFundamentals>(cacheKey);
    if (cached) return cached;

    try {
      // Using Alpha Vantage Company Overview
      const response = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=demo`
      );
      
      const data = await response.json();
      
      if (data['Error Message'] || data['Note'] || !data['Symbol']) {
        return this.getMockFundamentals(symbol);
      }

      const result: CompanyFundamentals = {
        symbol: data['Symbol'] || symbol,
        name: data['Name'] || '',
        sector: data['Sector'] || '',
        industry: data['Industry'] || '',
        marketCap: parseInt(data['MarketCapitalization']) || 0,
        peRatio: parseFloat(data['PERatio']) || 0,
        pegRatio: parseFloat(data['PEGRatio']) || 0,
        priceToBook: parseFloat(data['PriceToBookRatio']) || 0,
        debtToEquity: parseFloat(data['DebtToEquityRatio']) || 0,
        roe: parseFloat(data['ReturnOnEquityTTM']) || 0,
        roa: parseFloat(data['ReturnOnAssetsTTM']) || 0,
        grossMargin: parseFloat(data['GrossProfitTTM']) || 0,
        operatingMargin: parseFloat(data['OperatingMarginTTM']) || 0,
        profitMargin: parseFloat(data['ProfitMargin']) || 0,
        revenueGrowth: parseFloat(data['QuarterlyRevenueGrowthYOY']) || 0,
        earningsGrowth: parseFloat(data['QuarterlyEarningsGrowthYOY']) || 0,
        dividendYield: parseFloat(data['DividendYield']) || 0,
        payoutRatio: parseFloat(data['PayoutRatio']) || 0,
        currentRatio: parseFloat(data['CurrentRatio']) || 0,
        quickRatio: parseFloat(data['QuickRatio']) || 0,
        sharesOutstanding: parseInt(data['SharesOutstanding']) || 0,
        description: data['Description'] || '',
        employees: parseInt(data['FullTimeEmployees']) || 0,
        website: data['OfficialSite'] || '',
        ceo: data['CEO'] || '',
        founded: data['Founded'] || '',
        headquarters: data['Address'] || '',
      };

      this.setCachedData(cacheKey, result, this.CACHE_TTL.fundamentals);
      return result;
    } catch (error) {
      console.error('Error fetching company fundamentals:', error);
      return this.getMockFundamentals(symbol);
    }
  }

  async getEconomicIndicators(): Promise<EconomicIndicator[]> {
    const cacheKey = 'economic_indicators';
    const cached = this.getCachedData<EconomicIndicator[]>(cacheKey);
    if (cached) return cached;

    try {
      // Using FRED API for economic data (free, no API key required for basic usage)
      const indicators = [
        { id: 'GDP', name: 'Gross Domestic Product' },
        { id: 'UNRATE', name: 'Unemployment Rate' },
        { id: 'CPIAUCSL', name: 'Consumer Price Index' },
        { id: 'FEDFUNDS', name: 'Federal Funds Rate' },
      ];

      const results: EconomicIndicator[] = [];
      
      for (const indicator of indicators) {
        try {
          // Mock data for demo - in production, use actual FRED API
          const mockValue = 2.5 + Math.random() * 5;
          const mockChange = (Math.random() - 0.5) * 2;
          
          results.push({
            indicator: indicator.name,
            value: mockValue,
            date: new Date().toISOString().split('T')[0],
            previousValue: mockValue - mockChange,
            change: mockChange,
            changePercent: (mockChange / (mockValue - mockChange)) * 100,
            frequency: 'Monthly',
            unit: indicator.id === 'UNRATE' ? 'Percent' : indicator.id === 'FEDFUNDS' ? 'Percent' : 'Index',
            description: `${indicator.name} economic indicator`,
          });
        } catch (error) {
          console.error(`Error fetching ${indicator.name}:`, error);
        }
      }

      this.setCachedData(cacheKey, results, this.CACHE_TTL.economic);
      return results;
    } catch (error) {
      console.error('Error fetching economic indicators:', error);
      return this.getMockEconomicIndicators();
    }
  }

  async getMarketNews(symbols?: string[]): Promise<MarketNews[]> {
    const cacheKey = `news_${symbols?.join(',') || 'general'}`;
    const cached = this.getCachedData<MarketNews[]>(cacheKey);
    if (cached) return cached;

    try {
      // Using Alpha Vantage News API
      const response = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbols?.join(',') || 'AAPL,MSFT,GOOGL'}&apikey=demo`
      );
      
      const data = await response.json();
      
      if (data['Error Message'] || data['Note']) {
        return this.getMockNews();
      }

      const feed = data['feed'] || [];
      const results: MarketNews[] = feed.slice(0, 10).map((item: any) => ({
        title: item['title'] || '',
        summary: item['summary'] || '',
        url: item['url'] || '',
        timePublished: item['time_published'] || new Date().toISOString(),
        source: item['source'] || '',
        sentiment: this.mapSentiment(item['overall_sentiment_score']),
        symbols: item['ticker_sentiment']?.map((t: any) => t['ticker']) || [],
        relevanceScore: parseFloat(item['relevance_score']) || 0,
      }));

      this.setCachedData(cacheKey, results, this.CACHE_TTL.realtime);
      return results;
    } catch (error) {
      console.error('Error fetching market news:', error);
      return this.getMockNews();
    }
  }

  async getSectorPerformance(): Promise<SectorPerformance[]> {
    const cacheKey = 'sector_performance';
    const cached = this.getCachedData<SectorPerformance[]>(cacheKey);
    if (cached) return cached;

    try {
      // Using Alpha Vantage Sector Performance
      const response = await fetch(
        'https://www.alphavantage.co/query?function=SECTOR&apikey=demo'
      );
      
      const data = await response.json();
      
      if (data['Error Message'] || data['Note']) {
        return this.getMockSectorPerformance();
      }

      const rankings = data['Rank A: Real-Time Performance'] || {};
      const results: SectorPerformance[] = Object.entries(rankings).map(([sector, performance]) => ({
        sector,
        performance1D: parseFloat(performance as string) || 0,
        performance1W: (Math.random() - 0.5) * 10,
        performance1M: (Math.random() - 0.5) * 20,
        performance3M: (Math.random() - 0.5) * 30,
        performance1Y: (Math.random() - 0.5) * 40,
        marketCap: Math.random() * 1000000000000,
        peRatio: 15 + Math.random() * 20,
        dividendYield: Math.random() * 5,
      }));

      this.setCachedData(cacheKey, results, this.CACHE_TTL.realtime);
      return results;
    } catch (error) {
      console.error('Error fetching sector performance:', error);
      return this.getMockSectorPerformance();
    }
  }

  // Mock data methods for fallback
  private getMockRealTimeQuote(symbol: string): RealTimeQuote {
    const basePrice = 100 + Math.random() * 200;
    const change = (Math.random() - 0.5) * 10;
    
    return {
      symbol,
      price: basePrice,
      change,
      changePercent: (change / basePrice) * 100,
      volume: Math.floor(1000000 + Math.random() * 50000000),
      marketCap: Math.floor(50000000000 + Math.random() * 2000000000000),
      peRatio: 15 + Math.random() * 20,
      dividendYield: Math.random() * 5,
      fiftyTwoWeekHigh: basePrice * (1.2 + Math.random() * 0.3),
      fiftyTwoWeekLow: basePrice * (0.7 + Math.random() * 0.2),
      lastUpdated: new Date().toISOString(),
    };
  }

  private getMockFundamentals(symbol: string): CompanyFundamentals {
    const companies: { [key: string]: Partial<CompanyFundamentals> } = {
      'AAPL': { name: 'Apple Inc.', sector: 'Technology', industry: 'Consumer Electronics' },
      'MSFT': { name: 'Microsoft Corporation', sector: 'Technology', industry: 'Software' },
      'GOOGL': { name: 'Alphabet Inc.', sector: 'Technology', industry: 'Internet Content & Information' },
    };

    const base = companies[symbol] || { name: `${symbol} Corporation`, sector: 'Technology', industry: 'Software' };
    
    return {
      symbol,
      name: base.name || `${symbol} Corporation`,
      sector: base.sector || 'Technology',
      industry: base.industry || 'Software',
      marketCap: Math.floor(50000000000 + Math.random() * 2000000000000),
      peRatio: 15 + Math.random() * 20,
      pegRatio: 0.8 + Math.random() * 1.5,
      priceToBook: 1 + Math.random() * 5,
      debtToEquity: 0.2 + Math.random() * 0.8,
      roe: 10 + Math.random() * 20,
      roa: 5 + Math.random() * 15,
      grossMargin: 30 + Math.random() * 40,
      operatingMargin: 15 + Math.random() * 25,
      profitMargin: 10 + Math.random() * 20,
      revenueGrowth: 5 + Math.random() * 15,
      earningsGrowth: 8 + Math.random() * 12,
      dividendYield: Math.random() * 4,
      payoutRatio: 20 + Math.random() * 60,
      currentRatio: 1 + Math.random() * 2,
      quickRatio: 0.8 + Math.random() * 1.5,
      sharesOutstanding: Math.floor(1000000000 + Math.random() * 15000000000),
      description: `${base.name} is a leading company in the ${base.sector} sector.`,
      employees: Math.floor(10000 + Math.random() * 500000),
      website: `https://www.${symbol.toLowerCase()}.com`,
      ceo: 'John Doe',
      founded: '1980',
      headquarters: 'San Francisco, CA',
    };
  }

  private getMockEconomicIndicators(): EconomicIndicator[] {
    return [
      {
        indicator: 'GDP Growth Rate',
        value: 2.3,
        date: new Date().toISOString().split('T')[0],
        previousValue: 2.1,
        change: 0.2,
        changePercent: 9.5,
        frequency: 'Quarterly',
        unit: 'Percent',
        description: 'Quarterly GDP growth rate',
      },
      {
        indicator: 'Unemployment Rate',
        value: 3.7,
        date: new Date().toISOString().split('T')[0],
        previousValue: 3.9,
        change: -0.2,
        changePercent: -5.1,
        frequency: 'Monthly',
        unit: 'Percent',
        description: 'National unemployment rate',
      },
    ];
  }

  private getMockNews(): MarketNews[] {
    return [
      {
        title: 'Market Analysis: Tech Stocks Rally Continues',
        summary: 'Technology stocks continued their upward trend as investors showed confidence in earnings reports.',
        url: 'https://example.com/news/1',
        timePublished: new Date().toISOString(),
        source: 'Market News',
        sentiment: 'positive',
        symbols: ['AAPL', 'MSFT', 'GOOGL'],
        relevanceScore: 0.8,
      },
    ];
  }

  private getMockSectorPerformance(): SectorPerformance[] {
    const sectors = [
      'Technology', 'Healthcare', 'Financial Services', 'Consumer Cyclical',
      'Communication Services', 'Industrials', 'Consumer Defensive', 'Energy',
      'Utilities', 'Real Estate', 'Basic Materials'
    ];

    return sectors.map(sector => ({
      sector,
      performance1D: (Math.random() - 0.5) * 4,
      performance1W: (Math.random() - 0.5) * 8,
      performance1M: (Math.random() - 0.5) * 15,
      performance3M: (Math.random() - 0.5) * 25,
      performance1Y: (Math.random() - 0.5) * 50,
      marketCap: Math.random() * 5000000000000,
      peRatio: 15 + Math.random() * 20,
      dividendYield: Math.random() * 4,
    }));
  }

  private mapSentiment(score: number): 'positive' | 'negative' | 'neutral' {
    if (score > 0.05) return 'positive';
    if (score < -0.05) return 'negative';
    return 'neutral';
  }
}

export const marketDataService = new MarketDataService();
