---
description: Complete the PLAN phase for a task — analyze, break down, define criteria (project)
---

# Plan Task

Complete the [PLAN] phase for a task, taking it from `backlog`/`planning` to `ready`.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. `docs/conventions/code-style.md` — To reference in subtasks
3. `docs/conventions/file-structure.md` — To identify correct file locations
4. `docs/system/tech-stack.md` — Available tools and frameworks
5. `docs/system/database-schema.md` — Current data model
6. `docs/architecture/README.md` — System design constraints

## Step 2: Identify the Task

Ask the user which task to plan, or:
- List tasks with status `backlog` or `planning` from `docs/tasks/README.md`
- Scan `docs/tasks/TASK-*.md` files and read their YAML frontmatter to find tasks with `phase: plan`

## Step 3: Deep Codebase Analysis

For the specific task, perform a thorough analysis:

### 3a. Map the Feature Area
```
- Grep for related terms in the codebase
- Find existing similar patterns/features
- Identify all files that will need changes
- Note any shared utilities or components that could be reused
```

### 3b. Understand Current State
```
- Read the current implementation of related features
- Check the database schema for relevant tables
- Review API endpoints that interact with this area
- Examine test coverage in this area
```

### 3c. Identify Technical Approach
```
- What patterns does the codebase already use for similar features?
- What libraries/tools are already available?
- Are there architectural constraints (check docs/decisions/)?
- What's the simplest approach that meets the acceptance criteria?
```

## Step 4: Complete the PLAN Section

Update the task file with:

### Acceptance Criteria Refinement
Ensure each criterion is:
- **Testable**: Has a clear yes/no verification method
- **Specific**: References exact behavior, not vague quality
- **Independent**: Can be verified without other criteria
- **Valuable**: Failing this criterion means the task isn't done

Bad: "The feature works well"
Good: "POST `/api/users` returns `201` with `{id, email, name}` — no password hash in response"

### Affected Areas Table
Fill with **exact paths** verified by scanning the codebase:

```markdown
| Area | Change Type | Files |
|------|-----------|-------|
| Database | New table | `path/to/schema`, `migrations/NNN_desc.sql` |
| API | New endpoint | `path/to/routes` |
| Service | New service | `path/to/services` |
| UI | New component | `path/to/components` |
| Tests | New tests | `tests/path/to/test_file` |
| Docs | Update | `docs/system/database-schema.md` |
```

### Subtask Breakdown
Apply the S complexity rule. For each subtask:
1. Tag it: `[DEV]`, `[TEST]`, or `[DOCS]`
2. Include the exact file path
3. Describe what to implement (not just "build the thing")
4. Order by dependency (top-to-bottom execution)

### Resolve Open Questions
- List every uncertainty
- Research each one (check codebase, docs, conventions)
- Record the answer in the Open Questions table
- **No unresolved questions at PLAN exit gate**

### Write Phase Analysis
Record scan results and technical decisions in the task's "Phase Analysis" section:
- **Codebase Scan Results**: Patterns found, affected files, reusable utilities
- **Technical Decisions**: Approach chosen and why

## Step 5: Validate Plan

Run the PLAN exit gate checklist:

```markdown
- [ ] Problem statement is clear (what & why)
- [ ] Every acceptance criterion is testable (yes/no answer possible)
- [ ] Every subtask is S complexity (single concern, 1-2 files)
- [ ] Every subtask has an exact file path
- [ ] Subtask order respects dependencies
- [ ] No open questions remain unresolved
- [ ] Affected docs identified for updating
- [ ] Approach follows existing codebase patterns
```

## Step 6: Update Status

1. Update YAML frontmatter: set `phase: dev`, `status: ready`, update `updated` date
2. Update `docs/tasks/README.md` — move from Planning to "ready for dev"
3. Add entry to task's Progress Log:

```markdown
| Date | Phase | Note |
|------|-------|------|
| YYYY-MM-DD | PLAN | Plan complete — N subtasks, complexity M. Ready for dev. |
```

## Step 7: Present to User

Show:
- Acceptance criteria (final)
- Subtask list with complexity ratings
- Key technical decisions made during planning
- Any risks identified

Ask: **"Plan is complete. Ready to start DEV? I'll execute subtasks top-to-bottom."**
