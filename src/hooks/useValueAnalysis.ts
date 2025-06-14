
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ValueAnalysis {
  dcf?: {
    intrinsicValue: number;
    currentPrice: number;
    upside: number;
    recommendation: 'BUY' | 'SELL' | 'HOLD';
  };
  dividendDiscount?: {
    intrinsicValue: number;
    currentPrice: number;
    upside: number;
    recommendation: 'BUY' | 'SELL' | 'HOLD';
  };
  graham?: {
    intrinsicValue: number;
    currentPrice: number;
    upside: number;
    recommendation: 'BUY' | 'SELL' | 'HOLD';
  };
  ratios?: {
    pe: number;
    pb: number;
    ps: number;
    peg: number;
    valuation: string;
  };
  overall?: {
    recommendation: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    summary: string;
  };
}

export function useValueAnalysis(symbol: string, analysisType: 'dcf' | 'dividend' | 'graham' | 'ratios' | 'all' = 'all') {
  return useQuery({
    queryKey: ['value-analysis', symbol, analysisType],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('value-analysis', {
        body: { symbol, analysisType }
      });
      
      if (error) throw error;
      return data as { success: boolean; analysis: ValueAnalysis };
    },
    enabled: !!symbol,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
