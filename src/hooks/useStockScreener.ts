
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ScreenerFilters {
  marketCap?: { min?: number; max?: number };
  pe?: { min?: number; max?: number };
  dividend?: { min?: number; max?: number };
  volume?: { min?: number; max?: number };
  price?: { min?: number; max?: number };
  sector?: string[];
  exchange?: string[];
}

export interface ScreenerResult {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  pe: number;
  dividend: number;
  volume: number;
  sector: string;
  roa: number;
  roe: number;
  debtToEquity: number;
  currentRatio: number;
  priceToBook: number;
  earningsGrowth: number;
  revenueGrowth: number;
}

export function useStockScreener() {
  return useMutation({
    mutationFn: async ({ filters, saveAs }: { filters: ScreenerFilters; saveAs?: string }) => {
      const { data, error } = await supabase.functions.invoke('stock-screener', {
        body: { filters, saveAs }
      });
      
      if (error) throw error;
      return data as { success: boolean; results: ScreenerResult[]; count: number };
    },
  });
}

export function useSavedScreeners() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['saved-screeners', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('screener_results')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
