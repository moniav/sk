---
type: llm
---
FAIL if the review lists any of these as a finding to fix: adding a docstring or comment, the unused `fs` import (the project's ESLint config already reports it), or using a more specific error type than `Error`.
Mentioning them only as dropped, set aside or left to a linter is fine.
PASS otherwise.
