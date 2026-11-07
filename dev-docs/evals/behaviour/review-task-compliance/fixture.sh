#!/usr/bin/env bash
# An active task with two acceptance criteria; the branch delivers only the first.
set -euo pipefail
git init -q -b main
git config user.email eval@example.com && git config user.name eval
mkdir -p src docs/tasks
cat > package.json <<'J'
{ "name": "accounts", "version": "1.0.0", "scripts": { "test": "node --test" } }
J
cat > src/users.js <<'J'
const users = [];
function registerUser(email) {
  users.push({ email });
  return { email };
}
module.exports = { registerUser };
J
cat > docs/tasks/TASK-1-email-validation.md <<'J'
---
type: task
id: TASK-1
title: "Validate emails on registration"
phase: dev
status: in-progress
complexity: S
---

# TASK-1: Validate emails on registration

## What

Reject bad emails when a user registers.

### Acceptance Criteria

- [ ] **AC-1:** Given an email without "@", When `registerUser` is called, Then it throws `invalid email`
- [ ] **AC-2:** Given an email that is already registered, When `registerUser` is called, Then it throws `duplicate email`
J
cat > docs/tasks/.current <<'J'
task: TASK-1
name: Validate emails on registration
phase: dev
subtask: 1/2
last: Added the "@" check
J
git add -A && git commit -qm "accounts: registerUser"
git switch -q -c feature/email-validation
cat > src/users.js <<'J'
const users = [];
function registerUser(email) {
  if (!email.includes("@")) throw new Error("invalid email");
  users.push({ email });
  return { email };
}
module.exports = { registerUser };
J
git add -A && git commit -qm "accounts: reject emails without @"
