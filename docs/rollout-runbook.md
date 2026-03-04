# Rollout Runbook

## Weekly GitHub milestone cadence

- M01 (2026-03-11): Repo governance and tracking setup
- M02 (2026-03-18): CRM data model freeze
- M03 (2026-03-25): Pipelines and stages configured
- M04 (2026-04-01): Form schema and hidden tracking spec
- M05 (2026-04-08): Multi-domain form embeds live
- M06 (2026-04-15): Ingestion service production-ready
- M07 (2026-04-22): n8n workflows imported and connected
- M08 (2026-04-29): Lead qualification and deal automation
- M09 (2026-05-06): Reporting and attribution dashboard
- M10 (2026-05-13): Go-live operations and weekly cadence

Milestone close gate:
- Every linked issue has exactly one GitHub milestone.
- Every linked issue has exactly one `type:*` label and one `priority:*` label.
- Milestone DoD evidence is attached in issue comments/PRs before close.

## Phase 1: Foundation lock
- Finalize canonical lead schema in `docs/crm-schema.md`.
- Configure HubSpot properties, pipelines, and stage IDs.
- Populate `integration/.env` with production values.

Exit criteria:
- Required env validation passes at service start.
- Property and pipeline IDs are documented and reviewed.

## Phase 2: Hotel forms + ingest live
- Deploy hotel form embeds from `forms/embeds/hotelsales.online.html`.
- Route form submissions through n8n ingest workflow into `/ingest/lead`.
- Validate hidden fields and canonical mapping.

Exit criteria:
- `hotel_group_booking` test lead creates contact + deal when high intent.
- `hotel_corporate_rate` low-intent lead stays contact-only.

## Phase 3: Automation hardening
- Import n8n workflows from `workflows/n8n/`.
- Enable retry handling for HubSpot 429/5xx failures.
- Enable dead-letter path for non-retryable or exhausted retries.

Exit criteria:
- Retry behavior verified with simulated 429/503 responses.
- Dead-letter file receives structured records for failed payloads.

## Phase 4: Reporting and weekly operations
- Configure dashboards in `docs/reporting-dashboard.md`.
- Start weekly pipeline and attribution review.

Exit criteria:
- Dashboard includes source, conversion, pipeline value, and revenue attribution.
- Weekly operating rhythm documented in team process.

## Phase 5: Multi-domain extension
- Reuse same schema and ingestion contract for Warbot, Creator, AI flows.
- Add new forms/workflows without changing canonical field names.

Exit criteria:
- New verticals ingest without schema forks.
- Existing reports continue to aggregate all lead types.

## Error handling policy
Retryable status codes:
- 429, 500, 502, 503, 504

Retry behavior:
- Max retries: `HUBSPOT_MAX_RETRIES` (default `3`)
- Backoff: exponential from `HUBSPOT_RETRY_BACKOFF_MS` (default `500ms`)

Dead-letter record format (NDJSON):
```json
{
  "timestamp": "ISO-8601",
  "stage": "validation|hubspot_write",
  "error": "string",
  "payload": {}
}
```

Triage procedure:
1. Review dead-letter entries daily.
2. Fix payload or config root cause.
3. Re-submit corrected payload through `/ingest/lead`.

