---
description: Harvest deliberate tech-debt markers into a ranked ledger (project)
allowed-tools: Read, Grep, Glob, Bash(git status *), Bash(git diff *), Bash(git log *), Bash(git show *), Bash(git rev-parse *), Bash(git symbolic-ref *), Bash(git merge-base *), Bash(git ls-files *), Bash(git blame *), Bash(git branch --show-current), Bash(date *)
---

# /sk:debt — Tech-Debt Ledger

Collect the deliberate shortcut markers left in the codebase and turn them into a reviewable, ranked ledger. Pairs with the `// sk-debt:` convention (see `docs/conventions/coding-behavior.md`) and feeds `/sk:refactor`.

## Step 1: Read Context

**Read first:**
1. `docs/conventions/coding-behavior.md` — the `sk-debt` marker convention (section 5)
2. `docs/debt-ledger.md` — existing ledger, if one was saved before

**Skip files that are empty or contain only template placeholders.**

## Step 2: Scan for Markers

Search the whole codebase for the marker, case-insensitive, across comment styles (`//`, `#`, `--`, `/* */`, `<!-- -->`):

```
sk-debt:
```

Exclude `node_modules/`, build output, and vendored directories.

## Step 3: Parse Each Marker

Marker format: `sk-debt: <ceiling>, <upgrade trigger>`. For each hit capture:

| Field | How to get it |
|-------|---------------|
| **Location** | `file:line` |
| **Ceiling** | Text before the first comma |
| **Upgrade trigger** | Text after the first comma |
| **Age** | `git blame` on the line → commit date (optional but useful for ranking) |
| **Flag** | `no-trigger` if there is no comma / no upgrade trigger text |

A `no-trigger` marker is debt with no exit plan — the riskiest kind.

## Step 4: Rank

Order the ledger so the most actionable items surface first:
1. `no-trigger` markers (debt with no exit plan)
2. Oldest markers (by blame date)
3. Files/modules with the highest marker density (clustering signals rot)

## Step 5: Present the Ledger

```markdown
## Tech-Debt Ledger — YYYY-MM-DD

| # | Location | Ceiling | Upgrade Trigger | Age | Flag |
|---|----------|---------|-----------------|-----|------|
| 1 | `path:42` | hardcoded to USD | add a second currency | 3mo | — |
| 2 | `path:88` | only handles happy path | — | 6mo | no-trigger |
```

**End with a one-line tally:** `N markers, M no-trigger` (or `No sk-debt markers found — clean`).

## Step 6: Persist (Optional)

Ask: **"Save this ledger to `docs/debt-ledger.md`?"** If yes, write/overwrite it with the table above and the date.

## Step 7: Offer Next Step

- Offer to feed `no-trigger` or oldest items into `/sk:refactor`.
- For substantial debt, offer to create tasks: **"Create tasks for the top N debt items?"**

## Honesty Guardrail

Report only what the markers actually say. Do not invent debt, infer shortcuts that have no marker, or estimate "interest" metrics you didn't measure.
