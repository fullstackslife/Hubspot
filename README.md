# HubSpot Starter Lead Engine

This repository implements a multi-vertical HubSpot Starter lead engine for:
- `warbot.cloud`
- `hotelsales.online`
- `vibechain.ink`
- `fullstacks.us`

Hotel-first rollout is the v1 production path.

## What is included
- Unified CRM schema and mapping docs
- HubSpot setup and rollout runbooks
- n8n workflow templates for ingest, dedupe, routing, and error handling
- Node.js integration service for HubSpot API ingestion
- GitHub milestone/label setup scripts with issue and PR templates
- Sample payloads for each lead type and failure cases

## Repository layout
- `docs/`: schema, setup checklists, pipelines, reporting, rollout, milestone tracking
- `workflows/n8n/`: importable n8n workflow JSON templates
- `forms/embeds/`: embeddable HubSpot form snippets per domain
- `integration/`: API ingestion service and tests
- `.github/ISSUE_TEMPLATE/`: issue templates aligned to milestones
- `.github/PULL_REQUEST_TEMPLATE.md`: DoD and milestone gate checklist
- `scripts/github/`: milestone setup and issue hygiene scripts
- `samples/`: example payloads for acceptance testing

## Quick start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   - Copy `integration/.env.example` to `integration/.env`
   - Set required values: `HUBSPOT_ACCESS_TOKEN`, pipeline IDs, `STAGE_DEFAULT_LEAD_CAPTURED`
   - Optionally set hardening vars: `HUBSPOT_MAX_RETRIES`, `HUBSPOT_RETRY_BACKOFF_MS`, `DEAD_LETTER_FILE`
3. Run tests:
   ```bash
   npm test
   ```
4. Run integration service:
   ```bash
   npm start
   ```
5. Create/update GitHub milestones and labels:
   ```bash
   npm run github:setup
   ```
6. Validate issue milestone/type/priority hygiene:
   ```bash
   npm run github:hygiene
   ```

## Runtime behavior
- `POST /ingest/lead`: validates payload, dedupes, upserts contact, and conditionally creates deal.
- `GET /health`: readiness endpoint.
- Deal auto-create rule: `intent_score=high` or `budget>=5000`.
- Retry policy for HubSpot API: 429/5xx with bounded retries and backoff.
- Failed payloads are written to dead-letter NDJSON for triage.

## Notes
- HubSpot pipeline and stage IDs are portal-specific and must be configured in `integration/.env`.
- Startup fails fast if required env variables are missing.
- Qualification and outreach remain manual in phase 1.
