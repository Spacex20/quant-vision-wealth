
export interface IndianStockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  exchange: 'NSE' | 'BSE';
  currency: 'INR';
  sector: string;
  industry: string;
}

export interface IndianSearchResult {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  sector: string;
}

// Indian stock market API service
export const indianFinancialApi = {
  async getStockQuote(symbol: string): Promise<IndianStockQuote> {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('Invalid symbol provided');
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Mock Indian stock data - replace with real API calls in production
      const mockIndianStocks: { [key: string]: Partial<IndianStockQuote> } = {
        'RELIANCE': {
          symbol: 'RELIANCE',
          name: 'Reliance Industries Ltd',
          price: 2847.65,
          change: 45.30,
          changePercent: 1.62,
          volume: 8567432,
          marketCap: 19250000000000, // 19.25 Lakh Crores
          peRatio: 24.5,
          dividendYield: 0.35,
          fiftyTwoWeekHigh: 3024.90,
          fiftyTwoWeekLow: 2220.30,
          exchange: 'NSE',
          currency: 'INR',
          sector: 'Oil & Gas',
          industry: 'Refineries'
        },
        'TCS': {
          symbol: 'TCS',
          name: 'Tata Consultancy Services Ltd',
          price: 4156.80,
          change: -32.15,
          changePercent: -0.77,
          volume: 2345678,
          marketCap: 15180000000000, // 15.18 Lakh Crores
          peRatio: 28.7,
          dividendYield: 1.2,
          fiftyTwoWeekHigh: 4592.25,
          fiftyTwoWeekLow: 3311.00,
          exchange: 'NSE',
          currency: 'INR',
          sector: 'Information Technology',
          industry: 'IT Services'
        },
        'INFY': {
          symbol: 'INFY',
          name: 'Infosys Ltd',
          price: 1789.45,
          change: 23.60,
          changePercent: 1.34,
          volume: 4567890,
          marketCap: 7450000000000, // 7.45 Lakh Crores
          peRatio: 26.8,
          dividendYield: 2.1,
          fiftyTwoWeekHigh: 1953.90,
          fiftyTwoWeekLow: 1351.65,
          exchange: 'NSE',
          currency: 'INR',
          sector: 'Information Technology',
          industry: 'IT Services'
        },
        'HDFCBANK': {
          symbol: 'HDFCBANK',
          name: 'HDFC Bank Ltd',
          price: 1698.75,
          change: -12.80,
          changePercent: -0.75,
          volume: 3456789,
          marketCap: 12890000000000, // 12.89 Lakh Crores
          peRatio: 19.2,
          dividendYield: 1.0,
          fiftyTwoWeekHigh: 1794.90,
          fiftyTwoWeekLow: 1363.55,
          exchange: 'NSE',
          currency: 'INR',
          sector: 'Financial Services',
          industry: 'Private Sector Bank'
        },
        'BHARTIARTL': {
          symbol: 'BHARTIARTL',
          name: 'Bharti Airtel Ltd',
          price: 1156.30,
          change: 28.45,
          changePercent: 2.52,
          volume: 6789012,
          marketCap: 6780000000000, // 6.78 Lakh Crores
          peRatio: 42.1,
          dividendYield: 0.7,
          fiftyTwoWeekHigh: 1222.00,
          fiftyTwoWeekLow: 865.35,
          exchange: 'NSE',
          currency: 'INR',
          sector: 'Telecommunication',
          industry: 'Telecom Services'
        }
      };

      const data = mockIndianStocks[symbol.toUpperCase()] || {
        symbol: symbol.toUpperCase(),
        name: `${symbol.toUpperCase()} Company Ltd`,
        price: 500 + Math.random() * 2000,
        change: (Math.random() - 0.5) * 100,
        changePercent: (Math.random() - 0.5) * 5,
        volume: Math.floor(1000000 + Math.random() * 10000000),
        marketCap: Math.floor(100000000000 + Math.random() * 5000000000000),
        peRatio: 15 + Math.random() * 30,
        dividendYield: Math.random() * 3,
        fiftyTwoWeekHigh: 600 + Math.random() * 2400,
        fiftyTwoWeekLow: 300 + Math.random() * 1200,
        exchange: 'NSE' as const,
        currency: 'INR' as const,
        sector: 'Technology',
        industry: 'Software'
      };

      return {
        symbol: data.symbol || symbol.toUpperCase(),
        name: data.name || `${symbol} Ltd`,
        price: Number(data.price) || 0,
        change: Number(data.change) || 0,
        changePercent: Number(data.changePercent) || 0,
        volume: Number(data.volume) || 0,
        marketCap: Number(data.marketCap) || 0,
        peRatio: Number(data.peRatio) || 0,
        dividendYield: Number(data.dividendYield) || 0,
        fiftyTwoWeekHigh: Number(data.fiftyTwoWeekHigh) || 0,
        fiftyTwoWeekLow: Number(data.fiftyTwoWeekLow) || 0,
        exchange: data.exchange || 'NSE',
        currency: 'INR',
        sector: data.sector || 'Technology',
        industry: data.industry || 'Software'
      };
    } catch (error) {
      console.error('Error fetching Indian stock quote:', error);
      throw new Error(`Failed to fetch stock quote for ${symbol}`);
    }
  },

  async searchStocks(query: string): Promise<IndianSearchResult[]> {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return [];
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const indianStocks: IndianSearchResult[] = [
        { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', exchange: 'NSE', sector: 'Oil & Gas' },
        { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', exchange: 'NSE', sector: 'Information Technology' },
        { symbol: 'INFY', name: 'Infosys Ltd', exchange: 'NSE', sector: 'Information Technology' },
        { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', exchange: 'NSE', sector: 'Financial Services' },
        { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', exchange: 'NSE', sector: 'Telecommunication' },
        { symbol: 'ITC', name: 'ITC Ltd', exchange: 'NSE', sector: 'FMCG' },
        { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', exchange: 'NSE', sector: 'FMCG' },
        { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', exchange: 'NSE', sector: 'Financial Services' },
        { symbol: 'LT', name: 'Larsen & Toubro Ltd', exchange: 'NSE', sector: 'Construction' },
        { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', exchange: 'NSE', sector: 'Paints' },
        { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', exchange: 'NSE', sector: 'Automobile' },
        { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', exchange: 'NSE', sector: 'Financial Services' },
        { symbol: 'TITAN', name: 'Titan Company Ltd', exchange: 'NSE', sector: 'Consumer Goods' },
        { symbol: 'NESTLEIND', name: 'Nestle India Ltd', exchange: 'NSE', sector: 'FMCG' },
        { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd', exchange: 'NSE', sector: 'Cement' }
      ];

      const filtered = indianStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase()) ||
        stock.sector.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);

      return filtered;
    } catch (error) {
      console.error('Error searching Indian stocks:', error);
      return [];
    }
  },

  // Helper function to format Indian currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  },

  // Helper function to format large numbers in Indian style (Crores/Lakhs)
  formatMarketCap(amount: number): string {
    if (amount >= 10000000000) { // 1000 Crores
      return `₹${(amount / 10000000000).toFixed(2)} Lakh Cr`;
    } else if (amount >= 10000000) { // 1 Crore
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) { // 1 Lakh
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  }
};
