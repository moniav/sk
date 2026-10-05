# Set up autonomous maintenance routines

**Last updated:** 2026-07-05
**Lifecycle:** current
**Audience:** Developers using SK who want maintenance (doc audits, dependency sweeps, retros) to run on a schedule without a human in the loop

## What you'll accomplish

Recurring SK runs that execute unattended, write dated reports instead of asking
questions, and escalate anything needing human judgment — governed by a policy you
control.

## Before you start

- The SK plugin installed, and `/sk:scaffold` run in the project
- A scheduler you can use: Claude Code scheduled agents, CI cron (e.g. GitHub
  Actions), or your OS scheduler — or none (you can still generate the runbook)

## Steps

1. **Review your delegation policy** — open `docs/conventions/delegation-policy.md`
   (installed by SK) and adjust the decision-rights table to your comfort level.
   - *What you'll see:* a table of actions (commit, push, merge, deploy…) marked
     autonomous / ask / never. The shipped defaults are conservative.
   - Without this file, routines run **report-only** (they analyze but change nothing).
2. **Run `/sk:routines`** in a Claude Code session on your project.
   - *What you'll see:* a multi-select of recommended routines — docs health,
     dependency sweep, debt harvest, retro, security review, per-PR review.
3. **Pick your scheduler** when asked — Claude Code scheduled agents, CI cron, or
   docs-only.
   - *What you'll see:* per-routine setup (scheduled-agent walkthrough or generated
     CI workflow), each using SK's standard headless prompt template.
4. **Confirm the runbook** — the command writes
   `docs/operations/runbooks/scheduled-routines.md` documenting what runs when.
   - *What you'll see:* a table of enabled routines with cadence, exact prompt, and
     where each report lands.
5. **Check the first reports** after a cycle — they land in `docs/reviews/` (dated),
   with anything needing your judgment ranked first under **Needs human review**.

## Troubleshooting

| If you see… | It means… | Do this |
|-------------|-----------|---------|
| A routine's report says "report-only mode" | No delegation policy was found | Restore/review `docs/conventions/delegation-policy.md` |
| A task on the board with `status: blocked` and a "needs:" note | A routine hit a decision the policy doesn't grant | Decide, note it, and unblock the task |
| A failure report in `docs/operations/` | A routine broke and exited cleanly | Read it — it contains what ran and the exact error |
| A routine deployed/published something | It can't — headless runs hard-block deploy/publish/spend regardless of policy | If something shipped, a human ran it interactively |

## Related guides

- [Run multiple agents on one project](./run-multiple-agents.md)
