
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
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CompanyProfile {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  description: string;
  employees: number;
  website: string;
  marketCap: number;
}

export interface SearchResult {
  symbol: string;
  name: string;
}

// Validation helpers
const validateStockQuote = (data: any): StockQuote => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid stock quote data');
  }
  
  const required = ['symbol', 'price', 'change', 'changePercent', 'volume', 'marketCap', 'peRatio', 'dividendYield'];
  for (const field of required) {
    if (data[field] === undefined || data[field] === null) {
      console.warn(`Missing field ${field} in stock quote, using default value`);
    }
  }
  
  return {
    symbol: data.symbol || 'N/A',
    price: Number(data.price) || 0,
    change: Number(data.change) || 0,
    changePercent: Number(data.changePercent) || 0,
    volume: Number(data.volume) || 0,
    marketCap: Number(data.marketCap) || 0,
    peRatio: Number(data.peRatio) || 0,
    dividendYield: Number(data.dividendYield) || 0,
    fiftyTwoWeekHigh: Number(data.fiftyTwoWeekHigh) || 0,
    fiftyTwoWeekLow: Number(data.fiftyTwoWeekLow) || 0
  };
};

// Using Yahoo Finance API via RapidAPI (free tier available)
const API_BASE = 'https://yahoo-finance15.p.rapidapi.com/api/yahoo';

// For demo purposes, we'll use mock data that simulates real API responses
// In production, you would replace this with actual API calls
export const financialApi = {
  async getStockQuote(symbol: string): Promise<StockQuote> {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('Invalid symbol provided');
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Mock data - in production, replace with real API call
      const mockData: { [key: string]: Partial<StockQuote> } = {
        'AAPL': {
          symbol: 'AAPL',
          price: 182.52,
          change: 2.34,
          changePercent: 1.30,
          volume: 45678900,
          marketCap: 2890000000000,
          peRatio: 29.1,
          dividendYield: 0.44,
          fiftyTwoWeekHigh: 199.62,
          fiftyTwoWeekLow: 164.08
        },
        'MSFT': {
          symbol: 'MSFT',
          price: 378.85,
          change: -1.25,
          changePercent: -0.33,
          volume: 23456789,
          marketCap: 2810000000000,
          peRatio: 32.8,
          dividendYield: 0.72,
          fiftyTwoWeekHigh: 384.30,
          fiftyTwoWeekLow: 309.45
        },
        'GOOGL': {
          symbol: 'GOOGL',
          price: 142.56,
          change: 0.89,
          changePercent: 0.63,
          volume: 18765432,
          marketCap: 1780000000000,
          peRatio: 25.4,
          dividendYield: 0.00,
          fiftyTwoWeekHigh: 151.55,
          fiftyTwoWeekLow: 121.46
        }
      };

      const data = mockData[symbol.toUpperCase()] || mockData['AAPL'];
      return validateStockQuote(data);
    } catch (error) {
      console.error('Error fetching stock quote:', error);
      throw new Error(`Failed to fetch stock quote for ${symbol}`);
    }
  },

  async getHistoricalData(symbol: string, period: string = '1y'): Promise<HistoricalData[]> {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('Invalid symbol provided');
    }
    
    await new Promise(resolve => setTimeout(resolve, 750));
    
    try {
      // Generate mock historical data
      const data: HistoricalData[] = [];
      const today = new Date();
      const startPrice = 150 + Math.random() * 50;
      
      for (let i = 365; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const volatility = 0.02;
        const trend = 0.0002;
        const randomChange = (Math.random() - 0.5) * 2 * volatility + trend;
        const basePrice = startPrice * Math.exp(randomChange * i);
        
        const open = basePrice * (0.995 + Math.random() * 0.01);
        const close = basePrice * (0.995 + Math.random() * 0.01);
        const high = Math.max(open, close) * (1 + Math.random() * 0.02);
        const low = Math.min(open, close) * (1 - Math.random() * 0.02);
        
        data.push({
          date: date.toISOString().split('T')[0],
          open: Number(open.toFixed(2)),
          high: Number(high.toFixed(2)),
          low: Number(low.toFixed(2)),
          close: Number(close.toFixed(2)),
          volume: Math.floor(1000000 + Math.random() * 50000000)
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw new Error(`Failed to fetch historical data for ${symbol}`);
    }
  },

  async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('Invalid symbol provided');
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const profiles: { [key: string]: CompanyProfile } = {
        'AAPL': {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          sector: 'Technology',
          industry: 'Consumer Electronics',
          description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
          employees: 164000,
          website: 'https://www.apple.com',
          marketCap: 2890000000000
        },
        'MSFT': {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          sector: 'Technology',
          industry: 'Software',
          description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
          employees: 221000,
          website: 'https://www.microsoft.com',
          marketCap: 2810000000000
        },
        'GOOGL': {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          sector: 'Technology',
          industry: 'Internet Content & Information',
          description: 'Alphabet Inc. provides online advertising services in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.',
          employees: 190000,
          website: 'https://www.alphabet.com',
          marketCap: 1780000000000
        }
      };

      return profiles[symbol.toUpperCase()] || profiles['AAPL'];
    } catch (error) {
      console.error('Error fetching company profile:', error);
      throw new Error(`Failed to fetch company profile for ${symbol}`);
    }
  },

  async searchStocks(query: string): Promise<SearchResult[]> {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return [];
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const stocks: SearchResult[] = [
        { symbol: 'AAPL', name: 'Apple Inc.' },
        { symbol: 'MSFT', name: 'Microsoft Corporation' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.' },
        { symbol: 'TSLA', name: 'Tesla Inc.' },
        { symbol: 'META', name: 'Meta Platforms Inc.' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation' },
        { symbol: 'NFLX', name: 'Netflix Inc.' },
        { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.' },
        { symbol: 'JNJ', name: 'Johnson & Johnson' }
      ];

      const filtered = stocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);

      return filtered;
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  }
};
