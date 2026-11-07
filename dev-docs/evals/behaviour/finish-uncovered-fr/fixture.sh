#!/usr/bin/env bash
# The last task of an epic is being finished, but the Must requirement it delivers is untested.
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
kind: feature
status: approved
---

# PRD-1: Reports

## 3. Requirements

### Functional

| ID | Requirement | Priority | Traces to | Acceptance (Given / When / Then) |
|----|-------------|----------|-----------|----------------------------------|
| FR-1 | Show the monthly report on screen | Must | F-1 #1 | Given a month, When the user opens Reports, Then the totals show |
| FR-2 | Export the report as CSV | Must | F-1 #2 | Given a report, When the user clicks Export, Then a CSV downloads |

## 5. Delivery

| Epic | Delivers | Status |
|------|----------|--------|
| [EPIC-1](../tasks/EPIC-1-reports.md) | FR-1, FR-2 | in-progress |
J
cat > docs/tasks/EPIC-1-reports.md <<'J'
---
type: epic
id: EPIC-1
title: "Reports"
status: in-progress
prd: PRD-1
---

# Epic: Reports

| Task | Delivers | Status |
|------|----------|--------|
| [TASK-1](./TASK-1-report-screen.md) | FR-1 | done |
| [TASK-2](./TASK-2-csv-export.md) | FR-2 | testing |
J
cat > docs/tasks/TASK-1-report-screen.md <<'J'
---
type: task
id: TASK-1
title: "Report screen"
epic: EPIC-1
delivers: FR-1
status: done
---

# TASK-1: Report screen

### Verification

| AC | Done when | What was run | Result | Proof |
|----|-----------|--------------|--------|-------|
| AC-1 | totals show | node --test | passed | ran |
J
cat > docs/tasks/TASK-2-csv-export.md <<'J'
---
type: task
id: TASK-2
title: "CSV export"
epic: EPIC-1
delivers: FR-2
phase: test
status: testing
---

# TASK-2: CSV export

### Acceptance Criteria

- [x] **AC-1:** Given a report, When the user clicks Export, Then a CSV file downloads

### Verification

| AC | Done when | What was run | Result | Proof |
|----|-----------|--------------|--------|-------|
| AC-1 | a CSV downloads in the browser | - | untested | no browser available in this session |
J
cat > docs/tasks/README.md <<'J'
# Tasks

## Active

| Task | Status |
|------|--------|
| TASK-2 CSV export | testing |

## Recently Completed

| Task | Status |
|------|--------|
| TASK-1 Report screen | done |
J
printf 'task: TASK-2\nname: CSV export\nphase: test\nsubtask: 1/1\n' > docs/tasks/.current
git add -A && git commit -qm "reports: CSV export"
