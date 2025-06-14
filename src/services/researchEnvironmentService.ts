
// Research Environment Service - Main orchestrator for research functionality
import { marketDataService } from './marketDataService';
import { economicDataService } from './economicDataService';
import { stockScreeningService } from './research/stockScreeningService';
import { researchReportService } from './research/researchReportService';
import { fundamentalAnalysisService } from './research/fundamentalAnalysisService';
import { riskAssessmentService } from './research/riskAssessmentService';
import { 
  ScreeningCriteria, 
  ScreeningResult, 
  ResearchReport, 
  MarketSentiment 
} from './research/types';

class ResearchEnvironmentService {
  // Stock Screening
  async screenStocks(criteria: ScreeningCriteria): Promise<ScreeningResult[]> {
    return stockScreeningService.screenStocks(criteria);
  }

  // Generate comprehensive research report
  async generateResearchReport(symbol: string): Promise<ResearchReport> {
    return researchReportService.generateResearchReport(symbol);
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
    
    // Get peer companies based on sector
    const peers = await fundamentalAnalysisService.getPeerCompanies(company.sector);
    
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
        interestRate: riskAssessmentService.calculateInterestRateSensitivity(company),
        inflation: riskAssessmentService.calculateInflationSensitivity(company),
        gdpGrowth: riskAssessmentService.calculateGDPSensitivity(company),
        currency: riskAssessmentService.calculateCurrencySensitivity(company)
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
}

export const researchEnvironmentService = new ResearchEnvironmentService();
