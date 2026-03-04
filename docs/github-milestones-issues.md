# GitHub Milestones and Issues

Repo: `fullstackslife/Hubspot`

## Milestone 1: HubSpot Foundation
- HubSpot CRM Schema
- Contact/deal property dictionary + enums
- Pipeline/stage definitions
- Form schema specs

## Milestone 2: Website Integrations
- Embed forms on `warbot.cloud`
- Embed forms on `hotelsales.online`
- Embed forms on `vibechain.ink`
- Embed forms on `fullstacks.us`
- Add tracking conventions

## Milestone 3: Automation Layer
- n8n HubSpot integration service
- Scraper result normalization workflow
- Lead enrichment + dedupe workflow
- Contact/deal auto-creation and tagging

## Milestone 4: Sales Dashboard
- HubSpot dashboard configuration
- Revenue attribution report setup
- Conversion funnel report setup
- Weekly export/reporting routine

## Suggested labels
- `milestone:foundation`
- `milestone:web-integrations`
- `milestone:automation`
- `milestone:dashboard`
- `type:docs`
- `type:integration`
- `type:workflow`
- `priority:high`

## `gh` CLI examples

```bash
gh milestone create "HubSpot Foundation" --repo fullstackslife/Hubspot
```

```bash
gh issue create --repo fullstackslife/Hubspot --title "HubSpot CRM Schema" --body-file .github/ISSUE_TEMPLATE/hubspot-crm-schema.md
```
