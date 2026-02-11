---
description: Implement a feature end-to-end — Plan → Dev → Test in one flow (project)
---

# Implement Feature

Run the complete development lifecycle for a feature in a single session.

**Use this when:** You want to go from idea to done without stopping between phases.
**Use separate `/sk:plan`, `/sk:dev`, `/sk:test` when:** You want to review between phases.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/lifecycle/README.md` — Full lifecycle rules
2. `docs/conventions/code-style.md` — Coding standards
3. `docs/conventions/file-structure.md` — Project organization
4. `docs/conventions/testing.md` — Testing patterns
5. `docs/system/tech-stack.md` — Current stack
6. `docs/system/database-schema.md` — Current schema
7. `docs/tasks/README.md` — Existing tasks

## Step 2: Scope the Work

Ask the user:
- **What to build**: Feature description
- **Priority**: P0-P3

Determine scope:
- **>2 days** → Create an epic first (`/sk:new-epic`), then implement task by task
- **≤2 days** → Continue with this command (single task)
- **<4 hours** → Proceed directly (skip formal task creation, but still follow Plan→Dev→Test mentally)

## Step 3: 🎯 PLAN Phase

### Create Task File
1. Use Glob to scan `docs/tasks/TASK-*.md` — avoid duplicate names
2. Create `docs/tasks/TASK-kebab-name.md` from template

### Fill Plan
1. **Scan codebase** — Map affected files, find existing patterns
2. **Write acceptance criteria** — 3-5 testable conditions
3. **Break into subtasks** — Each ≤ 4 hours, tagged `[DEV]`/`[TEST]`/`[DOCS]`
4. **Resolve all questions** — No unknowns remaining

### PLAN Exit Gate
```markdown
- [ ] Acceptance criteria are testable
- [ ] Subtasks are ≤ 4h each with exact file paths
- [ ] No open questions
- [ ] Approach follows existing codebase patterns
```

**Checkpoint:** Present plan summary to user. Wait for approval before proceeding.

## Step 4: 🔨 DEV Phase

### Execute Subtasks (top-to-bottom)

For each `[DEV]` subtask:
1. Implement following `docs/conventions/code-style.md`
2. Self-review (naming, structure, error handling)
3. Check off in task file

For each `[TEST]` subtask:
1. Write tests following `docs/conventions/testing.md`
2. Run and verify they pass
3. Check off in task file

For each `[DOCS]` subtask:
1. Update the specified documentation
2. Check off in task file

### DEV Exit Gate
```markdown
- [ ] All subtasks checked off
- [ ] Convention compliance verified
- [ ] Existing tests still pass
- [ ] Docs updated
```

## Step 5: 🧪 TEST Phase

### Run Full Test Suite
```bash
npm test && npm run typecheck && npm run lint
```

### Verify Each Acceptance Criterion
Go through AC-1, AC-2, etc. one by one:
1. Execute the specific test scenario
2. Record the result in the task's Verification section
3. If any fails → fix in DEV, re-verify

### Test Error Paths & Edge Cases
- Invalid input handling
- Empty/null/undefined states
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

## Step 6: ✅ Close Out

1. Update task status to `done`
2. Update Progress Log with all phases
3. Move task in `docs/tasks/README.md` to "Recently Completed"
4. Final documentation check:

```markdown
- [ ] docs/system/ updated (if schema, API, or stack changed)
- [ ] docs/architecture/ updated (if component relationships changed)
- [ ] docs/flows/ updated (if process flows changed)
- [ ] docs/decisions/ updated (if significant tech decision made)
```

## Step 7: Summary

Present to user:
- ✅ What was built (acceptance criteria met)
- 📁 Files created/modified
- 📝 Docs updated
- ⚠️ Any notes or follow-up items
