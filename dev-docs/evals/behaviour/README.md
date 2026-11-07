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
| `finish-uncovered-fr` | `/sk:finish` leaves the epic open and the PRD undelivered while a Must requirement is untested |
| `dev-ac-change` | `/sk:dev` does not loosen a criterion that traces to a PRD requirement; it points to the PRD |
| `review-broken-caller` | `/sk:review` finds a caller outside the diff that the change breaks |
| `finish-contract-merge` | `/sk:finish` delivering a feature PRD adds, modifies and removes contract rows and flows by their Change tag, and copies no tag |
| `finish-contract-broken` | `/sk:finish` stops the delivery when a REMOVED tag names a contract row that does not exist, instead of guessing |
