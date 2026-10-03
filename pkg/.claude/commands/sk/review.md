---
description: "Umbrella review: runs security, performance and quality reviewers in parallel and gives a ship or no-ship verdict. Use when the user asks for a full review of a branch or feature before shipping."
argument-hint: "[scope: branch | module path (optional — defaults to branch diff)]"
allowed-tools: Read, Grep, Glob, Bash(git status *), Bash(git diff *), Bash(git log *), Bash(git show *), Bash(git rev-parse *), Bash(git symbolic-ref *), Bash(git merge-base *), Bash(git ls-files *), Bash(git blame *), Bash(git branch --show-current), Bash(date *)
disallowed-tools: Edit, NotebookEdit
---

# Review — Parallel Multi-Dimension Review

Run security, performance, and quality reviews **in parallel subagents** and merge
the results into one report with a ship/no-ship verdict. The "before I ship" command.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

**Report-only.** This command does not modify project files. The only file it may write is its report under `docs/reviews/`.

**Use when:** A branch or feature is about to ship and you want full coverage in one pass.
**Use `/sk:code-review`, `/sk:security-review`, `/sk:perf-review` individually when:** You want one deep dimension inline instead of the parallel sweep.

## Step 1: Determine Scope

If this isn't a git repository or has no commits yet, ask the user for explicit file
paths instead — don't error out.

- **Default:** the branch diff. Detect the base branch with
  `git symbolic-ref --short refs/remotes/origin/HEAD` (fall back to `main`, then
  `master`), then `git diff {base}...HEAD --stat` for the changed-file list.
- **If the user passed a path:** review those files/directories instead.
- If the diff is empty, inform the user and stop.

## Step 2: Dispatch Reviewers (parallel)

Dispatch all three agents **in a single message** (parallel Agent calls), each with
the scoped file list:

| Agent | Dimension |
|-------|-----------|
| `security-reviewer` | Injection, authn/authz, secrets, unsafe operations |
| `perf-reviewer` | N+1, loops, I/O, caching, memory |
| `quality-reviewer` | Conventions, test adequacy, simplicity |

```
Use Agent tool (one message, three calls):
  subagent_type: security-reviewer | perf-reviewer | quality-reviewer   (prefixed `sk:` when SK is installed as a plugin)
  prompt: Review these files: {changed file list}.
          Base your findings on the actual code. Return your standard output format.
```

**Optional fourth dimension:** if the scope touches UI files and the user wants it,
also apply `${CLAUDE_PLUGIN_ROOT}/.claude/commands/sk/ui-review.md` inline afterwards (read the file; it needs its reference docs).

## Step 3: Merge Report

Combine into one report, deduplicating overlapping findings (same file:line reported
by two reviewers → keep the more severe framing, note both dimensions):

```
## Review — {branch or path} — {date}

### Verdict: SHIP | FIX_FIRST | BLOCK
(BLOCK if any security Critical; FIX_FIRST if any Critical/High anywhere)

### Critical / High
| # | Dimension | Location | Finding | Suggested fix |

### Moderate / Suggestions
| # | Dimension | Location | Finding | Suggested fix |

### Clean dimensions
- (reviewers that returned no findings — say so explicitly)
```

End with the quantified footer: `Review: {N} files · S security · P perf · Q quality findings · verdict {V}`.

## Step 4: Offer Next Steps

- Findings to fix now → offer to fix them (each fix as its own commit)
- **Save report?** → `docs/reviews/{date}-review-{branch}.md` (ask first)
- Clean verdict → suggest `/sk:finish` to ship
