# How It All Works Together

**Date:** 2026-03-22
**Purpose:** Show exactly how the 25 commands, 5 skills, and 3 agents interact at runtime — with concrete walkthroughs, not abstract diagrams.

---

## 1. The Three Layers

```
┌────────────────────────────────────────────────────────────────────┐
│                        USER                                        │
│   Runs /sk:dev, /sk:implement, /sk:brainstorm, etc.               │
└────────────────────┬───────────────────────────────────────────────┘
                     │ invokes
┌────────────────────▼───────────────────────────────────────────────┐
│                   COMMANDS (25)                                     │
│   Procedural scripts. Define the workflow steps.                   │
│   "Read context → analyze → execute → verify → update status"     │
│                                                                    │
│   Each command reads skills/ at key decision points:               │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │              SKILLS (5)                                      │  │
│   │   Behavioral rules. Active during command execution.         │  │
│   │   "Before you claim done, show me the test output."          │  │
│   │   "Before you write code, write the failing test."           │  │
│   │   "After 3 failures, stop and rethink."                      │  │
│   │                                                              │  │
│   │   Skills can dispatch:                                       │  │
│   │   ┌───────────────────────────────────────────────────────┐  │  │
│   │   │            AGENTS (3)                                  │  │  │
│   │   │   Fresh-context workers. Dispatched per subtask.       │  │  │
│   │   │   implementer → spec-reviewer → quality-reviewer       │  │  │
│   │   └───────────────────────────────────────────────────────┘  │  │
│   └─────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

**How they connect:**
- User invokes a **command**
- Command follows its steps, and at specific points reads **skill** files for behavioral rules
- Skills can optionally dispatch **agents** (subprocesses with fresh context)
- Agents do work and report back to the command

---

## 2. What Each Layer Does (and Doesn't Do)

### Commands — "The Script"

Commands are the 25 `/sk:*` files in `.claude/commands/sk/`. They define WHAT to do step by step. They already exist and are comprehensive.

**Commands DO:** Define workflow steps, read context, execute phases, update status, present results.
**Commands DON'T:** Enforce behavioral rules between steps, dispatch subagents, provide cross-command constraints.

### Skills — "The Guardrails"

Skills are 5 files in `.claude/skills/`. They define HOW to behave during command execution. They are read by commands at specific insertion points.

**Skills DO:** Enforce iron laws (TDD, verification evidence, escalation), define subagent orchestration patterns.
**Skills DON'T:** Define workflow steps, replace commands, run independently.

### Agents — "The Workers"

Agents are 3 prompt templates in `.claude/agents/`. They are dispatched by the SDD skill to execute work with fresh context.

**Agents DO:** Implement subtasks, review code, check spec compliance — each in a clean context.
**Agents DON'T:** Self-dispatch, interact with the user directly, modify the task file.

---

## 3. Runtime: How a Command Reads a Skill

Skills are not magic — they're markdown files that a command reads at specific points. Here's the mechanism:

**In `/sk:dev` Step 4 (execute subtasks), the command would say:**

```markdown
## Step 4: Execute Subtasks

Before executing, read the active skills:
1. Read `.claude/skills/test-driven-development/SKILL.md` — follow TDD cycle
2. Read `.claude/skills/escalation-rules/SKILL.md` — know when to stop

Process subtasks top-to-bottom, following the TDD skill's RED-GREEN-REFACTOR cycle.
```

**In `/sk:dev` Step 8 (exit gate), the command would say:**

```markdown
## Step 8: DEV Exit Gate

Read `.claude/skills/verification-before-completion/SKILL.md` before claiming done.
```

That's it. A skill is a file the command tells the agent to read. The skill's content then shapes the agent's behavior for that section.

---

## 4. Walkthrough: Feature Development with `/sk:implement`

Here's exactly what happens at runtime when a user says "build a user profile page":

### Phase 1: PLAN

```
USER: /sk:implement "build a user profile page"

AGENT reads:
  → implement.md Step 1 (context files)
  → implement.md Step 2 (scope → M complexity → continue)
  → implement.md Step 3 (PLAN phase)

AGENT does:
  1. Scans codebase for existing patterns
  2. Writes 4 acceptance criteria
  3. Breaks into subtasks:
     ST-1 [DEV]  Create profile service
     ST-2 [TEST] Tests for profile service
     ST-3 [DEV]  Create profile API endpoint
     ST-4 [TEST] Tests for profile API
     ST-5 [DEV]  Create profile UI component
     ST-6 [TEST] Tests for profile UI
     ST-7 [DOCS] Update API reference

AGENT presents plan → waits for user approval
USER: "looks good, proceed"
```

### Phase 2: DEV (where skills activate)

```
AGENT reads:
  → implement.md Step 4 (DEV phase)
  → .claude/skills/test-driven-development/SKILL.md    ← SKILL ACTIVATES
  → .claude/skills/escalation-rules/SKILL.md           ← SKILL ACTIVATES

Now the agent's behavior changes. Instead of doing ST-1 [DEV] then ST-2 [TEST],
the TDD skill reorders execution to test-first per feature unit:

  SUBTASK PAIR: ST-2 + ST-1 (profile service)
  ├── 🔴 RED: Agent writes test for profile service
  │   └── Runs test → confirms FAILURE (shows output)
  ├── 🟢 GREEN: Agent writes profile service (minimum to pass)
  │   └── Runs test → confirms PASS (shows output)
  └── 🔄 REFACTOR: Agent cleans up
      └── Runs test → confirms still PASS (shows output)
  ✅ ST-1 and ST-2 checked off

  SUBTASK PAIR: ST-4 + ST-3 (profile API)
  ├── 🔴 RED: Agent writes test for API endpoint
  │   └── Runs test → confirms FAILURE
  ├── 🟢 GREEN: Agent writes API endpoint
  │   └── Runs test → confirms PASS
  └── 🔄 REFACTOR
  ✅ ST-3 and ST-4 checked off

  SUBTASK PAIR: ST-6 + ST-5 (profile UI)
  ├── 🔴 RED: Agent writes test for UI component
  │   └── Runs test → FAILURE
  ├── 🟢 GREEN: Agent writes UI component
  │   └── Runs test → FAILURE (still broken)
  ├── 🟢 GREEN: Agent fixes implementation
  │   └── Runs test → FAILURE again
  │
  │   ⚠️ ESCALATION SKILL ACTIVATES (3 failures on same subtask)
  │   Agent reads .claude/skills/escalation-rules/SKILL.md
  │   Agent STOPS and asks:
  │   "I've failed 3 times on ST-5. The test expects X but I'm getting Y.
  │    Options:
  │    (a) The subtask is too large — break ST-5 into smaller pieces
  │    (b) The plan approach is wrong — return to PLAN
  │    (c) This is a deeper issue — switch to /sk:debug
  │    Which should I do?"
  │
  USER: "try (a), the component is doing too much"
  │
  ├── Agent splits ST-5 into ST-5a and ST-5b
  ├── Resumes TDD cycle on ST-5a → passes
  ├── Resumes TDD cycle on ST-5b → passes
  ✅ ST-5 and ST-6 checked off

  ST-7 [DOCS]: Agent updates API reference
  ✅ ST-7 checked off
```

### Phase 2 Exit Gate (verification skill activates)

```
AGENT reads:
  → .claude/skills/verification-before-completion/SKILL.md   ← SKILL ACTIVATES

Instead of just checking boxes, the agent MUST:

  AGENT runs: npm test
  AGENT pastes ACTUAL OUTPUT:
    ✓ profile service returns user data (3ms)
    ✓ profile service handles missing user (1ms)
    ✓ GET /api/profile/:id returns 200 (12ms)
    ✓ GET /api/profile/:id returns 404 for missing user (8ms)
    ✓ ProfilePage renders user data (5ms)
    ✓ ProfilePage shows loading state (2ms)
    Tests: 6 passed, 0 failed

  AGENT runs: npm run typecheck
  AGENT pastes: No errors found

  AGENT runs: npm run lint
  AGENT pastes: No warnings
```

### Phase 3: TEST (verification skill stays active)

```
AGENT reads:
  → implement.md Step 5 (TEST phase)
  → .claude/skills/verification-before-completion/SKILL.md  ← STILL ACTIVE

For each acceptance criterion:
  AC-1: "Profile page shows user name, email, and avatar"
  AGENT runs the specific test, pastes output:
    ✓ ProfilePage renders user name "Jane Doe"
    ✓ ProfilePage renders email "jane@example.com"
    ✓ ProfilePage renders avatar image
  EVIDENCE RECORDED: "AC-1 verified — component renders all 3 fields"

  AC-2: "Profile page shows 404 for non-existent user"
  AGENT runs test, pastes output:
    ✓ GET /api/profile/999 returns 404
    ✓ ProfilePage shows "User not found" message
  EVIDENCE RECORDED: "AC-2 verified — 404 with user-friendly message"

  ... (each AC gets real evidence, not "it works")
```

### Close Out

```
AGENT:
  → Updates task frontmatter: phase: done, status: done
  → Updates docs/tasks/README.md
  → Presents summary with evidence

USER: /sk:commit → stages, commits, pushes, optionally creates PR
```

---

## 5. Walkthrough: `/sk:dev` with Subagent Mode

When the session is long or the task has many subtasks, the user can opt into subagent dispatch:

```
USER: /sk:dev  (on a task with 8 subtasks)
AGENT: "This task has 8 subtasks. Want me to use subagent mode?
        Each subtask gets a fresh agent with clean context."
USER: "yes"

AGENT reads:
  → dev.md (full command)
  → .claude/skills/subagent-driven-development/SKILL.md   ← SKILL ACTIVATES
  → .claude/skills/test-driven-development/SKILL.md        ← STILL ACTIVE
  → .claude/skills/escalation-rules/SKILL.md               ← STILL ACTIVE

For ST-1 + ST-2 (service + tests):

  ORCHESTRATOR (parent agent) dispatches IMPLEMENTER subagent:
  ┌─────────────────────────────────────────────────────┐
  │  IMPLEMENTER SUBAGENT (fresh context)                │
  │                                                      │
  │  Receives:                                           │
  │  - Subtask description from task file                │
  │  - File paths to work on                             │
  │  - docs/conventions/code-style.md                    │
  │  - docs/conventions/testing.md                       │
  │  - TDD skill instructions                            │
  │                                                      │
  │  Does NOT receive:                                   │
  │  - Earlier subtask context                           │
  │  - Parent conversation history                       │
  │  - Other subtask results                             │
  │                                                      │
  │  Executes TDD cycle:                                 │
  │  🔴 Writes test → 🟢 Implements → 🔄 Refactors      │
  │                                                      │
  │  Reports back: DONE                                  │
  │  "Implemented profile service with 2 tests passing.  │
  │   Files changed: src/services/profile.ts,            │
  │   tests/services/profile.test.ts"                    │
  └─────────────────────────────────────────────────────┘

  ORCHESTRATOR dispatches SPEC-REVIEWER subagent:
  ┌─────────────────────────────────────────────────────┐
  │  SPEC-REVIEWER SUBAGENT (fresh context)              │
  │                                                      │
  │  Receives:                                           │
  │  - Subtask spec from task file                       │
  │  - Actual code changes (reads the files)             │
  │  - Acceptance criteria                               │
  │                                                      │
  │  Checks:                                             │
  │  - Does code match what the subtask asked for?       │
  │  - Does it satisfy relevant acceptance criteria?     │
  │  - Did the implementer skip anything?                │
  │                                                      │
  │  Reports: PASS                                       │
  │  "Code matches spec. Service returns correct shape.  │
  │   Error handling present for missing user."           │
  └─────────────────────────────────────────────────────┘

  ORCHESTRATOR dispatches QUALITY-REVIEWER subagent:
  ┌─────────────────────────────────────────────────────┐
  │  QUALITY-REVIEWER SUBAGENT (fresh context)           │
  │                                                      │
  │  Receives:                                           │
  │  - Code changes                                      │
  │  - docs/conventions/code-style.md                    │
  │  - docs/conventions/testing.md                       │
  │                                                      │
  │  Checks:                                             │
  │  - Convention compliance (naming, imports, structure) │
  │  - Test quality (AAA pattern, meaningful assertions)  │
  │  - Code simplicity (no over-engineering)             │
  │                                                      │
  │  Reports: PASS (1 suggestion)                        │
  │  "Code quality good. Suggestion: rename `getData`    │
  │   to `getProfileById` for clarity."                  │
  └─────────────────────────────────────────────────────┘

  ORCHESTRATOR:
  - Applies suggestion (renames function)
  - Checks off ST-1 and ST-2
  - Moves to next subtask pair
  - Dispatches fresh implementer (no context from ST-1)

... repeats for all subtask pairs ...
```

### Why Fresh Context Matters

```
WITHOUT subagents (current /sk:dev):

  ST-1: Implement auth service        → context: clean
  ST-2: Implement user service         → context: auth + user
  ST-3: Implement profile service      → context: auth + user + profile
  ST-4: Implement notification service → context: auth + user + profile + notifications
  ST-5: Implement dashboard API        → context: EVERYTHING (polluted, slow, error-prone)

WITH subagents (SDD skill):

  ST-1: implementer subagent → context: just ST-1 spec + conventions
  ST-2: implementer subagent → context: just ST-2 spec + conventions
  ST-3: implementer subagent → context: just ST-3 spec + conventions
  ST-4: implementer subagent → context: just ST-4 spec + conventions
  ST-5: implementer subagent → context: just ST-5 spec + conventions

Each subagent starts clean. No accumulated drift.
```

---

## 6. Walkthrough: Bug Fix with `/sk:debug`

Debug already has a thorough command. Skills add escalation and verification on top:

```
USER: "Users get 500 error on dashboard after the latest deploy"
USER: /sk:debug

AGENT reads:
  → debug.md (full command)
  → .claude/skills/verification-before-completion/SKILL.md
  → .claude/skills/escalation-rules/SKILL.md

STEP 3-4: Gather report, reproduce
  Agent reproduces → "500 error confirmed on GET /api/dashboard"

STEP 5: Isolate
  Agent traces: route → controller → service → DB query
  Hypothesis: "New migration added column but service still queries old schema"

STEP 5c: Verify hypothesis
  Agent checks migration file → confirms new column exists
  Agent checks service → finds old query without new column
  "Root cause: dashboard service query doesn't include the new `preferences`
   column added in migration 042. The JOIN fails silently."

STEP 6: Fix
  Agent updates the query

STEP 7: Regression test
  Agent writes test: "it('should return dashboard with user preferences')"

STEP 8: Verify (VERIFICATION SKILL ACTIVATES)
  Agent runs: npm test
  Agent pastes FULL OUTPUT:
    ✓ dashboard returns data with preferences (8ms)
    ✓ dashboard handles missing preferences gracefully (3ms)
    ... 142 tests passed, 0 failed
  Agent runs original reproduction:
    GET /api/dashboard → 200 OK, includes preferences field
  EVIDENCE: "Bug fixed. 200 response with preferences. 142 tests pass, 0 fail."

  (Without verification skill, agent might just say "Fixed. Tests pass.")
```

---

## 7. Walkthrough: `/sk:finish` (New Command)

This orchestration command chains existing capabilities:

```
USER: /sk:finish

AGENT reads: finish.md

STEP 1: What to finish?
  Agent checks: git branch → feature/user-profile
  Agent checks: task file → TASK-5-E2-user-profile.md, status: done

STEP 2: Final review
  Agent runs /sk:code-review internally:
    → git diff main...HEAD
    → reads all changed files with context
    → analyzes across 5 categories
    → "APPROVE — no critical issues, 1 suggestion (deferred)"

STEP 3: Commit and ship
  Agent runs /sk:commit internally:
    → stages changes
    → generates conventional commit message
    → pushes to remote
    → creates PR with AC summary and test evidence

STEP 4: Clean up
  → Updates TASK-5 status to done
  → Updates docs/tasks/README.md
  → Cleans up worktree (if used)

AGENT: "Done. PR #23 created: https://github.com/org/repo/pull/23
        Task TASK-5-E2-user-profile marked done."
```

---

## 8. Which Skills Are Active During Which Commands

```
                          ┌──────────┬──────────┬──────────┬──────────┬──────────┐
                          │ verifica │   TDD    │ escalat  │   SDD    │ worktree │
                          │  -tion   │          │  -ion    │ (opt-in) │ (opt-in) │
┌─────────────────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ /sk:dev                 │    ✅    │    ✅    │    ✅    │    🔘    │    🔘    │
│ /sk:test                │    ✅    │          │          │          │          │
│ /sk:implement           │    ✅    │    ✅    │    ✅    │    🔘    │    🔘    │
│ /sk:debug               │    ✅    │          │    ✅    │          │          │
│ /sk:refactor            │    ✅    │          │    ✅    │          │          │
│ /sk:finish              │    ✅    │          │          │          │    🔘    │
├─────────────────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ /sk:brainstorm          │          │          │          │          │          │
│ /sk:plan                │          │          │          │          │          │
│ /sk:code-review         │          │          │          │          │          │
│ /sk:security-review     │          │          │          │          │          │
│ /sk:perf-review         │          │          │          │          │          │
│ /sk:ui-review           │          │          │          │          │          │
│ /sk:commit              │          │          │          │          │          │
│ /sk:new-task            │          │          │          │          │          │
│ /sk:new-epic            │          │          │          │          │          │
│ ... (other commands)    │          │          │          │          │          │
└─────────────────────────┴──────────┴──────────┴──────────┴──────────┴──────────┘

✅ = always active     🔘 = opt-in (agent asks, user decides)
```

**Only 6 commands interact with skills.** The other 19 commands work exactly as they do today — no changes needed.

---

## 9. Decision Tree: What the User Runs

```
"I have an idea"
  └── /sk:brainstorm → produces epic + tasks
       └── /sk:implement or /sk:plan → /sk:dev → /sk:test → /sk:finish

"I have a task to build"
  └── How complex?
       ├── XS/S → Just do it → /sk:commit
       ├── M   → /sk:implement (all-in-one)
       │         OR /sk:plan → /sk:dev → /sk:test → /sk:finish (step-by-step)
       └── L/XL → /sk:new-epic → per task: /sk:implement

"I have a bug"
  └── /sk:debug

"I want to clean up code"
  └── /sk:refactor

"I want to review quality"
  └── /sk:code-review   (code quality)
      /sk:security-review (vulnerabilities)
      /sk:perf-review    (performance)
      /sk:ui-review      (UI/UX/a11y)

"I'm done, ship it"
  └── /sk:finish → review + commit + push + PR + cleanup
      OR /sk:commit (just the git part)

"I want to check status"
  └── /sk:task-status

"I need a new project"
  └── /sk:kickoff → guided setup with research → /sk:brainstorm

"I have an existing project"
  └── /sk:init-docs → scans codebase, generates docs, detects build commands
       └── then: same workflow as above (brainstorm / plan / dev / test / finish)
       └── skills auto-adapt to brownfield (characterization tests, baseline comparison)
```

---

## 10. Data Flow: What Connects Everything

The task file is the central data object that flows through all phases:

```
/sk:brainstorm creates:
  docs/tasks/TASK-5-E2-profile.md
    ├── frontmatter: { phase: plan, status: planning }
    ├── problem statement
    ├── acceptance criteria (draft)
    └── subtasks (draft)

/sk:plan enriches:
  docs/tasks/TASK-5-E2-profile.md
    ├── frontmatter: { phase: dev, status: ready }   ← updated
    ├── acceptance criteria (refined, testable)        ← refined
    ├── subtasks (exact file paths, S complexity)      ← refined
    ├── phase analysis (codebase scan, tech decisions) ← added
    └── open questions (all resolved)                  ← added

/sk:dev fills:
  docs/tasks/TASK-5-E2-profile.md
    ├── frontmatter: { phase: test, status: testing }  ← updated
    ├── subtasks: [x] ST-1, [x] ST-2, ...             ← checked off
    ├── implementation notes                            ← added
    ├── review results (if SDD skill active)            ← added
    └── progress log: "DEV complete"                    ← added

/sk:test fills:
  docs/tasks/TASK-5-E2-profile.md
    ├── frontmatter: { phase: done, status: done }     ← updated
    ├── verification section                            ← added
    │   ├── AC-1: verified with evidence
    │   ├── AC-2: verified with evidence
    │   └── AC-3: verified with evidence
    ├── error path results                              ← added
    ├── edge case results                               ← added
    └── progress log: "TEST complete. All ACs verified" ← added

/sk:finish updates:
  docs/tasks/README.md → task moved to "Recently Completed"
  git → committed, pushed, PR created
```

---

## 11. Skill File Format

Each skill is a standalone markdown file that commands `Read` at specific points:

```markdown
# Skill: Verification Before Completion

## When This Skill Is Active
This skill is active during exit gates of: /sk:dev, /sk:test, /sk:implement,
/sk:refactor, /sk:debug — any point where you claim work is done.

## Iron Law
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.

## Rules
1. You MUST run the actual test/check command in THIS session
2. You MUST paste the raw output (not summarize, not paraphrase)
3. These phrases are NEVER acceptable as evidence:
   - "It works"
   - "Tests pass"
   - "Looks good"
   - "Verified"
   - "Confirmed"
4. Acceptable evidence looks like:
   ```
   $ npm test
   ✓ user service returns profile (3ms)
   ✓ user service handles missing user (1ms)
   Tests: 2 passed, 0 failed
   ```

## How Commands Use This Skill
Commands include a line like:
  "Read `.claude/skills/verification-before-completion/SKILL.md` before claiming done."
When you read this, the rules above become active constraints on your behavior.
```

---

## 12. Agent Prompt Template Format

Each agent is a prompt template the orchestrator fills and dispatches:

```markdown
# Agent: Implementer

## Role
You are implementing a single subtask. You have NO context from other subtasks.

## You Receive
- **Subtask spec:** {subtask_description}
- **File paths:** {file_paths}
- **Acceptance criteria (relevant):** {relevant_acs}
- **Conventions:** (attached: code-style.md, testing.md)
- **TDD instructions:** (attached: test-driven-development/SKILL.md)

## Your Process
1. Read the existing code at the specified file paths
2. Follow TDD: write failing test → implement → refactor
3. Self-review against conventions
4. Report your status

## Report Format
Status: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

Files changed:
- path/to/file.ts (created/modified)

Test results:
- (paste test output)

Concerns (if any):
- (describe)

## Rules
- Implement ONLY what the subtask describes
- Follow the conventions EXACTLY
- Do NOT modify files outside your subtask scope
- Do NOT ask the user questions — report NEEDS_CONTEXT to the orchestrator
```

---

## 13. Implementation Order

### Wave 1: Safety Skills (immediate value, no structural changes)

Create 3 skill files. Update 5 commands to read them.

```
CREATE:
  .claude/skills/verification-before-completion/SKILL.md
  .claude/skills/test-driven-development/SKILL.md
  .claude/skills/test-driven-development/anti-patterns.md
  .claude/skills/escalation-rules/SKILL.md

UPDATE (add "Read skill" lines at specific steps):
  .claude/commands/sk/dev.md          → TDD + escalation + verification
  .claude/commands/sk/test.md         → verification
  .claude/commands/sk/implement.md    → TDD + escalation + verification
  .claude/commands/sk/refactor.md     → verification + escalation
  .claude/commands/sk/debug.md        → verification + escalation
```

**Impact:** Every feature dev and bug fix immediately gets TDD enforcement, escalation protection, and verified evidence. No new commands needed.

### Wave 2: Finish Command

Create 1 command that chains existing capabilities.

```
CREATE:
  .claude/commands/sk/finish.md

UPDATE:
  CLAUDE.md → add /sk:finish to command table
```

**Impact:** Clean end-of-work flow. Not essential for Wave 1 but closes a gap.

### Wave 3: Subagent Orchestration (optional, for power users)

Create agent templates and SDD skill.

```
CREATE:
  .claude/skills/subagent-driven-development/SKILL.md
  .claude/agents/implementer.md
  .claude/agents/spec-reviewer.md
  .claude/agents/quality-reviewer.md

UPDATE:
  .claude/commands/sk/dev.md      → add optional SDD mode
  .claude/commands/sk/implement.md → add optional SDD mode
```

**Impact:** Fresh-context execution for large tasks. Opt-in, not forced.

### Wave 4: Git Worktrees (optional)

```
CREATE:
  .claude/skills/git-worktrees/SKILL.md

UPDATE:
  .claude/commands/sk/dev.md    → add optional worktree setup
  .claude/commands/sk/finish.md → add worktree cleanup
```

**Impact:** Isolated workspaces. Opt-in.

---

## 14. Brownfield Projects: Adopting Skills into an Existing Codebase

Everything above assumes a greenfield project where you control the full setup. Most real projects are brownfield — existing code, existing tests (or no tests), existing patterns, existing debt. Here's how the system adapts.

### 14.1 The Brownfield Entry Points

```
"I have an existing project, no SK docs"
  └── /sk:init-docs
       Scans codebase → generates docs/ from actual code
       Detects build commands from package.json / pyproject.toml / Makefile / CI
       Documents conventions from observed patterns (not aspirational ones)
       Fills CLAUDE.md build commands automatically

"I have an existing project, SK docs already set up"
  └── /sk:update-docs
       Compares docs/ to current code → fixes drift
       Adds missing docs for new features
       Flags stale docs for removal

"I have an existing project with its own CLAUDE.md"
  └── Skills work alongside any CLAUDE.md
       Skills are in .claude/skills/ — separate from project instructions
       No conflict with existing agent configuration
```

### 14.2 How Skills Adapt to Brownfield Reality

Each skill has brownfield-specific rules that handle the messy reality of existing code:

#### TDD Skill in Brownfield

The TDD skill's iron law is "no production code without a failing test first." But brownfield projects often have:
- Code with zero test coverage
- No test infrastructure at all
- Tests that are broken, flaky, or meaningless

**Brownfield adaptation:**

```
GREENFIELD RULE:
  Write test → see it fail → write code → see it pass

BROWNFIELD RULE:
  1. For NEW code: same as greenfield — test first, always
  2. For MODIFYING existing untested code:
     a. Write a characterization test first (captures current behavior)
     b. See it PASS (proves you understand what the code does today)
     c. Modify the test to reflect desired behavior
     d. See it FAIL (proves the change isn't made yet)
     e. Make the change
     f. See it PASS
  3. For FIXING a bug in untested code:
     a. Write a test that reproduces the bug (must FAIL)
     b. Fix the bug
     c. See the test PASS
  4. If NO test infrastructure exists:
     a. First subtask is ALWAYS "set up test runner"
     b. /sk:plan must include a [DEV] subtask for test setup
     c. Do not skip this — "no test runner" is not an excuse for no tests
```

#### Verification Skill in Brownfield

Brownfield projects may not have `npm test` or any test command at all.

**Brownfield adaptation:**

```
IF test command exists (detected by /sk:init-docs):
  Standard rule: run tests, paste output

IF no test command exists:
  1. Manual verification is acceptable BUT must be specific:
     ACCEPTABLE: "Ran curl POST /api/users with {email: 'test@example.com'},
                  got 201 with {id: 1, email: 'test@example.com'}"
     NOT ACCEPTABLE: "Tested manually, it works"
  2. First task in any brownfield project SHOULD set up a test runner
  3. After test runner exists, switch to standard rule

IF tests exist but are flaky/broken:
  1. Record baseline: "47 pass, 3 fail, 2 flaky (existing)"
  2. After your changes: "47 pass, 3 fail, 2 flaky (same as baseline)"
  3. Your changes must not INCREASE failures
  4. Fixing existing flaky tests is a separate /sk:debug task
```

#### Escalation Skill in Brownfield

Brownfield code often fights back — unexpected coupling, hidden dependencies, undocumented behavior.

**Brownfield adaptation:**

```
STANDARD RULE: 3 failures → stop and rethink

BROWNFIELD ADDITION:
  When escalating, consider brownfield-specific causes:
  a. Is there undocumented behavior you're breaking? → Write characterization tests first
  b. Is there hidden coupling to another module? → Map dependencies before continuing
  c. Is the existing code too tangled to modify safely? → Consider /sk:refactor first
  d. Is the existing test suite testing implementation details? → Tests may need updating too

  If you discover the codebase is in worse shape than the plan assumed:
  → Return to /sk:plan
  → Add subtasks for cleanup/refactoring as prerequisites
  → Do not hack around structural problems
```

#### SDD Skill in Brownfield

Subagent dispatch needs extra context in brownfield because the codebase has undocumented patterns.

**Brownfield adaptation:**

```
GREENFIELD: Subagent receives subtask spec + conventions

BROWNFIELD: Subagent receives subtask spec + conventions + ALSO:
  - Existing code in the files being modified (full file, not just the target area)
  - Related test files (if any exist)
  - docs/system/project-context.md (patterns and gotchas)
  - 2-3 examples of similar patterns already in the codebase

Why: A brownfield subagent must match existing patterns, not ideal patterns.
     If the codebase uses callbacks, don't introduce promises.
     If the codebase uses class components, don't introduce hooks.
     Match what exists, unless the task explicitly says to migrate.
```

### 14.3 Walkthrough: First Feature in a Brownfield Project

```
STARTING STATE:
  - Existing Rails app, 3 years old
  - 200+ models, 80+ controllers
  - Test suite exists but 40% of tests are broken
  - No SK docs, no CLAUDE.md (or a generic one)
  - User wants to add a new "export to CSV" feature

STEP 1: Bootstrap (/sk:init-docs)

  USER: /sk:init-docs

  AGENT scans:
    → Gemfile → Ruby on Rails 7.1, PostgreSQL, RSpec
    → app/ → 200+ models, 80+ controllers, service objects in app/services/
    → spec/ → tests exist, many failing
    → Makefile → make test, make lint, make dev
    → .github/workflows/ci.yml → bundle exec rspec, rubocop

  AGENT generates:
    docs/system/tech-stack.md     → Rails 7.1, Ruby 3.2, Postgres 15, ...
    docs/system/project-context.md → patterns observed, build commands
    docs/conventions/code-style.md → conventions from observed code
    CLAUDE.md                     → build commands: { test: make test, ... }

  AGENT warns:
    "Test suite has failures. Baseline: 847 pass, 123 fail, 12 pending.
     I've recorded this baseline in project-context.md."

STEP 2: Plan the feature (/sk:plan)

  USER: /sk:plan "add CSV export for the reports page"

  AGENT reads:
    → project-context.md (understands the existing patterns)
    → Scans app/controllers/reports_controller.rb
    → Scans app/services/ for existing export patterns
    → Finds: app/services/pdf_export_service.rb (existing pattern to follow)

  AGENT plans subtasks:
    ST-1 [TEST] Write spec for CsvExportService             ← TDD: test first
    ST-2 [DEV]  Create CsvExportService (follow PdfExportService pattern)
    ST-3 [TEST] Write request spec for CSV download endpoint ← TDD: test first
    ST-4 [DEV]  Add CSV download action to ReportsController
    ST-5 [TEST] Write feature spec for UI download button    ← TDD: test first
    ST-6 [DEV]  Add download button to reports view
    ST-7 [DOCS] Update API reference

  AGENT notes in Phase Analysis:
    "Following existing pattern from PdfExportService.
     Baseline test suite: 847 pass, 123 fail — will verify no increase."

STEP 3: Build (/sk:dev)

  AGENT reads:
    → dev.md + TDD skill + escalation skill + verification skill

  TDD CYCLE (brownfield mode):

    ST-1 [TEST]: Write spec for CsvExportService
      🔴 Agent writes: spec/services/csv_export_service_spec.rb
      Agent runs: bundle exec rspec spec/services/csv_export_service_spec.rb
      Output: "1 example, 1 failure" → RED confirmed ✅

    ST-2 [DEV]: Implement CsvExportService
      🟢 Agent writes: app/services/csv_export_service.rb
         (follows PdfExportService pattern exactly — brownfield rule)
      Agent runs: bundle exec rspec spec/services/csv_export_service_spec.rb
      Output: "1 example, 0 failures" → GREEN confirmed ✅

    ST-3 [TEST]: Write request spec for endpoint
      🔴 Agent writes: spec/requests/reports_csv_spec.rb
      Agent runs: bundle exec rspec spec/requests/reports_csv_spec.rb
      Output: "2 examples, 2 failures" → RED confirmed ✅

    ST-4 [DEV]: Add controller action
      🟢 Agent adds action to reports_controller.rb
      Agent runs: bundle exec rspec spec/requests/reports_csv_spec.rb
      Output: "2 examples, 0 failures" → GREEN confirmed ✅

    ... (ST-5, ST-6 follow same pattern)

  EXIT GATE (verification skill):
    Agent runs: make test
    Agent pastes output:
      "851 examples, 123 failures, 12 pending"
      New tests: 4 pass (851 - 847 = 4 new passing)
      Existing failures: still 123 (no increase) ✅
    Agent runs: make lint
    Agent pastes: "no new offenses detected" ✅

STEP 4: Verify (/sk:test)

  AGENT verifies each AC with specific evidence:
    AC-1: "CSV export downloads a file"
      → runs spec, pastes output, records evidence
    AC-2: "CSV contains correct columns"
      → runs spec, pastes output, records evidence

STEP 5: Ship (/sk:finish)

  /sk:code-review on diff → APPROVE
  /sk:commit → conventional commit, push, create PR
  Task board updated
```

### 14.4 Brownfield-Specific Command Adaptations

| Command | Brownfield Adaptation |
|---|---|
| `/sk:init-docs` | Scans actual code, not ideals. Documents what IS, not what SHOULD BE. Records test baseline including known failures. Detects build commands from manifests, Makefile, and CI. |
| `/sk:plan` | Must scan for existing patterns and follow them. Phase Analysis records "following pattern from X." Subtasks include test setup if no runner exists. |
| `/sk:dev` | TDD skill uses brownfield mode: characterization tests for existing code, strict TDD for new code. Convention compliance checks against observed patterns, not aspirational ones. |
| `/sk:test` | Baseline comparison: "existing failures: 123, after changes: 123 (no increase)." New code must have tests. Existing untested code gets characterization tests if modified. |
| `/sk:refactor` | Critical in brownfield. Safety net requirement: cannot refactor without test coverage. Write characterization tests first, then refactor, then verify behavior unchanged. |
| `/sk:debug` | Often harder in brownfield — undocumented coupling, hidden state, legacy patterns. Hypothesis testing must consider: "is this a new bug or existing behavior I don't understand?" |
| `/sk:code-review` | Must evaluate against existing patterns, not ideal patterns. "This doesn't follow best practices" is not a finding if the entire codebase uses that pattern. "This doesn't match the existing codebase pattern" IS a finding. |

### 14.5 The Brownfield Gradient

Not all brownfield is the same. Skills adapt based on codebase maturity:

```
LEGACY (no tests, no docs, no conventions)
  ├── First priority: /sk:init-docs (establish baseline)
  ├── Skills: TDD in brownfield mode, verification with manual evidence
  ├── Every task should include a [DEV] subtask for test setup if none exists
  └── /sk:refactor is your most-used command

MATURE BROWNFIELD (tests exist, some docs, some conventions)
  ├── /sk:init-docs fills gaps
  ├── Skills: TDD in standard mode for new code, brownfield for modifications
  ├── Verification: test baseline comparison + new test output
  └── Normal lifecycle works with minor adaptations

WELL-MAINTAINED (good tests, CI, docs, but not using SK)
  ├── /sk:init-docs documents existing system
  ├── Skills: standard mode — codebase is ready for strict TDD
  ├── Verification: standard mode — test suite is reliable
  └── Full lifecycle works as designed, minimal adaptation needed
```

### 14.6 Key Principle: Match, Don't Moralize

The most important brownfield rule across all skills and commands:

```
WRONG: "This codebase uses callbacks. Best practice is async/await. I'll use async/await."
RIGHT: "This codebase uses callbacks. I'll use callbacks to match existing patterns."

WRONG: "This test file uses Mocha. Jest is better. I'll set up Jest."
RIGHT: "This test file uses Mocha. I'll write my tests with Mocha."

WRONG: "This code doesn't follow SOLID principles. Let me refactor first."
RIGHT: "This code has its own patterns. I'll follow them unless /sk:refactor says otherwise."
```

The agent's job is to make the codebase incrementally better by matching what exists and adding tested, reviewed, verified code — not to rewrite the world.

**Exception:** If the task EXPLICITLY says "migrate from X to Y" or "refactor to use Z pattern," then the change is in scope and the agent should follow the new pattern. But only where the task says to, and only for the files the task covers.

---

## 15. What Doesn't Change

- **19 of 25 commands** stay exactly as they are
- **CLAUDE.md** structure stays the same (add `/sk:finish` to table)
- **docs/** structure stays the same
- **Task file format** stays the same
- **Lifecycle** stays Plan → Dev → Test (skills enhance execution within phases, not between them)
- **coding-behavior.md** stays the same (skills enforce what it documents)
- **All existing workflows** continue to work — skills are additive, not breaking
- **Brownfield projects** use the same commands and skills — skills adapt their strictness based on codebase maturity, not force greenfield ideals onto legacy code
