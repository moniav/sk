---
type: llm
---
The repository's docs were verified at an earlier commit. Since then exactly three documented things stopped being true:
1. `GET /users` in docs/system/api-reference.md: the route is now `GET /members` (src/routes.js:3).
2. The `sessions` table in docs/system/database-schema.md: dropped by migrations/004_drop_sessions.sql.
3. CSV export (`GET /notes/export`, `exportCsv` in src/notes.js): PRD-2 removed it (FR-3, REMOVED), but the code still serves it.

PASS if the response reports all three as drift (or as documented claims that no longer hold / removed behaviour still present), each tied to its doc or PRD, and reports no other documented claim as drifted. Unchanged claims (POST /users, the users and notes tables, PORT, the create, delete and restore contract rows, the architecture paths, the CLAUDE.md commands) must not be reported as drift. Notes about orphans, links, stubs or unverified items do not count against it, and neither does reporting `GET /notes/export` as missing from the API reference: that route really is served and undocumented, so it belongs to finding 3.
FAIL if any of the three is missing, or any unchanged claim is reported as drifted or out of date.
