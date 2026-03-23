# Implementation Plan: SK v2 Enhancement

**Date:** 2026-03-22
**Scope:** 5 skills, 3 agents, 1 new command, 8 command enhancements, 2 new doc categories, 2 new templates, doc index updates

**Approach:** 5 waves, each independently shippable. Each wave is a single commit/PR. Later waves depend on earlier ones but each wave delivers standalone value.

---

## Total Inventory

| Type | Create | Update | Total Files |
|---|---|---|---|
| Skills | 6 new files | — | 6 |
| Agents | 3 new files | — | 3 |
| Commands | 1 new file | 8 existing files | 9 |
| Doc directories | 2 new READMEs | — | 2 |
| Templates | 2 new files | — | 2 |
| Doc indexes | — | 2 existing files | 2 |
| Project config | — | 1 (CLAUDE.md) | 1 |
| **Total** | **14 new** | **11 updates** | **25 files** |

---

## Wave 1: Safety Skills + Command Integration

**Goal:** Every `/sk:dev`, `/sk:test`, `/sk:implement`, `/sk:refactor`, and `/sk:debug` run immediately gets TDD enforcement, escalation protection, and verified evidence.

**Effort:** S-M
**Dependencies:** None
**Breaking changes:** None — additive only

### 1.1 Create: `.claude/skills/verification-before-completion/SKILL.md`

```markdown
---
description: "No completion claims without fresh verification evidence"
---
```

**Content must include:**
- Iron law statement: "NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE"
- When active: exit gates of /sk:dev, /sk:test, /sk:implement, /sk:refactor, /sk:debug
- Rules:
  - Must run actual test/check command in THIS session
  - Must paste raw output (not summarize)
  - Banned phrases: "It works", "Tests pass", "Looks good", "Verified", "Confirmed"
  - Show what acceptable evidence looks like (actual command + output block)
- Brownfield adaptation:
  - If no test command: manual verification with specific evidence (curl output, etc.)
  - If flaky tests: record baseline count, verify no INCREASE in failures
  - If no tests at all: first task SHOULD set up test runner

### 1.2 Create: `.claude/skills/test-driven-development/SKILL.md`

```markdown
---
description: "RED-GREEN-REFACTOR enforcement for all code writing"
---
```

**Content must include:**
- Iron law: "NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST"
- The cycle:
  1. RED: Write failing test → run → confirm FAILURE (show output)
  2. GREEN: Write minimum code to pass → run → confirm PASS (show output)
  3. REFACTOR: Clean up → run → confirm still PASS (show output)
- When active: during subtask execution in /sk:dev and /sk:implement
- How it reorders subtasks: [TEST] before [DEV] for each feature unit pair
- Brownfield adaptation:
  - New code: strict TDD (test first, always)
  - Modifying existing untested code: characterization test first → modify test → fail → implement → pass
  - Fixing bugs in untested code: write reproducing test (must fail) → fix → pass
  - No test infrastructure: first subtask = "set up test runner"
- Link to anti-patterns file

### 1.3 Create: `.claude/skills/test-driven-development/anti-patterns.md`

**Content must include:**
- "Too simple to test" → Everything gets a test. If it's truly trivial, the test is trivial too.
- "I'll write the test after" → No. Write it now. If you wrote code first, delete the code and start over.
- "Let me just get it working first" → No. The test IS how you get it working.
- "I'll keep the code I wrote as reference" → No. Delete it. Write the test. Rewrite from scratch.
- Testing implementation details instead of behavior
- Mocking everything (testing mocks, not code)
- Tests that always pass (no real assertions)

### 1.4 Create: `.claude/skills/escalation-rules/SKILL.md`

```markdown
---
description: "After 3 failed attempts, stop and rethink approach"
---
```

**Content must include:**
- Rule: After 3 failed attempts on the same subtask or issue, STOP
- Do NOT try a 4th approach. Instead evaluate:
  - (a) Is the subtask too large? → Break it down further
  - (b) Is the plan wrong? → Return to /sk:plan
  - (c) Is the approach wrong? → Return to /sk:brainstorm
  - (d) Is this a deeper bug? → Switch to /sk:debug
- Present options to user, let them decide
- Brownfield additions:
  - (e) Is there undocumented behavior you're breaking? → Write characterization tests first
  - (f) Is there hidden coupling? → Map dependencies before continuing
  - (g) Is existing code too tangled? → Consider /sk:refactor first
  - (h) Is the codebase in worse shape than the plan assumed? → Return to /sk:plan, add prerequisite subtasks

### 1.5 Update: `.claude/commands/sk/dev.md`

**Insert after Step 1 (Read Context), before Step 2:**

```markdown
## Step 1.5: Read Active Skills

Read these skill files — their rules are active throughout this phase:
1. `.claude/skills/test-driven-development/SKILL.md` — TDD cycle for subtask execution
2. `.claude/skills/test-driven-development/anti-patterns.md` — What never to do
3. `.claude/skills/escalation-rules/SKILL.md` — When to stop and rethink
```

**Modify Step 4 (Execute Subtasks):**

Add before the existing "For Each [DEV] Subtask" section:

```markdown
### Subtask Execution Order (TDD)

Follow the test-driven-development skill. For each feature unit, execute the [TEST] subtask BEFORE its paired [DEV] subtask:

1. [TEST] Write failing test → run → confirm RED
2. [DEV] Implement to pass → run → confirm GREEN
3. Refactor → run → confirm still GREEN

If a subtask fails 3+ times, follow the escalation-rules skill: STOP, evaluate options, ask the user.
```

**Modify Step 8 (DEV Exit Gate):**

Add before the checklist:

```markdown
Follow the verification-before-completion skill. Read `.claude/skills/verification-before-completion/SKILL.md`.

You MUST run the actual test suite and paste the output below. Do not summarize or paraphrase.
```

### 1.6 Update: `.claude/commands/sk/test.md`

**Insert after Step 1 (Read Context):**

```markdown
## Step 1.5: Read Active Skills

Read this skill file — its rules are active throughout this phase:
1. `.claude/skills/verification-before-completion/SKILL.md` — Evidence requirements
```

**Modify Step 3 (Run Automated Tests):**

Add emphasis:

```markdown
**IMPORTANT:** Paste the ACTUAL command output below. Per the verification-before-completion skill, "All tests pass" without output is not acceptable evidence.
```

**Modify Step 4 (Verify Acceptance Criteria):**

Add before the per-criterion section:

```markdown
Per the verification-before-completion skill: for each AC, run the specific test or command and paste the output. Do not write "verified" without showing what you ran and what it returned.
```

### 1.7 Update: `.claude/commands/sk/implement.md`

**Insert after Step 1 (Read Context):**

```markdown
## Step 1.5: Read Active Skills

Read these skill files — their rules are active during DEV and TEST phases:
1. `.claude/skills/test-driven-development/SKILL.md` — TDD cycle for DEV phase
2. `.claude/skills/test-driven-development/anti-patterns.md` — What never to do
3. `.claude/skills/escalation-rules/SKILL.md` — When to stop and rethink
4. `.claude/skills/verification-before-completion/SKILL.md` — Evidence for exit gates
```

**Modify Step 4 (DEV Phase):**

Add at top of section:

```markdown
**Skills active:** test-driven-development (subtask execution), escalation-rules (failure handling), verification-before-completion (exit gate).

Execute [TEST]+[DEV] subtask pairs using the TDD cycle: RED → GREEN → REFACTOR.
```

**Modify Step 5 (TEST Phase):**

Add at top of section:

```markdown
**Skills active:** verification-before-completion (AC verification).

Paste actual test output for every verification claim.
```

### 1.8 Update: `.claude/commands/sk/refactor.md`

**Modify Step 7 (Verify):**

Add at top of section:

```markdown
Read `.claude/skills/verification-before-completion/SKILL.md` before claiming verification.

You MUST paste the actual test suite output and compare to the baseline from Step 4.
```

**Modify Step 6 (Execute):**

Add at end of "Rules During Execution":

```markdown
- **If a refactoring step fails 3 times** — follow `.claude/skills/escalation-rules/SKILL.md`: stop, evaluate whether the approach is correct, ask the user.
```

### 1.9 Update: `.claude/commands/sk/debug.md`

**Modify Step 8 (Verify):**

Add at top of Step 8:

```markdown
Read `.claude/skills/verification-before-completion/SKILL.md` before claiming the fix works.

You MUST paste the actual test output showing the regression test passes and the full suite has no new failures.
```

**Modify Step 5 (Isolate):**

Add at end of section:

```markdown
If your hypothesis is wrong 3 times, follow `.claude/skills/escalation-rules/SKILL.md`: stop fixing and question whether the architecture or design is the problem.
```

### Wave 1 Verification

After implementing:
- [ ] `.claude/skills/verification-before-completion/SKILL.md` exists and includes iron law + brownfield rules
- [ ] `.claude/skills/test-driven-development/SKILL.md` exists and includes TDD cycle + brownfield adaptations
- [ ] `.claude/skills/test-driven-development/anti-patterns.md` exists
- [ ] `.claude/skills/escalation-rules/SKILL.md` exists and includes brownfield additions
- [ ] `dev.md` references all 3 skills at specific steps
- [ ] `test.md` references verification skill
- [ ] `implement.md` references all skills in DEV and TEST phases
- [ ] `refactor.md` references verification + escalation skills
- [ ] `debug.md` references verification + escalation skills
- [ ] All skill files include brownfield adaptation sections
- [ ] No existing command behavior is broken (skills are additive)

---

## Wave 2: Documentation Structure

**Goal:** Review output and research findings persist across sessions. New doc categories and templates established.

**Effort:** S
**Dependencies:** None (can run in parallel with Wave 1)
**Breaking changes:** None

### 2.1 Create: `docs/reviews/README.md`

```markdown
# Review Reports

> Persistent records of code, security, performance, UI, and dependency reviews.

## Purpose

Review commands (/sk:code-review, /sk:security-review, etc.) produce actionable
findings. This directory persists those findings so they can be tracked over time.

## Structure

| Directory | Command | What's Tracked |
|-----------|---------|----------------|
| [code/](./code/) | /sk:code-review | Code quality findings |
| [security/](./security/) | /sk:security-review | OWASP, secrets, CVEs |
| [performance/](./performance/) | /sk:perf-review | Bottlenecks, caching |
| [ui/](./ui/) | /sk:ui-review | A11y, responsive, UX |
| [deps/](./deps/) | /sk:deps | Vulnerabilities, outdated |

## Finding Status Values

- ⬜ Open — not yet addressed
- 🔄 In Progress — task created, work underway
- ✅ Fixed — resolved with reference to task/commit
- ⏭️ Deferred — acknowledged, intentionally delayed
```

### 2.2 Create: `docs/research/README.md`

```markdown
# Research

> Brainstorm findings, library evaluations, and debug investigation traces.

## Purpose

When /sk:brainstorm does web research or /sk:debug traces a complex root cause,
the reasoning is valuable but gets lost after the session. This directory preserves
reusable knowledge.

## When to Save

- /sk:brainstorm — save when web research was performed (library comparisons, pattern analysis)
- /sk:debug — save investigation trace for M+ complexity bugs
- NOT every brainstorm or debug — only when substantial research happened

## Naming

`YYYY-MM-DD-{topic}.md` (e.g., `2026-03-22-csv-export-libraries.md`)
```

### 2.3 Create: `docs/templates/review-report.md`

```markdown
---
type: review
category: "{code|security|performance|ui|deps}"
date: YYYY-MM-DD
scope: "{full codebase|branch diff|specific area}"
command: "/sk:{command-name}"
status: "{N open / M resolved}"
---

# {Category} Review — YYYY-MM-DD

## Scope

<!-- What was reviewed: full codebase, branch diff, specific files -->

## Findings

### Critical

| # | Category | Location | Finding | Status |
|---|----------|----------|---------|--------|
| — | — | — | — | ⬜ Open |

### Warning

| # | Category | Location | Finding | Status |
|---|----------|----------|---------|--------|
| — | — | — | — | ⬜ Open |

### Suggestion

| # | Category | Location | Finding | Status |
|---|----------|----------|---------|--------|
| — | — | — | — | ⬜ Open |

## Verdict

<!-- APPROVE / REQUEST CHANGES / NEEDS DISCUSSION -->

## Follow-up

<!-- Tasks created from findings, next review date recommendation -->
```

### 2.4 Create: `docs/templates/research-doc.md`

```markdown
---
type: research
trigger: "/sk:{brainstorm|debug} for {task/epic reference}"
date: YYYY-MM-DD
---

# Research: {Topic}

## Context

<!-- What prompted this research? What question are we answering? -->

## Findings

<!-- Key findings from web research, codebase analysis, or investigation -->

## Decision

<!-- What was decided based on this research? Link to ADR if applicable. -->
```

### 2.5 Create directories

```bash
mkdir -p docs/reviews/code docs/reviews/security docs/reviews/performance docs/reviews/ui docs/reviews/deps
mkdir -p docs/research
```

### 2.6 Update: `docs/README.md`

Add to the Quick Navigation table:

```markdown
| [Reviews](./reviews/) | Code, security, perf, UI review reports | After running review commands |
| [Research](./research/) | Brainstorm findings, debug investigations | After brainstorm or complex debug |
```

Add to the directory tree in "How This System Works":

```markdown
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
```

Add to the Maintenance Rules table:

```markdown
| Review command run | Save report to `reviews/{category}/` if findings are actionable |
| Brainstorm with research | Save findings to `research/` for future reference |
| Complex debug (M+) | Save investigation trace to `research/` |
```

### 2.7 Update: 7 review/research commands (add "Save?" step)

Each command gets a final step added:

**`code-review.md`** — add after Step 6 (Verdict):

```markdown
## Step 7: Persist Report (Optional)

Ask: **"Save this review report to `docs/reviews/code/YYYY-MM-DD-{scope}.md`?"**

If yes, save using the template from `docs/templates/review-report.md`. Add the review to `docs/reviews/README.md` index.
```

**`security-review.md`** — add after Step 6 (Remediation Plan):

```markdown
## Step 7: Persist Report (Optional)

Ask: **"Save this security review to `docs/reviews/security/YYYY-MM-DD-{scope}.md`?"**

If yes, save using the template. For Critical/High findings, suggest creating tasks: **"Create tasks for the N critical/high findings?"**
```

**`perf-review.md`** — add after Step 10 (Performance Summary):

```markdown
## Step 11: Persist Report (Optional)

Ask: **"Save this performance review to `docs/reviews/performance/YYYY-MM-DD-{scope}.md`?"**

If yes, save using the template.
```

**`ui-review.md`** — add after Step 9 (Accessibility Compliance Estimate):

```markdown
## Step 10: Persist Report (Optional)

Ask: **"Save this UI review to `docs/reviews/ui/YYYY-MM-DD-{scope}.md`?"**

If yes, save using the template.
```

**`deps.md`** — add after Step 10 (Dependency Health Summary):

```markdown
## Step 11: Persist Report (Optional)

Ask: **"Save this dependency report to `docs/reviews/deps/YYYY-MM-DD-audit.md`?"**

If yes, save using the template.
```

**`brainstorm.md`** — add after Step 5 (Structure into Epic + Tasks), before Step 6 (Summary):

```markdown
## Step 5.5: Save Research (Optional — only if Step 3 research was done)

If web research was performed in Step 3, ask: **"Save research findings to `docs/research/YYYY-MM-DD-{topic}.md`?"**

If yes, save using the template from `docs/templates/research-doc.md`. Include:
- Search queries used
- Key findings from each source
- Comparison tables (if evaluating options)
- Decision and reasoning
```

**`debug.md`** — add to Step 9 (Close Out), after the Documentation section:

```markdown
### Save Investigation (Optional — only for M+ complexity)

If the investigation was substantial (multiple hypotheses tested, complex root cause), ask: **"Save investigation trace to `docs/research/YYYY-MM-DD-{bug-name}.md`?"**

If yes, save: symptom, hypotheses tested, root cause found, fix applied.
```

### Wave 2 Verification

- [ ] `docs/reviews/README.md` exists with structure description
- [ ] `docs/reviews/{code,security,performance,ui,deps}/` directories exist
- [ ] `docs/research/README.md` exists
- [ ] `docs/templates/review-report.md` exists with frontmatter + tables
- [ ] `docs/templates/research-doc.md` exists
- [ ] `docs/README.md` updated with Reviews and Research rows
- [ ] 7 commands updated with "Save?" step
- [ ] No existing behavior changed — save is always optional (ask user)

---

## Wave 3: Finish Command

**Goal:** Clean end-of-work flow that chains review + commit + task update + cleanup.

**Effort:** S
**Dependencies:** Wave 1 (references verification skill)
**Breaking changes:** None

### 3.1 Create: `.claude/commands/sk/finish.md`

```markdown
---
description: Finish feature work — review, commit, push, PR, update task board (project)
---

# Finish — Ship Completed Work

Chain code review + commit + push + PR + task board update into one flow.

**Use when:** Feature work is done (all tests pass, all ACs verified), ready to ship.
**Use /sk:commit instead when:** You just want the git part without review or task board updates.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `.claude/skills/verification-before-completion/SKILL.md` — Evidence requirements
2. `docs/system/project-context.md` — Dense project summary (if it exists)
3. `docs/conventions/git-workflow.md` — Commit and PR conventions

## Step 2: Identify What to Finish

1. Check current branch: `git branch --show-current`
2. Find the associated task file:
   - Search `docs/tasks/TASK-*.md` for tasks with `status: done` or `status: testing`
   - If no task file: this is XS/S work, skip task board steps
3. Verify readiness:
   - All acceptance criteria verified (with evidence)?
   - All tests pass?
   - If not: suggest running `/sk:test` first

## Step 3: Final Code Review

Run `/sk:code-review` on the branch diff:

1. `git diff main...HEAD` (or base branch)
2. Analyze across all 5 categories (correctness, conventions, performance, maintainability, testing)
3. Present findings with verdict

**If Critical issues found:** Fix them before proceeding. Return to Step 3.
**If only Warnings/Suggestions:** Note them, proceed (user can decide to fix or defer).
**If APPROVE:** Continue.

Optionally save review: ask **"Save review report to `docs/reviews/code/`?"**

## Step 4: Commit and Ship

Run `/sk:commit` flow:

1. Stage changes
2. Generate conventional commit message from diff
3. Present for approval
4. Commit
5. Ask: **Push to remote?**
6. If yes: push with upstream tracking
7. Ask: **Create pull request?**
8. If yes: generate PR title + body from commits, create via `gh pr create`

## Step 5: Update Task Board

If a task file was identified in Step 2:

1. Update task YAML frontmatter: `phase: done`, `status: done`, update `updated` date
2. Update `docs/tasks/README.md`: move task to "Recently Completed"
3. Add final Progress Log entry:
   ```markdown
   | YYYY-MM-DD | DONE | Shipped via {commit hash / PR #N} |
   ```
4. If task is part of an epic: update epic progress count

## Step 6: Clean Up (if applicable)

If working in a git worktree:
1. Switch back to main worktree
2. Remove the feature worktree: `git worktree remove {path}`
3. Delete the branch if merged: `git branch -d {branch}`

## Step 7: Summary

Present to user:
- Commit: {hash} {message}
- Branch: {pushed to remote?}
- PR: {URL if created}
- Task: {updated to done, or "no task file"}
- Review: {verdict summary}
- Follow-up: {deferred warnings/suggestions, if any}
```

### 3.2 Update: `CLAUDE.md`

Add `/sk:finish` to the command table:

```markdown
| `/sk:finish` | Review + commit + push + PR + task update | After work is done, ready to ship |
```

Add to Command Prerequisites table:

```markdown
| /sk:finish | Tests passing, git-workflow.md populated |
```

### Wave 3 Verification

- [ ] `.claude/commands/sk/finish.md` exists with full flow
- [ ] `CLAUDE.md` lists `/sk:finish` in command table and prerequisites
- [ ] Running `/sk:finish` would: review diff → commit → push → PR → update task → cleanup
- [ ] References verification skill from Wave 1

---

## Wave 4: Subagent Orchestration

**Goal:** Enable fresh-context subagent dispatch for large tasks. Opt-in, not forced.

**Effort:** M
**Dependencies:** Wave 1 (skills referenced by agents)
**Breaking changes:** None — opt-in mode

### 4.1 Create: `.claude/skills/subagent-driven-development/SKILL.md`

```markdown
---
description: "Fresh-context subagent dispatch per subtask with two-stage review"
---
```

**Content must include:**

- When to use: opt-in, recommended for 5+ subtasks or long sessions
- How the orchestrator asks: "This task has N subtasks. Use subagent mode? (each subtask gets a fresh agent)"
- Dispatch pattern per subtask:
  1. Orchestrator prepares context package (subtask spec, file paths, conventions, TDD skill)
  2. Dispatch implementer agent (use Agent tool with fresh context)
  3. Implementer reports: DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED
  4. If DONE: dispatch spec-reviewer agent
  5. If spec passes: dispatch quality-reviewer agent
  6. If all pass: check off subtask, move to next
  7. If any review fails: feed findings back, re-dispatch implementer
- Model selection (optional):
  - Implementer: `model: "sonnet"` for standard tasks, `model: "haiku"` for simple/well-defined
  - Spec reviewer: `model: "haiku"` (binary pass/fail check)
  - Quality reviewer: `model: "sonnet"` (nuanced judgment)
- Brownfield adaptation:
  - Subagent receives: full existing files (not just target area), related tests, project-context.md, 2-3 examples of similar patterns
  - Principle: match existing patterns, not ideal patterns
- Never dispatch multiple implementers in parallel (sequential only)
- Never skip either review stage

### 4.2 Create: `.claude/agents/implementer.md`

```markdown
---
description: "Implements a single subtask with TDD in fresh context"
---
```

**Content must include:**

- Role description: "You are implementing a single subtask. You have NO context from other subtasks."
- Inputs: subtask spec, file paths, relevant ACs, conventions (code-style.md, testing.md), TDD skill
- Process: read existing code → follow TDD (RED → GREEN → REFACTOR) → self-review → report
- Report format: Status (DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED), files changed, test results (paste output), concerns
- Rules: implement ONLY what subtask describes, follow conventions EXACTLY, do NOT modify files outside scope, do NOT ask user questions — report NEEDS_CONTEXT to orchestrator

### 4.3 Create: `.claude/agents/spec-reviewer.md`

```markdown
---
description: "Verifies implementation matches subtask spec and acceptance criteria"
---
```

**Content must include:**

- Role: skeptical reviewer — verify the implementer did what was asked
- Inputs: subtask spec, relevant ACs, actual code changes (read the files)
- Checks: Does code match what the subtask asked for? Does it satisfy relevant ACs? Did the implementer skip anything? Did the implementer add anything not in the spec?
- Output: PASS or FAIL with specific findings
- Rule: examine actual code, not implementer's report. Read the files yourself.

### 4.4 Create: `.claude/agents/quality-reviewer.md`

```markdown
---
description: "Reviews code quality, conventions, and test adequacy"
---
```

**Content must include:**

- Role: code quality reviewer (only dispatched after spec review passes)
- Inputs: code changes, conventions (code-style.md, file-structure.md, testing.md)
- Checks: convention compliance (naming, imports, structure), test quality (AAA pattern, meaningful assertions, behavior not implementation), code simplicity (no over-engineering), no drive-by changes
- Output: Critical (must fix) / Important (should fix) / Suggestions (consider), with specific file:line references
- Brownfield rule: evaluate against existing codebase patterns, not ideal patterns

### 4.5 Update: `.claude/commands/sk/dev.md`

**Add after Step 1.5 (Read Active Skills) — from Wave 1:**

```markdown
## Step 1.6: Choose Execution Mode

If the task has 5+ subtasks, ask: **"This task has N subtasks. Use subagent mode? Each subtask gets a fresh agent with clean context."**

If yes: read `.claude/skills/subagent-driven-development/SKILL.md` and follow SDD pattern.
If no: continue with direct execution (standard mode).
```

### 4.6 Update: `.claude/commands/sk/implement.md`

**Same addition** as dev.md — add execution mode choice before DEV phase.

### Wave 4 Verification

- [ ] `.claude/skills/subagent-driven-development/SKILL.md` exists with full orchestration pattern
- [ ] `.claude/agents/implementer.md` exists with role, inputs, process, report format
- [ ] `.claude/agents/spec-reviewer.md` exists with checks and output format
- [ ] `.claude/agents/quality-reviewer.md` exists with checks and brownfield rule
- [ ] `dev.md` offers SDD mode for 5+ subtasks
- [ ] `implement.md` offers SDD mode for 5+ subtasks
- [ ] All agent prompts include TDD skill reference
- [ ] Brownfield adaptations included in SDD skill and agents

---

## Wave 5: Git Worktrees

**Goal:** Optional isolated workspaces for feature branch work.

**Effort:** S
**Dependencies:** Wave 3 (finish.md for cleanup step)
**Breaking changes:** None — opt-in

### 5.1 Create: `.claude/skills/git-worktrees/SKILL.md`

```markdown
---
description: "Isolated git worktree workspace per feature branch"
---
```

**Content must include:**

- When offered: at start of /sk:dev or /sk:implement, for M+ complexity on a feature branch
- Setup steps:
  1. Verify main worktree is clean (`git status`)
  2. Create feature branch if not exists
  3. Create worktree: `git worktree add ../{project}-{feature} {branch}`
  4. Verify .gitignore includes build artifacts, node_modules, .env
  5. Install dependencies (npm install / pip install / etc.)
  6. Run baseline tests — confirm green before starting
- Cleanup steps (used by /sk:finish):
  1. Verify all changes committed
  2. Switch back to main worktree
  3. Remove worktree: `git worktree remove ../{project}-{feature}`
  4. Delete branch if merged
- Safety rules: never create worktree from dirty working tree, always verify .gitignore, always run baseline tests

### 5.2 Update: `.claude/commands/sk/dev.md`

**Add to Step 1.6 (Choose Execution Mode) or as separate step:**

```markdown
## Step 1.7: Workspace Setup (Optional)

If working on a feature branch for M+ complexity, ask: **"Set up an isolated worktree for this work?"**

If yes: follow `.claude/skills/git-worktrees/SKILL.md` setup steps.
```

### 5.3 Update: `.claude/commands/sk/finish.md`

Already includes worktree cleanup in Step 6 from Wave 3 — no additional changes needed.

### Wave 5 Verification

- [ ] `.claude/skills/git-worktrees/SKILL.md` exists with setup and cleanup steps
- [ ] `dev.md` offers worktree setup for M+ feature work
- [ ] `finish.md` handles worktree cleanup (already in Wave 3)
- [ ] Safety rules included (clean working tree, .gitignore, baseline tests)

---

## Full File Manifest

### New Files (14)

| Wave | File | Type |
|------|------|------|
| 1 | `.claude/skills/verification-before-completion/SKILL.md` | Skill |
| 1 | `.claude/skills/test-driven-development/SKILL.md` | Skill |
| 1 | `.claude/skills/test-driven-development/anti-patterns.md` | Skill support |
| 1 | `.claude/skills/escalation-rules/SKILL.md` | Skill |
| 2 | `docs/reviews/README.md` | Doc index |
| 2 | `docs/research/README.md` | Doc index |
| 2 | `docs/templates/review-report.md` | Template |
| 2 | `docs/templates/research-doc.md` | Template |
| 3 | `.claude/commands/sk/finish.md` | Command |
| 4 | `.claude/skills/subagent-driven-development/SKILL.md` | Skill |
| 4 | `.claude/agents/implementer.md` | Agent |
| 4 | `.claude/agents/spec-reviewer.md` | Agent |
| 4 | `.claude/agents/quality-reviewer.md` | Agent |
| 5 | `.claude/skills/git-worktrees/SKILL.md` | Skill |

### Updated Files (11)

| Wave | File | Change |
|------|------|--------|
| 1 | `.claude/commands/sk/dev.md` | Add skill reads at Steps 1.5, 4, 8 |
| 1 | `.claude/commands/sk/test.md` | Add skill read at Steps 1.5, 3, 4 |
| 1 | `.claude/commands/sk/implement.md` | Add skill reads at Steps 1.5, 4, 5 |
| 1 | `.claude/commands/sk/refactor.md` | Add skill refs at Steps 6, 7 |
| 1 | `.claude/commands/sk/debug.md` | Add skill refs at Steps 5, 8 |
| 2 | `docs/README.md` | Add Reviews + Research to navigation and tree |
| 2 | `.claude/commands/sk/code-review.md` | Add "Save?" step |
| 2 | `.claude/commands/sk/security-review.md` | Add "Save?" step |
| 2 | `.claude/commands/sk/perf-review.md` | Add "Save?" step |
| 2 | `.claude/commands/sk/ui-review.md` | Add "Save?" step |
| 2 | `.claude/commands/sk/deps.md` | Add "Save?" step |
| 2 | `.claude/commands/sk/brainstorm.md` | Add "Save research?" step |
| 2 | `.claude/commands/sk/debug.md` | Add "Save investigation?" step (also Wave 1) |
| 3 | `CLAUDE.md` | Add /sk:finish to tables |
| 4 | `.claude/commands/sk/dev.md` | Add SDD mode choice (also Wave 1) |
| 4 | `.claude/commands/sk/implement.md` | Add SDD mode choice (also Wave 1) |
| 5 | `.claude/commands/sk/dev.md` | Add worktree setup (also Waves 1, 4) |

*Note: Some files are updated in multiple waves. Each wave's changes are additive and non-conflicting.*

---

## Execution Order Summary

```
Wave 1: Safety Skills                    Wave 2: Doc Structure
├── 4 skill files created                ├── 2 directory READMEs
├── 5 commands updated                   ├── 2 templates
└── COMMIT: "feat: add safety skills"    ├── 7 commands updated (save step)
                                         ├── 1 doc index updated
                                         └── COMMIT: "feat: add reviews and research docs"

Wave 3: Finish Command                   Wave 4: Subagent Orchestration
├── 1 command created                    ├── 1 skill file
├── CLAUDE.md updated                    ├── 3 agent files
└── COMMIT: "feat: add /sk:finish"       ├── 2 commands updated (SDD mode)
                                         └── COMMIT: "feat: add subagent orchestration"

Wave 5: Git Worktrees
├── 1 skill file
├── 1 command updated
└── COMMIT: "feat: add git worktree support"
```

**Waves 1 and 2 can run in parallel** (no dependencies between them).
**Waves 3-5 are sequential** (each builds on prior waves).
