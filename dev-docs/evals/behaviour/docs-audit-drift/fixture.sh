#!/usr/bin/env bash
# Docs were verified at one commit; since then one route was renamed, one table dropped, and
# export, which a delivered PRD removed, is still served. The drift audit must report exactly those.
set -euo pipefail
git init -q -b main
git config user.email eval@example.com && git config user.name eval
mkdir -p src test migrations docs/system docs/features docs/architecture docs/prd
cat > package.json <<'J'
{ "name": "notes", "version": "1.0.0", "scripts": { "test": "node --test", "start": "node src/server.js" } }
J
cat > src/server.js <<'J'
const { routes } = require("./routes");
const port = Number(process.env.PORT || 3000);
module.exports = { port, routes };
J
cat > src/routes.js <<'J'
const notes = require("./notes");
const routes = [
  ["GET", "/users", () => []],
  ["POST", "/users", (body) => body],
  ["POST", "/notes", (body) => notes.createNote(body.text)],
  ["DELETE", "/notes/:id", (p) => notes.deleteNote(Number(p.id))],
  ["POST", "/notes/:id/restore", (p) => notes.restoreNote(Number(p.id))],
  ["GET", "/notes/export", () => notes.exportCsv()],
];
module.exports = { routes };
J
cat > src/notes.js <<'J'
const notes = new Map();
const trash = new Map();
let next = 1;
function createNote(text) { const id = next++; notes.set(id, { id, text }); return id; }
function deleteNote(id) { const n = notes.get(id); if (!n) return false; notes.delete(id); trash.set(id, n); return true; }
function restoreNote(id) { const n = trash.get(id); if (!n) return false; trash.delete(id); notes.set(id, n); return true; }
function listNotes() { return [...notes.values()]; }
function exportCsv() { return listNotes().map((n) => n.id + "," + n.text).join("\n"); }
module.exports = { createNote, deleteNote, restoreNote, listNotes, exportCsv };
J
cat > test/notes.test.js <<'J'
const test = require("node:test");
const assert = require("node:assert");
const { createNote, deleteNote, restoreNote, listNotes } = require("../src/notes");
test("create, delete to trash, restore", () => {
  const id = createNote("milk");
  assert.strictEqual(listNotes().length, 1);
  assert.ok(deleteNote(id));
  assert.strictEqual(listNotes().length, 0);
  assert.ok(restoreNote(id));
  assert.strictEqual(listNotes()[0].text, "milk");
});
J
cat > migrations/001_users.sql <<'J'
CREATE TABLE users (id SERIAL PRIMARY KEY, email TEXT NOT NULL UNIQUE);
J
cat > migrations/002_sessions.sql <<'J'
CREATE TABLE sessions (id SERIAL PRIMARY KEY, user_id INT NOT NULL REFERENCES users(id), expires_at TIMESTAMP NOT NULL);
J
cat > migrations/003_notes.sql <<'J'
CREATE TABLE notes (id SERIAL PRIMARY KEY, text TEXT NOT NULL, trashed BOOLEAN NOT NULL DEFAULT FALSE);
J
echo "# Notes" > README.md
git add -A && git commit -qm "notes service"
SHA=$(git rev-parse --short HEAD)
cat > CLAUDE.md <<'J'
# CLAUDE.md

## Build Commands

```yaml
test:  npm test
start: npm start
```
J
cat > docs/README.md <<'J'
# Docs

- [Architecture](./architecture/README.md)
- [API reference](./system/api-reference.md)
- [Database schema](./system/database-schema.md)
- [Environment variables](./system/env-variables.md)
- [Notes feature](./features/notes.md)
- [PRD-2 Trash](./prd/PRD-2-trash.md)
J
cat > docs/architecture/README.md <<J
# Architecture

**Last updated:** 2026-11-01
**Verified at:** $SHA

One Node service. \`src/routes.js\` declares every route and calls \`src/notes.js\`, which holds notes and the trash in memory. Schema lives in \`migrations/\`. \`src/server.js\` reads the port.
J
cat > docs/system/api-reference.md <<J
# API Reference

**Last updated:** 2026-11-01
**Verified at:** $SHA

| Method | Path | Does | Source |
|--------|------|------|--------|
| GET | /users | List users | \`src/routes.js:3\` |
| POST | /users | Create a user | \`src/routes.js:4\` |
| POST | /notes | Create a note | \`src/routes.js:5\` |
| DELETE | /notes/:id | Move a note to the trash | \`src/routes.js:6\` |
| POST | /notes/:id/restore | Restore a note from the trash | \`src/routes.js:7\` |
J
cat > docs/system/database-schema.md <<J
# Database Schema

**Last updated:** 2026-11-01
**Verified at:** $SHA

| Table | Columns | Source |
|-------|---------|--------|
| users | id, email (unique) | \`migrations/001_users.sql\` |
| sessions | id, user_id → users.id, expires_at | \`migrations/002_sessions.sql\` |
| notes | id, text, trashed | \`migrations/003_notes.sql\` |
J
cat > docs/system/env-variables.md <<J
# Environment Variables

**Last updated:** 2026-11-01
**Verified at:** $SHA

| Name | Read in | Default |
|------|---------|---------|
| PORT | \`src/server.js:2\` | 3000 |
J
cat > docs/features/notes.md <<J
# Feature: Notes

**Last updated:** 2026-11-01
**Verified at:** $SHA
**Lifecycle:** current
**Status:** shipped
**Code:** \`src/notes.js\`, \`src/routes.js\`
**Delivered by:** PRD-1, PRD-2

## Behaviour contract

| ID | Requirement | Acceptance (Given / When / Then) | Delivered by |
|----|-------------|----------------------------------|--------------|
| PRD-1/FR-1 | Create a note | Given some text, When the user saves, Then the note appears in the list | PRD-1, TASK-1 |
| PRD-1/FR-2 | Delete moves a note to the Trash | Given a note, When the user clicks Delete, Then the note moves to the Trash | PRD-1, PRD-2, TASK-4 |
| PRD-2/FR-1 | Restore a note from the Trash | Given a note in the Trash, When the user clicks Restore, Then the note is back in the list | PRD-2, TASK-4 |
J
cat > docs/prd/PRD-2-trash.md <<'J'
---
type: prd
id: PRD-2
title: "Trash"
kind: feature
status: delivered
---

# PRD-2: Trash

## 3. Requirements

| ID | Requirement | Priority | Traces to | Acceptance (Given / When / Then) | Change |
|----|-------------|----------|-----------|----------------------------------|--------|
| FR-1 | Restore a note from the Trash | Must | F-1 | Given a note in the Trash, When the user clicks Restore, Then the note is back in the list | ADDED docs/features/notes.md |
| FR-2 | Delete moves a note to the Trash | Must | F-2 | Given a note, When the user clicks Delete, Then the note moves to the Trash | MODIFIED docs/features/notes.md PRD-1/FR-2 |
| FR-3 | Withdraw CSV export (GET /notes/export) | Must | F-3 | Given notes, When the user looks for Export, Then there is no Export action | REMOVED docs/features/notes.md PRD-1/FR-3 |
J
git add -A && git commit -qm "docs verified at $SHA"
sed -i 's#\["GET", "/users"#["GET", "/members"#' src/routes.js
cat > migrations/004_drop_sessions.sql <<'J'
DROP TABLE sessions;
J
echo "Run with npm start." >> README.md
git add -A && git commit -qm "rename users listing to members; drop sessions; readme"
