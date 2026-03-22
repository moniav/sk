# Skill: Git Worktrees

> **Pattern:** Create an isolated git worktree workspace for feature branch work.

## When This Skill Is Active

This skill is opt-in. It is offered at the start of:
- `/sk:dev` — for M+ complexity work on a feature branch
- `/sk:implement` — for M+ complexity work

And during cleanup in:
- `/sk:finish` — to remove the worktree after shipping

## Setup Steps

1. **Verify main worktree is clean:**
   ```bash
   git status
   ```
   If there are uncommitted changes, do NOT create a worktree. Commit or stash first.

2. **Create feature branch** (if not exists):
   ```bash
   git checkout -b feature/{task-name}
   ```

3. **Create worktree:**
   ```bash
   git worktree add ../{project-name}-{task-name} feature/{task-name}
   ```

4. **Verify .gitignore protections:**
   Check that `.gitignore` includes build artifacts, `node_modules`/`.venv`, `.env` files.

5. **Install dependencies:**
   ```bash
   # In the new worktree directory
   npm install    # or pip install, cargo build, etc.
   ```

6. **Run baseline tests:**
   ```bash
   npm test       # or equivalent
   ```
   Record the baseline: "N pass, M fail". Confirm green (or record existing failures).

## Cleanup Steps

Used by `/sk:finish` after shipping:

1. **Verify all changes committed:**
   ```bash
   git status
   ```

2. **Switch back to main worktree:**
   ```bash
   cd /path/to/main/worktree
   ```

3. **Remove worktree:**
   ```bash
   git worktree remove ../{project-name}-{task-name}
   ```

4. **Delete branch if merged:**
   ```bash
   git branch -d feature/{task-name}
   ```

## Safety Rules

- Never create a worktree from a dirty working tree
- Always verify .gitignore before starting work
- Always run baseline tests before starting work
- Never delete a worktree with uncommitted changes
- Always use `git worktree remove` (not `rm -rf`) for proper cleanup
