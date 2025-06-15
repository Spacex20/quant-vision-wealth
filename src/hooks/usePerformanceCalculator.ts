
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetrics {
  returns: number;
  sharpe_ratio: number;
  volatility: number;
  drawdown: number;
}

export function usePerformanceCalculator(userId?: string, strategyId?: string) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateMetrics = async () => {
    if (!userId && !strategyId) return;

    setIsLoading(true);
    try {
      // Simulate performance calculation (in a real app, this would be more complex)
      const returns = Math.random() * 30 - 5; // -5% to 25%
      const volatility = Math.random() * 20 + 10; // 10% to 30%
      const sharpe_ratio = returns / volatility;
      const drawdown = Math.random() * 15 + 5; // 5% to 20%

      const newMetrics = {
        returns: Number(returns.toFixed(2)),
        sharpe_ratio: Number(sharpe_ratio.toFixed(2)),
        volatility: Number(volatility.toFixed(2)),
        drawdown: Number(drawdown.toFixed(2))
      };

      setMetrics(newMetrics);

      // Save to database
      if (userId || strategyId) {
        await supabase
          .from('performance_snapshots')
          .insert({
            user_id: userId,
            strategy_id: strategyId,
            ...newMetrics
          });
      }
    } catch (error) {
      console.error('Error calculating performance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId || strategyId) {
      calculateMetrics();
    }
  }, [userId, strategyId]);

  return { metrics, isLoading, recalculate: calculateMetrics };
}
