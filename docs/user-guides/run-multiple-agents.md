# Run multiple agents on one project

**Last updated:** 2026-07-05
**Lifecycle:** current
**Audience:** Developers running two or more Claude Code sessions (or cloud agents) against the same repository

## What you'll accomplish

Several agents pulling work from one task board without colliding — each task claimed
by exactly one agent, work prioritized against your stated goals, and every autonomous
decision traceable afterwards.

## Before you start

- SK v1.9.0+ installed; the task lifecycle in use (tasks live in `docs/tasks/`)
- Recommended: a reviewed `docs/conventions/delegation-policy.md` (see
  [autonomous routines](./set-up-autonomous-routines.md), step 1)

## Steps

1. **State your goals (once)** — run `/sk:new-business-doc`, pick **Company goals**.
   - *What you'll see:* `docs/business/goals.md` with goal IDs (`G1`, `G2`…),
     measurable outcomes, and an "Explicitly Not Doing" list agents consult before
     proposing work.
2. **Link epics to goals** — when creating epics (`/sk:new-epic`), pick which goal
   each serves when prompted.
   - *What you'll see:* a `goal:` field in the epic's frontmatter and the epic listed
     under that goal.
3. **Start each agent normally** — `/sk:resume`, then `/sk:dev` or `/sk:implement`
   on a task. Claiming is automatic: the command sets `claimed_by`/`claimed_at` in
   the task's frontmatter before working, and checks for existing claims first.
   - *What you'll see:* an agent asked to work a task freshly claimed by another
     agent will decline and pick different work.
4. **Commit claims if agents work from separate clones** — the claim only protects
   what other agents can see. Same-machine sessions see it immediately.
5. **Watch the board** — `/sk:task-status` shows who holds what, flags claims gone
   stale (no update in 24h — eligible for takeover), and calls out epics serving no
   goal.
6. **Audit decisions afterwards** — small decisions agents made autonomously are one
   line each in `docs/decisions/decision-log.md` (who, what, why, when); big ones are
   ADRs. Run `/sk:retro` periodically — it measures escalations and first-pass review
   rates and recommends widening or tightening your delegation policy, with citations.

## Troubleshooting

| If you see… | It means… | Do this |
|-------------|-----------|---------|
| Two agents edited the same task file | Claims weren't committed between clones | Commit the claim change (step 4); resolve via normal git merge |
| A task claimed but untouched for a day | The claiming agent died or moved on | Any agent may take it over — the takeover is noted in the task's Progress Log |
| `/sk:task-status` shows "goal orphans" | Epics exist that serve no stated goal | Link them to a goal, or question whether the work belongs |
| Claim fields blank everywhere | You're running single-agent | That's the default — claiming is opt-in overhead you don't pay solo |

## Related guides

- [Set up autonomous maintenance routines](./set-up-autonomous-routines.md)
