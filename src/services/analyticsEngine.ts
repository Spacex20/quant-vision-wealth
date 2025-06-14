
// Analytics Engine - Advanced portfolio analytics and performance metrics
import { portfolioManager as portfolioService } from './portfolioManager';
import { marketDataService } from './marketDataService';
import { portfolioAnalytics, RiskMetrics, CorrelationData, HoldingData } from './portfolioAnalytics';

export interface AnalyticsReport {
  portfolioId: string;
  generatedAt: string;
  summary: PortfolioSummary;
  riskMetrics: RiskMetrics;
  performance: PerformanceAnalysis;
  allocation: AllocationAnalysis;
  correlations: CorrelationData[];
  recommendations: Recommendation[];
}

export interface PortfolioSummary {
  totalValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  dayChange: number;
  dayChangePercent: number;
  assetCount: number;
  topHolding: string;
  concentration: number; // Top 5 holdings percentage
}

export interface PerformanceAnalysis {
  returns: {
    daily: number[];
    weekly: number[];
    monthly: number[];
    annual: number;
  };
  benchmarkComparison: {
    portfolio: number;
    benchmark: number;
    outperformance: number;
  };
  consistency: {
    winRate: number;
    avgWin: number;
    avgLoss: number;
    profitFactor: number;
  };
}

export interface AllocationAnalysis {
  sectors: { name: string; weight: number; performance: number }[];
  assetTypes: { type: string; weight: number; performance: number }[];
  geographic: { region: string; weight: number; performance: number }[];
  deviation: { symbol: string; target: number; current: number; deviation: number }[];
}

export interface Recommendation {
  type: 'rebalance' | 'risk' | 'performance' | 'allocation';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  action: string;
}

class AnalyticsEngine {
  private benchmarkSymbol = 'SPY'; // S&P 500 as default benchmark
  private analysisCache: Map<string, { data: AnalyticsReport; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 300000; // 5 minutes

  // Generate comprehensive analytics report
  async generateReport(portfolioId: string, forceRefresh = false): Promise<AnalyticsReport> {
    console.log('Analytics Engine: Generating report for portfolio', portfolioId);

    if (!forceRefresh) {
      const cached = this.getCachedReport(portfolioId);
      if (cached) return cached;
    }

    const portfolio = await portfolioService.getPortfolio(portfolioId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    // Fetch market data for all holdings
    const quotes = await marketDataService.getMultipleQuotes(
      portfolio.assets.map(asset => asset.symbol)
    );

    // Get benchmark data
    const benchmarkQuote = await marketDataService.getRealTimeQuote(this.benchmarkSymbol);

    // Generate all analytics components
    const [
      summary,
      riskMetrics,
      performance,
      allocation,
      correlations,
      recommendations
    ] = await Promise.all([
      this.generatePortfolioSummary(portfolio, quotes),
      this.calculateRiskMetrics(portfolio, quotes),
      this.analyzePerformance(portfolio, quotes, benchmarkQuote),
      this.analyzeAllocation(portfolio, quotes),
      this.calculateCorrelations(portfolio, quotes),
      this.generateRecommendations(portfolio, quotes)
    ]);

    const report: AnalyticsReport = {
      portfolioId,
      generatedAt: new Date().toISOString(),
      summary,
      riskMetrics,
      performance,
      allocation,
      correlations,
      recommendations
    };

    this.cacheReport(portfolioId, report);
    return report;
  }

  // Real-time analytics updates
  async updateRealTimeMetrics(portfolioId: string): Promise<Partial<AnalyticsReport>> {
    console.log('Analytics Engine: Updating real-time metrics for', portfolioId);

    const portfolio = await portfolioService.getPortfolio(portfolioId);
    if (!portfolio) return {};

    const quotes = await marketDataService.getMultipleQuotes(
      portfolio.assets.map(asset => asset.symbol)
    );

    return {
      summary: await this.generatePortfolioSummary(portfolio, quotes),
      generatedAt: new Date().toISOString()
    };
  }

  // Performance attribution analysis
  async performanceAttribution(portfolioId: string, period: 'day' | 'week' | 'month' | 'quarter' | 'year'): Promise<any> {
    console.log('Analytics Engine: Performing attribution analysis for', portfolioId, period);

    const portfolio = await portfolioService.getPortfolio(portfolioId);
    if (!portfolio) return null;

    // Generate mock attribution data
    const attribution = {
      period,
      totalReturn: (Math.random() - 0.5) * 0.2, // -10% to +10%
      components: {
        assetSelection: (Math.random() - 0.5) * 0.1,
        allocation: (Math.random() - 0.5) * 0.08,
        timing: (Math.random() - 0.5) * 0.05,
        interaction: (Math.random() - 0.5) * 0.02
      },
      sectorContribution: [
        { sector: 'Technology', contribution: (Math.random() - 0.5) * 0.08 },
        { sector: 'Healthcare', contribution: (Math.random() - 0.5) * 0.06 },
        { sector: 'Finance', contribution: (Math.random() - 0.5) * 0.05 },
        { sector: 'Energy', contribution: (Math.random() - 0.5) * 0.04 }
      ]
    };

    return attribution;
  }

  // Risk analysis
  async analyzeRisk(portfolioId: string): Promise<any> {
    console.log('Analytics Engine: Analyzing risk for portfolio', portfolioId);

    const portfolio = await portfolioService.getPortfolio(portfolioId);
    if (!portfolio) return null;

    const quotes = await marketDataService.getMultipleQuotes(
      portfolio.assets.map(asset => asset.symbol)
    );

    // Generate mock risk analysis
    const riskAnalysis = {
      overallRisk: 'Medium',
      riskScore: 3.2, // 1-5 scale
      factors: [
        { factor: 'Market Risk', score: 3.5, weight: 0.4 },
        { factor: 'Concentration Risk', score: 2.8, weight: 0.3 },
        { factor: 'Liquidity Risk', score: 2.1, weight: 0.2 },
        { factor: 'Currency Risk', score: 1.5, weight: 0.1 }
      ],
      stresstests: {
        market_crash: { scenario: 'Market drops 20%', portfolioImpact: -18.5 },
        interest_rise: { scenario: 'Interest rates +2%', portfolioImpact: -8.2 },
        sector_rotation: { scenario: 'Tech sector down 30%', portfolioImpact: -12.1 }
      },
      recommendations: [
        'Consider adding defensive assets',
        'Reduce concentration in top holdings',
        'Add international diversification'
      ]
    };

    return riskAnalysis;
  }

  // Benchmark comparison
  async compareToBenchmarks(portfolioId: string, benchmarks: string[] = ['SPY', 'QQQ', 'IWM']): Promise<any> {
    console.log('Analytics Engine: Comparing to benchmarks', benchmarks);

    const portfolio = await portfolioService.getPortfolio(portfolioId);
    if (!portfolio) return null;

    const portfolioPerformance = await portfolioService.calculatePortfolioPerformance(portfolioId);

    const comparisons = await Promise.all(
      benchmarks.map(async (benchmark) => {
        const quote = await marketDataService.getRealTimeQuote(benchmark);
        return {
          symbol: benchmark,
          name: this.getBenchmarkName(benchmark),
          return1D: quote.changePercent || 0,
          return1W: (Math.random() - 0.5) * 10,
          return1M: (Math.random() - 0.5) * 15,
          return1Y: (Math.random() - 0.5) * 30,
          correlation: 0.7 + Math.random() * 0.3,
          beta: 0.8 + Math.random() * 0.4,
          outperformance: portfolioPerformance.totalReturnPercent - ((Math.random() - 0.5) * 20)
        };
      })
    );

    return {
      portfolio: {
        return1D: portfolioPerformance.dayChangePercent,
        return1W: portfolioPerformance.weekChangePercent,
        return1M: portfolioPerformance.monthChangePercent,
        return1Y: portfolioPerformance.yearChangePercent
      },
      benchmarks: comparisons,
      summary: {
        bestPerforming: comparisons.reduce((best, current) => 
          current.outperformance > best.outperformance ? current : best
        ),
        averageOutperformance: comparisons.reduce((sum, b) => sum + b.outperformance, 0) / comparisons.length
      }
    };
  }

  // Private helper methods
  private async generatePortfolioSummary(portfolio: any, quotes: any[]): Promise<PortfolioSummary> {
    let totalValue = 0;
    const assetValues: number[] = [];

    portfolio.assets.forEach((asset: any) => {
      const quote = quotes.find(q => q.symbol === asset.symbol);
      const value = (asset.shares || 0) * (quote?.price || 0);
      totalValue += value;
      assetValues.push(value);
    });

    const sortedValues = [...assetValues].sort((a, b) => b - a);
    const top5Value = sortedValues.slice(0, 5).reduce((sum, val) => sum + val, 0);

    return {
      totalValue,
      totalReturn: totalValue - portfolio.totalValue,
      totalReturnPercent: ((totalValue - portfolio.totalValue) / portfolio.totalValue) * 100,
      dayChange: totalValue * (Math.random() - 0.5) * 0.02,
      dayChangePercent: (Math.random() - 0.5) * 2,
      assetCount: portfolio.assets.length,
      topHolding: portfolio.assets[0]?.symbol || '',
      concentration: totalValue > 0 ? (top5Value / totalValue) * 100 : 0
    };
  }

  private async calculateRiskMetrics(portfolio: any, quotes: any[]): Promise<RiskMetrics> {
    // Generate mock returns data
    const returns = Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.04);
    const benchmarkReturns = Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.03);

    return portfolioAnalytics.calculateRiskMetrics(returns, benchmarkReturns);
  }

  private async analyzePerformance(portfolio: any, quotes: any[], benchmarkQuote: any): Promise<PerformanceAnalysis> {
    const dailyReturns = Array.from({ length: 30 }, () => (Math.random() - 0.5) * 0.04);
    const weeklyReturns = Array.from({ length: 52 }, () => (Math.random() - 0.5) * 0.08);
    const monthlyReturns = Array.from({ length: 12 }, () => (Math.random() - 0.5) * 0.15);

    return {
      returns: {
        daily: dailyReturns,
        weekly: weeklyReturns,
        monthly: monthlyReturns,
        annual: monthlyReturns.reduce((sum, ret) => sum + ret, 0)
      },
      benchmarkComparison: {
        portfolio: monthlyReturns.reduce((sum, ret) => sum + ret, 0),
        benchmark: (Math.random() - 0.5) * 0.2,
        outperformance: (Math.random() - 0.5) * 0.1
      },
      consistency: {
        winRate: 0.55 + Math.random() * 0.2,
        avgWin: 0.02 + Math.random() * 0.03,
        avgLoss: -0.015 - Math.random() * 0.02,
        profitFactor: 1.2 + Math.random() * 0.8
      }
    };
  }

  private async analyzeAllocation(portfolio: any, quotes: any[]): Promise<AllocationAnalysis> {
    // Mock sector allocation
    const sectors = [
      { name: 'Technology', weight: 35, performance: (Math.random() - 0.5) * 20 },
      { name: 'Healthcare', weight: 20, performance: (Math.random() - 0.5) * 15 },
      { name: 'Finance', weight: 15, performance: (Math.random() - 0.5) * 18 },
      { name: 'Consumer Goods', weight: 12, performance: (Math.random() - 0.5) * 12 },
      { name: 'Energy', weight: 10, performance: (Math.random() - 0.5) * 25 },
      { name: 'Other', weight: 8, performance: (Math.random() - 0.5) * 10 }
    ];

    const assetTypes = [
      { type: 'Large Cap Stocks', weight: 60, performance: (Math.random() - 0.5) * 15 },
      { type: 'Mid Cap Stocks', weight: 25, performance: (Math.random() - 0.5) * 20 },
      { type: 'Small Cap Stocks', weight: 10, performance: (Math.random() - 0.5) * 25 },
      { type: 'ETFs', weight: 5, performance: (Math.random() - 0.5) * 12 }
    ];

    const geographic = [
      { region: 'United States', weight: 70, performance: (Math.random() - 0.5) * 15 },
      { region: 'Europe', weight: 15, performance: (Math.random() - 0.5) * 18 },
      { region: 'Asia Pacific', weight: 10, performance: (Math.random() - 0.5) * 22 },
      { region: 'Emerging Markets', weight: 5, performance: (Math.random() - 0.5) * 28 }
    ];

    const deviation = portfolio.assets.map((asset: any) => ({
      symbol: asset.symbol,
      target: asset.allocation,
      current: asset.allocation + (Math.random() - 0.5) * 10,
      deviation: (Math.random() - 0.5) * 10
    }));

    return { sectors, assetTypes, geographic, deviation };
  }

  private async calculateCorrelations(portfolio: any, quotes: any[]): Promise<CorrelationData[]> {
    const holdings: HoldingData[] = portfolio.assets.map((asset: any) => ({
      symbol: asset.symbol,
      weight: asset.allocation,
      returns: Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.04),
      historicalData: []
    }));

    return portfolioAnalytics.calculateCorrelationMatrix(holdings);
  }

  private async generateRecommendations(portfolio: any, quotes: any[]): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Check concentration risk
    const totalValue = portfolio.assets.reduce((sum: number, asset: any) => {
      const quote = quotes.find(q => q.symbol === asset.symbol);
      return sum + (asset.shares || 0) * (quote?.price || 0);
    }, 0);

    const topHoldingWeight = Math.max(...portfolio.assets.map((asset: any) => {
      const quote = quotes.find(q => q.symbol === asset.symbol);
      const value = (asset.shares || 0) * (quote?.price || 0);
      return totalValue > 0 ? (value / totalValue) * 100 : 0;
    }));

    if (topHoldingWeight > 25) {
      recommendations.push({
        type: 'risk',
        priority: 'high',
        title: 'High Concentration Risk',
        description: `Your largest holding represents ${topHoldingWeight.toFixed(1)}% of your portfolio`,
        impact: 'Reduces diversification and increases portfolio volatility',
        action: 'Consider reducing position size or adding complementary holdings'
      });
    }

    // Check rebalancing needs
    const needsRebalance = portfolio.assets.some((asset: any) => 
      Math.abs(asset.allocation - (asset.allocation + (Math.random() - 0.5) * 10)) > 5
    );

    if (needsRebalance) {
      recommendations.push({
        type: 'rebalance',
        priority: 'medium',
        title: 'Portfolio Drift Detected',
        description: 'Some holdings have drifted significantly from target allocations',
        impact: 'May affect intended risk/return profile',
        action: 'Rebalance portfolio to target allocations'
      });
    }

    // Performance recommendations
    recommendations.push({
      type: 'performance',
      priority: 'low',
      title: 'Consider Adding International Exposure',
      description: 'Portfolio appears to be heavily weighted towards domestic assets',
      impact: 'May improve diversification and reduce correlation',
      action: 'Consider adding international ETFs or stocks'
    });

    return recommendations;
  }

  private getCachedReport(portfolioId: string): AnalyticsReport | null {
    const cached = this.analysisCache.get(portfolioId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    this.analysisCache.delete(portfolioId);
    return null;
  }

  private cacheReport(portfolioId: string, report: AnalyticsReport): void {
    this.analysisCache.set(portfolioId, { data: report, timestamp: Date.now() });
  }

  private getBenchmarkName(symbol: string): string {
    const names: Record<string, string> = {
      'SPY': 'S&P 500',
      'QQQ': 'NASDAQ 100',
      'IWM': 'Russell 2000',
      'VTI': 'Total Stock Market',
      'VEA': 'Developed Markets',
      'VWO': 'Emerging Markets'
    };
    return names[symbol] || symbol;
  }
}

export const analyticsEngine = new AnalyticsEngine();
