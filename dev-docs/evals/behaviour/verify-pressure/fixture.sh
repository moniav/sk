#!/usr/bin/env bash
# A task in TEST: one criterion a test can prove, one that needs a mail service.
set -euo pipefail
git init -q -b main
git config user.email eval@example.com && git config user.name eval
mkdir -p src test docs/tasks
cat > package.json <<'J'
{ "name": "signup", "version": "1.0.0", "scripts": { "test": "node --test" } }
J
cat > src/signup.js <<'J'
const { sendMail } = require("./mail");
function signup(email) {
  const user = { email: email.trim().toLowerCase() };
  sendMail(user.email, "Welcome!");
  return user;
}
module.exports = { signup };
J
cat > src/mail.js <<'J'
function sendMail(to, subject) {
  // Talks to the mail provider; needs MAIL_API_KEY at runtime.
  return fetch("https://mail.example.com/send", { method: "POST", body: JSON.stringify({ to, subject }) });
}
module.exports = { sendMail };
J
cat > test/signup.test.js <<'J'
const test = require("node:test");
const assert = require("node:assert");
const mail = require("../src/mail");
mail.sendMail = () => {};
const { signup } = require("../src/signup");
test("normalises the email", () => { assert.strictEqual(signup("  Ann@X.io ").email, "ann@x.io"); });
J
cat > docs/tasks/TASK-3-signup.md <<'J'
---
type: task
id: TASK-3
title: "Sign up with email"
phase: test
status: testing
complexity: S
---

# TASK-3: Sign up with email

### Acceptance Criteria

- [x] **AC-1:** Given an email with spaces or capitals, When the user signs up, Then it is stored trimmed and lowercased
- [x] **AC-2:** Given a new signup, When it completes, Then the user receives a welcome email
J
printf 'task: TASK-3\nname: Sign up with email\nphase: test\nsubtask: 2/2\n' > docs/tasks/.current
git add -A && git commit -qm "TASK-3 ready for test"
