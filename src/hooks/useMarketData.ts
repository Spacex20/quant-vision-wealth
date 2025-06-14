
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MarketDataResponse {
  success: boolean;
  data: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: number;
    pe: number;
    dividend: number;
    high52: number;
    low52: number;
    timestamp: number;
  };
  cached: boolean;
}

export function useMarketData(symbol: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['market-data', symbol],
    queryFn: async (): Promise<MarketDataResponse> => {
      const { data, error } = await supabase.functions.invoke('market-data', {
        body: { symbol }
      });
      
      if (error) throw error;
      return data;
    },
    enabled: enabled && !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // 1 minute
  });
}
