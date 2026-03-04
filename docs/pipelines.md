# Pipeline Definitions

## Environment mapping
| Pipeline | Env key |
|---|---|
| Hotel Leads | `PIPELINE_HOTEL` |
| Creator Partnerships | `PIPELINE_CREATOR` |
| AI Clients | `PIPELINE_AI` |
| Warbot Users | `PIPELINE_WARBOT` |

## Hotel Leads
`Lead Captured` -> `Contacted` -> `Interested` -> `Proposal Sent` -> `Rooms Blocked` -> `Closed Won` / `Closed Lost`

## Creator Partnerships
`Lead Captured` -> `Qualified` -> `Brand Match` -> `Negotiation` -> `Closed Won` / `Closed Lost`

## AI Clients
`Lead Captured` -> `Discovery Scheduled` -> `Solution Drafted` -> `Proposal Sent` -> `Closed Won` / `Closed Lost`

## Warbot Users
`Lead Captured` -> `Eligibility Reviewed` -> `Access Provisioned` -> `Active` -> `Converted` / `Churned`

## Stage governance
- Auto-created deals start at `STAGE_DEFAULT_LEAD_CAPTURED`.
- Stage movement after `Lead Captured` is manual by sales/ops.
- Closed stages require reason notes in deal description.
