
// Optimization Engine - Portfolio optimization, asset allocation, and strategy optimization
import { portfolioManager as portfolioService } from './portfolioManager';
import { marketDataService } from './marketDataService';
import { analyticsEngine } from './analyticsEngine';

export interface OptimizationObjective {
  type: 'maximize_return' | 'minimize_risk' | 'maximize_sharpe' | 'minimize_volatility' | 'target_return' | 'target_risk';
  targetValue?: number; // For target-based objectives
  weight?: number; // For multi-objective optimization
}

export interface OptimizationConstraints {
  maxWeight?: number; // Maximum weight per asset (0-1)
  minWeight?: number; // Minimum weight per asset (0-1)
  maxPositions?: number; // Maximum number of positions
  minPositions?: number; // Minimum number of positions
  sectorLimits?: { [sector: string]: number }; // Maximum weight per sector
  assetTypeLimits?: { [type: string]: number }; // Maximum weight per asset type
  turnoverLimit?: number; // Maximum portfolio turnover
  liquidityRequirement?: number; // Minimum liquidity score
  excludeAssets?: string[]; // Assets to exclude
  requiredAssets?: string[]; // Assets that must be included
}

export interface OptimizationResult {
  optimizedWeights: { [symbol: string]: number };
  expectedReturn: number;
  expectedRisk: number;
  sharpeRatio: number;
  diversificationRatio: number;
  turnover: number;
  improvementMetrics: {
    returnImprovement: number;
    riskReduction: number;
    sharpeImprovement: number;
  };
  trades: OptimizationTrade[];
  confidence: number; // 0-1 confidence in optimization
}

export interface OptimizationTrade {
  symbol: string;
  action: 'buy' | 'sell';
  currentWeight: number;
  targetWeight: number;
  sharesChange: number;
  dollarAmount: number;
}

export interface BacktestConfig {
  startDate: string;
  endDate: string;
  rebalanceFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  transactionCosts: number; // As percentage
  initialCapital: number;
  benchmark: string;
}

export interface BacktestResult {
  config: BacktestConfig;
  performance: {
    totalReturn: number;
    annualizedReturn: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    calmarRatio: number;
    winRate: number;
    profitFactor: number;
  };
  benchmarkComparison: {
    outperformance: number;
    beta: number;
    alpha: number;
    trackingError: number;
    informationRatio: number;
  };
  periods: BacktestPeriod[];
  trades: BacktestTrade[];
  metrics: { [date: string]: BacktestMetrics };
}

export interface BacktestPeriod {
  date: string;
  portfolioValue: number;
  benchmarkValue: number;
  weights: { [symbol: string]: number };
  returns: number;
  drawdown: number;
}

export interface BacktestTrade {
  date: string;
  symbol: string;
  action: 'buy' | 'sell';
  shares: number;
  price: number;
  cost: number;
}

export interface BacktestMetrics {
  portfolioReturn: number;
  benchmarkReturn: number;
  activeReturn: number;
  volatility: number;
  sharpe: number;
  drawdown: number;
}

class OptimizationEngine {
  private optimizationCache: Map<string, { result: OptimizationResult; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 900000; // 15 minutes

  // Portfolio Optimization
  async optimizePortfolio(
    portfolioId: string,
    objectives: OptimizationObjective[],
    constraints: OptimizationConstraints = {}
  ): Promise<OptimizationResult> {
    console.log('Optimization Engine: Optimizing portfolio', portfolioId);

    const cacheKey = this.generateOptimizationCacheKey(portfolioId, objectives, constraints);
    const cached = this.getOptimizationFromCache(cacheKey);
    if (cached) return cached;

    const portfolio = await portfolioService.getPortfolio(portfolioId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    // Get market data for all assets
    const quotes = await marketDataService.getMultipleQuotes(
      portfolio.assets.map(asset => asset.symbol)
    );

    // Calculate expected returns and covariance matrix
    const expectedReturns = await this.calculateExpectedReturns(portfolio.assets.map(a => a.symbol));
    const covarianceMatrix = await this.calculateCovarianceMatrix(portfolio.assets.map(a => a.symbol));

    // Run optimization algorithm
    const result = await this.runOptimization(
      portfolio,
      expectedReturns,
      covarianceMatrix,
      objectives,
      constraints
    );

    this.cacheOptimizationResult(cacheKey, result);
    return result;
  }

  // Mean Variance Optimization (Markowitz)
  async meanVarianceOptimization(
    assets: string[],
    expectedReturns: number[],
    covarianceMatrix: number[][],
    targetReturn?: number
  ): Promise<number[]> {
    console.log('Optimization Engine: Running mean variance optimization');

    // Simplified implementation - in production, use proper optimization library
    const numAssets = assets.length;
    const weights = new Array(numAssets).fill(1 / numAssets);

    // Simple iterative optimization (replace with proper solver in production)
    for (let iteration = 0; iteration < 100; iteration++) {
      const portfolioReturn = weights.reduce((sum, w, i) => sum + w * expectedReturns[i], 0);
      const portfolioVariance = this.calculatePortfolioVariance(weights, covarianceMatrix);

      // Adjust weights based on objective
      if (targetReturn && Math.abs(portfolioReturn - targetReturn) > 0.001) {
        const returnGap = targetReturn - portfolioReturn;
        // Adjust weights toward higher/lower expected return assets
        for (let i = 0; i < numAssets; i++) {
          if (returnGap > 0 && expectedReturns[i] > portfolioReturn) {
            weights[i] += 0.01;
          } else if (returnGap < 0 && expectedReturns[i] < portfolioReturn) {
            weights[i] += 0.01;
          }
        }
      }

      // Normalize weights
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      for (let i = 0; i < numAssets; i++) {
        weights[i] /= totalWeight;
      }
    }

    return weights;
  }

  // Risk Parity Optimization
  async riskParityOptimization(assets: string[], covarianceMatrix: number[][]): Promise<number[]> {
    console.log('Optimization Engine: Running risk parity optimization');

    const numAssets = assets.length;
    const weights = new Array(numAssets).fill(1 / numAssets);

    // Iterative risk parity optimization
    for (let iteration = 0; iteration < 50; iteration++) {
      const riskContributions = this.calculateRiskContributions(weights, covarianceMatrix);
      const targetRiskContrib = 1 / numAssets;

      // Adjust weights to equalize risk contributions
      for (let i = 0; i < numAssets; i++) {
        const adjustmentFactor = targetRiskContrib / riskContributions[i];
        weights[i] *= Math.sqrt(adjustmentFactor);
      }

      // Normalize weights
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      for (let i = 0; i < numAssets; i++) {
        weights[i] /= totalWeight;
      }
    }

    return weights;
  }

  // Black-Litterman Optimization
  async blackLittermanOptimization(
    assets: string[],
    marketWeights: number[],
    expectedReturns: number[],
    covarianceMatrix: number[][],
    views?: { assets: number[]; expectedReturn: number; confidence: number }[]
  ): Promise<number[]> {
    console.log('Optimization Engine: Running Black-Litterman optimization');

    // Simplified Black-Litterman implementation
    const tau = 0.05; // Scaling factor for uncertainty
    const riskAversion = 3; // Market risk aversion parameter

    // Calculate implied equilibrium returns
    const equilibriumReturns = marketWeights.map((w, i) => {
      const marketVariance = this.calculatePortfolioVariance(marketWeights, covarianceMatrix);
      return riskAversion * marketVariance * w;
    });

    // If no views provided, return market cap weighted portfolio
    if (!views || views.length === 0) {
      return marketWeights;
    }

    // Incorporate investor views (simplified)
    const adjustedReturns = [...equilibriumReturns];
    views.forEach(view => {
      view.assets.forEach(assetIndex => {
        adjustedReturns[assetIndex] = 
          (1 - view.confidence) * equilibriumReturns[assetIndex] + 
          view.confidence * view.expectedReturn;
      });
    });

    // Run mean variance optimization with adjusted returns
    return this.meanVarianceOptimization(assets, adjustedReturns, covarianceMatrix);
  }

  // Portfolio Backtesting
  async backtestStrategy(
    strategy: 'mean_variance' | 'risk_parity' | 'equal_weight' | 'market_cap',
    assets: string[],
    config: BacktestConfig
  ): Promise<BacktestResult> {
    console.log('Optimization Engine: Backtesting strategy', strategy);

    // Generate mock historical data and backtest results
    const periods = this.generateBacktestPeriods(config);
    const trades = this.generateBacktestTrades(assets, periods, config);
    const performance = this.calculateBacktestPerformance(periods, config);
    const benchmarkComparison = this.calculateBenchmarkComparison(periods, config.benchmark);

    return {
      config,
      performance,
      benchmarkComparison,
      periods,
      trades,
      metrics: this.generateBacktestMetrics(periods)
    };
  }

  // Scenario Analysis
  async runScenarioAnalysis(
    portfolioId: string,
    scenarios: { name: string; assetReturns: { [symbol: string]: number } }[]
  ): Promise<any> {
    console.log('Optimization Engine: Running scenario analysis');

    const portfolio = await portfolioService.getPortfolio(portfolioId);
    if (!portfolio) return null;

    const results = scenarios.map(scenario => {
      let portfolioReturn = 0;
      portfolio.assets.forEach(asset => {
        const assetReturn = scenario.assetReturns[asset.symbol] || 0;
        portfolioReturn += (asset.allocation / 100) * assetReturn;
      });

      return {
        scenario: scenario.name,
        portfolioReturn,
        impact: portfolioReturn * portfolio.totalValue / 100,
        assetContributions: portfolio.assets.map(asset => ({
          symbol: asset.symbol,
          contribution: (asset.allocation / 100) * (scenario.assetReturns[asset.symbol] || 0)
        }))
      };
    });

    return {
      scenarios: results,
      summary: {
        bestCase: Math.max(...results.map(r => r.portfolioReturn)),
        worstCase: Math.min(...results.map(r => r.portfolioReturn)),
        averageCase: results.reduce((sum, r) => sum + r.portfolioReturn, 0) / results.length
      }
    };
  }

  // Monte Carlo Simulation
  async monteCarloSimulation(
    portfolioId: string,
    timeHorizon: number, // years
    numSimulations: number = 1000
  ): Promise<any> {
    console.log('Optimization Engine: Running Monte Carlo simulation');

    const portfolio = await portfolioService.getPortfolio(portfolioId);
    if (!portfolio) return null;

    const expectedReturns = await this.calculateExpectedReturns(portfolio.assets.map(a => a.symbol));
    const covarianceMatrix = await this.calculateCovarianceMatrix(portfolio.assets.map(a => a.symbol));

    const simulations = [];
    for (let sim = 0; sim < numSimulations; sim++) {
      const path = this.generateRandomPath(expectedReturns, covarianceMatrix, timeHorizon, portfolio);
      simulations.push(path);
    }

    const finalValues = simulations.map(sim => sim[sim.length - 1]);
    finalValues.sort((a, b) => a - b);

    return {
      simulations: simulations.slice(0, 10), // Return first 10 for visualization
      statistics: {
        mean: finalValues.reduce((sum, val) => sum + val, 0) / finalValues.length,
        median: finalValues[Math.floor(finalValues.length / 2)],
        percentile5: finalValues[Math.floor(finalValues.length * 0.05)],
        percentile95: finalValues[Math.floor(finalValues.length * 0.95)],
        probabilityOfLoss: finalValues.filter(val => val < portfolio.totalValue).length / finalValues.length
      },
      confidence: {
        '90%': [finalValues[Math.floor(finalValues.length * 0.05)], finalValues[Math.floor(finalValues.length * 0.95)]],
        '95%': [finalValues[Math.floor(finalValues.length * 0.025)], finalValues[Math.floor(finalValues.length * 0.975)]],
        '99%': [finalValues[Math.floor(finalValues.length * 0.005)], finalValues[Math.floor(finalValues.length * 0.995)]]
      }
    };
  }

  // Private helper methods
  private async calculateExpectedReturns(assets: string[]): Promise<number[]> {
    // Mock expected returns calculation
    return assets.map(() => 0.08 + (Math.random() - 0.5) * 0.1); // 3-13% range
  }

  private async calculateCovarianceMatrix(assets: string[]): Promise<number[][]> {
    // Mock covariance matrix calculation
    const numAssets = assets.length;
    const matrix: number[][] = [];
    
    for (let i = 0; i < numAssets; i++) {
      matrix[i] = [];
      for (let j = 0; j < numAssets; j++) {
        if (i === j) {
          matrix[i][j] = 0.04 + Math.random() * 0.08; // Variance
        } else {
          matrix[i][j] = (Math.random() - 0.5) * 0.02; // Covariance
        }
      }
    }
    
    return matrix;
  }

  private calculatePortfolioVariance(weights: number[], covarianceMatrix: number[][]): number {
    let variance = 0;
    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights.length; j++) {
        variance += weights[i] * weights[j] * covarianceMatrix[i][j];
      }
    }
    return variance;
  }

  private calculateRiskContributions(weights: number[], covarianceMatrix: number[][]): number[] {
    const portfolioVariance = this.calculatePortfolioVariance(weights, covarianceMatrix);
    const portfolioStdDev = Math.sqrt(portfolioVariance);
    
    return weights.map((weight, i) => {
      let marginalContrib = 0;
      for (let j = 0; j < weights.length; j++) {
        marginalContrib += weights[j] * covarianceMatrix[i][j];
      }
      return (weight * marginalContrib) / (portfolioStdDev * portfolioStdDev);
    });
  }

  private async runOptimization(
    portfolio: any,
    expectedReturns: number[],
    covarianceMatrix: number[][],
    objectives: OptimizationObjective[],
    constraints: OptimizationConstraints
  ): Promise<OptimizationResult> {
    
    const assets = portfolio.assets.map((a: any) => a.symbol);
    const currentWeights = portfolio.assets.map((a: any) => a.allocation / 100);
    
    // Select optimization method based on primary objective
    const primaryObjective = objectives[0];
    let optimizedWeights: number[];
    
    switch (primaryObjective.type) {
      case 'minimize_risk':
        optimizedWeights = await this.riskParityOptimization(assets, covarianceMatrix);
        break;
      case 'maximize_sharpe':
        optimizedWeights = await this.meanVarianceOptimization(assets, expectedReturns, covarianceMatrix);
        break;
      default:
        optimizedWeights = await this.meanVarianceOptimization(assets, expectedReturns, covarianceMatrix);
    }

    // Apply constraints
    optimizedWeights = this.applyConstraints(optimizedWeights, constraints);

    // Calculate metrics
    const expectedReturn = optimizedWeights.reduce((sum, w, i) => sum + w * expectedReturns[i], 0);
    const expectedRisk = Math.sqrt(this.calculatePortfolioVariance(optimizedWeights, covarianceMatrix));
    const sharpeRatio = expectedReturn / expectedRisk;

    // Calculate improvement metrics
    const currentReturn = currentWeights.reduce((sum, w, i) => sum + w * expectedReturns[i], 0);
    const currentRisk = Math.sqrt(this.calculatePortfolioVariance(currentWeights, covarianceMatrix));
    const currentSharpe = currentReturn / currentRisk;

    // Generate trades
    const trades = this.generateOptimizationTrades(portfolio, optimizedWeights);

    return {
      optimizedWeights: Object.fromEntries(assets.map((symbol, i) => [symbol, optimizedWeights[i]])),
      expectedReturn,
      expectedRisk,
      sharpeRatio,
      diversificationRatio: this.calculateDiversificationRatio(optimizedWeights, covarianceMatrix),
      turnover: this.calculateTurnover(currentWeights, optimizedWeights),
      improvementMetrics: {
        returnImprovement: expectedReturn - currentReturn,
        riskReduction: currentRisk - expectedRisk,
        sharpeImprovement: sharpeRatio - currentSharpe
      },
      trades,
      confidence: 0.7 + Math.random() * 0.3
    };
  }

  private applyConstraints(weights: number[], constraints: OptimizationConstraints): number[] {
    const constrainedWeights = [...weights];
    
    // Apply individual asset weight constraints
    if (constraints.maxWeight) {
      for (let i = 0; i < constrainedWeights.length; i++) {
        constrainedWeights[i] = Math.min(constrainedWeights[i], constraints.maxWeight);
      }
    }
    
    if (constraints.minWeight) {
      for (let i = 0; i < constrainedWeights.length; i++) {
        constrainedWeights[i] = Math.max(constrainedWeights[i], constraints.minWeight);
      }
    }
    
    // Renormalize
    const totalWeight = constrainedWeights.reduce((sum, w) => sum + w, 0);
    for (let i = 0; i < constrainedWeights.length; i++) {
      constrainedWeights[i] /= totalWeight;
    }
    
    return constrainedWeights;
  }

  private calculateDiversificationRatio(weights: number[], covarianceMatrix: number[][]): number {
    const weightedVolatilities = weights.reduce((sum, w, i) => sum + w * Math.sqrt(covarianceMatrix[i][i]), 0);
    const portfolioVolatility = Math.sqrt(this.calculatePortfolioVariance(weights, covarianceMatrix));
    return weightedVolatilities / portfolioVolatility;
  }

  private calculateTurnover(currentWeights: number[], newWeights: number[]): number {
    return currentWeights.reduce((sum, w, i) => sum + Math.abs(w - newWeights[i]), 0) / 2;
  }

  private generateOptimizationTrades(portfolio: any, optimizedWeights: number[]): OptimizationTrade[] {
    return portfolio.assets.map((asset: any, i: number) => {
      const currentWeight = asset.allocation / 100;
      const targetWeight = optimizedWeights[i];
      const weightChange = targetWeight - currentWeight;
      
      return {
        symbol: asset.symbol,
        action: weightChange > 0 ? 'buy' : 'sell',
        currentWeight,
        targetWeight,
        sharesChange: Math.abs(weightChange * portfolio.totalValue / (asset.avgCost || 100)),
        dollarAmount: Math.abs(weightChange * portfolio.totalValue)
      };
    });
  }

  private generateBacktestPeriods(config: BacktestConfig): BacktestPeriod[] {
    const periods: BacktestPeriod[] = [];
    const start = new Date(config.startDate);
    const end = new Date(config.endDate);
    
    // Generate mock periods (in production, use real historical data)
    let currentDate = new Date(start);
    let portfolioValue = config.initialCapital;
    let benchmarkValue = config.initialCapital;
    
    while (currentDate <= end) {
      const portfolioReturn = (Math.random() - 0.5) * 0.04; // ±2%
      const benchmarkReturn = (Math.random() - 0.5) * 0.03; // ±1.5%
      
      portfolioValue *= (1 + portfolioReturn);
      benchmarkValue *= (1 + benchmarkReturn);
      
      periods.push({
        date: currentDate.toISOString().split('T')[0],
        portfolioValue,
        benchmarkValue,
        weights: { 'AAPL': 0.3, 'MSFT': 0.3, 'GOOGL': 0.4 }, // Mock weights
        returns: portfolioReturn,
        drawdown: Math.random() * -0.1 // Mock drawdown
      });
      
      // Advance date based on frequency
      if (config.rebalanceFrequency === 'daily') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (config.rebalanceFrequency === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      
      if (periods.length > 100) break; // Limit for demo
    }
    
    return periods;
  }

  private generateBacktestTrades(assets: string[], periods: BacktestPeriod[], config: BacktestConfig): BacktestTrade[] {
    // Mock trade generation
    return periods.slice(0, 10).map((period, i) => ({
      date: period.date,
      symbol: assets[i % assets.length],
      action: Math.random() > 0.5 ? 'buy' : 'sell',
      shares: Math.floor(Math.random() * 100) + 1,
      price: 100 + Math.random() * 50,
      cost: config.transactionCosts
    }));
  }

  private calculateBacktestPerformance(periods: BacktestPeriod[], config: BacktestConfig): any {
    const returns = periods.map(p => p.returns);
    const finalValue = periods[periods.length - 1]?.portfolioValue || config.initialCapital;
    
    return {
      totalReturn: (finalValue - config.initialCapital) / config.initialCapital,
      annualizedReturn: Math.pow(finalValue / config.initialCapital, 1 / ((periods.length || 1) / 252)) - 1,
      volatility: Math.sqrt(returns.reduce((sum, r) => sum + r * r, 0) / returns.length) * Math.sqrt(252),
      sharpeRatio: 0.8 + Math.random() * 1.0,
      maxDrawdown: Math.min(...periods.map(p => p.drawdown)),
      calmarRatio: 0.5 + Math.random() * 1.0,
      winRate: 0.55 + Math.random() * 0.2,
      profitFactor: 1.2 + Math.random() * 0.8
    };
  }

  private calculateBenchmarkComparison(periods: BacktestPeriod[], benchmark: string): any {
    return {
      outperformance: (Math.random() - 0.5) * 0.1, // ±5%
      beta: 0.8 + Math.random() * 0.4,
      alpha: (Math.random() - 0.5) * 0.05,
      trackingError: 0.02 + Math.random() * 0.08,
      informationRatio: (Math.random() - 0.5) * 2
    };
  }

  private generateBacktestMetrics(periods: BacktestPeriod[]): { [date: string]: BacktestMetrics } {
    const metrics: { [date: string]: BacktestMetrics } = {};
    
    periods.forEach(period => {
      metrics[period.date] = {
        portfolioReturn: period.returns,
        benchmarkReturn: (Math.random() - 0.5) * 0.03,
        activeReturn: period.returns - (Math.random() - 0.5) * 0.03,
        volatility: 0.1 + Math.random() * 0.1,
        sharpe: 0.5 + Math.random() * 1.0,
        drawdown: period.drawdown
      };
    });
    
    return metrics;
  }

  private generateRandomPath(
    expectedReturns: number[],
    covarianceMatrix: number[][],
    timeHorizon: number,
    portfolio: any
  ): number[] {
    const path = [portfolio.totalValue];
    const monthsInYear = 12;
    const totalMonths = timeHorizon * monthsInYear;
    
    for (let month = 0; month < totalMonths; month++) {
      const monthlyReturn = (Math.random() - 0.5) * 0.1; // Mock monthly return
      const currentValue = path[path.length - 1];
      path.push(currentValue * (1 + monthlyReturn));
    }
    
    return path;
  }

  private generateOptimizationCacheKey(
    portfolioId: string,
    objectives: OptimizationObjective[],
    constraints: OptimizationConstraints
  ): string {
    return `${portfolioId}_${JSON.stringify(objectives)}_${JSON.stringify(constraints)}`;
  }

  private getOptimizationFromCache(key: string): OptimizationResult | null {
    const cached = this.optimizationCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result;
    }
    return null;
  }

  private cacheOptimizationResult(key: string, result: OptimizationResult): void {
    this.optimizationCache.set(key, { result, timestamp: Date.now() });
  }
}

export const optimizationEngine = new OptimizationEngine();
