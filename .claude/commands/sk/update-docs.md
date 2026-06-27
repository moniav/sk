---
description: Deep scan codebase and sync documentation to reflect current state (project)
---

# Update Documentation

Scan the codebase and update `docs/` to accurately reflect the current system state.

## Step 1: Read Current Documentation

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. `docs/README.md` — Master index and structure
3. `docs/system/tech-stack.md` — Current recorded stack
4. `docs/system/database-schema.md` — Current recorded schema
5. `docs/architecture/README.md` — Current recorded architecture
6. `docs/conventions/` — All convention files
7. `docs/decisions/README.md` — Decision log
8. `docs/features/README.md` — Feature docs index (if it exists)
9. `docs/user-guides/README.md` — User guides index (if it exists)
10. `docs/business/README.md` — Business / GTM index (if it exists)
11. `docs/legal/README.md` — Legal & compliance index (if it exists)
12. `docs/operations/README.md` — Operations index (if it exists)
13. `docs/START-HERE.md` — Human front door (keep in sync with README.md)

**Skip files that are empty or contain only template placeholders.** Only update docs that have been populated — don't modify unfilled templates.

## Step 2: Ask Scope

Ask the user:
1. **Scope**: System docs | Architecture | Conventions | SOPs | Tasks | Features | User Guides | Business | Legal | Operations | All
2. **Focus**: What changed recently? New features? Refactors? Dependency updates?
3. **Depth**: Quick sync (just update what's stale) | Deep analysis (full audit) | Initialize (build from scratch)

> For a read-only coherence check (orphans, staleness, broken links) without rewriting
> content, use `/sk:docs-audit` instead.

## Step 3: Analyze Codebase

### 3a. Recent Changes

Use **Bash** for git commands only:
```bash
git log --oneline -20
git diff --stat HEAD~10
git status
```

### 3b. Project Structure Scan

Use **Glob** to map current structure:
- `src/**/*.ts`, `src/**/*.tsx`, `src/**/*.py` — source files
- `**/migrations/*`, `**/schema*` — schema/migration files
- `package.json`, `requirements.txt`, `pyproject.toml` — manifests

### 3c. Dependency Scan

Use **Read** to examine dependency manifests:
- Read `package.json` (dependencies and devDependencies)
- Read `requirements.txt` or `pyproject.toml` if Python

### 3d. API Scan

Use **Grep** to find route definitions:
- Pattern: `"route|router|app.get|app.post|@app|export.*GET|export.*POST"`
- Scope: `*.ts`, `*.tsx`, `*.py` files

### 3e. Schema Scan

Use **Grep** to find model/schema definitions:
- Pattern: `"createTable|model|class.*Model|class.*Schema|BaseModel"`
- Scope: `*.ts`, `*.py` files

## Step 4: Identify Gaps

Compare code vs. docs for each section:

### System Docs (`docs/system/`)

```markdown
#### project-context.md
- [ ] Project description still accurate
- [ ] Key features list reflects current state
- [ ] Stack summary matches tech-stack.md
- [ ] Current status / phase is up to date
- [ ] Known gotchas and constraints still relevant

#### tech-stack.md
- [ ] Dependencies match package.json / requirements.txt
- [ ] Versions are current
- [ ] New tools/libraries documented
- [ ] Removed dependencies cleaned up

#### database-schema.md
- [ ] Tables match actual schema files
- [ ] Relationships accurate
- [ ] Indexes documented
- [ ] Migration history current
- [ ] ER diagram matches reality

#### api-reference.md (if exists)
- [ ] All endpoints documented
- [ ] Request/response formats accurate
- [ ] New endpoints added
- [ ] Removed endpoints cleaned up
- [ ] Auth requirements noted

#### integrations.md (if exists)
- [ ] External services listed
- [ ] API keys / env vars documented
- [ ] Webhook endpoints listed
```

### Architecture Docs (`docs/architecture/`)

```markdown
- [ ] Component diagram reflects current system
- [ ] New components documented
- [ ] Removed components cleaned up
- [ ] Cross-cutting concerns current (auth, logging, errors)
```

### Convention Docs (`docs/conventions/`)

```markdown
- [ ] Code style matches actual codebase patterns
- [ ] File structure matches actual project layout
- [ ] New patterns adopted but not documented?
- [ ] Git workflow still accurate?
```

### Decision Records (`docs/decisions/`)

```markdown
- [ ] Recent tech decisions have ADRs
- [ ] Superseded decisions marked appropriately
- [ ] No undocumented significant decisions in git log
```

### Flow Diagrams (`docs/flows/`)

```markdown
- [ ] Diagrams match actual code flow
- [ ] New flows added for new features
- [ ] Removed features' flows cleaned up
```

### Feature Docs (`docs/features/`)

```markdown
- [ ] Each feature doc still matches the code it describes
- [ ] New significant features have a doc (create with /sk:new-feature-doc)
- [ ] Status field accurate (shipped vs in-progress)
- [ ] features/README.md index lists every feature doc
```

### User Guides (`docs/user-guides/`)

```markdown
- [ ] Each guide's steps still match current product behavior
- [ ] No guide documents a removed/changed feature
- [ ] New user-facing features have a guide (create with /sk:new-user-guide)
- [ ] user-guides/README.md index is complete
```

### Business / GTM Docs (`docs/business/`)

```markdown
- [ ] Positioning still reflects the product and market
- [ ] Competitor profiles current (intel rots fast — flag stale > 1 quarter)
- [ ] Pricing strategy matches what's actually charged
- [ ] Investor updates / memos dated and filed
- [ ] business/README.md index complete
```

### Operations Docs (`docs/operations/`)

```markdown
- [ ] Runbooks match current deploy/rollback/recovery reality
- [ ] Postmortems filed for recent incidents, action items tracked
- [ ] No runbook references a removed system or stale command
- [ ] operations/README.md index complete
```

### Lifecycle pass (all evergreen docs)

For every evergreen doc touched, refresh `Last updated` and confirm its `Lifecycle`
(`current` / `stale` / `deprecated` / `archived`) per `docs/conventions/doc-lifecycle.md`:

```markdown
- [ ] Last updated bumped on docs that changed
- [ ] Docs whose code changed but content didn't downgraded to `Lifecycle: stale`
- [ ] Retired docs moved to docs/_archive/ and set to `Lifecycle: archived`
- [ ] Both front doors (README.md + START-HERE.md) reflect the current section set
```

## Step 5: Prioritize Updates

Categorize gaps:

| Priority | Criteria | Examples |
|----------|---------|---------|
| **P0** | Docs are wrong (will mislead) | Schema doc shows deleted table |
| **P1** | Docs are incomplete (key info missing) | New API endpoint not documented |
| **P2** | Docs are stale (minor inaccuracies) | Version number outdated |
| **P3** | Docs could be better (nice to have) | Could add more examples |

## Step 6: Apply Updates

For each gap, starting with P0:

1. **Read the current doc** — Understand what exists
2. **Read the source of truth** — The actual code
3. **Update the doc** — Match reality
4. **Update `last_updated`** — Set today's date
5. **Verify cross-references** — Links to/from this doc still valid

### Per-Section Update Patterns

**project-context.md**: Review git log + current features > update summary, status, and key details
**tech-stack.md**: Compare `package.json`/`requirements.txt` > update table rows
**database-schema.md**: Read schema files > update table definitions + ER diagram
**api-reference.md**: Scan route files > update endpoint list
**architecture/README.md**: Scan component structure > update diagram
**conventions/file-structure.md**: Run `tree` or `find` > update structure diagram

## Step 7: Generate Report

Create a summary (show to user, don't save unless asked):

```markdown
## Documentation Update Report — YYYY-MM-DD

### Summary
- Files scanned: N
- Docs updated: N
- New docs created: N
- Gaps remaining: N

### Changes Made
| Doc | Change | Priority |
|-----|--------|----------|
| system/tech-stack.md | Added lodash v4.17, updated React to 19 | P1 |
| system/database-schema.md | Added `preferences` column to users table | P0 |
| architecture/README.md | Updated component diagram with new NotificationService | P1 |

### Remaining Gaps
| Gap | Priority | Recommendation |
|-----|----------|----------------|
| No ADR for Redis adoption | P2 | Create ADR-005 |
| Missing flow diagram for payment process | P2 | Create docs/flows/payment-flow.md |

### New ADRs Needed
- ADR-NNN: [Decision that needs recording]
```

## Step 8: Update Master Index

If any new docs were created:
1. Add them to the appropriate section README
2. Verify `docs/README.md` structure tree is still accurate

## Validation Checklist

- [ ] All P0 gaps fixed (no misleading docs remain)
- [ ] All P1 gaps fixed (key info complete)
- [ ] `last_updated` dates refreshed on changed docs
- [ ] Cross-references verified
- [ ] Section READMEs updated with new entries
- [ ] Report presented to user
