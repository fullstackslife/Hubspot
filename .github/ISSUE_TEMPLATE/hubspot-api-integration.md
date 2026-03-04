---
name: HubSpot API Integration
about: Implement automated lead ingestion from n8n and scrapers
---

## Objective
Create service for pushing leads from workflows into HubSpot.

## Tracking metadata
- Milestone: `M06`, `M07`, or `M08`
- Label: exactly one `milestone:mXX`
- Label: exactly one `type:*`
- Label: exactly one `priority:*`

## Features
- `create_or_update_contact`
- `create_or_update_deal`
- `update_pipeline_stage`
- `tag_lead`

## Deliverables
- API ingestion endpoint
- Upsert and dedupe logic
- Deal auto-create routing
- Retry/error handling strategy

## Acceptance criteria
- [ ] Contact upsert works for form and scraper payloads
- [ ] Deal creation triggers on high intent leads
- [ ] Duplicate suppression works (email and phone+company)
- [ ] Error paths are logged and retryable
