---
name: headless-operation
description: Rules for running SK commands unattended — no questions, policy-gated decisions, report artifacts, escalation via board items. Loaded by /sk:routines and scheduled/CI runs; not invoked directly.
disable-model-invocation: true
user-invocable: false
---

# Headless Operation

How to run an SK command when no human is watching (scheduled routine, CI job,
autonomous session). The interactive versions of commands ask questions at gates —
headless runs must not.

## 1. Never Ask — Resolve or Escalate

Every point where a command says "ask the user":
- **Covered by `docs/conventions/delegation-policy.md`** → take the permitted action
  and log it (which policy row, what was decided).
- **Not covered, or policy says Ask/Never** → escalate by artifact (below), skip that
  step, and continue with whatever remains in-policy. Never wait for input.

If no delegation policy exists, run in **report-only mode**: analyze and write
findings, change nothing.

## 2. Escalate by Artifact

- A pending decision blocking a task → set the task `status: blocked` with a one-line
  "needs: {decision}" note on the board.
- A finding needing human judgment → include it in the run report under
  **Needs human review**, ranked first.

## 3. Output Is Files, Not Conversation

Write a dated report to the right home — `docs/reviews/{area}/YYYY-MM-DD-*.md` for
analyzers, `docs/operations/` for operational runs. End with the quantified one-line
tally. Conversation output may never be read; the report is the deliverable.

## 4. Hard Limits (regardless of policy)

Never deploy, publish, spend, delete data, force-push, or modify CI/permissions/the
policy file in a headless run. These require an interactive human confirmation even
if a policy row is (mis)edited to allow them.

## 5. Provenance & Budget

- Stamp every report and Progress Log entry with the run date and trigger
  (e.g. `routine: nightly-docs-audit`).
- Every policy-covered decision gets one line in `docs/decisions/decision-log.md`
  (if it exists — full-profile installs ship it): date, decision, why, which
  agent/session, link. Fall back to the task's Progress Log otherwise.
- Follow `stay-within-limits` — bounded work per run; leave a resume note rather
  than exhausting the budget mid-task.

## 6. On Failure

Follow `error-recovery` (diagnose before retrying). If unrecoverable, write a short
failure report (what ran, what broke, exact error) to `docs/operations/` and exit
cleanly — a silent dead routine is worse than a failed one.
