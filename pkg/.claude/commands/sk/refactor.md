---
description: Refactor code safely — identify smells, restructure, verify behavior unchanged
disable-model-invocation: true
---

# Refactor — Safe Structural Improvement

Restructure code without changing its external behavior. The key constraint: **behavior must remain identical** — only the internal structure changes.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. `docs/conventions/code-style.md` — Target coding standards
3. `docs/conventions/file-structure.md` — Where files belong
4. `docs/conventions/testing.md` — Testing patterns
5. `docs/system/tech-stack.md` — Current stack

**Skip files that are empty or contain only template placeholders.** If conventions aren't configured, infer patterns from the existing codebase.

## Step 2: Scope and Track

Assess refactoring complexity:
- **XS/S** (rename, simple extract, 1-2 files) — proceed directly, no task file needed
- **M** (multi-file restructure, pattern change) — create a task file first: scan `docs/tasks/TASK-*.md` for next number, create `docs/tasks/TASK-{N}-S-{kebab-name}.md` from `docs/templates/task-prd.md` with `phase: dev`, `status: in-progress`
- **L/XL** (architecture change, cross-cutting restructure) — create a task file, may warrant an ADR via `/sk:new-adr`

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

Before any changes, verify the safety net is in place:

### 4a: Existing Test Coverage

1. Identify tests covering the target code:
   ```bash
   # Find tests that import/reference the target
   ```
   Use Grep to search for test files referencing the target module/function.

2. Run the existing test suite and record the baseline:
   ```bash
   # Run your project's test commands (check CLAUDE.md Build Commands)
   ```

3. Record the baseline result: **N tests pass, M tests fail, K skipped**

### 4b: Coverage Gaps

If the target code lacks test coverage:
- **Do NOT proceed** with high-risk refactoring without tests
- Write characterization tests first — tests that capture current behavior (even if imperfect)
- These tests are a safety net, not quality tests — they lock in current behavior

### 4c: Behavioral Snapshot

For code without automated tests, note the current behavior:
- What inputs produce what outputs?
- What side effects occur?
- What errors are thrown under what conditions?

**Checkpoint:** State: "Safety net: [N tests covering target]. Baseline: [all pass / N pass, M fail]."

## Step 5: Plan the Refactoring

**Surface assumptions before planning.** List what you're assuming about:
- How the target code is used (callers, consumers, dependents)
- Whether changing the structure will affect performance or behavior
- Which files are safe to change and which have hidden dependencies

Break the refactoring into small, safe steps. Each step should:
- Be independently committable
- Keep the code working at every intermediate point
- Be small enough to easily verify
- Be the simplest transformation that achieves the goal (don't restructure more than needed)

Present the plan:

```markdown
### Refactoring Plan

**Target:** [what's being refactored]
**Type:** [rename/extract/inline/move/restructure/simplify]
**Steps:**

1. [First safe transformation]
2. [Second safe transformation]
3. [Third safe transformation]
...

**Expected outcome:** [what the code looks like after]
**Files affected:** [list]
**Risk assessment:** [low/medium/high] — [why]
```

**Checkpoint:** Wait for user approval before proceeding.

## Step 6: Execute

Apply each step from the plan, one at a time:

### Per-Step Process

1. **Make the change** — apply a single transformation
2. **Verify** — run the test suite after each step
3. **Check** — does the code still behave identically?

### Refactoring Techniques Reference

**Extract Function:**
- Identify a block of code with a single responsibility
- Move it to a new function with a descriptive name
- Replace the original block with a call to the new function
- Ensure all variables are passed as parameters or accessible in scope

**Extract Module/Class:**
- Identify a group of related functions or data
- Create a new module/class to house them
- Update all imports/references
- Ensure the public API remains the same

**Rename:**
- Use find-and-replace across the entire codebase
- Check for string references (configs, URLs, serialized data)
- Update imports, exports, and type definitions
- Update documentation references

**Inline:**
- Replace function calls with the function body
- Remove the now-unused function
- Simplify the inlined code if it becomes clearer in context

**Move:**
- Move file to the correct location per `docs/conventions/file-structure.md`
- Update all import paths across the codebase
- Verify no broken references

**Simplify:**
- Replace nested conditionals with early returns
- Remove dead code (unused functions, unreachable branches)
- Replace complex logic with clearer alternatives
- Flatten unnecessary wrapper layers

### Rules During Execution

- **No behavior changes** — do not fix bugs, add features, or change logic
- **No drive-by improvements** — only change what's in the plan
- **If you find a bug** — note it, don't fix it (that's a separate `/sk:debug` task)
- **If tests break** — your refactoring changed behavior. Revert and rethink.
- **If a refactoring step fails 3 times** — follow `.claude/skills/escalation-rules/SKILL.md`: stop, evaluate whether the approach is correct, ask the user.

## Step 7: Verify

Read `.claude/skills/verification-before-completion/SKILL.md` before claiming verification.
You MUST paste the actual test suite output and compare to the baseline from Step 4.

After all steps are complete:

### 7a: Run Full Test Suite
```bash
# Run your project's test, type-check, and lint commands
```

Compare to the baseline from Step 4. The results must be identical:
- Same number of passing tests
- Same number of failing tests (if any were already failing)
- No new type errors or lint violations

### 7b: Behavioral Verification

For each behavior noted in Step 4c:
- Same inputs produce same outputs
- Same side effects occur
- Same errors under same conditions

### 7c: Convention Check

Verify the refactored code now follows conventions:
- Naming matches `docs/conventions/code-style.md`
- Files are in correct locations per `docs/conventions/file-structure.md`
- Import order is correct
- No violations introduced

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
- [ ] All existing tests still pass (same baseline)
- [ ] No behavior changes
- [ ] No new type errors or lint violations
- [ ] Code follows project conventions
- [ ] No drive-by changes included
- [ ] Result is simpler than before (fewer lines, less nesting, clearer names) — not just different

### Documentation (if task file was created)
- [ ] Task file marked `phase: done`, `status: done`
- [ ] `docs/tasks/README.md` updated
- [ ] `docs/conventions/file-structure.md` updated (if files moved)
- [ ] `docs/architecture/` updated (if component relationships changed)

### Before vs After
Brief comparison showing the structural improvement (not a full diff — just the key change in organization, readability, or simplicity).
