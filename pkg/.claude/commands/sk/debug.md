---
description: "Systematic debugging: reproduce, isolate, fix, verify with a regression test. Use when the user reports a bug, an error, a failing test or unexpected behaviour and wants it diagnosed and fixed."
argument-hint: "[bug description or error message]"
---

# Debug — Systematic Bug Investigation

Reproduce, isolate, fix, verify. Change as little as possible while eliminating the defect.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

Copy the steps below into your todo list before starting. A step you decide not to do stays on the list as "skip: <reason>".

## Rules and Gates

- **Reproduce first.** No hypotheses and no code changes until a reproduction has actually been run in this session and seen to fail (Step 4).
- **No blind fixes.** If you cannot build a repeatable pass/fail signal (no repro, no access, no observable signal), halt and request the missing access or artifacts.
- **Hypotheses are falsifiable.** 3 to 5, ranked, each with a prediction that could prove it wrong (Step 5).
- **Three wrong hypotheses:** stop fixing and follow `${CLAUDE_PLUGIN_ROOT}/.claude/skills/escalation-rules/SKILL.md`: question whether the architecture or design is the real problem.
- **Red, then green.** The regression test must be seen failing before the fix and passing after it; paste both outputs (Steps 6 to 8).
- **Minimal diff.** Change only what fixes the root cause, in the existing code style. No drive-by fixes or refactors. Fix the cause, not the symptom.
- **Evidence, not claims.** Every "reproduced", "root cause" and "fixed" statement is backed by pasted output.

## Step 1: Read Context

Read, skipping files that are empty or contain only template placeholders:
1. `docs/system/project-context.md` (if it exists)
2. `docs/conventions/code-style.md`
3. `docs/conventions/testing.md`
4. `docs/system/tech-stack.md`

## Step 2: Scope and Track

- **XS/S** (obvious cause, 1-2 files): proceed directly, no task file.
- **M** (investigation needed, 3+ files): create a task file first. Scan `docs/tasks/TASK-*.md` for the next number, create `docs/tasks/TASK-{N}-S-{kebab-name}.md` from `docs/templates/task-prd.md` with `phase: dev`, `status: in-progress`.
- **L/XL** (systemic, cross-cutting): create a task file, and consider whether this is really an epic.

For M+ bugs, update `docs/tasks/README.md` to track the fix.

## Step 3: Gather Bug Report

Ask the user for whichever of these is missing:

| Field | What to capture |
|-------|----------------|
| **Symptom** | Exact error message, wrong behavior, or crash |
| **Expected** | What should happen instead |
| **Steps to reproduce** | Exact sequence to trigger the bug |
| **Environment** | OS, browser, runtime version, relevant config |
| **Frequency** | Always, sometimes, or only under specific conditions |
| **When it started** | Recent change, always broken, or unknown |

If the user provides a GitHub issue number, read it with `gh issue view <N>`.

## Step 4: Reproduce

Run the reproduction steps exactly as described and capture the actual output (error message, stack trace, wrong result) and the exact failure point (which line, assertion, or response).
Then reduce it to a repeatable pass/fail signal: a failing test, a script, a `curl` command, or a specific log line.

If it does not reproduce: ask about environment differences, check whether it is intermittent (race condition, timing, external dependency), try variations of the steps, and check whether it is already fixed on the current branch.
If it still does not reproduce, apply the "No blind fixes" rule.

**Done when** you can name ONE command (or exact scripted sequence), already run in this session, that fails because of this bug. Show the command and its output, then state: "Reproduced: yes. The bug manifests as [exact symptom] at [location]."

## Step 5: Isolate

### 5a: Trace the Execution Path

From the entry point (route handler, event handler, CLI command), follow the code path that triggers the bug with Grep/Read.
Done when you can list the call chain from entry point to failure point, and for each data transform what goes in and what comes out.

### 5b: Form Hypotheses

Write **3 to 5 ranked hypotheses**, most likely first, each in this form:
> "The bug occurs because [specific cause] in [specific location], which results in [specific symptom]. Prediction: [a single test or log line] will show [X]; if it shows [Y], this hypothesis is wrong."

Alongside them, list what you are assuming about the data flow and about the state at the failure point.

### 5c: Test the Hypotheses

Check each hypothesis's prediction in rank order, with the smallest investigation that settles it:
- Add a log or breakpoint to confirm the data flow. Tag every temporary debug log with a unique prefix such as `[DEBUG-a4f2]` so it can be found and removed.
- Check recent changes to the suspect code: `git log --oneline -10 -- <file>`
- Read the tests covering the suspect code: is the failing case tested?

Record each result as confirmed or refuted, with the output that decided it.

### 5d: When Hypotheses Run Dry

If the ranked hypotheses are exhausted, or the error comes from a third-party library, **WebSearch the exact error message** (quoted, minus project-specific paths) plus the library name and version.
Apply the source discipline from `${CLAUDE_PLUGIN_ROOT}/.claude/skills/research/SKILL.md`: prefer the library's issue tracker/changelog over forum guesses, and verify any suggested fix against your reproduction before trusting it.

### 5e: Root Cause, Not Symptom

Before leaving this step, answer in writing:
- Would fixing this location prevent the bug, or only mask it?
- Which other code paths have the same underlying problem? (Search for them; list the matches or state "none found".)

**Done when** one hypothesis's prediction has been observed (output shown) and you can state: "Root cause: [specific cause] in `file:line`. This happens because [mechanism]."

## Step 6: Write the Regression Test (red)

Before touching the defective code, write a test for the exact scenario that broke, not a generic one.
Name it `[expected behavior] when [condition that caused the bug]`, following `docs/conventions/testing.md`.

**Done when** you have run the test against the unfixed code and pasted its failing output, and the failure is the bug's symptom (not a setup or syntax error).
If a test for this bug is not practical, apply "When a test first is not practical" in `${CLAUDE_PLUGIN_ROOT}/.claude/skills/test-driven-development/SKILL.md`: say why, and use the Step 4 reproduction command as the before and after check instead.

## Step 7: Fix

1. Make the minimal change at the root cause (see Rules).
2. If the same root cause exists in several places, fix all of them.
3. Re-read your diff and list every line that is not required by the fix; remove those lines.

## Step 8: Verify (green)

Read `${CLAUDE_PLUGIN_ROOT}/.claude/skills/verification-before-completion/SKILL.md` before claiming the fix works.

Run each of these and paste the actual output:
1. The regression test from Step 6: now passes.
2. The reproduction command from Step 4: the bug is gone.
3. The project's full test suite, type-check and lint commands (see CLAUDE.md Build Commands): no new failures.
4. A search for the debug-log prefix from 5c: no matches remain.

For the other code paths found in 5e: fix them too, or list them as follow-up.

## Step 9: Close Out

Present to the user:

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
- [ ] Regression test failed before the fix and passes after it
- [ ] Full test suite passes
- [ ] No drive-by changes included

### Documentation (if a task file was created)
- [ ] Task file marked `phase: done`, `status: done`
- [ ] `docs/tasks/README.md` updated
- [ ] `docs/system/` updated (if the fix changed APIs, schema, or stack)

### Save Investigation (M+ complexity only)

If several hypotheses were tested or the root cause was complex, ask: **"Save investigation trace to `docs/research/YYYY-MM-DD-{bug-name}.md`?"**
If yes, save using `docs/templates/research-doc.md`: symptom, hypotheses tested, root cause found, fix applied.

### Postmortem (production incidents only)

If the bug had user-facing impact, downtime, or a data issue in production, ask: **"Write a blameless postmortem to `docs/operations/postmortems/`?"**
If yes, use `docs/templates/postmortem.md` (summary, impact, timeline, root cause, contributing factors, action items) and add a row to `docs/operations/README.md`.

### Follow-up (if any)
- Related issues found during investigation
- Broader patterns that might need attention

**Reply:** what was broken, the root cause (mechanism, not just location), the fix, and the failing-then-passing output of the regression test, pasted verbatim.
