
import { HistoricalData } from './financialApi';

export interface RiskMetrics {
  sharpeRatio: number;
  volatility: number;
  var95: number; // Value at Risk (95% confidence)
  cvar95: number; // Conditional Value at Risk
  maxDrawdown: number;
  beta: number;
  alpha: number;
  informationRatio: number;
  treynorRatio: number;
  calmarRatio: number;
}

export interface CorrelationData {
  asset1: string;
  asset2: string;
  correlation: number;
}

export interface PerformanceAttribution {
  assetAllocation: number;
  securitySelection: number;
  interaction: number;
  totalAttribution: number;
}

export interface HoldingData {
  symbol: string;
  weight: number;
  returns: number[];
  historicalData: HistoricalData[];
}

export const portfolioAnalytics = {
  calculateReturns(prices: number[]): number[] {
    const returns: number[] = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    return returns;
  },

  calculateRiskMetrics(returns: number[], benchmarkReturns: number[], riskFreeRate: number = 0.02): RiskMetrics {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance) * Math.sqrt(252); // Annualized

    // Sharpe Ratio
    const excessReturn = mean * 252 - riskFreeRate;
    const sharpeRatio = excessReturn / volatility;

    // Value at Risk (95% confidence)
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const var95Index = Math.floor(0.05 * sortedReturns.length);
    const var95 = -sortedReturns[var95Index];

    // Conditional Value at Risk
    const tailReturns = sortedReturns.slice(0, var95Index);
    const cvar95 = -tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length;

    // Maximum Drawdown
    let maxDrawdown = 0;
    let peak = 0;
    let cumulativeReturn = 1;
    
    for (const ret of returns) {
      cumulativeReturn *= (1 + ret);
      if (cumulativeReturn > peak) {
        peak = cumulativeReturn;
      }
      const drawdown = (peak - cumulativeReturn) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    // Beta and Alpha
    const benchmarkMean = benchmarkReturns.reduce((sum, r) => sum + r, 0) / benchmarkReturns.length;
    const covariance = returns.reduce((sum, r, i) => {
      return sum + (r - mean) * (benchmarkReturns[i] - benchmarkMean);
    }, 0) / returns.length;
    
    const benchmarkVariance = benchmarkReturns.reduce((sum, r) => {
      return sum + Math.pow(r - benchmarkMean, 2);
    }, 0) / benchmarkReturns.length;
    
    const beta = covariance / benchmarkVariance;
    const alpha = (mean * 252) - (riskFreeRate + beta * (benchmarkMean * 252 - riskFreeRate));

    // Information Ratio
    const trackingError = Math.sqrt(
      returns.reduce((sum, r, i) => {
        const activeReturn = r - benchmarkReturns[i];
        return sum + Math.pow(activeReturn, 2);
      }, 0) / returns.length
    ) * Math.sqrt(252);
    
    const informationRatio = (mean * 252 - benchmarkMean * 252) / trackingError;

    // Treynor Ratio
    const treynorRatio = excessReturn / beta;

    // Calmar Ratio
    const calmarRatio = (mean * 252) / maxDrawdown;

    return {
      sharpeRatio: Number(sharpeRatio.toFixed(3)),
      volatility: Number(volatility.toFixed(3)),
      var95: Number(var95.toFixed(4)),
      cvar95: Number(cvar95.toFixed(4)),
      maxDrawdown: Number(maxDrawdown.toFixed(4)),
      beta: Number(beta.toFixed(3)),
      alpha: Number(alpha.toFixed(3)),
      informationRatio: Number(informationRatio.toFixed(3)),
      treynorRatio: Number(treynorRatio.toFixed(3)),
      calmarRatio: Number(calmarRatio.toFixed(3))
    };
  },

  calculateCorrelationMatrix(holdings: HoldingData[]): CorrelationData[] {
    const correlations: CorrelationData[] = [];
    
    for (let i = 0; i < holdings.length; i++) {
      for (let j = i + 1; j < holdings.length; j++) {
        const returns1 = holdings[i].returns;
        const returns2 = holdings[j].returns;
        
        const mean1 = returns1.reduce((sum, r) => sum + r, 0) / returns1.length;
        const mean2 = returns2.reduce((sum, r) => sum + r, 0) / returns2.length;
        
        const numerator = returns1.reduce((sum, r, idx) => {
          return sum + (r - mean1) * (returns2[idx] - mean2);
        }, 0);
        
        const denominator = Math.sqrt(
          returns1.reduce((sum, r) => sum + Math.pow(r - mean1, 2), 0) *
          returns2.reduce((sum, r) => sum + Math.pow(r - mean2, 2), 0)
        );
        
        const correlation = numerator / denominator;
        
        correlations.push({
          asset1: holdings[i].symbol,
          asset2: holdings[j].symbol,
          correlation: Number(correlation.toFixed(3))
        });
      }
    }
    
    return correlations;
  },

  calculatePerformanceAttribution(
    portfolioReturns: number[],
    benchmarkReturns: number[],
    holdings: HoldingData[]
  ): PerformanceAttribution {
    // Simplified Brinson attribution model
    const portfolioReturn = portfolioReturns.reduce((sum, r) => sum + r, 0);
    const benchmarkReturn = benchmarkReturns.reduce((sum, r) => sum + r, 0);
    
    // Asset allocation effect (simplified)
    const assetAllocation = holdings.reduce((sum, holding) => {
      const sectorReturn = holding.returns.reduce((s, r) => s + r, 0);
      return sum + (holding.weight - 0.1) * (sectorReturn - benchmarkReturn);
    }, 0);
    
    // Security selection effect
    const securitySelection = holdings.reduce((sum, holding) => {
      const holdingReturn = holding.returns.reduce((s, r) => s + r, 0);
      const sectorReturn = benchmarkReturn; // Simplified
      return sum + 0.1 * (holdingReturn - sectorReturn);
    }, 0);
    
    // Interaction effect
    const interaction = holdings.reduce((sum, holding) => {
      const holdingReturn = holding.returns.reduce((s, r) => s + r, 0);
      const sectorReturn = benchmarkReturn;
      return sum + (holding.weight - 0.1) * (holdingReturn - sectorReturn);
    }, 0);
    
    return {
      assetAllocation: Number(assetAllocation.toFixed(4)),
      securitySelection: Number(securitySelection.toFixed(4)),
      interaction: Number(interaction.toFixed(4)),
      totalAttribution: Number((assetAllocation + securitySelection + interaction).toFixed(4))
    };
  }
};
