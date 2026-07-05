---
description: Finish feature work — review, commit, push, PR, update task board (project)
argument-hint: "[TASK-N (optional — defaults to .current)]"
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

Run `/sk:code-review` analysis on the branch diff:

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

Follow the `/sk:commit` flow:

1. Run `git status` and `git diff --cached --stat` to assess working tree
2. Stage changes (ask user what to stage if nothing is staged)
3. Generate conventional commit message from diff
4. Present message for approval
5. Commit
6. Ask: **"Push to remote?"**
7. If yes: push with upstream tracking
8. Ask: **"Create pull request?"**
9. If yes: generate PR title + body from commits, create via `gh pr create`

## Step 5: Update Task Board

If a task file was identified in Step 2:

1. Update task YAML frontmatter: `phase: done`, `status: done`, update `updated` date
2. Update `docs/tasks/README.md`: move task to "Recently Completed"
3. Add final Progress Log entry:

```markdown
| YYYY-MM-DD | DONE | Shipped via {commit hash / PR #N} |
```

4. Delete `docs/tasks/.current` if it exists (work is shipped)
5. If task is part of an epic: update epic progress count

## Step 6: Clean Up (if applicable)

If working in a git worktree:
1. Switch back to main worktree
2. Remove the feature worktree: `git worktree remove {path}`
3. Delete the branch if merged: `git branch -d {branch}`

## Step 7: Summary

Present to user:
- Commit: {hash} {message}
- Branch: {pushed to remote?}
- PR: {URL if created}
- Task: {updated to done, or "no task file"}
- Review: {verdict summary}
- Follow-up: {deferred warnings/suggestions, if any}
