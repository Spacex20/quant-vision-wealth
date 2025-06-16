
import { supabase } from "@/integrations/supabase/client";

export interface YFinanceQuoteData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  peRatio?: number;
  dividendYield?: number;
  high52Week?: number;
  low52Week?: number;
  timestamp: number;
}

export interface YFinanceHistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface YFinanceFundamentals {
  symbol: string;
  marketCap: number;
  peRatio: number;
  pegRatio: number;
  priceToBook: number;
  debtToEquity: number;
  roe: number;
  roa: number;
  dividendYield: number;
  payoutRatio: number;
  revenue: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  freeCashFlow: number;
  operatingCashFlow: number;
  bookValue: number;
  enterpriseValue: number;
  priceToSales: number;
  priceToEarnings: number;
  earningsGrowth: number;
  revenueGrowth: number;
  sector: string;
  industry: string;
  employees: number;
  lastUpdated: string;
}

export interface BacktestRequest {
  symbols: string[];
  strategy: string;
  startDate: string;
  endDate: string;
  initialAmount: number;
  parameters?: Record<string, any>;
}

export interface BacktestResults {
  strategy: string;
  symbols: string[];
  initialAmount: number;
  finalValue: number;
  totalReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  portfolioValues: Array<{
    date: string;
    value: number;
    cash: number;
    positions: Record<string, number>;
  }>;
  trades: any[];
  metrics: {
    winRate: number;
    avgWin: number;
    avgLoss: number;
    profitFactor: number;
    totalTrades: number;
  };
  startDate: string;
  endDate: string;
  duration: number;
}

class YFinanceService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  async getQuote(symbol: string, forceRefresh = false): Promise<YFinanceQuoteData> {
    const cacheKey = `quote_${symbol}`;
    
    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      console.log(`Using cached quote for ${symbol}`);
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const { data, error } = await supabase.functions.invoke('yfinance-data', {
        body: null,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
        query: { action: 'quote', symbol }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch quote data');
      }

      // Cache for 5 minutes
      this.setCache(cacheKey, data.data, 5 * 60 * 1000);
      
      console.log(`Fetched fresh quote for ${symbol}`, data.cached ? '(from server cache)' : '');
      return data.data;

    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw new Error(`Failed to fetch quote for ${symbol}: ${error.message}`);
    }
  }

  async getHistorical(
    symbol: string, 
    period: string = '1y', 
    interval: string = '1d'
  ): Promise<YFinanceHistoricalData[]> {
    const cacheKey = `historical_${symbol}_${period}_${interval}`;
    
    if (this.isCacheValid(cacheKey)) {
      console.log(`Using cached historical data for ${symbol}`);
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const { data, error } = await supabase.functions.invoke('yfinance-data', {
        body: null,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
        query: { action: 'historical', symbol, period, interval }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch historical data');
      }

      // Cache for 1 hour
      this.setCache(cacheKey, data.data, 60 * 60 * 1000);
      
      console.log(`Fetched fresh historical data for ${symbol}`, data.cached ? '(from server cache)' : '');
      return data.data;

    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      throw new Error(`Failed to fetch historical data for ${symbol}: ${error.message}`);
    }
  }

  async getFundamentals(symbol: string): Promise<YFinanceFundamentals> {
    const cacheKey = `fundamentals_${symbol}`;
    
    if (this.isCacheValid(cacheKey)) {
      console.log(`Using cached fundamentals for ${symbol}`);
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const { data, error } = await supabase.functions.invoke('yfinance-data', {
        body: null,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
        query: { action: 'fundamentals', symbol }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch fundamentals');
      }

      // Cache for 24 hours
      this.setCache(cacheKey, data.data, 24 * 60 * 60 * 1000);
      
      console.log(`Fetched fresh fundamentals for ${symbol}`, data.cached ? '(from server cache)' : '');
      return data.data;

    } catch (error) {
      console.error(`Error fetching fundamentals for ${symbol}:`, error);
      throw new Error(`Failed to fetch fundamentals for ${symbol}: ${error.message}`);
    }
  }

  async runBacktest(request: BacktestRequest): Promise<BacktestResults> {
    console.log('Starting backtest request:', request);

    try {
      const { data, error } = await supabase.functions.invoke('yfinance-data', {
        body: request,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        query: { action: 'backtest' }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Backtest failed');
      }

      console.log('Backtest completed successfully');
      return data.data;

    } catch (error) {
      console.error('Error running backtest:', error);
      throw new Error(`Backtest failed: ${error.message}`);
    }
  }

  async validateSymbol(symbol: string): Promise<boolean> {
    try {
      await this.getQuote(symbol);
      return true;
    } catch (error) {
      console.log(`Symbol validation failed for ${symbol}:`, error.message);
      return false;
    }
  }

  async getMultipleQuotes(symbols: string[]): Promise<Record<string, YFinanceQuoteData | null>> {
    const results: Record<string, YFinanceQuoteData | null> = {};
    
    await Promise.all(
      symbols.map(async (symbol) => {
        try {
          results[symbol] = await this.getQuote(symbol);
        } catch (error) {
          console.error(`Failed to fetch quote for ${symbol}:`, error);
          results[symbol] = null;
        }
      })
    );

    return results;
  }

  formatSymbol(symbol: string, market: 'US' | 'IN'): string {
    if (market === 'IN' && !symbol.includes('.NS')) {
      return `${symbol}.NS`;
    }
    return symbol;
  }

  clearCache(): void {
    this.cache.clear();
    console.log('YFinance service cache cleared');
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    return Date.now() - cached.timestamp < cached.ttl;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
}

export const yfinanceService = new YFinanceService();
