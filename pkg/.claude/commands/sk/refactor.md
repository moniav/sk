---
description: Refactor code safely — identify smells, restructure, verify behavior unchanged
argument-hint: "[file, module or smell to refactor]"
disable-model-invocation: true
---

# Refactor — Safe Structural Improvement

Restructure code without changing its external behavior. The key constraint: **behavior must remain identical** — only the internal structure changes.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

Copy the steps below into your todo list before starting. A step you decide not to do stays on the list as "skip: <reason>".

## Rules

- **Proof of unchanged behavior.** Run the same test command before the first change (Step 4) and after the last (Step 7), and paste both outputs. Pass, fail and skip counts must be identical. Without both outputs the refactoring is not done.
- **No behavior changes.** Do not fix bugs, add features, or change logic.
- **No drive-by improvements.** Only change what is in the approved plan.
- **If you find a bug:** note it, don't fix it. That is a separate `/sk:debug` task.
- **If tests break:** your refactoring changed behavior. Revert and rethink.
- **If a refactoring step fails 3 times:** follow `${CLAUDE_PLUGIN_ROOT}/.claude/skills/escalation-rules/SKILL.md`: stop, evaluate whether the approach is correct, ask the user.
- **No tests, no high-risk refactoring.** If the target lacks coverage, write characterization tests first (Step 4b).
- **Approval gate.** Do not execute (Step 6) until the user has approved the plan from Step 5.

## Step 1: Read Context

Read first, skipping any file that is empty or contains only template placeholders:
1. `docs/system/project-context.md` (if it exists)
2. `docs/conventions/code-style.md`
3. `docs/conventions/file-structure.md`
4. `docs/conventions/testing.md`
5. `docs/system/tech-stack.md`

If conventions aren't configured, infer patterns from the existing codebase.

## Step 2: Scope and Track

Assess refactoring complexity:
- **XS/S** (rename, simple extract, 1-2 files): proceed directly, no task file needed
- **M** (multi-file restructure, pattern change): create a task file first. Scan `docs/tasks/TASK-*.md` for the next number, then create `docs/tasks/TASK-{N}-S-{kebab-name}.md` from `docs/templates/task-prd.md` with `phase: dev`, `status: in-progress`
- **L/XL** (architecture change, cross-cutting restructure): create a task file the same way. It may warrant an ADR: suggest `/sk:new-adr` to the user

For M+ refactorings, update `docs/tasks/README.md` to track the work.

## Step 3: Define Scope

Ask the user:

| Field | What to capture |
|-------|----------------|
| **Target** | What code to refactor (file, module, function, pattern) |
| **Motivation** | Why refactor? (readability, performance, maintainability, coupling, duplication) |
| **Constraints** | Any areas to avoid touching, backward compatibility requirements |

Determine the refactoring type:

| Type | Description | Risk |
|------|-------------|------|
| **Rename** | Better names for variables, functions, files | Low |
| **Extract** | Pull code into new functions, classes, or modules | Low-Medium |
| **Inline** | Remove unnecessary abstractions, merge small functions | Low-Medium |
| **Move** | Relocate code to better locations per file-structure conventions | Medium |
| **Restructure** | Change data structures, patterns, or architecture | High |
| **Simplify** | Reduce complexity, remove dead code, flatten nesting | Low-Medium |

## Step 4: Establish Safety Net

Do this before any change.

### 4a: Existing Test Coverage

1. Use Grep to list the test files that reference the target module/function.
2. Run the project's test commands (check CLAUDE.md Build Commands).
3. Record the exact command and the baseline result: **N tests pass, M tests fail, K skipped**. Keep the output for Step 7.

### 4b: Coverage Gaps

If the target code lacks test coverage:
- **Do NOT proceed** with high-risk refactoring without tests
- Write characterization tests first: tests that lock in current behavior, even where that behavior is imperfect

### 4c: Behavioral Snapshot

For code without automated tests, write down the current behavior:
- What inputs produce what outputs?
- What side effects occur?
- What errors are thrown under what conditions?

**Checkpoint:** State: "Safety net: [N tests covering target]. Baseline: [all pass / N pass, M fail]."

## Step 5: Plan the Refactoring

**Surface assumptions before planning.** List what you're assuming about:
- How the target code is used (callers, consumers, dependents)
- Whether changing the structure will affect performance or behavior
- Which files are safe to change and which have hidden dependencies

Break the refactoring into steps. Each step must:
- Be independently committable
- Leave the test command from Step 4 passing at the baseline
- Be the simplest transformation that achieves the goal (don't restructure more than needed)

Present the plan:

```markdown
### Refactoring Plan

**Target:** [what's being refactored]
**Type:** [rename/extract/inline/move/restructure/simplify]
**Steps:**

1. [First safe transformation]
2. [Second safe transformation]
...

**Expected outcome:** [what the code looks like after]
**Files affected:** [list]
**Risk assessment:** [low/medium/high]: [why]
```

**Checkpoint:** Wait for user approval before proceeding.

## Step 6: Execute

Apply the plan one step at a time. For each step:

1. **Make the change**: a single transformation
2. **Verify**: run the Step 4 test command and compare its counts to the baseline
3. Move to the next step only when the counts match. If they don't, apply the Rules above.

Per type, also check:
- **Rename:** string references (configs, URLs, serialized data), imports, exports, type definitions and documentation references
- **Extract module/class:** all imports/references updated and the public API unchanged
- **Inline:** the now-unused function is removed
- **Move:** destination follows `docs/conventions/file-structure.md` and every import path across the codebase is updated

## Step 7: Verify

Read `${CLAUDE_PLUGIN_ROOT}/.claude/skills/verification-before-completion/SKILL.md` before claiming verification.
You MUST paste the actual test suite output and compare to the baseline from Step 4.

### 7a: Run Full Test Suite

Run the same test command as Step 4, plus the project's type-check and lint commands.
The results must be identical to the baseline:
- Same number of passing tests
- Same number of failing tests (if any were already failing)
- No new type errors or lint violations

### 7b: Behavioral Verification

For each behavior written down in Step 4c, show that the same inputs produce the same outputs, the same side effects occur, and the same errors are thrown under the same conditions.

### 7c: Convention Check

- Naming matches `docs/conventions/code-style.md`
- Files are in correct locations per `docs/conventions/file-structure.md`
- Import order is correct

## Step 8: Close Out

Present to user:

### Refactoring Complete

| Field | Detail |
|-------|--------|
| **Target** | What was refactored |
| **Type** | Rename / Extract / Inline / Move / Restructure / Simplify |
| **Steps taken** | Count of transformations applied |
| **Files changed** | List of modified/moved/created/deleted files |

### Verification
- [ ] All existing tests still pass (same baseline, before and after output shown)
- [ ] No behavior changes
- [ ] No new type errors or lint violations
- [ ] Code follows project conventions
- [ ] No drive-by changes included
- [ ] Result is simpler than before (fewer lines, less nesting, clearer names), not just different

### Documentation (if task file was created)
- [ ] Task file marked `phase: done`, `status: done`
- [ ] `docs/tasks/README.md` updated
- [ ] `docs/conventions/file-structure.md` updated (if files moved)
- [ ] `docs/architecture/` updated (if component relationships changed)

### Before vs After
A brief comparison of the key structural change (organization, readability, or simplicity), not a full diff.

**Reply:** the Refactoring Complete table, the test command with its output before and after and the matching pass/fail/skip counts, the Verification and Documentation checklists with each box resolved, the Before vs After comparison, and any bug noted but not fixed.
