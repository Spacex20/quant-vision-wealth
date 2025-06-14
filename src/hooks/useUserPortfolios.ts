
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface UserPortfolio {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
  total_value: number;
  assets: {
    symbol: string;
    name: string;
    allocation: number;
    // Optionally:
    shares?: number;
    avgCost?: number;
  }[];
}

// Fetches all portfolios for the logged-in user.
export function useUserPortfolios() {
  const { user } = useAuth();

  const {
    data: portfolios,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user_portfolios", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_portfolios")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as UserPortfolio[];
    },
    enabled: !!user,
  });

  return { portfolios: portfolios ?? [], isLoading, error, refetch };
}
