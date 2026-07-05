# Task Board

> All active work, organized by lifecycle phase.
> See [SOP: Creating a Task](../sop/creating-a-task.md) for step-by-step guide.

**Last updated:** YYYY-MM-DD

## How to Use This Board

1. **New work?** -- Follow the [Creating a Task SOP](../sop/creating-a-task.md)
2. **L/XL complexity?** -- Create an Epic using [epic template](../templates/epic.md)
3. **M complexity?** -- Create a Task using [task template](../templates/task-prd.md)
4. **XS/S complexity?** -- Just do it, still follow Plan>Dev>Test mentally

**File naming:** `TASK-{N}-{E{epicN}|S}-{kebab-name}.md` or `EPIC-{N}-{kebab-name}.md`
**Phase tracking:** Phase and status tracked in YAML frontmatter inside each file (not in the filename).

## `.current` — Session Pointer

`docs/tasks/.current` is a plain-text pointer at the active work item so `/sk:resume`
can restore context instantly. Format (one `key: value` per line):

```
task: TASK-3                        # or EPIC-2 — ID of the active work item
name: User Authentication
phase: plan                         # plan | dev | test
subtask: 4/7                        # done/total (0/N during PLAN)
last: Implemented JWT middleware    # one line — last completed step
updated: 2026-07-05 14:30
```

**Contract:**
- **Created** by whichever command starts work — `/sk:new-task`, `/sk:new-epic`,
  `/sk:brainstorm`, `/sk:plan`, `/sk:dev`, `/sk:implement`, `/sk:orchestrate` all
  create it if missing.
- **Updated** on every phase change and after every completed subtask.
- **Deleted** when work ships — by `/sk:test` (all criteria pass), `/sk:finish`,
  or `/sk:implement`/`/sk:orchestrate` close-out.
- It is a **hint, not a lock** — commands must tolerate it being missing or stale;
  the task file's YAML frontmatter is the source of truth.

## Claiming — Multiple Agents, One Board

When more than one agent/session works this repo, tasks are **claimed** before work
starts so two agents never implement the same task:

- **Claim** = set `claimed_by:` (an agent/session identifier) + `claimed_at:` in the
  task's frontmatter — and commit that change if agents work from separate clones.
- **Respect claims:** before starting a task, check `claimed_by`. Claimed by someone
  else and fresh → pick a different task (or ask the user).
- **Stale claim:** the claim holder proves liveness through the `updated` field. If a
  claimed task's `updated` is **>24h old** and it isn't `done`, the claim may be taken
  over — note the takeover in the Progress Log.
- **Release:** clear `claimed_by`/`claimed_at` when the task reaches `done`,
  `abandoned`, or `cancelled`, or when you stop working it.
- Single-agent projects can ignore this entirely — blank claim fields are the default.

> **Board tables below are derived** from each task file's YAML frontmatter (the
> source of truth). Regenerate them with `/sk:task-status` (Step 4) rather than
> hand-editing rows.

## Active Epics

| Epic | Tasks | Progress | Priority | Link |
|------|-------|----------|----------|------|
| <!-- User Auth --> | <!-- 3/5 done --> | <!-- -- --> | <!-- P0 --> | [Link](./EPIC-1-user-auth.md) |

## Task Pipeline

### [PLAN] Planning

| Task | Parent Epic | Priority | Link |
|------|-------------|----------|------|
| <!-- Define user roles --> | <!-- Auth --> | <!-- P1 --> | [Link](./TASK-1-E1-define-user-roles.md) |

### [DEV] In Progress

| Task | Parent Epic | Priority | Subtask Progress | Link |
|------|-------------|----------|-----------------|------|
| <!-- Registration API --> | <!-- Auth --> | <!-- P0 --> | <!-- 5/8 --> | [Link](./TASK-2-E1-registration-api.md) |

### [TEST] Testing

| Task | Parent Epic | Criteria Met | Link |
|------|-------------|-------------|------|
| <!-- Login API --> | <!-- Auth --> | <!-- 3/4 --> | [Link](./TASK-3-E1-login-api.md) |

### [DONE] Recently Completed

| Task | Completed | Link |
|------|-----------|------|
| <!-- User Registration API --> | <!-- 2025-02-11 --> | [Example](./examples/TASK-user-registration-api.md) |

## Backlog

| Task | Priority | Notes |
|------|----------|-------|
| <!-- Email verification --> | <!-- P2 --> | <!-- After core auth is done --> |

## Examples

See [examples/](./examples/) for completed tasks showing the full lifecycle in action:
- [TASK-user-registration-api](./examples/TASK-user-registration-api.md) — A worked example of a complete task
