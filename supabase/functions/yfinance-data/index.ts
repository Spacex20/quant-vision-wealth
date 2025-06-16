import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  peRatio?: number;
  dividendYield?: number;
  high52Week?: number;
  low52Week?: number;
  timestamp: number;
}

interface OHLCData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface BacktestRequest {
  symbols: string[];
  strategy: string;
  startDate: string;
  endDate: string;
  initialAmount: number;
  parameters?: Record<string, any>;
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

    // Parse request body for all requests
    const body = await req.json();
    const { action, symbol, period, interval, ...requestData } = body;

    console.log(`yFinance API request - Action: ${action}, Symbol: ${symbol}`);

    switch (action) {
      case 'quote':
        return await handleQuoteRequest(supabase, symbol);
      
      case 'historical':
        return await handleHistoricalRequest(supabase, symbol, period || '1y', interval || '1d');
      
      case 'fundamentals':
        return await handleFundamentalsRequest(supabase, symbol);
      
      case 'backtest':
        return await handleBacktestRequest(supabase, requestData as BacktestRequest);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action parameter' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('yFinance API error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function handleQuoteRequest(supabase: any, symbol: string | null) {
  if (!symbol) {
    return new Response(
      JSON.stringify({ error: 'Symbol parameter required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Check cache first
  const { data: cached } = await supabase
    .from('yfinance_cache')
    .select('*')
    .eq('symbol', symbol)
    .eq('data_type', 'quote')
    .gte('expires_at', new Date().toISOString())
    .single();

  if (cached) {
    console.log(`Returning cached quote for ${symbol}`);
    return new Response(
      JSON.stringify({ success: true, data: cached.data, cached: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Fetch fresh data from yFinance
  const stockData = await fetchYFinanceQuote(symbol);
  
  // Cache the data (5 minutes TTL for quotes)
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  await supabase
    .from('yfinance_cache')
    .upsert({
      symbol,
      data_type: 'quote',
      data: stockData,
      expires_at: expiresAt,
      last_updated: new Date().toISOString()
    });

  console.log(`Cached fresh quote data for ${symbol}`);

  return new Response(
    JSON.stringify({ success: true, data: stockData, cached: false }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleHistoricalRequest(supabase: any, symbol: string | null, period: string, interval: string) {
  if (!symbol) {
    return new Response(
      JSON.stringify({ error: 'Symbol parameter required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const cacheKey = `${symbol}_${period}_${interval}`;
  
  // Check cache (longer TTL for historical data - 1 hour)
  const { data: cached } = await supabase
    .from('yfinance_cache')
    .select('*')
    .eq('symbol', cacheKey)
    .eq('data_type', 'historical')
    .gte('expires_at', new Date().toISOString())
    .single();

  if (cached) {
    console.log(`Returning cached historical data for ${symbol}`);
    return new Response(
      JSON.stringify({ success: true, data: cached.data, cached: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Fetch fresh historical data
  const historicalData = await fetchYFinanceHistorical(symbol, period, interval);
  
  // Cache the data
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  await supabase
    .from('yfinance_cache')
    .upsert({
      symbol: cacheKey,
      data_type: 'historical',
      data: historicalData,
      expires_at: expiresAt,
      last_updated: new Date().toISOString()
    });

  console.log(`Cached fresh historical data for ${symbol}`);

  return new Response(
    JSON.stringify({ success: true, data: historicalData, cached: false }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleFundamentalsRequest(supabase: any, symbol: string | null) {
  if (!symbol) {
    return new Response(
      JSON.stringify({ error: 'Symbol parameter required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Check cache (24 hour TTL for fundamentals)
  const { data: cached } = await supabase
    .from('yfinance_cache')
    .select('*')
    .eq('symbol', symbol)
    .eq('data_type', 'fundamentals')
    .gte('expires_at', new Date().toISOString())
    .single();

  if (cached) {
    console.log(`Returning cached fundamentals for ${symbol}`);
    return new Response(
      JSON.stringify({ success: true, data: cached.data, cached: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Fetch fresh fundamentals
  const fundamentals = await fetchYFinanceFundamentals(symbol);
  
  // Cache the data
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  await supabase
    .from('yfinance_cache')
    .upsert({
      symbol,
      data_type: 'fundamentals',
      data: fundamentals,
      expires_at: expiresAt,
      last_updated: new Date().toISOString()
    });

  console.log(`Cached fresh fundamentals for ${symbol}`);

  return new Response(
    JSON.stringify({ success: true, data: fundamentals, cached: false }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleBacktestRequest(supabase: any, request: BacktestRequest) {
  console.log('Starting backtest:', request);

  try {
    // Validate request
    if (!request.symbols || request.symbols.length === 0) {
      throw new Error('At least one symbol is required for backtesting');
    }

    // Fetch historical data for all symbols
    const historicalData: Record<string, OHLCData[]> = {};
    
    for (const symbol of request.symbols) {
      const data = await fetchYFinanceHistorical(symbol, 
        `${new Date(request.startDate).getFullYear()}-${new Date(request.endDate).getFullYear()}`,
        '1d'
      );
      historicalData[symbol] = data.filter((item: OHLCData) => {
        const itemDate = new Date(item.date);
        return itemDate >= new Date(request.startDate) && itemDate <= new Date(request.endDate);
      });
    }

    // Run backtest
    const backtestResults = await runBacktest(historicalData, request);

    // Save backtest results
    const { data: savedBacktest, error } = await supabase
      .from('backtest_results')
      .insert({
        symbols: request.symbols,
        strategy: request.strategy,
        start_date: request.startDate,
        end_date: request.endDate,
        initial_amount: request.initialAmount,
        parameters: request.parameters || {},
        results: backtestResults,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving backtest:', error);
    }

    console.log('Backtest completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: backtestResults,
        backtestId: savedBacktest?.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Backtest error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function fetchYFinanceQuote(symbol: string): Promise<StockData> {
  // For demo purposes, return mock data that simulates yFinance structure
  // In production, you would use the actual yFinance Python API via a Python service
  
  console.log(`Fetching quote for ${symbol}`);
  
  // Simulate API delay for testing
  await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));

  // Check if symbol exists and is valid
  const validSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'INFY.NS', 'TCS.NS', 'RELIANCE.NS'];
  
  if (!validSymbols.includes(symbol)) {
    throw new Error(`Invalid or delisted ticker: ${symbol}`);
  }

  // Generate realistic mock data with some volatility
  const basePrice = symbol.includes('.NS') ? 1000 + Math.random() * 2000 : 100 + Math.random() * 200;
  const change = (Math.random() - 0.5) * 10;
  
  return {
    symbol,
    price: Number(basePrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(((change / basePrice) * 100).toFixed(2)),
    volume: Math.floor(Math.random() * 10000000),
    marketCap: Math.floor(Math.random() * 1000000000000),
    peRatio: 15 + Math.random() * 25,
    dividendYield: Math.random() * 5,
    high52Week: basePrice * (1.2 + Math.random() * 0.3),
    low52Week: basePrice * (0.7 + Math.random() * 0.2),
    timestamp: Date.now()
  };
}

async function fetchYFinanceHistorical(symbol: string, period: string, interval: string): Promise<OHLCData[]> {
  console.log(`Fetching historical data for ${symbol}, period: ${period}, interval: ${interval}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  // Check if symbol exists
  const validSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'INFY.NS', 'TCS.NS', 'RELIANCE.NS'];
  
  if (!validSymbols.includes(symbol)) {
    throw new Error(`Invalid or delisted ticker: ${symbol}`);
  }

  // Generate mock historical data
  const data: OHLCData[] = [];
  const basePrice = symbol.includes('.NS') ? 1000 : 100;
  let currentPrice = basePrice;
  
  // Generate data for the last 252 days (1 year of trading days)
  const days = period === '1y' ? 252 : period === '6m' ? 126 : 63;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const dailyChange = (Math.random() - 0.5) * 0.05; // ±5% daily change
    const open = currentPrice;
    const close = currentPrice * (1 + dailyChange);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000)
    });
    
    currentPrice = close;
  }
  
  return data;
}

async function fetchYFinanceFundamentals(symbol: string) {
  console.log(`Fetching fundamentals for ${symbol}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));

  // Check if symbol exists
  const validSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'INFY.NS', 'TCS.NS', 'RELIANCE.NS'];
  
  if (!validSymbols.includes(symbol)) {
    throw new Error(`Invalid or delisted ticker: ${symbol}`);
  }

  return {
    symbol,
    marketCap: Math.floor(Math.random() * 1000000000000),
    peRatio: 15 + Math.random() * 25,
    pegRatio: 1 + Math.random() * 2,
    priceToBook: 1 + Math.random() * 5,
    debtToEquity: Math.random() * 100,
    roe: Math.random() * 30,
    roa: Math.random() * 15,
    dividendYield: Math.random() * 5,
    payoutRatio: Math.random() * 80,
    revenue: Math.floor(Math.random() * 100000000000),
    netIncome: Math.floor(Math.random() * 20000000000),
    totalAssets: Math.floor(Math.random() * 500000000000),
    totalLiabilities: Math.floor(Math.random() * 300000000000),
    freeCashFlow: Math.floor(Math.random() * 30000000000),
    operatingCashFlow: Math.floor(Math.random() * 50000000000),
    bookValue: Math.random() * 100,
    enterpriseValue: Math.floor(Math.random() * 1200000000000),
    priceToSales: 1 + Math.random() * 10,
    priceToEarnings: 10 + Math.random() * 30,
    earningsGrowth: (Math.random() - 0.2) * 50,
    revenueGrowth: (Math.random() - 0.1) * 30,
    sector: symbol.includes('.NS') ? 'Technology' : 'Technology',
    industry: 'Software',
    employees: Math.floor(Math.random() * 200000),
    lastUpdated: new Date().toISOString()
  };
}

async function runBacktest(historicalData: Record<string, OHLCData[]>, request: BacktestRequest) {
  console.log(`Running ${request.strategy} backtest`);

  const { symbols, strategy, initialAmount, parameters = {} } = request;
  
  // Get the longest data series to determine date range
  const allDates = Object.values(historicalData)
    .flat()
    .map(item => item.date)
    .sort();
  
  const uniqueDates = [...new Set(allDates)];
  
  // Initialize portfolio
  let cash = initialAmount;
  let positions: Record<string, number> = {};
  let portfolioValues: Array<{ date: string, value: number, cash: number, positions: Record<string, number> }> = [];
  
  // Simple buy and hold strategy
  if (strategy === 'buy_and_hold') {
    const allocation = 1 / symbols.length;
    
    // Buy on first day
    const firstDate = uniqueDates[0];
    for (const symbol of symbols) {
      const symbolData = historicalData[symbol];
      const firstDayData = symbolData.find(d => d.date === firstDate);
      
      if (firstDayData) {
        const amountToInvest = initialAmount * allocation;
        const shares = Math.floor(amountToInvest / firstDayData.close);
        positions[symbol] = shares;
        cash -= shares * firstDayData.close;
      }
    }
  }
  
  // Calculate daily portfolio values
  for (const date of uniqueDates) {
    let totalValue = cash;
    
    for (const symbol of symbols) {
      const symbolData = historicalData[symbol];
      const dayData = symbolData.find(d => d.date === date);
      
      if (dayData && positions[symbol]) {
        totalValue += positions[symbol] * dayData.close;
      }
    }
    
    portfolioValues.push({
      date,
      value: totalValue,
      cash,
      positions: { ...positions }
    });
  }
  
  // Calculate performance metrics
  const finalValue = portfolioValues[portfolioValues.length - 1]?.value || initialAmount;
  const totalReturn = ((finalValue - initialAmount) / initialAmount) * 100;
  
  const returns = portfolioValues.slice(1).map((current, i) => {
    const previous = portfolioValues[i];
    return (current.value - previous.value) / previous.value;
  });
  
  const volatility = calculateVolatility(returns) * Math.sqrt(252) * 100; // Annualized
  const sharpeRatio = returns.length > 0 ? (totalReturn / 100) / (volatility / 100) : 0;
  const maxDrawdown = calculateMaxDrawdown(portfolioValues.map(p => p.value));
  
  return {
    strategy,
    symbols,
    initialAmount,
    finalValue,
    totalReturn,
    volatility,
    sharpeRatio,
    maxDrawdown,
    portfolioValues,
    trades: [], // For more complex strategies
    metrics: {
      winRate: 0,
      avgWin: 0,
      avgLoss: 0,
      profitFactor: 0,
      totalTrades: 0
    },
    startDate: request.startDate,
    endDate: request.endDate,
    duration: uniqueDates.length
  };
}

function calculateVolatility(returns: number[]): number {
  if (returns.length === 0) return 0;
  
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  return Math.sqrt(variance);
}

function calculateMaxDrawdown(values: number[]): number {
  let maxDrawdown = 0;
  let peak = values[0];
  
  for (const value of values) {
    if (value > peak) {
      peak = value;
    }
    const drawdown = (peak - value) / peak;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  }
  
  return maxDrawdown * 100;
}
