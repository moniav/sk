---
name: git-commit-flow
description: Canonical git flow — stage, conventional commit, push, PR. Loaded by /sk:commit and /sk:finish; not invoked directly.
disable-model-invocation: true
user-invocable: false
---

# Git Commit Flow

The single source of truth for staging, committing, pushing, and creating a PR.
`/sk:commit` runs this flow standalone; `/sk:finish` runs it as part of shipping.
Follow `docs/conventions/git-workflow.md` where it exists; the rules below are the default.

**Unattended runs:** where a step below says "ask the user", first consult
`docs/conventions/delegation-policy.md` — if it grants the action (e.g. push feature
branch: yes), proceed and log which policy row covered it; if it requires a human and
none is available, stop after the last permitted step and record what's pending
(call the Skill tool with "headless-operation").

## 1. Assess Working Tree

```bash
git status
git diff --cached --stat
git diff --stat
git log --oneline -5
git branch --show-current
```

If this isn't a git repository or has no commits yet, skip the git-based steps and note that in the output — don't error out.

Present a summary: branch, staged changes, unstaged changes, untracked files, last 5 commits (for message style). If there are no changes at all, inform the user and stop.

## 2. Stage Changes

If nothing is staged yet, ask the user what to stage (use AskUserQuestion):
- **All changes** — `git add -A`
- **Specific files** — let the user pick, then `git add <files>`
- **Interactive review** — show diff for each file, user decides per-file

After staging, run `git diff --cached` to show exactly what will be committed.

## 3. Generate Conventional Commit Message

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

## 4. Commit

```bash
git commit -m "<approved message>"
```

If the commit fails (e.g., pre-commit hook), diagnose the issue, fix it, re-stage, and create a **new** commit (do not amend). Never skip hooks.

## 5. Push (Optional)

Ask the user: **Push to remote?**

If yes:
1. Check if the branch has an upstream: `git rev-parse --abbrev-ref @{upstream}`
2. If no upstream, push with tracking: `git push -u origin <branch>`
3. If upstream exists, push normally: `git push`

If push fails (e.g., diverged history), inform the user and suggest options — do NOT force-push without explicit approval.

## 6. Create PR (Optional)

Ask the user: **Create a pull request?**

If yes:
1. Determine the base branch: `git symbolic-ref --short refs/remotes/origin/HEAD` (fall back to `main`, then `master`)
2. Run `git log {base}..HEAD --oneline` to gather all commits on this branch
3. Generate a PR title (under 70 chars) from the commits, and a body in the shape below. If the repository has its own PR template (`.github/pull_request_template.md`), fill that instead.

```markdown
## Summary

<The smallest view that makes the change clear, then one or two sentences on what changed and why.
 Pick one: a diff sketch of the structure, a call tree, a short file tree, pseudocode of the new logic,
 or a small Mermaid diagram. Skip the visual for a one-line change.>

## Evidence

- **Before:** <the failing output, the screenshot, or the measured number>
- **After:** <the passing output, the screenshot, or the measured number>

## Merge danger

**Door:** one-way | two-way
**Blast radius:** <what is affected if this is wrong, in a few words>

## Notes

<Follow-ups, and what a reviewer should look at first. Omit if there is nothing.>
```

   - **Evidence is real or it is marked absent.** Use output produced in this session or recorded in the task's Verification section. If there is none, write "not verified" and why. Never invent it.
   - **One-way door:** hard to undo once merged or deployed (a data migration, a public API or wire format, a deleted column). **Two-way door:** a revert restores the previous state.
   - Link the task or issue the PR closes.
4. Present for approval, then create:

```bash
gh pr create --title "<title>" --body "<body>"
```

5. Return the PR URL to the user.

If `gh` is not available or the user declines, skip this step. `/sk:pr` runs this step standalone.
