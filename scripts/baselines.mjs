#!/usr/bin/env node
// scripts/baselines.mjs: generate pkg/.sk-baselines.json from the release tags.
//
// The file maps each managed path to the hash of every version SK has released.
// cli.mjs uses it to recognise an untouched file in an install that predates
// per-file hashes in the manifest, so the first safe update does not treat
// every changed file as a user edit. Run `npm run baselines` after tagging a release.
//
//   node scripts/baselines.mjs           Write the file
//   node scripts/baselines.mjs --check   Exit 1 if the file is out of date

import { readFileSync, writeFileSync, existsSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import { createHash } from "crypto";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "pkg", ".sk-baselines.json");

// Keep in step with MANAGED_DIRS and SHIPPED_DOCS in cli.mjs.
const MANAGED_DIRS = [".claude/commands/sk", ".claude/agents", ".claude/skills", "docs/templates", "docs/sop", "docs/reference"];
const SHIPPED_DOCS = ["docs/commands-reference.md", "docs/README.md", "docs/conventions/coding-behavior.md", "CLAUDE.md"];

function git(args, opts = {}) {
  const r = spawnSync("git", args, { cwd: ROOT, maxBuffer: 256 * 1024 * 1024, ...opts });
  if (r.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${r.stderr}`);
  return r.stdout;
}

// Same normalization as hashData in cli.mjs.
function hash(buffer) {
  const text = buffer.toString("latin1").replace(/\r\n/g, "\n");
  return createHash("sha256").update(text, "latin1").digest("hex").slice(0, 16);
}

// Same rewrite as renderForProject in cli.mjs: what a project install holds for this file.
const PLUGIN_PREFIX = "${CLAUDE_PLUGIN_ROOT}/.claude/";
// A copied-file install has no plugin root: the bundled CLI becomes the npm one.
const PLUGIN_CLI = 'node "${CLAUDE_PLUGIN_ROOT}/cli.mjs"';
function render(buffer, rel) {
  if (!rel.startsWith(".claude/") || !rel.endsWith(".md")) return buffer;
  return Buffer.from(buffer.toString("utf-8").split(PLUGIN_PREFIX).join(".claude/").split(PLUGIN_CLI).join("npx shipkit-cld"), "utf-8");
}

const isManaged = (rel) => SHIPPED_DOCS.includes(rel) || MANAGED_DIRS.some((dir) => rel.startsWith(dir + "/"));

export function generate() {
  const tags = git(["tag", "--list", "v*", "--sort=version:refname"]).toString("utf-8").split("\n").filter(Boolean);
  const byBlob = new Map();
  const files = {};
  for (const tag of tags) {
    const tree = git(["ls-tree", "-r", tag]).toString("utf-8").split("\n").filter(Boolean);
    // Releases before the pkg/ split shipped the same paths from the repository root.
    const hasPkg = tree.some((line) => line.split("\t")[1].startsWith("pkg/"));
    for (const line of tree) {
      const [meta, path] = line.split("\t");
      const blob = meta.split(" ")[2];
      const rel = hasPkg ? (path.startsWith("pkg/") ? path.slice(4) : null) : path;
      if (!rel || !isManaged(rel)) continue;
      const key = `${blob}:${rel}`;
      if (!byBlob.has(key)) byBlob.set(key, hash(render(git(["cat-file", "blob", blob]), rel)));
      (files[rel] ||= new Set()).add(byBlob.get(key));
    }
  }
  const sorted = {};
  for (const rel of Object.keys(files).sort()) sorted[rel] = [...files[rel]].sort();
  return {
    _generated: "by scripts/baselines.mjs from the release tags; do not edit by hand",
    tags,
    files: sorted,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const next = JSON.stringify(generate(), null, 1) + "\n";
  if (process.argv.includes("--check")) {
    const current = existsSync(OUT) ? readFileSync(OUT, "utf-8").replace(/\r\n/g, "\n") : "";
    if (current !== next) {
      console.log("[ERROR] pkg/.sk-baselines.json is out of date -- run: npm run baselines");
      process.exit(1);
    }
    console.log("[OK] pkg/.sk-baselines.json is up to date");
  } else {
    writeFileSync(OUT, next);
    console.log(`[OK] wrote pkg/.sk-baselines.json`);
  }
}
