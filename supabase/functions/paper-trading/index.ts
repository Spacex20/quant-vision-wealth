
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TradeRequest {
  accountId: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  orderType: 'market' | 'limit' | 'stop' | 'stop_limit';
  price?: number;
  stopPrice?: number;
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

    const tradeData: TradeRequest = await req.json();
    
    console.log(`Processing ${tradeData.side} order for ${tradeData.symbol}`);

    // Verify account ownership
    const { data: account, error: accountError } = await supabase
      .from('paper_accounts')
      .select('*')
      .eq('id', tradeData.accountId)
      .eq('user_id', user.id)
      .single();

    if (accountError || !account) {
      throw new Error('Account not found or unauthorized');
    }

    // Get current market price
    const marketDataResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/market-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({ symbol: tradeData.symbol })
    });

    const marketData = await marketDataResponse.json();
    if (!marketData.success) {
      throw new Error('Unable to get market data');
    }

    const currentPrice = marketData.data.price;
    const executionPrice = tradeData.orderType === 'market' ? currentPrice : (tradeData.price || currentPrice);

    // Calculate trade value
    const tradeValue = executionPrice * tradeData.quantity;

    // Check buying power for buy orders
    if (tradeData.side === 'buy' && account.current_balance < tradeValue) {
      throw new Error('Insufficient buying power');
    }

    // Check position for sell orders
    if (tradeData.side === 'sell') {
      const { data: position } = await supabase
        .from('paper_positions')
        .select('quantity')
        .eq('account_id', tradeData.accountId)
        .eq('symbol', tradeData.symbol)
        .single();

      if (!position || position.quantity < tradeData.quantity) {
        throw new Error('Insufficient position to sell');
      }
    }

    // Create order record
    const { data: order, error: orderError } = await supabase
      .from('paper_orders')
      .insert({
        account_id: tradeData.accountId,
        symbol: tradeData.symbol,
        order_type: tradeData.orderType,
        side: tradeData.side,
        quantity: tradeData.quantity,
        price: tradeData.price,
        stop_price: tradeData.stopPrice,
        status: 'filled', // Immediately fill for paper trading
        filled_price: executionPrice,
        filled_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      throw new Error('Failed to create order');
    }

    // Update account balance
    const balanceChange = tradeData.side === 'buy' ? -tradeValue : tradeValue;
    await supabase
      .from('paper_accounts')
      .update({ 
        current_balance: account.current_balance + balanceChange,
        total_pnl: account.total_pnl + (tradeData.side === 'sell' ? tradeValue - (account.current_balance * 0.1) : 0) // Mock P&L
      })
      .eq('id', tradeData.accountId);

    // Update or create position
    const { data: existingPosition } = await supabase
      .from('paper_positions')
      .select('*')
      .eq('account_id', tradeData.accountId)
      .eq('symbol', tradeData.symbol)
      .single();

    if (existingPosition) {
      const newQuantity = tradeData.side === 'buy' 
        ? existingPosition.quantity + tradeData.quantity
        : existingPosition.quantity - tradeData.quantity;

      if (newQuantity === 0) {
        // Close position
        await supabase
          .from('paper_positions')
          .delete()
          .eq('id', existingPosition.id);
      } else {
        // Update position
        const newAvgPrice = tradeData.side === 'buy'
          ? ((existingPosition.avg_price * existingPosition.quantity) + (executionPrice * tradeData.quantity)) / newQuantity
          : existingPosition.avg_price;

        await supabase
          .from('paper_positions')
          .update({
            quantity: newQuantity,
            avg_price: newAvgPrice,
            current_price: currentPrice,
            unrealized_pnl: (currentPrice - newAvgPrice) * newQuantity
          })
          .eq('id', existingPosition.id);
      }
    } else if (tradeData.side === 'buy') {
      // Create new position
      await supabase
        .from('paper_positions')
        .insert({
          account_id: tradeData.accountId,
          symbol: tradeData.symbol,
          quantity: tradeData.quantity,
          avg_price: executionPrice,
          current_price: currentPrice,
          unrealized_pnl: (currentPrice - executionPrice) * tradeData.quantity
        });
    }

    console.log(`Order executed: ${tradeData.side} ${tradeData.quantity} ${tradeData.symbol} at $${executionPrice}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        order,
        executionPrice,
        message: `${tradeData.side.toUpperCase()} order executed successfully`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Paper trading error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
