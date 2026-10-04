---
description: Dependency health check — outdated, vulnerabilities, unused, licenses
argument-hint: "[manifest path (optional, for monorepos)]"
allowed-tools: Read, Grep, Glob, Bash(git status *), Bash(git diff *), Bash(git log *), Bash(git show *), Bash(git rev-parse *), Bash(git symbolic-ref *), Bash(git merge-base *), Bash(git ls-files *), Bash(git blame *), Bash(git branch --show-current), Bash(date *), Bash(npm audit *), Bash(npm outdated *), Bash(npm ls *), Bash(npm ci --dry-run *), Bash(pip list *), Bash(pip audit *), Bash(pip-audit *), Bash(safety check *), Bash(cargo audit *), Bash(cargo outdated *), Bash(cargo tree *), Bash(go list *), Bash(govulncheck *), Bash(poetry check *), Bash(poetry show *)
disable-model-invocation: true
---

# Deps — Dependency Health Check

Audit project dependencies for security vulnerabilities, outdated packages, unused dependencies, and license compliance.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

Copy the steps below into your todo list before starting. A step you decide not to do stays on the list as "skip: <reason>".

## Rules

- **Evidence.** Every finding cites `file:line` (the manifest or lock file line that declares the package, or the source line that uses it) and says how far it was proven: stated, pointed at the line, traced the path, ran it.
- **Never assert CVE status from memory.** It comes from audit tool output or from the registry/advisory pages (Step 3).
- **A missing audit tool is a finding.** Record it and continue with manual analysis.
- **Lock file.** No lock file is a Critical finding (builds are not reproducible). A lock file that exists but is not committed is a Warning.
- **Exit gate.** Done when the Step 9 tables and the Step 10 summary are presented with a location and proof level on every finding, and the Step 11 question has been asked.

## Step 1: Read Context

Read first, skipping any file that is empty or contains only template placeholders:
1. `docs/system/project-context.md` (if it exists)
2. `docs/system/tech-stack.md`

## Step 2: Detect Package Ecosystem

| File | Ecosystem | Lock file |
|------|-----------|-----------|
| `package.json` | Node.js (npm/yarn/pnpm/bun) | `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb` |
| `pyproject.toml` | Python (pip/poetry/uv) | `poetry.lock`, `uv.lock`, `requirements.txt` |
| `requirements.txt` | Python (pip) | none |
| `Cargo.toml` | Rust (cargo) | `Cargo.lock` |
| `go.mod` | Go (modules) | `go.sum` |
| `Gemfile` | Ruby (bundler) | `Gemfile.lock` |
| `composer.json` | PHP (composer) | `composer.lock` |
| `pom.xml` | Java (maven) | none |
| `build.gradle` | Java/Kotlin (gradle) | `gradle.lockfile` |

Read the detected manifest file(s).
If multiple package manifests exist (workspaces / monorepo), ask the user which package to target, or whether to cover the workspace root, before proceeding.

## Step 3: Security Vulnerabilities

Run the audit tool for the detected ecosystem:

```bash
# Node.js
npm audit 2>/dev/null || echo "npm audit not available"
# Python
pip audit 2>/dev/null || safety check 2>/dev/null || echo "No Python audit tool available"
# Rust
cargo audit 2>/dev/null || echo "cargo-audit not installed"
# Go
govulncheck ./... 2>/dev/null || echo "govulncheck not installed"
```

**Manual CVE check.** For the top 10 most critical dependencies (frameworks, auth, crypto, DB drivers), check whether the installed version has known CVEs and compare it against the latest available version.
When audit tooling is unavailable, consult the registry/advisory pages directly (WebSearch + WebFetch, per the source discipline in `.claude/skills/research/SKILL.md`).

## Step 4: Outdated Dependencies

```bash
# Node.js
npm outdated 2>/dev/null || echo "npm outdated not available"
# Python
pip list --outdated 2>/dev/null || echo "pip list not available"
# Rust
cargo outdated 2>/dev/null || echo "cargo-outdated not installed"
# Go
go list -m -u all 2>/dev/null || echo "go list not available"
```

Classify each update by risk:

| Risk | Type | Handling |
|------|------|----------|
| **Low** | Patch update (x.y.Z) | Safe to update |
| **Medium** | Minor update (x.Y.0) | Review changelog |
| **High** | Major update (X.0.0) | Breaking changes, requires migration effort |

Prioritize in this order:
1. **Security patches**: update immediately regardless of version jump
2. **Major framework updates**: plan as a task (may require code changes)
3. **Minor updates**: batch and update periodically
4. **Patch updates**: update freely

## Step 5: Unused Dependencies

For each dependency in the manifest, Grep the source code for import/require statements that reference it.
A dependency with no import is still NOT unused when it is any of:
- a build tool, linter, formatter, test framework, CLI tool or plugin used from config files or scripts
- a type-only package (`@types/*`)
- a peer dependency required by another package

Report a dependency as unused only after the Grep and these three checks all come back empty.

## Step 6: License Compliance

Read the license field from each dependency's manifest or LICENSE file and classify it:

| Risk | Licenses | Implication |
|------|----------|-------------|
| **Permissive** | MIT, BSD-2, BSD-3, ISC, Apache-2.0 | Free to use commercially |
| **Weak copyleft** | LGPL-2.1, LGPL-3.0, MPL-2.0 | Must share modifications to the library itself |
| **Strong copyleft** | GPL-2.0, GPL-3.0, AGPL-3.0 | Must open-source your entire project |
| **Proprietary** | Commercial, custom | May require paid license |
| **Unknown** | No license specified | Legally risky, all rights reserved by default |

Flag:
- Any GPL/AGPL dependency in a proprietary project
- Any dependency with no license specified
- Any dependency with a license incompatible with the project's license

## Step 7: Dependency Quality Signals

For the top 15 most critical dependencies, check maintenance (last commit date, open issues, release frequency), popularity (downloads, stars: a rough signal only), bus factor (active maintainers) and whether a better-maintained alternative exists.

Flag dependencies that:
- Haven't been updated in >12 months
- Have >100 open issues with no recent activity
- Have a single maintainer
- Are deprecated or archived

## Step 8: Lock File Health

Check that a lock file exists and is committed (severities in Rules), then check integrity:

```bash
# Node.js
npm ci --dry-run 2>/dev/null
# Python (poetry)
poetry check 2>/dev/null
# Rust
cargo tree --locked 2>/dev/null
```

For Node.js projects, check for duplicate packages at different versions:
```bash
npm ls --all 2>/dev/null | grep "deduped" | head -20
```

## Step 9: Present Findings

Use these four sections, in this order.
Warning and Suggestion use the same columns as Critical.

### Critical (security risk or build instability)

| # | Category | Package | Location | Finding | Proof | Action |
|---|----------|---------|----------|---------|-------|--------|
| 1 | Vulnerability | `pkg@1.0.0` | `package.json:14` | CVE description | ran it | Update to `1.0.1` |

### Warning (should address soon)

### Suggestion (maintenance improvement)

### Info (observations)

| # | Category | Observation |
|---|----------|-------------|
| 1 | Licenses | All dependencies use permissive licenses |

## Step 10: Dependency Health Summary

| Area | Status | Detail |
|------|--------|--------|
| Vulnerabilities | OK / WARN / CRITICAL | N known vulnerabilities |
| Outdated | OK / WARN / CRITICAL | N major, M minor, K patch updates available |
| Unused | OK / WARN | N potentially unused dependencies |
| Licenses | OK / WARN / CRITICAL | License compliance status |
| Lock file | OK / WARN / CRITICAL | Lock file status |
| Maintenance risk | OK / WARN | Dependencies with low maintenance signals |

**Recommended actions (priority order):** a numbered list of the three most urgent actions.

## Step 11: Persist Report (Optional)

Ask: **"Save this dependency report to `docs/reviews/deps/YYYY-MM-DD-audit.md`?"**

If yes, save using the template from `docs/templates/review-report.md`.

**Reply:** the Step 9 findings tables (every finding with `file:line` and proof level), the Step 10 summary table, the three recommended actions, a count of findings per severity, any audit tool that was unavailable, and the report path if it was saved.
