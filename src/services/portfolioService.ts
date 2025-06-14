
// Portfolio Service - Centralized portfolio operations and data management
import { portfolioManager, Portfolio } from './portfolioManager';
import { marketDataService } from './marketDataService';

export interface PortfolioServiceConfig {
  autoRebalance: boolean;
  rebalanceThreshold: number;
  maxPositions: number;
  minCashReserve: number;
}

export interface PortfolioTransaction {
  id: string;
  portfolioId: string;
  type: 'buy' | 'sell' | 'dividend' | 'split';
  symbol: string;
  quantity: number;
  price: number;
  timestamp: string;
  fees: number;
  notes?: string;
}

export interface PortfolioPerformance {
  portfolioId: string;
  totalReturn: number;
  totalReturnPercent: number;
  dayChange: number;
  dayChangePercent: number;
  weekChange: number;
  weekChangePercent: number;
  monthChange: number;
  monthChangePercent: number;
  yearChange: number;
  yearChangePercent: number;
  sharpeRatio: number;
  volatility: number;
  maxDrawdown: number;
  beta: number;
  alpha: number;
}

class PortfolioService {
  private config: PortfolioServiceConfig = {
    autoRebalance: false,
    rebalanceThreshold: 5, // 5% deviation triggers rebalance
    maxPositions: 50,
    minCashReserve: 0.05 // 5% cash reserve
  };

  // Portfolio CRUD Operations
  async createPortfolio(data: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>): Promise<Portfolio> {
    console.log('Portfolio Service: Creating new portfolio', data.name);
    
    // Validate portfolio constraints
    this.validatePortfolioConstraints(data);
    
    const portfolio = portfolioManager.savePortfolio(data);
    
    // Initialize performance tracking
    await this.initializePerformanceTracking(portfolio.id);
    
    return portfolio;
  }

  async updatePortfolio(id: string, updates: Partial<Portfolio>): Promise<Portfolio | null> {
    console.log('Portfolio Service: Updating portfolio', id);
    
    if (updates.assets) {
      this.validatePortfolioConstraints(updates as any);
    }
    
    const portfolio = portfolioManager.updatePortfolio(id, updates);
    
    if (portfolio && this.config.autoRebalance) {
      await this.checkRebalanceNeed(portfolio);
    }
    
    return portfolio;
  }

  async deletePortfolio(id: string): Promise<boolean> {
    console.log('Portfolio Service: Deleting portfolio', id);
    
    // Clean up related data
    await this.cleanupPortfolioData(id);
    
    return portfolioManager.deletePortfolio(id);
  }

  async getPortfolio(id: string): Promise<Portfolio | null> {
    return portfolioManager.getPortfolio(id);
  }

  async getAllPortfolios(): Promise<Portfolio[]> {
    return portfolioManager.getAllPortfolios();
  }

  // Performance Analysis
  async calculatePortfolioPerformance(portfolioId: string): Promise<PortfolioPerformance> {
    console.log('Portfolio Service: Calculating performance for', portfolioId);
    
    const portfolio = await this.getPortfolio(portfolioId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    // Get current market data for all assets
    const quotes = await marketDataService.getMultipleQuotes(
      portfolio.assets.map(asset => asset.symbol)
    );

    // Calculate current values
    let totalValue = 0;
    const assetValues = portfolio.assets.map(asset => {
      const quote = quotes.find(q => q.symbol === asset.symbol);
      const currentPrice = quote?.price || 0;
      const value = (asset.shares || 0) * currentPrice;
      totalValue += value;
      return { ...asset, currentPrice, value };
    });

    // Mock performance calculations (in real app, use historical data)
    const mockPerformance: PortfolioPerformance = {
      portfolioId,
      totalReturn: totalValue - portfolio.totalValue,
      totalReturnPercent: ((totalValue - portfolio.totalValue) / portfolio.totalValue) * 100,
      dayChange: totalValue * (Math.random() - 0.5) * 0.02,
      dayChangePercent: (Math.random() - 0.5) * 2,
      weekChange: totalValue * (Math.random() - 0.5) * 0.05,
      weekChangePercent: (Math.random() - 0.5) * 5,
      monthChange: totalValue * (Math.random() - 0.5) * 0.1,
      monthChangePercent: (Math.random() - 0.5) * 10,
      yearChange: totalValue * (Math.random() - 0.5) * 0.2,
      yearChangePercent: (Math.random() - 0.5) * 20,
      sharpeRatio: 0.8 + Math.random() * 1.0,
      volatility: 0.1 + Math.random() * 0.2,
      maxDrawdown: -0.05 - Math.random() * 0.15,
      beta: 0.8 + Math.random() * 0.4,
      alpha: (Math.random() - 0.5) * 0.1
    };

    return mockPerformance;
  }

  // Portfolio Rebalancing
  async checkRebalanceNeed(portfolio: Portfolio): Promise<boolean> {
    console.log('Portfolio Service: Checking rebalance need for', portfolio.id);
    
    const currentAllocations = await this.getCurrentAllocations(portfolio);
    const targetAllocations = portfolio.assets.map(asset => ({
      symbol: asset.symbol,
      target: asset.allocation,
      current: currentAllocations[asset.symbol] || 0
    }));

    const needsRebalance = targetAllocations.some(allocation => 
      Math.abs(allocation.current - allocation.target) > this.config.rebalanceThreshold
    );

    if (needsRebalance) {
      console.log('Portfolio Service: Rebalancing needed for', portfolio.id);
      // In a real app, this would trigger rebalancing trades
    }

    return needsRebalance;
  }

  // Transaction Management
  async addTransaction(transaction: Omit<PortfolioTransaction, 'id' | 'timestamp'>): Promise<PortfolioTransaction> {
    console.log('Portfolio Service: Adding transaction', transaction);
    
    const newTransaction: PortfolioTransaction = {
      ...transaction,
      id: this.generateTransactionId(),
      timestamp: new Date().toISOString()
    };

    // Store transaction (in real app, use database)
    this.storeTransaction(newTransaction);
    
    // Update portfolio holdings
    await this.updatePortfolioFromTransaction(newTransaction);
    
    return newTransaction;
  }

  async getPortfolioTransactions(portfolioId: string): Promise<PortfolioTransaction[]> {
    // In real app, fetch from database
    return this.getStoredTransactions(portfolioId);
  }

  // Configuration Management
  updateConfig(newConfig: Partial<PortfolioServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Portfolio Service: Configuration updated', this.config);
  }

  getConfig(): PortfolioServiceConfig {
    return { ...this.config };
  }

  // Private helper methods
  private validatePortfolioConstraints(portfolio: any): void {
    if (portfolio.assets && portfolio.assets.length > this.config.maxPositions) {
      throw new Error(`Portfolio cannot have more than ${this.config.maxPositions} positions`);
    }

    const totalAllocation = portfolio.assets?.reduce((sum: number, asset: any) => sum + asset.allocation, 0) || 0;
    if (Math.abs(totalAllocation - 100) > 0.01) {
      throw new Error('Portfolio allocations must sum to 100%');
    }
  }

  private async getCurrentAllocations(portfolio: Portfolio): Promise<Record<string, number>> {
    const quotes = await marketDataService.getMultipleQuotes(
      portfolio.assets.map(asset => asset.symbol)
    );

    let totalValue = 0;
    const values: Record<string, number> = {};

    portfolio.assets.forEach(asset => {
      const quote = quotes.find(q => q.symbol === asset.symbol);
      const value = (asset.shares || 0) * (quote?.price || 0);
      values[asset.symbol] = value;
      totalValue += value;
    });

    const allocations: Record<string, number> = {};
    Object.entries(values).forEach(([symbol, value]) => {
      allocations[symbol] = totalValue > 0 ? (value / totalValue) * 100 : 0;
    });

    return allocations;
  }

  private async initializePerformanceTracking(portfolioId: string): Promise<void> {
    console.log('Portfolio Service: Initializing performance tracking for', portfolioId);
    // In real app, set up performance tracking in database
  }

  private async cleanupPortfolioData(portfolioId: string): Promise<void> {
    console.log('Portfolio Service: Cleaning up data for portfolio', portfolioId);
    // In real app, clean up transactions, performance data, etc.
  }

  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private storeTransaction(transaction: PortfolioTransaction): void {
    // In real app, store in database
    const stored = localStorage.getItem('portfolio_transactions') || '[]';
    const transactions = JSON.parse(stored);
    transactions.push(transaction);
    localStorage.setItem('portfolio_transactions', JSON.stringify(transactions));
  }

  private getStoredTransactions(portfolioId: string): PortfolioTransaction[] {
    const stored = localStorage.getItem('portfolio_transactions') || '[]';
    const transactions = JSON.parse(stored);
    return transactions.filter((t: PortfolioTransaction) => t.portfolioId === portfolioId);
  }

  private async updatePortfolioFromTransaction(transaction: PortfolioTransaction): Promise<void> {
    const portfolio = await this.getPortfolio(transaction.portfolioId);
    if (!portfolio) return;

    // Update portfolio based on transaction
    const assetIndex = portfolio.assets.findIndex(a => a.symbol === transaction.symbol);
    
    if (assetIndex >= 0) {
      const asset = portfolio.assets[assetIndex];
      const currentShares = asset.shares || 0;
      
      if (transaction.type === 'buy') {
        asset.shares = currentShares + transaction.quantity;
      } else if (transaction.type === 'sell') {
        asset.shares = Math.max(0, currentShares - transaction.quantity);
      }
      
      // Update average cost
      if (transaction.type === 'buy' && asset.shares > 0) {
        const totalCost = (asset.avgCost || 0) * currentShares + transaction.price * transaction.quantity;
        asset.avgCost = totalCost / asset.shares;
      }
    }

    await this.updatePortfolio(transaction.portfolioId, portfolio);
  }
}

export const portfolioService = new PortfolioService();
