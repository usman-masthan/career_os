-- Ingestion, synchronization, canonical external-item mapping, and publishing.
create table public.integrations (
  id uuid primary key default gen_random_uuid(), key text not null unique, name text not null, platform text not null,
  status text not null default 'active' check (status in ('active','disabled')), config_schema jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.integration_accounts (
  id uuid primary key default gen_random_uuid(), integration_id uuid not null references public.integrations(id) on delete cascade,
  profile_id uuid not null references public.profile(id) on delete cascade, external_account_id text not null, display_name text,
  status text not null default 'connected' check (status in ('connected','paused','error','revoked')), credentials jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(integration_id, external_account_id), unique(integration_id, profile_id, external_account_id)
);
create table public.incoming_events (
  id uuid primary key default gen_random_uuid(), integration_account_id uuid not null references public.integration_accounts(id) on delete cascade,
  source_platform text not null, external_identifier text not null, event_type text, payload jsonb not null,
  payload_hash text, received_at timestamptz not null default now(), processed_at timestamptz, processing_status text not null default 'pending', error text,
  unique(integration_account_id, external_identifier), unique (integration_account_id, payload_hash)
);
create table public.sync_runs (
  id uuid primary key default gen_random_uuid(), integration_account_id uuid not null references public.integration_accounts(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued','running','succeeded','failed','cancelled')), cursor text,
  started_at timestamptz, finished_at timestamptz, items_seen integer not null default 0, items_changed integer not null default 0,
  error jsonb, created_at timestamptz not null default now()
);
create table public.external_items (
  id uuid primary key default gen_random_uuid(), integration_account_id uuid not null references public.integration_accounts(id) on delete cascade,
  source_platform text not null, external_identifier text not null, item_type text not null, canonical_table text, canonical_id uuid,
  source_url text, content_hash text, raw_data jsonb not null default '{}'::jsonb, source_created_at timestamptz, source_updated_at timestamptz,
  first_seen_at timestamptz not null default now(), last_seen_at timestamptz not null default now(), deleted_at timestamptz,
  unique(integration_account_id, item_type, external_identifier), unique (integration_account_id, item_type, content_hash)
);
create table public.publication_jobs (
  id uuid primary key default gen_random_uuid(), publication_id uuid references public.publications(id) on delete cascade,
  integration_account_id uuid not null references public.integration_accounts(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued','running','published','failed','cancelled')),
  idempotency_key text not null, scheduled_at timestamptz, started_at timestamptz, completed_at timestamptz,
  external_identifier text, result_url text, error jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(integration_account_id, idempotency_key), unique (integration_account_id, external_identifier)
);
create index incoming_events_pending_idx on public.incoming_events(processing_status, received_at);
create index sync_runs_account_idx on public.sync_runs(integration_account_id, created_at desc);
create index publication_jobs_queue_idx on public.publication_jobs(status, scheduled_at);
