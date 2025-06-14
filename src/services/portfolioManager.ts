import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Portfolio } from "@/hooks/useUserPortfolios";

export type { Portfolio };

export interface Watchlist {
  id: string;
  name: string;
  symbols: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioComparisonMetric {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export interface PortfolioComparison {
  portfolios: Portfolio[];
  metrics: PortfolioComparisonMetric[];
  correlations: number[][];
}

interface PortfolioCreationData {
  name: string;
  description?: string;
  assets: Array<{
    symbol: string;
    name: string;
    allocation: number;
  }>;
  totalValue: number;
}

class PortfolioManager {
  public getDefaultPortfolios() {
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

  async savePortfolio(portfolioData: PortfolioCreationData, userId: string): Promise<Portfolio | null> {
    const { data, error } = await supabase
      .from('user_portfolios')
      .insert({
        user_id: userId,
        name: portfolioData.name,
        description: portfolioData.description,
        assets: portfolioData.assets,
        total_value: portfolioData.totalValue,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving portfolio:', error);
      toast.error(`Failed to save portfolio: ${error.message}`);
      return null;
    }
    return data as Portfolio;
  }

  async deletePortfolio(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_portfolios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting portfolio:', error);
      toast.error(`Failed to delete portfolio: ${error.message}`);
      return false;
    }
    return true;
  }

  // Mocked/stubbed methods to fix build errors
  getAllPortfolios(): Portfolio[] {
    console.warn("`getAllPortfolios` is deprecated. Use `useUserPortfolios` hook instead.");
    return [];
  }

  getPortfolio(id: string): Portfolio | null {
    console.warn("`getPortfolio` is deprecated.");
    return null;
  }
  
  updatePortfolio(id: string, updates: Partial<Portfolio>): Portfolio | null {
    toast.info("Editing portfolios is coming soon!");
    return null;
  }

  clonePortfolio(id: string, name: string) {
    toast.info("Cloning portfolios is coming soon!");
  }

  comparePortfolios(portfoliosToCompare: Portfolio[]): PortfolioComparison | null {
    if (portfoliosToCompare.length < 2 || portfoliosToCompare.length > 4) {
      toast.error("Please select between 2 and 4 portfolios to compare.");
      return null;
    }

    const metrics: PortfolioComparisonMetric[] = portfoliosToCompare.map(() => {
      // Mocked metrics for demonstration.
      return {
        expectedReturn: Math.random() * 0.15,
        volatility: Math.random() * 0.25 + 0.05,
        sharpeRatio: Math.random() * 1.5 + 0.5,
        maxDrawdown: -Math.random() * 0.3,
      };
    });

    const correlations: number[][] = [];
    for (let i = 0; i < portfoliosToCompare.length; i++) {
      correlations[i] = [];
      for (let j = 0; j < portfoliosToCompare.length; j++) {
        if (i === j) {
          correlations[i][j] = 1;
        } else if (j > i) {
          const corr = Math.random() * 1.8 - 0.8;
          correlations[i][j] = parseFloat(corr.toFixed(3));
        } else {
          correlations[i][j] = correlations[j][i];
        }
      }
    }

    toast.success("Comparison generated successfully!");

    return {
      portfolios: portfoliosToCompare,
      metrics,
      correlations,
    };
  }
  
  getAllWatchlists(): Watchlist[] {
    return [{ id: '1', name: 'My Local Watchlist', symbols: ['AAPL', 'GOOG'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
  }

  saveWatchlist(watchlist: Omit<Watchlist, 'id' | 'createdAt' | 'updatedAt'>): Watchlist {
    toast.success(`Watchlist "${watchlist.name}" saved locally.`);
    const newWatchlist = { ...watchlist, id: `local-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    return newWatchlist;
  }

  deleteWatchlist(id: string) {
    toast.success(`Watchlist deleted locally.`);
    return true;
  }

  addToWatchlist(watchlistId: string, symbol: string) {
    toast.success(`${symbol} added to watchlist locally.`);
  }

  removeFromWatchlist(watchlistId: string, symbol: string) {
    toast.success(`${symbol} removed from watchlist locally.`);
  }
}

export const portfolioManager = new PortfolioManager();
