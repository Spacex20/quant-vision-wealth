
import { marketDataService } from '../marketDataService';

export interface CoffeeCanCriteria {
  minRevenueGrowth: number; // 15%
  minROE: number; // 20%
  maxDebtToEquity: number; // 0.3
  minMarketCap: number; // 1B
  minProfitMargin: number; // 10%
  minYearsData: number; // 5
}

export interface CoffeeCanScore {
  symbol: string;
  score: number;
  revenueGrowth: number;
  roe: number;
  debtToEquity: number;
  profitMargin: number;
  marketCap: number;
  qualityScore: number;
  recommendation: 'BUY' | 'HOLD' | 'AVOID';
}

class CoffeeCanStrategy {
  private defaultCriteria: CoffeeCanCriteria = {
    minRevenueGrowth: 15,
    minROE: 20,
    maxDebtToEquity: 0.3,
    minMarketCap: 1000000000, // $1B
    minProfitMargin: 10,
    minYearsData: 5
  };

  async screenStocks(symbols: string[], criteria: Partial<CoffeeCanCriteria> = {}): Promise<CoffeeCanScore[]> {
    const finalCriteria = { ...this.defaultCriteria, ...criteria };
    const scores: CoffeeCanScore[] = [];

    console.log('Coffee Can Strategy: Screening stocks with criteria:', finalCriteria);

    for (const symbol of symbols) {
      try {
        const fundamentals = await marketDataService.getCompanyFundamentals(symbol);
        const score = this.calculateCoffeeCanScore(fundamentals, finalCriteria);
        scores.push(score);
      } catch (error) {
        console.error(`Error screening ${symbol}:`, error);
      }
    }

    return scores.sort((a, b) => b.score - a.score);
  }

  private calculateCoffeeCanScore(fundamentals: any, criteria: CoffeeCanCriteria): CoffeeCanScore {
    let score = 0;
    let qualityScore = 0;

    // Revenue Growth Score (0-25 points)
    const revenueGrowthScore = Math.min(25, (fundamentals.revenueGrowth5Y / criteria.minRevenueGrowth) * 25);
    score += revenueGrowthScore;

    // ROE Score (0-25 points)
    const roeScore = Math.min(25, (fundamentals.roe / criteria.minROE) * 25);
    score += roeScore;

    // Debt to Equity Score (0-20 points) - lower is better
    const debtScore = fundamentals.debtToEquity <= criteria.maxDebtToEquity ? 20 : 
                      Math.max(0, 20 - ((fundamentals.debtToEquity - criteria.maxDebtToEquity) * 40));
    score += debtScore;

    // Profit Margin Score (0-15 points)
    const marginScore = Math.min(15, (fundamentals.profitMargin / criteria.minProfitMargin) * 15);
    score += marginScore;

    // Market Cap Requirement (0-15 points)
    const marketCapScore = fundamentals.marketCap >= criteria.minMarketCap ? 15 : 0;
    score += marketCapScore;

    // Quality factors
    qualityScore = (roeScore + marginScore + debtScore) / 3;

    const recommendation = score >= 75 ? 'BUY' : score >= 50 ? 'HOLD' : 'AVOID';

    return {
      symbol: fundamentals.symbol,
      score,
      revenueGrowth: fundamentals.revenueGrowth5Y,
      roe: fundamentals.roe,
      debtToEquity: fundamentals.debtToEquity,
      profitMargin: fundamentals.profitMargin,
      marketCap: fundamentals.marketCap,
      qualityScore,
      recommendation
    };
  }

  generatePortfolioAllocation(scores: CoffeeCanScore[], portfolioValue: number): any[] {
    // Select top 15-20 stocks for Coffee Can portfolio
    const selectedStocks = scores
      .filter(stock => stock.recommendation === 'BUY')
      .slice(0, 20);

    if (selectedStocks.length === 0) return [];

    // Equal weight allocation
    const equalWeight = 100 / selectedStocks.length;

    return selectedStocks.map(stock => ({
      symbol: stock.symbol,
      allocation: equalWeight,
      amount: (portfolioValue * equalWeight) / 100,
      score: stock.score,
      strategy: 'Coffee Can'
    }));
  }
}

export const coffeeCanStrategy = new CoffeeCanStrategy();
