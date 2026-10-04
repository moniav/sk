---
description: Execute the DEV phase — implement subtasks for a task
argument-hint: "[TASK-N (optional — defaults to .current)]"
disable-model-invocation: true
---

# Dev — Execute Implementation

Execute the [DEV] phase for a task, implementing subtasks top-to-bottom.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

Copy the steps below into your todo list before starting. A step you decide not to do stays on the list as "skip: <reason>".

**Rules (hold through every step):**
- If a subtask shows the plan was wrong, stop and revise the plan. Do not hack around it (see Error Recovery).
- Never expand scope without updating acceptance criteria.
- "Tests pass" is a claim, not evidence. Evidence is the test command and its pasted output.

## Step 1: Read Context

**Read only what's needed now** (conventions and skills are loaded later, at Step 4):
1. `docs/system/project-context.md` — Dense project summary (if it exists — skip if empty/template)
2. The task file being implemented — find task files with `phase: dev` in frontmatter

Read conventions and skills when you start executing subtasks (Step 4), not now.

## Step 1.5: Choose Execution Mode (Optional)

If the task has 5+ subtasks, ask (use AskUserQuestion): **"This task has N subtasks. Use subagent mode? Each subtask gets a fresh agent with clean context. (Recommended for large tasks.)"**

If yes: read `.claude/skills/subagent-driven-development/SKILL.md` and follow SDD pattern for subtask execution.
If no: continue with direct execution (standard mode).

**Worktree setup (optional):** If working on a feature branch for M+ complexity, ask: **"Set up an isolated worktree for this work?"**

If yes: follow `.claude/skills/git-worktrees/SKILL.md` setup steps.

## Step 2: Validate Readiness

Before writing any code, check each box against the task file:

```markdown
- [ ] Task frontmatter has `status: ready` (PLAN phase complete)
- [ ] Every acceptance criterion names a yes/no verification method
- [ ] Every subtask has an exact file path
- [ ] Open Questions table has no unanswered row
- [ ] Every prerequisite task file has `status: done`
- [ ] Task is unclaimed, claimed by this session, or its claim is stale (>24h since `updated` — see the claim convention in `docs/tasks/README.md`)
```

If any check fails — go back to PLAN phase (`/sk:plan` command).

## Step 3: Set Status

Update the task file frontmatter:
- `status: in-progress`
- Claim it: set `claimed_by` (this session's identifier) + `claimed_at` — skip if single-agent
- Update `updated` date

Progress Log: Add entry `DEV phase started`

Update `docs/tasks/.current`: set `phase: dev`, update subtask count (create it if missing — format in `docs/tasks/README.md`).

## Step 4: Execute Subtasks

Follow `.claude/skills/subtask-execution/SKILL.md` — the canonical loop: load
conventions first, TDD ordering (`[TEST]` before `[DEV]`), per-type checklists,
self-review, and escalation after 3 failed attempts.

Update `docs/tasks/.current` subtask progress after each subtask.

## Step 5: Convention Compliance Check

After all subtasks are done, run the **Convention Compliance Pass** from the
subtask-execution skill (code style, file structure, git workflow).
Done when every box in that pass is checked, or lists the `file:line` you fixed to make it true.

## Step 6: Documentation Pass

Confirm every `[DOCS]` subtask checkbox in the task file is checked. Then, for each box below, name the doc file you changed or write `n/a: <reason>`:

```markdown
- [ ] `docs/system/database-schema.md` updated (if schema changed)
- [ ] `docs/system/api-reference.md` updated (if APIs changed)
- [ ] `docs/system/tech-stack.md` updated (if deps changed)
- [ ] `docs/architecture/` updated (if component relationships changed)
- [ ] `docs/flows/` updated (if process flows changed)
- [ ] `docs/decisions/` — new ADR created if significant tech decision was made
```

## Step 7: Write Dev Notes

Record key decisions and implementation notes in the task's "Phase Analysis > Dev Notes" section for consumption by the TEST phase.
Done when that section names each decision made during DEV and each deviation from the plan, or says `none`.

## Step 8: DEV Exit Gate

Run the **DEV Exit Gate** from the subtask-execution skill: read
`verification-before-completion`, run the actual test suite, and paste the command and its output.
The gate is met when the checked-box count equals the gate's box count and the pasted output
comes from a run made after the last code change. State the count (`DEV gate: N/N`).
If any box is unchecked, do not go to Step 9: fix it, or report it to the user with the reason.

## Step 9: Update Status

1. Update `docs/tasks/.current`: set `phase: test`
2. Update YAML frontmatter: set `phase: test`, `status: testing`, update `updated` date
3. Update Progress Log:

```markdown
| YYYY-MM-DD | DEV | All N subtasks complete, docs updated. Ready for test. |
```

4. Update `docs/tasks/README.md` — move from "In Progress" to "Testing"

Inform user: **"DEV phase complete. All subtasks implemented. Moving to TEST phase — I'll verify each acceptance criterion."**

## Error Recovery

### Plan Was Wrong (subtask reveals incorrect approach)
1. Stop implementation
2. Document what was discovered in Implementation Notes
3. Update the affected acceptance criteria if needed
4. Revise subtask list (add/remove/modify subtasks)
5. Log the deviation in Progress Log
6. Continue from the revised plan

### Acceptance Criterion is Untestable
1. Rewrite the AC to be testable (yes/no verifiable)
2. If the AC is truly unnecessary, remove it with justification
3. Log the change in Progress Log

### Dependency Discovered Mid-Dev
1. Check if the dependency is a separate task that should exist
2. If yes: create a blocker note, pause this task, create the dependency task
3. If no: add it as a new subtask and implement inline

### Scope Creep Detected
1. If the new work is part of the original goal: add as subtask
2. If it's a new feature: note it in Implementation Notes, create a separate task later

**Reply:** subtasks completed and skipped (with reasons), the test command and its output, files changed, and what the user should run next.
