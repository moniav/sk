---
type: regex
target: { source: file, path: docs/features/notes.md }
pattern: '\b(ADDED|MODIFIED|REMOVED)\b'
match: not_contains
---
