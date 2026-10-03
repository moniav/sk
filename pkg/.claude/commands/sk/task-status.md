---
description: Show task board — status of all epics, tasks, and progress overview (project)
allowed-tools: Read, Grep, Glob, Bash(git status *), Bash(git diff *), Bash(git log *), Bash(git show *), Bash(git rev-parse *), Bash(git symbolic-ref *), Bash(git merge-base *), Bash(git ls-files *), Bash(git blame *), Bash(git branch --show-current), Bash(date *)
disallowed-tools: Edit, Write, NotebookEdit
---

# Task Status

Scan all task files and present a complete status overview.

**Report-only.** This command does not modify project files. It writes nothing; regenerating the board happens only in a later turn, after you confirm.

## Step 1: Scan Task Files

1. Read `docs/tasks/README.md` for the current board state
2. Scan all `docs/tasks/EPIC-*.md` and `docs/tasks/TASK-*.md` files
3. **Read YAML frontmatter** from each task/epic file to extract:
   - `phase` (plan, dev, test, done)
   - `status` (planning, ready, in-progress, testing, done, blocked, cancelled, abandoned)
   - `priority` (P0, P1, P2, P3)
   - `epic` (parent epic reference or standalone)
   - `goal` (on epics — which company goal this serves, if `docs/business/goals.md` exists)
   - `claimed_by` / `claimed_at` (multi-agent claim state)
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
- **Possibly abandoned**: `in-progress`/`testing` untouched for >14 days — offer to
  mark `status: abandoned` (resumable later) or `cancelled` (won't do), so dead work
  doesn't sit on the board as active forever
- **Stale claim**: `claimed_by` set but `updated` >24h old — the claim is takeover-eligible
- **Goal orphans**: if `docs/business/goals.md` exists, epics with no `goal:` link —
  work that serves no stated strategy deserves a question, and a "work per goal"
  rollup belongs in the dashboard

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

Task-file **frontmatter is the source of truth**; the board tables in
`docs/tasks/README.md` are derived from it. If the scan reveals drift:
1. Show the discrepancies
2. Ask user: "Task board README is out of sync. Regenerate it?"
3. If yes, **regenerate the board tables wholesale** from the scanned frontmatter
   (don't patch individual rows — rebuilding prevents drift accumulating). Preserve
   the non-table sections (How to Use, `.current` contract, Examples).

## Step 5: Suggest Next Action

Based on the current state, recommend:
- If blocked tasks exist: "Resolve TASK-0003 blocker first"
- If testing tasks exist: "Verify TASK-0001 — almost done"
- If ready tasks exist: "Start TASK-0004 — it's the highest priority ready task"
- If only backlog: "Plan TASK-0007 — use `/sk:plan` to start"
