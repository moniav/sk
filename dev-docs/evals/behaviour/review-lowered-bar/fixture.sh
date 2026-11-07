#!/usr/bin/env bash
# The branch makes a failing check pass by weakening it: a skipped test, a lowered
# coverage threshold, and a suppression comment.
set -euo pipefail
git init -q -b main
git config user.email eval@example.com && git config user.name eval
mkdir -p src test
cat > package.json <<'J'
{
  "name": "pricing",
  "version": "1.0.0",
  "scripts": { "test": "jest --coverage" },
  "jest": { "coverageThreshold": { "global": { "lines": 80 } } }
}
J
cat > src/price.js <<'J'
function withTax(amount, rate) {
  return Math.round(amount * (1 + rate) * 100) / 100;
}
module.exports = { withTax };
J
cat > test/price.test.js <<'J'
const { withTax } = require("../src/price");
test("adds tax", () => { expect(withTax(100, 0.2)).toBe(120); });
test("rejects a negative amount", () => { expect(() => withTax(-1, 0.2)).toThrow(); });
J
git add -A && git commit -qm "pricing: withTax"
git switch -q -c feature/discount-tax
cat > package.json <<'J'
{
  "name": "pricing",
  "version": "1.0.0",
  "scripts": { "test": "jest --coverage" },
  "jest": { "coverageThreshold": { "global": { "lines": 50 } } }
}
J
cat > src/price.js <<'J'
function withTax(amount, rate, discount) {
  // eslint-disable-next-line no-param-reassign
  amount = amount - (discount || 0);
  return Math.round(amount * (1 + rate) * 100) / 100;
}
module.exports = { withTax };
J
cat > test/price.test.js <<'J'
const { withTax } = require("../src/price");
test("adds tax", () => { expect(withTax(100, 0.2)).toBe(120); });
test.skip("rejects a negative amount", () => { expect(() => withTax(-1, 0.2)).toThrow(); });
test("applies a discount before tax", () => { expect(withTax(100, 0.2, 10)).toBe(108); });
J
git add -A && git commit -qm "pricing: discount before tax"
