param(
  [Parameter(Mandatory = $true)]
  [string]$Repo
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "GitHub CLI ('gh') is required. Install from https://cli.github.com/ and run 'gh auth login'."
  exit 1
}

$issuesJson = gh issue list --repo $Repo --state open --limit 200 --json number,title,labels,milestone,url
$issues = $issuesJson | ConvertFrom-Json

$problems = @()

foreach ($issue in $issues) {
  $names = @($issue.labels | ForEach-Object { $_.name })
  $typeLabels = @($names | Where-Object { $_ -like "type:*" })
  $priorityLabels = @($names | Where-Object { $_ -like "priority:*" })
  $milestoneLabels = @($names | Where-Object { $_ -like "milestone:m*" })
  $milestoneSet = $null -ne $issue.milestone -and -not [string]::IsNullOrWhiteSpace($issue.milestone.title)

  if (-not $milestoneSet) {
    $problems += "Issue #$($issue.number) has no GitHub milestone: $($issue.url)"
  }
  if ($typeLabels.Count -ne 1) {
    $problems += "Issue #$($issue.number) must have exactly one type label, found $($typeLabels.Count): $($issue.url)"
  }
  if ($priorityLabels.Count -ne 1) {
    $problems += "Issue #$($issue.number) must have exactly one priority label, found $($priorityLabels.Count): $($issue.url)"
  }
  if ($milestoneLabels.Count -ne 1) {
    $problems += "Issue #$($issue.number) must have exactly one milestone:mXX label, found $($milestoneLabels.Count): $($issue.url)"
  }
}

if ($problems.Count -gt 0) {
  Write-Host "Hygiene check failed:"
  $problems | ForEach-Object { Write-Host "- $_" }
  exit 1
}

Write-Host "Hygiene check passed: all open issues match milestone/type/priority requirements."
