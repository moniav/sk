---
description: Execute the DEV phase — implement subtasks for a task
argument-hint: "[TASK-N (optional — defaults to .current)]"
disable-model-invocation: true
---

# Dev — Execute Implementation

Execute the [DEV] phase for a task, implementing subtasks top-to-bottom.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

## Step 1: Read Context

**Read only what's needed now** (conventions and skills are loaded later, at Step 4):
1. `docs/system/project-context.md` — Dense project summary (if it exists — skip if empty/template)
2. The task file being implemented — find task files with `phase: dev` in frontmatter

Read conventions and skills when you start executing subtasks (Step 4), not now.

## Step 1.5: Choose Execution Mode (Optional)

If the task has 5+ subtasks, ask (use AskUserQuestion): **"This task has N subtasks. Use subagent mode? Each subtask gets a fresh agent with clean context. (Recommended for large tasks.)"**

If yes: read `${CLAUDE_PLUGIN_ROOT}/.claude/skills/subagent-driven-development/SKILL.md` and follow SDD pattern for subtask execution.
If no: continue with direct execution (standard mode).

**Worktree setup (optional):** If working on a feature branch for M+ complexity, ask: **"Set up an isolated worktree for this work?"**

If yes: follow `${CLAUDE_PLUGIN_ROOT}/.claude/skills/git-worktrees/SKILL.md` setup steps.

## Step 2: Validate Readiness

Before writing any code, confirm:

```markdown
- [ ] Task status is `ready` (PLAN phase complete)
- [ ] All acceptance criteria are defined and testable
- [ ] All subtasks are defined with exact file paths
- [ ] No open questions blocking implementation
- [ ] Dependencies are met (prerequisite tasks done)
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

Follow `${CLAUDE_PLUGIN_ROOT}/.claude/skills/subtask-execution/SKILL.md` — the canonical loop: load
conventions first, TDD ordering (`[TEST]` before `[DEV]`), per-type checklists,
self-review, and escalation after 3 failed attempts.

Update `docs/tasks/.current` subtask progress after each subtask.

## Step 5: Convention Compliance Check

After all subtasks are done, run the **Convention Compliance Pass** from the
subtask-execution skill (code style, file structure, git workflow).

## Step 6: Documentation Pass

Verify all `[DOCS]` subtasks completed:

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

## Step 8: DEV Exit Gate

Run the **DEV Exit Gate** from the subtask-execution skill: read
`verification-before-completion`, run the actual test suite, and paste the output —
"tests pass" is not evidence. Every gate box must be checked.

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
1. Stop implementation — do not hack around it
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
3. Never expand scope without updating acceptance criteria
