-- API Keys table
CREATE TABLE public.api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  permissions TEXT[] DEFAULT ARRAY['read', 'write'],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own api keys"
  ON public.api_keys FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX api_keys_key_hash_idx ON public.api_keys(key_hash);
CREATE INDEX api_keys_user_id_idx ON public.api_keys(user_id);

-- Webhooks table (pour notifier les CRM externes des événements Kléa)
CREATE TABLE public.api_webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] DEFAULT ARRAY['contact.created', 'duplicate.detected', 'merge.completed'],
  secret TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_triggered_at TIMESTAMPTZ
);

ALTER TABLE public.api_webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own webhooks"
  ON public.api_webhooks FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX api_webhooks_user_id_idx ON public.api_webhooks(user_id);
