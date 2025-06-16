
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { yfinanceService, YFinanceQuoteData, YFinanceHistoricalData, YFinanceFundamentals, BacktestRequest, BacktestResults } from "@/services/yfinanceService";

export function useYFinanceQuote(symbol: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['yfinance-quote', symbol],
    queryFn: () => yfinanceService.getQuote(symbol),
    enabled: enabled && !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // 1 minute
    retry: (failureCount, error) => {
      // Don't retry for invalid symbols
      if (error.message.includes('Invalid or delisted ticker')) {
        return false;
      }
      return failureCount < 3;
    }
  });
}

export function useYFinanceHistorical(
  symbol: string, 
  period: string = '1y', 
  interval: string = '1d',
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['yfinance-historical', symbol, period, interval],
    queryFn: () => yfinanceService.getHistorical(symbol, period, interval),
    enabled: enabled && !!symbol,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: (failureCount, error) => {
      if (error.message.includes('Invalid or delisted ticker')) {
        return false;
      }
      return failureCount < 2;
    }
  });
}

export function useYFinanceFundamentals(symbol: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['yfinance-fundamentals', symbol],
    queryFn: () => yfinanceService.getFundamentals(symbol),
    enabled: enabled && !!symbol,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: (failureCount, error) => {
      if (error.message.includes('Invalid or delisted ticker')) {
        return false;
      }
      return failureCount < 2;
    }
  });
}

export function useYFinanceMultipleQuotes(symbols: string[], enabled: boolean = true) {
  return useQuery({
    queryKey: ['yfinance-multiple-quotes', symbols.sort().join(',')],
    queryFn: () => yfinanceService.getMultipleQuotes(symbols),
    enabled: enabled && symbols.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  });
}

export function useYFinanceBacktest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BacktestRequest) => yfinanceService.runBacktest(request),
    onSuccess: (data, variables) => {
      // Invalidate and refetch backtest results if we want to cache them
      queryClient.invalidateQueries({ 
        queryKey: ['backtests', variables.symbols.join(','), variables.strategy] 
      });
    },
    onError: (error) => {
      console.error('Backtest mutation error:', error);
    }
  });
}

export function useSymbolValidation() {
  return useMutation({
    mutationFn: (symbol: string) => yfinanceService.validateSymbol(symbol),
    onError: (error) => {
      console.error('Symbol validation error:', error);
    }
  });
}

// Utility hook for batch operations
export function useYFinanceBatch() {
  const queryClient = useQueryClient();

  const refreshAllData = useMutation({
    mutationFn: async (symbols: string[]) => {
      // Clear cache and refetch all data for symbols
      yfinanceService.clearCache();
      
      // Invalidate all queries for these symbols
      symbols.forEach(symbol => {
        queryClient.invalidateQueries({ queryKey: ['yfinance-quote', symbol] });
        queryClient.invalidateQueries({ queryKey: ['yfinance-historical', symbol] });
        queryClient.invalidateQueries({ queryKey: ['yfinance-fundamentals', symbol] });
      });

      return { success: true, refreshedSymbols: symbols };
    }
  });

  return {
    refreshAllData,
    clearCache: () => {
      yfinanceService.clearCache();
      queryClient.clear();
    }
  };
}
