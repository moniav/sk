---
description: Handle breaking changes, dependency upgrades, and database migrations safely (project)
---

# /sk:migrate — Migration & Upgrade

Structured approach to handling breaking changes, major version upgrades, and database migrations.

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
   - Read changelogs, migration guides, release notes
   - List each breaking change with affected code locations

3. **Rollback plan** — How do we undo this?
   - Can we revert with git?
   - Do we need a down migration for DB changes?
   - Are there data transformations that aren't reversible?

4. **Test coverage** — Do we have tests for affected areas?
   - Run existing tests to establish baseline (all should pass before migration)

## Step 4: Create Migration Plan

Break the migration into ordered steps:

```markdown
### Migration Plan: [name]

**Pre-conditions:**
- [ ] All tests passing (baseline)
- [ ] Working branch created
- [ ] Rollback plan documented

**Steps:**
1. [Each step should be atomic and independently verifiable]
2. [Order matters — dependency-aware sequencing]
3. [Include "verify" checkpoints between major steps]

**Post-conditions:**
- [ ] All existing tests pass
- [ ] New tests cover migration-specific changes
- [ ] No deprecation warnings introduced
- [ ] Documentation updated
```

## Step 5: Execute Migration

For each step in the plan:

1. **Make the change** — One logical change at a time
2. **Verify** — Run tests, check for regressions
3. **Commit** — Atomic commit per step (enables bisect if issues found later)

### If something breaks during migration:
- Stop and assess — don't push through
- Check if it's a known issue in the migration guide
- Consider partial rollback to last good checkpoint
- Use `/sk:debug` if the issue isn't obvious

## Step 6: Verify Complete Migration

Run full verification:
- [ ] All pre-existing tests pass
- [ ] No new warnings or deprecations (unless expected and documented)
- [ ] Application starts and runs correctly
- [ ] Key user flows work end-to-end
- [ ] Performance hasn't regressed significantly

## Step 7: Update Documentation

- Update `docs/system/tech-stack.md` with new versions
- Update `docs/system/database-schema.md` if schema changed
- Create an ADR if this was a significant decision (`/sk:new-adr`)
- Update any affected convention files

## Guidelines

- **Always establish a passing baseline before starting** — if tests fail before migration, fix those first
- **Atomic commits per step** — enables git bisect and partial rollback
- **Read the migration guide** — most major libraries publish one; don't guess
- **Don't combine migration with feature work** — migrate first, then build on it
- **Test more than usual** — migrations are high-risk; runtime testing matters, not just unit tests
