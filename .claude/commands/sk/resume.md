---
description: Resume work from previous session — briefing + context restore (project)
---

# Resume — Session Continuity

Quickly restore context from a previous session and present a briefing.

**Use when:** Starting a new Claude Code session and you have active work.

## Step 1: Gather State (parallel)

Run all of these in parallel to build a complete picture:

### 1a. Current Work File
Read `docs/tasks/.current` if it exists (canonical format defined in `docs/tasks/README.md`). It contains:
- Active task ID and name
- Current phase (plan/dev/test)
- Last completed subtask
- Timestamp

If the file doesn't exist, that's fine — the other checks below still run either way (`.current` is a hint, not a gate).

### 1b. Recent Git Activity
```bash
git log --oneline -10
git status
git branch --show-current
git diff --stat
```

If this isn't a git repository or has no commits yet, skip the git-based steps and note that in the output — don't error out.

### 1c. Task Board
Scan `docs/tasks/TASK-*.md` and `docs/tasks/EPIC-*.md` for:
- Tasks with `status: in-progress` or `status: testing`
- Tasks with `phase: dev` or `phase: test`
- Any tasks updated in the last 3 days
- **Possibly abandoned:** active-status tasks untouched for >14 days — list them
  separately and offer to mark `status: abandoned` or `cancelled` rather than
  letting them read as active work
- **Claims:** note `claimed_by` on active tasks — flag tasks claimed by another
  agent (skip them) and stale claims (>24h since `updated` — eligible for takeover)

### 1d. Uncommitted Work
Check for any uncommitted changes that represent in-progress work.

## Step 2: Present Briefing

Present a concise briefing (aim for 5-8 lines):

```
## Session Briefing

**Branch:** feature/user-auth
**Active task:** TASK-3 — User Authentication (DEV phase, 4/7 subtasks done)
**Last activity:** 2 hours ago — implemented JWT middleware
**Uncommitted:** 3 files modified (auth.ts, middleware.ts, auth.test.ts)
**Next:** Subtask 5 — Add refresh token endpoint

**Other active work:**
- TASK-5 — Dashboard (PLAN phase, ready for dev)
```

If no active work is found:
```
## Session Briefing

No active work found. Recent activity:
- Last commit: abc1234 "feat(auth): add login endpoint" (3 days ago)
- Task board: 2 tasks in backlog, 1 completed

**Suggested:** Run `/sk:task-status` for full board, or start new work with `/sk:new-task`.
```

## Step 2.5: Founder Packet Pointer (hint, not gate)

If `docs/business/exec/` exists and any `<role>/briefs/` file is newer than the
last `/sk:founder` session (see its last-read marker), end the briefing with one
line — e.g. **"Your executive team's Monday packet is waiting — `/sk:founder`
({N} decisions queued{, incl. a one-way door if any})."** Nothing more; the
session briefing stays session-scoped.

## Step 3: Offer Next Action

Based on the state, suggest the most logical next step:
- If mid-DEV: "Continue with `/sk:dev`? Next subtask: [name]"
- If DEV complete: "Ready for testing. Run `/sk:test`?"
- If mid-TEST: "Continue verification. Run `/sk:test`?"
- If uncommitted work: "You have uncommitted changes. Commit first with `/sk:commit`?"
- If nothing active: "Start new work? `/sk:task-status` to see the board."

Do NOT automatically start executing — just present the briefing and let the user decide.
