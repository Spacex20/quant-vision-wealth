
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

interface NewsRequest {
  symbols?: string[];
  limit?: number;
  sentiment?: string;
}

interface MarketDataRequest {
  symbols: string[];
  refresh?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { action, ...params } = await req.json();

    switch (action) {
      case "fetch_news":
        return await fetchNews(supabase, params as NewsRequest);
      case "update_market_data":
        return await updateMarketData(supabase, params as MarketDataRequest);
      case "execute_trade":
        return await executeTrade(supabase, params);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error("Bloomberg Terminal API Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

async function fetchNews(supabase: any, params: NewsRequest) {
  try {
    let query = supabase
      .from("news_articles")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(params.limit || 50);

    if (params.symbols && params.symbols.length > 0) {
      query = query.overlaps("symbols", params.symbols);
    }

    if (params.sentiment && params.sentiment !== "all") {
      query = query.eq("sentiment", params.sentiment);
    }

    const { data, error } = await query;

    if (error) throw error;

    // If no data exists, create some mock news data
    if (!data || data.length === 0) {
      const mockNews = [
        {
          title: "Market Opens Higher Amid Economic Optimism",
          content: "Stock markets opened higher today as investors showed renewed confidence in economic recovery.",
          summary: "Markets show positive momentum at opening bell",
          source: "Bloomberg Terminal",
          published_at: new Date().toISOString(),
          symbols: params.symbols || ["SPY", "QQQ"],
          sentiment: "positive",
          relevance_score: 0.8
        },
        {
          title: "Federal Reserve Maintains Current Interest Rate Policy", 
          content: "The Federal Reserve announced it will maintain current interest rates following the latest policy meeting.",
          summary: "Fed keeps rates unchanged in latest decision",
          source: "Reuters Terminal",
          published_at: new Date(Date.now() - 3600000).toISOString(),
          symbols: ["SPY", "TLT"],
          sentiment: "neutral",
          relevance_score: 0.9
        }
      ];

      // Insert mock data
      const { data: insertedData, error: insertError } = await supabase
        .from("news_articles")
        .insert(mockNews)
        .select();

      if (insertError) throw insertError;
      
      return new Response(
        JSON.stringify({ success: true, data: insertedData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    throw new Error(`Failed to fetch news: ${error.message}`);
  }
}

async function updateMarketData(supabase: any, params: MarketDataRequest) {
  try {
    const marketDataPromises = params.symbols.map(async (symbol) => {
      // Mock market data (in real implementation, would fetch from actual API)
      const mockPrice = 100 + Math.random() * 100;
      const mockChange = (Math.random() - 0.5) * 10;
      
      const marketData = {
        symbol,
        price: mockPrice,
        change_amount: mockChange,
        change_percent: (mockChange / mockPrice) * 100,
        volume: Math.floor(Math.random() * 10000000),
        market_cap: Math.floor(mockPrice * 1000000000),
        pe_ratio: 15 + Math.random() * 20,
        dividend_yield: Math.random() * 5,
        high_52w: mockPrice * (1.2 + Math.random() * 0.3),
        low_52w: mockPrice * (0.7 + Math.random() * 0.2),
        last_updated: new Date().toISOString()
      };

      // Upsert market data
      const { data, error } = await supabase
        .from("terminal_market_data")
        .upsert(marketData, { onConflict: "symbol" })
        .select()
        .single();

      if (error) throw error;
      return data;
    });

    const results = await Promise.all(marketDataPromises);

    return new Response(
      JSON.stringify({ success: true, data: results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    throw new Error(`Failed to update market data: ${error.message}`);
  }
}

async function executeTrade(supabase: any, params: any) {
  try {
    const { 
      user_id, 
      account_id, 
      symbol, 
      order_type, 
      side, 
      quantity, 
      price, 
      stop_price 
    } = params;

    // Validate user has access to account
    const { data: account, error: accountError } = await supabase
      .from("trading_accounts")
      .select("*")
      .eq("id", account_id)
      .eq("user_id", user_id)
      .single();

    if (accountError || !account) {
      throw new Error("Invalid account or access denied");
    }

    // Create order
    const orderData = {
      account_id,
      symbol,
      order_type,
      side,
      quantity: parseFloat(quantity),
      price: price ? parseFloat(price) : null,
      stop_price: stop_price ? parseFloat(stop_price) : null,
      status: "pending"
    };

    const { data: order, error: orderError } = await supabase
      .from("trading_orders")
      .insert(orderData)
      .select()
      .single();

    if (orderError) throw orderError;

    // For demo purposes, immediately "fill" market orders
    if (order_type === "market") {
      const executionPrice = price || (100 + Math.random() * 100);
      
      const { error: updateError } = await supabase
        .from("trading_orders")
        .update({
          status: "filled",
          filled_quantity: quantity,
          filled_price: executionPrice,
          filled_at: new Date().toISOString()
        })
        .eq("id", order.id);

      if (updateError) throw updateError;

      // Update or create position
      const { data: existingPosition } = await supabase
        .from("trading_positions")
        .select("*")
        .eq("account_id", account_id)
        .eq("symbol", symbol)
        .single();

      if (existingPosition) {
        // Update existing position
        const newQuantity = side === "buy" 
          ? existingPosition.quantity + parseFloat(quantity)
          : existingPosition.quantity - parseFloat(quantity);
        
        const newAvgPrice = side === "buy"
          ? ((existingPosition.avg_entry_price * existingPosition.quantity) + (executionPrice * parseFloat(quantity))) / newQuantity
          : existingPosition.avg_entry_price;

        const { error: positionError } = await supabase
          .from("trading_positions")
          .update({
            quantity: newQuantity,
            avg_entry_price: newAvgPrice,
            current_price: executionPrice,
            unrealized_pnl: (executionPrice - newAvgPrice) * newQuantity
          })
          .eq("id", existingPosition.id);

        if (positionError) throw positionError;
      } else {
        // Create new position
        const { error: positionError } = await supabase
          .from("trading_positions")
          .insert({
            account_id,
            symbol,
            position_type: side === "buy" ? "long" : "short",
            quantity: parseFloat(quantity),
            avg_entry_price: executionPrice,
            current_price: executionPrice,
            unrealized_pnl: 0
          });

        if (positionError) throw positionError;
      }

      // Update account balance
      const balanceChange = side === "buy" 
        ? -(executionPrice * parseFloat(quantity))
        : (executionPrice * parseFloat(quantity));

      const { error: balanceError } = await supabase
        .from("trading_accounts")
        .update({
          current_balance: account.current_balance + balanceChange
        })
        .eq("id", account_id);

      if (balanceError) throw balanceError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Order ${order_type === "market" ? "executed" : "placed"} successfully`,
        order_id: order.id 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    throw new Error(`Failed to execute trade: ${error.message}`);
  }
}
