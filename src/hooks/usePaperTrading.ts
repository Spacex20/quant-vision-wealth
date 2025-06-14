
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface PaperAccount {
  id: string;
  name: string;
  initial_balance: number;
  current_balance: number;
  total_pnl: number;
  created_at: string;
}

export interface PaperPosition {
  id: string;
  symbol: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  unrealized_pnl: number;
  realized_pnl: number;
}

export function usePaperAccounts() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['paper-accounts', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('paper_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PaperAccount[];
    },
    enabled: !!user,
  });
}

export function usePaperPositions(accountId: string) {
  return useQuery({
    queryKey: ['paper-positions', accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('paper_positions')
        .select('*')
        .eq('account_id', accountId);
      
      if (error) throw error;
      return data as PaperPosition[];
    },
    enabled: !!accountId,
  });
}

export function usePaperTrade() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tradeData: {
      accountId: string;
      symbol: string;
      side: 'buy' | 'sell';
      quantity: number;
      orderType: 'market' | 'limit';
      price?: number;
    }) => {
      const { data, error } = await supabase.functions.invoke('paper-trading', {
        body: tradeData
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['paper-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['paper-positions', variables.accountId] });
    },
  });
}
