---
name: git-worktrees
description: Sets up and tears down an isolated git worktree and branch for a task. Use when the user wants to work in isolation, mentions worktrees or a separate workspace, or needs to work on two branches at once.
---

# Git Worktrees

> One worktree and one branch per task, created from the base branch.

## Harness-managed worktrees

If the harness already created the worktree (a subagent dispatched with `isolation: worktree`, or a session started inside `.claude/worktrees/<name>`), skip Setup steps 2-3 and Cleanup steps 3-4.
Keep the branch the harness assigned and let the harness remove the worktree.
The other steps still apply.

## Setup

1. **Verify clean state:** `git status`. If dirty, commit or stash first.
2. **Pick the base:** `git fetch origin`, then use `origin/{default-branch}`. With no remote, use the local default branch.
3. **Create the branch and the worktree in one command**, from the repository root:

   ```bash
   git worktree add ../{project-name}-{task-name} -b feature/{task-name} {base}
   ```

   Do not run `git checkout -b` first: a branch checked out in the main worktree cannot be attached to a second one.
   If the path or branch name already exists, pick a different name. Never force or reuse.
4. **Verify .gitignore:** build artifacts, dependency directories (`node_modules`, `.venv`), and `.env` are covered.
5. **Install dependencies** inside the new worktree. Worktrees do not share them.
6. **Run baseline tests** and record the result: "N pass, M fail".

## Cleanup

Used by `/sk:finish` after shipping:

1. Verify all changes are committed.
2. Switch back to the main worktree.
3. `git worktree remove ../{project-name}-{task-name}`
4. `git branch -d feature/{task-name}`.
   After a squash or rebase merge, `-d` refuses even though the work is merged: confirm the PR is merged, then use `-D`.

## Shared resources

A worktree isolates files, not the machine.
Dev-server ports, databases, and caches are shared with every other worktree.

- Before trusting a running server, confirm the port answers this worktree's process.
- Do not run schema experiments against a database another worktree is using.
- Resolve lockfile conflicts by regenerating the lockfile, never by hand-merging.

## Safety Rules

- Never create a worktree from a dirty working tree
- Always verify .gitignore before starting work
- Always run baseline tests before starting work
- Never delete a worktree with uncommitted changes
- Always use `git worktree remove` (not `rm -rf`)
