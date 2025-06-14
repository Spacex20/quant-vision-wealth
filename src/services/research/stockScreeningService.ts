
// Stock Screening Service - Handles stock filtering and screening logic
import { marketDataService } from '../marketDataService';
import { ScreeningCriteria, ScreeningResult } from './types';

export class StockScreeningService {
  private screeningCache: Map<string, { results: ScreeningResult[]; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 1800000; // 30 minutes

  async screenStocks(criteria: ScreeningCriteria): Promise<ScreeningResult[]> {
    console.log('Stock Screening: Screening stocks with criteria', criteria);

    const cacheKey = this.generateScreeningCacheKey(criteria);
    const cached = this.getScreeningFromCache(cacheKey);
    if (cached) return cached;

    // Get sample universe of stocks
    const universe = await this.getStockUniverse();
    
    // Apply screening criteria
    const results = await this.applyScreeningCriteria(universe, criteria);
    
    // Score and rank results
    const scoredResults = this.scoreScreeningResults(results, criteria);
    
    this.cacheScreeningResults(cacheKey, scoredResults);
    return scoredResults;
  }

  private async getStockUniverse(): Promise<any[]> {
    // Mock stock universe for screening
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC'];
    
    return Promise.all(
      symbols.map(async symbol => {
        const [quote, fundamentals] = await Promise.all([
          marketDataService.getRealTimeQuote(symbol),
          marketDataService.getCompanyFundamentals(symbol)
        ]);
        return { quote, fundamentals };
      })
    );
  }

  private async applyScreeningCriteria(universe: any[], criteria: ScreeningCriteria): Promise<any[]> {
    return universe.filter(stock => {
      const { fundamentals } = stock;
      
      // Apply market cap filter
      if (criteria.marketCap) {
        if (criteria.marketCap.min && fundamentals.marketCap < criteria.marketCap.min) return false;
        if (criteria.marketCap.max && fundamentals.marketCap > criteria.marketCap.max) return false;
      }
      
      // Apply P/E ratio filter
      if (criteria.peRatio) {
        if (criteria.peRatio.min && fundamentals.peRatio < criteria.peRatio.min) return false;
        if (criteria.peRatio.max && fundamentals.peRatio > criteria.peRatio.max) return false;
      }
      
      // Apply other filters...
      return true;
    });
  }

  private scoreScreeningResults(results: any[], criteria: ScreeningCriteria): ScreeningResult[] {
    return results.map(stock => {
      const { quote, fundamentals } = stock;
      
      let score = 0;
      const matchedCriteria: string[] = [];
      
      // Score based on criteria match
      if (criteria.peRatio && fundamentals.peRatio <= (criteria.peRatio.max || Infinity)) {
        score += 10;
        matchedCriteria.push('P/E Ratio');
      }
      
      if (criteria.dividendYield && fundamentals.dividendYield >= (criteria.dividendYield.min || 0)) {
        score += 8;
        matchedCriteria.push('Dividend Yield');
      }
      
      // Add more scoring logic...
      
      return {
        symbol: fundamentals.symbol,
        name: fundamentals.name,
        price: quote.price,
        marketCap: fundamentals.marketCap,
        peRatio: fundamentals.peRatio,
        dividendYield: fundamentals.dividendYield,
        score: score + Math.random() * 20, // Add some variation
        sector: fundamentals.sector,
        matchedCriteria
      };
    }).sort((a, b) => b.score - a.score);
  }

  private generateScreeningCacheKey(criteria: ScreeningCriteria): string {
    return JSON.stringify(criteria);
  }

  private getScreeningFromCache(key: string): ScreeningResult[] | null {
    const cached = this.screeningCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.results;
    }
    return null;
  }

  private cacheScreeningResults(key: string, results: ScreeningResult[]): void {
    this.screeningCache.set(key, { results, timestamp: Date.now() });
  }
}

export const stockScreeningService = new StockScreeningService();
