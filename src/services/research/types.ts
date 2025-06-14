
// Research Environment Types - All interfaces and type definitions
import { CompanyFundamentals } from '../marketDataService';

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
