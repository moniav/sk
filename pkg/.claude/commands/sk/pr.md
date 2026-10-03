---
description: Create a pull request from the current branch — title and body generated from commits
allowed-tools: Read, Bash(git status *), Bash(git diff *), Bash(git log *), Bash(git show *), Bash(git rev-parse *), Bash(git symbolic-ref *), Bash(git merge-base *), Bash(git ls-files *), Bash(git blame *), Bash(git branch --show-current), Bash(date *), Bash(gh auth status), Bash(gh pr view *), Bash(gh pr create *)
disable-model-invocation: true
---

# PR — Create Pull Request

Standalone PR creation: push the branch if needed, generate title and body from the
commits, create via `gh`, return the URL.

**Use when:** The branch is committed and you just want the PR.
**Use `/sk:finish` instead when:** You want review + commit + PR + task board in one flow.

## Step 1: Preflight

If this isn't a git repository or has no commits yet, say so and stop — don't error out.

1. Current branch: `git branch --show-current`
2. Base branch: `git symbolic-ref --short refs/remotes/origin/HEAD` (fall back to `main`, then `master`)
3. If on the base branch itself: stop — suggest creating a feature branch first
4. Uncommitted changes? Note them and ask whether to commit first (`/sk:commit`) or proceed with what's committed
5. `gh` available and authenticated? (`gh auth status`) If not, give the user the manual PR URL path and stop

## Step 2: Push

If the branch has no upstream (`git rev-parse --abbrev-ref @{upstream}` fails), push
with tracking: `git push -u origin <branch>`. If it has diverged from its upstream,
inform the user — do NOT force-push without explicit approval.

## Step 3: Create the PR

Follow **Step 6 (Create PR)** of `.claude/skills/git-commit-flow/SKILL.md`:
gather commits with `git log {base}..HEAD --oneline`, generate a title (under 70
chars) and body summarizing what changed and why, present for approval, then:

```bash
gh pr create --title "<title>" --body "<body>"
```

If the repo has a PR template (`.github/pull_request_template.md`), fill that
structure instead of inventing one.

## Step 4: Report

Return the PR URL. If a task file is active (`docs/tasks/.current`), add the PR
number to its Progress Log.
