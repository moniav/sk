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
| `/sk:orchestrate` | Parallel agent team for task/epic | 3+ independent subtasks, want speed |
| `/sk:council` | Multi-persona advisory council | Architecture decisions, strategy, trade-offs |
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
| `/sk:legal-scan` | Legal & compliance expert — requirements, framework deep-dives, document drafting, contract review | Starting a project, adding payments/health data, fundraising |
| `/sk:copywrite` | Write marketing copy — landing pages, emails, ads, CTAs, social posts | Any marketing copy task for SaaS/tech products |
| `/sk:retro` | Run retrospective on completed work — capture lessons and improvements | After completing a task/epic, periodic reflection |
| `/sk:migrate` | Handle breaking changes, dependency upgrades, and database migrations safely | Major version bumps, schema changes, runtime upgrades |
| `/sk:recap` | Reviewer-facing recap of a diff — what changed and why | After implementation, before PR review |
| `/sk:debt` | Harvest `sk-debt` markers into a ranked ledger | Periodic debt sweep, or feeding `/sk:refactor` |
| `/sk:docs-audit` | Audit doc coherence — orphans, staleness, broken links, lifecycle | Periodic doc health check, before release |
| `/sk:new-feature-doc` | Document a feature/subsystem, verified against code | A feature is worth a standalone explainer |
| `/sk:new-user-guide` | Write a customer-facing, task-oriented user guide | Documenting how a user accomplishes a task |
| `/sk:positioning` | Define product positioning & messaging (ICP, category, value prop) | Establishing GTM foundation |
| `/sk:competitor` | Analyze competitors — profiles, positioning map, comparison | Competitive intelligence |
| `/sk:pricing` | Design or evaluate pricing — value metric, model, tiers | Pricing decisions |
| `/sk:new-business-doc` | Create a business doc (plan, model, cap table, update, memo) | Capturing a business artifact |
| `/sk:ops` | Operations/SRE expert — incidents, runbooks, postmortems, SLOs, readiness | Running prod, on-call, reliability work |

## Command Prerequisites

| Command | Requires |
|---------|----------|
| /sk:brainstorm | project-context.md populated |
| /sk:changelog | Conventional commits in git history |
| /sk:code-review | code-style.md populated |
| /sk:commit | git-workflow.md populated (optional) |
| /sk:copywrite | project-context.md populated (optional) |
| /sk:council | project-context.md populated |
| /sk:debug | Nothing (reads context as needed) |
| /sk:debt | Nothing (scans for `sk-debt` markers) |
| /sk:deps | Package manifest (package.json, pyproject.toml, etc.) |
| /sk:dev | Build Commands filled in |
| /sk:docs-audit | Nothing (read-only scan of docs/) |
| /sk:finish | Build commands filled in, code-review prerequisites |
| /sk:new-feature-doc | docs/features/ home (created by init-docs) |
| /sk:new-user-guide | docs/user-guides/ home (created by init-docs) |
| /sk:positioning | docs/business/ home (created by init-docs) |
| /sk:competitor | docs/business/ home; positioning.md helps |
| /sk:pricing | docs/business/ home; positioning.md helps |
| /sk:new-business-doc | docs/business/ home (created by init-docs) |
| /sk:ops | docs/operations/ home (created by init-docs) |
| /sk:implement | project-context.md populated |
| /sk:init-docs | Nothing (auto-scan for brownfield) |
| /sk:kickoff | Nothing (guided setup for greenfield) |
| /sk:legal-scan | Nothing (reads context as needed) |
| /sk:migrate | tech-stack.md populated, test suite available |
| /sk:new-adr | architecture/README.md populated |
| /sk:new-epic | project-context.md populated |
| /sk:new-flow | architecture/README.md or flows/README.md populated |
| /sk:new-sop | Nothing (guided creation) |
| /sk:new-task | tech-stack.md populated |
| /sk:orchestrate | PLAN phase complete, 3+ subtasks with file paths |
| /sk:perf-review | tech-stack.md populated |
| /sk:plan | project-context.md, tech-stack.md populated |
| /sk:recap | A diff in scope (branch, staged, or commit range) |
| /sk:refactor | code-style.md populated, test suite available |
| /sk:resume | Nothing (reads task state automatically) |
| /sk:retro | A completed task or recent commits to review |
| /sk:security-review | tech-stack.md populated |
| /sk:task-status | Nothing (reads task files automatically) |
| /sk:test | Build Commands filled in, test runner installed |
| /sk:ui-review | code-style.md populated |
| /sk:update | Nothing (reads .sk-source automatically) |
| /sk:update-docs | project-context.md populated |

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
├── /sk:orchestrate → parallel agent team (dependency-aware)
├── /sk:retro → retrospective on completed work
└── /sk:finish → review + commit + push + PR

Session Management
├── /sk:resume → restore context from previous session
└── /sk:task-status → full task board overview

Decision Making
└── /sk:council → multi-persona deliberation → decision report

Quality Gates
├── /sk:code-review
├── /sk:security-review
├── /sk:ui-review
└── /sk:perf-review

Git & Release
├── /sk:commit → conventional commit
├── /sk:changelog → generate changelog
└── /sk:deps → dependency audit

Marketing & Legal
├── /sk:copywrite → marketing copy (landing pages, emails, ads, social)
└── /sk:legal-scan → compliance scan + legal document generation

Migration & Recovery
└── /sk:migrate → breaking changes, upgrades, migrations
```

## When to Use Which Command

### Lifecycle: Phased vs One-Shot

| Situation | Use |
|-----------|-----|
| Want to review between phases, or pausing between sessions | `/sk:plan` → `/sk:dev` → `/sk:test` (separate commands) |
| Want to go from idea to done in one session | `/sk:implement` (runs all three phases) |
| Task has 3+ independent subtasks, want parallelism | `/sk:orchestrate` (parallel agents with worktree isolation) |

### Orchestrate vs Dev with Subagent Mode

| Situation | Use |
|-----------|-----|
| Full epic or task with dependency ordering needed | `/sk:orchestrate` (builds dependency graph, runs waves) |
| Single task, 5+ subtasks, want clean context per subtask | `/sk:dev` with subagent mode (simpler, no dependency analysis) |
| Single task, < 5 subtasks | `/sk:dev` standard mode (direct execution) |

### Review Commands

| Situation | Use |
|-----------|-----|
| Before committing code changes | `/sk:code-review` |
| Before release (security focus) | `/sk:security-review` |
| After UI changes | `/sk:ui-review` |
| Performance concerns | `/sk:perf-review` |
| All of the above | Run them in sequence or as part of `/sk:finish` |

### Creating Work Items

| Situation | Use |
|-----------|-----|
| Large feature (L/XL) with multiple tasks | `/sk:new-epic` |
| Single deliverable (M complexity) | `/sk:new-task` |
| XS/S complexity | No task file — just do it and `/sk:commit` |
| Have an idea, need to explore first | `/sk:brainstorm` → produces epic + tasks |

## Skill Interactions

Skills activate automatically during command execution. Here's how they compose:

| Skill Combination | When It Happens | Effect |
|-------------------|-----------------|--------|
| **TDD + Verification** | Every `/sk:dev` and `/sk:implement` subtask | Tests written first (RED-GREEN-REFACTOR), then verified with actual output before marking done |
| **Escalation + Any Command** | After 3 failed attempts at the same problem | Stops retrying, presents structured options (break down, revise, rethink, debug) |
| **Subagent Dev + TDD** | `/sk:dev` with 5+ subtasks in subagent mode | Each subagent follows TDD independently with fresh context |
| **Git Worktrees + Orchestrate** | `/sk:orchestrate` with parallel waves | Each parallel agent gets an isolated worktree to avoid file conflicts |
| **Error Recovery + Escalation** | During any recovery that hits 3 failures | Recovery attempts are structured; if stuck, escalation kicks in |
| **Context Priming + Resume** | `/sk:resume` at session start | Context priming guides efficient file reading order for warm-up |
| **Verification + Test** | `/sk:test` phase exit | Must show actual command output proving all ACs pass — no "trust me" allowed |
