---
description: Initialize or rebuild the documentation system from codebase scan
disable-model-invocation: true
---

# Initialize Documentation

Bootstrap the entire `docs/` documentation system for a project, populated from codebase analysis.

Copy the steps below into your todo list before starting. A step you decide not to do stays on the list as "skip: <reason>".

**Use when:** Setting up docs for an existing (brownfield) project or rebuilding stale docs from scratch.

## Rules

- Every generated doc describes what the code actually does: no placeholder text, no aspirational conventions.
- **Every package, every language.** Detection follows the stack signals reference (Step 1). A repository with several packages gets the shared picture at the root and one section per package; with more than eight packages, ask which to cover first.
- `CLAUDE.md` Build Commands are filled in from detection, each with a comment naming its source. A command that could not be detected keeps the placeholder comment plus `# [NOT DETECTED] - fill in manually`.
- **Never read secrets.** Do not open `.env`, `.env.*` (except `.env.example`, `.env.sample`, `.env.template`, `.env.dist`), `*.pem`, `*.key`, `id_*`, `.npmrc`, `.pypirc`, `.netrc` or `.git-credentials`. Environment variable *names* come from a template file or from the places the code reads them; no value from the project ever goes into a doc. Skip lockfiles and generated or vendored directories, and list what was skipped in the Step 7 report.
- In every index file you create or keep, replace the `Last updated: YYYY-MM-DD` placeholder with today's date. Otherwise `/sk:docs-audit` reports the fresh scaffold as unfilled stubs.

## Exit Gate

Do not report completion until each line holds. For the minimal profile, the domain-home line covers only the homes you created.

- [ ] Every `docs/system/` doc names real files, dependencies or endpoints from this codebase, and a search of `docs/system/` for template placeholder text returns nothing
- [ ] Every dependency in `docs/system/tech-stack.md` appears in a dependency manifest
- [ ] No secret file was read, and no doc contains a value taken from an env or credential file
- [ ] Every path in `docs/conventions/file-structure.md` exists on disk
- [ ] In a chunked scan, every source file was read in full or is listed under *Not covered*
- [ ] Every top-level source folder (of every package) belongs to exactly one component in `docs/architecture/README.md`, or is listed under *Not covered* with a reason
- [ ] Each package found has its stack in `docs/system/tech-stack.md`, and the API and schema docs cover every ecosystem present, not only the first one found
- [ ] Each convention doc cites at least one existing file that shows the pattern
- [ ] `CLAUDE.md` Build Commands have a command or a `[NOT DETECTED]` marker on every line
- [ ] Every link in `docs/README.md` (agent index) resolves to an existing file
- [ ] `docs/START-HERE.md` (human router) exists with role lanes
- [ ] A search of the index files for `YYYY-MM-DD` returns nothing
- [ ] `docs/flows/` has one file per user-facing flow found in the code, and `docs/system/glossary.md` names the domain terms the code uses
- [ ] Domain homes exist, each with a stub index: features/, user-guides/, business/, legal/, operations/, _archive/
- [ ] `docs/templates/` contains every template listed in step 3d

## Step 1: Scan Project

If `docs/templates/` does not exist, create the scaffold first by running `node "${CLAUDE_PLUGIN_ROOT}/cli.mjs" init . --yes` from the project root; it only fills gaps and never replaces a file.

If `docs/system/project-context.md` exists, read it first. Stamp today's date into every index file you write in Step 3 (see Rules).

**Stack signals.** Read `docs/reference/stacks/signals.md` (the project's copy, which may carry its own rows; if it is missing, read `${CLAUDE_PLUGIN_ROOT}/docs/reference/stacks/signals.md`). It says where to look for each ecosystem.

**Packages.** Check the workspace signals first. Each package found is scanned on its own below; a repository without them is one package.

**Per package:**
- **Identity and dependencies:** find the ecosystem by its manifest and read the manifest.
- **Structure:** the entry points and source folders the signals name for that ecosystem, its tests by the test globs, and config (`*.config.*`, `.env.example`, `.env.sample`, `.env.template`, `docker*`). Never a real `.env` (see Rules). Skip the folders under *Always skip* and list them as skipped.
- **Routes and data:** Grep the ecosystem's route and data patterns in that package's source files.
- **Unknown ecosystem:** read the manifest and README, find the entry point by name, and note the gap in the Step 7 report.

### Large repositories: chunked scan

When the source is large (more than about 150 source files, or several packages with more than 50 each), do not read it all in this conversation: a long read skims, and what it skims never reaches the docs. Split it and read it with read-only subagents instead.

1. **List and size.** Per package, list the source files (`git ls-files`, filtered to the ecosystem's source extensions, minus *Always skip*) with their line counts.
2. **Chunk.** Group by package, then by top-level folder. A chunk holds at most about 25 files and 6,000 lines; a file over 2,000 lines is a chunk on its own (Read stops at 2,000 lines unless given a range).
3. **Dispatch in waves** of three or four built-in `Explore` subagents, following `${CLAUDE_PLUGIN_ROOT}/.claude/skills/stay-within-limits/SKILL.md`. Each prompt carries the chunk's file list, the ecosystem's signals, and these instructions: read every file in full (by range above 2,000 lines); never read secret files and report environment variable names only; cite `path:line` for every claim; return only this:

   ```
   | Component | Responsibility | Entry points | Depends on | Routes | Data models | Env var names | Evidence |
   Coverage:
   | File | Lines read | Lines total |
   ```
4. **Check coverage.** Compare lines read with each file's total. Send a file read short once more on its own; if it is still short, list it under *Not covered*.
5. **Merge** the tables into Step 3: components into the architecture doc (one component per folder, merged across chunks), routes into the API reference, models into the schema doc, variable names into integrations.

A repository below the threshold is read directly, as above.

### Build Commands Detection

Check every source that exists.

**A) `package.json` scripts.** Map script keys, using the exact script name found (`"dev": "next dev"` gives `npm run dev`):

| Script key | Maps to |
|-----------|---------|
| `dev`, `start:dev`, `serve` | `dev:` |
| `build`, `compile` | `build:` |
| `test`, `test:unit`, `test:run` | `test:` |
| `lint`, `lint:check` | `lint:` |
| `typecheck`, `type-check`, `tsc` | `typecheck:` |
| `format`, `format:check`, `prettier` | `format:` |
| `start` | `start:` |
| `db:migrate`, `migrate`, `prisma migrate` | `db:migrate:` |
| `db:seed`, `seed` | `db:seed:` |

**B) `Makefile`.** Extract targets with `grep -E "^[a-zA-Z_-]+:" Makefile` and map the common ones: `make build`, `make test`, `make dev`, `make lint`, `make run`, `make clean`.

**C) `pyproject.toml`.** Look for `[project.scripts]` or `[tool.poetry.scripts]` (entry points), `[tool.pytest]`, `[tool.ruff]` or `[tool.flake8]`, `[tool.mypy]`, `[tool.black]` or `[tool.ruff.format]`. Defaults when a tool is in deps or config: pytest gives `test: pytest`; ruff gives `lint: ruff check .`; flake8 gives `lint: flake8`; mypy gives `typecheck: mypy .`; black gives `format: black .`; uvicorn gives `dev: uvicorn main:app --reload`; django gives `dev: python manage.py runserver`; flask gives `dev: flask run --debug`.

**D) `requirements.txt`** (fallback when there is no `pyproject.toml`). Detect the same tools by package name (pytest, ruff, flake8, mypy, black, uvicorn, django, flask, gunicorn).

**E) `Cargo.toml`.** Defaults: `dev: cargo run`, `build: cargo build --release`, `test: cargo test`, `lint: cargo clippy -- -D warnings`, `format: cargo fmt --check`.

**F) `go.mod`.** Defaults: `dev: go run .`, `build: go build -o bin/ .`, `test: go test ./...`, `lint: golangci-lint run`.

**G) `docker-compose.yml` / `compose.yml`.** Add `docker: docker compose up`.

**H) CI workflows.** If `.github/workflows/` exists, read the workflow files and extract the `run:` commands; use them to verify or fill gaps in the commands above. If `Jenkinsfile`, `.gitlab-ci.yml`, or `.circleci/config.yml` exist, read those instead.

**Priority** when sources disagree on a command type:
1. Package manifest scripts (`package.json` scripts, `pyproject.toml` scripts)
2. Makefile targets
3. CI workflow commands
4. Stack defaults

## Step 2: Choose Profile & Create Directory Structure

Ask (use AskUserQuestion): **"Full doc system or minimal?"**
- **Full**: all doc homes (engineering + features/user-guides/business/legal/operations)
- **Minimal**: core only (`system`, `conventions`, `tasks`, `templates`, `sop`, `_archive`); the other homes are created on demand by their doc-creator commands

Create the directories (full profile shown; for minimal, create only the core set):
```bash
mkdir -p docs/architecture docs/conventions docs/sop docs/tasks/examples docs/flows docs/decisions docs/system docs/templates
mkdir -p docs/features docs/user-guides docs/business docs/legal docs/operations docs/_archive
```

For minimal, skip the domain-home generation steps below (the 3b flows/decisions homes still apply if the codebase scan produces content for them; the stub-index steps 16-21 apply only to homes you created).

## Step 3: Generate Documentation

Generate these files in order, from the Step 1 scan.

### 3a. System Docs (source of truth)

1. **`docs/system/tech-stack.md`**: from the dependency manifests; with several packages, a shared table plus one section per package
2. **`docs/system/database-schema.md`**: from schema/model files
3. **`docs/system/api-reference.md`**: from route files (if applicable)
4. **`docs/system/integrations.md`**: from external service imports and the environment variable *names* the code reads (never their values)
5. **`docs/system/project-context.md`**: dense project summary; put the detected build commands in its Build Commands section, per package when they differ

### 3b. Architecture Docs

6. **`docs/architecture/README.md`**: component diagram mapping source subdirectories to components, plus the data flow patterns and cross-cutting concerns found in code. Fill **Reading order** (the entry points, then 5 to 10 files in the order a newcomer should read them, following what each imports) and **Hubs** (the 3 to 5 modules most imported or referenced across the source, counted with Grep). Every statement cites a `path:line`, or is marked *(inferred)*; what the code does not settle goes under **Open questions**

### 3b². Flow inventory and glossary (the baseline a feature PRD compares against)

- **`docs/flows/`**: one short file per user-facing flow found in the code (routes, screens, handlers): persona, trigger, steps, end state as a Mermaid flowchart, and the edge cases the code already handles. No invented behaviour; a step the code does not handle is listed as `not handled`. Index them in `docs/flows/README.md`.
- **`docs/system/glossary.md`**: the domain terms as the code names them (models, tables, main types), one or two sentences each, with the synonyms found in the code under *Avoid* when two names exist for one thing. Project-specific terms only.

### 3c. Convention Docs (from observed patterns)

7. **`docs/conventions/code-style.md`**: actual naming patterns, import order, etc.
8. **`docs/conventions/file-structure.md`**: actual project layout
9. **`docs/conventions/git-workflow.md`**: from `.github/workflows` and branch patterns
10. **`docs/conventions/testing.md`**: patterns in the existing test files

### 3d. Templates

11. **`docs/templates/`**: copy all templates (epic, task-prd, sop, adr, flow, component, feature-doc, user-guide, postmortem, + business/GTM)

### 3e. Index Files

12. **`docs/sop/README.md`**: SOP index
13. **`docs/decisions/README.md`**: ADR index
14. **`docs/flows/README.md`**: flow diagram index with Mermaid cheat sheet
15. **`docs/tasks/README.md`**: task board
16. **`docs/features/README.md`**: feature docs index (stub)
17. **`docs/user-guides/README.md`**: user guides index (stub)
18. **`docs/business/README.md`**: business / GTM index (stub)
19. **`docs/legal/README.md`**: legal & compliance index (stub; populated by `/sk:legal-scan`)
20. **`docs/operations/README.md`**: operations index (runbooks, incidents, postmortems)
21. **`docs/_archive/README.md`**: archive index (stub)
22. **`docs/README.md`**: master index linking everything (the **agent** front door)
23. **`docs/START-HERE.md`**: role-based **human** front door (router into the tree). Keep the generic role lanes (engineer / feature / end-user / business / compliance); prune any the project doesn't need.

### 3f. CLAUDE.md

24. **`CLAUDE.md`**: agent instructions with the Build Commands filled in, project-specific constraints (from linter configs, tsconfig, etc.), and links to all doc sections.

Build Commands YAML block format, one detection-source comment per line:

```yaml
dev:       npm run dev          # detected from package.json scripts.dev
typecheck: npx tsc --noEmit     # detected from tsconfig.json presence
```

## Step 4: Generate Initial ADRs

Create ADRs in `docs/decisions/` for the 2-3 most significant technical choices found: framework/language, database, deployment platform, key libraries.

## Step 5: Create Starter SOPs

| Project Type | Starter SOPs |
|-------------|-------------|
| Frontend (React, Vue, etc.) | Adding a page route, Adding a component |
| API (FastAPI, Express, Django) | Adding an API endpoint, Database migration |
| Full-stack | All of the above |
| Any | Creating a task, Dependency updates |

## Step 6: Validate

Check every line of the Exit Gate above and fix whatever fails before reporting.

## Step 7: Report

```
[INIT COMPLETE]

Build commands detected:
  dev:       npm run dev          (from package.json)
  typecheck: npx tsc --noEmit     (from tsconfig.json)
  [NOT DETECTED] db:migrate      -- fill in manually if needed

Files created: {count}
  docs/system/          {list}
  docs/conventions/     {list}
  docs/architecture/    {list}
  docs/decisions/       {list}
  CLAUDE.md             (build commands filled in)

Scan: {direct | chunked: N chunks in M waves}; files read in full {n}/{total}; re-read {k}; not covered: {list or none}

Recommendations:
  - {missing tests, undocumented APIs, etc.}

Next step: Run /sk:new-task to create your first task
```

Ask (AskUserQuestion): **"Stand up your executive team?"** If yes, suggest the due-diligence order for brownfield: `/sk:cto` first ("here's what you actually own"), then `/sk:ceo` (goals retrofit + zombie sweep), then `/sk:cmo` (audit the existing public surface).

Then ask: **"Documentation initialized. Want me to create an initial task for any of the gaps I found?"**

**Reply:** the `[INIT COMPLETE]` report (detected and undetected build commands with sources, count and list of files created, recommendations), any Exit Gate line that still fails, then the executive-team question and the initial-task question.
