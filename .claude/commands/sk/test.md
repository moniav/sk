---
description: Execute the TEST phase — verify acceptance criteria and run all tests
argument-hint: "[TASK-N (optional — defaults to .current)]"
disable-model-invocation: true
---

# Test — Verify Implementation

Execute the [TEST] phase for a task, verifying every acceptance criterion.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

Copy the steps below into your todo list before starting. A step you decide not to do stays on the list as "skip: <reason>".

**Rules for the whole phase:**

- Every claim needs output produced in this session. Read `.claude/skills/verification-before-completion/SKILL.md` now; its rules apply to every step.
- Every acceptance criterion ends as exactly one of **passed**, **failed** or **untested** (with the reason). Never leave one out because it could not be checked.
- Fix and re-verify one criterion at a time. Do not batch fixes.
- The task is not done while any criterion is failed or untested.

## Step 1: Read Context

1. `docs/system/project-context.md`
2. The task file being tested (the one with `phase: test` in its frontmatter, or the one named in the arguments): the Acceptance Criteria, and "Phase Analysis > Dev Notes"
3. `docs/conventions/testing.md`

Skip files that are empty or contain only template placeholders.

## Step 2: Validate Readiness

- [ ] Task status is `testing`
- [ ] Every `[DEV]`, `[TEST]` and `[DOCS]` subtask is checked off

If not, stop and tell the user the DEV phase is incomplete (they continue it with `/sk:dev`).

Record the revision under test: the output of `git rev-parse --short HEAD` and the branch, or "uncommitted changes on `<branch>`".

## Step 3: Run the Automated Checks

Run the project's test, type-check and lint commands. The exact commands are in `CLAUDE.md` under Build Commands, or in `docs/system/tech-stack.md`. If a kind of check does not exist in this project, record it as "none configured", not as passed.

Paste the output of each command.

- [ ] Tests: command and output, zero failures
- [ ] Type check: command and output, zero errors
- [ ] Lint: command and output, zero errors
- [ ] No warnings that were not there before the change

## Step 4: Verify Each Acceptance Criterion

First restate each criterion as a concrete check. If a criterion cannot be restated as "done when X", it is too vague to verify: record it as untested and say the plan needs a sharper criterion.

Then go through them one by one: run the check, keep the output, record the result in the task file's Verification section.

```markdown
### Verification

Revision: <commit hash> on <branch>

| AC | Done when | What was run | Result | Proof |
|----|-----------|--------------|--------|-------|
| AC-1 | <observable outcome> | <command or action> | passed / failed / untested | ran / reproduced, or the reason it is untested |
```

"Proof" is how far the result was proven, on the scale in the verification skill. Aim for "ran" or "reproduced" for every criterion.

**When a criterion fails:** find the root cause, make the smallest fix, re-run that criterion, then re-run the full suite from Step 3, and only then move to the next criterion. After three failed fixes for the same criterion, stop and follow the `escalation-rules` skill.

## Step 5: Error Paths and Edge Cases

For each feature area the task touched, test what happens when things go wrong. Pick the cases that apply; the rows below are prompts, not a required list.

```markdown
### Error Paths and Edge Cases

| Scenario | Input | Expected | Actual | Result |
|----------|-------|----------|--------|--------|
| Invalid input | <a required field missing> | <clear error, nothing saved> | | |
| Not permitted | <no credentials> | <refused> | | |
| Not found | <an id that does not exist> | <clear error> | | |
| Duplicate | <an existing unique value> | <refused, or idempotent> | | |
| Empty | <empty collection> | <handled, no crash> | | |
| Boundary | <maximum size or length> | <accepted, or a clear error> | | |
```

Fill "Actual" from what you observed, and "Result" with passed, failed or untested.

## Step 6: Regression Check

- [ ] The full suite from Step 3, run again after the last fix: paste the output
- [ ] The failure count is not higher than before the task (state both counts if the suite was not clean to begin with)

## Step 7: Exit Gate

All must be true:

- [ ] Every acceptance criterion is **passed**, with what was run and its output
- [ ] No criterion is failed or untested
- [ ] The automated checks in Step 3 are clean, with output
- [ ] The Verification table in the task file is filled in and names the revision

## Step 8: Update Task Status

**If the gate passes:**

1. Set frontmatter `phase: done`, `status: done`, update `updated`, clear `claimed_by` and `claimed_at`
2. Add to the Progress Log: `| YYYY-MM-DD | TEST | All ACs verified, all tests pass. |` and `| YYYY-MM-DD | DONE | Task complete |`
3. Move the task in `docs/tasks/README.md` from "Testing" to "Recently Completed"
4. Delete `docs/tasks/.current`

**If it does not:**

1. Keep status `testing`
2. Add to the Progress Log: `| YYYY-MM-DD | TEST | AC-N <failed or untested>: <what happened> |`
3. Say what is needed: a fix (the DEV phase), or whatever is blocking an untested criterion

**Reply:** the revision tested, the result for every acceptance criterion (passed, failed or untested, with what was run), the output of the test command, and either "task complete" or exactly what blocks it. Suggest `/sk:security-review` when the task touched authentication, input handling or sensitive data.
