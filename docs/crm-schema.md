# CRM Schema

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
| HubSpot forms | native form fields + hidden fields | set `lead_source=form`, set domain + lead type |
| Live chat | chat transcript identity | map transcript metadata to `source_campaign` |
| Scraper | raw lead JSON | normalize names, infer intent, set `website_domain=external_scraper` |
| Manual import | CSV | enforce required fields and enum validation |

## Deduplication

1. Primary key: normalized lowercase email
2. Fallback key: `phone + company` normalized
3. Upsert behavior: update existing contact/deal if matched

## Deal auto-create rule

Create deals when:
- `intent_score=high`, or
- `budget >= 5000`

All other leads remain contact-only until manually qualified.
