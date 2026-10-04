# Decision trail

One format for recording decisions made without asking, so a person can review them afterwards and trust the result. Used by the `plow-ahead` and `headless-operation` skills.

## Format

One row per decision. Cells stay on one line.

```markdown
| Date | Decision | Why | Evidence | Result | Who |
|------|----------|-----|----------|--------|-----|
| 2026-03-15 | Used ISO-8601 for the export dates | Format not specified; matches the API | src/export/format.ts:42 | done, cheap to change | session |
| 2026-03-15 | Pushed the feature branch | delegation-policy: "push feature branch: yes" | commit 3a9f1c2 | pushed | routine: nightly-docs-audit |
| 2026-03-16 | Reverted the date change above | Supersedes 2026-03-15 "ISO-8601": the importer rejects it | commit 7c21e0a, test output | reverted, tests green | session |
```

- **Decision:** what was chosen or done, in plain words.
- **Why:** the reason in one clause. For a decision a policy row covered, name the row.
- **Evidence:** a pointer that proves it, never a paragraph: a commit, a `file:line`, a PR, a report path, a command and its output file.
- **Result:** the outcome or the current state: `done`, `tests green`, `reverted`, `open`, `inconclusive`. For an assumption, add how cheap it is to change.
- **Who:** `session` for interactive work, or the routine name for an unattended run, or `founder`, or the executive seat.

## Rules

- **Append only.** A wrong call gets a new row that names the row it supersedes. Never edit or delete a row.
- **Log decision points, not actions:** an assumption acted on, a fork chosen, a decision a policy row covered, a pivot or a revert and what triggered it, a blocker raised. Skip the self-evident.
- **Inconclusive is not a pass.** Write `inconclusive` when that is the truth.

## Where it is kept

- **Interactive work:** keep the rows in the conversation and show the whole table at the end, so the user can correct any assumption in one pass.
- **Unattended or long-running work:** append the rows to `docs/decisions/decision-log.md`. If that file does not exist, use the task file's Progress Log.
- An existing `decision-log.md` with fewer columns: add the missing columns to its header and leave the old rows as they are.

## Audit before handing back

At the end of an unattended run, or a long one the user stepped away from, check the trail against what happened:

1. Every row maps to something that was actually done.
2. Every evidence pointer resolves and shows what the row claims.
3. Every fork, pivot or abandoned approach that shaped the result has a row. Add the missing ones.
4. A row that turns out to be wrong gets a superseding row. It is never edited.

End the report with an **Attention** list: rows with weak or no evidence, checks that were skipped, and choices that look risky in hindsight. "Nothing to flag" is a valid entry.
