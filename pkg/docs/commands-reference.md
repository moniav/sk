# Command Reference

> **Claude Code:** Read this file when you need to find the right command for a task.
> This is NOT loaded automatically — CLAUDE.md points here when needed.

## Slash Commands (sk namespace)

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/sk:kickoff` | Guided project setup + research | Starting a new (greenfield) project |
| `/sk:brainstorm` | Explore idea, produce epic + tasks | Have an idea, need to break it down |
| `/sk:implement` | Full lifecycle: Plan > Dev > Test | Build a feature end-to-end |
| `/sk:new-task` | Create a new task file | Starting planned work (M complexity) |
| `/sk:new-epic` | Create a new epic file | Starting large feature (L/XL complexity) |
| `/sk:plan` | Complete PLAN phase | Break down and prepare a task |
| `/sk:dev` | Execute DEV phase | Implement subtasks for a task |
| `/sk:test` | Execute TEST phase | Verify acceptance criteria |
| `/sk:finish` | Review + commit + push + PR + task update | After work is done, ready to ship |
| `/sk:commit` | Smart git commit + push + PR | After changes, ready to commit |
| `/sk:resume` | Resume from previous session | Starting a new session with active work |
| `/sk:task-status` | Show task board overview | Check progress across all tasks |
| `/sk:update-docs` | Sync docs with codebase | After changes, or periodic audit |
| `/sk:update` | Update SK commands & templates | Get latest version of shipkit-cld |
| `/sk:init-docs` | Bootstrap docs from existing codebase | Brownfield project or full rebuild |
| `/sk:new-sop` | Create a new SOP | Document a recurring procedure |
| `/sk:new-adr` | Create an ADR | Record a significant tech decision |
| `/sk:new-flow` | Create a flow diagram | Visualize a system process |
| `/sk:code-review` | Analyze code for bugs, patterns, quality | Before committing or merging |
| `/sk:security-review` | Security scan — OWASP, secrets, deps | Before release or on-demand |
| `/sk:ui-review` | UI quality — a11y, responsive, UX | After UI changes |
| `/sk:perf-review` | Performance — queries, memory, rendering, caching | Before release or on-demand |
| `/sk:debug` | Systematic debugging — reproduce, isolate, fix, verify | Bug reports and unexpected behavior |
| `/sk:refactor` | Safe refactoring — restructure without behavior change | Code improvement without feature changes |
| `/sk:changelog` | Generate changelog from git history | Before release or version bump |
| `/sk:deps` | Dependency health — outdated, vulnerabilities, licenses | Periodic audit or before release |

## Command Prerequisites

| Command | Requires |
|---------|----------|
| /sk:kickoff | Nothing (guided setup for greenfield) |
| /sk:init-docs | Nothing (auto-scan for brownfield) |
| /sk:brainstorm | project-context.md populated |
| /sk:new-task | tech-stack.md populated |
| /sk:dev | Build Commands filled in |
| /sk:test | Build Commands filled in, test runner installed |
| /sk:code-review | code-style.md populated |
| /sk:security-review | tech-stack.md populated |
| /sk:perf-review | tech-stack.md populated |
| /sk:debug | Nothing (reads context as needed) |
| /sk:resume | Nothing (reads task state automatically) |
| /sk:refactor | code-style.md populated, test suite available |
| /sk:changelog | Conventional commits in git history |
| /sk:deps | Package manifest (package.json, pyproject.toml, etc.) |

## Command Workflow Map

```
Getting Started
├── /sk:kickoff (greenfield) → generates foundation docs
│   └── /sk:brainstorm → explore idea, create epic + tasks
└── /sk:init-docs (brownfield) → scan codebase, populate docs

Lifecycle
├── /sk:implement → full Plan > Dev > Test
├── /sk:plan → PLAN phase only
├── /sk:dev → DEV phase
├── /sk:test → TEST phase
└── /sk:finish → review + commit + push + PR

Session Management
├── /sk:resume → restore context from previous session
└── /sk:task-status → full task board overview

Quality Gates
├── /sk:code-review
├── /sk:security-review
├── /sk:ui-review
└── /sk:perf-review

Git & Release
├── /sk:commit → conventional commit
├── /sk:changelog → generate changelog
└── /sk:deps → dependency audit
```
