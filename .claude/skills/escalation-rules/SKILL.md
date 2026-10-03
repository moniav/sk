---
name: escalation-rules
description: Stops retrying after three failed attempts at the same problem and presents structured options to the user. Use when a fix, test or subtask has failed repeatedly, or the work is going in circles.
---

# Escalation Rules

> After 3 failed attempts on the same problem, stop and escalate.

## The Rule

If you've tried 3 different approaches and none solved the problem:

1. **Stop.** Do not try a 4th approach.
2. **State what you tried** and why each failed.
3. **Present options:**

| Option | When to Choose |
|--------|----------------|
| **(a) Break it down** | Subtask is too large — split into smaller pieces |
| **(b) Revise the plan** | The approach is wrong — return to `/sk:plan` |
| **(c) Rethink entirely** | Fundamental approach is wrong — return to `/sk:brainstorm` |
| **(d) Debug systematically** | Deeper bug — switch to `/sk:debug` |

4. **Let the user decide.** Do not pick an option yourself.

## What Counts as a Failure

An attempt that doesn't solve the problem:
- Test still fails after your change
- Build breaks after your change
- A different test breaks as a result
- Behavior doesn't match expectations

Variations on the same approach count as separate attempts (e.g., 3 different regex patterns = 3 attempts).

## Brownfield Additions

In legacy codebases, also consider:

| Option | When to Choose |
|--------|----------------|
| **(e) Characterize first** | Undocumented behavior you're breaking? Write characterization tests |
| **(f) Map dependencies** | Hidden coupling? Trace the dependency chain |
| **(g) Refactor first** | Code too tangled? `/sk:refactor` as prerequisite |
| **(h) Adjust prerequisites** | Codebase worse than assumed? Add prerequisite subtasks |

## Model Tier for Dispatched Subtasks

Agents run on the model their definition names. Override it at dispatch only in these two cases:

- **Start cheaper:** a subtask of an XS or S task that names exact file paths may start the `implementer` on `haiku`.
- **Escalate on failure:** when a dispatched subtask fails review twice, or returns `NEEDS_CONTEXT` after the missing context was supplied, re-dispatch it one tier up: `haiku` → `sonnet` → `opus`. Say that you escalated and why.

A subtask that still fails on the top tier is a failed attempt under The Rule above: stop and present the options.
