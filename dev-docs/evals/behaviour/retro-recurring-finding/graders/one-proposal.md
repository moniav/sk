---
type: llm
---
Three October review reports each found a list endpoint returning every row with no page size, fixed each time. The other findings: unused variables or imports (an ESLint `no-unused-vars` rule already catches them), a typo seen once, and "prefer named exports", raised twice and declined both times.
PASS if the retrospective proposes exactly one change for the unbounded-list kind (a convention or anti-pattern row, or a check), citing the reports it came from, and proposes no convention row or check for the unused-variable, typo or named-exports findings (mentioning them as dropped, with a reason, is fine).
FAIL if the unbounded-list kind is missing, if it is proposed as more than one row, or if any of the other three kinds is proposed as a new convention, anti-pattern or check.
