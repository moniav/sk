---
name: error-recovery
description: Guides recovery from a broken state, such as merge or rebase conflicts, a corrupted git state, a build that broke after a dependency change, lockfile conflicts or a failed deploy. Use when something is broken and needs diagnosing before any fix is tried.
---

# Error Recovery

> Diagnose before acting. Understand what broke and why before attempting recovery.

## When This Activates

- Merge conflicts during rebase or merge
- Build failures after dependency changes
- Failed deployments or rollbacks needed
- Corrupted git state (detached HEAD, bad rebase, lost commits)
- Test suite broken by environmental issues (not code bugs)
- Lock file conflicts or dependency resolution failures

## Core Principle

**Diagnose before acting.** The instinct during a broken state is to try fixes quickly. Resist. Understand what broke and why before attempting recovery.

## Recovery Protocols

### Merge Conflicts

1. `git status` — understand the full scope (how many files, which ones)
2. Read each conflicted file — understand both sides of the conflict
3. Check the intent — read the commit messages/PR descriptions for both branches
4. Resolve semantically, not syntactically — understand what each side was trying to do
5. After resolving: run tests before completing the merge/rebase
6. **Never** use `--ours` or `--theirs` blindly on the whole repo

### Failed Build After Dependency Changes

1. Read the actual error message (don't guess)
2. Check: was it a lockfile conflict? Version mismatch? Missing peer dep?
3. Try the minimal fix first: delete lockfile + node_modules, reinstall
4. If that fails: check the changelog of the changed dependency for breaking changes
5. If still stuck: pin to the last known working version, then investigate

### Git State Recovery

1. `git status` and `git log --oneline -20` — understand current state
2. Check `git reflog` — your work is almost never truly lost
3. Common fixes:
   - Detached HEAD: `git checkout <branch>` (if no commits to save) or `git checkout -b recovery` (if commits to save)
   - Bad rebase: `git rebase --abort` if in progress, or `git reflog` + `git reset --hard <pre-rebase-ref>` if completed
   - Lost commits: `git reflog` to find them, `git cherry-pick` to recover
4. **Never** `git clean -fd` or `git reset --hard` without checking `git stash list` and `git status` first

### Failed Deploy / Rollback

1. Check deploy logs — what specifically failed?
2. Is the previous version still running? (Partial deploy vs full failure)
3. If rollback needed: use the platform's rollback mechanism (not a new deploy of old code)
4. After rollback: reproduce the failure locally before attempting a fix
5. **Never** push a "fix forward" without understanding the root cause

### Broken Test Environment

1. Distinguish: is it a code bug or an environment issue?
   - Same tests pass locally but fail in CI? → Environment issue
   - Tests fail everywhere? → Code bug (use /sk:debug instead)
2. Common environment fixes: clear caches, rebuild containers, check env vars, verify service dependencies are running
3. Check: did someone else's change break the shared environment?

## Rules

- Always check `git status` and `git stash list` before any destructive recovery action
- Prefer `git rebase --abort` over manual fixups when in a messy rebase
- After ANY recovery: run the full test suite to verify you're back to a good state
- Document what went wrong and how you recovered (for retrospectives)
- If you've spent 3 attempts on recovery without progress → escalate (escalation-rules skill)
