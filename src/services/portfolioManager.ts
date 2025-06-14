export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  assets: Array<{
    symbol: string;
    name: string;
    allocation: number;
    shares?: number;
    avgCost?: number;
  }>;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
}

export interface Watchlist {
  id: string;
  name: string;
  symbols: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioComparison {
  portfolios: Portfolio[];
  metrics: {
    expectedReturn: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
  }[];
  correlations: number[][];
}

class PortfolioManager {
  private storageKey = 'quantitative_portfolios';
  private watchlistKey = 'quantitative_watchlists';

  // Portfolio Management
  savePortfolio(portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>): Portfolio {
    const portfolios = this.getAllPortfolios();
    const newPortfolio: Portfolio = {
      ...portfolio,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    portfolios.push(newPortfolio);
    localStorage.setItem(this.storageKey, JSON.stringify(portfolios));
    return newPortfolio;
  }

  updatePortfolio(id: string, updates: Partial<Portfolio>): Portfolio | null {
    const portfolios = this.getAllPortfolios();
    const index = portfolios.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    portfolios[index] = {
      ...portfolios[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(portfolios));
    return portfolios[index];
  }

  deletePortfolio(id: string): boolean {
    const portfolios = this.getAllPortfolios();
    const filtered = portfolios.filter(p => p.id !== id);
    
    if (filtered.length === portfolios.length) return false;
    
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    return true;
  }

  getAllPortfolios(): Portfolio[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : this.getDefaultPortfolios();
  }

  getPortfolio(id: string): Portfolio | null {
    const portfolios = this.getAllPortfolios();
    return portfolios.find(p => p.id === id) || null;
  }

  clonePortfolio(id: string, newName: string): Portfolio | null {
    const original = this.getPortfolio(id);
    if (!original) return null;
    
    return this.savePortfolio({
      name: newName,
      description: `Clone of ${original.name}`,
      assets: [...original.assets],
      totalValue: original.totalValue
    });
  }

  // Watchlist Management
  saveWatchlist(watchlist: Omit<Watchlist, 'id' | 'createdAt' | 'updatedAt'>): Watchlist {
    const watchlists = this.getAllWatchlists();
    const newWatchlist: Watchlist = {
      ...watchlist,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    watchlists.push(newWatchlist);
    localStorage.setItem(this.watchlistKey, JSON.stringify(watchlists));
    return newWatchlist;
  }

  updateWatchlist(id: string, updates: Partial<Watchlist>): Watchlist | null {
    const watchlists = this.getAllWatchlists();
    const index = watchlists.findIndex(w => w.id === id);
    
    if (index === -1) return null;
    
    watchlists[index] = {
      ...watchlists[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.watchlistKey, JSON.stringify(watchlists));
    return watchlists[index];
  }

  deleteWatchlist(id: string): boolean {
    const watchlists = this.getAllWatchlists();
    const filtered = watchlists.filter(w => w.id !== id);
    
    if (filtered.length === watchlists.length) return false;
    
    localStorage.setItem(this.watchlistKey, JSON.stringify(filtered));
    return true;
  }

  getAllWatchlists(): Watchlist[] {
    const stored = localStorage.getItem(this.watchlistKey);
    return stored ? JSON.parse(stored) : [];
  }

  addToWatchlist(watchlistId: string, symbol: string): boolean {
    const watchlist = this.getAllWatchlists().find(w => w.id === watchlistId);
    if (!watchlist || watchlist.symbols.includes(symbol)) return false;
    
    return !!this.updateWatchlist(watchlistId, {
      symbols: [...watchlist.symbols, symbol]
    });
  }

  removeFromWatchlist(watchlistId: string, symbol: string): boolean {
    const watchlist = this.getAllWatchlists().find(w => w.id === watchlistId);
    if (!watchlist) return false;
    
    return !!this.updateWatchlist(watchlistId, {
      symbols: watchlist.symbols.filter(s => s !== symbol)
    });
  }

  // Portfolio Comparison
  comparePortfolios(portfolioIds: string[]): PortfolioComparison | null {
    const portfolios = portfolioIds.map(id => this.getPortfolio(id)).filter(Boolean) as Portfolio[];
    if (portfolios.length < 2) return null;

    // Calculate mock metrics for each portfolio
    const metrics = portfolios.map(portfolio => ({
      expectedReturn: this.calculateExpectedReturn(portfolio),
      volatility: this.calculateVolatility(portfolio),
      sharpeRatio: this.calculateSharpeRatio(portfolio),
      maxDrawdown: this.calculateMaxDrawdown(portfolio)
    }));

    // Calculate correlation matrix
    const correlations = this.calculateCorrelationMatrix(portfolios);

    return {
      portfolios,
      metrics,
      correlations
    };
  }

  // Private helper methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getDefaultPortfolios(): Portfolio[] {
    // Improved default portfolios for new users
    return [
      {
        id: 'default-balanced',
        name: 'Balanced Growth',
        description: 'A diversified portfolio of US stocks, international equities, and bonds for steady growth and risk reduction.',
        assets: [
          { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', allocation: 35 },
          { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', allocation: 15 },
          { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', allocation: 10 },
          { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', allocation: 40 }
        ],
        totalValue: 50000,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        isDefault: true
      },
      {
        id: 'default-growth',
        name: 'Global Growth',
        description: 'For higher returns: Tech, international, and factor tilts, suited for long time horizons.',
        assets: [
          { symbol: 'QQQ', name: 'Invesco NASDAQ 100 ETF', allocation: 35 },
          { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', allocation: 20 },
          { symbol: 'EFA', name: 'iShares MSCI EAFE ETF', allocation: 15 },
          { symbol: 'IEMG', name: 'iShares Core MSCI Emerging Markets ETF', allocation: 10 },
          { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', allocation: 15 },
          { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', allocation: 5 }
        ],
        totalValue: 80000,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        isDefault: true
      },
      {
        id: 'default-income',
        name: 'Income Focus',
        description: 'Strong on dividends, with bonds and real estate for income stability.',
        assets: [
          { symbol: 'SCHD', name: 'Schwab US Dividend Equity ETF', allocation: 30 },
          { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', allocation: 40 },
          { symbol: 'VYM', name: 'Vanguard High Dividend Yield ETF', allocation: 15 },
          { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', allocation: 15 }
        ],
        totalValue: 60000,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        isDefault: true
      }
    ];
  }

  private calculateExpectedReturn(portfolio: Portfolio): number {
    // Mock calculation
    return portfolio.assets.reduce((sum, asset) => sum + (asset.allocation * 0.08), 0) / 100;
  }

  private calculateVolatility(portfolio: Portfolio): number {
    // Mock calculation
    return Math.sqrt(portfolio.assets.reduce((sum, asset) => 
      sum + Math.pow(asset.allocation * 0.15, 2), 0)) / 100;
  }

  private calculateSharpeRatio(portfolio: Portfolio): number {
    const expectedReturn = this.calculateExpectedReturn(portfolio);
    const volatility = this.calculateVolatility(portfolio);
    return volatility > 0 ? (expectedReturn - 0.02) / volatility : 0;
  }

  private calculateMaxDrawdown(portfolio: Portfolio): number {
    // Mock calculation
    return -0.15 - (Math.random() * 0.1);
  }

  private calculateCorrelationMatrix(portfolios: Portfolio[]): number[][] {
    const n = portfolios.length;
    const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          // Mock correlation calculation
          matrix[i][j] = 0.3 + Math.random() * 0.5;
        }
      }
    }
    
    return matrix;
  }
}

export const portfolioManager = new PortfolioManager();
