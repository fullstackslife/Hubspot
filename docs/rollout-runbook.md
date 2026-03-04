# Rollout Runbook

## Phase 1: Foundation
- Configure custom properties
- Configure pipelines and stages
- Finalize form specs

Exit criteria:
- Property dictionary approved
- Pipeline IDs and stage IDs documented

## Phase 2: Site integration
- Embed forms on all domains
- Validate hidden fields and tracking

Exit criteria:
- 5/5 forms submit correctly from each domain environment

## Phase 3: Automation
- Deploy integration service
- Import n8n workflows
- Connect scraper feed and webhook triggers

Exit criteria:
- Contacts auto-upsert from scraper payloads
- Qualified leads auto-create deals

## Phase 4: Reporting and operations
- Publish HubSpot dashboard
- Establish weekly review ritual

Exit criteria:
- KPI dashboard shared and reviewed weekly

## Failure handling
- Retry transient HubSpot API failures up to 3 times in n8n
- Route persistent failures to dead-letter queue
- Review dead-letter queue daily
