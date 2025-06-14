
// Mock market data service for demonstration
// In a real application, this would connect to actual market data APIs

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: number;
}

export interface SearchResult {
  symbol: string;
  name: string;
  exchange?: string;
}

class MarketDataService {
  // Mock data for demonstration
  private mockStocks: Record<string, StockQuote> = {
    'AAPL': { symbol: 'AAPL', name: 'Apple Inc.', price: 175.84, change: 2.34, changePercent: 1.35 },
    'GOOGL': { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.45, change: -1.23, changePercent: -0.88 },
    'MSFT': { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.92, change: 4.56, changePercent: 1.22 },
    'TSLA': { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.73, change: -5.67, changePercent: -2.23 },
    'AMZN': { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 155.89, change: 1.89, changePercent: 1.23 },
    'NVDA': { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 12.45, changePercent: 1.44 },
    'META': { symbol: 'META', name: 'Meta Platforms Inc.', price: 485.92, change: -3.21, changePercent: -0.66 },
    'VTI': { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', price: 245.67, change: 1.23, changePercent: 0.50 },
    'BND': { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', price: 78.45, change: -0.12, changePercent: -0.15 },
    'QQQ': { symbol: 'QQQ', name: 'Invesco QQQ Trust ETF', price: 385.91, change: 2.67, changePercent: 0.70 }
  };

  async getStockQuote(symbol: string): Promise<StockQuote | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const stock = this.mockStocks[symbol.toUpperCase()];
    if (stock) {
      // Add some random variation to make it feel more realistic
      const variation = (Math.random() - 0.5) * 0.1;
      return {
        ...stock,
        price: Number((stock.price * (1 + variation)).toFixed(2)),
        change: Number((stock.change + variation * 2).toFixed(2)),
        changePercent: Number((stock.changePercent + variation * 2).toFixed(2))
      };
    }
    
    // Generate mock data for unknown symbols
    const basePrice = 50 + Math.random() * 200;
    const change = (Math.random() - 0.5) * 10;
    return {
      symbol: symbol.toUpperCase(),
      name: `${symbol.toUpperCase()} Company`,
      price: Number(basePrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number((change / basePrice * 100).toFixed(2))
    };
  }

  async searchStocks(query: string): Promise<SearchResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!query || query.length < 1) return [];
    
    const results: SearchResult[] = [];
    
    // Search in mock stocks
    Object.values(this.mockStocks).forEach(stock => {
      if (stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          symbol: stock.symbol,
          name: stock.name,
          exchange: 'NASDAQ'
        });
      }
    });
    
    // Add some additional mock results
    const additionalStocks = [
      { symbol: 'NFLX', name: 'Netflix Inc.', exchange: 'NASDAQ' },
      { symbol: 'AMD', name: 'Advanced Micro Devices', exchange: 'NASDAQ' },
      { symbol: 'INTC', name: 'Intel Corporation', exchange: 'NASDAQ' },
      { symbol: 'CRM', name: 'Salesforce Inc.', exchange: 'NYSE' },
      { symbol: 'ORCL', name: 'Oracle Corporation', exchange: 'NYSE' }
    ];
    
    additionalStocks.forEach(stock => {
      if (stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(stock);
      }
    });
    
    return results.slice(0, 10); // Limit results
  }

  async getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    const quotes = await Promise.all(
      symbols.map(symbol => this.getStockQuote(symbol))
    );
    return quotes.filter(quote => quote !== null) as StockQuote[];
  }
}

export const marketDataService = new MarketDataService();
