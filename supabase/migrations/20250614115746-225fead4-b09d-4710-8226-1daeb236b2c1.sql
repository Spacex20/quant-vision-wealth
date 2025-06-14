
-- 1. Create the user_portfolios table to store portfolios for each user
CREATE TABLE public.user_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_value NUMERIC NOT NULL DEFAULT 0,
  -- store array of asset allocations as JSONB (e.g. [{"symbol":"AAPL","name":"Apple","allocation":42}])
  assets JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 2. Enable row level security
ALTER TABLE public.user_portfolios ENABLE ROW LEVEL SECURITY;

-- 3. RLS: Only allow users to access their own portfolios
CREATE POLICY "Users can view their own portfolios"
  ON public.user_portfolios
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own portfolios"
  ON public.user_portfolios
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own portfolios"
  ON public.user_portfolios
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own portfolios"
  ON public.user_portfolios
  FOR DELETE
  USING (user_id = auth.uid());

-- 4. Automatically update updated_at on changes
CREATE OR REPLACE FUNCTION public.update_user_portfolios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_portfolios_updated_at
  BEFORE UPDATE ON public.user_portfolios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_portfolios_updated_at();
