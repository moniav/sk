---
description: "Systematic debugging: reproduce, isolate, fix, verify with a regression test. Use when the user reports a bug, an error, a failing test or unexpected behaviour and wants it diagnosed and fixed."
argument-hint: "[bug description or error message]"
---

# Debug — Systematic Bug Investigation

Find and fix bugs using a structured workflow: reproduce, isolate, fix, verify. Unlike feature work, the goal is to change as little as possible while eliminating the defect.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. `docs/conventions/code-style.md` — Coding standards
3. `docs/conventions/testing.md` — Testing patterns
4. `docs/system/tech-stack.md` — Current stack

**Skip files that are empty or contain only template placeholders.**

## Step 2: Scope and Track

Assess bug complexity:
- **XS/S** (obvious cause, 1-2 files) — proceed directly, no task file needed
- **M** (investigation needed, 3+ files) — create a task file first: scan `docs/tasks/TASK-*.md` for next number, create `docs/tasks/TASK-{N}-S-{kebab-name}.md` from `docs/templates/task-prd.md` with `phase: dev`, `status: in-progress`
- **L/XL** (systemic issue, cross-cutting) — create a task file, consider if this is really an epic

For M+ bugs, update `docs/tasks/README.md` to track the fix.

## Step 3: Gather Bug Report

Ask the user for:

| Field | What to capture |
|-------|----------------|
| **Symptom** | What is happening? (exact error message, wrong behavior, crash) |
| **Expected** | What should happen instead? |
| **Steps to reproduce** | Exact sequence to trigger the bug |
| **Environment** | OS, browser, runtime version, relevant config |
| **Frequency** | Always, sometimes, only under specific conditions? |
| **When it started** | Recent change, always broken, or unknown? |

If the user provides a GitHub issue number, read it with `gh issue view <N>`.

## Step 4: Reproduce

Before investigating code, confirm the bug is reproducible:

1. **Run the reproduction steps** exactly as described
2. **Capture the actual output** — error message, stack trace, wrong result
3. **Note the exact failure point** — which line, which assertion, which response

If the bug cannot be reproduced:
- Ask clarifying questions about environment differences
- Check if it's intermittent (race condition, timing, external dependency)
- Try variations of the reproduction steps
- Check if it was already fixed on the current branch

**Feedback-loop gate:** You need a tight, repeatable pass/fail signal — a failing test, a script, a `curl` command, a specific log line — *before* you start changing code. Build the right feedback loop and the bug is 90% fixed. If you genuinely cannot build one (no repro, no access, no observable signal), **halt and request the missing access or artifacts** rather than guessing at fixes blind.

**Checkpoint:** State clearly: "Reproduced: [yes/no]. The bug manifests as [exact symptom] at [location]."

## Step 5: Isolate

Narrow down the root cause. Work methodically — do NOT jump to a fix.

### 5a: Trace the Execution Path

Starting from the entry point (route handler, event handler, CLI command):
1. Use Grep/Read to follow the code path that triggers the bug
2. Identify every function call in the chain
3. Note where data transforms — what goes in vs what comes out

### 5b: Form Hypotheses

Based on the trace, write **3–5 ranked, falsifiable hypotheses** — most likely first. Each must be specific enough that a single test or log line could prove it wrong:
> "The bug occurs because [specific cause] in [specific location], which results in [specific symptom]."

Ranking forces you past your first instinct; listing several stops you from committing prematurely to the wrong one.

**Surface your assumptions.** Before investigating further, list what you're assuming:
- What do you assume about the data flow?
- What do you assume about the state at the failure point?
- Could the bug have a different root cause than your first instinct?

### 5c: Verify the Hypothesis

Test your top hypothesis with minimal investigation — do not assume it is correct:
- Add a strategic log/breakpoint to confirm the data flow — tag temporary debug logs with a unique prefix like `[DEBUG-a4f2]` so every line is trivial to find and remove once the fix lands
- Check the git log for recent changes to the suspect code: `git log --oneline -10 -- <file>`
- Read the test coverage for the suspect code — is the failing case tested?

### 5d: When Hypotheses Run Dry — Search the Error

If your ranked hypotheses are exhausted (or the error is from a third-party
library), **WebSearch the exact error message** (quoted, minus project-specific
paths) plus the library name and version. Known issues, fixed bugs, and version
incompatibilities often surface immediately. Apply the source discipline from
`${CLAUDE_PLUGIN_ROOT}/.claude/skills/research/SKILL.md`: prefer the library's issue tracker/changelog
over forum guesses, and verify any suggested fix against your reproduction before
trusting it.

### 5e: Escalation Check

If your hypothesis is wrong 3 times, follow `${CLAUDE_PLUGIN_ROOT}/.claude/skills/escalation-rules/SKILL.md`: stop fixing and question whether the architecture or design is the real problem.

### 5f: Identify Root Cause vs Symptom

Ask yourself:
- Is this the **root cause** or a **symptom** of a deeper issue?
- Would fixing this location prevent the bug, or would it just mask it?
- Are there other code paths with the same underlying problem?

**Checkpoint:** State clearly: "Root cause: [specific cause] in `file:line`. This happens because [explanation]."

## Step 6: Fix

Apply the minimal change that eliminates the root cause:

### Fix Principles
- **Minimal diff** — change only what's necessary to fix the bug
- **Same patterns** — follow existing code style and conventions
- **No drive-by fixes** — resist the urge to refactor surrounding code
- **Fix the cause, not the symptom** — address the root, not a band-aid

### Implementation
1. Make the fix in the identified location
2. If the fix requires changes in multiple places (same root cause), fix all of them
3. Self-review: does this fix introduce any new issues?

## Step 7: Write Regression Test

Every bug fix MUST include a test that:

1. **Fails without the fix** — proves the test catches the bug
2. **Passes with the fix** — proves the fix works
3. **Tests the specific scenario** — not a generic test, but the exact case that broke

**Test naming convention:**
```
# TypeScript
it('should [expected behavior] when [condition that caused the bug]')

# Python
def test_[behavior]_when_[condition_that_caused_bug]():
```

Follow the project's testing conventions from `docs/conventions/testing.md`.

## Step 8: Verify

Read `${CLAUDE_PLUGIN_ROOT}/.claude/skills/verification-before-completion/SKILL.md` before claiming the fix works.
You MUST paste the actual test output showing the regression test passes and the full suite has no new failures.

### 8a: Confirm the Fix
1. Re-run the original reproduction steps — bug should be gone
2. Verify with specific evidence (exact output, not "it works now")
3. Run the new regression test — should pass
4. Run the full test suite — no regressions

### 8b: Check for Related Issues
- Are there similar patterns elsewhere that might have the same bug?
- If yes, fix those too (or note them as follow-up)

### 8c: Run Project Tests
```bash
# Run your project's test, type-check, and lint commands
# (check CLAUDE.md Build Commands for exact commands)
```

## Step 9: Close Out

Present to user:

### Bug Report
| Field | Detail |
|-------|--------|
| **Symptom** | What was happening |
| **Root cause** | Why it was happening |
| **Fix** | What was changed |
| **Regression test** | Test file and name |
| **Files changed** | List of modified files |

### Verification
- [ ] Bug no longer reproducible
- [ ] Regression test passes
- [ ] Full test suite passes
- [ ] No drive-by changes included

### Documentation (if task file was created)
- [ ] Task file marked `phase: done`, `status: done`
- [ ] `docs/tasks/README.md` updated
- [ ] `docs/system/` updated (if the fix changed APIs, schema, or stack)

### Save Investigation (Optional — only for M+ complexity)

If the investigation was substantial (multiple hypotheses tested, complex root cause), ask: **"Save investigation trace to `docs/research/YYYY-MM-DD-{bug-name}.md`?"**

If yes, save using `docs/templates/research-doc.md`: symptom, hypotheses tested, root cause found, fix applied.

### Postmortem (if this was a production incident)

If the bug was a **production incident** (user-facing impact, downtime, data issue), ask:
**"Write a blameless postmortem to `docs/operations/postmortems/`?"**

If yes, use `docs/templates/postmortem.md` (summary, impact, timeline, root cause,
contributing factors, action items) and add a row to `docs/operations/README.md`.

### Follow-up (if any)
- Related issues found during investigation
- Broader patterns that might need attention
