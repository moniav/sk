---
description: Finish feature work — review, commit, push, PR, update task board
argument-hint: "[TASK-N (optional — defaults to .current)]"
disable-model-invocation: true
---

# Finish — Ship Completed Work

Chain code review + commit + push + PR + task board update into one flow.

**Use when:** Feature work is done (all tests pass, all ACs verified), ready to ship.
**Use `/sk:commit` instead when:** You just want the git part without review or task board updates.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `.claude/skills/verification-before-completion/SKILL.md` — Evidence requirements
2. `docs/system/project-context.md` — Dense project summary (if it exists)
3. `docs/conventions/git-workflow.md` — Commit and PR conventions

**Skip files that are empty or contain only template placeholders.**

## Step 2: Identify What to Finish

If this isn't a git repository or has no commits yet, skip the git-based steps and note that in the output — don't error out.

1. Check current branch: `git branch --show-current`
2. Find the associated task file:
   - Search `docs/tasks/TASK-*.md` for tasks with `status: done` or `status: testing`
   - If no task file: this is XS/S work, skip task board steps
3. Verify readiness:
   - All acceptance criteria verified (with evidence)?
   - All tests pass?
   - If not: suggest running `/sk:test` first

## Step 3: Final Code Review

Apply the analysis in `.claude/commands/sk/code-review.md` to the branch diff (read the file; it cannot be invoked as a command from here):

1. Determine the base branch: detect the default branch with `git symbolic-ref --short refs/remotes/origin/HEAD` (fall back to `main`, then `master`)
2. Get the diff: `git diff {base}...HEAD`
3. Read all changed files with full context
4. Analyze across all 5 categories (correctness, conventions, performance, maintainability, testing)
5. Present findings with verdict

**If Critical issues found:** Fix them before proceeding. Return to Step 3.
**If only Warnings/Suggestions:** Note them, proceed (user can decide to fix or defer).
**If APPROVE:** Continue.

Optionally save review: ask **"Save review report to `docs/reviews/code/`?"**

## Step 4: Commit and Ship

Follow `.claude/skills/git-commit-flow/SKILL.md` end-to-end: assess working tree →
stage → conventional commit → push (optional) → PR (optional).

## Step 5: Update Task Board

If a task file was identified in Step 2:

1. Update task YAML frontmatter: `phase: done`, `status: done`, update `updated` date, clear `claimed_by`/`claimed_at`
2. Update `docs/tasks/README.md`: move task to "Recently Completed"
3. Add final Progress Log entry:

```markdown
| YYYY-MM-DD | DONE | Shipped via {commit hash / PR #N} |
```

4. Delete `docs/tasks/.current` if it exists (work is shipped)
5. If task is part of an epic: update epic progress count

## Step 6: Clean Up (if applicable)

If working in a git worktree, follow the Cleanup steps in `.claude/skills/git-worktrees/SKILL.md`
(skip removal when the harness created the worktree; use `git branch -D` only after
confirming a squash- or rebase-merged PR is merged).

## Step 7: Summary

Present to user:
- Commit: {hash} {message}
- Branch: {pushed to remote?}
- PR: {URL if created}
- Task: {updated to done, or "no task file"}
- Review: {verdict summary}
- Follow-up: {deferred warnings/suggestions, if any}
