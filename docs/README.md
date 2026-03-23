# SK Documentation Index

> **Claude Code:** Always read this file first before planning any implementation.
> After completing any feature, update the relevant docs to reflect current state.

## Quick Navigation

| Section | Purpose | When to Read |
|---------|---------|--------------|
| [Tasks](./tasks/) | Task board, epics, PRDs & implementation plans | Before/during feature development |
| [Architecture](./architecture/) | System design, component relationships | Before designing new features |
| [Conventions](./conventions/) | Code standards, naming, patterns, file organization | Before writing any code |
| [SOP](./sop/) | Step-by-step procedures for common tasks | Before executing any recurring task |
| [Flows](./flows/) | Visual diagrams (Mermaid) for key processes | When understanding system behavior |
| [Decisions](./decisions/) | ADRs - why we made key technical choices | When questioning "why is it done this way?" |
| [System](./system/) | Current state: stack, schema, integrations, APIs | For reference during development |
| [Reports](./reports/) | Analysis reports and design docs | For deep-dive context |
| [Reviews](./reviews/) | Code, security, perf, UI review reports | After running review commands |
| [Research](./research/) | Brainstorm findings, debug investigations | After brainstorm or complex debug |
| [Templates](./templates/) | Starter templates for all doc types | When creating new documentation |

## Documentation Principles

1. **Docs are code** — They live in the repo, get reviewed in PRs, and stay in sync
2. **Write for the AI pair** — Be explicit about conventions; don't assume tribal knowledge
3. **Minimize, don't maximize** — Short, accurate docs beat long, stale ones
4. **Link, don't duplicate** — Reference other docs instead of copying content
5. **Date everything** — Every doc has a `last_updated` field

## How This System Works

```
docs/
|-- README.md                  <- You are here (master index)
|-- tasks/
|   |-- README.md              <- Task board (pipeline view)
|   |-- EPIC-N-name.md         <- Epic: large feature with multiple tasks
|   |-- TASK-N-EN-name.md      <- Task: self-contained deliverable
|   +-- examples/              <- Worked examples of completed tasks
|-- architecture/
|   +-- README.md              <- Architecture overview + component map
|-- conventions/
|   |-- README.md              <- Conventions index
|   |-- code-style.md          <- JS/ES modules, ANSI colors, ASCII output
|   |-- file-structure.md      <- pkg/ vs root, dual-edit rule
|   |-- git-workflow.md        <- Conventional commits, version releases
|   |-- testing.md             <- Manual CLI + command testing
|   +-- coding-behavior.md     <- Implementation thinking discipline
|-- sop/
|   |-- README.md              <- SOP index
|   |-- creating-a-task.md     <- How to create & manage tasks
|   +-- database-migration.md  <- DB migration procedure (template)
|-- flows/
|   +-- README.md              <- Flow diagrams index
|-- decisions/
|   +-- README.md              <- ADR index
|-- system/
|   |-- README.md              <- System state index
|   |-- project-context.md     <- Dense project summary (read first)
|   |-- tech-stack.md          <- Node.js, zero deps, npm
|   |-- database-schema.md     <- N/A (stateless CLI)
|   |-- api-reference.md       <- N/A (CLI interface)
|   |-- integrations.md        <- N/A (no external services)
|   +-- env-variables.md       <- N/A (zero config)
|-- reports/
|   |-- IMPLEMENTATION-PLAN.md
|   |-- deduplication-analysis.md
|   |-- docs-structure-assessment.md
|   |-- superpowers-workflow-analysis.md
|   |-- system-integration-guide.md
|   +-- unified-system-design.md
|-- reviews/
|   +-- README.md              <- Review report index
|-- research/
|   +-- README.md              <- Research index
+-- templates/
    |-- epic.md                <- Epic template
    |-- task-prd.md            <- Task template
    |-- sop-procedure.md       <- SOP template
    |-- adr-decision.md        <- ADR template
    |-- flow-diagram.md        <- Flow diagram template
    |-- component-doc.md       <- Component doc template
    |-- review-report.md       <- Review report template
    +-- research-doc.md        <- Research artifact template
```

## Maintenance Rules

### When to Update Docs

| Event | Action |
|-------|--------|
| **New work starting** | Follow [Creating a Task SOP](./sop/creating-a-task.md) |
| New command/skill/agent added | Update architecture, file-structure, and project-context |
| CLI logic changed | Update architecture and project-context |
| New pattern established | Add to `conventions/` |
| Tech decision made | Create ADR in `decisions/` |
| Version released | Update project-context current state |

### Doc Quality Checklist

- [ ] Has `last_updated` date
- [ ] Linked from parent README index
- [ ] No duplicated content (links instead)
- [ ] Reflects actual SK state (not generic templates)
