
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    console.log('Processing price alerts...');

    // Get all active alerts
    const { data: alerts, error: alertsError } = await supabase
      .from('alerts')
      .select('*')
      .eq('is_active', true)
      .is('triggered_at', null);

    if (alertsError) {
      throw new Error('Failed to fetch alerts');
    }

    if (!alerts || alerts.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No active alerts to process' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let triggeredCount = 0;

    // Process each alert
    for (const alert of alerts) {
      try {
        // Get current market data
        const marketDataResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/market-data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
          },
          body: JSON.stringify({ symbol: alert.symbol })
        });

        const marketData = await marketDataResponse.json();
        if (!marketData.success) continue;

        const currentPrice = marketData.data.price;
        let triggered = false;

        // Check alert conditions
        switch (alert.alert_type) {
          case 'price':
            if (alert.condition_operator && alert.condition_value) {
              switch (alert.condition_operator) {
                case '>':
                  triggered = currentPrice > alert.condition_value;
                  break;
                case '<':
                  triggered = currentPrice < alert.condition_value;
                  break;
                case '>=':
                  triggered = currentPrice >= alert.condition_value;
                  break;
                case '<=':
                  triggered = currentPrice <= alert.condition_value;
                  break;
                case '=':
                  triggered = Math.abs(currentPrice - alert.condition_value) < 0.01;
                  break;
              }
            }
            break;
          case 'volume':
            triggered = marketData.data.volume > (alert.condition_value || 0);
            break;
          case 'technical':
            // Mock technical indicator trigger
            triggered = Math.random() > 0.95; // 5% chance
            break;
        }

        if (triggered) {
          // Mark alert as triggered
          await supabase
            .from('alerts')
            .update({
              triggered_at: new Date().toISOString(),
              is_active: false
            })
            .eq('id', alert.id);

          // Here you would send notification (email, push, etc.)
          console.log(`Alert triggered: ${alert.symbol} ${alert.condition_operator} ${alert.condition_value}`);
          triggeredCount++;
        }
      } catch (error) {
        console.error(`Error processing alert ${alert.id}:`, error);
      }
    }

    console.log(`Processed ${alerts.length} alerts, ${triggeredCount} triggered`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: alerts.length,
        triggered: triggeredCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Alerts processor error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
