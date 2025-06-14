
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MarketDataRequest {
  symbol: string;
  forceRefresh?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { symbol, forceRefresh = false }: MarketDataRequest = await req.json();
    
    console.log(`Fetching market data for ${symbol}, forceRefresh: ${forceRefresh}`);

    // Check cache first unless forced refresh
    if (!forceRefresh) {
      const { data: cached } = await supabase
        .from('market_data_cache')
        .select('*')
        .eq('symbol', symbol)
        .gte('last_updated', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // 5 minutes cache
        .single();

      if (cached) {
        console.log(`Returning cached data for ${symbol}`);
        return new Response(
          JSON.stringify({ success: true, data: cached.data, cached: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Fetch fresh data from API
    const apiKey = Deno.env.get('MARKET_DATA_API_KEY');
    if (!apiKey) {
      throw new Error('Market data API key not configured');
    }

    // Mock market data for demonstration (replace with real API)
    const mockData = {
      symbol,
      price: 100 + Math.random() * 200,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 10000000),
      marketCap: Math.floor(Math.random() * 1000000000000),
      pe: 10 + Math.random() * 30,
      dividend: Math.random() * 5,
      high52: 150 + Math.random() * 100,
      low52: 50 + Math.random() * 50,
      timestamp: Date.now()
    };

    // Cache the data
    await supabase
      .from('market_data_cache')
      .upsert({
        symbol,
        data: mockData,
        last_updated: new Date().toISOString()
      });

    console.log(`Cached fresh data for ${symbol}`);

    return new Response(
      JSON.stringify({ success: true, data: mockData, cached: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Market data error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
