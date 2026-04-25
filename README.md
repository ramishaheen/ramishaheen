# Mythos Intelligence System

Mythos Intelligence System is **a multi-agent intelligence orchestration system designed to deliver ultra-scale reasoning through expert agents, evidence verification, contradiction analysis, cybersecurity intelligence, and structured decision logic**.

It provides a general intelligence core plus a permanent defensive cybersecurity core (Autonomous Cybersecurity Watchtower), with auditable APIs and a Command Center UI.

---

## 1) Architecture

### Core Design
- **General Intelligence Core**: strategic analysis, decomposition, risk/decision support.
- **Cybersecurity Core**: defensive telemetry analysis and cyber risk reasoning.
- **Multi-Agent Orchestration**: orchestrator + specialized agents + contradiction/verification.
- **Evidence-First**: no fabricated evidence, explicit missing-data disclosures.
- **Executive Output**: structured, defensible, auditable responses.

### Agent Set
- Orchestrator Agent
- General Reasoning Agent
- Cybersecurity Agent
- Evidence Verification Agent
- Contradiction Agent
- Risk Analysis Agent
- Standards & Compliance Agent
- Executive Summary Agent
- Memory & Learning Agent

### Backend Services
- OrchestrationService
- ReasoningService
- CybersecurityService
- EvidenceService
- VerificationService
- RiskScoringService
- StandardsMappingService
- MemoryService
- LLMProviderService
- AuditTrailService

### Frontend Experience
- Glassmorphism Command Center with animated telemetry and gradient visual system.
- Interactive Deep Thinking mode cards with one-click toggles.
- Multi-view workspace tabs: Overview, Deep Analysis, Cyber Watchtower.
- Live agent activity statuses, confidence telemetry, evidence completeness meter, and decision panel.
- Responsive layout and explicit empty/error states for data-source disconnected scenarios.

---

## 2) Repository Structure

```text
.
├── backend
│   ├── db/schema.sql
│   └── src
│       ├── agents/prompts.ts
│       ├── app.ts
│       ├── index.ts
│       ├── middleware/auth.ts
│       ├── routes/mythos.ts
│       ├── services/*.ts
│       └── types/mythos.ts
├── frontend
│   └── src
│       ├── App.tsx
│       ├── api/mythos.ts
│       ├── components/ModeToggle.tsx
│       ├── types/mythos.ts
│       └── styles.css
├── .env.example
└── package.json
```

---

## 3) API Endpoints

Implemented endpoints:

- `POST /api/mythos/query`
- `GET /api/mythos/query/:id`
- `GET /api/mythos/history`
- `GET /api/mythos/evidence/:queryId`
- `GET /api/mythos/agents/status`
- `GET /api/mythos/cyber/alerts`
- `GET /api/mythos/cyber/findings`
- `GET /api/mythos/risk/dashboard`
- `POST /api/mythos/settings/llm-provider` (admin)
- `POST /api/mythos/settings/agents` (admin)
- `GET /api/mythos/audit-trail` (admin)

---

## 4) Security Controls Implemented

- Helmet headers
- CORS policy
- Rate limiting
- JSON payload limits
- Input validation (Zod)
- Admin-guarded settings endpoints
- API key secrecy via backend-only environment variables
- Audit-trail logging hooks
- No autonomous destructive action path in backend logic
- Defensive-only cybersecurity intent in service logic

---

## 5) Data Integrity & No-Fake-Data Policy

The system intentionally avoids synthetic evidence and demo alerts in normal mode:

- If no source is connected, outputs include **"Data source not connected."**
- If no evidence exists for a query, outputs include:
  **"No verified evidence is available in the system for this request."**

---

## 6) Database Schema

`backend/db/schema.sql` includes all required tables:

- users, roles, permissions
- agent_configs, llm_providers
- system_queries, agent_runs, agent_steps
- evidence_sources, documents, document_chunks
- system_logs, access_logs, api_logs
- security_alerts, risk_findings, cyber_findings
- standards_mapping, memory_items
- response_history, audit_trail, data_source_health

---

## 7) Local Setup

### Prerequisites
- Node.js 20+
- npm 10+
- PostgreSQL 15+ (for production integration)

### Install
```bash
npm install
```

### Configure
```bash
cp .env.example .env
# fill secrets and provider keys
```

### Run Backend
```bash
npm run -w backend dev
```

### Run Frontend
```bash
npm run -w frontend dev
```

---

## 8) Production Notes

- Wire `EvidenceService` to real connectors (DB, SIEM, document stores).
- Persist audit events to `audit_trail` table (currently in-memory in this scaffold).
- Add encrypted at-rest secret management for `llm_providers.encrypted_api_key`.
- Place critical workflow actions behind explicit human approval mechanisms.

---

## 9) Response Contract

Each query response includes:

- Executive Summary
- Deep Analysis
- Evidence Used
- Cybersecurity Implications
- Risk Level + rationale
- Recommendations
- Confidence Score
- Missing Data
- Assumptions
- Active Agents
- Evidence Availability

