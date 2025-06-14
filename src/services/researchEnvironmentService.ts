
// Research Environment Service - Stock screening, analysis tools, and research data
import { marketDataService, RealTimeQuote, CompanyFundamentals } from './marketDataService';
import { economicDataService } from './economicDataService';

export interface ScreeningCriteria {
  marketCap?: { min?: number; max?: number };
  peRatio?: { min?: number; max?: number };
  priceToBook?: { min?: number; max?: number };
  dividendYield?: { min?: number; max?: number };
  revenueGrowth?: { min?: number; max?: number };
  profitMargin?: { min?: number; max?: number };
  debtToEquity?: { min?: number; max?: number };
  currentRatio?: { min?: number; max?: number };
  sectors?: string[];
  exchanges?: string[];
  priceRange?: { min?: number; max?: number };
}

export interface ScreeningResult {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  score: number;
  sector: string;
  matchedCriteria: string[];
}

export interface ResearchReport {
  symbol: string;
  generatedAt: string;
  companyOverview: CompanyFundamentals;
  technicalAnalysis: TechnicalAnalysis;
  fundamentalAnalysis: FundamentalAnalysis;
  valuation: ValuationAnalysis;
  riskAssessment: RiskAssessment;
  recommendation: ResearchRecommendation;
}

export interface TechnicalAnalysis {
  trend: 'bullish' | 'bearish' | 'neutral';
  indicators: {
    rsi: number;
    macd: { signal: 'buy' | 'sell' | 'hold'; value: number };
    bollinger: { position: 'upper' | 'middle' | 'lower'; signal: string };
    sma20: number;
    sma50: number;
    sma200: number;
  };
  support: number;
  resistance: number;
  volume: { trend: 'increasing' | 'decreasing' | 'stable'; signal: string };
}

export interface FundamentalAnalysis {
  strengths: string[];
  weaknesses: string[];
  financialHealth: 'excellent' | 'good' | 'fair' | 'poor';
  growthProspects: 'high' | 'medium' | 'low';
  competitivePosition: 'strong' | 'moderate' | 'weak';
  metrics: {
    roe: number;
    roa: number;
    grossMargin: number;
    operatingMargin: number;
    profitMargin: number;
    currentRatio: number;
    quickRatio: number;
    debtToEquity: number;
  };
}

export interface ValuationAnalysis {
  intrinsicValue: number;
  currentPrice: number;
  upside: number;
  valuation: 'undervalued' | 'fairly_valued' | 'overvalued';
  methods: {
    dcf: { value: number; assumptions: string[] };
    comparables: { value: number; peers: string[] };
    assetBased: { value: number; tangibleBookValue: number };
  };
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high';
  factors: {
    market: number;
    liquidity: number;
    credit: number;
    operational: number;
    regulatory: number;
  };
  concerns: string[];
  mitigants: string[];
}

export interface ResearchRecommendation {
  rating: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  targetPrice: number;
  timeHorizon: '3M' | '6M' | '12M';
  confidence: number; // 1-10 scale
  rationale: string;
  catalysts: string[];
  risks: string[];
}

export interface MarketSentiment {
  symbol: string;
  overall: 'bullish' | 'bearish' | 'neutral';
  score: number; // -100 to +100
  sources: {
    news: number;
    social: number;
    analyst: number;
    technical: number;
  };
  trend: 'improving' | 'deteriorating' | 'stable';
  lastUpdated: string;
}

class ResearchEnvironmentService {
  private screeningCache: Map<string, { results: ScreeningResult[]; timestamp: number }> = new Map();
  private researchCache: Map<string, { report: ResearchReport; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 1800000; // 30 minutes

  // Stock Screening
  async screenStocks(criteria: ScreeningCriteria): Promise<ScreeningResult[]> {
    console.log('Research Environment: Screening stocks with criteria', criteria);

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

  // Generate comprehensive research report
  async generateResearchReport(symbol: string): Promise<ResearchReport> {
    console.log('Research Environment: Generating research report for', symbol);

    const cached = this.getResearchFromCache(symbol);
    if (cached) return cached;

    const [
      companyOverview,
      quote,
      technicalAnalysis,
      fundamentalAnalysis,
      valuation,
      riskAssessment
    ] = await Promise.all([
      marketDataService.getCompanyFundamentals(symbol),
      marketDataService.getRealTimeQuote(symbol),
      this.performTechnicalAnalysis(symbol),
      this.performFundamentalAnalysis(symbol),
      this.performValuationAnalysis(symbol),
      this.assessRisk(symbol)
    ]);

    const recommendation = this.generateRecommendation(
      quote, technicalAnalysis, fundamentalAnalysis, valuation, riskAssessment
    );

    const report: ResearchReport = {
      symbol,
      generatedAt: new Date().toISOString(),
      companyOverview,
      technicalAnalysis,
      fundamentalAnalysis,
      valuation,
      riskAssessment,
      recommendation
    };

    this.cacheResearchReport(symbol, report);
    return report;
  }

  // Market sentiment analysis
  async getMarketSentiment(symbol: string): Promise<MarketSentiment> {
    console.log('Research Environment: Analyzing market sentiment for', symbol);

    // In a real implementation, this would aggregate sentiment from various sources
    const sentiment: MarketSentiment = {
      symbol,
      overall: Math.random() > 0.5 ? 'bullish' : Math.random() > 0.25 ? 'neutral' : 'bearish',
      score: (Math.random() - 0.5) * 200, // -100 to +100
      sources: {
        news: (Math.random() - 0.5) * 100,
        social: (Math.random() - 0.5) * 100,
        analyst: (Math.random() - 0.5) * 100,
        technical: (Math.random() - 0.5) * 100
      },
      trend: Math.random() > 0.33 ? 'improving' : Math.random() > 0.5 ? 'stable' : 'deteriorating',
      lastUpdated: new Date().toISOString()
    };

    return sentiment;
  }

  // Peer comparison analysis
  async comparePeers(symbol: string): Promise<any> {
    console.log('Research Environment: Performing peer comparison for', symbol);

    const company = await marketDataService.getCompanyFundamentals(symbol);
    
    // Mock peer data based on sector
    const peers = await this.getPeerCompanies(company.sector);
    
    const comparison = {
      company: {
        symbol,
        name: company.name,
        marketCap: company.marketCap,
        peRatio: company.peRatio,
        priceToBook: company.priceToBook,
        roe: company.roe,
        profitMargin: company.profitMargin
      },
      peers: peers.map(peer => ({
        symbol: peer.symbol,
        name: peer.name,
        marketCap: peer.marketCap,
        peRatio: peer.peRatio,
        priceToBook: peer.priceToBook,
        roe: peer.roe,
        profitMargin: peer.profitMargin,
        relative: {
          marketCap: peer.marketCap / company.marketCap,
          peRatio: peer.peRatio / (company.peRatio || 1),
          priceToBook: peer.priceToBook / (company.priceToBook || 1),
          roe: peer.roe / (company.roe || 1),
          profitMargin: peer.profitMargin / (company.profitMargin || 1)
        }
      })),
      industryAverages: {
        peRatio: 18.5,
        priceToBook: 2.8,
        roe: 15.2,
        profitMargin: 12.8,
        debtToEquity: 0.6
      },
      ranking: {
        marketCap: Math.floor(Math.random() * 10) + 1,
        profitability: Math.floor(Math.random() * 10) + 1,
        growth: Math.floor(Math.random() * 10) + 1,
        valuation: Math.floor(Math.random() * 10) + 1
      }
    };

    return comparison;
  }

  // Economic impact analysis
  async analyzeEconomicImpact(symbol: string): Promise<any> {
    console.log('Research Environment: Analyzing economic impact for', symbol);

    const [
      company,
      economicIndicators
    ] = await Promise.all([
      marketDataService.getCompanyFundamentals(symbol),
      economicDataService.getFredIndicators()
    ]);

    const analysis = {
      symbol,
      exposures: {
        interestRate: this.calculateInterestRateSensitivity(company),
        inflation: this.calculateInflationSensitivity(company),
        gdpGrowth: this.calculateGDPSensitivity(company),
        currency: this.calculateCurrencySensitivity(company)
      },
      correlations: {
        sp500: 0.7 + Math.random() * 0.25,
        bonds: 0.2 + Math.random() * 0.3,
        commodities: 0.1 + Math.random() * 0.4,
        dollar: (Math.random() - 0.5) * 0.8
      },
      scenarios: {
        recession: { impact: -15 - Math.random() * 20, probability: 0.2 },
        inflation: { impact: -5 - Math.random() * 15, probability: 0.3 },
        growth: { impact: 10 + Math.random() * 20, probability: 0.4 }
      },
      recommendations: [
        'Monitor Federal Reserve policy changes',
        'Watch for inflation trends in company costs',
        'Consider hedging currency exposure'
      ]
    };

    return analysis;
  }

  // Private helper methods
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

  private async performTechnicalAnalysis(symbol: string): Promise<TechnicalAnalysis> {
    // Mock technical analysis
    const rsi = 30 + Math.random() * 40; // 30-70 range
    
    return {
      trend: rsi > 50 ? 'bullish' : rsi < 40 ? 'bearish' : 'neutral',
      indicators: {
        rsi,
        macd: {
          signal: rsi > 55 ? 'buy' : rsi < 45 ? 'sell' : 'hold',
          value: (Math.random() - 0.5) * 2
        },
        bollinger: {
          position: Math.random() > 0.66 ? 'upper' : Math.random() > 0.33 ? 'middle' : 'lower',
          signal: 'Near middle band, watch for breakout'
        },
        sma20: 100 + Math.random() * 50,
        sma50: 95 + Math.random() * 55,
        sma200: 90 + Math.random() * 60
      },
      support: 90 + Math.random() * 20,
      resistance: 120 + Math.random() * 30,
      volume: {
        trend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
        signal: 'Volume confirms price movement'
      }
    };
  }

  private async performFundamentalAnalysis(symbol: string): Promise<FundamentalAnalysis> {
    const fundamentals = await marketDataService.getCompanyFundamentals(symbol);
    
    return {
      strengths: [
        'Strong brand recognition',
        'Solid financial position',
        'Growing market share',
        'Innovative product pipeline'
      ],
      weaknesses: [
        'High competition',
        'Regulatory challenges',
        'Currency exposure'
      ],
      financialHealth: fundamentals.currentRatio > 2 ? 'excellent' : 
                      fundamentals.currentRatio > 1.5 ? 'good' : 
                      fundamentals.currentRatio > 1 ? 'fair' : 'poor',
      growthProspects: fundamentals.revenueGrowth > 15 ? 'high' : 
                      fundamentals.revenueGrowth > 5 ? 'medium' : 'low',
      competitivePosition: fundamentals.profitMargin > 15 ? 'strong' : 
                          fundamentals.profitMargin > 8 ? 'moderate' : 'weak',
      metrics: {
        roe: fundamentals.roe,
        roa: fundamentals.roa,
        grossMargin: fundamentals.grossMargin,
        operatingMargin: fundamentals.operatingMargin,
        profitMargin: fundamentals.profitMargin,
        currentRatio: fundamentals.currentRatio,
        quickRatio: fundamentals.quickRatio,
        debtToEquity: fundamentals.debtToEquity
      }
    };
  }

  private async performValuationAnalysis(symbol: string): Promise<ValuationAnalysis> {
    const quote = await marketDataService.getRealTimeQuote(symbol);
    const intrinsicValue = quote.price * (0.8 + Math.random() * 0.4); // ±20% variation
    
    return {
      intrinsicValue,
      currentPrice: quote.price,
      upside: ((intrinsicValue - quote.price) / quote.price) * 100,
      valuation: intrinsicValue > quote.price * 1.1 ? 'undervalued' : 
                intrinsicValue < quote.price * 0.9 ? 'overvalued' : 'fairly_valued',
      methods: {
        dcf: {
          value: intrinsicValue * (0.95 + Math.random() * 0.1),
          assumptions: ['10% discount rate', '3% terminal growth', '5-year projection']
        },
        comparables: {
          value: intrinsicValue * (0.9 + Math.random() * 0.2),
          peers: ['AAPL', 'MSFT', 'GOOGL']
        },
        assetBased: {
          value: intrinsicValue * (0.7 + Math.random() * 0.3),
          tangibleBookValue: quote.price * 0.6
        }
      }
    };
  }

  private async assessRisk(symbol: string): Promise<RiskAssessment> {
    return {
      overallRisk: Math.random() > 0.66 ? 'low' : Math.random() > 0.33 ? 'medium' : 'high',
      factors: {
        market: Math.random() * 10,
        liquidity: Math.random() * 10,
        credit: Math.random() * 10,
        operational: Math.random() * 10,
        regulatory: Math.random() * 10
      },
      concerns: [
        'Market volatility',
        'Competitive pressure',
        'Regulatory changes',
        'Economic slowdown'
      ],
      mitigants: [
        'Diversified revenue streams',
        'Strong balance sheet',
        'Experienced management',
        'Market leadership'
      ]
    };
  }

  private generateRecommendation(
    quote: any,
    technical: TechnicalAnalysis,
    fundamental: FundamentalAnalysis,
    valuation: ValuationAnalysis,
    risk: RiskAssessment
  ): ResearchRecommendation {
    
    let score = 0;
    
    // Technical score
    if (technical.trend === 'bullish') score += 2;
    else if (technical.trend === 'bearish') score -= 2;
    
    // Fundamental score
    if (fundamental.financialHealth === 'excellent') score += 2;
    else if (fundamental.financialHealth === 'poor') score -= 2;
    
    // Valuation score
    if (valuation.valuation === 'undervalued') score += 2;
    else if (valuation.valuation === 'overvalued') score -= 2;
    
    // Risk score
    if (risk.overallRisk === 'low') score += 1;
    else if (risk.overallRisk === 'high') score -= 1;
    
    const rating = score >= 4 ? 'strong_buy' :
                  score >= 2 ? 'buy' :
                  score >= -1 ? 'hold' :
                  score >= -3 ? 'sell' : 'strong_sell';
    
    return {
      rating,
      targetPrice: valuation.intrinsicValue,
      timeHorizon: '12M',
      confidence: Math.min(10, Math.max(1, 5 + score)),
      rationale: `Based on comprehensive analysis considering technical trends, fundamental strength, valuation metrics, and risk factors.`,
      catalysts: [
        'Earnings beat expectations',
        'New product launches',
        'Market share expansion',
        'Cost optimization initiatives'
      ],
      risks: [
        'Economic downturn',
        'Increased competition',
        'Regulatory changes',
        'Market volatility'
      ]
    };
  }

  private async getPeerCompanies(sector: string): Promise<any[]> {
    // Mock peer companies based on sector
    const peers = {
      'Technology': ['AAPL', 'MSFT', 'GOOGL'],
      'Healthcare': ['JNJ', 'PFE', 'UNH'],
      'Finance': ['JPM', 'BAC', 'WFC']
    };
    
    const sectorPeers = peers[sector as keyof typeof peers] || ['SPY', 'QQQ', 'IWM'];
    
    return Promise.all(
      sectorPeers.map(symbol => marketDataService.getCompanyFundamentals(symbol))
    );
  }

  private calculateInterestRateSensitivity(company: any): number {
    // Mock calculation based on company characteristics
    return company.debtToEquity * -0.5 + Math.random() * 0.2;
  }

  private calculateInflationSensitivity(company: any): number {
    return company.profitMargin * 0.3 + Math.random() * 0.3;
  }

  private calculateGDPSensitivity(company: any): number {
    return 0.8 + Math.random() * 0.4;
  }

  private calculateCurrencySensitivity(company: any): number {
    return (Math.random() - 0.5) * 0.6;
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

  private getResearchFromCache(symbol: string): ResearchReport | null {
    const cached = this.researchCache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.report;
    }
    return null;
  }

  private cacheResearchReport(symbol: string, report: ResearchReport): void {
    this.researchCache.set(symbol, { report, timestamp: Date.now() });
  }
}

export const researchEnvironmentService = new ResearchEnvironmentService();
