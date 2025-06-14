
import { coffeeCanStrategy, CoffeeCanCriteria } from './strategies/coffeeCanStrategy';
import { allWeatherStrategy } from './strategies/allWeatherStrategy';
import { valueMomentumStrategy } from './strategies/valueMomentumStrategy';

export type StrategyType = 'coffee_can' | 'all_weather' | 'value_momentum' | 'custom';

export interface StrategyConfig {
  type: StrategyType;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  timeHorizon: 'short' | 'medium' | 'long';
  parameters?: any;
}

export interface StrategyResult {
  strategy: StrategyType;
  allocation: any[];
  expectedReturn: number;
  expectedRisk: number;
  sharpeRatio: number;
  rebalanceFrequency: string;
  keyMetrics: any;
}

class StrategyEngine {
  private strategies: StrategyConfig[] = [
    {
      type: 'coffee_can',
      name: 'Coffee Can Investing',
      description: 'Buy high-quality stocks and hold for 10+ years',
      riskLevel: 'medium',
      timeHorizon: 'long',
      parameters: {
        minRevenueGrowth: 15,
        minROE: 20,
        maxDebtToEquity: 0.3
      }
    },
    {
      type: 'all_weather',
      name: 'All Weather Portfolio',
      description: 'Risk parity approach across economic environments',
      riskLevel: 'low',
      timeHorizon: 'long',
      parameters: {
        targetVolatility: 12
      }
    },
    {
      type: 'value_momentum',
      name: 'Value-Momentum Strategy',
      description: 'Combine value investing with momentum trends',
      riskLevel: 'high',
      timeHorizon: 'medium',
      parameters: {
        valueWeight: 0.5,
        topN: 20
      }
    }
  ];

  getAvailableStrategies(): StrategyConfig[] {
    return this.strategies;
  }

  async executeStrategy(
    strategyType: StrategyType,
    portfolioValue: number,
    customParameters?: any
  ): Promise<StrategyResult> {
    console.log(`Strategy Engine: Executing ${strategyType} strategy`);

    const strategy = this.strategies.find(s => s.type === strategyType);
    if (!strategy) {
      throw new Error(`Strategy ${strategyType} not found`);
    }

    const parameters = { ...strategy.parameters, ...customParameters };

    switch (strategyType) {
      case 'coffee_can':
        return await this.executeCoffeeCanStrategy(portfolioValue, parameters);
      
      case 'all_weather':
        return await this.executeAllWeatherStrategy(portfolioValue, parameters);
      
      case 'value_momentum':
        return await this.executeValueMomentumStrategy(portfolioValue, parameters);
      
      default:
        throw new Error(`Strategy ${strategyType} not implemented`);
    }
  }

  private async executeCoffeeCanStrategy(portfolioValue: number, parameters: any): Promise<StrategyResult> {
    const criteria: Partial<CoffeeCanCriteria> = {
      minRevenueGrowth: parameters.minRevenueGrowth,
      minROE: parameters.minROE,
      maxDebtToEquity: parameters.maxDebtToEquity
    };

    // Sample stock universe for screening
    const stockUniverse = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JNJ', 'PG', 'KO'];
    
    const scores = await coffeeCanStrategy.screenStocks(stockUniverse, criteria);
    const allocation = coffeeCanStrategy.generatePortfolioAllocation(scores, portfolioValue);

    return {
      strategy: 'coffee_can',
      allocation,
      expectedReturn: 12.5, // Historical average for quality stocks
      expectedRisk: 16.0,   // Lower than market due to quality focus
      sharpeRatio: 0.78,
      rebalanceFrequency: 'Annually or when fundamentals deteriorate',
      keyMetrics: {
        averageQualityScore: scores.reduce((sum, s) => sum + s.qualityScore, 0) / scores.length,
        selectedStocks: scores.filter(s => s.recommendation === 'BUY').length
      }
    };
  }

  private async executeAllWeatherStrategy(portfolioValue: number, parameters: any): Promise<StrategyResult> {
    const environment = allWeatherStrategy.analyzeEconomicEnvironment();
    const allocation = allWeatherStrategy.generateAllocation(portfolioValue, environment);

    return {
      strategy: 'all_weather',
      allocation,
      expectedReturn: 8.2,  // Conservative estimate
      expectedRisk: 12.0,   // Target volatility
      sharpeRatio: 0.68,
      rebalanceFrequency: 'Quarterly or when allocations drift >5%',
      keyMetrics: {
        economicEnvironment: environment.environment,
        targetVolatility: parameters.targetVolatility,
        assetClasses: allocation.length
      }
    };
  }

  private async executeValueMomentumStrategy(portfolioValue: number, parameters: any): Promise<StrategyResult> {
    // Larger stock universe for value-momentum screening
    const stockUniverse = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JNJ', 'PG', 'KO',
      'JPM', 'BAC', 'XOM', 'CVX', 'WMT', 'HD', 'DIS', 'NFLX', 'PYPL', 'CRM'
    ];

    const scores = await valueMomentumStrategy.analyzeStocks(stockUniverse, parameters.valueWeight);
    const allocation = valueMomentumStrategy.generatePortfolioAllocation(scores, portfolioValue, parameters.topN);

    return {
      strategy: 'value_momentum',
      allocation,
      expectedReturn: 14.8,  // Higher due to factor premiums
      expectedRisk: 20.5,    // Higher volatility
      sharpeRatio: 0.72,
      rebalanceFrequency: 'Monthly',
      keyMetrics: {
        averageValueScore: scores.reduce((sum, s) => sum + s.valueScore, 0) / scores.length,
        averageMomentumScore: scores.reduce((sum, s) => sum + s.momentumScore, 0) / scores.length,
        strongBuyCount: scores.filter(s => s.recommendation === 'STRONG_BUY').length
      }
    };
  }

  compareStrategies(portfolioValue: number): Promise<StrategyResult[]> {
    return Promise.all([
      this.executeStrategy('coffee_can', portfolioValue),
      this.executeStrategy('all_weather', portfolioValue),
      this.executeStrategy('value_momentum', portfolioValue)
    ]);
  }

  getStrategyRecommendation(riskTolerance: number, timeHorizon: number, investmentGoals: string[]): StrategyType {
    // Simple rule-based recommendation
    if (timeHorizon >= 10 && riskTolerance <= 5) {
      return 'coffee_can';
    } else if (riskTolerance <= 4) {
      return 'all_weather';
    } else if (riskTolerance >= 7 && timeHorizon >= 3) {
      return 'value_momentum';
    }
    
    return 'all_weather'; // Default conservative choice
  }
}

export const strategyEngine = new StrategyEngine();
