---
description: Initialize or rebuild the documentation system from codebase scan (project)
---

# Initialize Documentation

Bootstrap the entire `docs/` documentation system for a project, populated from codebase analysis.

**Use when:** Setting up docs for a new project or rebuilding stale docs from scratch.

## Step 1: Scan Project

### Project Identity

Use **Glob** to detect project type:
- `package.json`, `pyproject.toml`, `requirements.txt`, `Cargo.toml`, `go.mod`, `pom.xml`

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

### Key Patterns

Use **Grep** to find key patterns:
- Route/endpoint definitions: `"router|app.get|app.post|export.*GET|export.*POST|@app\.|@router\."` in `*.ts`, `*.tsx`, `*.py`
- Models/schema: `"createTable|model|Schema|BaseModel"` in `*.ts`, `*.py`

Use **Glob** to find test and config files:
- Test files: `**/*.test.*`, `**/*.spec.*`, `**/test_*`
- Config files: `*.config.*`, `.env*`, `tsconfig*`, `docker*`

## Step 2: Create Directory Structure

Use **Bash** to create directories:
```bash
mkdir -p docs/architecture docs/conventions docs/sop docs/tasks/examples docs/flows docs/decisions docs/system docs/templates
mkdir -p .claude/commands/sk
```

## Step 3: Generate Documentation

Based on the codebase scan, generate these files in order:

### 3a. System Docs (source of truth)

1. **`docs/system/tech-stack.md`** — From package.json/requirements.txt analysis
2. **`docs/system/database-schema.md`** — From schema/model file analysis
3. **`docs/system/api-reference.md`** — From route file analysis (if applicable)
4. **`docs/system/integrations.md`** — From env vars and external service imports

### 3b. Architecture Docs

5. **`docs/architecture/README.md`** — Component diagram from directory structure analysis
   - Map src/ subdirectories to components
   - Identify data flow patterns
   - Document cross-cutting concerns found in code

### 3c. Convention Docs (from observed patterns)

6. **`docs/conventions/code-style.md`** — Analyze actual naming patterns, import order, etc.
7. **`docs/conventions/file-structure.md`** — Document actual project layout
8. **`docs/conventions/git-workflow.md`** — Check for .github/workflows, branch patterns
9. **`docs/conventions/testing.md`** — Analyze existing test files for patterns

### 3d. Templates

10. **`docs/templates/`** — Copy all templates (epic, task-prd, sop, adr, flow, component)

### 3e. Index Files

12. **`docs/sop/README.md`** — SOP index
13. **`docs/decisions/README.md`** — ADR index
14. **`docs/flows/README.md`** — Flow diagram index with Mermaid cheat sheet
15. **`docs/tasks/README.md`** — Task board
16. **`docs/README.md`** — Master index linking everything

### 3f. CLAUDE.md

17. **`CLAUDE.md`** — Agent instructions with:
    - Project-specific commands (from package.json scripts, Makefile, etc.)
    - Project-specific constraints (discovered from linter configs, tsconfig, etc.)
    - Links to all doc sections

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
- [ ] CLAUDE.md has real project commands
- [ ] README.md links all sections correctly
- [ ] Templates are all present in docs/templates/
```

## Step 7: Report

Present to user:
- Files created (count and list)
- Key findings from codebase scan
- Recommendations (missing tests, undocumented APIs, etc.)
- Suggested first tasks to create

Ask: **"Documentation initialized. Want me to create an initial task for any of the gaps I found?"**
