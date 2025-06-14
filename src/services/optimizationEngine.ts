// Optimization Engine - Portfolio optimization, asset allocation, and strategy optimization
import { portfolioManager as portfolioService } from './portfolioManager';
import { marketDataService } from './marketDataService';
import { analyticsEngine } from './analyticsEngine';

export interface OptimizationResult {
  originalAllocation: any[];
  optimizedAllocation: any[];
  metrics: {
    expectedReturn: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  improvementMetrics: {
    returnImprovement: number;
    riskReduction: number;
    sharpeImprovement: number;
  };
  constraints: OptimizationConstraints;
  strategy: OptimizationStrategy;
  confidence: number;
}

export interface AllocationOptimizationResult {
  allocation: {
    symbol: string;
    allocation: number;
    expectedReturn: number;
    risk: number;
  }[];
  portfolioMetrics: {
    expectedReturn: number;
    risk: number;
    sharpeRatio: number;
  };
  efficientFrontier: { risk: number; return: number }[];
  correlationMatrix: number[][];
}

export interface RebalancingRecommendation {
  needsRebalancing: boolean;
  currentDrift: {
    maxDrift: number;
    avgDrift: number;
    threshold: number;
  };
  trades: {
    symbol: string;
    action: 'buy' | 'sell';
    amount: number;
    percentage: number;
  }[];
  estimatedCosts: {
    tradingFees: number;
    marketImpact: number;
    opportunityCost: number;
  };
  recommendation: string;
}

export interface OptimizationConstraints {
  maxAssetAllocation: number;
  minAssetAllocation: number;
  maxSectorExposure: number;
  maxRegionExposure: number;
  maxDrift: number;
}

export type OptimizationStrategy = 'max_sharpe' | 'min_variance' | 'max_return' | 'risk_parity';

class OptimizationEngine {
  private constraints: OptimizationConstraints = {
    maxAssetAllocation: 0.20,
    minAssetAllocation: 0.01,
    maxSectorExposure: 0.30,
    maxRegionExposure: 0.40,
    maxDrift: 5
  };

  constructor() {
    console.log('Optimization Engine: Initialized');
  }

  // Portfolio Optimization
  async optimizePortfolio(portfolioId: string, strategy: OptimizationStrategy = 'max_sharpe'): Promise<OptimizationResult> {
    console.log('Optimization Engine: Optimizing portfolio', portfolioId, 'with strategy', strategy);

    const portfolio = portfolioService.getPortfolio(portfolioId);
    if (!portfolio) {
      throw new Error(`Portfolio ${portfolioId} not found`);
    }

    // Get market data for all assets
    const symbols = portfolio.assets.map(asset => asset.symbol);
    const quotes = await Promise.all(
      symbols.map(symbol => marketDataService.getRealTimeQuote(symbol))
    );

    // Calculate expected returns and covariance matrix
    const returns = await this.calculateExpectedReturns(symbols);
    const covariance = await this.calculateCovarianceMatrix(symbols);

    // Apply optimization strategy
    let optimizedWeights: number[];
    switch (strategy) {
      case 'max_sharpe':
        optimizedWeights = this.maximizeSharpeRatio(returns, covariance);
        break;
      case 'min_variance':
        optimizedWeights = this.minimizeVariance(covariance);
        break;
      case 'max_return':
        optimizedWeights = this.maximizeReturn(returns);
        break;
      case 'risk_parity':
        optimizedWeights = this.calculateRiskParity(covariance);
        break;
      default:
        optimizedWeights = this.maximizeSharpeRatio(returns, covariance);
    }

    // Calculate portfolio metrics
    const expectedReturn = this.calculatePortfolioReturn(optimizedWeights, returns);
    const volatility = this.calculatePortfolioVolatility(optimizedWeights, covariance);
    const sharpeRatio = (expectedReturn - 0.02) / volatility; // Assuming 2% risk-free rate

    // Generate new allocation
    const newAllocation = symbols.map((symbol, index) => ({
      symbol,
      name: portfolio.assets.find(a => a.symbol === symbol)?.name || symbol,
      allocation: optimizedWeights[index] * 100
    }));

    const result: OptimizationResult = {
      originalAllocation: portfolio.assets,
      optimizedAllocation: newAllocation,
      metrics: {
        expectedReturn: expectedReturn * 100,
        volatility: volatility * 100,
        sharpeRatio,
        maxDrawdown: -Math.random() * 0.25 // Mock max drawdown
      },
      improvementMetrics: {
        returnImprovement: (expectedReturn - 0.08) * 100, // Mock original return of 8%
        riskReduction: (0.15 - volatility) * 100, // Mock original volatility of 15%
        sharpeImprovement: sharpeRatio - 0.5 // Mock original Sharpe of 0.5
      },
      constraints: this.constraints,
      strategy,
      confidence: 0.75 + Math.random() * 0.2 // 75-95% confidence
    };

    return result;
  }

  // Asset Allocation Optimization
  async optimizeAssetAllocation(
    assets: string[], 
    targetReturn?: number, 
    maxRisk?: number
  ): Promise<AllocationOptimizationResult> {
    console.log('Optimization Engine: Optimizing asset allocation for', assets);

    const returns = await this.calculateExpectedReturns(assets);
    const covariance = await this.calculateCovarianceMatrix(assets);

    let weights: number[];

    if (targetReturn) {
      weights = this.optimizeForTargetReturn(returns, covariance, targetReturn);
    } else if (maxRisk) {
      weights = this.optimizeForMaxRisk(returns, covariance, maxRisk);
    } else {
      weights = this.maximizeSharpeRatio(returns, covariance);
    }

    const allocation = assets.map((asset, index) => ({
      symbol: asset,
      allocation: weights[index] * 100,
      expectedReturn: returns[index] * 100,
      risk: Math.sqrt(covariance[index][index]) * 100
    }));

    const portfolioReturn = this.calculatePortfolioReturn(weights, returns);
    const portfolioRisk = this.calculatePortfolioVolatility(weights, covariance);

    return {
      allocation,
      portfolioMetrics: {
        expectedReturn: portfolioReturn * 100,
        risk: portfolioRisk * 100,
        sharpeRatio: (portfolioReturn - 0.02) / portfolioRisk
      },
      efficientFrontier: await this.calculateEfficientFrontier(assets, returns, covariance),
      correlationMatrix: covariance
    };
  }

  // Rebalancing Optimization
  async optimizeRebalancing(portfolioId: string): Promise<RebalancingRecommendation> {
    console.log('Optimization Engine: Optimizing rebalancing for portfolio', portfolioId);

    const portfolio = portfolioService.getPortfolio(portfolioId);
    if (!portfolio) {
      throw new Error(`Portfolio ${portfolioId} not found`);
    }

    // Get current market values
    const currentValues = await Promise.all(
      portfolio.assets.map(async asset => {
        const quote = await marketDataService.getRealTimeQuote(asset.symbol);
        const currentWeight = (asset.allocation / 100) * portfolio.total_value;
        const marketValue = quote.price * (currentWeight / quote.price); // Simplified calculation
        return {
          symbol: asset.symbol,
          targetAllocation: asset.allocation,
          currentAllocation: (marketValue / portfolio.total_value) * 100,
          drift: Math.abs(asset.allocation - (marketValue / portfolio.total_value) * 100)
        };
      })
    );

    const maxDrift = Math.max(...currentValues.map(v => v.drift));
    const avgDrift = currentValues.reduce((sum, v) => sum + v.drift, 0) / currentValues.length;

    const needsRebalancing = maxDrift > this.constraints.maxDrift || avgDrift > 2;

    const trades = needsRebalancing ? currentValues.map(asset => {
      const difference = asset.targetAllocation - asset.currentAllocation;
      return {
        symbol: asset.symbol,
        action: difference > 0 ? 'buy' as const : 'sell' as const,
        amount: Math.abs(difference),
        percentage: Math.abs(difference)
      };
    }) : [];

    return {
      needsRebalancing,
      currentDrift: {
        maxDrift,
        avgDrift,
        threshold: this.constraints.maxDrift
      },
      trades,
      estimatedCosts: {
        tradingFees: trades.length * 9.99, // $9.99 per trade
        marketImpact: 0.05, // 5 basis points
        opportunityCost: maxDrift * 0.1 // Mock calculation
      },
      recommendation: needsRebalancing ? 
        'Rebalancing recommended due to significant drift' : 
        'Portfolio is well-balanced, no action needed'
    };
  }

  private async calculateExpectedReturns(symbols: string[]): Promise<number[]> {
    // Mock expected returns based on historical data
    return symbols.map(() => 0.10 + (Math.random() - 0.5) * 0.05);
  }

  private async calculateCovarianceMatrix(symbols: string[]): Promise<number[][]> {
    // Mock covariance matrix based on asset correlations
    const numAssets = symbols.length;
    const covariance: number[][] = [];
    for (let i = 0; i < numAssets; i++) {
      covariance[i] = [];
      for (let j = 0; j < numAssets; j++) {
        if (i === j) {
          covariance[i][j] = 0.0225; // Variance (15% volatility)
        } else {
          covariance[i][j] = 0.01 * Math.random(); // Covariance (correlation)
        }
      }
    }
    return covariance;
  }

  private maximizeSharpeRatio(returns: number[], covariance: number[][]): number[] {
    // Mock Sharpe ratio maximization
    const numAssets = returns.length;
    const weights = Array(numAssets).fill(1 / numAssets);
    return weights;
  }

  private minimizeVariance(covariance: number[][]): number[] {
    // Mock minimum variance optimization
    const numAssets = covariance.length;
    const weights = Array(numAssets).fill(1 / numAssets);
    return weights;
  }

  private maximizeReturn(returns: number[]): number[] {
    // Mock maximum return allocation
    const numAssets = returns.length;
    const weights: number[] = Array(numAssets).fill(0);
    const maxReturnIndex = returns.indexOf(Math.max(...returns));
    weights[maxReturnIndex] = 1;
    return weights;
  }

  private calculateRiskParity(covariance: number[][]): number[] {
    // Mock risk parity allocation
    const numAssets = covariance.length;
    const weights = Array(numAssets).fill(1 / numAssets);
    return weights;
  }

  private optimizeForTargetReturn(returns: number[], covariance: number[][], targetReturn: number): number[] {
    // Mock optimization for target return
    const numAssets = returns.length;
    const weights = Array(numAssets).fill(1 / numAssets);
    return weights;
  }

  private optimizeForMaxRisk(returns: number[], covariance: number[][], maxRisk: number): number[] {
    // Mock optimization for maximum risk
    const numAssets = returns.length;
    const weights = Array(numAssets).fill(1 / numAssets);
    return weights;
  }

  private calculatePortfolioReturn(weights: number[], returns: number[]): number {
    let portfolioReturn = 0;
    for (let i = 0; i < weights.length; i++) {
      portfolioReturn += weights[i] * returns[i];
    }
    return portfolioReturn;
  }

  private calculatePortfolioVolatility(weights: number[], covariance: number[][]): number {
    let portfolioVariance = 0;
    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights.length; j++) {
        portfolioVariance += weights[i] * weights[j] * covariance[i][j];
      }
    }
    return Math.sqrt(portfolioVariance);
  }

  private async calculateEfficientFrontier(
    assets: string[],
    returns: number[],
    covariance: number[][]
  ): Promise<{ risk: number; return: number }[]> {
    // Mock efficient frontier calculation
    const efficientFrontier: { risk: number; return: number }[] = [];
    for (let i = 0; i < 10; i++) {
      const targetReturn = 0.05 + i * 0.01;
      const weights = this.optimizeForTargetReturn(returns, covariance, targetReturn);
      const risk = this.calculatePortfolioVolatility(weights, covariance);
      efficientFrontier.push({ risk, return: targetReturn });
    }
    return efficientFrontier;
  }
}

export const optimizationEngine = new OptimizationEngine();
