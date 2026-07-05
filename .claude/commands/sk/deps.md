---
description: Dependency health check — outdated, vulnerabilities, unused, licenses (project)
allowed-tools: Read, Grep, Glob, Bash(git:*), Bash(date:*), Bash(npm:*), Bash(pip:*), Bash(safety:*), Bash(cargo:*), Bash(go:*), Bash(govulncheck:*), Bash(poetry:*)
---

# Deps — Dependency Health Check

Audit project dependencies for security vulnerabilities, outdated packages, unused dependencies, and license compliance.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. `docs/system/tech-stack.md` — Current stack and key dependencies

**Skip files that are empty or contain only template placeholders.**

## Step 2: Detect Package Ecosystem

Scan for manifest files to determine the ecosystem:

| File | Ecosystem | Lock file |
|------|-----------|-----------|
| `package.json` | Node.js (npm/yarn/pnpm/bun) | `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb` |
| `pyproject.toml` | Python (pip/poetry/uv) | `poetry.lock`, `uv.lock`, `requirements.txt` |
| `requirements.txt` | Python (pip) | — |
| `Cargo.toml` | Rust (cargo) | `Cargo.lock` |
| `go.mod` | Go (modules) | `go.sum` |
| `Gemfile` | Ruby (bundler) | `Gemfile.lock` |
| `composer.json` | PHP (composer) | `composer.lock` |
| `pom.xml` | Java (maven) | — |
| `build.gradle` | Java/Kotlin (gradle) | `gradle.lockfile` |

Read the detected manifest file(s) to understand the dependency tree. If multiple package manifests exist (workspaces / monorepo), ask the user which package to target — or cover the workspace root — before proceeding.

## Step 3: Security Vulnerabilities

Run the appropriate audit tool for the detected ecosystem:

### Node.js
```bash
npm audit 2>/dev/null || echo "npm audit not available"
```

### Python
```bash
pip audit 2>/dev/null || safety check 2>/dev/null || echo "No Python audit tool available"
```

### Rust
```bash
cargo audit 2>/dev/null || echo "cargo-audit not installed"
```

### Go
```bash
govulncheck ./... 2>/dev/null || echo "govulncheck not installed"
```

If the audit tool is not available, note it as a finding and continue with manual analysis.

### Manual CVE Check
For the top 10 most critical dependencies (frameworks, auth, crypto, DB drivers):
- Check if the installed version has known CVEs
- Compare against the latest available version

## Step 4: Outdated Dependencies

### Check for Updates

**Node.js:**
```bash
npm outdated 2>/dev/null || echo "npm outdated not available"
```

**Python:**
```bash
pip list --outdated 2>/dev/null || echo "pip list not available"
```

**Rust:**
```bash
cargo outdated 2>/dev/null || echo "cargo-outdated not installed"
```

**Go:**
```bash
go list -m -u all 2>/dev/null || echo "go list not available"
```

### Classify Updates by Risk

| Risk | Type | Examples |
|------|------|---------|
| **Low** | Patch update (x.y.Z) | Bug fixes, security patches — safe to update |
| **Medium** | Minor update (x.Y.0) | New features, backward compatible — review changelog |
| **High** | Major update (X.0.0) | Breaking changes — requires migration effort |

### Prioritize Updates

1. **Security patches** — update immediately regardless of version jump
2. **Major framework updates** — plan as a task (may require code changes)
3. **Minor updates** — batch and update periodically
4. **Patch updates** — update freely

## Step 5: Unused Dependencies

Identify dependencies that are installed but not imported anywhere in the code.

### Detection Method

For each dependency in the manifest:
1. Search the codebase for import/require statements referencing it
2. Check if it's a build tool, plugin, or CLI tool (used in config/scripts, not imported)
3. Check if it's a type-only dependency (TypeScript `@types/*` packages)
4. Check if it's a peer dependency required by another package

Use Grep to search for each dependency name across the source code.

**Common false positives (not unused):**
- Build tools: webpack, vite, esbuild, rollup, tsc
- Linters/formatters: eslint, prettier, ruff, black
- Test frameworks: jest, vitest, pytest (imported in test files)
- CLI tools: prisma, drizzle-kit, alembic
- Plugins: babel plugins, postcss plugins, eslint plugins
- Type packages: `@types/*` packages
- Config-referenced: packages used in config files (next.config.js, etc.)

## Step 6: License Compliance

### Scan Licenses

Read the license field from each dependency's manifest or LICENSE file.

### License Risk Classification

| Risk | Licenses | Implication |
|------|----------|-------------|
| **Permissive** | MIT, BSD-2, BSD-3, ISC, Apache-2.0 | Free to use commercially |
| **Weak copyleft** | LGPL-2.1, LGPL-3.0, MPL-2.0 | Must share modifications to the library itself |
| **Strong copyleft** | GPL-2.0, GPL-3.0, AGPL-3.0 | Must open-source your entire project |
| **Proprietary** | Commercial, custom | May require paid license |
| **Unknown** | No license specified | Legally risky — all rights reserved by default |

### Flag Concerning Licenses
- Any GPL/AGPL dependency in a proprietary project
- Any dependency with no license specified
- Any dependency with a license incompatible with the project's license

## Step 7: Dependency Quality Signals

For the top 15 most critical dependencies, assess health:

| Signal | What to check |
|--------|---------------|
| **Maintenance** | Last commit date, open issues count, release frequency |
| **Popularity** | Download count, GitHub stars (rough signal, not definitive) |
| **Bus factor** | Number of active maintainers (1 maintainer = risk) |
| **Alternatives** | Are there better-maintained alternatives? |

Flag dependencies that:
- Haven't been updated in >12 months
- Have >100 open issues with no recent activity
- Have a single maintainer
- Are deprecated or archived

## Step 8: Lock File Health

### Verify Lock File Exists
- If no lock file: **Critical finding** — builds are not reproducible
- If lock file exists but not committed: **Warning** — should be in version control

### Check for Integrity
```bash
# Node.js
npm ci --dry-run 2>/dev/null

# Python (poetry)
poetry check 2>/dev/null

# Rust
cargo verify-project 2>/dev/null
```

### Duplicate Dependencies
For Node.js projects, check for duplicate packages at different versions:
```bash
npm ls --all 2>/dev/null | grep "deduped" | head -20
```

## Step 9: Present Findings

### Critical (security risk or build instability)

| # | Category | Package | Finding | Action |
|---|----------|---------|---------|--------|
| 1 | Vulnerability | `pkg@1.0.0` | CVE description | Update to `1.0.1` |

### Warning (should address soon)

| # | Category | Package | Finding | Action |
|---|----------|---------|---------|--------|
| 1 | Outdated | `pkg@2.0.0` | Major version behind (`3.0.0` available) | Plan migration |

### Suggestion (maintenance improvement)

| # | Category | Package | Finding | Action |
|---|----------|---------|---------|--------|
| 1 | Unused | `pkg` | Not imported anywhere in src/ | Remove from manifest |

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

**Recommended actions (priority order):**
1. Most urgent action
2. Second priority
3. Third priority

## Step 11: Persist Report (Optional)

Ask: **"Save this dependency report to `docs/reviews/deps/YYYY-MM-DD-audit.md`?"**

If yes, save using the template from `docs/templates/review-report.md`.
