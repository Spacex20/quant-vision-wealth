
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealTimeSubscriptionProps {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onPayload: (payload: any) => void;
  enabled?: boolean;
}

export function useRealTimeSubscription({
  table,
  event = '*',
  filter,
  onPayload,
  enabled = true
}: UseRealTimeSubscriptionProps) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!enabled) return;

    console.log(`Setting up real-time subscription for table: ${table}`);

    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes' as any,  // type assertion resolves TS error
        {
          event,
          schema: 'public',
          table,
          ...(filter && { filter }),
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          onPayload(payload);
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${table}:`, status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        console.log(`Cleaning up subscription for ${table}`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, event, filter, onPayload, enabled]);

  return channelRef.current;
}
