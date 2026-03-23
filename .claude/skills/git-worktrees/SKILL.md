---
name: git-worktrees
description: >
  Manages isolated git worktree workspaces for feature branch development.
  Use this skill when the user wants to work on a feature in isolation, asks about
  "worktrees", "isolated branch", "separate workspace", or when starting M+ complexity
  work during /sk:dev or /sk:implement. Also handles worktree cleanup during /sk:finish.
  Ensures clean setup with dependency install and baseline tests, plus safe teardown.
---

# Git Worktrees

> Create an isolated worktree workspace for feature branch work.

## Setup

1. **Verify clean state:** `git status` — if dirty, commit or stash first
2. **Create feature branch:** `git checkout -b feature/{task-name}`
3. **Create worktree:** `git worktree add ../{project-name}-{task-name} feature/{task-name}`
4. **Verify .gitignore:** Ensure build artifacts, `node_modules`/`.venv`, `.env` are covered
5. **Install dependencies** in the new worktree directory
6. **Run baseline tests** and record results: "N pass, M fail"

## Cleanup

Used by `/sk:finish` after shipping:

1. Verify all changes committed
2. Switch back to main worktree
3. `git worktree remove ../{project-name}-{task-name}`
4. `git branch -d feature/{task-name}` (if merged)

## Safety Rules

- Never create a worktree from a dirty working tree
- Always verify .gitignore before starting work
- Always run baseline tests before starting work
- Never delete a worktree with uncommitted changes
- Always use `git worktree remove` (not `rm -rf`)
