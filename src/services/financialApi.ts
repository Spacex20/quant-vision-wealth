
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

// Using Yahoo Finance API via RapidAPI (free tier available)
const API_BASE = 'https://yahoo-finance15.p.rapidapi.com/api/yahoo';

// For demo purposes, we'll use mock data that simulates real API responses
// In production, you would replace this with actual API calls
export const financialApi = {
  async getStockQuote(symbol: string): Promise<StockQuote> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data - in production, replace with real API call
    const mockData: { [key: string]: StockQuote } = {
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

    return mockData[symbol] || mockData['AAPL'];
  },

  async getHistoricalData(symbol: string, period: string = '1y'): Promise<HistoricalData[]> {
    await new Promise(resolve => setTimeout(resolve, 750));
    
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
  },

  async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
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
      }
    };

    return profiles[symbol] || profiles['AAPL'];
  },

  async searchStocks(query: string): Promise<{ symbol: string; name: string }[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const stocks = [
      { symbol: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'MSFT', name: 'Microsoft Corporation' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.' },
      { symbol: 'TSLA', name: 'Tesla Inc.' },
      { symbol: 'META', name: 'Meta Platforms Inc.' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation' },
      { symbol: 'NFLX', name: 'Netflix Inc.' }
    ];

    return stocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
  }
};
