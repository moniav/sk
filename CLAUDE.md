# CLAUDE.md — Agent Instructions

> This file is read automatically by Claude Code at the start of every session.

## Development Lifecycle: Plan → Dev → Test

**Every piece of work follows this cycle. No exceptions.**

Read the full lifecycle guide: `docs/lifecycle/README.md`

### Starting New Work

1. **Decide scope:** Epic (L/XL complexity) → Task (M complexity) → Just do it (XS/S complexity)
2. **Follow the SOP:** `docs/sop/creating-a-task.md`
3. **Use templates:**
   - Epic: `cp docs/templates/epic.md docs/tasks/EPIC-{N}-p-{name}.md`
   - Task: `cp docs/templates/task-prd.md docs/tasks/TASK-{N}-{E{epicN}|S}-p-{name}.md`
   - Phase shortcuts in filename: `p` = plan, `d` = dev, `t` = test, `x` = done
   - Counter: scan existing files, use next number
4. **See worked example:** `docs/tasks/examples/TASK-user-registration-api.md`

### 🎯 PLAN Phase (do this BEFORE writing code)

1. Write the problem statement and acceptance criteria
2. Break into subtasks (each S complexity — single concern, self-contained)
3. Resolve all open questions
4. Identify affected files and docs

**Exit gate:** All questions resolved, subtasks defined, acceptance criteria testable.

### 🔨 DEV Phase

1. Execute subtasks top-to-bottom, checking them off
2. Follow conventions in `docs/conventions/`
3. Update docs in the same commit as code changes

**Exit gate:** All subtasks done, code self-reviewed, docs updated.

### 🧪 TEST Phase

1. Write tests per `docs/conventions/testing.md`
2. Verify each acceptance criterion one-by-one
3. Test error paths and edge cases
4. Confirm no regressions

**Exit gate:** All criteria verified, all tests pass.

## Documentation System

This project uses a structured documentation system. **Always consult docs before coding.**

### Before ANY Implementation

1. Read `docs/README.md` for full documentation map
2. Read `docs/lifecycle/README.md` for the Plan → Dev → Test workflow
3. Read `docs/conventions/` for code style, file structure, and patterns
4. Read relevant `docs/sop/` for step-by-step procedures
5. Read relevant `docs/architecture/` for system design context
6. Check `docs/decisions/` if you're unsure WHY something is done a certain way

### During Implementation

- Follow conventions in `docs/conventions/code-style.md` exactly
- Follow file placement rules in `docs/conventions/file-structure.md`
- Use the testing patterns from `docs/conventions/testing.md`
- Reference `docs/system/` for current schema, APIs, and integrations

### After Implementation

Update these docs to reflect what changed:

- [ ] `docs/system/database-schema.md` — if schema changed
- [ ] `docs/system/api-reference.md` — if APIs changed
- [ ] `docs/system/tech-stack.md` — if dependencies changed
- [ ] `docs/architecture/` — if component relationships changed
- [ ] `docs/flows/` — if process flows changed
- [ ] `docs/tasks/` — mark task as complete, update status
- [ ] `docs/decisions/` — if a significant technical decision was made

### Creating New Docs

Always use templates from `docs/templates/`:
- New epic (L/XL complexity) → `docs/templates/epic.md`
- New task (M complexity) → `docs/templates/task-prd.md`
- New procedure → `docs/templates/sop-procedure.md`
- New decision → `docs/templates/adr-decision.md`
- New flow diagram → `docs/templates/flow-diagram.md`
- New component doc → `docs/templates/component-doc.md`

## Project Commands

### Slash Commands (Claude Code — `sk` namespace)

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/sk:implement` | Full lifecycle: Plan → Dev → Test | Build a feature end-to-end |
| `/sk:new-task` | Create a new task file | Starting planned work (M complexity) |
| `/sk:new-epic` | Create a new epic file | Starting large feature (L/XL complexity) |
| `/sk:plan` | Complete PLAN phase | Break down and prepare a task |
| `/sk:dev` | Execute DEV phase | Implement subtasks for a task |
| `/sk:test` | Execute TEST phase | Verify acceptance criteria |
| `/sk:task-status` | Show task board overview | Check progress across all tasks |
| `/sk:update-docs` | Sync docs with codebase | After changes, or periodic audit |
| `/sk:update` | Update SK commands & templates | Get latest version of shipkit-cld |
| `/sk:init-docs` | Bootstrap docs from scratch | New project or full rebuild |
| `/sk:new-sop` | Create a new SOP | Document a recurring procedure |
| `/sk:new-adr` | Create an ADR | Record a significant tech decision |
| `/sk:new-flow` | Create a flow diagram | Visualize a system process |

### Build Commands

<!-- Replace with your project's actual commands -->

```bash
# Development
# npm run dev / python manage.py runserver / uvicorn main:app --reload

# Build
# npm run build / python -m build / make build

# Lint & Format
# npm run lint / ruff check . / flake8

# Testing
# npm test / pytest / python -m unittest

# Database
# npm run db:migrate / alembic upgrade head / python manage.py migrate
```

## Key Constraints

<!-- Add project-specific constraints Claude should always respect -->

- Never commit `.env` files or secrets
- All API inputs must be validated (e.g., Zod, Pydantic, Marshmallow)
- All DB queries go through the ORM (no raw SQL in application code)
- All user-facing text must support i18n
- PRs must include test coverage for new logic
