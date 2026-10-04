---
description: Run a retrospective on completed work — capture lessons, patterns, and improvements
argument-hint: "[TASK-N | EPIC-N | time period (optional)]"
disable-model-invocation: true
---

# /sk:retro — Retrospective

Look back at finished work and change the environment so the next piece of work goes better.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

Copy the steps below into your todo list before starting. A step you decide not to do stays on the list as "skip: <reason>".

## Rules

- **A lesson that changes nothing is not a result.** Every finding ends as a proposed change to a named file, or it is dropped.
- **Prefer a mechanism to a sentence.** A mistake a tool could have caught gets a check, not a paragraph. Only a judgement call becomes written guidance.
- **Nothing is applied without approval.** Present the proposals; apply only the ones the user accepts. In a headless run, apply nothing and put every proposal in the report.
- **Every finding cites where it happened:** a commit, a `file:line`, a Progress Log entry, a review verdict, a decision-log row.
- **Patterns, not incidents.** Something that happened once and is unlikely to recur is dropped.
- **Never fabricate a metric.** State a number only if you counted it from a real source (git log, test output, the decision log, the task board). Otherwise leave it out.
- Blameless: the question is what in the environment allowed the mistake.

## Step 1: Scope and Evidence

Scope: the task, epic, commit range or period in the arguments. With no arguments, use the most recently completed task (`docs/tasks/.current`, then `docs/tasks/README.md`).

Gather, skipping files that are empty or still templates:

1. The task or epic file: plan, Progress Log, Verification section, Dev Notes
2. `git log` for the scope, and the diff where a finding needs it (skip the git steps if this is not a repository)
3. Review reports under `docs/reviews/` for the scope
4. `docs/decisions/decision-log.md` rows and `status: blocked` items for the scope
5. This conversation, if the work was done in it

Done when you can list what was planned, what shipped, and every point where the work was redone, blocked, corrected by the user, or failed a review.

## Step 2: Find Candidates

Read the evidence three times, each time for one thing:

| Pass | Look for |
|------|----------|
| **Judgement** | Decisions that had to be reversed, scope that grew, a plan that missed something a reviewer or the user caught |
| **Tooling** | A mistake an automated check could have caught; a check that exists but is not wired in; a command that was slow, noisy or had to be retried; information the agent needed and could not find |
| **Divergence** | Where what was built differs from what was asked, and where instructions in `CLAUDE.md` or the conventions were not followed, or changed nothing |

For autonomous runs, also count from the sources in Step 1: escalations, blocked items, first-pass review results against rework, gates passed under policy against gates that asked.

## Step 3: Route Each Finding

Classify each candidate and name the change. Use the strongest mechanism the project can support.

| The mistake was... | Route it to | Example |
|--------------------|-------------|---------|
| **Mechanical:** a fixed pattern a tool can detect | A check: a lint rule, a pre-commit hook, a CI job, a test, a type | "Imports from `internal/` outside the package" becomes a lint rule |
| **A judgement call** a reviewer should have caught | One line in the convention file the reviewer reads (`docs/conventions/code-style.md`, `testing.md`, `file-structure.md`) | "Prefer the existing retry helper over a new loop" |
| **Missing information** | A pointer where the agent looks first: `CLAUDE.md` (sparingly), `docs/README.md`, `docs/system/project-context.md`, or the doc that was wrong | The test command was not in Build Commands |
| **An instruction that was ignored or changed nothing** | Delete it, or replace it with a check | A `CLAUDE.md` line the diff shows was not followed |
| **A decision that will recur** | `docs/conventions/delegation-policy.md` (widen or tighten, citing the counts), or an ADR | Policy asked every time for something always approved |
| **The user's preference or a project gotcha** | Claude Code memory | "Always squash before opening a PR" |
| **Friction in SK itself** | A note for the user to raise | A command step that did not fit this project |

Coding standards are enforced at review, not during implementation: the implementer has the most to hold in mind, the reviewer reads a diff. So a new standard goes where the `quality-reviewer` reads it, not into `CLAUDE.md`.

If a check covers the finding, propose only the check. Do not also add a sentence.

## Step 4: Propose

Present the proposals, most severe first. Severity is how much rework or risk the pattern caused, from the evidence.

```markdown
## Retrospective: [scope]
**Date:** YYYY-MM-DD

### Went well (keep doing)
- [pattern, with where it showed]

### Proposed changes
| # | What happened (evidence) | Kind | Change | File |
|---|--------------------------|------|--------|------|
| 1 | [finding, with commit or file:line] | Mechanical | [the check to add] | [path] |

### Dropped
- [one-off or unsupported candidate, and why]
```

Ask which proposals to apply (use AskUserQuestion, multi-select).

## Step 5: Apply What Was Approved

Make each approved change. For a check, add it and run it once to show that it passes on the current code and would have caught the finding. For a convention line, add the line and nothing else.

Done when every approved proposal is either applied, with the file changed and any check run, or marked "not applied: <reason>".

## Step 6: Save

Ask: **"Save this retrospective to `docs/reviews/retro/YYYY-MM-DD-{scope}.md`?"** In a headless run, save it without asking and list every proposal under "Needs human review".

**Reply:** the scope, what went well, each proposal with whether it was applied, any checks added and their output, what was dropped, and where the report was saved.
