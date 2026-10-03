#!/usr/bin/env node
// scripts/sync.mjs: mirror pkg/.claude/ (what ships) into root .claude/ (the dogfood copy).
// Edit commands, agents and skills in pkg/ only, then run `npm run sync`.

import { cpSync, existsSync, readdirSync, rmSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

for (const sub of ["commands/sk", "agents", "skills"]) {
  const from = join(ROOT, "pkg", ".claude", sub);
  const to = join(ROOT, ".claude", sub);
  if (!existsSync(from)) continue;
  // Replace wholesale so files removed from pkg/ disappear from the copy too.
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
  console.log(`[OK] .claude/${sub} (${readdirSync(to).length} entries)`);
}
