# Skill: Escalation Rules

> **Rule:** After 3 failed attempts on the same subtask or issue, STOP.

## When This Skill Is Active

This skill is active during execution in:
- `/sk:dev` — subtask implementation
- `/sk:implement` — DEV phase
- `/sk:refactor` — refactoring steps
- `/sk:debug` — hypothesis testing

## The Rule

If you have tried 3 different approaches to fix the same problem and none worked:

1. **STOP.** Do not try a 4th approach.
2. **State what you tried** and why each attempt failed.
3. **Present options to the user:**

| Option | When to Choose |
|--------|----------------|
| **(a) Break it down** | The subtask is too large — split into smaller pieces |
| **(b) Revise the plan** | The plan's approach is wrong — return to `/sk:plan` |
| **(c) Rethink the approach** | The fundamental approach is wrong — return to `/sk:brainstorm` |
| **(d) Debug systematically** | This is a deeper bug — switch to `/sk:debug` |

4. **Let the user decide.** Do not pick an option yourself.

## Counting Failures

A "failure" is an attempt that doesn't solve the problem:
- Test still fails after your change
- Build breaks after your change
- A different test breaks as a result
- The behavior doesn't match expectations

Variations on the same approach count as separate attempts (e.g., trying 3 different regex patterns for the same parsing problem = 3 attempts).

## Brownfield Additions

When escalating in a brownfield codebase, also consider:

| Option | When to Choose |
|--------|----------------|
| **(e) Characterize first** | Is there undocumented behavior you're breaking? Write characterization tests before continuing |
| **(f) Map dependencies** | Is there hidden coupling to another module? Trace the dependency chain before continuing |
| **(g) Refactor first** | Is the existing code too tangled to modify safely? Consider `/sk:refactor` as a prerequisite |
| **(h) Adjust prerequisites** | Is the codebase in worse shape than the plan assumed? Return to `/sk:plan` and add prerequisite subtasks |

## How Commands Use This Skill

Commands include a line like:
> If a subtask fails 3+ times, follow `.claude/skills/escalation-rules/SKILL.md`.

When you read this file, you MUST track failure count and stop at 3.
