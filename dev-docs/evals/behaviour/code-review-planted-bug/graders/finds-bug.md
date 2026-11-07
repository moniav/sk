---
type: llm
---
PASS if the review reports that `if (code = "VIP")` in `applyDiscount` is an assignment, not a comparison, so every order gets the VIP discount and the STAFF branch can never run, and treats it as a correctness problem of high severity (Critical, or must fix before merge).
FAIL if that bug is missing or reported only as a minor or style issue.
