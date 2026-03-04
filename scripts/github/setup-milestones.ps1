param(
  [Parameter(Mandatory = $true)]
  [string]$Repo
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "GitHub CLI ('gh') is required. Install from https://cli.github.com/ and run 'gh auth login'."
  exit 1
}

$milestones = @(
  @{ key = "m01"; title = "M01 - Repo Governance and Tracking Setup"; due = "2026-03-11"; desc = "DoD: labels finalized, issue templates verified, PR checklist added, project board columns ready." },
  @{ key = "m02"; title = "M02 - CRM Data Model Freeze"; due = "2026-03-18"; desc = "DoD: property dictionary + enums locked, required vs optional fields documented." },
  @{ key = "m03"; title = "M03 - Pipelines and Stages Configured"; due = "2026-03-25"; desc = "DoD: HubSpot pipelines/stages configured, IDs documented in docs/env mapping." },
  @{ key = "m04"; title = "M04 - Form Schema and Hidden Tracking Spec"; due = "2026-04-01"; desc = "DoD: form field specs and hidden tracking fields finalized." },
  @{ key = "m05"; title = "M05 - Multi-Domain Form Embeds Live"; due = "2026-04-08"; desc = "DoD: embeds live on all domains with validation evidence." },
  @{ key = "m06"; title = "M06 - Ingestion Service Production-Ready"; due = "2026-04-15"; desc = "DoD: env config finalized, auth validated, retry/error behavior tested." },
  @{ key = "m07"; title = "M07 - n8n Workflows Imported and Connected"; due = "2026-04-22"; desc = "DoD: intake/dedupe/routing/DLQ workflows wired to webhook + HubSpot." },
  @{ key = "m08"; title = "M08 - Lead Qualification and Deal Automation"; due = "2026-04-29"; desc = "DoD: deal automation, ownership/tagging, and dedupe checks pass." },
  @{ key = "m09"; title = "M09 - Reporting and Attribution Dashboard"; due = "2026-05-06"; desc = "DoD: KPI/funnel/attribution reports published and reviewed." },
  @{ key = "m10"; title = "M10 - Go-Live Operations and Weekly Cadence"; due = "2026-05-13"; desc = "DoD: weekly ritual active, DLQ SOP active, post-launch backlog prioritized." }
)

$labels = @(
  @{ name = "milestone:m01"; color = "1D76DB"; description = "Milestone M01" },
  @{ name = "milestone:m02"; color = "1D76DB"; description = "Milestone M02" },
  @{ name = "milestone:m03"; color = "1D76DB"; description = "Milestone M03" },
  @{ name = "milestone:m04"; color = "1D76DB"; description = "Milestone M04" },
  @{ name = "milestone:m05"; color = "1D76DB"; description = "Milestone M05" },
  @{ name = "milestone:m06"; color = "1D76DB"; description = "Milestone M06" },
  @{ name = "milestone:m07"; color = "1D76DB"; description = "Milestone M07" },
  @{ name = "milestone:m08"; color = "1D76DB"; description = "Milestone M08" },
  @{ name = "milestone:m09"; color = "1D76DB"; description = "Milestone M09" },
  @{ name = "milestone:m10"; color = "1D76DB"; description = "Milestone M10" },
  @{ name = "type:docs"; color = "5319E7"; description = "Documentation work" },
  @{ name = "type:integration"; color = "0E8A16"; description = "Service/API integration work" },
  @{ name = "type:workflow"; color = "0052CC"; description = "n8n/workflow orchestration work" },
  @{ name = "type:ops"; color = "FBCA04"; description = "Operational process/reporting work" },
  @{ name = "priority:high"; color = "B60205"; description = "High priority" },
  @{ name = "priority:medium"; color = "D93F0B"; description = "Medium priority" },
  @{ name = "priority:low"; color = "0E8A16"; description = "Low priority" }
)

Write-Host "Ensuring milestones in $Repo ..."

$existingMilestonesJson = gh api "repos/$Repo/milestones?state=all&per_page=100"
$existingMilestones = $existingMilestonesJson | ConvertFrom-Json

foreach ($m in $milestones) {
  $existing = $existingMilestones | Where-Object { $_.title -eq $m.title } | Select-Object -First 1
  if ($null -eq $existing) {
    gh api -X POST "repos/$Repo/milestones" -f title="$($m.title)" -f description="$($m.desc)" -f due_on="$($m.due)T23:59:59Z" | Out-Null
    Write-Host "Created milestone: $($m.title)"
  } else {
    gh api -X PATCH "repos/$Repo/milestones/$($existing.number)" -f description="$($m.desc)" -f due_on="$($m.due)T23:59:59Z" | Out-Null
    Write-Host "Updated milestone: $($m.title)"
  }
}

Write-Host "Ensuring labels in $Repo ..."

foreach ($l in $labels) {
  $result = gh label edit "$($l.name)" --repo $Repo --color "$($l.color)" --description "$($l.description)" 2>$null
  if ($LASTEXITCODE -ne 0) {
    gh label create "$($l.name)" --repo $Repo --color "$($l.color)" --description "$($l.description)" | Out-Null
    Write-Host "Created label: $($l.name)"
  } else {
    Write-Host "Updated label: $($l.name)"
  }
}

Write-Host "Setup complete."
