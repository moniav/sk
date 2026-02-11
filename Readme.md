# SK — Documentation & Lifecycle System for Claude Code

## Why This Exists

Claude Code (and any AI coding agent) works dramatically better when it has structured context about your project's conventions, architecture, and procedures. This system gives it that context through a lightweight, maintainable doc structure.

## How It Works

```
CLAUDE.md (entry point — read automatically)
    ↓
.claude/commands/sk/ (12 commands: /sk:plan /sk:dev /sk:test ...)
    ↓
docs/README.md (master index — navigation hub)
    ↓
┌──────────────┬──────────────┬────────────┐
│  LIFECYCLE   │  WHAT        │  WHY       │
│              │              │            │
│ lifecycle    │ architecture │  decisions │
│ tasks        │ system       │            │
│ (plan/dev/   │ flows        │            │
│  test cycle) │              │            │
├──────────────┤              │            │
│  HOW         │              │            │
│              │              │            │
│ conventions  │              │            │
│ sop          │              │            │
└──────────────┴──────────────┴────────────┘
```

**LIFECYCLE** = How work flows from idea to done (plan → dev → test, task hierarchy)
**WHAT** = What the system looks like (architecture, current state, diagrams)
**HOW** = How to work in it (coding rules, procedures)
**WHY** = Why things are the way they are (decision records)

## Task Hierarchy

```
Epic (L/XL — large feature, cross-cutting)
├── Task (M — self-contained deliverable, one feature area)
│   ├── Subtask S (tagged: [DEV] [TEST] [DOCS])
│   ├── Subtask S
│   └── Subtask S
└── Task
    ├── Subtask S
    └── Subtask S
```

Each task goes through **Plan → Dev → Test → Done** with explicit exit gates between phases.

## Installation

### npx (recommended)
```bash
# From your project root:
npx shipkit-cld

# Or targeting a specific directory:
npx shipkit-cld /path/to/my-project
```


### Post-Install

1. Edit `docs/system/tech-stack.md` — add your real stack
2. Edit `docs/conventions/code-style.md` — match your patterns
3. Edit `CLAUDE.md` — add your project commands and constraints
4. Run `/sk:init-docs` in Claude Code to auto-populate from codebase
5. Run `/sk:new-task` to create your first task

## Key Design Decisions

**Plan → Dev → Test lifecycle** — Forces thinking before coding. Each phase has an explicit exit gate so nothing gets skipped. The 3-phase cycle is simple enough to actually follow.

**Task hierarchy (Epic → Task → Subtask)** — Epics break into tasks, tasks break into subtasks. Each level has a clear scope and complexity ceiling. Subtasks capped at S complexity (single concern) prevent scope creep and make progress visible.

**Self-contained tasks** — Every task is independently buildable, testable, and shippable. This means Claude Code can execute a task without needing context from other in-flight work.

**Worked examples over abstract docs** — The `examples/` folder shows exactly what a completed task looks like. Worth more than pages of explanation.

**Templates over empty files** — Every doc type has a template. Copy, fill in, done. No blank page anxiety.

**Mermaid for diagrams** — Renders in GitHub, VS Code, and most tools. No external diagram software needed. Lives in git alongside code.

**ADRs for decisions** — "Why did we choose X?" is the most expensive question in a codebase. ADRs answer it once.

**SOPs for procedures** — AI agents follow explicit steps better than vague guidelines. SOPs eliminate improvisation on critical tasks.

**Flat over deep** — Two levels max. Everything discoverable from the README index.

## Slash Commands

The `.claude/commands/sk/` folder contains 12 Claude Code commands under the `sk` namespace:

**Lifecycle Commands** (the core loop):
- `/sk:implement` — Full Plan → Dev → Test in one session
- `/sk:plan` — Complete the PLAN phase for a task
- `/sk:dev` — Execute the DEV phase (implement subtasks)
- `/sk:test` — Execute the TEST phase (verify acceptance criteria)

**Creation Commands** (make new docs):
- `/sk:new-task` — Create a task with full lifecycle structure
- `/sk:new-epic` — Create an epic with task decomposition
- `/sk:new-sop` — Create a standard operating procedure
- `/sk:new-adr` — Record an architecture decision
- `/sk:new-flow` — Create a Mermaid flow diagram from code analysis

**Management Commands** (maintain the system):
- `/sk:task-status` — Dashboard showing all task progress
- `/sk:update-docs` — Deep scan codebase and sync documentation
- `/sk:init-docs` — Bootstrap docs from scratch for a new project

Every command reads the relevant docs first, then acts. They reference each other — `/sk:implement` chains `/sk:plan` → `/sk:dev` → `/sk:test`, and `/sk:new-epic` can trigger `/sk:new-task` for each task in the breakdown.

## Anti-Patterns to Avoid

| Don't | Do Instead |
|-------|-----------|
| Write 20-page architecture docs | Keep each doc focused, link between them |
| Document implementation details | Document decisions and interfaces |
| Let docs go stale | Update in the same PR as the code change |
| Duplicate content across docs | Link to the single source of truth |
| Write docs nobody reads | Write docs Claude Code reads every session |
