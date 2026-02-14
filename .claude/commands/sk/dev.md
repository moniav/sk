---
description: Execute the DEV phase — implement subtasks for a task (project)
---

# Dev — Execute Implementation

Execute the [DEV] phase for a task, implementing subtasks top-to-bottom.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. The task file being implemented — find task files with `phase: dev` in frontmatter
3. The task's "Phase Analysis" section — skip re-scanning already-mapped files
4. `docs/conventions/code-style.md` — Naming, patterns, anti-patterns
5. `docs/conventions/file-structure.md` — Where files go
6. `docs/conventions/testing.md` — Testing patterns (for `[TEST]` subtasks)
7. `docs/system/database-schema.md` — If touching data layer
8. Any relevant `docs/sop/` procedures (e.g., `database-migration.md`)

## Step 2: Validate Readiness

Before writing any code, confirm:

```markdown
- [ ] Task status is `ready` (PLAN phase complete)
- [ ] All acceptance criteria are defined and testable
- [ ] All subtasks are defined with exact file paths
- [ ] No open questions blocking implementation
- [ ] Dependencies are met (prerequisite tasks done)
```

If any check fails — go back to PLAN phase (`/sk:plan` command).

## Step 3: Set Status

Update the task file frontmatter:
- `status: in-progress`
- Update `updated` date

Progress Log: Add entry `DEV phase started`

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
- [ ] Import order is correct (external > internal > relative)
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

**Tip:** For a deeper analysis of code quality, run `/sk:code-review` on your changes before moving to the TEST phase.

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

## Step 7: Write Dev Notes

Record key decisions and implementation notes in the task's "Phase Analysis > Dev Notes" section for consumption by the TEST phase.

## Step 8: DEV Exit Gate

All conditions must be true:

```markdown
- [ ] All `[DEV]` subtasks checked off
- [ ] All `[TEST]` subtasks checked off
- [ ] All `[DOCS]` subtasks checked off
- [ ] Code self-reviewed against conventions
- [ ] All existing tests still pass (no regressions)
- [ ] Documentation updated in same commit as code
```

## Step 9: Update Status

1. Update YAML frontmatter: set `phase: test`, `status: testing`, update `updated` date
2. Update Progress Log:

```markdown
| YYYY-MM-DD | DEV | All N subtasks complete, docs updated. Ready for test. |
```

3. Update `docs/tasks/README.md` — move from "In Progress" to "Testing"

Inform user: **"DEV phase complete. All subtasks implemented. Moving to TEST phase — I'll verify each acceptance criterion."**

## Error Recovery

### Plan Was Wrong (subtask reveals incorrect approach)
1. Stop implementation — do not hack around it
2. Document what was discovered in Implementation Notes
3. Update the affected acceptance criteria if needed
4. Revise subtask list (add/remove/modify subtasks)
5. Log the deviation in Progress Log
6. Continue from the revised plan

### Acceptance Criterion is Untestable
1. Rewrite the AC to be testable (yes/no verifiable)
2. If the AC is truly unnecessary, remove it with justification
3. Log the change in Progress Log

### Dependency Discovered Mid-Dev
1. Check if the dependency is a separate task that should exist
2. If yes: create a blocker note, pause this task, create the dependency task
3. If no: add it as a new subtask and implement inline

### Scope Creep Detected
1. If the new work is part of the original goal: add as subtask
2. If it's a new feature: note it in Implementation Notes, create a separate task later
3. Never expand scope without updating acceptance criteria
