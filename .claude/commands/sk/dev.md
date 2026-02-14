---
description: Execute the DEV phase — implement subtasks for a task (project)
---

# Dev — Execute Implementation

Execute the 🔨 DEV phase for a task, implementing subtasks top-to-bottom.

## Step 1: Read Context

**ALWAYS start by reading:**
1. The task file being implemented (`docs/tasks/TASK-*-d-*.md` — should be in dev phase)
2. `docs/conventions/code-style.md` — Naming, patterns, anti-patterns
4. `docs/conventions/file-structure.md` — Where files go
5. `docs/conventions/testing.md` — Testing patterns (for `[TEST]` subtasks)
6. `docs/system/database-schema.md` — If touching data layer
7. Any relevant `docs/sop/` procedures (e.g., `database-migration.md`)

## Step 2: Validate Readiness

Before writing any code, confirm:

```markdown
- [ ] Task status is `ready` (PLAN phase complete)
- [ ] All acceptance criteria are defined and testable
- [ ] All subtasks are defined with exact file paths
- [ ] No open questions blocking implementation
- [ ] Dependencies are met (prerequisite tasks done)
```

If any check fails → go back to PLAN phase (`/sk:plan` command).

## Step 3: Set Status

Update the task file:
- Status: `in-progress`
- Progress Log: Add entry `DEV phase started`

## Step 4: Execute Subtasks

Process subtasks **top-to-bottom, one at a time**.

### For Each `[DEV]` Subtask:

1. **Read the subtask** — Understand exactly what to implement
2. **Check conventions** — Reference `docs/conventions/code-style.md` for patterns
3. **Implement** — Write the code following project conventions
4. **Self-review** — Before checking the box:
   - Follows naming conventions?
   - File in correct location per `docs/conventions/file-structure.md`?
   - Error handling in place?
   - No hardcoded values, magic numbers, or leftover TODOs?
   - No unused imports?
5. **Check the box** — Mark subtask complete in the task file

### For Each `[TEST]` Subtask:

1. **Read** `docs/conventions/testing.md` for test patterns
2. **Write tests** following AAA pattern (Arrange, Act, Assert)
3. **Run tests** — Confirm they pass
4. **Check the box**

### For Each `[DOCS]` Subtask:

1. **Identify what changed** — Schema? APIs? Architecture? Components?
2. **Update the specific docs** listed in the subtask
3. **Verify links** — Make sure cross-references still work
4. **Check the box**

## Step 5: Convention Compliance Check

After all subtasks are done, do a final pass:

```markdown
### Code Conventions (docs/conventions/code-style.md)
- [ ] Naming follows project conventions (camelCase, PascalCase, etc.)
- [ ] Import order is correct (external → internal → relative)
- [ ] Boolean variables use is/has/can/should prefix
- [ ] Early returns used instead of deep nesting
- [ ] Comments explain WHY, not WHAT
- [ ] No magic numbers — constants extracted and named

### File Structure (docs/conventions/file-structure.md)
- [ ] New files placed in correct directories
- [ ] Co-location principle followed (related files together)
- [ ] Public API exports updated if applicable
- [ ] No file exceeds soft size limits

### Git Workflow (docs/conventions/git-workflow.md)
- [ ] Commit messages follow format: type(scope): description
- [ ] Commits are atomic (one logical change each)
- [ ] No temporary or debug code committed
```

## Step 6: Documentation Pass

Verify all `[DOCS]` subtasks completed:

```markdown
- [ ] `docs/system/database-schema.md` updated (if schema changed)
- [ ] `docs/system/api-reference.md` updated (if APIs changed)
- [ ] `docs/system/tech-stack.md` updated (if deps changed)
- [ ] `docs/architecture/` updated (if component relationships changed)
- [ ] `docs/flows/` updated (if process flows changed)
- [ ] `docs/decisions/` — new ADR created if significant tech decision was made
```

## Step 7: DEV Exit Gate

All conditions must be true:

```markdown
- [ ] All `[DEV]` subtasks checked off
- [ ] All `[TEST]` subtasks checked off
- [ ] All `[DOCS]` subtasks checked off
- [ ] Code self-reviewed against conventions
- [ ] All existing tests still pass (no regressions)
- [ ] Documentation updated in same commit as code
```

## Step 8: Update Status

1. Set task status to `testing` (or `in-review` if PR review needed)
2. **Rename the file**: Change the phase shortcut from `-d-` to `-t-` (dev complete = ready for test)
   - Example: `TASK-1-E1-d-registration-api.md` → `TASK-1-E1-t-registration-api.md`
   - For epics: `EPIC-1-d-user-auth.md` → `EPIC-1-t-user-auth.md`
   - Use `git mv` if the file is tracked
3. **Update all references** to the old filename:
   - `docs/tasks/README.md` — update any links pointing to the old name
   - Parent epic file — update task references if applicable
   - Any other files that link to this task
4. Update Progress Log:

```markdown
| YYYY-MM-DD | DEV | All N subtasks complete, docs updated. File renamed -d- to -t-. |
```

5. Update `docs/tasks/README.md` — move from "In Progress" to "Testing"

Inform user: **"DEV phase complete. All subtasks implemented. Moving to TEST phase — I'll verify each acceptance criterion."**

## Error Recovery

If a subtask reveals a problem with the plan:
1. **Don't hack around it** — Stop and reassess
2. Add the issue to Implementation Notes in the task file
3. If scope changed: Update acceptance criteria and subtasks
4. Log the change in Progress Log
5. Continue from the adjusted plan
