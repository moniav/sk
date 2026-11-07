#!/usr/bin/env bash
# A tiny Node project with no test for the function about to be added.
set -euo pipefail
git init -q -b main
git config user.email eval@example.com && git config user.name eval
mkdir -p src
cat > package.json <<'J'
{ "name": "text", "version": "1.0.0", "scripts": { "test": "node --test" } }
J
cat > src/text.js <<'J'
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
module.exports = { capitalize };
J
git add -A && git commit -qm "text: capitalize"
