---
description: Implement a feature end-to-end — Plan > Dev > Test in one flow
argument-hint: "[feature description]"
disable-model-invocation: true
---

# Implement Feature

Run the complete development lifecycle for a feature in a single session.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

**Use this when:** You want to go from idea to done without stopping between phases.
**Use separate `/sk:plan`, `/sk:dev`, `/sk:test` when:** You want to review between phases.

## Step 1: Read Context

**Read only what's needed now** (conventions and skills are loaded later, per phase):
1. `docs/system/project-context.md` — Dense project summary (if it exists — skip if empty/template)
2. The task file being worked on (if resuming existing work)

**Skip files that are empty or contain only template placeholders.**

## Step 2: Scope the Work

Ask the user:
- **What to build**: Feature description
- **Priority**: P0-P3

Determine scope:
- **L/XL complexity** — Create an epic first (`/sk:new-epic`) — this creates the epic file plus separate task files for each sub-task, then implement task by task
- **M complexity** — Continue with this command (single task)
- **XS/S complexity** — Proceed directly (skip formal task creation, but still follow Plan>Dev>Test mentally)

## Step 3: [PLAN] Phase

### Create Task File
1. Use Glob to scan `docs/tasks/TASK-*.md` — find the highest task number N, use N+1
2. Determine epic number: if part of an epic, extract its number from `EPIC-{N}-*.md`; if standalone use `S`
3. Create `docs/tasks/TASK-{N}-{E{epicN}|S}-{kebab-name}.md` from template
4. Fill in YAML frontmatter: `phase: plan`, `status: planning`, today's date

### Fill Plan
1. **Scan codebase** — Map affected files, find existing patterns
2. **Write acceptance criteria** — 3-5 testable conditions
3. **Break into subtasks** — Each S complexity (single concern), tagged `[DEV]`/`[TEST]`/`[DOCS]`
4. **Resolve all questions** — No unknowns remaining
5. **Surface assumptions** — List assumptions and ambiguities; confirm with user before proceeding

### PLAN Exit Gate
```markdown
- [ ] Acceptance criteria are testable
- [ ] Subtasks are S complexity each (single concern) with exact file paths
- [ ] No open questions
- [ ] Assumptions confirmed with user
- [ ] Simplest approach chosen (no speculative features)
- [ ] Approach follows existing codebase patterns
```

**Checkpoint:** Present plan summary to user. Wait for approval before proceeding.

### Update Current Work Tracker
Write `docs/tasks/.current` (canonical format in `docs/tasks/README.md`):
```
task: TASK-{N}
name: {task name}
phase: plan
subtask: 0/{total}
last: Plan approved
updated: {ISO date}
```

## Step 4: [DEV] Phase

Update frontmatter: `phase: dev`, `status: in-progress`; claim the task
(`claimed_by` + `claimed_at` — skip if single-agent, see `docs/tasks/README.md`)
Update `docs/tasks/.current`: set `phase: dev`

Follow `.claude/skills/subtask-execution/SKILL.md` — the canonical loop: load
conventions and skills, TDD ordering (`[TEST]` before `[DEV]`), per-type checklists,
self-review, compliance pass, and the evidence-based **DEV Exit Gate**.

**Subagent mode (optional):** If 5+ subtasks, ask "Use subagent mode?" (use AskUserQuestion). If yes, read `.claude/skills/subagent-driven-development/SKILL.md`.

## Step 5: [TEST] Phase

Update frontmatter: `phase: test`, `status: testing`
Update `docs/tasks/.current`: set `phase: test`

### Load TEST Phase Resources

Read these now:
- `docs/conventions/testing.md`
- `.claude/skills/verification-before-completion/SKILL.md` — Evidence requirements for every verification claim

**Skills active:** `verification-before-completion` (AC verification — paste actual test output for every claim).

### Run Full Test Suite
```bash
# Run your project's test, type-check, and lint commands
# (check docs/system/tech-stack.md and CLAUDE.md for exact commands)
```

### Verify Each Acceptance Criterion
Go through AC-1, AC-2, etc. one by one:
- Restate each AC as a verifiable goal ("Done when X") with exact verification method
1. Execute the specific test scenario
2. Record the result in the task's Verification section
3. If any fails — fix in DEV, re-verify

### Test Error Paths & Edge Cases
- Invalid input handling
- Empty/null/None states
- Boundary conditions
- Error messages are helpful

### TEST Exit Gate
```markdown
- [ ] Every AC verified with evidence
- [ ] Error paths handled
- [ ] Edge cases covered
- [ ] No regressions
- [ ] All automated tests pass
```

## Step 6: Close Out

1. Delete `docs/tasks/.current` (work is complete)
2. Update frontmatter: `phase: done`, `status: done`
3. Update Progress Log with all phases
4. Move task in `docs/tasks/README.md` to "Recently Completed"
5. Final documentation check:

```markdown
- [ ] docs/system/ updated (if schema, API, or stack changed)
- [ ] docs/architecture/ updated (if component relationships changed)
- [ ] docs/flows/ updated (if process flows changed)
- [ ] docs/decisions/ updated (if significant tech decision made)
```

## Step 7: Summary

Present to user:
- [DONE] What was built (acceptance criteria met)
- Files: created/modified
- Docs: updated
- [WARN] Any notes or follow-up items
