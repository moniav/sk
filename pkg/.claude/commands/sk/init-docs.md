---
description: Initialize or rebuild the documentation system from codebase scan (project)
---

# Initialize Documentation

Bootstrap the entire `docs/` documentation system for a project, populated from codebase analysis.

**Use when:** Setting up docs for an existing (brownfield) project or rebuilding stale docs from scratch.

## Step 1: Scan Project

### Read Project Context First

If `docs/system/project-context.md` exists, read it first for existing context.

### Project Identity

Use **Glob** to detect project type:
- `package.json`, `pyproject.toml`, `requirements.txt`, `Cargo.toml`, `go.mod`, `pom.xml`, `Gemfile`, `build.gradle`, `pom.xml`

Use **Read** to examine the manifest file (e.g., `package.json` first 20 lines).

### Project Structure

Use **Glob** with `**/` patterns to map the directory tree:
- `src/**/*` — application source
- `tests/**/*` or `**/*.test.*` — test files
- `*.config.*` — config files at root

### Dependencies

Use **Read** to examine the dependency manifest:
- Node: Read `package.json` (dependencies and devDependencies sections)
- Python: Read `requirements.txt` or `pyproject.toml`
- Rust: Read `Cargo.toml`
- Go: Read `go.mod`

### Key Patterns

Use **Grep** to find key patterns:
- Route/endpoint definitions: `"router|app.get|app.post|export.*GET|export.*POST|@app\.|@router\."` in `*.ts`, `*.tsx`, `*.py`
- Models/schema: `"createTable|model|Schema|BaseModel"` in `*.ts`, `*.py`

Use **Glob** to find test and config files:
- Test files: `**/*.test.*`, `**/*.spec.*`, `**/test_*`
- Config files: `*.config.*`, `.env*`, `tsconfig*`, `docker*`

### Build Commands Detection

Detect build commands from every available source. Check all that exist:

**A) package.json scripts (Node/JS/TS projects)**

Read `package.json` and extract the `"scripts"` object. Map scripts to build commands:

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

Use the exact script name as found. Example: if `package.json` has `"dev": "next dev"`, the build command is `npm run dev`.

**B) Makefile (any project)**

If `Makefile` exists, read it and extract target names:

```
grep -E "^[a-zA-Z_-]+:" Makefile
```

Map common targets: `make build`, `make test`, `make dev`, `make lint`, `make run`, `make clean`.

**C) pyproject.toml (Python projects)**

Read `pyproject.toml` and look for:
- `[project.scripts]` or `[tool.poetry.scripts]` — entry points
- `[tool.pytest]` — test runner config (command: `pytest`)
- `[tool.ruff]` or `[tool.flake8]` — linter (command: `ruff check .` or `flake8`)
- `[tool.mypy]` — type checker (command: `mypy .`)
- `[tool.black]` or `[tool.ruff.format]` — formatter

Default Python commands if tools are detected:
| Tool found | Command |
|-----------|---------|
| pytest in deps or config | `test: pytest` |
| ruff in deps | `lint: ruff check .` |
| flake8 in deps | `lint: flake8` |
| mypy in deps | `typecheck: mypy .` |
| black in deps | `format: black .` |
| uvicorn in deps | `dev: uvicorn main:app --reload` |
| django in deps | `dev: python manage.py runserver` |
| flask in deps | `dev: flask run --debug` |

**D) requirements.txt (Python projects, fallback)**

If no `pyproject.toml`, read `requirements.txt` and detect tools by package name (pytest, ruff, flake8, mypy, black, uvicorn, django, flask, gunicorn).

**E) Cargo.toml (Rust projects)**

Default Rust commands:
```yaml
dev:       cargo run
build:     cargo build --release
test:      cargo test
lint:      cargo clippy -- -D warnings
format:    cargo fmt --check
```

**F) go.mod (Go projects)**

Default Go commands:
```yaml
dev:       go run .
build:     go build -o bin/ .
test:      go test ./...
lint:      golangci-lint run
```

**G) docker-compose.yml / compose.yml**

If found, add:
```yaml
docker:    docker compose up
```

**H) CI Workflows (verification source)**

If `.github/workflows/` exists, read the workflow files. Extract `run:` commands from steps — these reveal the actual build, test, and lint commands used in CI. Use these to verify or fill gaps in the commands detected above.

If `Jenkinsfile`, `.gitlab-ci.yml`, or `.circleci/config.yml` exist, read those instead.

### Build Command Priority

When multiple sources provide the same command type, prefer in this order:
1. Package manifest scripts (`package.json` scripts, `pyproject.toml` scripts)
2. Makefile targets
3. CI workflow commands
4. Stack defaults

## Step 2: Create Directory Structure

Use **Bash** to create directories:
```bash
mkdir -p docs/architecture docs/conventions docs/sop docs/tasks/examples docs/flows docs/decisions docs/system docs/templates
mkdir -p docs/features docs/user-guides docs/business docs/legal docs/operations docs/_archive
mkdir -p .claude/commands/sk
```

## Step 3: Generate Documentation

Based on the codebase scan, generate these files in order:

### 3a. System Docs (source of truth)

1. **`docs/system/tech-stack.md`** — From package.json/requirements.txt analysis
2. **`docs/system/database-schema.md`** — From schema/model file analysis
3. **`docs/system/api-reference.md`** — From route file analysis (if applicable)
4. **`docs/system/integrations.md`** — From env vars and external service imports
5. **`docs/system/project-context.md`** — Dense project summary from scan results (include detected build commands in the Build Commands section)

### 3b. Architecture Docs

6. **`docs/architecture/README.md`** — Component diagram from directory structure analysis
   - Map src/ subdirectories to components
   - Identify data flow patterns
   - Document cross-cutting concerns found in code

### 3c. Convention Docs (from observed patterns)

7. **`docs/conventions/code-style.md`** — Analyze actual naming patterns, import order, etc.
8. **`docs/conventions/file-structure.md`** — Document actual project layout
9. **`docs/conventions/git-workflow.md`** — Check for .github/workflows, branch patterns
10. **`docs/conventions/testing.md`** — Analyze existing test files for patterns

### 3d. Templates

11. **`docs/templates/`** — Copy all templates (epic, task-prd, sop, adr, flow, component, feature-doc, user-guide, postmortem, + business/GTM)

### 3e. Index Files

12. **`docs/sop/README.md`** — SOP index
13. **`docs/decisions/README.md`** — ADR index
14. **`docs/flows/README.md`** — Flow diagram index with Mermaid cheat sheet
15. **`docs/tasks/README.md`** — Task board
16. **`docs/features/README.md`** — Feature docs index (stub)
17. **`docs/user-guides/README.md`** — User guides index (stub)
18. **`docs/business/README.md`** — Business / GTM index (stub)
19. **`docs/legal/README.md`** — Legal & compliance index (stub; populated by `/sk:legal-scan`)
20. **`docs/operations/README.md`** — Operations index (runbooks, incidents, postmortems)
21. **`docs/_archive/README.md`** — Archive index (stub)
20. **`docs/README.md`** — Master index linking everything (the **agent** front door)
21. **`docs/START-HERE.md`** — Role-based **human** front door (router into the tree). Keep the generic role lanes (engineer / feature / end-user / business / compliance); prune any the project doesn't need.

### 3f. CLAUDE.md

17. **`CLAUDE.md`** — Agent instructions with:
    - **Build Commands filled in** from Step 1 detection (not placeholders)
    - Project-specific constraints (discovered from linter configs, tsconfig, etc.)
    - Links to all doc sections

Write the detected build commands into the Build Commands YAML block:

```yaml
dev:       npm run dev          # detected from package.json scripts.dev
build:     npm run build        # detected from package.json scripts.build
test:      npm test             # detected from package.json scripts.test
lint:      npm run lint         # detected from package.json scripts.lint
typecheck: npx tsc --noEmit    # detected from tsconfig.json presence
```

Add a comment showing the detection source for each command. If a command could not be detected, leave the placeholder comment and add `# [NOT DETECTED] — fill in manually` so the user knows what's missing.

## Step 4: Generate Initial ADRs

Scan for significant technical choices and create ADRs:

```bash
# What framework/language was chosen?
# What database is used?
# What deployment platform?
# What key libraries were adopted?
```

Create ADRs for the 2-3 most significant choices found.

## Step 5: Create Starter SOPs

Based on the project type, create relevant SOPs:

| Project Type | Starter SOPs |
|-------------|-------------|
| Frontend (React, Vue, etc.) | Adding a page route, Adding a component |
| API (FastAPI, Express, Django) | Adding an API endpoint, Database migration |
| Full-stack | All of the above |
| Any | Creating a task, Dependency updates |

## Step 6: Validate

```markdown
- [ ] All system docs reference actual code (not placeholder text)
- [ ] Tech stack matches real dependencies
- [ ] File structure matches actual project layout
- [ ] Convention docs describe actual patterns (not aspirational)
- [ ] CLAUDE.md Build Commands are filled in (not placeholder comments)
- [ ] README.md (agent index) links all sections correctly
- [ ] START-HERE.md (human router) present with role lanes
- [ ] Domain homes present: features/, user-guides/, business/, legal/, operations/, _archive/ (each with a stub index)
- [ ] Templates are all present in docs/templates/
```

## Step 7: Report

Present to user:

```
[INIT COMPLETE]

Build commands detected:
  dev:       npm run dev          (from package.json)
  build:     npm run build        (from package.json)
  test:      npm test             (from package.json)
  lint:      npm run lint         (from package.json)
  typecheck: npx tsc --noEmit    (from tsconfig.json)
  [NOT DETECTED] db:migrate      -- fill in manually if needed

Files created: {count}
  docs/system/          {list}
  docs/conventions/     {list}
  docs/architecture/    {list}
  docs/decisions/       {list}
  CLAUDE.md             (build commands filled in)

Recommendations:
  - {missing tests, undocumented APIs, etc.}

Next step: Run /sk:new-task to create your first task
```

Ask: **"Documentation initialized. Want me to create an initial task for any of the gaps I found?"**
