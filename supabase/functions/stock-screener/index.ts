
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScreenerRequest {
  filters: {
    marketCap?: { min?: number; max?: number };
    pe?: { min?: number; max?: number };
    dividend?: { min?: number; max?: number };
    volume?: { min?: number; max?: number };
    price?: { min?: number; max?: number };
    sector?: string[];
    exchange?: string[];
  };
  saveAs?: string;
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

    const { data: { user } } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '') ?? ''
    );

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { filters, saveAs }: ScreenerRequest = await req.json();
    
    console.log(`Running stock screener with filters:`, filters);

    // Mock stock universe for demonstration
    const mockStocks = [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, marketCap: 2800000000000, pe: 28.5, dividend: 0.96, volume: 50000000, sector: 'Technology' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 380.00, marketCap: 2900000000000, pe: 30.2, dividend: 2.72, volume: 25000000, sector: 'Technology' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 140.50, marketCap: 1800000000000, pe: 25.8, dividend: 0, volume: 30000000, sector: 'Technology' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.75, marketCap: 1500000000000, pe: 45.2, dividend: 0, volume: 35000000, sector: 'Consumer Discretionary' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 250.00, marketCap: 800000000000, pe: 65.5, dividend: 0, volume: 40000000, sector: 'Consumer Discretionary' },
      { symbol: 'JPM', name: 'JPMorgan Chase', price: 155.25, marketCap: 450000000000, pe: 12.5, dividend: 4.00, volume: 15000000, sector: 'Financial Services' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', price: 162.50, marketCap: 425000000000, pe: 18.2, dividend: 4.04, volume: 8000000, sector: 'Healthcare' },
      { symbol: 'V', name: 'Visa Inc.', price: 265.75, marketCap: 550000000000, pe: 32.1, dividend: 1.80, volume: 6000000, sector: 'Financial Services' },
    ];

    // Apply filters
    let filteredStocks = mockStocks.filter(stock => {
      if (filters.marketCap?.min && stock.marketCap < filters.marketCap.min) return false;
      if (filters.marketCap?.max && stock.marketCap > filters.marketCap.max) return false;
      if (filters.pe?.min && stock.pe < filters.pe.min) return false;
      if (filters.pe?.max && stock.pe > filters.pe.max) return false;
      if (filters.dividend?.min && stock.dividend < filters.dividend.min) return false;
      if (filters.dividend?.max && stock.dividend > filters.dividend.max) return false;
      if (filters.volume?.min && stock.volume < filters.volume.min) return false;
      if (filters.volume?.max && stock.volume > filters.volume.max) return false;
      if (filters.price?.min && stock.price < filters.price.min) return false;
      if (filters.price?.max && stock.price > filters.price.max) return false;
      if (filters.sector?.length && !filters.sector.includes(stock.sector)) return false;
      
      return true;
    });

    // Add additional metrics
    filteredStocks = filteredStocks.map(stock => ({
      ...stock,
      roa: Math.random() * 20,
      roe: Math.random() * 25,
      debtToEquity: Math.random() * 2,
      currentRatio: 1 + Math.random() * 2,
      priceToBook: Math.random() * 5,
      earningsGrowth: (Math.random() - 0.5) * 40,
      revenueGrowth: (Math.random() - 0.2) * 30,
    }));

    // Save results if requested
    if (saveAs && user) {
      await supabase
        .from('screener_results')
        .insert({
          user_id: user.id,
          name: saveAs,
          filters,
          results: filteredStocks
        });
    }

    console.log(`Screener found ${filteredStocks.length} stocks matching criteria`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        results: filteredStocks,
        count: filteredStocks.length,
        filters 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Stock screener error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
