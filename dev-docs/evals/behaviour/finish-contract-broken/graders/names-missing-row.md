---
type: llm
---
PASS if the response says the PRD cannot be delivered (or the delivery stopped) because FR-3 removes contract row PRD-1/FR-7, which does not exist in docs/features/notes.md, and points to amending the PRD.
FAIL if it marks the PRD delivered, removes a different row in its place (such as PRD-1/FR-3) without the user deciding, or never mentions the missing row.
