# Deduplication Analysis: Reports vs Current Codebase

**Date:** 2026-03-22
**Purpose:** Map what our earlier reports recommended against what already exists, identify true gaps, and define what skills/agents would actually add on top of the existing 24 commands.

---

## 1. What Already Exists (and Our Reports Didn't Know About)

The SK codebase has grown from 12 to 24 commands. Many of our recommendations are already implemented:

| Report Recommendation | Already Exists As | Coverage |
|---|---|---|
| `/sk:explore` or `/sk:brainstorm` | **`/sk:brainstorm`** | ~90% — structured design exploration with research, approach proposals, epic+task output |
| `/sk:review` | **`/sk:code-review`** | ~95% — 5-category analysis, severity classification, verdict |
| `/sk:debug` | **`/sk:debug`** | ~95% — reproduce, isolate, hypothesis, fix, regression test, escalation |
| `/sk:finish` | **`/sk:commit`** | ~60% — commit+push+PR covered, but no final review dispatch, no worktree cleanup |
| "Surface assumptions" | **`coding-behavior.md`** principle #1 | Built into `plan.md` and `dev.md` |
| "Verification with evidence" | **`coding-behavior.md`** principle #4 | Referenced in `test.md` goal transformation |
| "Do exactly what was asked" | **`coding-behavior.md`** principle #2 | Referenced in `dev.md` self-review |
| "Keep it simple" | **`coding-behavior.md`** principle #3 | Referenced in `plan.md` exit gate |
| Security review | **`/sk:security-review`** | Not in our report — already exceeds it |
| UI review | **`/sk:ui-review`** | Not in our report — already exceeds it |
| Performance review | **`/sk:perf-review`** | Not in our report — already exceeds it |
| Refactoring workflow | **`/sk:refactor`** | Not in our report — already exceeds it |
| Dependency health | **`/sk:deps`** | Not in our report — already exists |
| Changelog generation | **`/sk:changelog`** | Not in our report — already exists |
| Project kickoff | **`/sk:kickoff`** | Not in our report — already exists |

**Bottom line:** 4 of our 4 proposed new commands already exist. The command layer is comprehensive.

---

## 2. What's Still Missing (True Gaps)

Despite 24 commands, there are no skills (`.claude/skills/`) and no agents (`.claude/agents/`). This is the real gap. Here's why it matters:

### The Command vs Skill Distinction

```
COMMANDS = "What to do when explicitly invoked"
   User runs /sk:dev → agent follows the dev.md script

SKILLS = "How to behave at all times, regardless of what command is running"
   Agent is writing code → TDD skill constrains HOW it writes code
   Agent claims "done" → verification skill requires PROOF
   Agent hits 3 failures → debugging skill forces escalation
```

**The problem today:** The 4 coding behavior principles in `coding-behavior.md` are excellent, but they are only *documentation*. Commands *reference* them ("check conventions"), but don't *enforce* them. An agent can read "verify with evidence" and still write "it works" — there's no behavioral constraint that intervenes.

**What skills add:** Skills are behavioral constraints that are active during command execution. They don't duplicate command logic — they add guardrails that commands invoke.

### Gap Map

| Gap | Type | Why Commands Don't Cover It |
|---|---|---|
| **TDD enforcement** | Skill | `/sk:dev` says "write tests" but doesn't enforce RED-GREEN-REFACTOR order. Agent still writes code first. |
| **Verification evidence** | Skill | `/sk:test` says "be specific" but agent can still write "it works." Need an iron law. |
| **Subagent dispatch** | Skill + Agents | No command dispatches fresh subagents. All work happens in one accumulated context. |
| **Per-subtask review** | Skill | `/sk:code-review` is run manually after dev. No automatic review per subtask during dev. |
| **Escalation rules** | Skill | `/sk:debug` has good process but no "after 3 failures, stop" rule active during `/sk:dev`. |
| **Git worktrees** | Skill | No command sets up isolated workspaces. |
| **Plan review via subagent** | Skill + Agent | `/sk:plan` validates manually. No subagent checks plan quality. |
| **Finish workflow** | Command gap | `/sk:commit` handles git but not final review, worktree cleanup, or task board update. |

---

## 3. The Architecture: Commands + Skills + Agents

### Layer 1: Commands (already exist — 24 commands)

Commands stay as-is. They define explicit workflows invoked by the user. No duplication needed.

### Layer 2: Skills (new — behavioral rules)

Skills are reusable behavioral constraints that commands *invoke* during execution. A skill is NOT a duplicate of a command — it's a rule that applies *across* commands.

**Key principle: A skill should never duplicate command logic. It should add a behavioral constraint that multiple commands share.**

### Layer 3: Agents (new — specialized workers)

Agents are prompt templates for dispatching subagents with fresh context. They execute specific roles (implement, review, validate) without the accumulated context of the parent session.

---

## 4. Skills That Don't Duplicate (Proposed)

Each skill below adds something that NO existing command provides:

### 4.1 `verification-before-completion` (Safety)

**What it adds:** An iron law enforced across ALL commands, not just `/sk:test`.

```
IRON LAW: No completion claims without fresh verification evidence.
- You MUST run the actual test/check command in this session
- You MUST paste the output (not summarize it)
- "It works", "tests pass", "looks good" are NOT evidence
- This applies to: /sk:dev exit gate, /sk:test AC verification,
  /sk:implement close-out, /sk:refactor verification, /sk:debug verify
```

**Why this isn't a duplicate of `/sk:test`:** `/sk:test` is a command you run once. This skill is an always-on constraint that activates whenever ANY command claims something is done. It affects `/sk:dev`, `/sk:implement`, `/sk:refactor`, `/sk:debug` — not just `/sk:test`.

**Commands that invoke it:** `/sk:dev` (exit gate), `/sk:test` (AC verification), `/sk:implement` (close-out), `/sk:refactor` (Step 7), `/sk:debug` (Step 8)

---

### 4.2 `test-driven-development` (Safety)

**What it adds:** Enforcement of RED-GREEN-REFACTOR ordering that no command currently provides.

```
IRON LAW: No production code without a failing test first.

For each feature unit during /sk:dev:
  1. Write the test FIRST (it must FAIL — show the failure output)
  2. Write the minimum code to make it pass (show the pass output)
  3. Refactor (show tests still pass)

ANTI-PATTERNS (never do these):
  - Writing code before its test
  - Keeping code written before tests "as reference"
  - "Too simple to test"
  - "I'll write the test after"
  - Testing implementation details instead of behavior
```

**Why this isn't a duplicate of `/sk:dev`:** `/sk:dev` says `[TEST]` subtasks exist but doesn't enforce their *ordering* relative to `[DEV]` subtasks. The current subtask pattern is: all `[DEV]` first, then all `[TEST]`. TDD skill reverses this: test first, then implement, for each unit.

**Commands that invoke it:** `/sk:dev` (subtask execution), `/sk:implement` (dev phase), `/sk:debug` (regression test)

---

### 4.3 `escalation-rules` (Safety)

**What it adds:** A circuit breaker that no command currently provides.

```
RULE: After 3 failed attempts to fix the same issue, STOP.

Do not try a 4th approach. Instead:
  1. Is the subtask too large? → Break it down further
  2. Is the plan wrong? → Return to /sk:plan
  3. Is the approach wrong? → Return to /sk:brainstorm
  4. Is this a deeper bug? → Switch to /sk:debug

This rule applies during: /sk:dev, /sk:implement, /sk:refactor
```

**Why this isn't a duplicate:** No command has a failure counter or escalation path. `/sk:debug` has "question the architecture" but only when you're already debugging — not during normal dev work.

**Commands that invoke it:** `/sk:dev` (subtask execution), `/sk:implement` (dev phase), `/sk:refactor` (execution)

---

### 4.4 `subagent-driven-development` (Execution — optional)

**What it adds:** Fresh-context execution that no command can do on its own.

```
PATTERN: For each subtask, optionally dispatch a fresh subagent.

Why: After 5+ subtasks, the parent context is polluted with earlier
decisions, failed attempts, and accumulated state. A fresh subagent
starts clean with only: subtask spec, file paths, conventions.

Implementer subagent reports:
  DONE                → Continue to review
  DONE_WITH_CONCERNS  → Review the concerns, then continue
  NEEDS_CONTEXT       → Provide missing info and re-dispatch
  BLOCKED             → Human decision needed

Two-stage review after each subtask:
  Stage 1: Spec compliance — does code match the plan?
  Stage 2: Code quality — clean code, conventions, tests?
```

**Why this isn't a duplicate:** No existing command dispatches subagents. This is an entirely new execution model that sits alongside direct execution.

**Commands that invoke it:** `/sk:dev` (optional mode), `/sk:implement` (optional mode)

**Agent definitions needed:**
- `agents/implementer.md` — subtask executor prompt template
- `agents/spec-reviewer.md` — spec compliance checker prompt template
- `agents/quality-reviewer.md` — code quality checker prompt template

---

### 4.5 `git-worktrees` (Execution — optional)

**What it adds:** Workspace isolation that no command currently provides.

```
PATTERN: Create an isolated git worktree for feature work.

Steps:
  1. Create worktree: git worktree add ../project-feature feature-branch
  2. Verify .gitignore protections
  3. Install dependencies
  4. Run baseline tests (confirm green before starting)
  5. Work in isolation
  6. Clean up worktree when done

This prevents feature work from polluting the main working tree.
```

**Why this isn't a duplicate:** `/sk:commit` handles git operations but never sets up worktrees. `/sk:dev` and `/sk:implement` work in the current directory.

**Commands that invoke it:** `/sk:dev` (optional setup), `/sk:implement` (optional setup), `/sk:finish` (cleanup)

---

## 5. What NOT to Create as Skills

These would duplicate existing commands:

| Proposed Skill | Don't Create Because |
|---|---|
| `brainstorming` | `/sk:brainstorm` already covers this completely |
| `systematic-debugging` | `/sk:debug` already covers this completely |
| `code-review` | `/sk:code-review` already covers this completely |
| `writing-plans` | `/sk:plan` already covers this completely |
| `finishing-a-branch` | `/sk:commit` covers most of this |

**Exception:** If we want `/sk:plan` to automatically dispatch a plan-reviewer subagent, that logic belongs in the `subagent-driven-development` skill (as a review dispatch pattern), not in a separate `writing-plans` skill.

---

## 6. Commands to Enhance (Not Replace)

These existing commands should be updated to *invoke* the new skills:

### `/sk:dev` — Add skill references

```markdown
## Step 4: Execute Subtasks

### TDD Mode (recommended)
Invoke the `test-driven-development` skill:
For each feature unit, write the test FIRST (RED), then implement (GREEN), then refactor.

### Escalation
If a subtask fails 3+ times, invoke the `escalation-rules` skill:
Stop. Break down further, revise plan, or switch to /sk:debug.

### Subagent Mode (optional)
For large tasks or long sessions, invoke the `subagent-driven-development` skill:
Dispatch a fresh subagent per subtask with two-stage review.

## Step 8: DEV Exit Gate
Invoke the `verification-before-completion` skill:
Run the actual test suite and paste the output. "Tests pass" is not evidence.
```

### `/sk:test` — Add verification enforcement

```markdown
## Step 4: Verify Acceptance Criteria
Invoke the `verification-before-completion` skill:
For each AC, run the specific test/command and PASTE THE OUTPUT.
```

### `/sk:implement` — Add skill references throughout

```markdown
## Step 4: DEV Phase
- TDD skill active (test-driven-development)
- Escalation skill active (escalation-rules)
- Subagent dispatch available (subagent-driven-development)

## Step 5: TEST Phase
- Verification skill active (verification-before-completion)
```

### `/sk:plan` — Add optional plan review

```markdown
## Step 5: Validate Plan (enhanced)
Optionally dispatch a plan-reviewer subagent to check:
- Are ACs truly testable?
- Are subtasks truly S complexity?
- Are file paths real (verified against codebase)?
```

### `/sk:refactor` — Add verification enforcement

```markdown
## Step 7: Verify
Invoke the `verification-before-completion` skill:
Run the full test suite and PASTE OUTPUT. Compare to baseline.
```

### `/sk:commit` — Add finish workflow

```markdown
## Step 6.5: Task Board Update (if task-tracked work)
If this commit completes a tracked task:
1. Update task status to done
2. Update docs/tasks/README.md
3. Clean up worktree (if used)
```

---

## 7. One New Command Needed: `/sk:finish`

`/sk:commit` handles git (stage, commit, push, PR) but doesn't handle the full "end of feature work" flow. A thin `/sk:finish` command would:

```
/sk:finish = /sk:code-review (on branch diff)
           + /sk:commit (stage, commit, push, PR)
           + task board update
           + worktree cleanup
```

This is an orchestration command that chains existing commands — no new logic needed.

---

## 8. Final Architecture

```
.claude/
├── commands/sk/           # 25 commands (24 existing + 1 new)
│   ├── brainstorm.md      # KEEP as-is
│   ├── plan.md            # ENHANCE — add optional plan review subagent
│   ├── dev.md             # ENHANCE — add TDD, escalation, subagent skill refs
│   ├── test.md            # ENHANCE — add verification-before-completion ref
│   ├── implement.md       # ENHANCE — add skill references throughout
│   ├── code-review.md     # KEEP as-is
│   ├── debug.md           # KEEP as-is
│   ├── refactor.md        # ENHANCE — add verification-before-completion ref
│   ├── commit.md          # ENHANCE — add task board update
│   ├── finish.md          # NEW — orchestrates review + commit + cleanup
│   ├── kickoff.md         # KEEP as-is
│   ├── security-review.md # KEEP as-is
│   ├── ui-review.md       # KEEP as-is
│   ├── perf-review.md     # KEEP as-is
│   ├── deps.md            # KEEP as-is
│   ├── changelog.md       # KEEP as-is
│   ├── new-task.md        # KEEP as-is
│   ├── new-epic.md        # KEEP as-is
│   ├── new-adr.md         # KEEP as-is
│   ├── new-sop.md         # KEEP as-is
│   ├── new-flow.md        # KEEP as-is
│   ├── task-status.md     # KEEP as-is
│   ├── update-docs.md     # KEEP as-is
│   ├── init-docs.md       # KEEP as-is
│   └── update.md          # KEEP as-is
│
├── skills/                # 5 skills (NEW — none exist today)
│   ├── verification-before-completion/
│   │   └── SKILL.md       # "No claims without evidence" — cross-command
│   ├── test-driven-development/
│   │   ├── SKILL.md       # RED-GREEN-REFACTOR enforcement
│   │   └── anti-patterns.md
│   ├── escalation-rules/
│   │   └── SKILL.md       # "3 failures → stop and rethink"
│   ├── subagent-driven-development/
│   │   └── SKILL.md       # Fresh context per subtask + two-stage review
│   └── git-worktrees/
│       └── SKILL.md       # Isolated workspace management
│
└── agents/                # 3 agents (NEW — none exist today)
    ├── implementer.md     # Subtask executor (used by SDD skill)
    ├── spec-reviewer.md   # Spec compliance checker (used by SDD skill)
    └── quality-reviewer.md # Code quality checker (used by SDD skill)
```

### How They Connect

```
/sk:dev invokes:
  ├── ALWAYS: verification-before-completion (exit gate)
  ├── RECOMMENDED: test-driven-development (subtask execution)
  ├── ALWAYS: escalation-rules (failure handling)
  └── OPTIONAL: subagent-driven-development (dispatch mode)
       └── uses: implementer, spec-reviewer, quality-reviewer agents

/sk:test invokes:
  └── ALWAYS: verification-before-completion (AC verification)

/sk:implement invokes:
  ├── ALL skills from /sk:dev
  └── ALL skills from /sk:test

/sk:refactor invokes:
  └── ALWAYS: verification-before-completion (behavior verification)

/sk:debug invokes:
  └── ALWAYS: verification-before-completion (fix verification)

/sk:finish invokes:
  ├── /sk:code-review (on branch diff)
  ├── /sk:commit (stage, commit, push, PR)
  └── git-worktrees skill (cleanup)
```

---

## 9. Summary

| Layer | Count | Status | Action |
|---|---|---|---|
| **Commands** | 24 → 25 | Comprehensive | Add `/sk:finish`, enhance 5 existing commands with skill references |
| **Skills** | 0 → 5 | Missing entirely | Create 5 non-duplicating behavioral rules |
| **Agents** | 0 → 3 | Missing entirely | Create 3 prompt templates for subagent dispatch |
| **Conventions** | 6 files | Strong | No changes — `coding-behavior.md` already covers principles |

**What we avoided:**
- No skill duplicates of existing commands (brainstorming, debugging, code-review, writing-plans)
- No command renames (keep `/sk:dev`, `/sk:test` — no confusion)
- No unnecessary skills (only 5, not 8 — cut 3 that would duplicate commands)
- No over-engineering the agent layer (only 3 agents, all used by one skill)

**The key insight:** Commands are complete. What's missing is the behavioral enforcement layer (skills) and the fresh-context execution layer (agents). Skills don't repeat what commands say — they add constraints that commands invoke.
