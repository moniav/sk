# Superpowers Repository Analysis & SK Workflow Enhancement Report

**Date:** 2026-03-19
**Subject:** Analysis of [obra/superpowers](https://github.com/obra/superpowers) v5.0.5 and actionable enhancements for the SK workflow

---

## Executive Summary

**Superpowers** is a composable skills library for AI coding agents by Jesse Vincent (Prime Radiant). It provides a complete software development workflow — brainstorming, design validation, implementation planning, and subagent-driven development with automated code review. It works as a plugin across Claude Code, Cursor, Codex, OpenCode, and Gemini CLI.

Our **SK workflow** already has strong foundations (Plan → Dev → Test lifecycle, task hierarchy, structured docs). Superpowers introduces several powerful patterns we lack — particularly **subagent orchestration**, **TDD enforcement**, **systematic debugging**, and **automated code review** — that would significantly enhance our workflow.

---

## 1. Feature Comparison

| Capability | SK (Current) | Superpowers | Gap |
|---|---|---|---|
| **Development lifecycle** | Plan → Dev → Test | Brainstorm → Plan → Execute → Review → Finish | We lack Brainstorm and Review phases |
| **Task hierarchy** | Epic → Task → Subtask | Plans with 2-5 min granular tasks | Comparable, different granularity |
| **Documentation system** | 8-category structured docs | Minimal (plans + specs stored as dated markdown) | SK is stronger here |
| **Templates** | 6 templates (epic, task, SOP, ADR, flow, component) | No templates | SK is stronger |
| **Slash commands** | 12 commands (`/sk:*`) | 3 deprecated commands → skills | Different model |
| **Skills system** | None (commands only) | 13 composable skills with priority rules | **Major gap** |
| **Subagent orchestration** | None | Full SDD with implementer + 2-stage review | **Major gap** |
| **Code review automation** | None | Dedicated code-reviewer agent + review skills | **Major gap** |
| **TDD enforcement** | Mentioned in conventions | Hard-enforced iron law with anti-pattern detection | **Gap** |
| **Debugging framework** | None | 4-phase systematic debugging with root cause tracing | **Major gap** |
| **Git worktree support** | None | Dedicated skill with safety checks | **Gap** |
| **Verification gates** | Exit gates per phase | "No completion without fresh verification evidence" | Comparable intent, weaker enforcement |
| **Multi-tool support** | Claude Code only | Claude Code, Cursor, Codex, OpenCode, Gemini | Not relevant to us |
| **Visual design tools** | None | WebSocket-based browser companion for mockups | Nice-to-have |
| **Memory system** | SK has no memory integration | No memory system | Neither has this |
| **Session hooks** | None | SessionStart hook for context loading | **Gap** |

---

## 2. What Superpowers Does Better

### 2.1 Subagent-Driven Development (SDD)

**The flagship pattern.** Instead of one agent doing everything, Superpowers dispatches:

1. **Implementer subagent** (fresh context per task) — implements with TDD, self-reviews, reports status (`DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, `BLOCKED`)
2. **Spec Compliance Reviewer** — verifies implementation matches the plan (examines actual code, not implementer reports)
3. **Code Quality Reviewer** — checks clean code, testing, maintainability (only runs after spec review passes)

**Why this matters:** Fresh context per subagent prevents context pollution. Two-stage review catches both "did it do what was asked?" and "is the code good?" separately. Model selection optimizes cost (cheapest model per role).

### 2.2 Brainstorming Phase

A structured 9-step design process that happens **before** planning:

1. Explore context (read codebase, understand constraints)
2. Ask clarifying questions (one at a time, multiple choice preferred)
3. Propose 2-3 approaches with tradeoffs
4. Get user selection
5. Write design spec
6. Review spec via subagent
7. Get user approval
8. Transition to planning

**Why this matters:** Our `/sk:plan` jumps straight to breaking down work. We never validate the *approach* before committing to it.

### 2.3 Systematic Debugging Framework

A 4-phase process with hard rules:

1. **Root Cause Investigation** — trace data flow, reproduce, isolate
2. **Pattern Analysis** — identify recurring patterns
3. **Hypothesis Testing** — form and test hypotheses systematically
4. **Implementation** — fix only after root cause is understood

Iron law: "NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST."
Escalation rule: After 3+ failed fixes, question the architecture.

**Why this matters:** We have no structured approach to debugging. Agents tend to apply quick fixes without understanding root causes.

### 2.4 Hard-Enforced TDD

Not just "write tests" but a strict RED-GREEN-REFACTOR cycle with explicit anti-patterns:

- Code written before tests must be **deleted entirely** (not kept as reference)
- Anti-patterns called out: "too simple to test", "I'll test after", "let me just get it working first"
- Tests verify behavior, not implementation

**Why this matters:** Our testing convention describes *what* to test but doesn't enforce *when*. Agents often write code first, tests second.

### 2.5 Composable Skills Architecture

Skills are standalone, composable units with clear trigger conditions and priority rules:

- Skills invoked BEFORE any action (even with 1% relevance)
- Priority: user instructions > skills > default behavior
- Process skills (brainstorming, debugging) before implementation skills
- Meta-skill (`using-superpowers`) teaches the agent how to discover and apply skills

**Why this matters:** Our commands are procedural scripts. Skills are more like behavioral rules that shape how the agent works across all tasks.

### 2.6 Code Review as First-Class Workflow

Two dedicated skills:
- **Requesting code review** — dispatches reviewer subagent with commit range context
- **Receiving code review** — explicit rules for responding (no performative agreement, push back with reasoning, verify before implementing)

**Why this matters:** Our workflow has no review step. Work goes from Dev → Test with no quality checkpoint.

---

## 3. What SK Does Better

### 3.1 Documentation System
SK's 8-category documentation (architecture, conventions, SOPs, decisions, flows, system, tasks, lifecycle) is far more comprehensive than Superpowers' minimal docs approach.

### 3.2 Templates
Six starter templates ensure consistency. Superpowers has no template system.

### 3.3 Task Board & Progress Tracking
SK has a structured task board with status values, priorities, and complexity ratings. Superpowers tracks progress only within plan documents.

### 3.4 Architecture Decision Records
SK captures *why* decisions were made. Superpowers doesn't formalize this.

### 3.5 SOPs for Recurring Procedures
SK has step-by-step procedures for common operations. Superpowers assumes the agent knows how.

---

## 4. Recommended Enhancements

### Priority 1: Adopt (High Impact, Proven Patterns)

#### 4.1 Add Subagent-Driven Development Skill

Create a skill that dispatches subagents for implementation tasks during `/sk:dev`:

```
.claude/
├── skills/
│   └── subagent-driven-development/
│       ├── SKILL.md                    # Orchestration rules
│       ├── implementer-prompt.md       # Task implementer template
│       ├── spec-reviewer-prompt.md     # Spec compliance checker
│       └── code-quality-reviewer.md    # Code quality checker
```

**Adaptation for SK:** Integrate with our subtask system — each S-complexity subtask becomes a subagent dispatch unit. The reviewer checks against our acceptance criteria, not just a plan document.

#### 4.2 Add Code Review Skill

Create `/sk:review` command and supporting skill:

```
.claude/skills/code-review/
├── SKILL.md                  # When and how to invoke review
├── reviewer-prompt.md        # Review criteria and format
└── review-response-rules.md  # How to handle feedback
```

**Integration point:** Add review as a gate between Dev and Test phases:
```
Plan → Dev → Review → Test
```

#### 4.3 Add Systematic Debugging Skill

Create `/sk:debug` command with the 4-phase framework:

```
.claude/skills/systematic-debugging/
├── SKILL.md                  # 4-phase process
├── root-cause-tracing.md     # Investigation techniques
└── defense-in-depth.md       # Escalation rules
```

**Key rules to adopt:**
- No fixes without root cause investigation
- After 3 failed attempts, question architecture
- Document the investigation in the task file

#### 4.4 Add Brainstorm/Design Phase

Create `/sk:brainstorm` command for the pre-planning design exploration:

```
.claude/commands/sk/brainstorm.md
```

**Simplified flow (adapted from Superpowers' 9 steps):**
1. Explore context and constraints
2. Ask clarifying questions
3. Propose 2-3 approaches with tradeoffs
4. User selects approach
5. Write design brief in task file
6. Proceed to Plan

**Updated lifecycle:** `Brainstorm → Plan → Dev → Review → Test`

### Priority 2: Enhance (Strengthen Existing Patterns)

#### 4.5 Strengthen TDD Enforcement

Update `docs/conventions/testing.md` and `/sk:dev` command to enforce:

- RED-GREEN-REFACTOR cycle (not just "write tests")
- Anti-pattern detection (code before tests = delete and restart)
- Test verification at each subtask boundary, not just at the end

#### 4.6 Add Verification-Before-Completion Rule

Add to `/sk:test` and `/sk:dev` commands:

> "No completion claims without fresh verification evidence. You must run the actual tests and show the output — not just claim they pass."

This is a simple but high-impact behavioral rule.

#### 4.7 Add Git Worktree Support

Create `/sk:worktree` or integrate worktree setup into `/sk:dev`:

- Isolated workspace per feature branch
- Safety verification (gitignore checks)
- Dependency installation
- Baseline test run before starting work

#### 4.8 Add Session Start Hook

Create a hook that runs on session start to load project context:

```json
// .claude/settings.json
{
  "hooks": {
    "SessionStart": [{
      "command": "bash hooks/session-start.sh"
    }]
  }
}
```

The hook could display current task status, active branches, and pending work.

### Priority 3: Consider (Nice-to-Have)

#### 4.9 Parallel Agent Dispatching

For independent failures across unrelated subsystems, dispatch parallel debugging agents. Lower priority because it's a specialized use case.

#### 4.10 Model Selection Strategy

When dispatching subagents, use the cheapest model that can handle each role:
- Haiku for simple, well-defined implementation tasks
- Sonnet for review and moderate complexity
- Opus for architectural decisions and complex debugging

#### 4.11 Writing-Skills Meta-Skill

A skill for creating new skills using TDD applied to documentation. Useful as the skill library grows.

---

## 5. Implementation Roadmap

### Phase 1: Foundation (Skills Architecture)

**Goal:** Establish the skills system alongside existing commands.

| Task | Effort | Description |
|------|--------|-------------|
| Create `.claude/skills/` directory structure | XS | Directory setup |
| Create `using-skills` meta-skill | S | Teach agent to discover and invoke skills |
| Update `CLAUDE.md` to reference skills | XS | Add skills awareness |

### Phase 2: Core Skills

**Goal:** Add the three highest-impact skills.

| Task | Effort | Description |
|------|--------|-------------|
| Systematic debugging skill | M | 4-phase framework + root cause tracing |
| Code review skill + `/sk:review` | M | Reviewer agent + response rules |
| Brainstorm skill + `/sk:brainstorm` | M | Pre-planning design exploration |
| Verification-before-completion rule | S | Behavioral rule in dev/test commands |

### Phase 3: Subagent Orchestration

**Goal:** Enable subagent-driven development.

| Task | Effort | Description |
|------|--------|-------------|
| Subagent-driven development skill | L | Orchestration + 3 prompt templates |
| Integrate SDD with `/sk:dev` | M | Subtask → subagent dispatch |
| Two-stage review pipeline | M | Spec review → code quality review |

### Phase 4: Polish

**Goal:** Strengthen existing patterns and add tooling.

| Task | Effort | Description |
|------|--------|-------------|
| TDD enforcement in `/sk:dev` | S | Anti-patterns + RED-GREEN-REFACTOR |
| Git worktree support | S | Isolated workspace skill |
| Session start hook | S | Context loading on startup |
| Model selection strategy | S | Cost-optimized subagent dispatch |

---

## 6. Key Architectural Decisions

### Skills vs Commands

**Superpowers model:** Skills are behavioral rules that shape agent behavior across all tasks. They are composable and trigger automatically based on context.

**SK model:** Commands are procedural scripts that execute specific workflows when explicitly invoked.

**Recommendation:** Keep both. Commands remain the explicit workflow drivers (`/sk:plan`, `/sk:dev`, etc.). Skills become behavioral rules that commands invoke and that shape agent behavior between commands. Skills live in `.claude/skills/`, commands in `.claude/commands/sk/`.

### Fresh Context vs Accumulated Context

**Superpowers insight:** Fresh subagent context per task prevents pollution from earlier mistakes and assumptions.

**SK consideration:** Our subtasks are already designed to be self-contained (S complexity, single concern). This maps well to the fresh-context-per-subagent model.

### Review Placement in Lifecycle

**Current:** Plan → Dev → Test
**Proposed:** Plan → Dev → Review → Test
**Alternative:** Review after each subtask (within Dev phase)

**Recommendation:** Review after each subtask within Dev, plus a final review before Test. This catches issues early without adding a separate phase gate.

---

## 7. What NOT to Adopt

| Superpowers Feature | Why Skip |
|---|---|
| Multi-tool plugin system | We only use Claude Code |
| Visual companion (WebSocket browser tool) | Over-engineered for our needs |
| Deprecated commands layer | We already have a clean command system |
| Plan date-naming convention (`YYYY-MM-DD-feature.md`) | Our task naming (`TASK-name.md`) is better |
| Minimal documentation approach | Our structured docs system is superior |

---

## 8. Command-by-Command Enhancement Analysis

This section examines each of the 12 existing SK commands and identifies specific improvements inspired by Superpowers patterns.

### 8.1 `/sk:implement` — Full Lifecycle Command

**Current state:** Runs Plan → Dev → Test sequentially. Solid structure with exit gates between phases. User approval checkpoint after Plan.

**Gaps identified:**
- No brainstorm/design validation before Plan — jumps straight to acceptance criteria
- No code review gate between Dev and Test
- No subagent delegation — one agent accumulates context across all phases
- No verification enforcement — agent can claim tests pass without running them
- `[TEST]` subtasks are written *after* `[DEV]` subtasks, violating TDD

**Proposed enhancements:**

| Enhancement | Impact | What to Change |
|---|---|---|
| Add Brainstorm step before Plan | High | Insert Step 2.5: "For M+ complexity, propose 2-3 approaches with tradeoffs. Wait for user selection before breaking into subtasks." |
| Add Review gate after Dev | High | Insert Step 4.5: Dispatch code-reviewer subagent against the diff. Present findings. Fix critical issues before proceeding to Test. |
| Enforce verification evidence | High | In Step 5 (Test), add: "You MUST run `npm test` and include the actual output. Do not claim tests pass without showing evidence." |
| Interleave tests with code | Medium | Reorder subtask execution: for each feature unit, write test first (RED), then implement (GREEN), then refactor. Not all `[DEV]` then all `[TEST]`. |
| Add subagent dispatch option | Medium | For each subtask, optionally dispatch a fresh implementer subagent (prevents context pollution on long sessions). |
| Add worktree setup | Low | At start, offer to create a git worktree for isolated work. |

**Enhanced lifecycle:**
```
Brainstorm → Plan → [checkpoint] → Dev (TDD per subtask + review per subtask) → [checkpoint] → Test (with evidence) → Close
```

---

### 8.2 `/sk:plan` — PLAN Phase

**Current state:** Thorough 7-step process. Reads 6 context files, does deep codebase analysis (map, understand, approach), fills acceptance criteria, breaks into subtasks, resolves questions. Strong exit gate.

**Gaps identified:**
- No design validation — assumes the *first* approach found is correct
- No subagent review of the plan document
- Subtask granularity is "S complexity" but doesn't specify time estimates (Superpowers uses 2-5 min tasks)
- No explicit code examples in subtasks (Superpowers includes exact code snippets)

**Proposed enhancements:**

| Enhancement | Impact | What to Change |
|---|---|---|
| Add approach selection step | High | After Step 3c (Identify Technical Approach), add: "Propose 2-3 approaches with pros/cons. Present to user. Wait for selection before proceeding to Step 4." |
| Add plan review via subagent | Medium | After Step 5 (Validate Plan), dispatch a plan-reviewer subagent that checks: Are subtasks truly S complexity? Are acceptance criteria truly testable? Are file paths real? Max 2 review iterations. |
| Add code examples to subtasks | Medium | In Step 4 subtask breakdown, require each subtask to include a brief code example showing the expected pattern (from codebase analysis). |
| Add time estimates | Low | Tag each subtask with estimated duration (2-5 min for S complexity). Helps detect scope creep — if a subtask exceeds 10 min, it's not S complexity. |

**Skill to invoke:** `brainstorming` (for approach selection), `writing-plans` (for plan review loop).

---

### 8.3 `/sk:dev` — DEV Phase

**Current state:** Reads task + 6 context files. Validates readiness. Executes subtasks top-to-bottom with convention compliance check and documentation pass. Good error recovery guidance.

**Gaps identified:**
- **No TDD enforcement** — `[DEV]` subtasks come before `[TEST]` subtasks. Agent writes code first, tests second.
- **No per-subtask review** — Self-review is a checklist, not a subagent dispatch.
- **No fresh context per subtask** — One agent accumulates all context, leading to drift on long sessions.
- **No verification evidence** — "All existing tests still pass" is a checkbox, not a command to run.
- **No escalation rule** — If a subtask fails repeatedly, no guidance on when to step back.

**Proposed enhancements:**

| Enhancement | Impact | What to Change |
|---|---|---|
| Enforce TDD cycle | **Critical** | Rewrite Step 4 subtask execution: For each feature unit: (1) Write failing test, (2) Run test — confirm RED, (3) Write minimum code to pass, (4) Run test — confirm GREEN, (5) Refactor. Code written before tests must be deleted. |
| Add per-subtask subagent dispatch | High | For each subtask, optionally dispatch a fresh implementer subagent with: task description, file paths, conventions, and test requirements. Subagent reports status: DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED. |
| Add per-subtask review | High | After each subtask completes, dispatch spec-compliance reviewer (checks against acceptance criteria) then code-quality reviewer (checks conventions). Two-stage, sequential. |
| Require test execution evidence | High | Replace checkbox "All existing tests still pass" with: "Run `npm test` and include the full output. If any test fails, stop and investigate before proceeding." |
| Add escalation rule | Medium | Add to Error Recovery: "After 3 failed attempts to fix a subtask, STOP. Question whether the approach is correct. Consider: (a) the subtask is too large — break it down further, (b) the plan is wrong — return to PLAN, (c) a dependency is missing." |
| Add anti-pattern detection | Medium | Add explicit anti-patterns list: "Do NOT: skip tests for 'simple' code, write code before tests, keep code written before tests as reference, merge a subtask with failing tests, suppress test failures." |

**Skills to invoke:** `test-driven-development`, `subagent-driven-development`, `requesting-code-review`, `verification-before-completion`.

---

### 8.4 `/sk:test` — TEST Phase

**Current state:** Comprehensive 9-step verification process. Runs automated tests, verifies each AC, tests error paths, tests edge cases, regression check. Strong exit gate.

**Gaps identified:**
- **No fresh verification requirement** — Agent can reference earlier test runs instead of running tests now.
- **No distinction between "test code was written" and "tests actually pass right now"** — Step 2 checks that `[TEST]` subtasks are checked off (code exists), but doesn't require re-running.
- **Error path and edge case tables are manual** — Agent fills them in, but no enforcement that it actually executed the scenarios.

**Proposed enhancements:**

| Enhancement | Impact | What to Change |
|---|---|---|
| Require fresh test execution | **Critical** | Add iron law at top: "NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE. You must run the actual test commands in this session and show their output. Referencing earlier runs is not acceptable." |
| Require command output in verification | High | In Step 4, change "Execute the test scenario" to "Run the specific test command and paste the output. Show the actual assertion results, not a summary." |
| Add automated AC verification | Medium | For each AC, require a specific test command or curl/API call that proves the criterion is met. Record the actual output, not "it works." |
| Add regression baseline | Low | At start of TEST phase, run full test suite and record pass count. At end, re-run and confirm same or higher count. |

**Skill to invoke:** `verification-before-completion`.

---

### 8.5 `/sk:new-task` — Create Task

**Current state:** Thorough 7-step process. Reads 8 context files including a worked example. Gathers info, analyzes scope, creates task file, updates board. Strong validation checklist.

**Gaps identified:**
- No design exploration before committing to an approach
- Subtasks are ordered `[DEV]` first, `[TEST]` second — bakes in code-first, test-second
- No review checkpoint for the task document itself

**Proposed enhancements:**

| Enhancement | Impact | What to Change |
|---|---|---|
| Add approach exploration | Medium | In Step 4 (Analyze Scope), add: "Identify 2-3 possible approaches. Document pros/cons in the task file. Mark the selected approach." |
| Interleave test subtasks | Medium | Change the standard decomposition pattern to pair each `[DEV]` with its `[TEST]`: ST-1 `[TEST]` Write test for model, ST-2 `[DEV]` Implement model, ST-3 `[TEST]` Write test for service, ST-4 `[DEV]` Implement service... |
| Add task review subagent | Low | After creating the task file, dispatch a plan-reviewer subagent to check: Are ACs testable? Are subtasks truly S complexity? Are file paths real? |

---

### 8.6 `/sk:new-epic` — Create Epic

**Current state:** Strong 9-step process with deep analysis, decomposition strategies, dependency graph, and Mermaid diagrams. Well-structured.

**Gaps identified:**
- No brainstorming phase — goes straight to decomposition
- No risk mitigation planning
- No spike/prototype task for uncertain areas

**Proposed enhancements:**

| Enhancement | Impact | What to Change |
|---|---|---|
| Add brainstorm before decomposition | High | Insert after Step 2: "For L/XL scope, run a structured brainstorm. Explore 2-3 architectural approaches. Validate with user before decomposing." |
| Add spike task for unknowns | Medium | In Step 5 (Decompose), add: "If any area has significant uncertainty, create Task 0 as a time-boxed spike/prototype. Its only deliverable is a decision on approach." |
| Add risk register | Medium | Add to epic template: "Risk Register" table with Risk / Likelihood / Impact / Mitigation columns. |
| Add cross-task review points | Low | In the dependency graph, mark review checkpoints: "After Task 2 completes, review architecture decisions before proceeding to Task 3." |

**Skill to invoke:** `brainstorming`.

---

### 8.7 `/sk:task-status` — Task Board

**Current state:** Scans all task files, detects staleness, presents dashboard with status grouping, syncs README, suggests next action. Effective.

**Gaps identified:**
- No per-task health metrics (test pass rate, review status)
- No active subagent status tracking
- No burndown or velocity view

**Proposed enhancements:**

| Enhancement | Impact | What to Change |
|---|---|---|
| Add health indicators | Medium | For in-progress tasks, show: test pass/fail count, subtask completion %, days in current phase. |
| Add active work context | Medium | Show current git branch, uncommitted changes, and last commit related to each task. |
| Add next-action-per-task | Low | For each non-done task, show the specific next action: "Resolve open question #2", "Fix failing test in ST-4", "Run `/sk:test`". |

---

### 8.8 `/sk:new-sop` — Create SOP

**Current state:** Well-designed. Gathers procedure info, analyzes by reading actual code, writes executable steps with verification, rollback, and pitfalls. Validation checklist ensures quality.

**Gaps identified:**
- No testing of the SOP (does it actually work when followed?)
- No versioning or review cycle

**Proposed enhancements:**

| Enhancement | Impact | What to Change |
|---|---|---|
| Add SOP dry-run | Medium | After creating the SOP, dispatch a subagent to follow the steps literally. If any step is ambiguous or fails, refine the SOP. This is Superpowers' "TDD for documentation" concept. |
| Add SOP as skill | Low | For critical SOPs (database migration, deployment), create a corresponding skill that auto-triggers when the agent detects the relevant context. |

---

### 8.9 `/sk:new-adr` — Create ADR

**Current state:** Good process — reads existing decisions, gathers options, researches pros/cons, creates ADR, handles superseding. Solid.

**Gaps identified:**
- No structured evaluation framework (just pros/cons)
- No link to task that triggered the decision

**Proposed enhancements:**

| Enhancement | Impact | What to Change |
|---|---|---|
| Add evaluation matrix | Low | For significant decisions, add a weighted criteria matrix: Criterion / Weight / Option A score / Option B score. Makes the decision more defensible. |
| Link to triggering task | Low | Add "Triggered by:" field linking to the task/epic that required this decision. |

---

### 8.10 `/sk:new-flow` — Create Flow Diagram

**Current state:** Excellent — traces actual code paths (not guesses), uses Grep/Read to follow execution, includes error paths, adds step-by-step explanation. Strong validation.

**Gaps identified:**
- Minimal — this command is well-designed
- Could add automated diagram validation

**Proposed enhancements:**

| Enhancement | Impact | What to Change |
|---|---|---|
| Add Mermaid syntax validation | Low | After creating the diagram, run Mermaid CLI (if available) to validate syntax renders correctly. |
| Add "trace from test" option | Low | Allow creating a flow diagram by tracing a test execution path, showing exactly what code runs for a given test case. |

---

### 8.11 `/sk:update-docs` — Sync Documentation

**Current state:** Comprehensive 8-step process. Reads all docs, scans codebase (git, structure, deps, APIs, schemas), identifies gaps by priority, applies updates, generates report. Very thorough.

**Gaps identified:**
- No automated drift detection (relies on manual scan)
- No skill/agent update tracking

**Proposed enhancements:**

| Enhancement | Impact | What to Change |
|---|---|---|
| Add skills inventory | Medium | When skills are added to the project, include `.claude/skills/` in the scan. Report on skills without corresponding documentation or with stale trigger conditions. |
| Add convention compliance scan | Medium | Beyond just checking docs match code, check that code actually follows the documented conventions. Use Grep to find violations. Report as "Convention drift." |
| Add hook as automation | Low | Create a session-start hook that runs a lightweight version of update-docs (check `last_updated` dates, flag >30 days stale). Present warnings at session start. |

---

### 8.12 `/sk:init-docs` — Bootstrap Documentation

**Current state:** Full project bootstrapping — scans project type, structure, dependencies, patterns. Creates 17+ documentation files. Generates initial ADRs and starter SOPs. Very complete.

**Gaps identified:**
- Doesn't set up skills infrastructure
- Doesn't create session hooks
- Doesn't configure agents

**Proposed enhancements:**

| Enhancement | Impact | What to Change |
|---|---|---|
| Bootstrap skills directory | High | Add Step 2.5: Create `.claude/skills/` with core skills (using-skills meta-skill, TDD, debugging, verification, code-review). |
| Bootstrap agents directory | Medium | Add Step 2.6: Create `.claude/agents/` with code-reviewer agent definition. |
| Bootstrap session hook | Medium | Add Step 2.7: Create hooks/session-start script that displays task status and recent changes. |
| Create `.claude/settings.json` | Low | Configure default hook, permissions, and model preferences. |

---

## 9. New Commands to Add

Based on the analysis, these new commands fill critical workflow gaps:

### 9.1 `/sk:brainstorm` — Design Exploration

**Purpose:** Structured design exploration before planning. Validates the *approach* before committing to a plan.

**When to use:** Before `/sk:plan` for M+ complexity work, or when the right approach isn't obvious.

**Flow:**
1. Read codebase context and constraints
2. Ask clarifying questions (one at a time, multiple choice preferred)
3. Propose 2-3 approaches with tradeoffs table
4. User selects approach
5. Write design brief in task file (or create new task)
6. Optionally: dispatch spec-reviewer subagent to validate the design
7. Transition to `/sk:plan`

---

### 9.2 `/sk:review` — Code Review

**Purpose:** Automated code review via subagent dispatch.

**When to use:** After `/sk:dev` completes, before `/sk:test`. Also available on-demand.

**Flow:**
1. Identify changes (git diff against base branch)
2. Read the task file for acceptance criteria and plan
3. Dispatch code-reviewer subagent with: diff, task context, conventions
4. Reviewer checks: plan alignment, code quality, convention compliance, test coverage
5. Categorize issues: Critical (must fix) / Important (should fix) / Suggestions (consider)
6. Present findings to user
7. Fix critical issues before proceeding

**Review response rules (from Superpowers):**
- Verify reviewer claims before implementing changes
- Push back with technical reasoning if reviewer is wrong
- No performative agreement ("You're absolutely right!")
- Test each fix individually, not in batch

---

### 9.3 `/sk:debug` — Systematic Debugging

**Purpose:** Structured debugging with root cause investigation.

**When to use:** When a bug is reported or tests fail unexpectedly.

**Flow:**
1. **Reproduce:** Confirm the bug exists and is reproducible
2. **Investigate:** Trace data flow from input to failure point
3. **Hypothesize:** Form 2-3 hypotheses about root cause
4. **Test hypotheses:** Design minimal experiments to confirm/deny each
5. **Fix:** Implement fix for confirmed root cause
6. **Verify:** Run tests, confirm fix, check for regressions
7. **Document:** Add to task file or create new ADR if architectural

**Iron laws:**
- NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
- After 3 failed fix attempts, question the architecture
- Document the investigation even if the fix is trivial

---

### 9.4 `/sk:finish` — Branch Completion

**Purpose:** Structured end-of-work flow for a feature branch.

**When to use:** After `/sk:test` passes, to finalize the work.

**Flow:**
1. Verify all tests pass (fresh run, show evidence)
2. Verify task status is `done`
3. Present 4 options: (a) Merge locally to main, (b) Create PR, (c) Keep branch as-is, (d) Discard
4. Execute selected option
5. Clean up worktree if applicable
6. Update task board

---

## 10. Skills Architecture for SK

### How Skills Differ from Commands

| Aspect | Commands (`/sk:*`) | Skills (`.claude/skills/`) |
|---|---|---|
| **Invocation** | Explicit — user runs `/sk:plan` | Implicit — triggered by context |
| **Scope** | Full workflow for a phase | Single behavioral rule |
| **Composability** | Sequential (Plan → Dev → Test) | Layered (multiple skills active simultaneously) |
| **Purpose** | "What to do" | "How to behave while doing it" |

### Proposed Skills Library

```
.claude/skills/
├── using-skills/
│   └── SKILL.md                         # Meta-skill: how to discover and invoke skills
├── test-driven-development/
│   ├── SKILL.md                         # RED-GREEN-REFACTOR enforcement
│   └── anti-patterns.md                 # What NOT to do
├── systematic-debugging/
│   ├── SKILL.md                         # 4-phase investigation process
│   ├── root-cause-tracing.md            # Investigation techniques
│   └── escalation-rules.md             # When to step back
├── subagent-driven-development/
│   ├── SKILL.md                         # Orchestration rules
│   ├── implementer-prompt.md            # Fresh-context implementer
│   ├── spec-reviewer-prompt.md          # Spec compliance checker
│   └── code-quality-reviewer-prompt.md  # Quality checker
├── code-review/
│   ├── SKILL.md                         # When and how to review
│   ├── reviewer-prompt.md               # Review criteria
│   └── response-rules.md               # How to handle feedback
├── verification-before-completion/
│   └── SKILL.md                         # "No claims without evidence"
├── brainstorming/
│   ├── SKILL.md                         # Structured design exploration
│   └── spec-reviewer-prompt.md          # Design spec validation
└── git-worktrees/
    └── SKILL.md                         # Isolated workspace management
```

### Skill Priority Rules

Adapted from Superpowers:

1. **User instructions** always override skills
2. **Process skills** (brainstorming, debugging) before implementation skills
3. **Safety skills** (verification, TDD) cannot be skipped
4. Skills are invoked BEFORE any action, even with low probability of relevance
5. When multiple skills apply, invoke in order: safety → process → implementation

### Integration with Existing Commands

Skills don't replace commands — they enhance them:

```
/sk:plan invokes:
  └── brainstorming skill (if approach unclear)
  └── writing-plans skill (plan review loop)

/sk:dev invokes:
  └── test-driven-development skill (per subtask)
  └── subagent-driven-development skill (fresh context per subtask)
  └── code-review skill (per subtask completion)
  └── verification-before-completion skill (exit gate)

/sk:test invokes:
  └── verification-before-completion skill (fresh evidence required)

/sk:debug invokes:
  └── systematic-debugging skill (4-phase process)
  └── verification-before-completion skill (fix verification)
```

---

## 11. Summary of All Changes

### New Commands (4)

| Command | Purpose | Priority |
|---|---|---|
| `/sk:brainstorm` | Design exploration before planning | P1 |
| `/sk:review` | Automated code review via subagent | P1 |
| `/sk:debug` | Systematic debugging framework | P1 |
| `/sk:finish` | Branch completion workflow | P2 |

### Enhanced Commands (8 of 12 existing)

| Command | Key Enhancement | Priority |
|---|---|---|
| `/sk:implement` | Add brainstorm + review gates, TDD enforcement | P1 |
| `/sk:plan` | Add approach selection, plan review subagent | P1 |
| `/sk:dev` | TDD cycle, per-subtask review, verification evidence, escalation rule | **P0** |
| `/sk:test` | Fresh verification evidence requirement | **P0** |
| `/sk:new-task` | Interleave test/dev subtasks, approach exploration | P2 |
| `/sk:new-epic` | Add brainstorm phase, spike tasks, risk register | P2 |
| `/sk:init-docs` | Bootstrap skills, agents, hooks | P2 |
| `/sk:update-docs` | Add skills inventory, convention compliance scan | P3 |

### Unchanged Commands (4 of 12)

| Command | Reason |
|---|---|
| `/sk:task-status` | Already effective; enhancements are nice-to-have |
| `/sk:new-sop` | Well-designed; SOP dry-run is nice-to-have |
| `/sk:new-adr` | Solid process; evaluation matrix is nice-to-have |
| `/sk:new-flow` | Excellent as-is; minimal gaps |

### New Skills (8)

| Skill | Type | Priority |
|---|---|---|
| `using-skills` | Meta | P1 (enables all others) |
| `verification-before-completion` | Safety | P0 |
| `test-driven-development` | Safety | P0 |
| `systematic-debugging` | Process | P1 |
| `code-review` | Process | P1 |
| `brainstorming` | Process | P1 |
| `subagent-driven-development` | Implementation | P2 |
| `git-worktrees` | Implementation | P3 |

### New Agent (1)

| Agent | Purpose | Priority |
|---|---|---|
| `code-reviewer` | Reviews code against plan, conventions, quality standards | P1 |

---

## 12. Conclusion

Superpowers and SK are complementary systems. SK excels at **documentation, structure, and project management**. Superpowers excels at **agent orchestration, quality enforcement, and behavioral rules**.

### Immediate Wins (P0 — do first)

1. **Verification enforcement** in `/sk:dev` and `/sk:test` — "No completion claims without fresh test output." One-line behavioral rule, massive impact on reliability.
2. **TDD enforcement** in `/sk:dev` — RED-GREEN-REFACTOR per subtask. Prevents the most common agent failure mode (code-first, tests-never).

### High-Impact Additions (P1)

3. **Systematic debugging** (`/sk:debug`) — root cause before fixes, escalation rules
4. **Code review automation** (`/sk:review`) — subagent-powered quality gate between Dev and Test
5. **Brainstorm phase** (`/sk:brainstorm`) — validate approach before committing to plan
6. **Skills architecture** — behavioral rules that compose with commands, not replace them

### Medium-Term (P2-P3)

7. **Subagent-driven development** — fresh context per subtask, two-stage review pipeline
8. **Enhanced `/sk:init-docs`** — bootstrap skills, agents, and hooks alongside documentation
9. **Git worktree support** — isolated workspaces for feature branches

### The Big Picture

The current SK system answers **"what work to do and how to track it."** The enhancements from Superpowers answer **"how to do the work well."** Together, they create a full autonomous development platform:

- **SK provides the structure:** lifecycle, documentation, task management, templates, SOPs
- **Superpowers patterns provide the discipline:** TDD, root-cause debugging, verification evidence, code review, design validation, fresh-context execution

The result: an agent that not only follows a process, but follows it *rigorously* — catching its own mistakes before the user has to.
