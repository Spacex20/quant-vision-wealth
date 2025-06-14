
// Research Report Service - Handles comprehensive research report generation
import { marketDataService } from '../marketDataService';
import { technicalAnalysisService } from './technicalAnalysisService';
import { fundamentalAnalysisService } from './fundamentalAnalysisService';
import { valuationAnalysisService } from './valuationAnalysisService';
import { riskAssessmentService } from './riskAssessmentService';
import { ResearchReport, ResearchRecommendation, TechnicalAnalysis, FundamentalAnalysis, ValuationAnalysis, RiskAssessment } from './types';

export class ResearchReportService {
  private researchCache: Map<string, { report: ResearchReport; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 1800000; // 30 minutes

  async generateResearchReport(symbol: string): Promise<ResearchReport> {
    console.log('Research Report: Generating research report for', symbol);

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
      technicalAnalysisService.performTechnicalAnalysis(symbol),
      fundamentalAnalysisService.performFundamentalAnalysis(symbol),
      valuationAnalysisService.performValuationAnalysis(symbol),
      riskAssessmentService.assessRisk(symbol)
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

export const researchReportService = new ResearchReportService();
