# CRM Schema (Authoritative Contract)

This schema is the single ingestion contract for HubSpot forms, scraper payloads, and n8n workflows.

## Canonical lead object

```json
{
  "email": "string",
  "firstname": "string",
  "lastname": "string",
  "phone": "string|null",
  "company": "string|null",
  "website_domain": "warbot.cloud|hotelsales.online|vibechain.ink|fullstacks.us|external_scraper",
  "lead_source": "form|chat|scraper|import",
  "lead_type": "hotel_group_booking|hotel_corporate_rate|warbot_access|creator_collab|client_project",
  "industry": "string|null",
  "location": "string|null",
  "budget": "number|null",
  "timeline": "string|null",
  "intent_score": "low|medium|high",
  "pipeline_name": "Hotel Leads|Creator Partnerships|AI Clients|Warbot Users",
  "pipeline_stage": "string|null",
  "source_campaign": "string|null",
  "raw_payload_ref": "string|null"
}
```

## Hotel-first routing rules
- `hotel_group_booking` -> `Hotel Leads`
- `hotel_corporate_rate` -> `Hotel Leads`
- Auto-create deal if:
  - `intent_score = high`, or
  - `budget >= 5000`

## HubSpot custom properties
Create these custom contact properties:
- `lead_source` (dropdown): `form`, `chat`, `scraper`, `import`
- `lead_type` (dropdown): `hotel_group_booking`, `hotel_corporate_rate`, `warbot_access`, `creator_collab`, `client_project`
- `website_domain` (dropdown): domain list + `external_scraper`
- `industry` (single-line text)
- `budget` (number)
- `location` (single-line text)
- `intent_score` (dropdown): `low`, `medium`, `high`
- `source_campaign` (single-line text)
- `qualification_status` (dropdown): `new`, `contacted`, `qualified`, `disqualified`

Create these custom deal properties:
- `lead_source`
- `lead_type`
- `website_domain`
- `source_campaign`

## Field mapping by source

| Source | Input fields | Required transform |
|---|---|---|
| HubSpot forms | native fields + hidden fields | set `lead_source=form`, set domain + lead type |
| Live chat | identity + transcript metadata | map metadata to `source_campaign` |
| Scraper | raw lead JSON | normalize names, infer intent, set `website_domain=external_scraper` |
| Manual import | CSV | enforce required fields and enum validation |

## Idempotency and dedupe
1. Primary key: normalized lowercase `email`
2. Fallback key: normalized `phone + company`
3. Upsert behavior: update existing contact/deal if matched

## Retry and dead-letter policy
Retryable HubSpot responses:
- 429, 500, 502, 503, 504

If retries are exhausted or payload validation fails, write dead-letter NDJSON entry with:
- `timestamp`
- `stage` (`validation` or `hubspot_write`)
- `error`
- `payload`
