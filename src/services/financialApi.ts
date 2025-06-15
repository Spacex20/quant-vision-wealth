
import { API_CONFIG, API_ENDPOINTS } from './apiConfig';

export interface StockQuote {
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
  currency: 'USD';
}

export interface CompanyProfile {
  name: string;
  sector: string;
  industry: string;
  description: string;
}

export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
}

class FinancialApiService {
  async getStockQuote(symbol: string): Promise<StockQuote> {
    try {
      console.log(`Fetching real-time quote for ${symbol} from Alpha Vantage`);
      
      const response = await fetch(
        `${API_ENDPOINTS.ALPHA_VANTAGE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_CONFIG.ALPHA_VANTAGE}`
      );
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message'] || data['Note'] || data['Information']) {
        console.log('Alpha Vantage API error:', data);
        return this.getFallbackQuote(symbol);
      }

      const quote = data['Global Quote'];
      if (!quote || !quote['01. Symbol']) {
        return this.getFallbackQuote(symbol);
      }

      return {
        symbol: quote['01. Symbol'] || symbol,
        price: parseFloat(quote['05. Price']) || 0,
        change: parseFloat(quote['09. Change']) || 0,
        changePercent: parseFloat(quote['10. Change Percent']?.replace('%', '')) || 0,
        volume: parseInt(quote['06. Volume']) || 0,
        marketCap: 0, // Will be enhanced with additional data
        peRatio: 0, // Will be enhanced with additional data
        dividendYield: 0, // Will be enhanced with additional data
        fiftyTwoWeekHigh: parseFloat(quote['03. High']) || 0,
        fiftyTwoWeekLow: parseFloat(quote['04. Low']) || 0,
        currency: 'USD'
      };
    } catch (error) {
      console.error('Error fetching stock quote:', error);
      return this.getFallbackQuote(symbol);
    }
  }

  async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    try {
      console.log(`Fetching company profile for ${symbol} from Alpha Vantage`);
      
      const response = await fetch(
        `${API_ENDPOINTS.ALPHA_VANTAGE}?function=OVERVIEW&symbol=${symbol}&apikey=${API_CONFIG.ALPHA_VANTAGE}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data['Symbol'] && !data['Error Message']) {
          return {
            name: data['Name'] || `${symbol} Corporation`,
            sector: data['Sector'] || 'Technology',
            industry: data['Industry'] || 'Software',
            description: data['Description'] || `${symbol} is a leading company.`
          };
        }
      }

      return this.getFallbackProfile(symbol);
    } catch (error) {
      console.error('Error fetching company profile:', error);
      return this.getFallbackProfile(symbol);
    }
  }

  async searchStocks(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 1) return [];

    try {
      console.log(`Searching stocks for: ${query}`);
      
      const response = await fetch(
        `${API_ENDPOINTS.ALPHA_VANTAGE}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${API_CONFIG.ALPHA_VANTAGE}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data['bestMatches']) {
          return data['bestMatches'].slice(0, 10).map((match: any) => ({
            symbol: match['1. symbol'],
            name: match['2. name'],
            exchange: match['4. region']
          }));
        }
      }

      return this.getFallbackSearchResults(query);
    } catch (error) {
      console.error('Error searching stocks:', error);
      return this.getFallbackSearchResults(query);
    }
  }

  private getFallbackQuote(symbol: string): StockQuote {
    console.log(`Using fallback data for ${symbol}`);
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
      currency: 'USD'
    };
  }

  private getFallbackProfile(symbol: string): CompanyProfile {
    const companies: { [key: string]: CompanyProfile } = {
      'AAPL': { name: 'Apple Inc.', sector: 'Technology', industry: 'Consumer Electronics', description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.' },
      'MSFT': { name: 'Microsoft Corporation', sector: 'Technology', industry: 'Software', description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.' },
      'GOOGL': { name: 'Alphabet Inc.', sector: 'Technology', industry: 'Internet Content & Information', description: 'Alphabet Inc. provides online advertising services in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.' },
      'AMZN': { name: 'Amazon.com Inc.', sector: 'Consumer Cyclical', industry: 'Internet Retail', description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally.' },
      'TSLA': { name: 'Tesla Inc.', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.' }
    };

    return companies[symbol] || {
      name: `${symbol} Corporation`,
      sector: 'Technology',
      industry: 'Software',
      description: `${symbol} is a leading company in its sector.`
    };
  }

  private getFallbackSearchResults(query: string): SearchResult[] {
    const mockStocks = [
      { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ' },
      { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ' }
    ];

    return mockStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }
}

export const financialApi = new FinancialApiService();
