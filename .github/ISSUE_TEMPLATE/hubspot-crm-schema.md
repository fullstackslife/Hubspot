---
name: HubSpot CRM Schema
about: Standardize CRM fields and mapping across all lead sources
---

## Objective
Define standardized CRM fields for all incoming leads across projects.

## Deliverables
- Property map for contacts/deals
- Enum value definitions
- Validation rules
- Mapping table by source (forms/chat/scraper/import)

## Required fields
- `lead_source`
- `lead_type`
- `company`
- `industry`
- `budget`
- `location`
- `pipeline_stage`

## Acceptance criteria
- [ ] Schema doc approved
- [ ] Property names finalized and consistent with HubSpot
- [ ] Mapping table covers all active lead sources
