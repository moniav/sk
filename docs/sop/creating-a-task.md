# SOP: Creating & Managing Tasks

**Last updated:** YYYY-MM-DD  
**Criticality:** 🟡 Medium  

## Purpose

Follow this procedure whenever starting new work — from a bug fix to a full feature.

## Decision: What Level Do I Need?

```
"I need to build something"
         │
         ▼
   ┌─────────────┐
   │ L/XL         │──Yes──▶ Create an EPIC
   │ complexity?  │         (break into Tasks)
   └──────┬──────┘
          No
          ▼
   ┌─────────────┐
   │ M            │──Yes──▶ Create a TASK
   │ complexity?  │         (break into Subtasks)
   └──────┬──────┘
          No
          ▼
      Just do it (XS/S)
   (still follow Plan→Dev→Test)
```

## Steps

### 1. Create the Task Doc

```bash
# For an epic
cp docs/templates/epic.md docs/tasks/EPIC-feature-name.md

# For a standalone task
cp docs/templates/task-prd.md docs/tasks/TASK-feature-name.md
```

**Naming convention:** `EPIC-kebab-name.md` or `TASK-kebab-name.md`

### 2. Fill In the PLAN Phase

Complete these sections (do NOT skip to coding):

1. **What** — Write the problem statement (1 paragraph)
2. **Acceptance Criteria** — Define 2-5 testable conditions
3. **Approach** — Describe the technical approach
4. **Affected Areas** — List files/components that will change
5. **Dependencies** — List what must exist first
6. **Open Questions** — List unknowns, then resolve them

### 3. Break Down into Subtasks

Apply the **S complexity rule**. Each subtask should be:

- **Self-contained:** Can be implemented and tested independently
- **Tagged:** `[DEV]`, `[TEST]`, or `[DOCS]`
- **Ordered:** Dependencies flow top-to-bottom
- **Specific:** "Implement user signup API endpoint" not "Do backend work"

**Decomposition patterns:**

| Pattern | Subtasks Look Like |
|---------|-------------------|
| By layer | Schema → API → Service → UI → Tests |
| By operation | Create → Read → Update → Delete |
| By user action | Sign up → Log in → Reset password |
| By component | Header → Sidebar → Content → Footer |

### 4. Validate the Plan

Run this checklist before moving to DEV:

- [ ] Every acceptance criterion is testable (yes/no answer possible)
- [ ] Every subtask is S complexity (single concern, 1-2 files)
- [ ] Subtask order respects dependencies
- [ ] No open questions remain
- [ ] You know which docs need updating

### 5. Execute the DEV Phase

For each subtask, top-to-bottom:

1. Implement the subtask
2. Check the checkbox when done
3. Follow conventions (`docs/conventions/`)
4. If something unexpected comes up, add it to Implementation Notes

### 6. Execute the TEST Phase

1. Write tests for new logic (follow `docs/conventions/testing.md`)
2. Walk through each acceptance criterion
3. Test error paths and edge cases
4. Verify no existing tests broke

### 7. Close the Task

1. Update task status to `done`
2. Add final entry to Progress Log
3. Update `docs/tasks/README.md` — move task from Active to Completed
4. Update any affected system docs

## Template: Quick Subtask Breakdown

Here's a reusable pattern for most features:

```markdown
### Subtasks

- [ ] **ST-1** `[PLAN]` — Define schema/data model changes
- [ ] **ST-2** `[DEV]` — Implement data layer (schema, migrations, queries)
- [ ] **ST-3** `[DEV]` — Implement business logic (service/handler)
- [ ] **ST-4** `[DEV]` — Implement API endpoint (route, validation, response)
- [ ] **ST-5** `[DEV]` — Implement UI (component, state, integration)
- [ ] **ST-6** `[TEST]` — Unit tests for business logic
- [ ] **ST-7** `[TEST]` — Integration test for API endpoint
- [ ] **ST-8** `[TEST]` — Verify all acceptance criteria
- [ ] **ST-9** `[DOCS]` — Update schema, API, and architecture docs
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Subtasks too vague ("build the feature") | Be specific about what code to write |
| Skipping PLAN phase | The plan IS the work. Code is just typing. |
| Acceptance criteria not testable | Rewrite as yes/no questions |
| Subtasks above S complexity | Break them down further |
| Forgetting the DOCS subtask | Always include it — it's part of "done" |
| Not updating Progress Log | Future-you will thank present-you |
