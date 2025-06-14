
import {
  Shield,
  Zap,
  Gem,
  Anchor,
  Crown,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Layers,
} from 'lucide-react';

export interface Strategy {
  id: string;
  name: string;
  description: string;
  objective: string;
  icon: React.ElementType;
  allocation: { asset: string; weight: number; etf?: string }[];
  riskProfile: 'Low' | 'Medium' | 'High';
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  bestYear: { year: number; return: number };
  worstYear: { year: number; return: number };
  sectorExposure: { sector: string; weight: number }[];
  assetExposure: { asset: string; weight: number }[];
  implementationNotes: string;
  keyMetrics?: any;
  chartData: { date: string; value: number; drawdown: number }[];
}

const generateChartData = (base = 100, years = 10, volatility = 0.1, trend = 0.0005) => {
  const data = [];
  let value = base;
  let peak = base;
  for (let i = 0; i < years * 12; i++) {
    const date = new Date(2015 + Math.floor(i / 12), i % 12, 1);
    const randomFactor = (Math.random() - 0.5) * 2;
    value *= 1 + trend + randomFactor * volatility;
    if (value > peak) peak = value;
    const drawdown = (peak - value) / peak;
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(2)),
      drawdown: parseFloat(drawdown.toFixed(4)),
    });
  }
  return data;
};

export const libraryStrategies: Strategy[] = [
  {
    id: 'risk-parity',
    name: 'Risk Parity Portfolio',
    icon: Shield,
    description: 'Aims to equalize risk contribution across uncorrelated assets for a balanced, all-weather portfolio.',
    objective: 'Equalize risk contribution across uncorrelated assets.',
    allocation: [
      { asset: 'Global Equities', weight: 30, etf: 'VT' },
      { asset: 'Long-Term Treasuries', weight: 30, etf: 'TLT' },
      { asset: 'Commodities', weight: 20, etf: 'DBC, GLD' },
      { asset: 'TIPS/Inflation Bonds', weight: 20, etf: 'TIP' },
    ],
    riskProfile: 'Medium',
    expectedReturn: 7.5,
    volatility: 11.2,
    sharpeRatio: 0.67,
    bestYear: { year: 2019, return: 18.2 },
    worstYear: { year: 2022, return: -14.5 },
    sectorExposure: [
      { sector: 'Various (Global)', weight: 30 },
      { sector: 'Government Debt', weight: 50 },
      { sector: 'Commodities', weight: 20 },
    ],
    assetExposure: [
      { asset: 'Equity', weight: 30 },
      { asset: 'Bonds', weight: 50 },
      { asset: 'Commodities', weight: 20 },
    ],
    implementationNotes: 'Use leveraged ETFs (e.g., UPRO/TMF) to balance volatility. Quarterly rebalancing using volatility-adjusted weights is key. Maintain portfolio volatility at 10-12% annualized.',
    chartData: generateChartData(100, 10, 0.03, 0.0006),
  },
  {
    id: 'momentum-factor',
    name: 'Momentum Factor Portfolio',
    icon: Zap,
    description: 'Captures trending assets across various time horizons using a dual momentum strategy.',
    objective: 'Capture trending assets across different time horizons.',
    allocation: [
      { asset: 'Sector ETFs / Crypto', weight: 40, etf: 'XLE, XLF, BTC-F' },
      { asset: 'Country ETFs / Commodities', weight: 30, etf: 'EEM, DBC' },
      { asset: 'Factor ETFs', weight: 30, etf: 'MTUM' },
    ],
    riskProfile: 'High',
    expectedReturn: 12.5,
    volatility: 18.7,
    sharpeRatio: 0.67,
    bestYear: { year: 2021, return: 25.4 },
    worstYear: { year: 2018, return: -12.1 },
    sectorExposure: [
      { sector: 'Varies by month', weight: 100 },
    ],
    assetExposure: [
      { asset: 'Equity', weight: 80 },
      { asset: 'Alternatives', weight: 20 },
    ],
    implementationNotes: 'Monthly rotation into top 3 performing sectors. Exit assets below 200-day MA. A 15% trailing stop-loss is recommended on all positions.',
    chartData: generateChartData(100, 10, 0.06, 0.0010),
  },
  {
    id: 'value-factor',
    name: 'Value Factor Portfolio',
    icon: Gem,
    description: 'Exploits valuation disparities by screening for fundamentally undervalued companies.',
    objective: 'Exploit valuation disparities in the market.',
    allocation: [
      { asset: 'US Value', weight: 40, etf: 'VTV, IWD' },
      { asset: 'Europe Value', weight: 30, etf: 'EFV, FNDE' },
      { asset: 'Emerging Markets Value', weight: 20, etf: 'DEM, AVES' },
      { asset: 'Special Situations', weight: 10, etf: 'REITs, MLPs' },
    ],
    riskProfile: 'High',
    expectedReturn: 9.8,
    volatility: 14.3,
    sharpeRatio: 0.68,
    bestYear: { year: 2016, return: 22.1 },
    worstYear: { year: 2022, return: -15.9 },
    sectorExposure: [
        { sector: 'Financials', weight: 25 },
        { sector: 'Energy', weight: 15 },
        { sector: 'Industrials', weight: 15 },
        { sector: 'Real Estate', weight: 10 },
        { sector: 'Other', weight: 35 },
    ],
    assetExposure: [
      { asset: 'Equity', weight: 90 },
      { asset: 'Real Estate', weight: 10 },
    ],
    implementationNotes: 'Screens for P/B < 1.2, EV/EBITDA < 8, and high yields. Annual rebalancing is standard, with event-driven adjustments for mergers or spinoffs.',
    chartData: generateChartData(100, 10, 0.05, 0.0008),
  },
  {
    id: 'low-volatility',
    name: 'Low Volatility Portfolio',
    icon: Anchor,
    description: 'Focuses on capital preservation with equity participation through minimum variance assets and hedging.',
    objective: 'Capital preservation with equity market participation.',
    allocation: [
      { asset: 'US Low Volatility', weight: 50, etf: 'SPLV' },
      { asset: 'EM Low Volatility', weight: 30, etf: 'EEMV' },
      { asset: 'International Low Vol', weight: 20, etf: 'IDLV' },
    ],
    riskProfile: 'Low',
    expectedReturn: 6.2,
    volatility: 8.9,
    sharpeRatio: 0.70,
    bestYear: { year: 2017, return: 15.3 },
    worstYear: { year: 2022, return: -7.8 },
    sectorExposure: [
        { sector: 'Utilities', weight: 20 },
        { sector: 'Consumer Staples', weight: 20 },
        { sector: 'Healthcare', weight: 18 },
        { sector: 'Other', weight: 42 },
    ],
    assetExposure: [
        { asset: 'Equity', weight: 100 },
    ],
    implementationNotes: 'Global minimum variance approach. Increase equity exposure when VIX > 25. Rotate to defensive sectors when yield curve inverts. A 5% max drawdown circuit breaker is advised.',
    chartData: generateChartData(100, 10, 0.02, 0.0005),
  },
  {
    id: 'quality-growth',
    name: 'Quality Growth + Dividend Aristocrats',
    icon: Crown,
    description: 'Combines high-quality growth stocks with stable, dividend-paying companies for compounding and income.',
    objective: 'Compound growth with income stability.',
    allocation: [
      { asset: 'Tech Growth', weight: 30, etf: 'MSFT, AAPL' },
      { asset: 'Dividend Aristocrats', weight: 40, etf: 'NOBL' },
      { asset: 'Healthcare Stewards', weight: 20, etf: 'JNJ, UNH' },
      { asset: 'Cash Secured Puts', weight: 10 },
    ],
    riskProfile: 'Medium',
    expectedReturn: 10.5,
    volatility: 13.5,
    sharpeRatio: 0.78,
    bestYear: { year: 2020, return: 28.9 },
    worstYear: { year: 2022, return: -11.5 },
    sectorExposure: [
        { sector: 'Technology', weight: 30 },
        { sector: 'Consumer Staples', weight: 20 },
        { sector: 'Industrials', weight: 20 },
        { sector: 'Healthcare', weight: 20 },
        { sector: 'Other', weight: 10 },
    ],
    assetExposure: [
        { asset: 'Equity', weight: 90 },
        { asset: 'Options/Cash', weight: 10 },
    ],
    implementationNotes: 'Selects for ROE > 15% and 50+ years of dividend increases. Writing 30-delta puts on core positions can enhance income. Reinvest premiums into highest-conviction names.',
    chartData: generateChartData(100, 10, 0.04, 0.0009),
  },
];
