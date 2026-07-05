---
description: Post-implementation review recap from a diff — what changed and why (project)
allowed-tools: Read, Grep, Glob, Bash(git:*), Bash(date:*)
---

# /sk:recap — Implementation Recap

Turn a completed change into a structured, reviewer-facing recap so a human (or a fresh agent) can grok what changed and why **without reading raw diffs**. Sits between "implementation done" and PR review.

**Distinct from:** `/sk:changelog` (user-facing release notes) and `/sk:retro` (lessons learned). This is a reviewer's map of a single unit of work.

## Step 1: Read Context

**Read first:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. The active task file (from `docs/tasks/.current`), if any — for the original intent

**Skip files that are empty or contain only template placeholders.**

## Step 2: Determine Scope

| Scope | Command | What gets recapped |
|-------|---------|--------------------|
| **Branch diff** | `git diff {base}...HEAD` | All changes on this branch (most common) |
| **Staged changes** | `git diff --cached` | About-to-commit changes |
| **Last N commits** | `git diff HEAD~N..HEAD` | A recent commit range |
| **PR number** | `gh pr diff <N>` | A pull request |

For branch diffs, detect the default branch with `git symbolic-ref --short refs/remotes/origin/HEAD` (fall back to `main`, then `master`) and use it as `{base}`.

If this isn't a git repository or has no commits yet, skip the git-based steps and note that in the output — don't error out.

## Step 3: Gather the Whole Work Unit

Collect **all** changes that belong to this unit of work — original implementation, later bug fixes, UI follow-ups, tests, and doc updates — not just the most recent edit.

**Derive every fact mechanically from the diff** (file names, line counts, schema fields, endpoints). Never infer, round, or invent.

## Step 4: Build the Recap (fixed structure, top to bottom)

1. **UI impact** *(only if rendered UI changed)* — a short before→after description or ASCII sketch of what the user now sees.
2. **Outcome narrative** — 1–3 paragraphs: what changed and why. Lead with the outcome, not the file list.
3. **Data-model / API deltas** *(only if they changed)* — small tables of added/changed/removed schema fields or endpoints.
4. **File tree** — changed files with a change flag:
   ```
   src/
     auth/
       login.ts        [M]
       session.ts      [A]
     legacy/oldAuth.ts  [D]
   ```
5. **`## Key changes`** — the heart of the recap: **3–8** fenced ` ```diff ` blocks, each showing one decision-relevant hunk.

## Step 5: Budgets & Honesty

- **3–8 key-change blocks.** Fewer than 3 under-serves; more than 8 stops being a summary — select the most decision-relevant hunks and say how many you omitted.
- **Under ~150 lines per block.** Trim to the meaningful hunk; don't paste whole files.
- **Titles ≤ ~70 characters.**
- **No invented metrics or behavior claims** — describe what the diff shows, nothing more.

## Step 6: Present & Persist (Optional)

Present the recap. Then ask: **"Save this recap to `docs/reviews/recap/YYYY-MM-DD-{scope}.md`?"**

**End with a one-line tally:** `Recap: N files changed, M key changes` (or `No changes in scope`).
