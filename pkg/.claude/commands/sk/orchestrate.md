---
description: Orchestrate parallel agent team for a task or epic — dependency-aware Plan > Dev > Test
argument-hint: "[TASK-N or EPIC-N (optional, defaults to .current)]"
disable-model-invocation: true
---

# Orchestrate — Parallel Agent Team

Analyze subtask dependencies, dispatch parallel subagents with worktree isolation, and coordinate the full Plan > Dev > Test lifecycle with two-stage review.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

Copy the steps below into your todo list before starting. A step you decide not to do stays on the list as "skip: <reason>".

## Rules and Gates

- **Fit check.** Orchestrate only when the task has 3+ independent subtasks. If it has fewer than 3 subtasks, all subtasks are strictly sequential, subtasks share many files, or complexity is XS/S, stop and tell the user to use `/sk:dev` (or `/sk:implement` for the standard single-agent lifecycle).
- **Approval gate.** Show the execution plan with its token estimate (Step 4) and wait for user approval before dispatching any implementer.
- **Isolation.** Every parallel agent runs with `isolation: worktree`. Never dispatch parallel agents without it. Each agent works ONLY on its assigned files.
- **Limits.** Maximum 4 parallel agents per wave. Check usage between waves per the `stay-within-limits` skill. Record actual versus estimated cost in the final summary.
- **Merges.** Never auto-resolve merge conflicts: show the conflict and ask the user.
- **Retries.** Max 2 re-dispatches per subtask after a failed review. 3 failures on any subtask: stop and ask the user, per the `escalation-rules` skill.
- **Models.** Do not pass `model` at dispatch: each agent's definition sets it. The two exceptions are in the `escalation-rules` skill (one tier up after repeated failure, and `haiku` for the subtasks of an XS or S task).
- **Agent names.** Agent types below are the names SK registers. When SK is installed as a plugin they carry the `sk:` prefix (for example `sk:implementer`).

## Step 1: Read Context

1. `docs/system/project-context.md`
2. The task or epic file to orchestrate
3. `${CLAUDE_PLUGIN_ROOT}/.claude/skills/subagent-driven-development/SKILL.md`
4. `${CLAUDE_PLUGIN_ROOT}/.claude/skills/escalation-rules/SKILL.md` (failure handling)
5. `${CLAUDE_PLUGIN_ROOT}/.claude/skills/stay-within-limits/SKILL.md` (dispatch in waves of ~3, check usage between waves)

Skip convention files that are empty or contain only template placeholders; agents then infer patterns from the existing codebase.

## Step 2: Select Target

If the arguments do not name a target and `docs/tasks/.current` does not either, ask the user what to orchestrate:

- **A task file**: orchestrate that task's subtasks in parallel
- **An epic file**: orchestrate multiple tasks from the epic, each task's subtasks parallelized
- **A description**: there is no task file yet. Create one with `/sk:new-task` and complete its plan with `/sk:plan`, then orchestrate it

**Prerequisite:** the task has completed the PLAN phase: every subtask lists file paths, every acceptance criterion is testable, and the task file has no open questions. If not, run `/sk:plan` first and return here after.
**Claim:** if `claimed_by` names another agent and the claim is fresh (<24h), pick different work; otherwise claim it (see `docs/tasks/README.md`).

## Step 3: Analyze Dependencies

```
Use Agent tool:
  subagent_type: dependency-analyzer
  prompt: Read the task file at {path}.
          Analyze all subtasks and produce the dependency analysis with execution waves.
```

Done when the analyzer's output has a file conflict map, a dependency graph, an estimated speedup, and execution waves that together contain every subtask exactly once.

## Step 4: Present Execution Plan

```markdown
## Orchestration Plan for TASK-{N}
### Execution Waves
| Wave | Subtasks | Parallel Agents | Estimated Tokens |
|------|----------|----------------|-----------------|
| 1    | ST-1, ST-2, ST-3 | 3 | ~3x single subtask |
| 2    | ST-4 (depends on ST-1, ST-2) | 1 | ~1x |
### Cost Estimate
- Sequential (standard /sk:dev): ~N subtask executions
- Parallel (this plan): ~N subtask executions + M reviews + dependency analysis
- Overhead: ~30% more tokens for isolation + reviews
- Wall-clock speedup: ~{X}x faster
### Proceed?
Each parallel agent gets an isolated git worktree, fresh context, and two-stage review (spec + quality).
```

**Wait for user approval before dispatching.** If the user says the cost is too high, offer three options: run the largest wave in parallel and the rest sequential; run fully sequential (stop here; the user runs `/sk:dev` instead); or reduce team size (cap at 2 parallel agents).

## Step 5: Prepare Context Packages

One per subtask in the current wave:

```markdown
### Context Package for Subtask ST-{N}
**Subtask spec:** {copy from task file}
**Acceptance criteria (relevant):** {only the ACs this subtask contributes to}
**Conventions:** Read docs/conventions/code-style.md, docs/conventions/testing.md, docs/conventions/file-structure.md
**Existing code (brownfield):** {list files to read for existing patterns}
**Pattern examples:** {2-3 similar patterns from the codebase}
**Isolation rules:**
- Work ONLY on these files: {list}
- Do NOT modify files outside your scope
- Report status using implementer format
```

## Step 6: Dispatch Wave

Launch all subtasks of the wave in a single message (parallel tool calls):

```
For each subtask in wave:
  Use Agent tool:
    description: "Implement ST-{N}: {short description}"
    subagent_type: implementer
    isolation: worktree
    prompt: |
      {context package from Step 5}
      Implement this subtask using TDD (RED > GREEN > REFACTOR).
      Report your status as: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
```

As agents report:
- **DONE**: queue for review
- **DONE_WITH_CONCERNS**: queue for review, note concerns
- **NEEDS_CONTEXT**: provide context, re-dispatch (1 retry)
- **BLOCKED**: park subtask, ask user, continue other agents

## Step 7: Two-Stage Review (Per Subtask)

Run after each agent completes. Reviews for different subtasks can run in parallel.

**Stage 1: Spec Compliance**
```
Use Agent tool:
  description: "Spec review ST-{N}"
  subagent_type: spec-reviewer
  prompt: |
    Subtask spec: {spec}
    Acceptance criteria: {relevant ACs}
    Files changed: {list from implementer report}
    Read the actual code and verify it matches the spec. Output PASS or FAIL.
```

**Stage 2: Code Quality (only if Stage 1 passes)**
```
Use Agent tool:
  description: "Quality review ST-{N}"
  subagent_type: quality-reviewer
  prompt: |
    Files changed: {list}
    Read docs/conventions/code-style.md, file-structure.md, testing.md
    Read docs/system/project-context.md
    Review for conventions, test quality, and simplicity.
```

**Stage 3: Architecture (conditional).** When a subtask spans modules or adds a new dependency between them, also dispatch the `architecture-reviewer` agent, which returns FITS / CONCERNS / REDESIGN. Single-file subtasks skip this stage. Treat REDESIGN like a Spec FAIL (re-dispatch with the recommended approach).

**Handle review results:**
- Spec PASS + Quality clean: mark subtask done
- Spec PASS + Quality suggestions only: note suggestions, mark done
- Spec PASS + Quality critical, or Spec FAIL: re-dispatch implementer with findings (max 2 retries)
- 2 retries exhausted: escalate to user per escalation-rules skill

## Step 8: Merge Wave Results

1. Once every subtask in the wave has passed review, list the worktree branches from this wave.
2. Merge them one at a time into the feature branch: `git merge {subtask-branch} --no-ff -m "feat: {subtask description}"`
3. Run the project's test command after the merges. The wave is merged only when it exits with zero failures.
4. On a merge conflict: show the conflict to the user with context from both agents and ask how to resolve it.
5. On test failure: identify which subtask's changes cause it and re-dispatch that subtask's implementer with the failure output.
6. Remove the worktrees of completed subtasks.

## Step 9: Next Wave

1. Check off the completed subtasks in the task file.
2. Update subtask progress in `docs/tasks/.current` (create it if missing; format in `docs/tasks/README.md`).
3. Repeat Steps 5-8 for the next wave until no wave remains.

## Step 10: Final Verification

1. Run the full test suite on the merged result and capture the passing output.
2. Verify each acceptance criterion with evidence (per the verification-before-completion skill).
3. Update the task file: set frontmatter `phase: done`, `status: done`; check off all subtasks; add this row to the Progress Log:
   `| {date} | ORCHESTRATE | {N} subtasks in {W} waves, {P} parallel agents, {R} review cycles |`
4. Confirm every [DOCS] subtask is checked off and its doc file changed.
5. Delete `docs/tasks/.current`.

## Step 11: Summary

```markdown
## Orchestration Complete: TASK-{N}
### Execution Summary
| Metric | Value |
|--------|-------|
| Total subtasks | N |
| Waves executed | W |
| Max parallel agents | P |
| Review cycles | R (spec) + R (quality) |
| Retries needed | N |
| Escalations | N |
| Cost, actual vs estimated | {actual} vs {estimate} |
### Results
- [x] AC-1: {criterion}, verified: {evidence}
### Files Changed
{list all files created/modified across all agents}
### Next Steps
`/sk:finish` to commit, push, and create PR; `/sk:test` for additional manual verification
```

**Reply:** the Step 11 summary (metrics table, every acceptance criterion with its evidence, files changed, suggested next commands); or, if the run stopped early, the wave and subtask it stopped at, the reason, and the decision needed from the user.
