
// Fundamental Analysis Service - Handles company fundamental analysis
import { marketDataService } from '../marketDataService';
import { FundamentalAnalysis } from './types';

export class FundamentalAnalysisService {
  async performFundamentalAnalysis(symbol: string): Promise<FundamentalAnalysis> {
    console.log('Fundamental Analysis: Analyzing', symbol);
    
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

  async getPeerCompanies(sector: string): Promise<any[]> {
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
}

export const fundamentalAnalysisService = new FundamentalAnalysisService();
