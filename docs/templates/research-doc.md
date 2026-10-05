---
type: research
kind: research     # research | brief | investigation — a brief is the hand-off of /sk:brainstorm; an investigation is a /sk:debug trace
trigger: "/sk:{kickoff|brainstorm|prd|plan|migrate|debug} for {task/epic/PRD reference}"
topics: []         # keywords the research skill matches when it checks for prior research
date: YYYY-MM-DD
valid_until: YYYY-MM-DD   # version facts ~30d, comparisons ~90d, concepts ~6-12mo (see SK's `research` skill)
---

# Research: {Topic}

## Context

<!-- What prompted this research? What question are we answering? -->

## Queries

<!-- The searches run, so a reader can judge coverage and a later run can extend rather than repeat. -->

- `…`

## Findings

<!-- Key findings from web research, codebase analysis, or investigation.
     Library evaluations: a comparison table. Debug investigations: the hypotheses tested and what ruled each out.
     A brief (/sk:brainstorm): the product-brief fields, the rejected alternatives with why, the parked ideas. -->

## Sources

<!-- Every load-bearing finding needs a row. Findings without provenance can't be safely reused later. -->

| Source | URL | Accessed | Supports |
|--------|-----|----------|----------|
| <!-- Next.js docs --> | <!-- https://... --> | <!-- YYYY-MM-DD --> | <!-- which finding --> |

## Decision

<!-- What was decided because of this, and where it lives: an ADR, a PRD, a task or epic, or "no action". -->
