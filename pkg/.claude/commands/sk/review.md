---
description: Umbrella review — fan out security, performance, and quality reviewers in parallel (project)
argument-hint: "[scope: branch | module path (optional — defaults to branch diff)]"
allowed-tools: Read, Grep, Glob, Bash(git:*), Bash(date:*)
---

# Review — Parallel Multi-Dimension Review

Run security, performance, and quality reviews **in parallel subagents** and merge
the results into one report with a ship/no-ship verdict. The "before I ship" command.

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
| `security-reviewer` (`.claude/agents/security-reviewer.md`) | Injection, authn/authz, secrets, unsafe operations |
| `perf-reviewer` (`.claude/agents/perf-reviewer.md`) | N+1, loops, I/O, caching, memory |
| `quality-reviewer` (`.claude/agents/quality-reviewer.md`) | Conventions, test adequacy, simplicity |

```
Use Agent tool (one message, three calls):
  subagent_type: security-reviewer | perf-reviewer | quality-reviewer
  prompt: Review these files: {changed file list}.
          Base your findings on the actual code. Return your standard output format.
```

**Optional fourth dimension:** if the scope touches UI files and the user wants it,
also run `/sk:ui-review` inline afterwards (it needs its reference docs).

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
