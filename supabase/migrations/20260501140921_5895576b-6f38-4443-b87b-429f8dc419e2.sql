-- =========================================
-- ENUMS
-- =========================================
DO $$ BEGIN
  CREATE TYPE public.plan_tier AS ENUM ('starter', 'growth', 'scale', 'enterprise');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.credit_tx_type AS ENUM ('debit', 'credit', 'grant', 'rollover', 'refund');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.import_status AS ENUM ('uploaded', 'analyzing', 'cleaned', 'imported', 'failed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.report_period AS ENUM ('weekly', 'monthly');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.suggestion_status AS ENUM ('pending', 'accepted', 'dismissed', 'expired');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.contact_change_type AS ENUM ('job_change', 'company_change', 'email_bounce', 'unsubscribed', 'left_company');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.company_signal_type AS ENUM ('funding', 'ma', 'hiring', 'expansion', 'bankruptcy', 'rename');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =========================================
-- 1. crm_contacts: ajout colonnes scoring
-- =========================================
ALTER TABLE public.crm_contacts
  ADD COLUMN IF NOT EXISTS quality_score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quality_breakdown jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS last_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS is_inactive boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_status text;

CREATE INDEX IF NOT EXISTS idx_crm_contacts_user_score ON public.crm_contacts(user_id, quality_score);

-- =========================================
-- 2. quality_score_history (santé CRM macro)
-- =========================================
CREATE TABLE IF NOT EXISTS public.quality_score_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  snapshot_date date NOT NULL DEFAULT (now()::date),
  avg_score numeric(5,2) NOT NULL,
  contacts_total integer NOT NULL DEFAULT 0,
  duplicates_total integer NOT NULL DEFAULT 0,
  inactive_total integer NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, snapshot_date)
);
ALTER TABLE public.quality_score_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own quality history" ON public.quality_score_history
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =========================================
-- 3. contact_changes (Module 2 monitoring)
-- =========================================
CREATE TABLE IF NOT EXISTS public.contact_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  contact_id uuid NOT NULL,
  change_type public.contact_change_type NOT NULL,
  previous_value text,
  new_value text,
  source text NOT NULL DEFAULT 'linkedin',
  detected_at timestamptz NOT NULL DEFAULT now(),
  acknowledged boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
ALTER TABLE public.contact_changes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own contact changes" ON public.contact_changes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_contact_changes_user_detected ON public.contact_changes(user_id, detected_at DESC);

-- =========================================
-- 4. company_signals (signaux Pappers/externes)
-- =========================================
CREATE TABLE IF NOT EXISTS public.company_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  company_name text NOT NULL,
  signal_type public.company_signal_type NOT NULL,
  title text NOT NULL,
  description text,
  source_url text,
  detected_at timestamptz NOT NULL DEFAULT now(),
  acknowledged boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
ALTER TABLE public.company_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own company signals" ON public.company_signals
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_company_signals_user_detected ON public.company_signals(user_id, detected_at DESC);

-- =========================================
-- 5. reactivation_leads (Module 3)
-- =========================================
CREATE TABLE IF NOT EXISTS public.reactivation_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  contact_id uuid NOT NULL,
  score integer NOT NULL,
  reason text NOT NULL,
  trigger text,
  recommended_action text,
  status text NOT NULL DEFAULT 'open',
  detected_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
ALTER TABLE public.reactivation_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own reactivation leads" ON public.reactivation_leads
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_reactivation_user_score ON public.reactivation_leads(user_id, score DESC);

-- =========================================
-- 6. import_jobs (Module 5 pré-import)
-- =========================================
CREATE TABLE IF NOT EXISTS public.import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  filename text NOT NULL,
  storage_path text NOT NULL,
  cleaned_storage_path text,
  rows_total integer NOT NULL DEFAULT 0,
  duplicates_found integer NOT NULL DEFAULT 0,
  invalid_emails integer NOT NULL DEFAULT 0,
  unknown_companies integer NOT NULL DEFAULT 0,
  status public.import_status NOT NULL DEFAULT 'uploaded',
  column_mapping jsonb NOT NULL DEFAULT '{}'::jsonb,
  report jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own import jobs" ON public.import_jobs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_import_jobs_updated_at BEFORE UPDATE ON public.import_jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage bucket for CSV uploads (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('imports', 'imports', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users read own import files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'imports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users upload own import files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'imports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own import files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'imports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own import files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'imports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =========================================
-- 7. credit_wallets + credit_transactions
-- =========================================
CREATE TABLE IF NOT EXISTS public.credit_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  plan public.plan_tier NOT NULL DEFAULT 'starter',
  balance integer NOT NULL DEFAULT 0,
  monthly_grant integer NOT NULL DEFAULT 5000,
  renews_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.credit_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own wallet read" ON public.credit_wallets
  FOR SELECT USING (auth.uid() = user_id);
CREATE TRIGGER trg_credit_wallets_updated_at BEFORE UPDATE ON public.credit_wallets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  wallet_id uuid NOT NULL REFERENCES public.credit_wallets(id) ON DELETE CASCADE,
  type public.credit_tx_type NOT NULL,
  amount integer NOT NULL,
  action text,
  description text,
  balance_after integer NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own credit tx read" ON public.credit_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_credit_tx_user_created ON public.credit_transactions(user_id, created_at DESC);

-- Auto-create wallet on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_wallet()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.credit_wallets (user_id, plan, balance, monthly_grant)
  VALUES (NEW.id, 'starter', 5000, 5000)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_wallet ON auth.users;
CREATE TRIGGER on_auth_user_created_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_wallet();

-- Atomic debit RPC (server-side credit consumption)
CREATE OR REPLACE FUNCTION public.consume_credits(
  _amount integer,
  _action text,
  _description text DEFAULT NULL,
  _metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _wallet public.credit_wallets%ROWTYPE;
  _new_balance integer;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  IF _amount <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF;

  SELECT * INTO _wallet FROM public.credit_wallets WHERE user_id = _uid FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.credit_wallets (user_id) VALUES (_uid)
    RETURNING * INTO _wallet;
  END IF;

  IF _wallet.balance < _amount THEN
    RAISE EXCEPTION 'Insufficient credits (balance=%, needed=%)', _wallet.balance, _amount;
  END IF;

  _new_balance := _wallet.balance - _amount;
  UPDATE public.credit_wallets SET balance = _new_balance WHERE id = _wallet.id;

  INSERT INTO public.credit_transactions
    (user_id, wallet_id, type, amount, action, description, balance_after, metadata)
  VALUES
    (_uid, _wallet.id, 'debit', _amount, _action, _description, _new_balance, _metadata);

  RETURN _new_balance;
END;
$$;

-- =========================================
-- 8. reports (hebdo / mensuel)
-- =========================================
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  period public.report_period NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  recipients text[] NOT NULL DEFAULT '{}',
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own reports" ON public.reports
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =========================================
-- 9. agent_suggestions (chatbot commandement)
-- =========================================
CREATE TABLE IF NOT EXISTS public.agent_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  trigger text NOT NULL,
  message text NOT NULL,
  actions jsonb NOT NULL DEFAULT '[]'::jsonb,
  priority integer NOT NULL DEFAULT 50,
  status public.suggestion_status NOT NULL DEFAULT 'pending',
  related_entity text,
  related_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
ALTER TABLE public.agent_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own suggestions" ON public.agent_suggestions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_user_status ON public.agent_suggestions(user_id, status, priority DESC);

-- =========================================
-- 10. audit_runs (audit flash initial)
-- =========================================
CREATE TABLE IF NOT EXISTS public.audit_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  contacts_scanned integer NOT NULL DEFAULT 0,
  duplicates_found integer NOT NULL DEFAULT 0,
  obsolete_contacts integer NOT NULL DEFAULT 0,
  hidden_opportunities integer NOT NULL DEFAULT 0,
  insights jsonb NOT NULL DEFAULT '[]'::jsonb,
  duration_ms integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own audit runs" ON public.audit_runs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
