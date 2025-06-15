
import { financialApi, StockQuote as USStockQuote, SearchResult as USSearchResult } from './financialApi';
import { indianFinancialApi, IndianStockQuote, IndianSearchResult } from './indianFinancialApi';

export type Market = 'US' | 'IN';

export interface UnifiedStockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  market: Market;
  currency: 'USD' | 'INR';
  exchange?: string;
  sector?: string;
  industry?: string;
}

export interface UnifiedSearchResult {
  symbol: string;
  name: string;
  market: Market;
  exchange?: string;
  sector?: string;
}

class UnifiedMarketDataService {
  private currentMarket: Market = 'IN'; // Default to Indian market

  setMarket(market: Market) {
    this.currentMarket = market;
  }

  getCurrentMarket(): Market {
    return this.currentMarket;
  }

  async getStockQuote(symbol: string): Promise<UnifiedStockQuote> {
    if (this.currentMarket === 'IN') {
      const indianQuote = await indianFinancialApi.getStockQuote(symbol);
      return {
        ...indianQuote,
        market: 'IN'
      };
    } else {
      const usQuote = await financialApi.getStockQuote(symbol);
      return {
        ...usQuote,
        market: 'US',
        currency: 'USD',
        exchange: 'NASDAQ'
      };
    }
  }

  async searchStocks(query: string): Promise<UnifiedSearchResult[]> {
    if (this.currentMarket === 'IN') {
      const indianResults = await indianFinancialApi.searchStocks(query);
      return indianResults.map(result => ({
        ...result,
        market: 'IN'
      }));
    } else {
      const usResults = await financialApi.searchStocks(query);
      return usResults.map(result => ({
        ...result,
        market: 'US',
        exchange: 'NASDAQ'
      }));
    }
  }

  async getMultipleQuotes(symbols: string[]): Promise<UnifiedStockQuote[]> {
    const quotes = await Promise.all(
      symbols.map(symbol => this.getStockQuote(symbol))
    );
    return quotes;
  }

  formatCurrency(amount: number): string {
    if (this.currentMarket === 'IN') {
      return indianFinancialApi.formatCurrency(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    }
  }

  formatMarketCap(amount: number): string {
    if (this.currentMarket === 'IN') {
      return indianFinancialApi.formatMarketCap(amount);
    } else {
      if (amount >= 1000000000000) { // Trillion
        return `$${(amount / 1000000000000).toFixed(2)}T`;
      } else if (amount >= 1000000000) { // Billion
        return `$${(amount / 1000000000).toFixed(2)}B`;
      } else if (amount >= 1000000) { // Million
        return `$${(amount / 1000000).toFixed(2)}M`;
      } else {
        return `$${amount.toLocaleString('en-US')}`;
      }
    }
  }

  getCurrencySymbol(): string {
    return this.currentMarket === 'IN' ? '₹' : '$';
  }

  getMarketHours(): { open: string; close: string; timezone: string } {
    if (this.currentMarket === 'IN') {
      return {
        open: '9:15 AM',
        close: '3:30 PM',
        timezone: 'IST'
      };
    } else {
      return {
        open: '9:30 AM',
        close: '4:00 PM',
        timezone: 'EST'
      };
    }
  }

  getTopStocks(): string[] {
    if (this.currentMarket === 'IN') {
      return ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'BHARTIARTL'];
    } else {
      return ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
    }
  }
}

export const unifiedMarketData = new UnifiedMarketDataService();
