
-- Create tables for Bloomberg-like terminal functionality

-- Trading accounts for simulated trading
CREATE TABLE public.trading_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  account_name TEXT NOT NULL DEFAULT 'Main Account',
  initial_balance DECIMAL(15,2) NOT NULL DEFAULT 100000.00,
  current_balance DECIMAL(15,2) NOT NULL DEFAULT 100000.00,
  total_pnl DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'USD',
  account_type TEXT NOT NULL DEFAULT 'simulated',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trading positions
CREATE TABLE public.trading_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.trading_accounts(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  position_type TEXT NOT NULL CHECK (position_type IN ('long', 'short')),
  quantity DECIMAL(15,6) NOT NULL,
  avg_entry_price DECIMAL(15,6) NOT NULL,
  current_price DECIMAL(15,6) NOT NULL DEFAULT 0,
  unrealized_pnl DECIMAL(15,2) NOT NULL DEFAULT 0,
  realized_pnl DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trading orders
CREATE TABLE public.trading_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.trading_accounts(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('market', 'limit', 'stop', 'stop_limit')),
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  quantity DECIMAL(15,6) NOT NULL,
  price DECIMAL(15,6),
  stop_price DECIMAL(15,6),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'filled', 'cancelled', 'rejected')),
  filled_quantity DECIMAL(15,6) NOT NULL DEFAULT 0,
  filled_price DECIMAL(15,6),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  filled_at TIMESTAMP WITH TIME ZONE
);

-- Watchlists for terminal
CREATE TABLE public.terminal_watchlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  symbols TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- News tracking
CREATE TABLE public.news_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  summary TEXT,
  source TEXT NOT NULL,
  author TEXT,
  url TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  symbols TEXT[] DEFAULT '{}',
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  relevance_score DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Market data cache for terminal
CREATE TABLE public.terminal_market_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  price DECIMAL(15,6) NOT NULL,
  change_amount DECIMAL(15,6) NOT NULL DEFAULT 0,
  change_percent DECIMAL(8,4) NOT NULL DEFAULT 0,
  volume BIGINT NOT NULL DEFAULT 0,
  market_cap BIGINT,
  pe_ratio DECIMAL(8,2),
  dividend_yield DECIMAL(6,4),
  high_52w DECIMAL(15,6),
  low_52w DECIMAL(15,6),
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(symbol)
);

-- Enable RLS
ALTER TABLE public.trading_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terminal_watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terminal_market_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trading accounts
CREATE POLICY "Users can view their own trading accounts"
  ON public.trading_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trading accounts"
  ON public.trading_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trading accounts"
  ON public.trading_accounts FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for trading positions
CREATE POLICY "Users can view positions from their accounts"
  ON public.trading_positions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.trading_accounts 
    WHERE id = account_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create positions in their accounts"
  ON public.trading_positions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.trading_accounts 
    WHERE id = account_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update positions in their accounts"
  ON public.trading_positions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.trading_accounts 
    WHERE id = account_id AND user_id = auth.uid()
  ));

-- RLS Policies for trading orders
CREATE POLICY "Users can view orders from their accounts"
  ON public.trading_orders FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.trading_accounts 
    WHERE id = account_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create orders in their accounts"
  ON public.trading_orders FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.trading_accounts 
    WHERE id = account_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update orders in their accounts"
  ON public.trading_orders FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.trading_accounts 
    WHERE id = account_id AND user_id = auth.uid()
  ));

-- RLS Policies for watchlists
CREATE POLICY "Users can view their own watchlists"
  ON public.terminal_watchlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own watchlists"
  ON public.terminal_watchlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlists"
  ON public.terminal_watchlists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watchlists"
  ON public.terminal_watchlists FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for news (public read access)
CREATE POLICY "Anyone can view news articles"
  ON public.news_articles FOR SELECT
  TO PUBLIC
  USING (true);

-- RLS Policies for market data (public read access)
CREATE POLICY "Anyone can view market data"
  ON public.terminal_market_data FOR SELECT
  TO PUBLIC
  USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_trading_accounts_updated_at
  BEFORE UPDATE ON public.trading_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_trading_positions_updated_at
  BEFORE UPDATE ON public.trading_positions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_trading_orders_updated_at
  BEFORE UPDATE ON public.trading_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_terminal_watchlists_updated_at
  BEFORE UPDATE ON public.terminal_watchlists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_trading_positions_account_id ON public.trading_positions(account_id);
CREATE INDEX idx_trading_orders_account_id ON public.trading_orders(account_id);
CREATE INDEX idx_trading_orders_status ON public.trading_orders(status);
CREATE INDEX idx_terminal_market_data_symbol ON public.terminal_market_data(symbol);
CREATE INDEX idx_news_articles_published_at ON public.news_articles(published_at DESC);
CREATE INDEX idx_news_articles_symbols ON public.news_articles USING GIN(symbols);
