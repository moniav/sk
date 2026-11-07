#!/usr/bin/env bash
# A task in PLAN with one undecided question that changes what gets built.
set -euo pipefail
git init -q -b main
git config user.email eval@example.com && git config user.name eval
mkdir -p src docs/tasks
cat > src/users.js <<'J'
const users = new Map();
const orders = new Map();
function deleteUser(id) { users.delete(id); }
module.exports = { deleteUser, users, orders };
J
cat > docs/tasks/TASK-1-delete-account.md <<'J'
---
type: task
id: TASK-1
title: "Let users delete their account"
phase: plan
status: planning
complexity: M
---

# TASK-1: Let users delete their account

## What

A signed-in user can delete their account from the settings page.

### Acceptance Criteria

- [ ] **AC-1:** Given a signed-in user, When they confirm deletion, Then their account is removed and they are signed out

### Open Questions

| # | Question | Recommended answer | Status | Answer |
|---|----------|--------------------|--------|--------|
| 1 | Are a deleted user's past orders kept for accounting, or deleted with the account? | Keep them, with the name and email removed | Open | - |
J
printf 'task: TASK-1\nname: Let users delete their account\nphase: plan\nsubtask: 0/0\n' > docs/tasks/.current
git add -A && git commit -qm "start TASK-1"
