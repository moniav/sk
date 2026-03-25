---
description: Smart git commit with conventional format, optional push and PR (project)
---

# Commit — Smart Git Workflow

Stage, commit with conventional format, optionally push and create a PR.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. `docs/conventions/git-workflow.md` — Commit message format, branch naming, PR process

**Skip files that are empty or contain only template placeholders.** Use conventional commit format as default.

## Step 2: Assess Working Tree

Run these commands to understand the current state:

```bash
git status
git diff --cached --stat
git diff --stat
git log --oneline -5
git branch --show-current
```

Present a summary:
- **Branch:** current branch name
- **Staged changes:** files in the index (if any)
- **Unstaged changes:** modified files not yet staged
- **Untracked files:** new files not yet added
- **Recent commits:** last 5 for context and message style

If there are no changes at all, inform the user and stop.

## Step 3: Stage Changes

If nothing is staged yet, ask the user what to stage:
- **All changes** — `git add -A`
- **Specific files** — let the user pick, then `git add <files>`
- **Interactive review** — show diff for each file, user decides per-file

After staging, run `git diff --cached` to show exactly what will be committed.

## Step 4: Generate Commit Message

Using the diff and `docs/conventions/git-workflow.md` format rules, generate a conventional commit message:

**Format:** `type(scope): description`

**Infer from the diff:**
- **type** — `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `perf` (based on what changed)
- **scope** — the primary area affected (module, component, file group)
- **description** — imperative mood, lowercase, no period, under 72 characters

**For substantial changes**, add a body:
```
type(scope): short description

Longer explanation of what changed and why.
- Detail 1
- Detail 2
```

Present the message to the user for approval. Accept edits if requested.

## Step 5: Commit

```bash
git commit -m "<approved message>"
```

If the commit fails (e.g., pre-commit hook), diagnose the issue, fix it, re-stage, and create a **new** commit (do not amend).

## Step 6: Push (Optional)

Ask the user: **Push to remote?**

If yes:
1. Check if the branch has an upstream: `git rev-parse --abbrev-ref @{upstream}`
2. If no upstream, push with tracking: `git push -u origin <branch>`
3. If upstream exists, push normally: `git push`

If push fails (e.g., diverged history), inform the user and suggest options — do NOT force-push without explicit approval.

## Step 7: Create PR (Optional)

Ask the user: **Create a pull request?**

If yes:
1. Determine the base branch (usually `main`)
2. Run `git log main..HEAD --oneline` to gather all commits on this branch
3. Generate a PR title (under 70 chars) and body from the commits
4. Present for approval, then create:

```bash
gh pr create --title "<title>" --body "<body>"
```

5. Return the PR URL to the user.

If `gh` is not available or the user declines, skip this step.

## Summary

Present to user:
- Commit hash and message
- Branch pushed (if applicable)
- PR URL (if created)
