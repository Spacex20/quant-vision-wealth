
-- Create enum types for better data consistency
CREATE TYPE investment_experience AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE risk_tolerance AS ENUM ('conservative', 'moderate', 'aggressive');
CREATE TYPE asset_type AS ENUM ('stock', 'etf', 'bond', 'commodity', 'crypto', 'reit');
CREATE TYPE order_type AS ENUM ('market', 'limit', 'stop', 'stop_limit');
CREATE TYPE order_status AS ENUM ('pending', 'filled', 'cancelled', 'rejected');
CREATE TYPE alert_type AS ENUM ('price', 'volume', 'news', 'technical');

-- Create watchlists table
CREATE TABLE public.watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  symbols TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create stock screener results table
CREATE TABLE public.screener_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}',
  results JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  alert_type alert_type NOT NULL,
  condition_value NUMERIC,
  condition_operator VARCHAR(5) CHECK (condition_operator IN ('>', '<', '>=', '<=', '=')),
  message TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create research reports table
CREATE TABLE public.research_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  analysis_type VARCHAR(50) NOT NULL,
  recommendation VARCHAR(20) CHECK (recommendation IN ('buy', 'hold', 'sell')),
  target_price NUMERIC,
  risk_rating INTEGER CHECK (risk_rating BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create market data cache table
CREATE TABLE public.market_data_cache (
  symbol VARCHAR(10) PRIMARY KEY,
  data JSONB NOT NULL,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create paper trading accounts table
CREATE TABLE public.paper_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  initial_balance NUMERIC NOT NULL DEFAULT 100000,
  current_balance NUMERIC NOT NULL DEFAULT 100000,
  total_pnl NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create paper trading orders table
CREATE TABLE public.paper_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES paper_accounts(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  order_type order_type NOT NULL,
  side VARCHAR(4) NOT NULL CHECK (side IN ('buy', 'sell')),
  quantity INTEGER NOT NULL,
  price NUMERIC,
  stop_price NUMERIC,
  status order_status NOT NULL DEFAULT 'pending',
  filled_price NUMERIC,
  filled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create paper trading positions table
CREATE TABLE public.paper_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES paper_accounts(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  quantity INTEGER NOT NULL,
  avg_price NUMERIC NOT NULL,
  current_price NUMERIC NOT NULL DEFAULT 0,
  unrealized_pnl NUMERIC NOT NULL DEFAULT 0,
  realized_pnl NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(account_id, symbol)
);

-- Create research notebooks table (for Quant Lab)
CREATE TABLE public.research_notebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  cells JSONB NOT NULL DEFAULT '[]',
  language VARCHAR(20) NOT NULL DEFAULT 'javascript',
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create trading strategies table
CREATE TABLE public.trading_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language VARCHAR(20) NOT NULL DEFAULT 'javascript',
  parameters JSONB NOT NULL DEFAULT '{}',
  backtest_results JSONB DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create portfolio analytics table
CREATE TABLE public.portfolio_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES user_portfolios(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_value NUMERIC NOT NULL,
  daily_return NUMERIC NOT NULL DEFAULT 0,
  cumulative_return NUMERIC NOT NULL DEFAULT 0,
  volatility NUMERIC NOT NULL DEFAULT 0,
  sharpe_ratio NUMERIC NOT NULL DEFAULT 0,
  max_drawdown NUMERIC NOT NULL DEFAULT 0,
  analytics_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(portfolio_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screener_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_data_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user-specific data
CREATE POLICY "Users can manage their own watchlists" ON public.watchlists FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own screener results" ON public.screener_results FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own alerts" ON public.alerts FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own research reports" ON public.research_reports FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own paper accounts" ON public.paper_accounts FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own notebooks" ON public.research_notebooks FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own strategies" ON public.trading_strategies FOR ALL USING (user_id = auth.uid());

-- Create policies for related tables
CREATE POLICY "Users can manage orders for their accounts" ON public.paper_orders FOR ALL USING (
  account_id IN (SELECT id FROM public.paper_accounts WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage positions for their accounts" ON public.paper_positions FOR ALL USING (
  account_id IN (SELECT id FROM public.paper_accounts WHERE user_id = auth.uid())
);
CREATE POLICY "Users can view analytics for their portfolios" ON public.portfolio_analytics FOR ALL USING (
  portfolio_id IN (SELECT id FROM public.user_portfolios WHERE user_id = auth.uid())
);

-- Market data cache is public read-only
CREATE POLICY "Anyone can read market data cache" ON public.market_data_cache FOR SELECT TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX idx_watchlists_user_id ON public.watchlists(user_id);
CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_alerts_symbol ON public.alerts(symbol);
CREATE INDEX idx_research_reports_user_id ON public.research_reports(user_id);
CREATE INDEX idx_research_reports_symbol ON public.research_reports(symbol);
CREATE INDEX idx_market_data_cache_updated ON public.market_data_cache(last_updated);
CREATE INDEX idx_paper_accounts_user_id ON public.paper_accounts(user_id);
CREATE INDEX idx_paper_orders_account_id ON public.paper_orders(account_id);
CREATE INDEX idx_paper_positions_account_id ON public.paper_positions(account_id);
CREATE INDEX idx_portfolio_analytics_portfolio_date ON public.portfolio_analytics(portfolio_id, date);

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER watchlists_updated_at BEFORE UPDATE ON public.watchlists FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER research_reports_updated_at BEFORE UPDATE ON public.research_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER paper_accounts_updated_at BEFORE UPDATE ON public.paper_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER paper_positions_updated_at BEFORE UPDATE ON public.paper_positions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER research_notebooks_updated_at BEFORE UPDATE ON public.research_notebooks FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create function to clean old market data cache
CREATE OR REPLACE FUNCTION clean_old_market_data()
RETURNS void AS $$
BEGIN
  DELETE FROM public.market_data_cache 
  WHERE last_updated < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;
