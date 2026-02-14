# 📚 Project Documentation Index

> **Claude Code:** Always read this file first before planning any implementation.
> After completing any feature, update the relevant docs to reflect current state.

## Quick Navigation

| Section | Purpose | When to Read |
|---------|---------|--------------|
| [Tasks](./tasks/) | Task board, epics, PRDs & implementation plans | Before/during feature development |
| [Architecture](./architecture/) | System design, component relationships, data flow | Before designing new features |
| [Conventions](./conventions/) | Code standards, naming, patterns, file organization | Before writing any code |
| [SOP](./sop/) | Step-by-step procedures for common tasks | Before executing any recurring task |
| [Flows](./flows/) | Visual diagrams (Mermaid) for key processes | When understanding system behavior |
| [Decisions](./decisions/) | ADRs - why we made key technical choices | When questioning "why is it done this way?" |
| [System](./system/) | Current state: stack, schema, integrations, APIs | For reference during development |
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
├── README.md                  ← You are here (master index)
├── tasks/
│   ├── README.md              ← Task board (pipeline view)
│   ├── EPIC-N-phase-name.md   ← Epic: large feature with multiple tasks
│   ├── TASK-N-EN-phase-name.md ← Task: self-contained deliverable
│   └── examples/              ← Worked examples of completed tasks
├── architecture/
│   ├── README.md              ← Architecture overview + component map
│   ├── system-overview.md     ← High-level system design
│   └── [component].md         ← Per-component deep dives
├── conventions/
│   ├── README.md              ← Conventions index
│   ├── code-style.md          ← Naming, formatting, patterns
│   ├── file-structure.md      ← Project organization rules
│   ├── git-workflow.md        ← Branching, commits, PRs
│   └── testing.md             ← Testing standards & patterns
├── sop/
│   ├── README.md              ← SOP index
│   ├── creating-a-task.md     ← How to create & manage tasks
│   └── [procedure].md         ← Step-by-step procedures
├── flows/
│   ├── README.md              ← Flow diagrams index
│   └── [flow-name].md         ← Mermaid diagrams + explanations
├── decisions/
│   ├── README.md              ← ADR index
│   └── [NNN]-[title].md       ← Architecture Decision Records
├── system/
│   ├── README.md              ← System state index
│   ├── tech-stack.md          ← Technologies & versions
│   ├── database-schema.md     ← DB schema + relationships
│   ├── api-reference.md       ← API endpoints & contracts
│   ├── integrations.md        ← External service connections
│   └── env-variables.md       ← Environment variables & secrets
└── templates/
    ├── epic.md                ← Epic template (multi-task feature)
    ├── task-prd.md            ← Task template (with Plan/Dev/Test phases)
    ├── sop-procedure.md       ← SOP template
    ├── adr-decision.md        ← ADR template
    ├── flow-diagram.md        ← Flow diagram template
    └── component-doc.md       ← Component documentation template
```

## Maintenance Rules

### When to Update Docs

| Event | Action |
|-------|--------|
| **New work starting** | Follow [Creating a Task SOP](./sop/creating-a-task.md) |
| New feature planned | Create epic/task in `tasks/` using template |
| Task enters DEV phase | Update task status, start checking subtasks |
| Task enters TEST phase | Verify acceptance criteria in the task doc |
| Feature implemented | Update `system/`, `architecture/`, relevant `flows/` |
| New pattern established | Add to `conventions/` |
| Tech decision made | Create ADR in `decisions/` |
| New recurring process | Create SOP in `sop/` |
| Dependency added/upgraded | Update `system/tech-stack.md` |
| Schema changed | Update `system/database-schema.md` |
| API changed | Update `system/api-reference.md` |

### Doc Quality Checklist

- [ ] Has `last_updated` date
- [ ] Linked from parent README index
- [ ] No duplicated content (links instead)
- [ ] Code examples are tested/current
- [ ] Mermaid diagrams render correctly
