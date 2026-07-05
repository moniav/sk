---
description: Run a retrospective on completed work — capture lessons, patterns, and improvements (project)
---

# /sk:retro — Retrospective

Review completed work to extract learnings and improve future sessions.

## Step 1: Read Context

Read these files to understand the current state:
- `docs/tasks/.current` — active/recent task
- The task file itself (from .current or user-specified)
- `docs/tasks/README.md` — task board for recent completions
- Git log for the relevant commits

If this isn't a git repository or has no commits yet, skip the git-based steps and note that in the output — don't error out.

**Skip files that are empty or contain only template placeholders.**

## Step 2: Identify Scope

Ask the user what to retro on (if not specified):
- A specific task (by ID or name)
- A specific epic
- The last N commits
- A time period

## Step 3: Analyze What Happened

Review the work and assess:

| Dimension | Questions |
|-----------|-----------|
| **Planning accuracy** | Were estimates right? Were subtasks well-scoped? Any surprises? |
| **Execution quality** | How many iterations to get it right? Any rework? Any blocked moments? |
| **Testing coverage** | Did tests catch issues? Any gaps? Any flaky tests introduced? |
| **Documentation** | Were docs updated? Any tribal knowledge that should be written down? |
| **Tool/process** | Did SK commands help? Any friction points? Any missing commands/skills? |
| **Agent performance** (if agents ran autonomously) | How many escalations / blocked items? Review pass rate on first attempt vs rework? Gates auto-passed under policy vs asked? Should the delegation policy widen or tighten? |

## Step 4: Extract Learnings

Categorize findings:

### What went well
- Patterns that worked and should be repeated

### What didn't go well
- Problems encountered, friction points, wasted effort

### What to change
- Concrete, actionable improvements (not vague wishes)

## Step 5: Persist Insights

For each actionable learning:

1. **If it's a user preference or workflow pattern** → Save to Claude Code memory (feedback type)
2. **If it's a project-specific insight** → Save to Claude Code memory (project type)
3. **If it's a convention that should be codified** → Propose an update to the relevant `docs/conventions/` file
4. **If it's an SK improvement** → Note it for the user to consider filing

## Step 6: Summary Report

Output a concise retrospective report:

```
## Retrospective: [Task/Epic Name]
**Date:** [date]
**Scope:** [what was reviewed]

### Went Well
- [item]

### Didn't Go Well
- [item]

### Actions Taken
- [ ] Saved to memory: [description]
- [ ] Updated convention: [file]
- [ ] SK improvement noted: [description]
```

## Guidelines

- Be honest but constructive — the goal is improvement, not blame
- Focus on patterns, not one-off incidents
- Prefer concrete actions over vague observations
- Keep the retro short (5-10 minutes of Claude time, not an hour)
- If the user doesn't specify scope, default to the most recently completed task
- **Never fabricate metrics.** Velocity, time saved, "% faster", coverage deltas — only state a number if you measured it against a real baseline (git log counts, test output, benchmark runs). If you don't have the baseline, say so or omit the number. A plausible-sounding invented metric erodes trust in every report.
- Agent-performance numbers come from countable sources only: `docs/decisions/decision-log.md` rows, `status: blocked` items on the board, review verdicts in `docs/reviews/`, Progress Log escalation entries. The retro's delegation-policy recommendation (widen/tighten) must cite them.
