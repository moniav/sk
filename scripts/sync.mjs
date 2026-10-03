#!/usr/bin/env node
// scripts/sync.mjs: mirror pkg/.claude/ (what ships) into root .claude/ (the dogfood copy).
// Edit commands, agents and skills in pkg/ only, then run `npm run sync`.
//
// The dogfood copy is a project install, so it gets the same path rewrite that
// cli.mjs applies when it copies a file into a project.

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN_PREFIX = "${CLAUDE_PLUGIN_ROOT}/.claude/";

export function renderForProject(buffer, rel) {
  if (!rel.endsWith(".md")) return buffer;
  return Buffer.from(buffer.toString("utf-8").split(PLUGIN_PREFIX).join(".claude/"), "utf-8");
}

function listFilesRel(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFilesRel(full, base));
    else out.push(full.slice(base.length + 1).replace(/\\/g, "/"));
  }
  return out;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const sub of ["commands/sk", "agents", "skills"]) {
    const from = join(ROOT, "pkg", ".claude", sub);
    const to = join(ROOT, ".claude", sub);
    if (!existsSync(from)) continue;
    // Replace wholesale so files removed from pkg/ disappear from the copy too.
    rmSync(to, { recursive: true, force: true });
    const files = listFilesRel(from);
    for (const rel of files) {
      mkdirSync(dirname(join(to, rel)), { recursive: true });
      writeFileSync(join(to, rel), renderForProject(readFileSync(join(from, rel)), rel));
    }
    console.log(`[OK] .claude/${sub} (${files.length} files)`);
  }
}
