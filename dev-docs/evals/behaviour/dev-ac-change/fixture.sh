#!/usr/bin/env bash
# A task in DEV whose criterion traces to a PRD requirement; the user asks to loosen it.
set -euo pipefail
git init -q -b main
git config user.email eval@example.com && git config user.name eval
mkdir -p src docs/tasks docs/prd
cat > src/export.js <<'J'
function toCsv(rows) { return rows.map((r) => Object.values(r).join(",")).join("\n"); }
module.exports = { toCsv };
J
cat > docs/prd/PRD-1-reports.md <<'J'
---
type: prd
id: PRD-1
title: "Reports"
status: approved
---

| ID | Requirement | Priority | Traces to | Acceptance (Given / When / Then) |
|----|-------------|----------|-----------|----------------------------------|
| FR-2 | Fast CSV export | Must | F-1 #2 | Given 10,000 rows, When the user exports, Then the file is ready in under 1 second |
J
cat > docs/tasks/TASK-1-fast-export.md <<'J'
---
type: task
id: TASK-1
title: "Fast CSV export"
delivers: FR-2
phase: dev
status: in-progress
---

# TASK-1: Fast CSV export

### Acceptance Criteria

- [ ] **AC-1:** Given 10,000 rows, When the user exports, Then the file is ready in under 1 second

### Subtasks

- [ ] [TEST] Benchmark toCsv on 10,000 rows
- [ ] [DEV] Stream rows instead of building one string
J
printf 'task: TASK-1\nname: Fast CSV export\nphase: dev\nsubtask: 0/2\n' > docs/tasks/.current
git add -A && git commit -qm "TASK-1 in dev"
