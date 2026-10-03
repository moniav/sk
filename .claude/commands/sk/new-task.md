---
description: "Create an implementation task with the Plan > Dev > Test lifecycle. Use when the user wants to start a feature, fix or change that should be tracked as a task."
argument-hint: "[feature description]"
---

# Create New Task

Create a self-contained task file in `docs/tasks/` following the development lifecycle.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

## Step 1: Read Context

**ALWAYS start by reading these files for context:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. `docs/README.md` — Documentation index
3. `docs/conventions/code-style.md` — Coding standards to reference in subtasks
4. `docs/conventions/file-structure.md` — Where files should go
5. `docs/system/tech-stack.md` — Current technologies and versions
6. `docs/system/database-schema.md` — Current schema state
7. `docs/tasks/README.md` — Existing tasks (avoid duplicates, find dependencies)
8. `docs/tasks/examples/TASK-user-registration-api.md` — Reference example of a completed task

**Skip files that are empty or contain only template placeholders.**

## Step 2: Gather Information

Ask the user:
- **Task title**: Short, action-oriented (e.g., "Add PDF export for reports")
- **Objective**: One sentence — what does the user get when this is done?
- **Priority**: P0 (critical/blocking) | P1 (needed this sprint) | P2 (valuable) | P3 (nice to have)
- **Context**: Any technical details, constraints, related features
- **Parent epic**: Is this part of a larger epic? Which one?

## Step 3: Generate Metadata

1. **Find next task number**: Scan `docs/tasks/TASK-*.md` filenames, extract the number from `TASK-{N}-...`, find the highest N, use N+1. If none exist, start at 1.
2. **Resolve epic number**: If the task has a parent epic, find the epic file (`docs/tasks/EPIC-{N}-*.md`) and extract its number N. Use `E{N}` in the filename. If standalone, use `S`.
3. **Filename**: `TASK-{N}-E{epicN}-{kebab-name}.md` or `TASK-{N}-S-{kebab-name}.md`
   - Example (with epic 1): "Add PDF export" — `TASK-3-E1-add-pdf-export.md`
   - Example (standalone): "Fix login bug" — `TASK-4-S-fix-login-bug.md`
4. **Date**: Today's date as `YYYY-MM-DD`
5. **Frontmatter**: Set `phase: plan`, `status: planning`, priority, epic reference

## Step 4: Analyze Scope

Before writing the task, scan the codebase to understand impact:

1. **Identify affected files**: Use `Glob` and `Grep` to find files related to the feature
2. **Check existing patterns**: Find similar features already implemented to follow their pattern
3. **Map dependencies**: What must exist before this task can start?
4. **Rate complexity**: Count affected layers (DB, API, service, UI, tests, docs) — assign XS/S/M/L/XL

## Step 5: Create Task File

Save to `docs/tasks/TASK-{N}-{E{epicN}|S}-{kebab-name}.md` using the template from `docs/templates/task-prd.md`.

Fill in the YAML frontmatter with actual values (id, title, priority, epic, dates).

**Critical requirements for task creation:**

### PLAN Section (fill completely)
- **What**: One paragraph max — problem + why
- **Acceptance Criteria**: 3-5 testable conditions (yes/no verifiable)
- **Approach**: Technical approach referencing project conventions
- **Affected Areas**: Table with exact file paths (scan codebase to confirm they exist)
- **Dependencies**: Link to prerequisite tasks or system requirements
- **Open Questions**: List anything uncertain — these MUST be resolved before DEV

### DEV Section (define subtasks)
Each subtask must be:
- **S complexity** (single concern, 1-2 files)
- **Tagged**: `[DEV]`, `[TEST]`, or `[DOCS]`
- **Specific**: Exact file paths, function names, what to implement
- **Ordered**: Dependencies flow top-to-bottom
- **Self-contained**: Can be implemented and verified independently

Follow this standard decomposition pattern, adapted to the specific task:

```markdown
### Subtasks

- [ ] **ST-1** `[DEV]` — Define/update data models (`path/to/models`)
- [ ] **ST-2** `[DEV]` — Implement service logic (`path/to/services`)
- [ ] **ST-3** `[DEV]` — Create API endpoint (`path/to/routes`)
- [ ] **ST-4** `[DEV]` — Build UI component (`path/to/components`)
- [ ] **ST-5** `[DEV]` — Wire up state and integration
- [ ] **ST-6** `[TEST]` — Unit tests for service logic
- [ ] **ST-7** `[TEST]` — Integration test for API endpoint
- [ ] **ST-8** `[TEST]` — Verify all acceptance criteria
- [ ] **ST-9** `[DOCS]` — Update system docs (schema, API, architecture)
```

### TEST Section (define test plan)
- Map each acceptance criterion to a verification method
- Include happy path, error cases, and edge cases

## Step 6: Update Task Board

Add the new task to `docs/tasks/README.md` in the **Planning** section (if `docs/tasks/README.md` doesn't exist, create it with the standard board structure first):

```markdown
### [PLAN] Planning

| Task | Parent Epic | Priority | Link |
|------|-------------|----------|------|
| Title | Epic name | P1 | [Link](./TASK-N-EN-title.md) |
```

## Step 7: Update Pointer & Present Summary

Write `docs/tasks/.current` pointing at the new task (`phase: plan`, `subtask: 0/{total}` — format in `docs/tasks/README.md`).

Show the user:
- Task ID and filename
- Acceptance criteria summary
- Subtask count and complexity rating
- Dependencies identified
- Open questions requiring resolution

Ask: **"Plan looks good? Should I resolve any open questions, or are you ready to start DEV?"**

## Validation Checklist

Before saving:
- [ ] Read templates and conventions first
- [ ] Objective is one clear sentence
- [ ] Acceptance criteria are testable (yes/no answer possible)
- [ ] Every subtask is S complexity (single concern, 1-2 files)
- [ ] Subtasks have exact file paths (verified against codebase)
- [ ] Subtask order respects dependencies
- [ ] `[TEST]` subtasks include verifying acceptance criteria
- [ ] `[DOCS]` subtask lists specific docs to update
- [ ] Task added to `docs/tasks/README.md`
- [ ] No unresolved open questions blocking DEV
