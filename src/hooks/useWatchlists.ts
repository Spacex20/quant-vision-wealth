
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Watchlist {
  id: string;
  name: string;
  description?: string;
  symbols: string[];
  created_at: string;
  updated_at: string;
}

export function useWatchlists() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['watchlists', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watchlists')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Watchlist[];
    },
    enabled: !!user,
  });
}

export function useCreateWatchlist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (watchlist: { name: string; description?: string; symbols?: string[] }) => {
      const { data, error } = await supabase
        .from('watchlists')
        .insert({
          user_id: user?.id,
          ...watchlist,
          symbols: watchlist.symbols || []
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists', user?.id] });
    },
  });
}

export function useUpdateWatchlist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Watchlist> }) => {
      const { data, error } = await supabase
        .from('watchlists')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists', user?.id] });
    },
  });
}
