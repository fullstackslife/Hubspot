---
name: Hotel-First Release Checklist
about: Track dependencies for the first production hotel lead rollout
---

## Objective
Ship the first production lead path for `hotelsales.online` end to end.

## Dependency checklist
- [ ] HubSpot custom properties created and verified
- [ ] Hotel pipeline and `STAGE_DEFAULT_LEAD_CAPTURED` IDs configured in env
- [ ] Hotel forms embedded with required hidden fields
- [ ] n8n ingest workflow connected to `/ingest/lead`
- [ ] High-intent hotel sample creates contact + deal
- [ ] Low-intent hotel sample creates contact-only
- [ ] Dashboard KPI panels verified

## Validation evidence
- Links to HubSpot screenshots/reports:
- Links to n8n execution logs:
- Test payloads used:

## Exit criteria
- [ ] Hotel-first production flow is live
- [ ] Weekly reporting cadence is scheduled
- [ ] Dead-letter triage owner assigned
