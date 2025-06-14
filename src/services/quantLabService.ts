
// Quant Lab Service - Advanced research environment for quantitative analysis
import { marketDataService } from './marketDataService';
import { portfolioService } from './portfolioService';

export interface NotebookCell {
  id: string;
  type: 'code' | 'markdown' | 'data' | 'chart';
  content: string;
  output?: any;
  executionCount?: number;
  metadata?: Record<string, any>;
  isExecuting?: boolean;
  error?: string;
}

export interface ResearchNotebook {
  id: string;
  name: string;
  description: string;
  cells: NotebookCell[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  isPublic: boolean;
  tags: string[];
  language: 'javascript' | 'python' | 'r';
}

export interface CodeExecutionResult {
  success: boolean;
  output: any;
  error?: string;
  executionTime: number;
  memoryUsage?: number;
  logs: string[];
}

export interface BacktestResult {
  strategyId: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalValue: number;
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  trades: BacktestTrade[];
  metrics: BacktestMetrics;
  equity_curve: { date: string; value: number }[];
}

export interface BacktestTrade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: string;
  pnl: number;
  commission: number;
}

export interface BacktestMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  sortino: number;
  calmar: number;
  volatility: number;
  beta: number;
  alpha: number;
}

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  code: string;
  language: 'javascript' | 'python';
  parameters: Record<string, any>;
  backtest_results?: BacktestResult[];
  isActive: boolean;
  createdAt: string;
  userId: string;
}

export interface PaperTradingAccount {
  id: string;
  userId: string;
  name: string;
  initialBalance: number;
  currentBalance: number;
  totalPnL: number;
  totalReturn: number;
  positions: PaperPosition[];
  orders: PaperOrder[];
  isActive: boolean;
  createdAt: string;
}

export interface PaperPosition {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  realizedPnL: number;
}

export interface PaperOrder {
  id: string;
  symbol: string;
  type: 'market' | 'limit' | 'stop';
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  timestamp: string;
  fillPrice?: number;
  fillTime?: string;
}

export interface CollaborationSession {
  id: string;
  notebookId: string;
  participants: string[];
  isActive: boolean;
  createdAt: string;
  lastActivity: string;
}

class QuantLabService {
  private notebooks: Map<string, ResearchNotebook> = new Map();
  private strategies: Map<string, TradingStrategy> = new Map();
  private paperAccounts: Map<string, PaperTradingAccount> = new Map();
  private collaborationSessions: Map<string, CollaborationSession> = new Map();
  private executionQueue: Map<string, Promise<CodeExecutionResult>> = new Map();

  // Notebook Management
  async createNotebook(userId: string, name: string, description: string = ''): Promise<ResearchNotebook> {
    console.log('Quant Lab: Creating new notebook', name);
    
    const notebook: ResearchNotebook = {
      id: this.generateId(),
      name,
      description,
      cells: [
        {
          id: this.generateId(),
          type: 'markdown',
          content: `# ${name}\n\n${description || 'New research notebook'}`
        },
        {
          id: this.generateId(),
          type: 'code',
          content: '// Start your analysis here\nconsole.log("Welcome to Quant Lab!");'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
      isPublic: false,
      tags: [],
      language: 'javascript'
    };

    this.notebooks.set(notebook.id, notebook);
    return notebook;
  }

  async getNotebook(notebookId: string): Promise<ResearchNotebook | null> {
    return this.notebooks.get(notebookId) || null;
  }

  async updateNotebook(notebookId: string, updates: Partial<ResearchNotebook>): Promise<ResearchNotebook | null> {
    const notebook = this.notebooks.get(notebookId);
    if (!notebook) return null;

    const updated = { ...notebook, ...updates, updatedAt: new Date().toISOString() };
    this.notebooks.set(notebookId, updated);
    return updated;
  }

  async getUserNotebooks(userId: string): Promise<ResearchNotebook[]> {
    return Array.from(this.notebooks.values()).filter(nb => nb.userId === userId);
  }

  // Cell Management
  async addCell(notebookId: string, type: NotebookCell['type'], content: string = '', index?: number): Promise<NotebookCell> {
    const notebook = this.notebooks.get(notebookId);
    if (!notebook) throw new Error('Notebook not found');

    const cell: NotebookCell = {
      id: this.generateId(),
      type,
      content
    };

    if (index !== undefined) {
      notebook.cells.splice(index, 0, cell);
    } else {
      notebook.cells.push(cell);
    }

    notebook.updatedAt = new Date().toISOString();
    return cell;
  }

  async updateCell(notebookId: string, cellId: string, updates: Partial<NotebookCell>): Promise<NotebookCell | null> {
    const notebook = this.notebooks.get(notebookId);
    if (!notebook) return null;

    const cellIndex = notebook.cells.findIndex(c => c.id === cellId);
    if (cellIndex === -1) return null;

    notebook.cells[cellIndex] = { ...notebook.cells[cellIndex], ...updates };
    notebook.updatedAt = new Date().toISOString();
    return notebook.cells[cellIndex];
  }

  async deleteCell(notebookId: string, cellId: string): Promise<boolean> {
    const notebook = this.notebooks.get(notebookId);
    if (!notebook) return false;

    const cellIndex = notebook.cells.findIndex(c => c.id === cellId);
    if (cellIndex === -1) return false;

    notebook.cells.splice(cellIndex, 1);
    notebook.updatedAt = new Date().toISOString();
    return true;
  }

  // Code Execution Engine
  async executeCell(notebookId: string, cellId: string): Promise<CodeExecutionResult> {
    console.log('Quant Lab: Executing cell', cellId);
    
    const notebook = this.notebooks.get(notebookId);
    if (!notebook) throw new Error('Notebook not found');

    const cell = notebook.cells.find(c => c.id === cellId);
    if (!cell || cell.type !== 'code') throw new Error('Cell not found or not executable');

    // Mark cell as executing
    cell.isExecuting = true;
    cell.error = undefined;

    try {
      const startTime = Date.now();
      const result = await this.executeCode(cell.content, notebook.language);
      const executionTime = Date.now() - startTime;

      // Update cell with results
      cell.output = result.output;
      cell.executionCount = (cell.executionCount || 0) + 1;
      cell.isExecuting = false;

      const executionResult: CodeExecutionResult = {
        success: result.success,
        output: result.output,
        error: result.error,
        executionTime,
        logs: result.logs
      };

      return executionResult;
    } catch (error) {
      cell.isExecuting = false;
      cell.error = error instanceof Error ? error.message : 'Execution failed';
      
      return {
        success: false,
        output: null,
        error: cell.error,
        executionTime: 0,
        logs: []
      };
    }
  }

  private async executeCode(code: string, language: string): Promise<CodeExecutionResult> {
    // Simulate code execution in a sandboxed environment
    // In a real implementation, this would use Docker containers or WebAssembly
    
    const logs: string[] = [];
    let output: any = null;
    let success = true;
    let error: string | undefined;

    try {
      // Mock execution environment with access to financial data
      const context = this.createExecutionContext(logs);
      
      if (language === 'javascript') {
        // Simple JavaScript execution simulation
        const func = new Function('context', 'console', `
          const { marketData, portfolio, analytics } = context;
          ${code}
        `);
        
        output = func(context, {
          log: (...args: any[]) => logs.push(args.join(' '))
        });
      } else {
        // For Python/R, we'd use a proper execution engine
        logs.push('Python/R execution not implemented in demo');
        output = 'Language not supported in demo mode';
      }
    } catch (err) {
      success = false;
      error = err instanceof Error ? err.message : 'Execution error';
      logs.push(`Error: ${error}`);
    }

    return { success, output, error, executionTime: 0, logs };
  }

  private createExecutionContext(logs: string[]) {
    return {
      marketData: {
        getQuote: async (symbol: string) => {
          logs.push(`Fetching quote for ${symbol}`);
          return await marketDataService.getRealTimeQuote(symbol);
        },
        getMultipleQuotes: async (symbols: string[]) => {
          logs.push(`Fetching quotes for ${symbols.join(', ')}`);
          return await marketDataService.getMultipleQuotes(symbols);
        }
      },
      portfolio: {
        getAll: async () => {
          logs.push('Fetching all portfolios');
          return await portfolioService.getAllPortfolios();
        },
        analyze: async (id: string) => {
          logs.push(`Analyzing portfolio ${id}`);
          return await portfolioService.calculatePortfolioPerformance(id);
        }
      },
      analytics: {
        calculate: (data: number[]) => {
          logs.push('Performing analytics calculation');
          return {
            mean: data.reduce((a, b) => a + b, 0) / data.length,
            std: Math.sqrt(data.reduce((acc, val, _, arr) => acc + Math.pow(val - arr.reduce((a, b) => a + b, 0) / arr.length, 2), 0) / data.length)
          };
        }
      }
    };
  }

  // Strategy Development and Backtesting
  async createStrategy(userId: string, strategy: Omit<TradingStrategy, 'id' | 'createdAt'>): Promise<TradingStrategy> {
    console.log('Quant Lab: Creating new strategy', strategy.name);
    
    const newStrategy: TradingStrategy = {
      ...strategy,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      userId
    };

    this.strategies.set(newStrategy.id, newStrategy);
    return newStrategy;
  }

  async backtest(strategyId: string, startDate: string, endDate: string, initialCapital: number = 100000): Promise<BacktestResult> {
    console.log('Quant Lab: Running backtest for strategy', strategyId);
    
    const strategy = this.strategies.get(strategyId);
    if (!strategy) throw new Error('Strategy not found');

    // Mock backtesting - in reality, this would run the strategy against historical data
    const trades: BacktestTrade[] = [];
    const equityCurve: { date: string; value: number }[] = [];
    
    // Simulate some trades
    for (let i = 0; i < 10; i++) {
      const trade: BacktestTrade = {
        id: this.generateId(),
        symbol: ['AAPL', 'MSFT', 'GOOGL'][Math.floor(Math.random() * 3)],
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        quantity: Math.floor(Math.random() * 100) + 1,
        price: 100 + Math.random() * 50,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
        pnl: (Math.random() - 0.5) * 1000,
        commission: 1
      };
      trades.push(trade);
    }

    // Generate equity curve
    let currentValue = initialCapital;
    for (let i = 0; i < 100; i++) {
      currentValue *= (1 + (Math.random() - 0.48) * 0.02); // Slight upward bias
      equityCurve.push({
        date: new Date(Date.now() - (100 - i) * 86400000).toISOString().split('T')[0],
        value: currentValue
      });
    }

    const finalValue = currentValue;
    const totalReturn = (finalValue - initialCapital) / initialCapital;
    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => t.pnl > 0).length;

    const result: BacktestResult = {
      strategyId,
      startDate,
      endDate,
      initialCapital,
      finalValue,
      totalReturn,
      annualizedReturn: totalReturn * (365 / 30), // Simplified annualization
      sharpeRatio: totalReturn / 0.15, // Mock Sharpe ratio
      maxDrawdown: -0.05 - Math.random() * 0.10,
      trades,
      equity_curve: equityCurve,
      metrics: {
        totalTrades,
        winningTrades,
        losingTrades: totalTrades - winningTrades,
        winRate: winningTrades / totalTrades,
        avgWin: trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) / winningTrades || 0,
        avgLoss: trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0) / (totalTrades - winningTrades) || 0,
        profitFactor: 1.2 + Math.random() * 0.8,
        sortino: 0.8 + Math.random() * 0.4,
        calmar: 0.6 + Math.random() * 0.4,
        volatility: 0.1 + Math.random() * 0.1,
        beta: 0.8 + Math.random() * 0.4,
        alpha: (Math.random() - 0.5) * 0.1
      }
    };

    // Store backtest results
    if (!strategy.backtest_results) strategy.backtest_results = [];
    strategy.backtest_results.push(result);

    return result;
  }

  // Paper Trading
  async createPaperAccount(userId: string, name: string, initialBalance: number = 100000): Promise<PaperTradingAccount> {
    console.log('Quant Lab: Creating paper trading account', name);
    
    const account: PaperTradingAccount = {
      id: this.generateId(),
      userId,
      name,
      initialBalance,
      currentBalance: initialBalance,
      totalPnL: 0,
      totalReturn: 0,
      positions: [],
      orders: [],
      isActive: true,
      createdAt: new Date().toISOString()
    };

    this.paperAccounts.set(account.id, account);
    return account;
  }

  async placePaperOrder(accountId: string, order: Omit<PaperOrder, 'id' | 'timestamp' | 'status'>): Promise<PaperOrder> {
    console.log('Quant Lab: Placing paper order', order);
    
    const account = this.paperAccounts.get(accountId);
    if (!account) throw new Error('Paper account not found');

    const newOrder: PaperOrder = {
      ...order,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    account.orders.push(newOrder);

    // Simulate immediate execution for market orders
    if (order.type === 'market') {
      await this.executePaperOrder(accountId, newOrder.id);
    }

    return newOrder;
  }

  private async executePaperOrder(accountId: string, orderId: string): Promise<void> {
    const account = this.paperAccounts.get(accountId);
    if (!account) return;

    const order = account.orders.find(o => o.id === orderId);
    if (!order || order.status !== 'pending') return;

    // Get current market price
    const quote = await marketDataService.getRealTimeQuote(order.symbol);
    const fillPrice = quote.price;
    const orderValue = fillPrice * order.quantity;

    if (order.side === 'buy') {
      if (account.currentBalance >= orderValue) {
        // Execute buy order
        account.currentBalance -= orderValue;
        
        // Update or create position
        const existingPosition = account.positions.find(p => p.symbol === order.symbol);
        if (existingPosition) {
          const totalShares = existingPosition.quantity + order.quantity;
          existingPosition.avgPrice = ((existingPosition.avgPrice * existingPosition.quantity) + (fillPrice * order.quantity)) / totalShares;
          existingPosition.quantity = totalShares;
        } else {
          account.positions.push({
            symbol: order.symbol,
            quantity: order.quantity,
            avgPrice: fillPrice,
            currentPrice: fillPrice,
            marketValue: orderValue,
            unrealizedPnL: 0,
            realizedPnL: 0
          });
        }

        order.status = 'filled';
        order.fillPrice = fillPrice;
        order.fillTime = new Date().toISOString();
      } else {
        order.status = 'rejected';
      }
    } else {
      // Execute sell order
      const position = account.positions.find(p => p.symbol === order.symbol);
      if (position && position.quantity >= order.quantity) {
        const sellValue = fillPrice * order.quantity;
        account.currentBalance += sellValue;
        
        // Calculate realized P&L
        const realizedPnL = (fillPrice - position.avgPrice) * order.quantity;
        position.realizedPnL += realizedPnL;
        position.quantity -= order.quantity;
        
        // Remove position if quantity is 0
        if (position.quantity === 0) {
          account.positions = account.positions.filter(p => p.symbol !== order.symbol);
        }

        order.status = 'filled';
        order.fillPrice = fillPrice;
        order.fillTime = new Date().toISOString();
      } else {
        order.status = 'rejected';
      }
    }

    // Update account totals
    await this.updatePaperAccountMetrics(accountId);
  }

  private async updatePaperAccountMetrics(accountId: string): Promise<void> {
    const account = this.paperAccounts.get(accountId);
    if (!account) return;

    // Update position current prices and unrealized P&L
    for (const position of account.positions) {
      const quote = await marketDataService.getRealTimeQuote(position.symbol);
      position.currentPrice = quote.price;
      position.marketValue = position.currentPrice * position.quantity;
      position.unrealizedPnL = (position.currentPrice - position.avgPrice) * position.quantity;
    }

    // Calculate total account value
    const totalPositionValue = account.positions.reduce((sum, pos) => sum + pos.marketValue, 0);
    const totalUnrealizedPnL = account.positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);
    const totalRealizedPnL = account.positions.reduce((sum, pos) => sum + pos.realizedPnL, 0);
    
    account.totalPnL = totalUnrealizedPnL + totalRealizedPnL;
    account.totalReturn = ((account.currentBalance + totalPositionValue - account.initialBalance) / account.initialBalance) * 100;
  }

  // Collaboration Features
  async startCollaborationSession(notebookId: string, userId: string): Promise<CollaborationSession> {
    console.log('Quant Lab: Starting collaboration session for notebook', notebookId);
    
    const session: CollaborationSession = {
      id: this.generateId(),
      notebookId,
      participants: [userId],
      isActive: true,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    this.collaborationSessions.set(session.id, session);
    return session;
  }

  async joinCollaborationSession(sessionId: string, userId: string): Promise<boolean> {
    const session = this.collaborationSessions.get(sessionId);
    if (!session || !session.isActive) return false;

    if (!session.participants.includes(userId)) {
      session.participants.push(userId);
      session.lastActivity = new Date().toISOString();
    }

    return true;
  }

  // Utility methods
  private generateId(): string {
    return `ql_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public API methods
  async getStrategies(userId: string): Promise<TradingStrategy[]> {
    return Array.from(this.strategies.values()).filter(s => s.userId === userId);
  }

  async getPaperAccounts(userId: string): Promise<PaperTradingAccount[]> {
    return Array.from(this.paperAccounts.values()).filter(a => a.userId === userId);
  }

  async getCollaborationSessions(userId: string): Promise<CollaborationSession[]> {
    return Array.from(this.collaborationSessions.values()).filter(s => 
      s.participants.includes(userId) && s.isActive
    );
  }

  // Data access layer helpers
  async getMarketData(symbols: string[], startDate?: string, endDate?: string): Promise<any> {
    console.log('Quant Lab: Fetching market data for research', symbols);
    return await marketDataService.getMultipleQuotes(symbols);
  }

  async getEconomicData(): Promise<any> {
    console.log('Quant Lab: Fetching economic data for research');
    return await marketDataService.getEconomicIndicators();
  }
}

export const quantLabService = new QuantLabService();
