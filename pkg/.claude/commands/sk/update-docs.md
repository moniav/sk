---
description: Deep scan codebase and sync documentation to reflect current state
argument-hint: "[scope: system | architecture | conventions | sops | tasks | features | all (optional)]"
disable-model-invocation: true
---

# Update Documentation

Scan the codebase and update `docs/` to accurately reflect the current system state.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

Copy the steps below into your todo list before starting. A step you decide not to do stays on the list as "skip: <reason>".

## Rules

- Only update docs that have been populated. Skip files that are empty or contain only template placeholders, and do not modify unfilled templates.
- The code is the source of truth: read the code before changing the doc that describes it.
- Fix gaps in priority order, P0 first.
- Show the report to the user; do not save it unless asked.
- If the user only wants a read-only coherence check (orphans, staleness, broken links) without rewriting content, suggest `/sk:docs-audit` instead.

## Exit Gate

Do not report completion until each line holds:

- [ ] Remaining Gaps in the report lists no P0 or P1 item
- [ ] Every doc changed in this run carries today's date in its last-updated field
- [ ] Every link to or from a changed doc resolves to an existing file
- [ ] Every doc created in this run is listed in its section README
- [ ] The report has been shown to the user

## Step 1: Read Current Documentation

1. `docs/system/project-context.md` (if it exists)
2. `docs/README.md`: master index and structure
3. `docs/system/tech-stack.md`
4. `docs/system/database-schema.md`
5. `docs/architecture/README.md`
6. `docs/conventions/`: all convention files
7. `docs/decisions/README.md`
8. `docs/features/README.md` (if it exists)
9. `docs/user-guides/README.md` (if it exists)
10. `docs/business/README.md` (if it exists)
11. `docs/legal/README.md` (if it exists)
12. `docs/operations/README.md` (if it exists)
13. `docs/START-HERE.md`: human front door (keep in sync with README.md)

## Step 2: Ask Scope

Ask the user (use AskUserQuestion, one question per dimension):
1. **Scope**: System docs | Architecture | Conventions | SOPs | Tasks | Features | User Guides | Business | Legal | Operations | All
2. **Focus**: What changed recently? New features? Refactors? Dependency updates?
3. **Depth**: Quick sync (just update what's stale) | Deep analysis (full audit) | Initialize (build from scratch)

## Step 3: Analyze Codebase

**3a. Recent changes.** Use Bash for git commands only:
```bash
git log --oneline -20
git diff --stat HEAD~10
git status
```

**3b. Structure.** Glob `src/**/*.ts`, `src/**/*.tsx`, `src/**/*.py` (source), `**/migrations/*`, `**/schema*` (schema/migrations), and `package.json`, `requirements.txt`, `pyproject.toml` (manifests).

**3c. Dependencies.** Read the manifests: `package.json` (dependencies and devDependencies), `requirements.txt` or `pyproject.toml`.

**3d. API.** Grep `"route|router|app.get|app.post|@app|export.*GET|export.*POST"` in `*.ts`, `*.tsx`, `*.py`.

**3e. Schema.** Grep `"createTable|model|class.*Model|class.*Schema|BaseModel"` in `*.ts`, `*.py`.

## Step 4: Identify Gaps

For each section in scope, compare code against docs. Every check that fails is a gap.

### System Docs (`docs/system/`)

- **project-context.md**: description accurate; key features list current; stack summary matches tech-stack.md; current status / phase up to date; gotchas and constraints still relevant
- **tech-stack.md**: dependencies match `package.json` / `requirements.txt`; versions current; new tools/libraries documented; removed dependencies cleaned up
- **database-schema.md**: tables match the schema files; relationships accurate; indexes documented; migration history current; ER diagram matches
- **api-reference.md** (if exists): all endpoints documented; request/response formats accurate; new endpoints added; removed endpoints cleaned up; auth requirements noted
- **integrations.md** (if exists): external services listed; API keys / env vars documented; webhook endpoints listed

### Other Sections

| Section | Checks |
|---------|--------|
| Architecture (`docs/architecture/`) | Component diagram reflects the current system; new components documented; removed components cleaned up; cross-cutting concerns current (auth, logging, errors) |
| Conventions (`docs/conventions/`) | Code style matches actual codebase patterns; file structure matches actual layout; newly adopted patterns documented; git workflow still accurate |
| Decisions (`docs/decisions/`) | Recent tech decisions have ADRs; superseded decisions marked; no undocumented significant decision in git log |
| Flows (`docs/flows/`) | Diagrams match actual code flow; new features have flows; removed features' flows cleaned up |
| Features (`docs/features/`) | Each feature doc matches the code it describes; new significant features have a doc (suggest `/sk:new-feature-doc` to the user); Status field accurate (shipped vs in-progress); `features/README.md` lists every feature doc |
| User Guides (`docs/user-guides/`) | Each guide's steps match current product behavior; no guide documents a removed/changed feature; new user-facing features have a guide (suggest `/sk:new-user-guide` to the user); `user-guides/README.md` complete |
| Business / GTM (`docs/business/`) | Positioning reflects the product and market; competitor profiles current (flag stale > 1 quarter); pricing strategy matches what is actually charged; investor updates / memos dated and filed; `business/README.md` complete |
| Operations (`docs/operations/`) | Runbooks match current deploy/rollback/recovery reality; postmortems filed for recent incidents with action items tracked; no runbook references a removed system or stale command; `operations/README.md` complete |

### Lifecycle Pass (all evergreen docs)

For every evergreen doc touched, refresh `Last updated` and confirm its `Lifecycle` (`current` / `stale` / `deprecated` / `archived`) per `docs/conventions/doc-lifecycle.md`.

**Doc-to-code linkage:** docs with a `Source:` / `Code:` / `Location:` field whose paths changed since their `Last updated` are the priority queue: update those first. When touching a doc that lacks the field but clearly describes specific code, add `**Source:** <paths>` so future audits can detect drift automatically.

- [ ] `Last updated` bumped on docs that changed
- [ ] Docs whose code changed but content didn't downgraded to `Lifecycle: stale`
- [ ] Retired docs moved to `docs/_archive/` and set to `Lifecycle: archived`
- [ ] Both front doors (README.md + START-HERE.md) reflect the current section set

## Step 5: Prioritize Updates

| Priority | Criteria | Examples |
|----------|---------|---------|
| **P0** | Docs are wrong (will mislead) | Schema doc shows deleted table |
| **P1** | Docs are incomplete (key info missing) | New API endpoint not documented |
| **P2** | Docs are stale (minor inaccuracies) | Version number outdated |
| **P3** | Docs could be better (nice to have) | Could add more examples |

## Step 6: Apply Updates

For each gap, starting with P0:

1. Read the current doc.
2. Read the source of truth: the actual code.
3. Update the doc to match the code.
4. Set `last_updated` to today's date.
5. Open every link to and from this doc and fix any that no longer resolves.

Per-section sources:

- **project-context.md**: git log + current features > summary, status, key details
- **tech-stack.md**: `package.json`/`requirements.txt` > table rows
- **database-schema.md**: schema files > table definitions + ER diagram
- **api-reference.md**: route files > endpoint list
- **architecture/README.md**: component structure > diagram
- **conventions/file-structure.md**: `tree` or `find` output > structure diagram

## Step 7: Update Master Index

If any new docs were created:
1. Add them to the appropriate section README.
2. Compare the `docs/README.md` structure tree with the directories on disk and fix any difference.

## Step 8: Generate Report

```markdown
## Documentation Update Report: YYYY-MM-DD

### Summary
- Files scanned: N
- Docs updated: N
- New docs created: N
- Gaps remaining: N

### Changes Made
| Doc | Change | Priority |
|-----|--------|----------|
| system/database-schema.md | Added `preferences` column to users table | P0 |

### Remaining Gaps
| Gap | Priority | Recommendation |
|-----|----------|----------------|
| No ADR for Redis adoption | P2 | Create ADR-005 |

### New ADRs Needed
- ADR-NNN: [Decision that needs recording]
```

Then check every line of the Exit Gate above and fix whatever fails.

**Reply:** the Documentation Update Report (summary counts, Changes Made table, Remaining Gaps table, New ADRs Needed), plus any Exit Gate line that still fails and why.
