---
name: stay-within-limits
description: >
  Governs long or parallel agent runs so they don't exhaust the usage window mid-task.
  Use during /sk:orchestrate, subagent-driven development, or any run that fans out many
  subagents or spans a long session. Caps fan-out into bounded waves, checks usage between
  waves, and emits a self-contained resume prompt before pausing.
---

# Stay Within Limits — Budget Governance

> Bounded waves. Check between waves. Pause with a clean resume prompt before you run out — not after.

## When This Applies

Long autonomous runs and parallel fan-out (especially `/sk:orchestrate`) can burn through a usage window and die mid-task — losing context and leaving work half-done with no clean handoff. This skill keeps long runs survivable and restartable.

## The Rules

1. **Bounded waves.** Dispatch subagents in waves of ~3, not all at once. A smaller concurrent footprint is easier to monitor and cheaper to recover when something fails.
2. **Check between waves.** After each wave, assess: how much work remains, how much budget is left, whether results are on track. Don't launch the next wave blind.
3. **Pause before the wall, not at it.** As you approach the usage limit, stop while you still have room to write a clean handoff — don't get cut off mid-edit.
4. **Emit a self-contained resume prompt** when you pause (format below).

## Resume Prompt Format

Write a prompt a fresh session can act on with zero prior context:

```markdown
## Resume: {task/epic}
**Completed:** {waves/subtasks done, with evidence}
**In flight / interrupted:** {anything partial — and how to verify its state}
**Remaining plan:** {ordered list of what's left}
**Resume command:** {e.g. /sk:orchestrate <task> — continue from wave N}
```

Save it to the task file's Progress Log or `docs/tasks/.current` so it survives the session boundary.

## Relationship to Other Skills

- Pairs with **subagent-driven-development** (which defines the per-subtask pattern) — this skill bounds how many run at once.
- Pairs with **escalation-rules** — if a wave keeps failing, escalate rather than burning budget on retries.
