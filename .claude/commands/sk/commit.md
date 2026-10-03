---
description: Smart git commit with conventional format, optional push and PR
argument-hint: "[what the commit is about (optional)]"
disable-model-invocation: true
---

# Commit — Smart Git Workflow

Stage, commit with conventional format, optionally push and create a PR.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. `docs/conventions/git-workflow.md` — Commit message format, branch naming, PR process

**Skip files that are empty or contain only template placeholders.** Use conventional commit format as default.

## Step 2: Run the Commit Flow

Follow `.claude/skills/git-commit-flow/SKILL.md` end-to-end — the canonical flow:
assess working tree → stage (ask what to stage via AskUserQuestion) → conventional
commit message (approved by the user) → commit → push (optional) → PR (optional).

## Summary

Present to user:
- Commit hash and message
- Branch pushed (if applicable)
- PR URL (if created)
