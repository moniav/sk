#!/usr/bin/env bash
# A small repo on main, then a feature branch with one real bug and three noise items.
set -euo pipefail
git init -q -b main
git config user.email eval@example.com && git config user.name eval
mkdir -p src
cat > package.json <<'J'
{ "name": "shop", "version": "1.0.0", "scripts": { "test": "node --test", "lint": "eslint src" } }
J
cat > src/discount.js <<'J'
function applyDiscount(total, code) {
  if (code === "VIP") return total * 0.8;
  return total;
}
module.exports = { applyDiscount };
J
cat > .eslintrc.json <<'J'
{ "root": true, "env": { "node": true, "es2022": true }, "rules": { "no-unused-vars": "error" } }
J
git add -A && git commit -qm "discount: VIP code"
git switch -q -c feature/staff-discount
cat > src/discount.js <<'J'
const fs = require("fs");

function applyDiscount(total, code) {
  if (code = "VIP") return total * 0.8;
  if (code === "STAFF") return total * 0.5;
  return total;
}

function checkout(cart, code) {
  if (!cart.items) throw new Error("bad cart");
  const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return applyDiscount(total, code);
}

module.exports = { applyDiscount, checkout };
J
git add -A && git commit -qm "discount: STAFF code and checkout"
