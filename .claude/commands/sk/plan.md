---
description: "Complete the PLAN phase for a task: analyze, break it into subtasks, define acceptance criteria. Use when a task exists and needs planning before implementation, or the user asks to plan a task."
argument-hint: "[TASK-N (optional — defaults to .current)]"
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

**Skip files that are empty or contain only template placeholders.** Don't waste context on unfilled templates.

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

### 3b². Targeted Research (only if needed)

If the task involves a library, API, or pattern that's unfamiliar or absent from the
codebase, offer targeted research before committing to an approach — follow
`.claude/skills/research/SKILL.md` (Quick tier; check `docs/research/` for prior
findings first). Record what changed the plan in **Technical Decisions**, with sources.

### 3c. Identify Technical Approach
```
- What patterns does the codebase already use for similar features?
- What libraries/tools are already available?
- Are there architectural constraints (check docs/decisions/)?
- What's the simplest approach that meets the acceptance criteria?
```

### 3d. Surface Assumptions and Ambiguity

Before proceeding to the plan, explicitly list what you're assuming and flag what's unclear:

1. **List assumptions** — Write down everything you believe to be true but haven't verified
2. **Flag ambiguity** — Identify requirements that could be interpreted multiple ways
3. **Present interpretations** — For each ambiguity, state the possible interpretations and your recommendation
4. **Confirm with user** — Do not proceed past PLAN until assumptions are validated

```markdown
### Assumptions & Clarifications

| # | Assumption / Ambiguity | Status | Resolution |
|---|----------------------|--------|------------|
| 1 | Email uniqueness is enforced at DB level | Verified -- unique constraint on users.email | -- |
| 2 | "Handle errors" means validation errors only | Ambiguous -- could include auth errors | Ask user |
| 3 | No rate limiting needed for this endpoint | Assumed -- not in AC | Confirm |
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

## Step 5: Adversarial Self-Review (high-stakes plans)

Before validating, attack your own plan. **Make no source edits during PLAN — stay read-only until the user approves the direction.** If the session supports plan mode, use it for this phase — the harness then enforces read-only and provides the approval gate natively.

For high-stakes work — architecture, backend, data-model, migration, or multi-file changes — dispatch the **spec-reviewer** agent (`.claude/agents/spec-reviewer.md`) in plan-review mode, or run the pass yourself. For architecturally significant or epic-level plans, also dispatch the **architecture-reviewer** agent (`.claude/agents/architecture-reviewer.md`) to pressure-test the design (boundaries, coupling, data flow, scalability) before DEV. Check the plan against four failure classes:

1. **Hard-to-reverse decisions made implicitly (or not at all)** — wire format, public IDs, data-model shape, auth, ownership. These are expensive to undo once data or callers depend on them. Surface each one explicitly instead of letting it leak in during DEV.
2. **Steps not anchored in real files or symbols** — every subtask must name actual files/functions verified in the codebase, not invented ones.
3. **A menu of options where the plan should commit to one** — pick a direction and justify it; don't defer the decision into DEV.
4. **Obvious missing decisions** — error handling, edge cases, rollout/migration order.

Route every unresolved judgment call into the Open Questions table **with a recommended answer** — never silently assume. Do not exit PLAN with a known decision left implicit.

## Step 6: Validate Plan

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
- [ ] Approach is the simplest that satisfies acceptance criteria (no speculative features)
- [ ] Adversarial self-review done — hard-to-reverse decisions surfaced explicitly, not left implicit
```

## Step 7: Update Status

1. Update YAML frontmatter: set `phase: dev`, `status: ready`, update `updated` date
2. Update `docs/tasks/README.md` — move from Planning to "ready for dev"
3. Write `docs/tasks/.current` pointing at this task (`phase: dev`, `subtask: 0/{total}` — format in `docs/tasks/README.md`) so `/sk:resume` sees the freshly planned work
4. Add entry to task's Progress Log:

```markdown
| Date | Phase | Note |
|------|-------|------|
| YYYY-MM-DD | PLAN | Plan complete — N subtasks, complexity M. Ready for dev. |
```

## Step 8: Present to User

Show:
- Acceptance criteria (final)
- Subtask list with complexity ratings
- Key technical decisions made during planning
- Assumptions confirmed with user
- Alternatives considered and rejected
- Any risks identified

Ask: **"Plan is complete. Ready to start DEV? I'll execute subtasks top-to-bottom."**
