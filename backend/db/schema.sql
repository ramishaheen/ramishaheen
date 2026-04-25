-- Mythos Intelligence System schema (PostgreSQL)

CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  role_id UUID REFERENCES roles(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE agent_configs (
  id UUID PRIMARY KEY,
  agent_name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  permission_scope TEXT NOT NULL,
  escalation_required BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE llm_providers (
  id UUID PRIMARY KEY,
  provider_name TEXT NOT NULL,
  model_name TEXT NOT NULL,
  endpoint_url TEXT,
  encrypted_api_key TEXT,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  private_mode BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE system_queries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  question TEXT NOT NULL,
  domain_hint TEXT,
  urgency TEXT,
  mode_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE agent_runs (
  id UUID PRIMARY KEY,
  query_id UUID REFERENCES system_queries(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  notes TEXT
);

CREATE TABLE agent_steps (
  id UUID PRIMARY KEY,
  run_id UUID REFERENCES agent_runs(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  step_order INT NOT NULL,
  status TEXT NOT NULL,
  output_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE evidence_sources (
  id UUID PRIMARY KEY,
  source_type TEXT NOT NULL,
  source_name TEXT NOT NULL,
  connection_status TEXT NOT NULL,
  health_status TEXT NOT NULL,
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY,
  source_id UUID REFERENCES evidence_sources(id),
  title TEXT NOT NULL,
  checksum TEXT,
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  classification TEXT,
  storage_ref TEXT
);

CREATE TABLE document_chunks (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding_vector TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE system_logs (
  id UUID PRIMARY KEY,
  event_time TIMESTAMPTZ NOT NULL,
  severity TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL
);

CREATE TABLE access_logs (
  id UUID PRIMARY KEY,
  event_time TIMESTAMPTZ NOT NULL,
  user_id UUID,
  action TEXT NOT NULL,
  resource TEXT,
  source_ip INET,
  status TEXT NOT NULL
);

CREATE TABLE api_logs (
  id UUID PRIMARY KEY,
  event_time TIMESTAMPTZ NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  actor_id UUID,
  response_code INT NOT NULL,
  latency_ms INT NOT NULL
);

CREATE TABLE security_alerts (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  alert_type TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  status TEXT NOT NULL,
  evidence_ref TEXT,
  escalation_route TEXT
);

CREATE TABLE risk_findings (
  id UUID PRIMARY KEY,
  query_id UUID REFERENCES system_queries(id),
  impact_score INT NOT NULL,
  likelihood_score INT NOT NULL,
  risk_level TEXT NOT NULL,
  rationale TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cyber_findings (
  id UUID PRIMARY KEY,
  query_id UUID REFERENCES system_queries(id),
  summary TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  affected_assets JSONB,
  timeline JSONB,
  possible_cause TEXT,
  control_weakness TEXT,
  recommended_action TEXT,
  confidence_score NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE standards_mapping (
  id UUID PRIMARY KEY,
  finding_id UUID,
  finding_type TEXT NOT NULL,
  framework TEXT NOT NULL,
  control_id TEXT NOT NULL,
  mapping_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE memory_items (
  id UUID PRIMARY KEY,
  key TEXT NOT NULL,
  lesson TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  sensitive BOOLEAN NOT NULL DEFAULT FALSE,
  approved_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE response_history (
  id UUID PRIMARY KEY,
  query_id UUID REFERENCES system_queries(id) ON DELETE CASCADE,
  response_payload JSONB NOT NULL,
  confidence_score NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_trail (
  id UUID PRIMARY KEY,
  event_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actor_id UUID,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata JSONB
);

CREATE TABLE data_source_health (
  id UUID PRIMARY KEY,
  source_id UUID REFERENCES evidence_sources(id),
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL,
  latency_ms INT,
  details JSONB
);
