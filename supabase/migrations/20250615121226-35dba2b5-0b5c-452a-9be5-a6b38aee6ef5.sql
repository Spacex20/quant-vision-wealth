
-- Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_channel_created ON messages(channel_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_strategy_clones_strategy ON strategy_clones(strategy_id);
CREATE INDEX IF NOT EXISTS idx_performance_snapshots_user ON performance_snapshots(user_id, snapshot_at DESC);

-- Add RLS policies for data security
CREATE POLICY "Users can view their own strategy clones" ON strategy_clones
  FOR SELECT USING (cloned_by = auth.uid() OR original_owner = auth.uid());

CREATE POLICY "Users can clone public strategies" ON strategy_clones
  FOR INSERT WITH CHECK (cloned_by = auth.uid());

-- Add seed data for demo purposes
INSERT INTO performance_snapshots (user_id, returns, sharpe_ratio, volatility, drawdown) 
SELECT 
  id,
  (random() * 30 - 5)::numeric, -- Random returns between -5% and 25%
  (random() * 2 + 0.5)::numeric, -- Sharpe ratio 0.5-2.5
  (random() * 20 + 10)::numeric, -- Volatility 10-30%
  (random() * 15 + 5)::numeric   -- Drawdown 5-20%
FROM profiles 
WHERE is_curated_trader = true
ON CONFLICT DO NOTHING;

-- Update some profiles to be curated traders for demo
UPDATE profiles 
SET is_curated_trader = true, 
    bio = CASE 
      WHEN id = (SELECT id FROM profiles LIMIT 1 OFFSET 0) THEN 'Value investing specialist with 15+ years experience'
      WHEN id = (SELECT id FROM profiles LIMIT 1 OFFSET 1) THEN 'Growth stock expert focusing on tech sector'
      ELSE 'Quantitative trader with algorithmic strategies'
    END
WHERE id IN (SELECT id FROM profiles LIMIT 3);
