
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserPortfolio } from "@/hooks/useUserPortfolios";

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

  async savePortfolio(portfolioData: PortfolioCreationData, userId: string): Promise<UserPortfolio | null> {
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
    return data as UserPortfolio;
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
}

export const portfolioManager = new PortfolioManager();
