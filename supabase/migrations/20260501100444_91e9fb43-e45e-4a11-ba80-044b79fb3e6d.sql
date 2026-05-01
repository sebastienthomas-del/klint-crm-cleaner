-- CRM contacts synced from HubSpot (and other CRMs later)
CREATE TABLE public.crm_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  provider TEXT NOT NULL DEFAULT 'hubspot',
  external_id TEXT NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  position TEXT,
  phone TEXT,
  linkedin_url TEXT,
  sector TEXT,
  company_size TEXT,
  last_activity_at TIMESTAMPTZ,
  raw JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider, external_id)
);

CREATE INDEX idx_crm_contacts_user_email ON public.crm_contacts (user_id, lower(email));
CREATE INDEX idx_crm_contacts_user_company ON public.crm_contacts (user_id, lower(company));

ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own crm contacts"
ON public.crm_contacts FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_crm_contacts_updated_at
BEFORE UPDATE ON public.crm_contacts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Duplicate groups
CREATE TYPE public.duplicate_status AS ENUM ('pending', 'merged', 'dismissed');

CREATE TABLE public.duplicate_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  confidence INTEGER NOT NULL CHECK (confidence BETWEEN 0 AND 100),
  reason TEXT NOT NULL,
  status public.duplicate_status NOT NULL DEFAULT 'pending',
  master_contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.duplicate_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own duplicate groups"
ON public.duplicate_groups FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_duplicate_groups_updated_at
BEFORE UPDATE ON public.duplicate_groups
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.duplicate_group_contacts (
  group_id UUID NOT NULL REFERENCES public.duplicate_groups(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, contact_id)
);

ALTER TABLE public.duplicate_group_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own duplicate group contacts"
ON public.duplicate_group_contacts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.duplicate_groups g
    WHERE g.id = group_id AND g.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.duplicate_groups g
    WHERE g.id = group_id AND g.user_id = auth.uid()
  )
);

-- Enrichment jobs
CREATE TYPE public.enrichment_status AS ENUM ('pending', 'done', 'failed');

CREATE TABLE public.enrichment_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  contact_id UUID NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  fields TEXT[] NOT NULL DEFAULT '{}',
  status public.enrichment_status NOT NULL DEFAULT 'pending',
  result JSONB NOT NULL DEFAULT '{}'::jsonb,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.enrichment_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own enrichment jobs"
ON public.enrichment_jobs FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_enrichment_jobs_updated_at
BEFORE UPDATE ON public.enrichment_jobs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();