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
  {
    id: 'permanent-portfolio',
    name: 'Permanent Portfolio',
    icon: Anchor, // Lucide Anchor for stability
    description: 'Simple yet powerful hedge across inflation, growth, deflation, and recessions.',
    objective: 'Survive any economic climate.',
    allocation: [
      { asset: 'Stocks', weight: 25, etf: 'VTI' },
      { asset: 'Long-term Bonds', weight: 25, etf: 'TLT' },
      { asset: 'Cash', weight: 25, etf: 'BIL' },
      { asset: 'Gold', weight: 25, etf: 'GLD' },
    ],
    riskProfile: 'Low',
    expectedReturn: 5.8,
    volatility: 7.2,
    sharpeRatio: 0.60,
    bestYear: { year: 2020, return: 14.2 },
    worstYear: { year: 2013, return: -4.0 },
    sectorExposure: [
      { sector: 'Equity', weight: 25 },
      { sector: 'Government Debt', weight: 25 },
      { sector: 'Cash', weight: 25 },
      { sector: 'Commodities', weight: 25 },
    ],
    assetExposure: [
      { asset: 'Equity', weight: 25 },
      { asset: 'Bonds', weight: 25 },
      { asset: 'Cash', weight: 25 },
      { asset: 'Commodities', weight: 25 },
    ],
    implementationNotes: "Quarterly rebalance. Gold and cash act as hedges. Ultra-low cost, easily managed.",
    chartData: generateChartData(100, 10, 0.02, 0.0004),
  },
  {
    id: 'ivy-portfolio',
    name: 'Ivy Portfolio',
    icon: Gem, // Lucide Gem for endowment sophistication
    description: 'Diversification beyond public markets with a smart long-term mix.',
    objective: 'Replicate Ivy League university endowments.',
    allocation: [
      { asset: 'Domestic Equity', weight: 20, etf: 'VTI' },
      { asset: 'International Equity', weight: 20, etf: 'VEA' },
      { asset: 'Bonds', weight: 20, etf: 'BND' },
      { asset: 'Real Assets', weight: 20, etf: 'VNQ/DBC' },
      { asset: 'Alternatives', weight: 20, etf: 'QAI' },
    ],
    riskProfile: 'Medium',
    expectedReturn: 7.2,
    volatility: 9.5,
    sharpeRatio: 0.75,
    bestYear: { year: 2017, return: 14.7 },
    worstYear: { year: 2022, return: -10.5 },
    sectorExposure: [
      { sector: 'Equity', weight: 40 },
      { sector: 'Fixed Income', weight: 20 },
      { sector: 'Real Assets', weight: 20 },
      { sector: 'Alternatives', weight: 20 },
    ],
    assetExposure: [
      { asset: 'Equity', weight: 40 },
      { asset: 'Bonds', weight: 20 },
      { asset: 'Alternatives', weight: 20 },
      { asset: 'Real Estate/Commodities', weight: 20 },
    ],
    implementationNotes: "Annual rebalance; alternatives via liquid ETFs. Mimics major endowment allocations.",
    chartData: generateChartData(100, 10, 0.029, 0.0006),
  },
  {
    id: 'yale-endowment',
    name: 'Yale Endowment Model',
    icon: Crown, // Use Crown for elite approach
    description: 'Emphasizes illiquid, high-alpha strategies. Adapt with ETFs like VNQ, QQQM, etc.',
    objective: 'Long-term wealth creation via alternative investments.',
    allocation: [
      { asset: 'Private Equity', weight: 30, etf: 'PSP' },
      { asset: 'Real Estate', weight: 20, etf: 'VNQ' },
      { asset: 'Hedge Funds', weight: 15, etf: 'QAI' },
      { asset: 'Domestic Equity', weight: 15, etf: 'VTI' },
      { asset: 'International Equity', weight: 10, etf: 'VEA' },
      { asset: 'Bonds', weight: 10, etf: 'BND' },
    ],
    riskProfile: 'High',
    expectedReturn: 8.5,
    volatility: 14.2,
    sharpeRatio: 0.67,
    bestYear: { year: 2019, return: 19.3 },
    worstYear: { year: 2022, return: -13.4 },
    sectorExposure: [
      { sector: 'Private Equity', weight: 30 },
      { sector: 'Real Estate', weight: 20 },
      { sector: 'Alternatives', weight: 15 },
      { sector: 'Equity', weight: 25 },
      { sector: 'Fixed Income', weight: 10 }
    ],
    assetExposure: [
      { asset: 'Alternative', weight: 65 },
      { asset: 'Equity', weight: 25 },
      { asset: 'Bonds', weight: 10 }
    ],
    implementationNotes: "In practice, implement through publicly traded ETF proxies for alternatives. Semi-annual rebalance.",
    chartData: generateChartData(100, 10, 0.045, 0.0007),
  },
  {
    id: 'bogleheads-3fund',
    name: 'Bogleheads 3-Fund Portfolio',
    icon: BarChart, // Lucide BarChart for simplicity & tracking
    description: 'Ideal for beginners; efficient and rebalancing-friendly.',
    objective: 'Simple, low-cost, passive diversification.',
    allocation: [
      { asset: 'Total US Market', weight: 33, etf: 'VTI' },
      { asset: 'Total International', weight: 33, etf: 'VXUS' },
      { asset: 'Total Bond Market', weight: 34, etf: 'BND' },
    ],
    riskProfile: 'Medium',
    expectedReturn: 7.1,
    volatility: 10.1,
    sharpeRatio: 0.73,
    bestYear: { year: 2019, return: 20.5 },
    worstYear: { year: 2022, return: -12.2 },
    sectorExposure: [
      { sector: 'US Equity', weight: 33 },
      { sector: 'Global Equity', weight: 33 },
      { sector: 'Bonds', weight: 34 },
    ],
    assetExposure: [
      { asset: 'Equity', weight: 66 },
      { asset: 'Bonds', weight: 34 }
    ],
    implementationNotes: "Rebalance annually or at 5% drift. Ultra-low fees, high liquidity.",
    chartData: generateChartData(100, 10, 0.024, 0.0005),
  },
  {
    id: 'blackrock-target',
    name: 'BlackRock Target Allocation',
    icon: PieChart, // Lucide PieChart for managed mix
    description: 'Managed mix based on user risk tolerance (aggressive to conservative).',
    objective: 'Managed mix based on user risk tolerance.',
    allocation: [
      { asset: 'Aggressive (80/20): US/Intl Equity', weight: 80, etf: 'ITOT/IXUS' },
      { asset: 'Aggressive (80/20): Bonds', weight: 20, etf: 'AGG' },
      { asset: 'Balanced (60/40): US/Intl Equity', weight: 60, etf: 'ITOT/IXUS' },
      { asset: 'Balanced (60/40): Bonds', weight: 40, etf: 'AGG' },
      { asset: 'Conservative (40/60): US/Intl Equity', weight: 40, etf: 'ITOT/IXUS' },
      { asset: 'Conservative (40/60): Bonds', weight: 60, etf: 'AGG' },
    ],
    riskProfile: 'Medium',
    expectedReturn: 6.9,
    volatility: 8.5,
    sharpeRatio: 0.70,
    bestYear: { year: 2017, return: 13.7 },
    worstYear: { year: 2022, return: -9.1 },
    sectorExposure: [
      { sector: 'US Equity', weight: 40 },
      { sector: 'International Equity', weight: 20 },
      { sector: 'Bonds', weight: 40 }
    ],
    assetExposure: [
      { asset: 'Equity', weight: 48 }, // Average weighting for display
      { asset: 'Bonds', weight: 52 }
    ],
    implementationNotes: "Allocate based on personal risk profile. Rebalance quarterly or at 10% drift. Can be implemented with iShares Target Allocation ETFs.",
    chartData: generateChartData(100, 10, 0.021, 0.0005),
  },
  {
    id: 'sector-rotation',
    name: 'Sector Rotation Strategy',
    icon: TrendingUp, // Lucide TrendingUp for momentum
    description: 'Beat the market by rotating into the strongest sectors.',
    objective: 'Rotate into top 3 sectors by momentum, rebalanced monthly or quarterly.',
    allocation: [
      { asset: 'Top Sectors by Momentum', weight: 100, etf: 'XLK, XLF, XLE, etc.' }
    ],
    riskProfile: 'High',
    expectedReturn: 13.0,
    volatility: 19.5,
    sharpeRatio: 0.68,
    bestYear: { year: 2020, return: 28.0 },
    worstYear: { year: 2018, return: -16.4 },
    sectorExposure: [
      { sector: 'Varies', weight: 100 }
    ],
    assetExposure: [
      { asset: 'Equity', weight: 95 },
      { asset: 'Cash (when out of market)', weight: 5 }
    ],
    implementationNotes: "Monthly/quarterly rebalance. Pick top 3 sectors by 6-12 month performance. Use stop-loss rules for risk management.",
    chartData: generateChartData(100, 10, 0.065, 0.0011),
  },
  {
    id: 'barbell-strategy',
    name: 'Barbell Strategy',
    icon: Layers, // Lucide Layers for extremes
    description: 'Balance risk by going ultra-safe and ultra-aggressive.',
    objective: 'Balance risk by going ultra-safe and ultra-aggressive.',
    allocation: [
      { asset: 'Low-Risk (Treasuries, Short Bonds)', weight: 85, etf: 'BIL/SHY' },
      { asset: 'High-Risk (Leveraged, Crypto, Options)', weight: 15, etf: 'TQQQ/BTC/Calls' }
    ],
    riskProfile: 'High',
    expectedReturn: 9.1,
    volatility: 17.8,
    sharpeRatio: 0.61,
    bestYear: { year: 2020, return: 22.5 },
    worstYear: { year: 2022, return: -15.8 },
    sectorExposure: [
      { sector: 'Cash/Treasuries', weight: 85 },
      { sector: 'Equity/Alternatives', weight: 15 }
    ],
    assetExposure: [
      { asset: 'Bonds/Cash', weight: 85 },
      { asset: 'Alternatives', weight: 15 }
    ],
    implementationNotes: "Rebalance to maintain >80% in low-risk assets. Small, diversified high-risk sleeve. Tolerant of extreme events ('black swans').",
    chartData: generateChartData(100, 10, 0.05, 0.0008),
  },
  {
    id: 'all-weather',
    name: 'All Weather Portfolio',
    icon: Shield, // Lucide Shield for resilience
    description: "Ray Dalio's risk parity approach for all economic environments.",
    objective: 'Survive recessions, inflation, booms, and busts.',
    allocation: [
      { asset: 'Global Equities', weight: 30, etf: 'VT' },
      { asset: 'Long-Term Treasuries', weight: 40, etf: 'TLT' },
      { asset: 'Intermediate Treasuries', weight: 15, etf: 'IEF' },
      { asset: 'Commodities', weight: 7.5, etf: 'GLD, DBC' },
      { asset: 'TIPS/Inflation Bonds', weight: 7.5, etf: 'TIP' },
    ],
    riskProfile: 'Low',
    expectedReturn: 8.2,
    volatility: 12.0,
    sharpeRatio: 0.68,
    bestYear: { year: 2019, return: 16.7 },
    worstYear: { year: 2022, return: -10.0 },
    sectorExposure: [
      { sector: 'Global Equity', weight: 30 },
      { sector: 'Government Bonds', weight: 55 },
      { sector: 'Commodities', weight: 15 },
    ],
    assetExposure: [
      { asset: 'Equity', weight: 30 },
      { asset: 'Bonds', weight: 55 },
      { asset: 'Commodities', weight: 15 },
    ],
    implementationNotes: "Quarterly rebalance; maintain risk-parity through volatility-adjusted allocations. Broadest all-weather coverage.",
    chartData: generateChartData(100, 10, 0.028, 0.0008),
  },
];
