# HubSpot Starter Lead Engine

This repository implements a multi-vertical HubSpot Starter lead engine for:
- `warbot.cloud`
- `hotelsales.online`
- `vibechain.ink`
- `fullstacks.us`

## What is included
- Unified CRM schema and mapping docs
- HubSpot setup checklists (properties, pipelines, forms, reporting)
- n8n workflow templates for intake, dedupe, routing, and error handling
- Node.js integration service for HubSpot API ingestion
- GitHub milestone + issue templates for execution tracking

## Repository layout
- `docs/`: architecture, schema, forms, pipelines, reporting, rollout runbook
- `workflows/n8n/`: importable n8n workflow JSON templates
- `forms/embeds/`: embeddable HubSpot form snippet templates per domain
- `integration/`: API ingestion service and tests
- `.github/ISSUE_TEMPLATE/`: issue templates aligned to milestones
- `samples/`: example webhook payloads

## Quick start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   - Copy `integration/.env.example` to `integration/.env`
   - Set `HUBSPOT_ACCESS_TOKEN`
   - Set optional defaults (pipeline IDs, owner IDs)
3. Run tests:
   ```bash
   npm test
   ```
4. Run integration service:
   ```bash
   npm start
   ```

## Implementation status
- Foundation docs: complete
- Integration service: complete starter implementation
- n8n workflow templates: complete starter implementation
- Website embedding: template snippets provided
- HubSpot portal setup: manual steps documented in `docs/hubspot-setup-checklist.md`

## Notes
- HubSpot IDs for pipelines/stages/properties are portal-specific and must be configured in `integration/.env`.
- This implementation is semi-automated by design: qualification and outreach are manual.
