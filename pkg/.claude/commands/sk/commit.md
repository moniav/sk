---
description: Smart git commit with conventional format, optional push and PR
argument-hint: "[what the commit is about (optional)]"
disable-model-invocation: true
allowed-tools: Bash(git branch --show-current), Bash(git symbolic-ref *), Bash(git status *), Bash(git log *)
---

# Commit — Smart Git Workflow

Stage, commit with conventional format, optionally push and create a PR.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

## Preloaded state

Filled in when the command loads, so the first steps need not run these again:

- Branch: !`git branch --show-current 2>/dev/null || true`
- Default branch: !`git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null || true`
- Uncommitted: !`git status --short 2>/dev/null | head -20 || true`
- Recent commits: !`git log --oneline -10 2>/dev/null || true`

If a line above is empty or still shows its command (shell injection is off, or this is not a git repository), gather that fact with the steps below.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. `docs/conventions/git-workflow.md` — Commit message format, branch naming, PR process

**Skip files that are empty or contain only template placeholders.** Use conventional commit format as default.

## Step 2: Run the Commit Flow

Follow `${CLAUDE_PLUGIN_ROOT}/.claude/skills/git-commit-flow/SKILL.md` end-to-end — the canonical flow:
assess working tree → stage (ask what to stage via AskUserQuestion) → conventional
commit message (approved by the user) → commit → push (optional) → PR (optional).

## Summary

Present to user:
- Commit hash and message
- Branch pushed (if applicable)
- PR URL (if created)
