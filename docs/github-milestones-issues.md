# GitHub Milestones and Issues

Repo: `fullstackslife/Hubspot`

## Milestone schedule (10 checkpoints)

### M01 - Repo Governance and Tracking Setup (Due: 2026-03-11)
Definition of done:
- Labels finalized (`milestone:*`, `type:*`, `priority:*`)
- Issue templates reviewed and usable
- PR checklist in place
- Project board columns created

### M02 - CRM Data Model Freeze (Due: 2026-03-18)
Definition of done:
- Contact/deal property dictionary finalized
- Enums finalized
- Required vs optional fields documented

### M03 - Pipelines and Stages Configured (Due: 2026-03-25)
Definition of done:
- HubSpot pipelines/stages configured
- Pipeline and stage IDs documented in docs/env mapping

### M04 - Form Schema and Hidden Tracking Spec (Due: 2026-04-01)
Definition of done:
- Form field specs finalized
- Hidden tracking fields finalized (`source`, `campaign`, `timeline`, `website_domain`)

### M05 - Multi-Domain Form Embeds Live (Due: 2026-04-08)
Definition of done:
- Embeds live on all domains
- Validation evidence captured for each domain/environment

### M06 - Ingestion Service Production-Ready (Due: 2026-04-15)
Definition of done:
- Integration service env config finalized
- Auth/token handling validated
- Retry/error behavior tested

### M07 - n8n Workflows Imported and Connected (Due: 2026-04-22)
Definition of done:
- Intake/dedupe/routing/dead-letter workflows imported and wired
- Webhook and HubSpot connections validated

### M08 - Lead Qualification and Deal Automation (Due: 2026-04-29)
Definition of done:
- Qualified leads auto-create/update deals
- Ownership/tagging rules validated
- Duplicate suppression checks pass

### M09 - Reporting and Attribution Dashboard (Due: 2026-05-06)
Definition of done:
- KPI, conversion funnel, and attribution reports published
- Stakeholder review completed

### M10 - Go-Live Operations and Weekly Cadence (Due: 2026-05-13)
Definition of done:
- Weekly review ritual running
- DLQ triage SOP active
- Post-launch backlog prioritized

## Labels

Milestone labels:
- `milestone:m01`
- `milestone:m02`
- `milestone:m03`
- `milestone:m04`
- `milestone:m05`
- `milestone:m06`
- `milestone:m07`
- `milestone:m08`
- `milestone:m09`
- `milestone:m10`

Issue type labels:
- `type:docs`
- `type:integration`
- `type:workflow`
- `type:ops`

Priority labels:
- `priority:high`
- `priority:medium`
- `priority:low`

## Issue mapping guide

Template-to-milestone defaults:
- `hubspot-crm-schema.md` -> M02 or M03
- `hubspot-form-library.md` -> M04 or M05
- `hubspot-api-integration.md` -> M06, M07, or M08
- `hubspot-analytics-dashboard.md` -> M09 or M10

Issue creation rule:
- Every issue must include exactly one GitHub milestone.
- Every issue must include exactly one `type:*` label.
- Every issue must include exactly one `priority:*` label.
- Add one `milestone:mXX` label matching the selected milestone.

## `gh` CLI usage

Create all milestones and labels:
```bash
powershell -ExecutionPolicy Bypass -File scripts/github/setup-milestones.ps1 -Repo fullstackslife/Hubspot
```

Run milestone hygiene validation:
```bash
powershell -ExecutionPolicy Bypass -File scripts/github/hygiene-check.ps1 -Repo fullstackslife/Hubspot
```
