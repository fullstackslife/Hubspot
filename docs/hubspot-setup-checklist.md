# HubSpot Setup Checklist

## 1. Portal prerequisites
- Confirm Starter plan active in production portal.
- Generate private app token with scopes:
  - `crm.objects.contacts.read/write`
  - `crm.objects.deals.read/write`
  - `crm.schemas.contacts.read`
  - `crm.schemas.deals.read`

## 2. Properties
- Create all custom properties from `docs/crm-schema.md`.
- Match internal names exactly:
  - `lead_source`, `lead_type`, `website_domain`, `industry`, `budget`, `location`, `intent_score`, `source_campaign`, `qualification_status`

## 3. Pipelines
Create deal pipelines:
- `Hotel Leads`
- `Creator Partnerships`
- `AI Clients`
- `Warbot Users`

Create stages per plan and copy resulting stage IDs into `integration/.env`.

## 4. Forms
Create five forms:
- `group_booking_intake`
- `corporate_rate_request`
- `warbot_access_request`
- `creator_collaboration_intake`
- `client_project_intake`

Add shared hidden fields:
- `website_domain`
- `lead_source` set to `form`
- `lead_type`
- `source_campaign` (optional)

## 5. Lists
Create active lists for routing and reporting:
- By `lead_type`
- By `website_domain`
- By `intent_score`
- By lifecycle/qualification status

## 6. Integrations
- Configure n8n credentials for HubSpot API token.
- Configure integration service `.env`.
- Validate `/ingest/lead` endpoint with sample payloads.

## 7. Go-live checks
- Submit at least 1 test lead per form on each domain.
- Confirm contact properties map correctly.
- Confirm auto-deal creation behavior.
- Confirm dashboard reflects source and pipeline values.
