---
description: Execute the TEST phase — verify acceptance criteria and run all tests (project)
---

# Test — Verify Implementation

Execute the 🧪 TEST phase for a task, verifying every acceptance criterion.

## Step 1: Read Context

**ALWAYS start by reading:**
1. The task file being tested (`docs/tasks/TASK-*-t-*.md` — should be in test phase) — especially Acceptance Criteria
2. `docs/lifecycle/README.md` — TEST phase rules and exit gate
3. `docs/conventions/testing.md` — Testing standards and patterns

## Step 2: Validate Readiness

```markdown
- [ ] Task status is `testing` (DEV phase complete)
- [ ] All `[DEV]` subtasks are checked off
- [ ] All `[TEST]` subtasks are checked off (test code written)
- [ ] All `[DOCS]` subtasks are checked off
```

If DEV isn't complete → go back (`/sk:dev` command).

## Step 3: Run Automated Tests

```bash
# Run your project's test, type-check, and lint commands
# (check docs/system/tech-stack.md and CLAUDE.md for exact commands)
#
# Examples:
#   npm test / pytest / python -m unittest
#   npm run typecheck / mypy . / pyright
#   npm run lint / ruff check . / flake8
```

Document results:
```markdown
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] No type errors
- [ ] No lint errors
- [ ] No new warnings introduced
```

## Step 4: Verify Acceptance Criteria

Go through each acceptance criterion **one by one**. For each:

1. **Read the criterion** from the task file
2. **Execute the test** — Run the specific scenario
3. **Record the result** — Update the Verification section in the task file
4. **If it fails** — Stop, document the failure, return to DEV

```markdown
### Verification

- [ ] **AC-1** verified: [describe exactly how you confirmed it]
- [ ] **AC-2** verified: [describe exactly how you confirmed it]
- [ ] **AC-3** verified: [describe exactly how you confirmed it]
```

**Be specific in verification notes.** Not "it works" but "POST /api/users with valid payload returns 201 with {id, email, name}, no password_hash field present."

## Step 5: Test Error Paths

For each feature area, test what happens when things go wrong:

```markdown
### Error Path Testing

| Scenario | Input | Expected | Actual | Pass? |
|----------|-------|----------|--------|-------|
| Invalid input | Missing required field | 400 + field error | — | — |
| Unauthorized | No auth token | 401 | — | — |
| Not found | Invalid ID | 404 | — | — |
| Duplicate | Existing unique value | 409 | — | — |
| Server error | Force internal error | 500 + logged | — | — |
```

## Step 6: Test Edge Cases

```markdown
### Edge Case Testing

| Scenario | Input | Expected | Actual | Pass? |
|----------|-------|----------|--------|-------|
| Empty data | Empty array/object | Graceful handling | — | — |
| Boundary values | Max length string | Accepted or clear error | — | — |
| Null/undefined | Null where object expected | Clear error, no crash | — | — |
| Concurrent requests | Rapid duplicate calls | Idempotent or proper error | — | — |
| Large payload | Oversized input | Rejection with clear error | — | — |
```

## Step 7: Regression Check

Verify the existing system still works:

```markdown
### Regression Testing

- [ ] Full test suite passes (same as Step 3)
- [ ] Existing features still work (quick manual smoke test)
- [ ] No unexpected errors or warnings in output
- [ ] No new errors in server logs
- [ ] Performance not degraded (page loads, API response times)
```

## Step 8: TEST Exit Gate

**ALL must be true to pass:**

```markdown
- [ ] Every acceptance criterion verified with specific evidence
- [ ] Error paths tested — errors are handled gracefully
- [ ] Edge cases tested — no crashes or unexpected behavior
- [ ] All automated tests pass
- [ ] No regressions in existing functionality
- [ ] No type errors, lint errors, or new warnings
```

## Step 9: Update Task Status

### If ALL criteria pass:

1. Set task status to `done`
2. **Rename the file**: Change the phase shortcut from `-t-` to `-x-` (test complete = done)
   - Example: `TASK-1-E1-t-registration-api.md` → `TASK-1-E1-x-registration-api.md`
   - For epics: `EPIC-1-t-user-auth.md` → `EPIC-1-x-user-auth.md`
   - Use `git mv` if the file is tracked
3. **Update all references** to the old filename:
   - `docs/tasks/README.md` — update any links pointing to the old name
   - Parent epic file — update task references if applicable
   - Any other files that link to this task
4. Update the Verification section with results
5. Update Progress Log:

```markdown
| YYYY-MM-DD | TEST | All ACs verified, all tests pass. File renamed -t- to -x-. |
| YYYY-MM-DD | DONE | Task complete |
```

6. Move task in `docs/tasks/README.md` from "Testing" to "Recently Completed"

Inform user: **"Task complete. All N acceptance criteria verified. Docs updated."**

### If ANY criterion fails:

1. Keep task status as `testing`
2. Document the failure in the task file:

```markdown
| YYYY-MM-DD | TEST | AC-2 failed: [description of failure] |
```

3. Identify the fix needed
4. Return to DEV to fix the issue
5. Re-run TEST from Step 3

Inform user: **"❌ AC-2 failed: [description]. Returning to DEV to fix. Will re-verify after."**
