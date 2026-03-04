# HubSpot Setup Checklist (Hotel-First v1)

This checklist is the source of truth for HubSpot Starter portal setup before enabling production ingestion.

## 1. Portal prerequisites
- Confirm HubSpot Starter is active in the production portal.
- Create a private app token with these scopes:
  - `crm.objects.contacts.read`
  - `crm.objects.contacts.write`
  - `crm.objects.deals.read`
  - `crm.objects.deals.write`
  - `crm.schemas.contacts.read`
  - `crm.schemas.deals.read`
- Store token in `integration/.env` as `HUBSPOT_ACCESS_TOKEN`.

## 2. Property creation order
Create contact properties in this order to avoid form mapping failures:

1. `lead_source` (dropdown: `form`, `chat`, `scraper`, `import`)
2. `lead_type` (dropdown: `hotel_group_booking`, `hotel_corporate_rate`, `warbot_access`, `creator_collab`, `client_project`)
3. `website_domain` (dropdown: `warbot.cloud`, `hotelsales.online`, `vibechain.ink`, `fullstacks.us`, `external_scraper`)
4. `intent_score` (dropdown: `low`, `medium`, `high`)
5. `qualification_status` (dropdown: `new`, `contacted`, `qualified`, `disqualified`)
6. `industry` (single-line text)
7. `budget` (number)
8. `location` (single-line text)
9. `source_campaign` (single-line text)

Create deal properties:
- `lead_source`
- `lead_type`
- `website_domain`
- `source_campaign`

## 3. Pipeline and stage mapping table
Create these pipelines and copy IDs into `integration/.env`:

| Pipeline name | Env key | Stages |
|---|---|---|
| Hotel Leads | `PIPELINE_HOTEL` | Lead Captured, Contacted, Interested, Proposal Sent, Rooms Blocked, Closed Won, Closed Lost |
| Creator Partnerships | `PIPELINE_CREATOR` | Lead Captured, Qualified, Brand Match, Negotiation, Closed Won, Closed Lost |
| AI Clients | `PIPELINE_AI` | Lead Captured, Discovery Scheduled, Solution Drafted, Proposal Sent, Closed Won, Closed Lost |
| Warbot Users | `PIPELINE_WARBOT` | Lead Captured, Eligibility Reviewed, Access Provisioned, Active, Converted, Churned |

Required stage env keys:
- `STAGE_DEFAULT_LEAD_CAPTURED`
- Optional stage IDs from `integration/.env.example` for downstream stage updates.

## 4. Forms build checklist
Create five forms in HubSpot:
- `group_booking_intake`
- `corporate_rate_request`
- `warbot_access_request`
- `creator_collaboration_intake`
- `client_project_intake`

Required hidden fields on every form:
- `website_domain`
- `lead_source` (default `form`)
- `lead_type`
- `source_campaign` (optional campaign attribution)

## 5. Embed checklist
- Use snippets in `forms/embeds/`.
- Replace `PORTAL_ID` and `FORM_ID`.
- Verify hidden fields are set by embed script before submit.
- Confirm test submission writes expected `website_domain`, `lead_source`, and `lead_type` values.

## 6. Integration runtime checklist
- Copy `integration/.env.example` to `integration/.env`.
- Set required vars: token, pipeline IDs, `STAGE_DEFAULT_LEAD_CAPTURED`.
- Optional hardening vars:
  - `HUBSPOT_MAX_RETRIES`
  - `HUBSPOT_RETRY_BACKOFF_MS`
  - `DEAD_LETTER_FILE`
- Run `npm test`.
- Start service with `npm start` and verify `GET /health`.

## 7. Go-live checklist
- Submit at least 1 production-like payload for:
  - `hotel_group_booking`
  - `hotel_corporate_rate`
- Confirm high-intent lead creates contact + deal.
- Confirm low-intent lead creates contact only.
- Confirm duplicate submission updates existing contact/deal.
- Confirm dashboard panels show source + domain attribution.
