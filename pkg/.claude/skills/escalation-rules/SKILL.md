---
name: escalation-rules
description: >
  Prevents wasted effort by stopping after 3 failed attempts and presenting
  structured options to the user. Use this skill whenever you find yourself
  stuck on the same problem, retrying the same fix, going in circles on a bug,
  or when a subtask keeps failing. Also activates during /sk:dev, /sk:implement,
  /sk:refactor, and /sk:debug execution. If you've tried multiple approaches and
  none worked, this skill tells you when and how to stop and escalate.
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
