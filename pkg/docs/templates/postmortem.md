# Postmortem: [Incident title]

**Last updated:** YYYY-MM-DD
**Lifecycle:** current  <!-- current | stale | deprecated | archived (see conventions/doc-lifecycle.md) -->
**Date of incident:** YYYY-MM-DD
**Severity:** [SEV1 | SEV2 | SEV3]
**Status:** [draft | reviewed | action-items-open | closed]

> **Blameless.** Focus on systems and contributing factors, not individuals. The goal is to
> stop the *class* of incident from recurring.

## Summary

<!-- 2-3 sentences: what happened, who was affected, how long. -->

## Impact

- **Users affected:** …
- **Duration:** [start] → [recovery] ( … )
- **Time to detect / time to mitigate:** … / …
- **What broke:** …

## Timeline

<!-- Times in one timezone. What was observed, when. Link to incidents/ notes. -->

| Time | Event |
|------|-------|
| … | Detected via … |
| … | … |
| … | Mitigated |
| … | Resolved |

## Root cause

<!-- The actual cause, traced to evidence (logs, code, config). path:line where useful. -->

## Contributing factors

<!-- What made it worse or slower to detect/fix: gaps in monitoring, runbooks, tests. -->

## Resolution & recovery

<!-- How it was mitigated and fully resolved. -->

## What went well / what didn't

- **Well:** …
- **Didn't:** …

## Action items

<!-- Each owned and tracked. Prevention > detection > mitigation. Link to tasks. -->

| Action | Type (prevent/detect/mitigate) | Owner | Link |
|--------|--------------------------------|-------|------|
| … | … | … | … |

## Docs to update

<!-- The runbook, SOP, flow Error Paths or ADR this incident proved wrong or missing. -->

- …
