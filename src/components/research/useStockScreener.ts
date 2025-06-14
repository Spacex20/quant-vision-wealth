
import { useState } from "react";
import { marketDataService, CompanyFundamentals } from "@/services/marketDataService";

export interface ScreenerCriteria {
  sector?: string;
  minMarketCap?: number;
  maxMarketCap?: number;
  minPE?: number;
  maxPE?: number;
  minDividendYield?: number;
  maxDividendYield?: number;
  minPrice?: number;
  maxPrice?: number;
  minVolume?: number;
  maxVolume?: number;
}

export function useStockScreener() {
  const [criteria, setCriteria] = useState<ScreenerCriteria>({
    minMarketCap: 0,
    maxMarketCap: 5000,
    minPE: 0,
    maxPE: 50,
    minDividendYield: 0,
    maxDividendYield: 10,
    minPrice: 0,
    maxPrice: 1000,
    minVolume: 0,
    maxVolume: 1e8
  });
  const [results, setResults] = useState<CompanyFundamentals[]>([]);
  const [loading, setLoading] = useState(false);

  const runScreener = async () => {
    setLoading(true);
    try {
      const mockSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'PYPL', 'CRM'];
      const stocks: CompanyFundamentals[] = [];
      for (const symbol of mockSymbols) {
        const fundamentals = await marketDataService.getCompanyFundamentals(symbol);
        // Simulate price/volume
        const quote = await marketDataService.getRealTimeQuote(symbol);
        // Filtering
        if (
          (!criteria.sector || fundamentals.sector === criteria.sector) &&
          (!criteria.minMarketCap || fundamentals.marketCap / 1e9 >= criteria.minMarketCap) &&
          (!criteria.maxMarketCap || fundamentals.marketCap / 1e9 <= criteria.maxMarketCap) &&
          (!criteria.minPE || fundamentals.peRatio >= criteria.minPE) &&
          (!criteria.maxPE || fundamentals.peRatio <= criteria.maxPE) &&
          (!criteria.minDividendYield || fundamentals.dividendYield >= criteria.minDividendYield) &&
          (!criteria.maxDividendYield || fundamentals.dividendYield <= criteria.maxDividendYield) &&
          (!criteria.minPrice || quote.price >= criteria.minPrice) &&
          (!criteria.maxPrice || quote.price <= criteria.maxPrice) &&
          (!criteria.minVolume || quote.volume >= criteria.minVolume) &&
          (!criteria.maxVolume || quote.volume <= criteria.maxVolume)
        ) {
          stocks.push({
            ...fundamentals,
            price: quote.price,
            volume: quote.volume,
          } as CompanyFundamentals & { price: number; volume: number });
        }
      }
      setResults(stocks);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setCriteria({
      minMarketCap: 0,
      maxMarketCap: 5000,
      minPE: 0,
      maxPE: 50,
      minDividendYield: 0,
      maxDividendYield: 10,
      minPrice: 0,
      maxPrice: 1000,
      minVolume: 0,
      maxVolume: 1e8
    });
    setResults([]);
  };

  return { criteria, setCriteria, results, loading, runScreener, clearFilters, setResults };
}
