#!/usr/bin/env bash
# A new task touches the same area as a finished one. The finished task's notes hold a lesson
# the code does not show, and one claim (the reset_tokens table) that a later migration made false.
set -euo pipefail
git init -q -b main
git config user.email eval@example.com && git config user.name eval
mkdir -p src/auth src/mail src/reports migrations docs/tasks
cat > package.json <<'J'
{ "name": "accounts", "version": "1.0.0", "scripts": { "test": "node --test" } }
J
cat > src/mail/queue.js <<'J'
const jobs = [];
function enqueue(kind, payload) { jobs.push({ kind, payload }); }
module.exports = { enqueue, jobs };
J
cat > src/mail/send.js <<'J'
async function sendNow(to, subject, body) { /* calls the mail provider over HTTP */ }
module.exports = { sendNow };
J
cat > src/auth/db.js <<'J'
const tables = { users: [], tokens: [] };
function insert(table, row) { tables[table].push(row); return row; }
function find(table, pred) { return tables[table].find(pred); }
module.exports = { insert, find, tables };
J
cat > src/auth/signup.js <<'J'
const db = require("./db");
function createUser(email) { return db.insert("users", { id: db.tables.users.length + 1, email, verified: false }); }
module.exports = { createUser };
J
cat > src/auth/reset.js <<'J'
const crypto = require("node:crypto");
const db = require("./db");
const { enqueue } = require("../mail/queue");
function requestPasswordReset(email) {
  const token = crypto.randomBytes(32).toString("hex");
  db.insert("tokens", { token, email, purpose: "reset", expiresAt: Date.now() + 3600e3, used: false });
  enqueue("send-email", { to: email, template: "reset", link: process.env.APP_URL + "/reset/" + token });
}
module.exports = { requestPasswordReset };
J
cat > src/reports/csv.js <<'J'
function toCsv(rows) { return rows.map((r) => Object.values(r).join(",")).join("\n"); }
module.exports = { toCsv };
J
cat > migrations/001_reset_tokens.sql <<'J'
CREATE TABLE reset_tokens (token TEXT PRIMARY KEY, email TEXT NOT NULL, expires_at TIMESTAMP NOT NULL, used BOOLEAN NOT NULL DEFAULT FALSE);
J
cat > migrations/002_tokens.sql <<'J'
ALTER TABLE reset_tokens RENAME TO tokens;
ALTER TABLE tokens ADD COLUMN purpose TEXT NOT NULL DEFAULT 'reset';
J
cat > docs/tasks/TASK-3-password-reset.md <<'J'
---
type: task
id: TASK-3
title: "Password reset email"
phase: done
status: done
areas: src/auth, src/mail
---

# TASK-3: Password reset email

## What

A user who forgot their password gets an email with a single-use link that expires in one hour.

## Dev Notes

- Reset tokens live in the `reset_tokens` table: single use, one-hour expiry.
- Building the link from the request's Host header was flagged in review: Host can be spoofed, so a link could point at an attacker's site. Links are built from `APP_URL` only.
- Sending with `sendNow` inside the request timed out in tests and slowed sign-in; mail goes through `enqueue("send-email", ...)` instead.

## Progress Log

| Date | Phase | Note |
|------|-------|------|
| 2026-09-12 | DONE | Shipped; review finding on Host header fixed |
J
cat > docs/tasks/TASK-4-csv-export.md <<'J'
---
type: task
id: TASK-4
title: "CSV export of reports"
phase: done
status: done
areas: src/reports
---

# TASK-4: CSV export of reports

## What

Export a report as CSV.
J
cat > docs/tasks/TASK-7-email-verification.md <<'J'
---
type: task
id: TASK-7
title: "Email verification on signup"
phase: plan
status: planning
complexity: M
areas:
---

# TASK-7: Email verification on signup

## What

After signup, the user gets an email with a verification link. Until they open it the account is unverified: they can sign in, and see a banner asking them to verify.

### Acceptance Criteria

- [ ] **AC-1:** Given a new signup, When the account is created, Then a verification email with a single-use link is sent
- [ ] **AC-2:** Given a valid link, When the user opens it, Then the account is verified
- [ ] **AC-3:** Given a link older than 24 hours, When the user opens it, Then it is rejected and they can ask for a new one

## Plan

<!-- /sk:plan fills this -->
J
git add -A && git commit -qm "accounts: signup, password reset, csv export"
