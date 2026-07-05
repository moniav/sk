---
description: Set up scheduled maintenance routines — nightly audit, weekly retro/debt/deps, per-PR review (project)
argument-hint: "[list | setup (optional)]"
---

# Routines — Scheduled Maintenance

Set up recurring, unattended SK runs so maintenance happens on a schedule instead of
when someone remembers. Every routine runs under `.claude/skills/headless-operation/SKILL.md`
and `docs/conventions/delegation-policy.md`.

## Step 1: Read Context

1. `docs/conventions/delegation-policy.md` — if it doesn't exist yet, copy the shipped
   default into place first and tell the user to review it (routines without a policy
   run report-only)
2. `docs/operations/runbooks/scheduled-routines.md` — existing routine setup, if any
3. Detect available schedulers: `.github/workflows/` (CI cron), Claude Code scheduled
   agents, or OS scheduler

## Step 2: Pick Routines

Present the recommended set (use AskUserQuestion, multi-select):

| Routine | Cadence | Command | Report lands in |
|---------|---------|---------|-----------------|
| Docs health | Nightly or weekly | `/sk:docs-audit` | `docs/reviews/` |
| Dependency sweep | Weekly | `/sk:deps` | `docs/reviews/deps/` |
| Debt harvest | Weekly | `/sk:debt` | `docs/reviews/` |
| Retro | Weekly | `/sk:retro` | `docs/reviews/` |
| Security review | Monthly | `/sk:security-review` | `docs/reviews/security/` |
| Ship review | Per PR (CI) | `/sk:review` | PR / `docs/reviews/` |
| Social pack | Weekly | `/sk:copywrite` (social posts from recently shipped work) | `docs/business/copy/` |
| Newsletter draft | Monthly | `/sk:copywrite` (email digest from the changelog) | `docs/business/copy/` |
| Executive briefs | Weekly | `/sk:ceo review`, `/sk:cto review`, `/sk:cmo review`, `/sk:coo review` (headless brief mode) | `docs/business/exec/<role>/briefs/` — consumed by `/sk:founder` |

Marketing routines produce **drafts only** — publishing is outward-facing and stays
behind human sign-off regardless of policy.

## Step 3: Choose the Scheduler

Ask which scheduler to target (AskUserQuestion):

- **Claude Code scheduled agents** — walk the user through creating one per routine
  (the `/schedule` skill or the Claude Code UI). Prompt template below.
- **CI cron** (e.g. GitHub Actions) — generate a workflow per cadence group that runs
  `claude -p "<routine prompt>"` on a `schedule:` trigger. Confirm before writing
  anything under `.github/`.
- **Docs only** — no scheduler access; just write the runbook so a human (or future
  agent) can wire it up.

**Routine prompt template** — every scheduled invocation uses this shape:

```
Run /sk:{command} headless: follow .claude/skills/headless-operation/SKILL.md and
docs/conventions/delegation-policy.md. No questions — write the dated report to
{report home}, escalate findings needing human judgment via the report's
"Needs human review" section, and stamp the report `routine: {routine-name}`.
```

## Step 4: Write the Runbook

Create/update `docs/operations/runbooks/scheduled-routines.md` (create the home with
a stub README first if missing — minimal install):

- Table of enabled routines: name, cadence, scheduler, exact prompt, report home
- Where escalations surface (report "Needs human review" sections + `blocked` board items)
- How to pause/remove each routine

## Step 5: Summary

Report: routines enabled, scheduler used, where reports will land, and the one thing
the user should do next — **review `docs/conventions/delegation-policy.md`**, since it
governs everything these routines are allowed to do.
