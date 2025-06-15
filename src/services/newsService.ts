// News Service - Aggregates financial news from multiple sources
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: string;
  author?: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  symbols: string[];
  relevanceScore: number;
  readTime?: number;
}

export interface NewsSource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  language: string;
  country: string;
}

import { API_CONFIG, API_ENDPOINTS } from './apiConfig';

class NewsService {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private readonly CACHE_TTL = {
    news: 600000, // 10 minutes
    sources: 3600000, // 1 hour
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

  // Marketaux API - Financial news with sentiment
  async getFinancialNews(symbols?: string[], limit: number = 20): Promise<NewsArticle[]> {
    const cacheKey = `financial_news_${symbols?.join(',') || 'general'}_${limit}`;
    const cached = this.getCachedData<NewsArticle[]>(cacheKey);
    if (cached) return cached;

    try {
      console.log('Fetching financial news from Marketaux with real API key');
      
      let url = `${API_ENDPOINTS.MARKETAUX}/news/all?language=en&limit=${limit}&api_token=${API_CONFIG.MARKETAUX}`;
      
      if (symbols && symbols.length > 0) {
        url += `&symbols=${symbols.join(',')}`;
      }

      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          const articles: NewsArticle[] = data.data.map((item: any, index: number) => ({
            id: item.uuid || `marketaux_${index}`,
            title: item.title || '',
            summary: item.description || item.snippet || '',
            content: item.description || '',
            url: item.url || '',
            imageUrl: item.image_url || '',
            publishedAt: item.published_at || new Date().toISOString(),
            source: item.source || 'Marketaux',
            author: item.author || '',
            category: 'Financial',
            sentiment: this.analyzeSentiment(item.description || item.title || ''),
            symbols: item.entities?.map((entity: any) => entity.symbol).filter(Boolean) || [],
            relevanceScore: item.sentiment?.overall || Math.random(),
            readTime: this.estimateReadTime(item.description || item.title || '')
          }));

          this.setCachedData(cacheKey, articles, this.CACHE_TTL.news);
          return articles;
        }
      }

      return await this.getNewsAPIFallback(symbols, limit);
    } catch (error) {
      console.error('Error fetching financial news:', error);
      return this.getFallbackNews(symbols, limit);
    }
  }

  // NewsAPI fallback
  private async getNewsAPIFallback(symbols?: string[], limit: number = 20): Promise<NewsArticle[]> {
    try {
      console.log('Using NewsAPI fallback');
      
      const query = symbols?.length 
        ? symbols.join(' OR ') 
        : 'stock market OR finance OR investment OR trading';
      
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=${limit}&apiKey=${API_CONFIG.NEWS_API}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.articles) {
          return data.articles.map((article: any, index: number) => ({
            id: `newsapi_${index}`,
            title: article.title || '',
            summary: article.description || '',
            content: article.content || article.description || '',
            url: article.url || '',
            imageUrl: article.urlToImage || '',
            publishedAt: article.publishedAt || new Date().toISOString(),
            source: article.source?.name || 'NewsAPI',
            author: article.author || '',
            category: 'Financial',
            sentiment: this.analyzeSentiment(article.description || article.title || ''),
            symbols: symbols || [],
            relevanceScore: Math.random(),
            readTime: this.estimateReadTime(article.description || article.title || '')
          }));
        }
      }
    } catch (error) {
      console.log('NewsAPI fallback failed');
    }
    
    return this.getFallbackNews(symbols, limit);
  }

  // Get news by category
  async getNewsByCategory(category: string, limit: number = 10): Promise<NewsArticle[]> {
    const cacheKey = `news_category_${category}_${limit}`;
    const cached = this.getCachedData<NewsArticle[]>(cacheKey);
    if (cached) return cached;

    try {
      console.log(`Fetching ${category} news`);
      
      const query = this.getCategoryQuery(category);
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=${limit}&apiKey=${API_CONFIG.NEWS_API}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.articles) {
          const articles: NewsArticle[] = data.articles.map((article: any, index: number) => ({
            id: `category_${category}_${index}`,
            title: article.title || '',
            summary: article.description || '',
            content: article.content || article.description || '',
            url: article.url || '',
            imageUrl: article.urlToImage || '',
            publishedAt: article.publishedAt || new Date().toISOString(),
            source: article.source?.name || 'NewsAPI',
            author: article.author || '',
            category: category,
            sentiment: this.analyzeSentiment(article.description || article.title || ''),
            symbols: [],
            relevanceScore: Math.random(),
            readTime: this.estimateReadTime(article.description || article.title || '')
          }));

          this.setCachedData(cacheKey, articles, this.CACHE_TTL.news);
          return articles;
        }
      }

      return this.getFallbackNewsByCategory(category, limit);
    } catch (error) {
      console.error(`Error fetching ${category} news:`, error);
      return this.getFallbackNewsByCategory(category, limit);
    }
  }

  // Get trending financial topics
  async getTrendingTopics(): Promise<string[]> {
    const cacheKey = 'trending_topics';
    const cached = this.getCachedData<string[]>(cacheKey);
    if (cached) return cached;

    try {
      // For demo purposes, returning predefined trending topics
      // In production, this could analyze recent news to extract trending keywords
      const topics = [
        'Federal Reserve',
        'Interest Rates',
        'Inflation',
        'Earnings Season',
        'Tech Stocks',
        'Oil Prices',
        'GDP Growth',
        'Market Volatility',
        'ESG Investing',
        'AI Revolution'
      ];

      this.setCachedData(cacheKey, topics, this.CACHE_TTL.news);
      return topics;
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      return ['Market Analysis', 'Economic Data', 'Company Earnings'];
    }
  }

  // Search news by keyword
  async searchNews(query: string, limit: number = 15): Promise<NewsArticle[]> {
    if (!query || query.trim().length < 2) return [];

    const cacheKey = `search_${query}_${limit}`;
    const cached = this.getCachedData<NewsArticle[]>(cacheKey);
    if (cached) return cached;

    try {
      console.log(`Searching news for: ${query}`);
      
      const searchQuery = `${query} AND (finance OR investment OR stock OR market)`;
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&sortBy=relevancy&language=en&pageSize=${limit}&apiKey=${API_CONFIG.NEWS_API}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.articles) {
          const articles: NewsArticle[] = data.articles.map((article: any, index: number) => ({
            id: `search_${query}_${index}`,
            title: article.title || '',
            summary: article.description || '',
            content: article.content || article.description || '',
            url: article.url || '',
            imageUrl: article.urlToImage || '',
            publishedAt: article.publishedAt || new Date().toISOString(),
            source: article.source?.name || 'NewsAPI',
            author: article.author || '',
            category: 'Search Results',
            sentiment: this.analyzeSentiment(article.description || article.title || ''),
            symbols: this.extractSymbols(article.title + ' ' + (article.description || '')),
            relevanceScore: Math.random(),
            readTime: this.estimateReadTime(article.description || article.title || '')
          }));

          this.setCachedData(cacheKey, articles, this.CACHE_TTL.news);
          return articles;
        }
      }

      return [];
    } catch (error) {
      console.error('Error searching news:', error);
      return [];
    }
  }

  // Utility methods
  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = [
      'gain', 'rise', 'bull', 'strong', 'growth', 'profit', 'up', 'surge', 'rally',
      'bullish', 'optimistic', 'positive', 'boost', 'increase', 'soar', 'jump'
    ];
    
    const negativeWords = [
      'loss', 'fall', 'bear', 'weak', 'decline', 'down', 'crash', 'drop', 'sell',
      'bearish', 'pessimistic', 'negative', 'plunge', 'decrease', 'tumble', 'slip'
    ];
    
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) score += 1;
      if (negativeWords.some(nw => word.includes(nw))) score -= 1;
    });
    
    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
  }

  private extractSymbols(text: string): string[] {
    const symbolPattern = /\b[A-Z]{1,5}\b/g;
    const matches = text.match(symbolPattern) || [];
    
    // Filter out common non-stock words
    const excludeWords = ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'HAD', 'HAS', 'HIS', 'HOW', 'ITS', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WHO', 'BOY', 'DID', 'GET', 'MAY', 'OWN', 'SAY', 'SHE', 'TOO', 'USE'];
    
    return [...new Set(matches)].filter(symbol => 
      symbol.length >= 2 && 
      symbol.length <= 5 && 
      !excludeWords.includes(symbol)
    ).slice(0, 5); // Limit to 5 symbols
  }

  private estimateReadTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  private getCategoryQuery(category: string): string {
    const categoryQueries: { [key: string]: string } = {
      'markets': 'stock market OR financial markets OR trading',
      'economy': 'economy OR economic OR GDP OR inflation OR unemployment',
      'technology': 'technology stocks OR tech companies OR innovation',
      'energy': 'oil prices OR energy sector OR renewable energy',
      'healthcare': 'healthcare stocks OR pharmaceutical OR biotech',
      'banking': 'banks OR financial services OR interest rates',
      'real-estate': 'real estate OR property market OR REITs'
    };

    return categoryQueries[category.toLowerCase()] || category;
  }

  private getFallbackNews(symbols?: string[], limit: number = 10): NewsArticle[] {
    const fallbackArticles = [
      {
        id: 'fallback_1',
        title: 'Market Update: Technology Stocks Show Strong Performance',
        summary: 'Leading technology companies reported better-than-expected quarterly results, driving market optimism.',
        url: 'https://example.com/news/1',
        publishedAt: new Date().toISOString(),
        source: 'Financial News',
        category: 'Financial',
        sentiment: 'positive' as const,
        symbols: symbols || ['AAPL', 'MSFT', 'GOOGL'],
        relevanceScore: 0.85,
        readTime: 3
      },
      {
        id: 'fallback_2',
        title: 'Economic Indicators Point to Continued Growth',
        summary: 'Recent economic data suggests sustained economic expansion despite global uncertainties.',
        url: 'https://example.com/news/2',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: 'Economic Times',
        category: 'Financial',
        sentiment: 'positive' as const,
        symbols: [],
        relevanceScore: 0.75,
        readTime: 2
      }
    ];

    return fallbackArticles.slice(0, limit);
  }

  private getFallbackNewsByCategory(category: string, limit: number): NewsArticle[] {
    return this.getFallbackNews(undefined, limit).map(article => ({
      ...article,
      category: category,
      id: `fallback_${category}_${article.id}`
    }));
  }
}

export const newsService = new NewsService();
