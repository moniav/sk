#!/usr/bin/env bash
# The last task of a feature PRD is finished; its flows and requirements add, modify and remove behaviour in docs/flows and the feature doc's contract.
set -euo pipefail
git init -q -b main
git config user.email eval@example.com && git config user.name eval
mkdir -p src test docs/tasks docs/prd docs/features docs/flows
cat > package.json <<'J'
{ "name": "notes", "version": "1.0.0", "scripts": { "test": "node --test" } }
J
cat > src/notes.js <<'J'
const notes = new Map();
const trash = new Map();
let next = 1;
function createNote(text) { const id = next++; notes.set(id, { id, text }); return id; }
function deleteNote(id) { const n = notes.get(id); if (!n) return false; notes.delete(id); trash.set(id, n); return true; }
function restoreNote(id) { const n = trash.get(id); if (!n) return false; trash.delete(id); notes.set(id, n); return true; }
function listNotes() { return [...notes.values()]; }
module.exports = { createNote, deleteNote, restoreNote, listNotes };
J
cat > test/notes.test.js <<'J'
const test = require("node:test");
const assert = require("node:assert");
const { createNote, deleteNote, restoreNote, listNotes } = require("../src/notes");
test("delete moves a note to the trash and restore brings it back", () => {
  const id = createNote("milk");
  assert.ok(deleteNote(id));
  assert.strictEqual(listNotes().length, 0);
  assert.ok(restoreNote(id));
  assert.strictEqual(listNotes()[0].text, "milk");
});
J
cat > docs/features/README.md <<'J'
# Features

| Feature | Doc | Lifecycle |
|---------|-----|-----------|
| Notes | [notes.md](./notes.md) | current |
J
cat > docs/features/notes.md <<'J'
# Feature: Notes

**Last updated:** 2026-10-01
**Lifecycle:** current
**Status:** shipped
**Code:** `src/notes.js`
**Delivered by:** PRD-1

## What it does

Users write short notes, delete them and export them.

## Behaviour contract

| ID | Requirement | Acceptance (Given / When / Then) | Delivered by |
|----|-------------|----------------------------------|--------------|
| PRD-1/FR-1 | Create a note | Given some text, When the user saves, Then the note appears in the list | PRD-1, TASK-1 |
| PRD-1/FR-2 | Delete a note permanently | Given a note, When the user confirms Delete, Then the note is gone for good | PRD-1, TASK-2 |
| PRD-1/FR-3 | Export notes as CSV | Given notes, When the user clicks Export, Then a CSV downloads | PRD-1, TASK-3 |
J
cat > docs/flows/README.md <<'J'
# Flows

| Flow | File | Lifecycle |
|------|------|-----------|
| Delete a note | [delete-note.md](./delete-note.md) | current |
| Export notes | [export-notes.md](./export-notes.md) | current |
J
cat > docs/flows/delete-note.md <<'J'
# Flow: Delete a note

**Lifecycle:** current

```mermaid
flowchart TD
    A[User clicks Delete] --> B{Confirm dialog}
    B -->|yes| C[Note deleted permanently]
    B -->|no| D[Nothing changes]
```

| Case | Decided behaviour |
|------|-------------------|
| Note already deleted | Show "not found" |
J
cat > docs/flows/export-notes.md <<'J'
# Flow: Export notes

**Lifecycle:** current

```mermaid
flowchart TD
    A[User clicks Export] --> B[CSV downloads]
```
J
cat > docs/prd/PRD-2-trash.md <<'J'
---
type: prd
id: PRD-2
title: "Trash"
kind: feature
status: approved
stage: done
---

# PRD-2: Trash

## 2. User flows

### F-1: Restore a note

**Change:** ADDED

```mermaid
flowchart TD
    A[User opens Trash] --> B[Clicks Restore]
    B --> C[Note back in the list]
```

| Case | At step | Decided behaviour | FR |
|------|---------|-------------------|----|
| Note no longer in the trash | 2 | Show "not found" | FR-1 |

### F-2: Delete a note

**Change:** MODIFIED docs/flows/delete-note.md

Delete no longer asks for confirmation and no longer deletes permanently: the note moves to the Trash at once.

### F-3: Export notes

**Change:** REMOVED docs/flows/export-notes.md

Export is withdrawn; nobody used it.

## 3. Requirements

### Functional

| ID | Requirement | Priority | Traces to | Acceptance (Given / When / Then) | Change |
|----|-------------|----------|-----------|----------------------------------|--------|
| FR-1 | Restore a note from the Trash | Must | F-1 #2 | Given a note in the Trash, When the user clicks Restore, Then the note is back in the list | ADDED docs/features/notes.md |
| FR-2 | Delete moves a note to the Trash | Must | F-2 | Given a note, When the user clicks Delete, Then the note moves to the Trash without a confirmation | MODIFIED docs/features/notes.md PRD-1/FR-2 |
| FR-3 | Withdraw CSV export | Must | F-3 | Given notes, When the user looks for Export, Then there is no Export action | REMOVED docs/features/notes.md PRD-1/FR-3 |

## 5. Delivery

| Epic | Delivers | Status |
|------|----------|--------|
| [EPIC-2](../tasks/EPIC-2-trash.md) | FR-1, FR-2, FR-3 | in-progress |
J
cat > docs/tasks/EPIC-2-trash.md <<'J'
---
type: epic
id: EPIC-2
title: "Trash"
status: in-progress
prd: PRD-2
---

# Epic: Trash

| Task | Delivers | Status |
|------|----------|--------|
| [TASK-4](./TASK-4-trash.md) | FR-1, FR-2 | done |
| [TASK-5](./TASK-5-remove-export.md) | FR-3 | testing |
J
cat > docs/tasks/TASK-4-trash.md <<'J'
---
type: task
id: TASK-4
title: "Trash and restore"
epic: EPIC-2
delivers: FR-1, FR-2
status: done
---

# TASK-4: Trash and restore

### Verification

| AC | Done when | What was run | Result | Proof |
|----|-----------|--------------|--------|-------|
| AC-1 | restore brings a note back | node --test | passed | 1 test passed |
| AC-2 | delete moves to the trash | node --test | passed | 1 test passed |
J
cat > docs/tasks/TASK-5-remove-export.md <<'J'
---
type: task
id: TASK-5
title: "Remove CSV export"
epic: EPIC-2
delivers: FR-3
phase: test
status: testing
---

# TASK-5: Remove CSV export

### Acceptance Criteria

- [x] **AC-1:** Given notes, When the user looks for Export, Then there is no Export action

### Verification

| AC | Done when | What was run | Result | Proof |
|----|-----------|--------------|--------|-------|
| AC-1 | no export function is exported from src/notes.js | grep -n export src/notes.js; node --test | passed | only module.exports matches; 1 test passed |
J
cat > docs/tasks/README.md <<'J'
# Tasks

## Active

| Task | Status |
|------|--------|
| TASK-5 Remove CSV export | testing |

## Recently Completed

| Task | Status |
|------|--------|
| TASK-4 Trash and restore | done |
J
printf 'task: TASK-5\nname: Remove CSV export\nphase: test\nsubtask: 1/1\n' > docs/tasks/.current
git add -A && git commit -qm "notes: trash, restore, export removed"
