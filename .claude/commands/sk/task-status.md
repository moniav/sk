---
description: Show task board — status of all epics, tasks, and progress overview (project)
---

# Task Status

Scan all task files and present a complete status overview.

## Step 1: Scan Task Files

1. Read `docs/tasks/README.md` for the current board state
2. Scan all `docs/tasks/EPIC-*.md` and `docs/tasks/TASK-*.md` files
3. **Read YAML frontmatter** from each task/epic file to extract:
   - `phase` (plan, dev, test, done)
   - `status` (planning, ready, in-progress, testing, done, blocked)
   - `priority` (P0, P1, P2, P3)
   - `epic` (parent epic reference or standalone)
   - `updated` date
4. **Parse filename components** using the naming convention:
   - Epics: `EPIC-{N}-{kebab-name}.md` — extract counter N
   - Tasks: `TASK-{N}-E{epicN}-{kebab-name}.md` or `TASK-{N}-S-{kebab-name}.md`
     - Extract counter N, parent epic number (or S for standalone)
5. Extract from each file body:
   - Title (from `# Task:` or `# Epic:` heading)
   - Subtask progress (count checked / total)
   - Acceptance criteria progress (count checked / total)
   - Last Progress Log entry

## Step 2: Detect Staleness

Flag tasks that may need attention:
- **Stale**: Last updated >7 days ago and not `done` or `backlog`
- **Blocked**: Status is `blocked` — surface the blocker
- **Stuck in DEV**: `in-progress` for >3 days
- **Plan incomplete**: `planning` with unresolved open questions

## Step 3: Present Dashboard

### Format:

```
## Task Board Summary
======================================

Active Epics: N
Total Tasks: N (N done, N in progress, N planned, N blocked)

[BLOCKED]
  TASK-0003: Feature X — Blocked by: [reason] (5 days)

[DEV] IN PROGRESS
  TASK-0002: User Login — Subtasks: 4/7 — P0 — Last: 2 days ago
  TASK-0005: Dashboard — Subtasks: 1/5 — P1 — Last: today

[TEST] TESTING
  TASK-0001: Registration API — ACs: 4/5 verified — P0

[PLAN] READY (planned, waiting to start)
  TASK-0004: Password Reset — P1 — 6 subtasks
  TASK-0006: Email Templates — P2 — 4 subtasks

BACKLOG
  TASK-0007: Admin Panel — P3
  TASK-0008: Analytics — P3

[DONE] RECENTLY COMPLETED
  TASK-0001: Registration API — Done 2025-02-11

[WARN] NEEDS ATTENTION
  TASK-0005: Dashboard — Stale (7 days since update)
```

## Step 4: Sync README

If the scan reveals `docs/tasks/README.md` is out of sync with actual task files:
1. Show the discrepancies
2. Ask user: "Task board README is out of sync. Update it?"
3. If yes, rewrite `docs/tasks/README.md` with accurate current state

## Step 5: Suggest Next Action

Based on the current state, recommend:
- If blocked tasks exist: "Resolve TASK-0003 blocker first"
- If testing tasks exist: "Verify TASK-0001 — almost done"
- If ready tasks exist: "Start TASK-0004 — it's the highest priority ready task"
- If only backlog: "Plan TASK-0007 — use `/sk:plan` to start"
