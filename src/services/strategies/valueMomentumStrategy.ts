
import { marketDataService } from '../marketDataService';

export interface ValueMetrics {
  peRatio: number;
  pbRatio: number;
  evEbitda: number;
  fcfYield: number;
  dividendYield: number;
}

export interface MomentumMetrics {
  momentum12_1: number; // 12-month return excluding last month
  momentum3M: number;   // 3-month momentum
  price50DMA: number;   // Price relative to 50-day MA
  price200DMA: number;  // Price relative to 200-day MA
  earningsMomentum: number;
}

export interface ValueMomentumScore {
  symbol: string;
  valueScore: number;
  momentumScore: number;
  combinedScore: number;
  valueMetrics: ValueMetrics;
  momentumMetrics: MomentumMetrics;
  recommendation: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL';
  rank: number;
}

class ValueMomentumStrategy {
  async analyzeStocks(symbols: string[], valueWeight: number = 0.5): Promise<ValueMomentumScore[]> {
    const scores: ValueMomentumScore[] = [];
    
    console.log('Value-Momentum Strategy: Analyzing stocks with value weight:', valueWeight);

    for (const symbol of symbols) {
      try {
        const fundamentals = await marketDataService.getCompanyFundamentals(symbol);
        const quote = await marketDataService.getRealTimeQuote(symbol);
        
        const valueMetrics = this.calculateValueMetrics(fundamentals);
        const momentumMetrics = await this.calculateMomentumMetrics(symbol, quote);
        
        const valueScore = this.scoreValue(valueMetrics);
        const momentumScore = this.scoreMomentum(momentumMetrics);
        const combinedScore = (valueScore * valueWeight) + (momentumScore * (1 - valueWeight));
        
        scores.push({
          symbol,
          valueScore,
          momentumScore,
          combinedScore,
          valueMetrics,
          momentumMetrics,
          recommendation: this.getRecommendation(combinedScore),
          rank: 0 // Will be set after sorting
        });
      } catch (error) {
        console.error(`Error analyzing ${symbol}:`, error);
      }
    }

    // Sort by combined score and assign ranks
    scores.sort((a, b) => b.combinedScore - a.combinedScore);
    scores.forEach((score, index) => {
      score.rank = index + 1;
    });

    return scores;
  }

  private calculateValueMetrics(fundamentals: any): ValueMetrics {
    return {
      peRatio: fundamentals.peRatio || 0,
      pbRatio: fundamentals.priceToBook || 0,
      evEbitda: fundamentals.evEbitda || 0,
      fcfYield: fundamentals.fcfYield || 0,
      dividendYield: fundamentals.dividendYield || 0
    };
  }

  private async calculateMomentumMetrics(symbol: string, quote: any): Promise<MomentumMetrics> {
    // In a real implementation, this would fetch historical price data
    // For now, we'll use mock data based on current price
    const currentPrice = quote.price;
    
    return {
      momentum12_1: (Math.random() - 0.5) * 50, // -25% to +25%
      momentum3M: (Math.random() - 0.5) * 20,   // -10% to +10%
      price50DMA: ((currentPrice / (currentPrice * (0.95 + Math.random() * 0.1))) - 1) * 100,
      price200DMA: ((currentPrice / (currentPrice * (0.9 + Math.random() * 0.2))) - 1) * 100,
      earningsMomentum: (Math.random() - 0.5) * 30 // -15% to +15%
    };
  }

  private scoreValue(metrics: ValueMetrics): number {
    let score = 0;

    // P/E Score (0-20 points) - lower is better
    if (metrics.peRatio > 0) {
      score += Math.max(0, 20 - (metrics.peRatio / 25) * 20);
    }

    // P/B Score (0-20 points) - lower is better
    if (metrics.pbRatio > 0) {
      score += Math.max(0, 20 - (metrics.pbRatio / 3) * 20);
    }

    // EV/EBITDA Score (0-20 points) - lower is better
    if (metrics.evEbitda > 0) {
      score += Math.max(0, 20 - (metrics.evEbitda / 15) * 20);
    }

    // FCF Yield Score (0-20 points) - higher is better
    score += Math.min(20, (metrics.fcfYield / 10) * 20);

    // Dividend Yield Score (0-20 points) - moderate is better
    if (metrics.dividendYield > 0 && metrics.dividendYield <= 6) {
      score += Math.min(20, (metrics.dividendYield / 3) * 20);
    }

    return Math.min(100, score);
  }

  private scoreMomentum(metrics: MomentumMetrics): number {
    let score = 0;

    // 12-1 Month Momentum (0-30 points)
    score += Math.max(0, Math.min(30, (metrics.momentum12_1 + 25) * 0.6));

    // 3-Month Momentum (0-20 points)
    score += Math.max(0, Math.min(20, (metrics.momentum3M + 10) * 1.0));

    // 50-Day MA Score (0-20 points)
    score += Math.max(0, Math.min(20, (metrics.price50DMA + 10) * 1.0));

    // 200-Day MA Score (0-20 points)
    score += Math.max(0, Math.min(20, (metrics.price200DMA + 10) * 1.0));

    // Earnings Momentum (0-10 points)
    score += Math.max(0, Math.min(10, (metrics.earningsMomentum + 15) * 0.33));

    return Math.min(100, score);
  }

  private getRecommendation(score: number): 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' {
    if (score >= 80) return 'STRONG_BUY';
    if (score >= 65) return 'BUY';
    if (score >= 40) return 'HOLD';
    return 'SELL';
  }

  generatePortfolioAllocation(scores: ValueMomentumScore[], portfolioValue: number, topN: number = 20): any[] {
    // Select top quintile stocks
    const selectedStocks = scores
      .filter(stock => stock.recommendation === 'STRONG_BUY' || stock.recommendation === 'BUY')
      .slice(0, topN);

    if (selectedStocks.length === 0) return [];

    // Weight by score (higher scores get larger allocations)
    const totalScore = selectedStocks.reduce((sum, stock) => sum + stock.combinedScore, 0);

    return selectedStocks.map(stock => {
      const allocation = (stock.combinedScore / totalScore) * 100;
      return {
        symbol: stock.symbol,
        allocation,
        amount: (portfolioValue * allocation) / 100,
        score: stock.combinedScore,
        rank: stock.rank,
        strategy: 'Value-Momentum'
      };
    });
  }

  getRebalancingSchedule(): string {
    return 'Monthly rebalancing recommended for Value-Momentum strategy';
  }
}

export const valueMomentumStrategy = new ValueMomentumStrategy();
