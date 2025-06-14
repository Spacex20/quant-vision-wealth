
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalyticsRequest {
  portfolioId: string;
  timeframe?: 'daily' | 'weekly' | 'monthly';
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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { portfolioId, timeframe = 'daily' }: AnalyticsRequest = await req.json();
    
    console.log(`Calculating analytics for portfolio ${portfolioId}`);

    // Get portfolio data
    const { data: portfolio, error: portfolioError } = await supabase
      .from('user_portfolios')
      .select('*')
      .eq('id', portfolioId)
      .single();

    if (portfolioError || !portfolio) {
      throw new Error('Portfolio not found');
    }

    // Calculate portfolio metrics
    const assets = portfolio.assets as Array<{symbol: string, allocation: number}>;
    let totalReturn = 0;
    let volatility = 0;
    let beta = 0;
    
    for (const asset of assets) {
      // Fetch market data for each asset
      const marketDataResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/market-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify({ symbol: asset.symbol })
      });

      const marketData = await marketDataResponse.json();
      if (marketData.success) {
        const weight = asset.allocation / 100;
        totalReturn += marketData.data.changePercent * weight;
        volatility += Math.pow(marketData.data.changePercent * weight, 2);
        beta += 1.2 * weight; // Mock beta calculation
      }
    }

    volatility = Math.sqrt(volatility);
    const sharpeRatio = totalReturn / (volatility || 1);
    const maxDrawdown = Math.min(-2, totalReturn - 5); // Mock calculation

    const analytics = {
      portfolioId,
      totalReturn,
      volatility,
      sharpeRatio,
      beta,
      maxDrawdown,
      valueAtRisk: volatility * -1.65, // 95% VaR
      alpha: totalReturn - (0.02 + beta * 0.08), // Mock alpha calculation
      informationRatio: sharpeRatio * 0.8,
      treynorRatio: totalReturn / beta,
      sortinoRatio: totalReturn / Math.max(volatility * 0.6, 0.01),
      calmarRatio: totalReturn / Math.abs(maxDrawdown),
      timestamp: Date.now()
    };

    // Store analytics in database
    await supabase
      .from('portfolio_analytics')
      .upsert({
        portfolio_id: portfolioId,
        date: new Date().toISOString().split('T')[0],
        total_value: portfolio.total_value,
        daily_return: totalReturn,
        cumulative_return: totalReturn * 252, // Annualized
        volatility,
        sharpe_ratio: sharpeRatio,
        max_drawdown: maxDrawdown,
        analytics_data: analytics
      });

    console.log(`Analytics calculated for portfolio ${portfolioId}`);

    return new Response(
      JSON.stringify({ success: true, analytics }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Portfolio analytics error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
