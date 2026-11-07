---
type: llm
---
Three October review reports each found a list endpoint returning every row with no page size, fixed each time. The other findings: unused variables or imports (ESLint `no-unused-vars`, run in CI, already catches them), a typo seen once, and "prefer named exports", raised twice and declined both times because the convention file already says to export one object.
PASS if the retrospective proposes exactly one new convention or anti-pattern row for the unbounded-list kind, citing the reports it came from (related changes for that kind, such as a shared helper or a test, are fine), and proposes no convention row, anti-pattern row or new check for the unused-variable, typo or named-exports findings (listing them as dropped, with a reason, is fine).
FAIL if no row is proposed for the unbounded-list kind, if it is split into more than one row, or if any of the other three kinds gets a proposed convention row, anti-pattern row or check.
