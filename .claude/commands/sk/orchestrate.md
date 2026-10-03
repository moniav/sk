---
description: Orchestrate parallel agent team for a task or epic — dependency-aware Plan > Dev > Test
disable-model-invocation: true
---

# Orchestrate — Parallel Agent Team

Analyze subtask dependencies, dispatch parallel subagents with worktree isolation, and coordinate the full Plan > Dev > Test lifecycle with two-stage review.

**Use this when:** A task has 3+ independent subtasks that can run concurrently.
**Use `/sk:dev` instead when:** Subtasks are sequential or the task is simple.
**Use `/sk:implement` instead when:** You want standard single-agent lifecycle.

## Step 1: Read Context

**Read these first:**
1. `docs/system/project-context.md` — Project summary
2. The task or epic file to orchestrate
3. `.claude/skills/subagent-driven-development/SKILL.md` — Existing SDD pattern
4. `.claude/skills/escalation-rules/SKILL.md` — Failure handling
5. `.claude/skills/stay-within-limits/SKILL.md` — Bounded waves and budget governance (dispatch in waves of ~3, check usage between waves)

**Skip convention files that are empty or contain only template placeholders.** Agents should infer patterns from the existing codebase if conventions aren't configured.

## Step 2: Select Target

Ask the user what to orchestrate:

| Input | Behavior |
|-------|----------|
| **A task file** | Orchestrate that task's subtasks in parallel |
| **An epic file** | Orchestrate multiple tasks from the epic, each task's subtasks parallelized |
| **A description** | Create a task first (via `/sk:plan` mentally), then orchestrate it |

**Prerequisite:** The task must have completed PLAN phase — subtasks defined with file paths, acceptance criteria testable, no open questions. Check the claim: if `claimed_by` names another agent and the claim is fresh (<24h), pick different work; otherwise claim it (see `docs/tasks/README.md`).

If PLAN is not done, run `/sk:plan` first and return here after.

## Step 3: Analyze Dependencies

Agent types below are the names SK registers. When SK is installed as a plugin they carry the `sk:` prefix (for example `sk:implementer`).

Dispatch the **dependency-analyzer** agent:

```
Use Agent tool:
  subagent_type: dependency-analyzer
  model: haiku
  prompt: Read the task file at {path}.
          Analyze all subtasks and produce the dependency analysis with execution waves.
```

The analyzer returns:
- **File conflict map** — which subtasks touch which files
- **Dependency graph** — which subtasks depend on which
- **Execution waves** — groups of independent subtasks that can run in parallel
- **Estimated speedup** — expected improvement over sequential

## Step 4: Present Execution Plan

Show the user the proposed execution plan:

```markdown
## Orchestration Plan for TASK-{N}

### Execution Waves
| Wave | Subtasks | Parallel Agents | Estimated Tokens |
|------|----------|----------------|-----------------|
| 1    | ST-1, ST-2, ST-3 | 3 | ~3x single subtask |
| 2    | ST-4 (depends on ST-1, ST-2) | 1 | ~1x |
| 3    | [DOCS] ST-5, ST-6 | 2 | ~2x |

### Cost Estimate
- Sequential (standard /sk:dev): ~N subtask executions
- Parallel (this plan): ~N subtask executions + M reviews + dependency analysis
- Overhead: ~30% more tokens for isolation + reviews
- Wall-clock speedup: ~{X}x faster

### Proceed?
Each parallel agent gets:
- Isolated git worktree (no file conflicts)
- Fresh context (no drift from other subtasks)
- Two-stage review (spec + quality) after completion
```

**Wait for user approval before dispatching.**

If the user says the cost is too high, offer:
- Run the largest wave in parallel, rest sequential
- Run fully sequential (stop here; the user runs `/sk:dev` instead)
- Reduce team size (cap at 2 parallel agents)

## Step 5: Prepare Context Packages

For each subtask in the current wave, assemble a context package:

```markdown
### Context Package for Subtask ST-{N}

**Subtask spec:**
{copy from task file}

**Acceptance criteria (relevant):**
{only the ACs this subtask contributes to}

**Conventions:**
- Read docs/conventions/code-style.md
- Read docs/conventions/testing.md
- Read docs/conventions/file-structure.md

**Existing code (brownfield):**
{list files to read for existing patterns}

**Pattern examples:**
{2-3 similar patterns from the codebase}

**Isolation rules:**
- Work ONLY on these files: {list}
- Do NOT modify files outside your scope
- Report status using implementer format
```

## Step 6: Dispatch Wave

For each wave, dispatch all subtasks in that wave **simultaneously** using the Agent tool:

```
For each subtask in wave:
  Use Agent tool:
    description: "Implement ST-{N}: {short description}"
    subagent_type: implementer
    model: sonnet
    isolation: worktree
    prompt: |
      {context package from Step 5}

      Implement this subtask using TDD (RED > GREEN > REFACTOR).
      Report your status as: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
```

**All agents in a wave launch in a single message** (parallel tool calls).

### Handle Agent Results

As agents complete:

| Status | Action |
|--------|--------|
| **DONE** | Queue for review |
| **DONE_WITH_CONCERNS** | Queue for review, note concerns |
| **NEEDS_CONTEXT** | Provide context, re-dispatch (1 retry) |
| **BLOCKED** | Park subtask, ask user, continue other agents |

## Step 7: Two-Stage Review (Per Subtask)

After each agent completes, run both review stages. Reviews for different subtasks can run in parallel.

### Stage 1 — Spec Compliance

```
Use Agent tool:
  description: "Spec review ST-{N}"
  subagent_type: spec-reviewer
  model: haiku
  prompt: |
    Subtask spec: {spec}
    Acceptance criteria: {relevant ACs}
    Files changed: {list from implementer report}

    Read the actual code and verify it matches the spec. Output PASS or FAIL.
```

### Stage 2 — Code Quality (only if Stage 1 passes)

```
Use Agent tool:
  description: "Quality review ST-{N}"
  subagent_type: quality-reviewer
  model: sonnet
  prompt: |
    Files changed: {list}
    Read docs/conventions/code-style.md, file-structure.md, testing.md
    Read docs/system/project-context.md

    Review for conventions, test quality, and simplicity.
```

### Stage 3 — Architecture (conditional)

When a subtask spans modules or adds a new dependency between them, also dispatch
the `architecture-reviewer` agent →
FITS / CONCERNS / REDESIGN. Single-file subtasks skip this stage. Treat REDESIGN
like a Spec FAIL (re-dispatch with the recommended approach).

### Handle Review Results

| Result | Action |
|--------|--------|
| Spec PASS + Quality clean | Mark subtask done |
| Spec PASS + Quality suggestions only | Note suggestions, mark done |
| Spec PASS + Quality critical | Re-dispatch implementer with findings (max 2 retries) |
| Spec FAIL | Re-dispatch implementer with findings (max 2 retries) |
| 2 retries exhausted | Escalate to user per escalation-rules skill |

## Step 8: Merge Wave Results

After all subtasks in a wave complete and pass review:

1. **List worktree branches** — Identify all branches from this wave
2. **Merge sequentially** into the feature branch:
   ```
   For each completed subtask branch:
     git merge {subtask-branch} --no-ff -m "feat: {subtask description}"
   ```
3. **Run tests after merge** — Verify no conflicts between parallel work
4. **If merge conflict:**
   - Show the conflict to the user with context from both agents
   - Ask how to resolve
   - Never auto-resolve merge conflicts
5. **If tests fail after merge:**
   - Identify which subtask's changes cause the failure
   - Re-dispatch that subtask's implementer with the failure context
6. **Clean up worktrees** for completed subtasks

## Step 9: Next Wave

After a wave completes and merges cleanly:

1. Update task file — check off completed subtasks
2. Update `docs/tasks/.current` — update subtask progress (create it if missing — format in `docs/tasks/README.md`)
3. Proceed to next wave (repeat Steps 6-8)

Continue until all waves are complete.

## Step 10: Final Verification

After all waves complete:

1. **Run full test suite** — All tests pass on the merged result
2. **Verify each acceptance criterion** — With evidence (per verification-before-completion skill)
3. **Update task file:**
   - Frontmatter: `phase: done`, `status: done`
   - Check off all subtasks
   - Add orchestration summary to Progress Log:
     ```
     | {date} | ORCHESTRATE | {N} subtasks in {W} waves, {P} parallel agents, {R} review cycles |
     ```
4. **Documentation pass** — Verify all [DOCS] subtasks completed
5. **Delete** `docs/tasks/.current`

## Step 11: Summary

Present to user:

```markdown
## Orchestration Complete — TASK-{N}

### Execution Summary
| Metric | Value |
|--------|-------|
| Total subtasks | N |
| Waves executed | W |
| Max parallel agents | P |
| Review cycles | R (spec) + R (quality) |
| Retries needed | N |
| Escalations | N |

### Results
- [x] AC-1: {criterion} — verified: {evidence}
- [x] AC-2: {criterion} — verified: {evidence}

### Files Changed
{list all files created/modified across all agents}

### Next Steps
- `/sk:finish` to commit, push, and create PR
- `/sk:test` for additional manual verification
```

## Guard Rails

### Cost Controls
- Maximum 4 parallel agents per wave
- Show token estimate before dispatching
- If user declines cost, offer reduced parallelism or sequential fallback
- Track actual vs estimated for calibration

### Safety
- Worktree isolation is mandatory for parallel agents — never dispatch parallel agents without it
- Never auto-resolve merge conflicts
- Escalation rules apply: 3 failures on any subtask → stop and ask user
- Each agent works ONLY on its assigned files

### When NOT to Orchestrate
- Task has < 3 subtasks (use `/sk:dev`)
- All subtasks are strictly sequential (no parallelism possible)
- Subtasks share many files (merge conflicts likely)
- XS/S complexity (overkill — just implement directly)
