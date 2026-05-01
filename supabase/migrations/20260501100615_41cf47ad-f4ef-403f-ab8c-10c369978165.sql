CREATE UNIQUE INDEX IF NOT EXISTS idx_crm_connections_user_provider
ON public.crm_connections (user_id, provider);