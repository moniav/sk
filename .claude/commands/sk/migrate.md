---
description: Handle breaking changes, dependency upgrades, and database migrations safely
argument-hint: "[what to migrate: dependency and version | breaking change | schema change]"
disable-model-invocation: true
---

# /sk:migrate — Migration & Upgrade

Structured approach to handling breaking changes, major version upgrades, and database migrations.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

Copy the steps below into your todo list before starting. A step you decide not to do stays on the list as "skip: <reason>".

## Rules

- **Passing baseline first.** Run the test suite before changing anything and record the command and its output. If tests fail before the migration, fix those first.
- **Atomic commit per step.** This enables git bisect and partial rollback.
- **Read the migration guide.** Most major libraries publish one. Do not work from memory.
- **Do not combine migration with feature work.** Migrate first, then build on it.
- **Test beyond unit tests.** Migrations are high-risk: start the application and exercise it, as Step 6 requires.

## Step 1: Read Context

Read these files to understand the current state:
- `docs/system/project-context.md` — project overview
- `docs/system/tech-stack.md` — current dependencies and versions
- `docs/system/database-schema.md` — current schema (if applicable)
- `docs/conventions/code-style.md` — coding patterns
- `docs/conventions/testing.md` — test requirements

If convention files are templates or don't exist, note this and proceed with sensible defaults.

## Step 2: Identify Migration Type

| Type | Description | Risk Level |
|------|------------|------------|
| **Dependency upgrade** | Major version bump of a library/framework | Medium-High |
| **Database migration** | Schema changes (add/alter/drop) | High |
| **API breaking change** | Changing public API contracts | High |
| **Runtime upgrade** | Node.js, Python, etc. version change | Medium |
| **Config migration** | Build tool, CI/CD, or config format changes | Low-Medium |

Ask the user what they're migrating if not specified.

## Step 3: Impact Analysis

Before making any changes:

1. **Blast radius** — What files/modules are affected?
   - Search for imports/usage of the thing being changed
   - Map the dependency tree

2. **Breaking changes** — What specifically breaks?
   - **Fetch the official migration guide and changelog for the exact version jump**
     (WebSearch `"{package} migration guide v{X} to v{Y}"` / release notes, then
     WebFetch the official pages). Follow the source discipline in
     `.claude/skills/research/SKILL.md` — never work from memory of the API;
     knowledge cutoffs make remembered breaking-change lists wrong.
   - List each breaking change with affected code locations

3. **Rollback plan** — How do we undo this?
   - Can we revert with git?
   - Do we need a down migration for DB changes?
   - Are there data transformations that aren't reversible?

4. **Test coverage** — Do we have tests for affected areas?
   - Run the existing test suite and record the command, the pass and fail counts, and the warning count as the baseline. Any failure is fixed before the migration starts.

Step 3 is done when you have written down: the affected files (with the search that found them), each breaking change with its source URL and affected locations, the commands that roll the migration back, and the baseline test output.

## Step 4: Create Migration Plan

Break the migration into ordered steps:

```markdown
### Migration Plan: [name]

**Pre-conditions:**
- [ ] Baseline recorded: test command, its output, zero failures
- [ ] Working branch created: [branch name]
- [ ] Rollback plan written: the exact commands that undo each step, and any step that cannot be undone

**Steps:**
1. [Each step should be atomic and independently verifiable]
2. [Order matters — dependency-aware sequencing]
3. [Include "verify" checkpoints between major steps]

**Post-conditions:**
- [ ] All existing tests pass: same command as the baseline, pass count not lower
- [ ] Each breaking change from Step 3 has a test that exercises the changed code path
- [ ] Deprecation warning count is not higher than the baseline
- [ ] Each doc named in Step 7 is updated, or marked `n/a: <reason>`
```

## Step 5: Execute Migration

For each step in the plan:

1. **Make the change** — One logical change at a time
2. **Verify**: run the test suite and compare the pass count to the baseline. A step with a new failure is not committed.
3. **Commit** — Atomic commit per step (enables bisect if issues found later)

### If something breaks during migration:
- Stop and assess — don't push through
- Check if it's a known issue in the migration guide
- Consider partial rollback to last good checkpoint
- Use `/sk:debug` if the issue isn't obvious

## Step 6: Verify Complete Migration

Run full verification. For each box, show the command you ran and its output:
- [ ] All pre-existing tests pass: the baseline command re-run, pass count not lower, zero failures
- [ ] No new warnings or deprecations against the baseline count (unless expected and documented)
- [ ] Application starts: the start command was run and its output shows no error
- [ ] Each key user flow was exercised end-to-end: list the flow, the steps or command used, and the observed result
- [ ] Performance compared before and after with the same measurement (test-suite duration or an existing benchmark), both numbers recorded. If nothing was measured, the box stays unchecked and the reply says `performance: not measured`

State the count (`Migration gate: N/5`). An unchecked box is fixed, or reported to the user with the reason.

## Step 7: Update Documentation

- Update `docs/system/tech-stack.md` with new versions
- Update `docs/system/database-schema.md` if schema changed
- If this was a significant decision, suggest the user record it with `/sk:new-adr`
- Update any affected convention files

**Reply:** what was migrated (from and to), the baseline and final test commands with their output, the Step 6 gate count with any unchecked box explained, commits made, the rollback commands, and docs updated.
