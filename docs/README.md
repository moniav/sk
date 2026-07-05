# Project Documentation Index

> **Claude Code:** Always read this file first before planning any implementation.
> After completing any feature, update the relevant docs to reflect current state.
> (Humans: [START-HERE.md](./START-HERE.md) is a role-based router into the tree.)

## Quick Navigation

| Section | Purpose | When to Read |
|---------|---------|--------------|
| [Tasks](./tasks/) | Task board, epics, PRDs & implementation plans | Before/during feature development |
| [Architecture](./architecture/) | System design, component relationships, data flow | Before designing new features |
| [Features](./features/) | Per-feature docs — what each does, how to extend | Building on or changing a feature |
| [Conventions](./conventions/) | Code standards, naming, patterns, file organization | Before writing any code |
| [SOP](./sop/) | Step-by-step procedures for common tasks | Before executing any recurring task |
| [Flows](./flows/) | Visual diagrams (Mermaid) for key processes | When understanding system behavior |
| [Decisions](./decisions/) | ADRs - why we made key technical choices | When questioning "why is it done this way?" |
| [System](./system/) | Current state: stack, schema, integrations, APIs | For reference during development |
| [Reference](./reference/) | Curated reference material (e.g. UI design standards) | Stable lookups; used by `/sk:ui-review` |
| [User Guides](./user-guides/) | Customer-facing, task-oriented help | Writing/maintaining end-user docs |
| [Business](./business/) | Positioning, competitors, pricing, business docs | GTM / business work |
| [Legal](./legal/) | Agreements, policies, compliance scans | Legal/compliance work (`/sk:legal-scan`) |
| [Operations](./operations/) | Runbooks, incidents, postmortems | Running prod, on-call, after an incident |
| [Reviews](./reviews/) | Code, security, perf, UI review reports | After running review commands |
| [Research](./research/) | Brainstorm findings, debug investigations | After brainstorm or complex debug |
| [Templates](./templates/) | Starter templates for all doc types | When creating new documentation |
| [Archive](./_archive/) | Retired docs kept for history | Looking up superseded decisions |

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
|-- README.md                  <- You are here (master index, agent front door)
|-- START-HERE.md              <- Human front door (role-based router)
|-- tasks/
|   |-- README.md              <- Task board (pipeline view)
|   |-- EPIC-N-name.md         <- Epic: large feature with multiple tasks
|   |-- TASK-N-EN-name.md      <- Task: self-contained deliverable
|   +-- examples/              <- Worked examples of completed tasks
|-- architecture/
|   |-- README.md              <- Architecture overview + component map
|   |-- system-overview.md     <- High-level system design
|   +-- [component].md         <- Per-component deep dives
|-- features/
|   |-- README.md              <- Feature docs index
|   +-- [feature].md           <- Per-feature docs (/sk:new-feature-doc)
|-- conventions/
|   |-- README.md              <- Conventions index
|   |-- code-style.md          <- Naming, formatting, patterns
|   |-- file-structure.md      <- Project organization rules
|   |-- git-workflow.md        <- Branching, commits, PRs
|   |-- delegation-policy.md   <- What agents may decide alone vs escalate
|   +-- testing.md             <- Testing standards & patterns
|-- sop/
|   |-- README.md              <- SOP index
|   |-- creating-a-task.md     <- How to create & manage tasks
|   +-- [procedure].md         <- Step-by-step procedures
|-- flows/
|   |-- README.md              <- Flow diagrams index
|   +-- [flow-name].md         <- Mermaid diagrams + explanations
|-- decisions/
|   |-- README.md              <- ADR index
|   |-- decision-log.md        <- One-line journal of small (agent) decisions
|   +-- [NNN]-[title].md       <- Architecture Decision Records
|-- system/
|   |-- README.md              <- System state index
|   |-- project-context.md     <- Dense project summary (read first)
|   |-- tech-stack.md          <- Technologies & versions
|   |-- database-schema.md     <- DB schema + relationships
|   |-- api-reference.md       <- API endpoints & contracts
|   |-- integrations.md        <- External service connections
|   +-- env-variables.md       <- Environment variables & secrets
|-- reference/
|   |-- README.md              <- Reference index
|   +-- ui-design/             <- UI design standards (used by /sk:ui-review)
|-- reviews/
|   |-- README.md              <- Review report index
|   |-- code/                  <- Code review reports
|   |-- security/              <- Security audit reports
|   |-- performance/           <- Performance analysis reports
|   |-- ui/                    <- UI/a11y audit reports
|   +-- deps/                  <- Dependency health reports
|-- research/
|   |-- README.md              <- Research index
|   +-- YYYY-MM-DD-topic.md   <- Research artifacts
|-- user-guides/
|   |-- README.md              <- User guides index
|   +-- [task].md              <- Customer-facing guides (/sk:new-user-guide)
|-- business/
|   |-- README.md              <- Business / GTM index
|   |-- campaigns/             <- Marketing campaigns (/sk:campaign)
|   |-- copy/                  <- Marketing copy + announcement packs
|   |-- exec/                  <- Executive offices: STATE.md, meetings, briefs, asks ledger
|   +-- [positioning|goals|brand-voice|metrics|competitor-*|*].md  <- GTM + business docs
|-- legal/
|   |-- README.md              <- Legal & compliance index
|   |-- agreements/            <- founders, operating, IP, contracts
|   |-- policies/              <- privacy policy, ToS, DPA
|   +-- scans/                 <- dated compliance scans (/sk:legal-scan)
|-- operations/
|   |-- README.md              <- Operations index
|   |-- runbooks/              <- on-call, deploy, rollback, recovery
|   |-- incidents/             <- active incident notes
|   +-- postmortems/           <- blameless postmortems
|-- _archive/
|   |-- README.md              <- Archive index
|   +-- [retired-doc].md       <- Superseded docs (Lifecycle: archived)
+-- templates/                 <- 24 doc templates — see templates/README.md for the full list + which command emits each
```

## Maintenance Rules

### When to Update Docs

| Event | Action |
|-------|--------|
| **New work starting** | Follow [Creating a Task SOP](./sop/creating-a-task.md) |
| New feature planned | Create epic/task in `tasks/` using template |
| Task enters DEV phase | Update task frontmatter, start checking subtasks |
| Task enters TEST phase | Verify acceptance criteria in the task doc |
| Feature implemented | Update `system/`, `architecture/`, relevant `flows/` |
| New pattern established | Add to `conventions/` |
| Tech decision made | Create ADR in `decisions/` |
| Small decision on an autonomous run | Append one line to `decisions/decision-log.md` |
| Company goals set or changed | Update `business/goals.md`; link epics via `goal:` |
| New recurring process | Create SOP in `sop/` |
| Dependency added/upgraded | Update `system/tech-stack.md` |
| Schema changed | Update `system/database-schema.md` |
| API changed | Update `system/api-reference.md` |

### Doc Quality Checklist

- [ ] Has `Last updated` date
- [ ] Linked from parent README index
- [ ] No duplicated content (links instead)
- [ ] Code examples are tested/current
- [ ] Mermaid diagrams render correctly
