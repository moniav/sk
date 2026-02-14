# SK — Documentation & Lifecycle System for Claude Code

## Why This Exists

Claude Code (and any AI coding agent) works dramatically better when it has structured context about your project's conventions, architecture, and procedures. This system gives it that context through a lightweight, maintainable doc structure.

## How It Works

```mermaid
graph TD
    A["CLAUDE.md<br/><i>entry point — read automatically</i>"] --> B[".claude/commands/sk/<br/><i>25 slash commands</i>"]
    B --> C["docs/README.md<br/><i>master index</i>"]

    C --> D["LIFECYCLE"]
    C --> E["WHAT"]
    C --> F["WHY"]
    C --> G["HOW"]

    D --> D1["tasks/"]
    D1 --> D2["Plan > Dev > Test cycle"]

    E --> E1["architecture/"]
    E --> E2["system/"]
    E --> E3["flows/"]

    G --> G1["conventions/"]
    G --> G2["sop/"]

    F --> F1["decisions/"]

    style A fill:#2d6a4f,color:#fff
    style B fill:#40916c,color:#fff
    style C fill:#52b788,color:#fff
    style D fill:#264653,color:#fff
    style E fill:#264653,color:#fff
    style F fill:#264653,color:#fff
    style G fill:#264653,color:#fff
```

**LIFECYCLE** = How work flows from idea to done (plan > dev > test, task hierarchy)
**WHAT** = What the system looks like (architecture, current state, diagrams)
**HOW** = How to work in it (coding rules, procedures)
**WHY** = Why things are the way they are (decision records)

## Task Lifecycle

Every piece of work flows through three phases with explicit exit gates:

```mermaid
stateDiagram-v2
    direction LR

    [*] --> Plan
    Plan --> Dev : Exit gate:<br/>questions resolved,<br/>subtasks defined,<br/>criteria testable
    Dev --> Test : Exit gate:<br/>subtasks done,<br/>code self-reviewed,<br/>docs updated
    Test --> Done : Exit gate:<br/>all criteria verified,<br/>all tests pass
    Done --> [*]

    state Plan {
        direction TB
        p1: Write problem statement
        p2: Define acceptance criteria
        p3: Break into subtasks
        p4: Resolve open questions
        p1 --> p2
        p2 --> p3
        p3 --> p4
    }

    state Dev {
        direction TB
        d1: Execute subtasks
        d2: Follow conventions
        d3: Update docs with code
        d1 --> d2
        d2 --> d3
    }

    state Test {
        direction TB
        t1: Verify each criterion
        t2: Test error paths
        t3: Confirm no regressions
        t1 --> t2
        t2 --> t3
    }
```

### Task Hierarchy

```mermaid
graph TD
    Epic["Epic<br/><i>L/XL — large feature, cross-cutting</i>"]
    Epic --> T1["Task<br/><i>M — self-contained deliverable</i>"]
    Epic --> T2["Task<br/><i>M — self-contained deliverable</i>"]

    T1 --> S1["Subtask S<br/>[DEV]"]
    T1 --> S2["Subtask S<br/>[TEST]"]
    T1 --> S3["Subtask S<br/>[DOCS]"]

    T2 --> S4["Subtask S"]
    T2 --> S5["Subtask S"]

    style Epic fill:#264653,color:#fff
    style T1 fill:#2a9d8f,color:#fff
    style T2 fill:#2a9d8f,color:#fff
    style S1 fill:#e9c46a,color:#000
    style S2 fill:#e9c46a,color:#000
    style S3 fill:#e9c46a,color:#000
    style S4 fill:#e9c46a,color:#000
    style S5 fill:#e9c46a,color:#000
```

## Installation

```bash
# From your project root:
npx shipkit-cld

# Or targeting a specific directory:
npx shipkit-cld /path/to/my-project
```

## Getting Started

SK works with both new projects and existing codebases. The setup path differs.

```mermaid
flowchart TD
    Start(["npx shipkit-cld"]) --> Q{"New or existing<br/>codebase?"}

    Q -->|"Greenfield<br/>(no code yet)"| GF1["/sk:kickoff<br/><i>guided setup + research</i>"]
    GF1 --> GF2["/sk:brainstorm<br/><i>define first feature</i>"]
    GF2 --> Impl

    Q -->|"Brownfield<br/>(existing code)"| BF1["/sk:init-docs<br/><i>auto-scan codebase<br/>+ detect build commands</i>"]
    BF1 --> BF2["Review generated docs"]
    BF2 --> BF3["/sk:new-task"]
    BF3 --> Impl

    Impl["/sk:implement<br/><i>build it</i>"]
    Impl --> Ship(["Ship it"])

    style Start fill:#2d6a4f,color:#fff
    style Ship fill:#2d6a4f,color:#fff
    style Q fill:#264653,color:#fff
    style Impl fill:#e76f51,color:#fff
    style GF1 fill:#2a9d8f,color:#fff
    style GF2 fill:#2a9d8f,color:#fff
    style BF1 fill:#e9c46a,color:#000
    style BF2 fill:#e9c46a,color:#000
    style BF3 fill:#e9c46a,color:#000
```

### Greenfield Project (starting from scratch)

You have no code yet — you're setting up the project structure and want Claude Code to follow good practices from the start.

```
1. npx shipkit-cld                          # Install SK
2. /sk:kickoff                              # Answer questions, docs auto-generated
3. /sk:brainstorm                           # Describe your first feature, get epic + tasks
4. /sk:implement                            # Build it
```

`/sk:kickoff` is a guided conversation that asks what you're building, what stack you want, and what the core features are. It then **researches current best practices** for your chosen stack (latest versions, recommended project structure, naming conventions, common pitfalls) and generates all foundation docs automatically:

- `docs/system/tech-stack.md` — with current stable versions from research
- `docs/system/project-context.md` — dense project summary
- `docs/conventions/code-style.md` — conventions for your chosen language/framework
- `docs/conventions/file-structure.md` — recommended project layout
- `docs/conventions/testing.md` — test patterns for your stack
- `CLAUDE.md` Build Commands — filled in for your stack
- ADRs for your major stack choices

`/sk:brainstorm` then takes your first feature idea, explores it through conversation, optionally researches domain patterns ("what do similar apps typically include?"), and produces a structured epic with tasks — ready for `/sk:implement`.

**No manual file editing required.** Both commands generate everything through conversation.

### Brownfield Project (existing codebase)

You have an existing codebase — you want Claude Code to understand it and follow its patterns.

```
1. npx shipkit-cld                          # Install SK
2. /sk:init-docs                            # Auto-scan codebase, detect build commands, populate docs
3. Review generated docs                    # Verify accuracy, fix anything wrong
4. /sk:new-task                             # Define your first piece of work
5. /sk:implement                            # Build it
```

`/sk:init-docs` scans your codebase and generates:
- `docs/system/tech-stack.md` — from `package.json`, `pyproject.toml`, etc.
- `docs/system/project-context.md` — dense project summary
- `docs/system/database-schema.md` — from schema/model files
- `docs/system/api-reference.md` — from route definitions
- `docs/conventions/code-style.md` — from observed naming and formatting patterns
- `docs/conventions/file-structure.md` — from actual project layout
- `docs/architecture/README.md` — component map from directory structure
- ADRs for 2-3 major tech choices it discovers

**What to review after init:** The auto-generated docs are best-effort. Skim each one and correct anything wrong — especially conventions and architecture docs. These are what Claude Code reads before every task, so accuracy matters.

**Build commands are auto-detected** from `package.json` scripts, `Makefile` targets, `pyproject.toml` tools, `Cargo.toml`, `go.mod`, and CI workflows. The report shows what was detected and what's missing. You only need to fill in commands marked `[NOT DETECTED]`.

**What to review manually:**
- `docs/conventions/code-style.md` — add any unwritten rules the scan couldn't detect
- `docs/system/project-context.md` — add gotchas, in-progress work, team context

**Tip:** Run `/sk:update-docs` periodically to keep docs in sync as your codebase evolves.

## Command Map

```mermaid
graph LR
    subgraph "Getting Started"
        kickoff["/sk:kickoff"]
        brainstorm["/sk:brainstorm"]
        initdocs["/sk:init-docs"]
    end

    subgraph "Lifecycle"
        implement["/sk:implement"]
        plan["/sk:plan"]
        dev["/sk:dev"]
        test["/sk:test"]
    end

    subgraph "Creation"
        newtask["/sk:new-task"]
        newepic["/sk:new-epic"]
        newsop["/sk:new-sop"]
        newadr["/sk:new-adr"]
        newflow["/sk:new-flow"]
    end

    subgraph "Quality"
        commit["/sk:commit"]
        codereview["/sk:code-review"]
        secreview["/sk:security-review"]
        uireview["/sk:ui-review"]
        perfreview["/sk:perf-review"]
    end

    subgraph "Debugging & Refactoring"
        debug["/sk:debug"]
        refactor["/sk:refactor"]
    end

    subgraph "Management"
        status["/sk:task-status"]
        updatedocs["/sk:update-docs"]
        update["/sk:update"]
        changelog["/sk:changelog"]
        deps["/sk:deps"]
    end

    kickoff -->|"generates docs"| brainstorm
    brainstorm -->|"creates tasks"| implement
    initdocs -->|"populates docs"| newtask

    implement --> plan
    plan --> dev
    dev --> test

    newepic -->|"creates tasks"| newtask

    dev -->|"done"| codereview
    codereview --> secreview
    codereview --> perfreview
    secreview --> commit
    perfreview --> commit

    debug -->|"fixed"| codereview
    refactor -->|"restructured"| codereview

    deps -.->|"updates needed"| commit
    changelog -.->|"commit changelog"| commit

    style kickoff fill:#2d6a4f,color:#fff
    style brainstorm fill:#2d6a4f,color:#fff
    style initdocs fill:#2d6a4f,color:#fff
    style implement fill:#e76f51,color:#fff
    style plan fill:#2a9d8f,color:#fff
    style dev fill:#2a9d8f,color:#fff
    style test fill:#2a9d8f,color:#fff
    style perfreview fill:#e9c46a,color:#000
    style debug fill:#e76f51,color:#fff
    style refactor fill:#e76f51,color:#fff
    style changelog fill:#264653,color:#fff
    style deps fill:#264653,color:#fff
    style commit fill:#e9c46a,color:#000
```

## Command Reference

### Getting Started

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/sk:kickoff` | Guided project setup + best-practice research | Starting a new (greenfield) project |
| `/sk:brainstorm` | Explore idea, produce epic + tasks | Have an idea, need to break it down |
| `/sk:init-docs` | Auto-scan codebase, populate docs | Brownfield project or full rebuild |

### Lifecycle (Plan > Dev > Test)

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/sk:implement` | Full lifecycle: Plan > Dev > Test | Build a feature end-to-end |
| `/sk:plan` | Complete PLAN phase | Break down and prepare a task |
| `/sk:dev` | Execute DEV phase | Implement subtasks for a task |
| `/sk:test` | Execute TEST phase | Verify acceptance criteria |

### Document Creation

| Command | Purpose | Output |
|---------|---------|--------|
| `/sk:new-task` | Create a new task file | `docs/tasks/TASK-{N}-*.md` |
| `/sk:new-epic` | Create a new epic + child tasks | `docs/tasks/EPIC-{N}-*.md` |
| `/sk:new-sop` | Create a standard operating procedure | `docs/sop/*.md` |
| `/sk:new-adr` | Record an architecture decision | `docs/decisions/*.md` |
| `/sk:new-flow` | Create a Mermaid flow diagram | `docs/flows/*.md` |

### Quality & Review

| Command | Purpose | Output |
|---------|---------|--------|
| `/sk:code-review` | Analyze code for bugs, conventions, quality | Report (conversation) |
| `/sk:security-review` | OWASP Top 10, secrets, dependency audit | Report (conversation) |
| `/sk:ui-review` | Accessibility, responsive design, UX | Report (conversation) |
| `/sk:perf-review` | Queries, memory, rendering, caching | Report (conversation) |

### Debugging & Refactoring

| Command | Purpose | Output |
|---------|---------|--------|
| `/sk:debug` | Reproduce, isolate, fix, verify with regression test | Code fix + test + task file (M+) |
| `/sk:refactor` | Restructure code, verify behavior unchanged | Code changes + task file (M+) |

### Git & Release

| Command | Purpose | Output |
|---------|---------|--------|
| `/sk:commit` | Smart git commit + push + PR | Git commit |
| `/sk:changelog` | Generate changelog from git history | `CHANGELOG.md` |

### Management

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/sk:task-status` | Show task board overview | Check progress across all tasks |
| `/sk:update-docs` | Sync docs with codebase | After changes, or periodic audit |
| `/sk:deps` | Dependency health check | Periodic audit or before release |
| `/sk:update` | Update SK commands & templates | Get latest version of shipkit-cld |

## Key Design Decisions

**Plan > Dev > Test lifecycle** — Forces thinking before coding. Each phase has an explicit exit gate so nothing gets skipped. The 3-phase cycle is simple enough to actually follow.

**Task hierarchy (Epic > Task > Subtask)** — Epics break into tasks, tasks break into subtasks. Each level has a clear scope and complexity ceiling. Subtasks capped at S complexity (single concern) prevent scope creep and make progress visible.

**Self-contained tasks** — Every task is independently buildable, testable, and shippable. This means Claude Code can execute a task without needing context from other in-flight work.

**Worked examples over abstract docs** — The `examples/` folder shows exactly what a completed task looks like. Worth more than pages of explanation.

**Templates over empty files** — Every doc type has a template. Copy, fill in, done. No blank page anxiety.

**Mermaid for diagrams** — Renders in GitHub, VS Code, and most tools. No external diagram software needed. Lives in git alongside code.

**ADRs for decisions** — "Why did we choose X?" is the most expensive question in a codebase. ADRs answer it once.

**SOPs for procedures** — AI agents follow explicit steps better than vague guidelines. SOPs eliminate improvisation on critical tasks.

**Flat over deep** — Two levels max. Everything discoverable from the README index.

## Anti-Patterns to Avoid

| Don't | Do Instead |
|-------|-----------|
| Write 20-page architecture docs | Keep each doc focused, link between them |
| Document implementation details | Document decisions and interfaces |
| Let docs go stale | Update in the same PR as the code change |
| Duplicate content across docs | Link to the single source of truth |
| Write docs nobody reads | Write docs Claude Code reads every session |
