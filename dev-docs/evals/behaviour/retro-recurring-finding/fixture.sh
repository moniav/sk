#!/usr/bin/env bash
# Three review reports share one finding kind (list endpoints with no page size), fixed each time.
# Distractors: unused variables (a lint rule covers them), a typo (seen once), and "prefer named
# exports" (raised twice, never fixed: disputed). Only the first should become a proposal.
set -euo pipefail
git init -q -b main
git config user.email eval@example.com && git config user.name eval
mkdir -p src test .github/workflows docs/reviews/code docs/conventions docs/tasks
cat > package.json <<'J'
{ "name": "shop-api", "version": "1.0.0", "scripts": { "test": "node --test", "lint": "eslint src" }, "devDependencies": { "eslint": "8.57.0" } }
J
cat > .github/workflows/ci.yml <<'J'
name: ci
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm test
J
cat > .eslintrc.json <<'J'
{ "root": true, "env": { "node": true, "es2022": true }, "rules": { "no-unused-vars": "error" } }
J
cat > docs/conventions/code-style.md <<'J'
# Code Style

- Plain CommonJS modules, one per resource in `src/`.
- Validate input at the route boundary.
- Export one object per module (`module.exports = { ... }`), not named `exports.x` assignments.
J
for r in orders invoices customers; do
cat > src/$r.js <<J
const rows = [];
function list${r^}() { return rows; }
module.exports = { list${r^} };
J
done
git add -A && git commit -qm "shop api: orders, invoices, customers"
cat > docs/reviews/code/2026-10-02-orders.md <<'J'
# Code review: orders listing (TASK-11), 2026-10-02

| # | Severity | Location | Finding | Status |
|---|----------|----------|---------|--------|
| 1 | High | src/orders.js:2 | `listOrders` returns every row with no page size; a large shop gets a multi-megabyte response and a slow query | fixed in "orders: cap list page size" |
| 2 | Minor | src/orders.js:1 | unused variable `tmp` | fixed |
| 3 | Suggestion | src/orders.js:3 | prefer named exports over an object | won't fix: the project uses object exports everywhere |
J
for r in orders invoices customers; do
cat > src/$r.js <<J
const rows = [];
const MAX_PAGE = 100;
function list${r^}(limit = 50, offset = 0) { return rows.slice(offset, offset + Math.min(limit, MAX_PAGE)); }
module.exports = { list${r^} };
J
cat > test/$r.test.js <<J
const test = require("node:test");
const assert = require("node:assert");
const { list${r^} } = require("../src/$r");
test("list${r^} caps the page size", () => { assert.ok(list${r^}(1000).length <= 100); });
J
git add -A && git commit -qm "$r: cap list page size (review finding: unbounded list)"
if [ "$r" = orders ]; then
cat > docs/reviews/code/2026-10-15-invoices.md <<'J'
# Code review: invoices listing (TASK-12), 2026-10-15

| # | Severity | Location | Finding | Status |
|---|----------|----------|---------|--------|
| 1 | High | src/invoices.js:2 | `listInvoices` has no limit: every invoice is loaded and returned on each call | fixed in "invoices: cap list page size" |
| 2 | Minor | src/invoices.js:4 | log message says "invocie" | fixed |
J
fi
if [ "$r" = invoices ]; then
cat > docs/reviews/code/2026-10-28-customers.md <<'J'
# Code review: customers listing (TASK-13), 2026-10-28

| # | Severity | Location | Finding | Status |
|---|----------|----------|---------|--------|
| 1 | High | src/customers.js:2 | `listCustomers` returns the whole table; no page size or cursor | fixed in "customers: cap list page size" |
| 2 | Minor | src/customers.js:1 | unused import `lodash` | fixed |
| 3 | Suggestion | src/customers.js:3 | prefer named exports | won't fix: same as the orders review |
J
fi
done
cat > docs/tasks/README.md <<'J'
# Tasks

## Recently Completed

| Task | Status |
|------|--------|
| TASK-11 Orders listing | done |
| TASK-12 Invoices listing | done |
| TASK-13 Customers listing | done |
J
git add -A && git commit -qm "reviews for October"
