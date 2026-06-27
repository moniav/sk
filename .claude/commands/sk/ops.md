---
description: Operations / SRE expert — incidents, runbooks, postmortems, SLOs, readiness (project)
---

# Ops — Operations / SRE Expert

Front door to the **operations-advisor** skill. Helps you *run* software in production:
respond to incidents, write runbooks, facilitate postmortems, design SLOs, and review
production readiness. All output lands in `docs/operations/`.

**Use this when:** A production concern — not building a feature. For an active code bug use
`/sk:debug`; for security use `/sk:security-review`; for dev procedures use `/sk:new-sop`.

## Arguments

`$ARGUMENTS` selects the mode:

| Argument | What it does |
|----------|--------------|
| `incident` | Drive an active incident — severity, roles, stabilize, live timeline → `operations/incidents/` |
| `postmortem` | Facilitate a blameless postmortem → `operations/postmortems/` |
| `runbook` | Author an operational runbook (deploy, rollback, recovery, on-call) → `operations/runbooks/` |
| `reliability` / `slo` | Design or review SLIs, SLOs, error budgets, alerting |
| `readiness` | Production-readiness review against the operational checklist |
| *(empty)* or `scan` | Operational-posture scan (observability, alerting, deploy safety, backups, scaling) |

**Mode: $ARGUMENTS** (default: scan)

## Step 1: Load the Skill

Read `.claude/skills/operations-advisor/SKILL.md` and follow the section for the selected mode.

## Step 2: Read Context

Read (skip empty/placeholder files):
1. `docs/system/project-context.md` — what the system is
2. `docs/system/integrations.md` / `tech-stack.md` — services, infra, dependencies
3. `docs/operations/README.md` — existing runbooks/postmortems (avoid duplicates)
4. `docs/sop/` — related dev procedures

For `scan` / `readiness`, also trace real infra/config in the repo (deploy scripts,
Dockerfiles, CI, health checks, alerting config) — **don't invent**; cite `file:line`.

## Step 3: Do the Work

Follow the skill's mode. Verify claims against the codebase/infra; flag assumptions.

## Step 4: Save & Index

Write the artifact under `docs/operations/<subdir>/` with `Lifecycle: current` + today's
`Last updated`, and add/refresh the row in `docs/operations/README.md`. End with the
one-line tally where the mode produces findings.
