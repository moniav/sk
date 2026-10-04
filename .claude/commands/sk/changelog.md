---
description: Generate changelog from git history using conventional commits
argument-hint: "[range: since last tag | vX.Y.Z..HEAD | last N commits (optional)]"
disable-model-invocation: true
---

# Changelog — Release Notes Generator

Generate a structured changelog from git commit history. Works best with conventional commits (as produced by `/sk:commit`).

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

Write the text to the rules in `.claude/skills/technical-writing/references/plain-writing-rules.md` (`docs/business/brand-voice.md` overrides them if it exists).

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. `docs/conventions/git-workflow.md` — Commit message format

**Skip files that are empty or contain only template placeholders.**

Check if a changelog already exists:
- Look for `CHANGELOG.md` in the project root
- If it exists, read it to understand the existing format and latest version

## Step 2: Determine Range

Ask the user what to include:

| Scope | Git command | Use case |
|-------|-------------|----------|
| **Since last tag** | `git log $(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)..HEAD --oneline` | Most common — changes since last release |
| **Between tags** | `git log v1.0.0..v2.0.0 --oneline` | Specific release range |
| **Since date** | `git log --since="2025-01-01" --oneline` | Time-based range |
| **Last N commits** | `git log -N --oneline` | Quick recent changes |
| **All history** | `git log --oneline` | First changelog or full rebuild |

If this isn't a git repository or has no commits yet, skip the git-based steps and note that in the output — don't error out.

Also gather:
- **Version number** — what version is this changelog for? (check `package.json`, `pyproject.toml`, `Cargo.toml`, or ask user)
- **Release date** — today's date unless specified otherwise

## Step 3: Collect and Classify Commits

Run the git log for the chosen range with full messages:
```bash
git log <range> --format="%H %s" --no-merges
```

Classify each commit by its conventional commit type:

| Type | Changelog Section | Icon |
|------|------------------|------|
| `feat` | Added | New features |
| `fix` | Fixed | Bug fixes |
| `perf` | Performance | Performance improvements |
| `refactor` | Changed | Code changes that don't add features or fix bugs |
| `docs` | Documentation | Documentation updates |
| `test` | Testing | Test additions or changes |
| `chore` | Maintenance | Build, CI, dependency updates |
| `breaking` / `!` | Breaking Changes | Changes that break backward compatibility |

**For non-conventional commits** (no `type:` prefix):
- Read the commit diff to classify: `git show --stat <hash>`
- Infer the type from the files changed and the message content

## Step 4: Generate Changelog

### Format

```markdown
# Changelog

## [X.Y.Z] - YYYY-MM-DD

### Breaking Changes
- Description of breaking change ([commit-hash])

### Added
- Description of new feature ([commit-hash])
- Description of new feature ([commit-hash])

### Fixed
- Description of bug fix ([commit-hash])
- Description of bug fix ([commit-hash])

### Performance
- Description of optimization ([commit-hash])

### Changed
- Description of refactor or behavior change ([commit-hash])

### Documentation
- Description of doc update ([commit-hash])

### Maintenance
- Description of chore/CI/build change ([commit-hash])
```

### Writing Rules

1. **User-facing language** — rewrite commit messages to be meaningful to users, not developers
   - Bad: `fix(api): handle null userId in getProfile resolver`
   - Good: `Fixed crash when viewing profiles of deleted users`

2. **Group related commits** — if 3 commits all fix the same feature, combine into one entry

3. **Omit noise** — skip commits that don't matter to users:
   - Merge commits
   - Lint/format-only changes
   - Internal refactors with no behavior change (unless the changelog is for developers)

4. **Highlight breaking changes** — always list these first with clear migration instructions

5. **Include commit references** — short hash in parentheses for traceability

6. **Scope matters** — if commits have scopes like `feat(auth):`, group entries under the scope

7. **Never invent metrics or impact claims** — describe *what* changed, not unmeasured numbers like "30% faster" or "halved memory". Only state a metric if a commit, benchmark, or measurement actually produced it; otherwise omit it.

## Step 5: Check for Breaking Changes

For any commits with `!` in the type or `BREAKING CHANGE` in the body:

1. Read the full commit message: `git show <hash>`
2. Read the actual code diff to understand the breaking change
3. Write a clear migration guide:
   ```markdown
   ### Breaking Changes
   - **Auth token format changed** — tokens now use JWT instead of opaque strings.
     Migration: regenerate all API tokens. Old tokens will stop working.
     ([abc1234])
   ```

## Step 6: Present and Write

Present the changelog to the user for review.

After approval:
1. **If `CHANGELOG.md` exists** — prepend the new version section at the top (after the `# Changelog` heading), preserving all previous entries
2. **If no `CHANGELOG.md`** — create it with the generated content
3. Show the user what was written and the file location

## Summary

Present to user:
- **Version:** X.Y.Z
- **Commits processed:** N
- **Sections:** list of non-empty sections
- **Breaking changes:** yes/no (with count if yes)
- **File:** path to CHANGELOG.md
