# SK Documentation Index

> **Claude Code:** Always read this file first before planning any implementation.
> After completing any feature, update the relevant docs to reflect current state.
> (Humans: [START-HERE.md](./START-HERE.md) is a role-based router into the tree.)
>
> This `docs/` tree mirrors the **structure** of the shipped template (`pkg/docs/`);
> the content here is SK's own filled-in dogfood. SK product-dev docs live in `dev-docs/`.

## Quick Navigation

| Section | Purpose | When to Read |
|---------|---------|--------------|
| [Tasks](./tasks/) | Task board, epics, PRDs & implementation plans | Before/during feature development |
| [Architecture](./architecture/) | System design, component relationships | Before designing new features |
| [Features](./features/) | Per-feature docs — what each does, how to extend | Building on or changing a feature |
| [Conventions](./conventions/) | Code standards, naming, patterns, file organization | Before writing any code |
| [SOP](./sop/) | Step-by-step procedures for common tasks | Before executing any recurring task |
| [Flows](./flows/) | Visual diagrams (Mermaid) for key processes | When understanding system behavior |
| [Decisions](./decisions/) | ADRs - why we made key technical choices | When questioning "why is it done this way?" |
| [System](./system/) | Current state: stack, schema, integrations, APIs | For reference during development |
| [Reference](./reference/) | Curated reference material (e.g. UI design) | When you need a stable lookup |
| [User Guides](./user-guides/) | Customer-facing, task-oriented help | Writing/maintaining end-user docs |
| [Business](./business/) | Positioning, competitors, pricing, business docs | GTM / business work |
| [Legal](./legal/) | Agreements, policies, compliance scans | Legal/compliance work (`/sk:legal-scan`) |
| [Operations](./operations/) | Runbooks, incidents, postmortems | Running prod, on-call, after an incident |
| [Reviews](./reviews/) | Code, security, perf, UI review reports | After running review commands |
| [Research](./research/) | Brainstorm findings, debug investigations | After brainstorm or complex debug |
| [Templates](./templates/) | Starter templates for all doc types | When creating new documentation |
| [Archive](./_archive/) | Retired docs kept for history | Looking up superseded docs |

## Documentation Principles

1. **Docs are code** — They live in the repo, get reviewed in PRs, and stay in sync
2. **Write for the AI pair** — Be explicit about conventions; don't assume tribal knowledge
3. **Minimize, don't maximize** — Short, accurate docs beat long, stale ones
4. **Link, don't duplicate** — Reference other docs instead of copying content
5. **Date everything** — Every doc has a `Last updated` field
6. **Track freshness** — Evergreen docs carry a `Lifecycle` field (`current`/`stale`/`deprecated`/`archived`); audit with `/sk:docs-audit` (see [conventions/doc-lifecycle.md](./conventions/doc-lifecycle.md))

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
|-- reference/
|   |-- README.md              <- Reference index
|   +-- ui-design/             <- UI design standards (used by /sk:ui-review)
|-- reviews/
|   +-- README.md              <- Review report index
|-- research/
|   +-- README.md              <- Research index
|-- user-guides/
|   +-- README.md              <- User guides index
|-- business/
|   +-- README.md              <- Business / GTM index
|-- legal/
|   +-- README.md              <- Legal & compliance index
|-- operations/
|   +-- README.md              <- Operations index
|-- _archive/
|   +-- README.md              <- Archive index
+-- templates/                 <- 19 doc templates — see templates/README.md for the full list
```

> SK product-development docs (plans, analyses, contributor guides) live in `dev-docs/`, not here.

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

- [ ] Has `Last updated` date
- [ ] Linked from parent README index
- [ ] No duplicated content (links instead)
- [ ] Reflects actual SK state (not generic templates)
