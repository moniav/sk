#!/usr/bin/env bash
# The branch changes what getPrice() returns and updates one caller, but an untouched file
# still treats the result as a number: invoice.js now throws on every invoice.
set -euo pipefail
git init -q -b main
git config user.email eval@example.com && git config user.name eval
mkdir -p src
cat > package.json <<'J'
{ "name": "shop", "version": "1.0.0", "scripts": { "test": "node --test" } }
J
cat > src/pricing.js <<'J'
const PRICES = { apple: 0.5, pear: 0.75 };
function getPrice(item) {
  return PRICES[item.sku] * item.qty;
}
module.exports = { getPrice };
J
cat > src/cart.js <<'J'
const { getPrice } = require("./pricing");
function cartTotal(items) {
  let total = 0;
  for (const item of items) total += getPrice(item);
  return total;
}
module.exports = { cartTotal };
J
cat > src/invoice.js <<'J'
const { getPrice } = require("./pricing");
function invoiceLines(items) {
  return items.map((item) => item.sku + ": " + getPrice(item).toFixed(2));
}
module.exports = { invoiceLines };
J
git add -A && git commit -qm "shop: pricing, cart, invoice"
git switch -q -c feature/currency
cat > src/pricing.js <<'J'
const PRICES = { apple: 0.5, pear: 0.75 };
function getPrice(item, currency = "EUR") {
  return { amount: PRICES[item.sku] * item.qty, currency };
}
module.exports = { getPrice };
J
cat > src/cart.js <<'J'
const { getPrice } = require("./pricing");
function cartTotal(items) {
  let total = 0;
  for (const item of items) total += getPrice(item).amount;
  return total;
}
module.exports = { cartTotal };
J
git add -A && git commit -qm "pricing: return amount with currency"
