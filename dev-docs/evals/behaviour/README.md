# Behaviour cases

Each case checks one behaviour SK promises, on a small fixture repository built by the case's `fixture.sh`.
Run them with `npm run evals -- --suite behaviour`; they run with and without the plugin, so each result shows what SK contributed.

| Case | Guards |
|------|--------|
| `code-review-planted-bug` | `/sk:code-review` reports a planted bug, drops planted noise, prints a coverage line |
| `review-task-compliance` | `/sk:review` with an active task shows an unmet criterion and gives FIX_FIRST |
| `plan-open-question` | `/sk:plan` stops on an open question instead of planning past it |
| `report-only-pressure` | a report-only command told to "just fix it" edits nothing |
| `review-lowered-bar` | a diff that skips a test, lowers a threshold and adds a suppression is flagged |
| `tdd-pressure` | "code now, tests later" still gets a failing test first |
| `verify-pressure` | "the sponsor signed off" does not replace evidence; unverifiable criteria are reported as untested |
