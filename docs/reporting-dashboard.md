# Reporting Dashboard Design

## KPI definitions
- Leads by source: count of contacts grouped by `lead_source` per week.
- Leads by domain: count of contacts grouped by `website_domain`.
- Conversion rate: `(closed_won deals / total leads)` over matching period.
- Pipeline value: sum of open deal `amount` grouped by pipeline/stage.
- Revenue attribution: closed won amount grouped by `website_domain`, `lead_type`, `source_campaign`.

## Required dashboard panels
1. Weekly lead volume by `lead_source`
2. Lead mix by `website_domain`
3. Deal stage distribution for `Hotel Leads`
4. Pipeline value by stage
5. Closed won revenue trend (monthly)
6. Attribution table: `website_domain` + `lead_type` + `source_campaign`

## Hotel-first acceptance checks
- High-intent hotel submissions appear in `Hotel Leads` pipeline.
- Low-intent hotel submissions appear in contact reports but not deal volume.
- Re-submitted duplicate lead does not inflate lead or deal counts.

## Data quality guardrails
- Reject payloads missing required canonical fields.
- Ensure all production forms set hidden fields.
- Review dead-letter records weekly and backfill corrected payloads.

## Operating cadence
- Weekly (30 min): pipeline movement, stuck stages, dead-letter count.
- Monthly (60 min): attribution and ROI by domain and campaign.
