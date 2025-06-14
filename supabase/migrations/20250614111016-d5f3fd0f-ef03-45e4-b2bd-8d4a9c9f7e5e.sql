
-- Extend the existing profiles table with investment-specific fields

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS risk_tolerance VARCHAR(20) CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
ADD COLUMN IF NOT EXISTS investment_experience VARCHAR(20) CHECK (investment_experience IN ('beginner', 'intermediate', 'advanced', 'expert')),
ADD COLUMN IF NOT EXISTS investment_goals TEXT[],
ADD COLUMN IF NOT EXISTS annual_income_range VARCHAR(30),
ADD COLUMN IF NOT EXISTS net_worth_range VARCHAR(30),
ADD COLUMN IF NOT EXISTS time_horizon VARCHAR(20),
ADD COLUMN IF NOT EXISTS preferred_sectors TEXT[],
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- (Optional) Add unique username constraint if storing usernames in profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS username VARCHAR(50),
ADD CONSTRAINT unique_username UNIQUE (username);

-- Ensure updated_at timestamp is always current
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_profiles_updated_at();
