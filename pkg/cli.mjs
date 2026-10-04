#!/usr/bin/env node
// cli.mjs: ShipKit Documentation CLI
// Lives in pkg/ so that it ships with the plugin as well as with the npm package;
// the cli.mjs at the package root only imports this file.
// Usage:
//   npx shipkit-cld [target]                    Install into target (default: .)
//   npx shipkit-cld [target] --minimal          Minimal docs profile (core homes only)
//   npx shipkit-cld update [target]             Update from package source
//   npx shipkit-cld update [target] --from PATH Update from local SK checkout
//   npx shipkit-cld remove [target]             Remove SK system files (keeps docs/)
//   npx shipkit-cld init [target] [--minimal]   Scaffold docs/ and CLAUDE.md only, for use with the SK plugin
// Flags:
//   --dry-run   (update) Show what would change, write nothing
//   --force     (update) Accept SK's version of every file, discarding local edits
//   --yes       Answer yes to every prompt (unattended runs)

import { existsSync, mkdirSync, cpSync, renameSync, readdirSync, rmSync, unlinkSync, writeFileSync, readFileSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";
import { createHash } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Helpers ---

function ask(question) {
  if (yesFlag) return Promise.resolve("y");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer);
    });
  });
}

function countFiles(dir, excludeDirs = []) {
  let count = 0;
  if (!existsSync(dir)) return 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (excludeDirs.includes(entry.name)) continue;
      count += countFiles(full, excludeDirs);
    } else {
      count++;
    }
  }
  return count;
}

// Recursive list of files under dir, as /-separated paths relative to dir.
function listFilesRel(dir, base = dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listFilesRel(full, base));
    } else {
      out.push(full.slice(base.length + 1).replace(/\\/g, "/"));
    }
  }
  return out;
}

// --- Manifest (.claude/.sk-manifest.json) ---
// Records the installed version, CLAUDE.md ownership, and the exact files SK
// manages — so update can prune files SK no longer ships, and remove can
// delete only SK's files without clobbering user-added ones.
// `files` maps each managed path to the hash of the version SK shipped, which
// is how update tells an untouched file from one the user edited.

const MANAGED_DIRS = [
  ".claude/commands/sk",
  ".claude/agents",
  ".claude/skills",
  "docs/templates",
  "docs/sop",
  "docs/reference",
];

// SK-authored docs that live alongside user content — managed file by file,
// never by replacing the parent directory.
const SHIPPED_DOCS = [
  "docs/commands-reference.md",
  "docs/README.md",
  "docs/conventions/coding-behavior.md",
];

// Minimal profile: core doc homes only. The rest grow on demand (doc-creator
// commands create their home with a stub README when it's missing).
const MINIMAL_DOCS = [
  "README.md", "START-HERE.md", "commands-reference.md",
  "system", "conventions", "tasks", "templates", "sop", "_archive",
];

// A new SK version of a file the user edited is written beside it with this suffix.
const SIDECAR = ".sk-new";

// Line endings are normalized so a checkout with autocrlf does not look like a user edit.
function hashData(buffer) {
  const text = buffer.toString("latin1").replace(/\r\n/g, "\n");
  return createHash("sha256").update(text, "latin1").digest("hex").slice(0, 16);
}

function hashFile(path) {
  return hashData(readFileSync(path));
}

// Commands and skills point at each other through the plugin root, which
// Claude Code resolves when SK runs as a plugin. In a project install the same
// files sit under .claude/, so that prefix is rewritten as each file is copied.
const PLUGIN_PREFIX = "${CLAUDE_PLUGIN_ROOT}/.claude/";
// A copied-file install has no plugin root: the bundled CLI becomes the npm one.
const PLUGIN_CLI = 'node "${CLAUDE_PLUGIN_ROOT}/cli.mjs"';

// The bytes SK puts in a project for one shipped file.
function renderForProject(pkg, rel) {
  const data = readFileSync(join(pkg, rel));
  if (!rel.startsWith(".claude/") || !rel.endsWith(".md")) return data;
  return Buffer.from(data.toString("utf-8").split(PLUGIN_PREFIX).join(".claude/").split(PLUGIN_CLI).join("npx shipkit-cld"), "utf-8");
}

// Every path SK manages in a target, relative to both pkg/ and the target.
// Minimal-profile installs never had docs/reference — don't lay it down on update.
function shippedFiles(pkg, target, oldManifest) {
  const skipRef = oldManifest?.profile === "minimal" && !existsSync(join(target, "docs", "reference"));
  const pluginChannel = oldManifest?.channel === "plugin";
  const out = [];
  for (const dir of MANAGED_DIRS) {
    if (dir === "docs/reference" && skipRef) continue;
    if (pluginChannel && dir.startsWith(".claude/")) continue;
    for (const rel of listFilesRel(join(pkg, dir))) out.push(`${dir}/${rel}`);
  }
  for (const rel of SHIPPED_DOCS) {
    if (existsSync(join(pkg, rel))) out.push(rel);
  }
  return out;
}

// Hashes of every version of each file SK has released (generated by
// scripts/baselines.mjs). Lets update recognise an untouched file in an install
// that predates per-file hashes in the manifest.
function readBaselines(source) {
  try {
    return JSON.parse(readFileSync(join(source, ".sk-baselines.json"), "utf-8")).files || {};
  } catch {
    return {};
  }
}

// Did SK put this file here? true / false, or null when there is no record at all.
function isKnownToSk(oldManifest, rel) {
  if (!oldManifest) return null;
  if (oldManifest.files) return rel in oldManifest.files;
  if (!oldManifest.managed) return null;
  for (const dir of MANAGED_DIRS) {
    if (rel.startsWith(dir + "/")) return (oldManifest.managed[dir] || []).includes(rel.slice(dir.length + 1));
  }
  return SHIPPED_DOCS.includes(rel);
}

function isPristine(ctx, rel, currentHash) {
  const recorded = ctx.old?.files?.[rel];
  if (recorded) return currentHash === recorded;
  return (ctx.baselines[rel] || []).includes(currentHash);
}

// Bring one managed file up to date without destroying user work.
// Outcomes: created | unchanged | updated | kept (user-edited; new version
// written to a sidecar) | skipped (the user's own file that shares a name).
function syncFile(ctx, rel) {
  const rendered = renderForProject(ctx.pkg, rel);
  const dest = join(ctx.target, rel);
  const write = (to) => {
    if (ctx.dryRun) return;
    mkdirSync(dirname(to), { recursive: true });
    writeFileSync(to, rendered);
  };
  const dropSidecar = () => {
    if (!ctx.dryRun && existsSync(dest + SIDECAR)) unlinkSync(dest + SIDECAR);
  };

  if (!existsSync(dest)) {
    write(dest);
    return ctx.results.created.push(rel);
  }
  const current = hashFile(dest);
  if (current === hashData(rendered)) {
    dropSidecar();
    return ctx.results.unchanged.push(rel);
  }
  if (ctx.force || isPristine(ctx, rel, current)) {
    write(dest);
    dropSidecar();
    return ctx.results.updated.push(rel);
  }
  // A fresh install has no SK files yet, so anything already there is the user's.
  if (ctx.fresh || isKnownToSk(ctx.old, rel) === false) {
    return ctx.results.skipped.push(rel);
  }
  write(dest + SIDECAR);
  return ctx.results.kept.push(rel);
}

function newSyncContext(source, target, oldManifest, opts = {}) {
  return {
    pkg: source,
    target,
    old: oldManifest,
    baselines: readBaselines(source),
    dryRun: !!opts.dryRun,
    force: !!opts.force,
    fresh: !!opts.fresh,
    results: { created: [], unchanged: [], updated: [], kept: [], skipped: [] },
  };
}

function manifestPath(target) {
  return join(target, ".claude", ".sk-manifest.json");
}

function readManifest(target) {
  try {
    return JSON.parse(readFileSync(manifestPath(target), "utf-8"));
  } catch {
    return null;
  }
}

function sourceVersion(source) {
  try {
    return JSON.parse(readFileSync(join(source, ".claude-plugin", "plugin.json"), "utf-8")).version || "unknown";
  } catch {
    return "unknown";
  }
}

// `skipped` = same-named files that belong to the user; they stay out of the
// manifest so later updates and remove keep leaving them alone.
function writeManifest(target, source, claudeMdOwner, profile = "full", skipped = [], channel = "files") {
  const pkg = source;
  const mine = new Set(skipped);
  const managed = {};
  const files = {};
  for (const dir of MANAGED_DIRS) {
    managed[dir] = [];
    for (const rel of listFilesRel(join(pkg, dir))) {
      const full = `${dir}/${rel}`;
      if (mine.has(full) || !existsSync(join(target, full))) continue;
      managed[dir].push(rel);
      files[full] = hashData(renderForProject(pkg, full));
    }
  }
  for (const rel of SHIPPED_DOCS) {
    if (mine.has(rel) || !existsSync(join(pkg, rel)) || !existsSync(join(target, rel))) continue;
    files[rel] = hashFile(join(pkg, rel));
  }
  // An SK-created CLAUDE.md is refreshed only while it still matches what SK wrote.
  if (claudeMdOwner === "sk") files["CLAUDE.md"] = hashFile(join(pkg, "CLAUDE.md"));
  const manifest = {
    version: sourceVersion(source),
    updatedAt: new Date().toISOString(),
    // "sk" = SK created CLAUDE.md and may refresh/remove it; "user" = never touch it
    claudeMd: claudeMdOwner,
    // "minimal" = core doc homes only; update skips laying down homes the target never had
    profile,
    // "files" = commands, agents and skills copied into .claude/; "plugin" = they
    // come from the SK plugin and only docs/ and CLAUDE.md live in the project
    channel,
    managed,
    files,
  };
  mkdirSync(join(target, ".claude"), { recursive: true });
  writeFileSync(manifestPath(target), JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}

// Delete files SK shipped previously but no longer ships. Only files recorded
// in the previous manifest are candidates — user-added files are never touched,
// and a file the user edited is left in place and reported instead.
function pruneRemoved(ctx, shipped) {
  const old = ctx.old;
  const result = { pruned: [], orphaned: [] };
  if (!old || !(old.files || old.managed)) return result;
  const before = old.files
    ? Object.keys(old.files)
    : MANAGED_DIRS.flatMap((dir) => (old.managed[dir] || []).map((rel) => `${dir}/${rel}`));
  const still = new Set(shipped);
  for (const rel of before) {
    if (still.has(rel)) continue;
    const full = join(ctx.target, rel);
    if (!existsSync(full)) continue;
    if (ctx.force || isPristine(ctx, rel, hashFile(full))) {
      if (!ctx.dryRun) {
        unlinkSync(full);
        if (existsSync(full + SIDECAR)) unlinkSync(full + SIDECAR);
      }
      result.pruned.push(rel);
    } else {
      result.orphaned.push(rel);
    }
  }
  return result;
}

// Versions strictly after `from` up to and including `to`, with any
// "Upgrade notes" block found under each heading of the changelog.
function upgradeNotes(source, from, to) {
  const parse = (v) => String(v).split(".").map((n) => parseInt(n, 10) || 0);
  const cmp = (a, b) => {
    const [x, y] = [parse(a), parse(b)];
    for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0);
    return 0;
  };
  let text;
  try {
    text = readFileSync(join(source, "..", "CHANGELOG.md"), "utf-8").replace(/\r\n/g, "\n");
  } catch {
    return [];
  }
  const out = [];
  for (const section of text.split(/\n(?=## \d)/)) {
    const version = section.match(/^## (\d+\.\d+\.\d+)/)?.[1];
    if (!version || cmp(version, from) <= 0 || cmp(version, to) > 0) continue;
    const notes = section.match(/\n\*\*Upgrade notes:?\*\*:?\s*\n?([\s\S]*?)(?=\n\n|\n- \*\*|$)/)?.[1]?.trim();
    out.push({ version, notes: notes || null });
  }
  return out;
}

// Remove directories that became empty after selective file deletion.
function removeEmptyDirs(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) removeEmptyDirs(join(dir, entry.name));
  }
  if (readdirSync(dir).length === 0) rmSync(dir, { recursive: true });
}

function isYes(answer) {
  return ["y", "yes"].includes(answer.trim().toLowerCase());
}

// Install/refresh the project CLAUDE.md without clobbering the user's own.
// ownership: "sk" -> SK created it; refresh in place, but only while the user
// has not edited it (they fill in build commands and constraints there).
// "user"/unknown, or edited -> never overwrite; drop the SK template alongside
// as CLAUDE.sk.md to merge manually.
// Returns "created" | "refreshed" | "sidecar".
function syncClaudeMd(pkg, target, ownership, ctx = null) {
  const live = join(target, "CLAUDE.md");
  const src = join(pkg, "CLAUDE.md");
  const dryRun = !!ctx?.dryRun;
  if (!existsSync(live)) {
    if (!dryRun) cpSync(src, live, { force: true });
    return "created";
  }
  if (ownership === "sk" && ctx) {
    const current = hashFile(live);
    if (ctx.force || current === hashFile(src) || isPristine(ctx, "CLAUDE.md", current)) {
      if (!dryRun) cpSync(src, live, { force: true });
      return "refreshed";
    }
  }
  if (!dryRun) cpSync(src, join(target, "CLAUDE.sk.md"), { force: true });
  return "sidecar";
}

// A source is the directory that holds what ships: pkg/ in a checkout or in the
// npm package, and the plugin root itself in Claude Code's plugin cache.
function isValidSource(dir) {
  return existsSync(join(dir, "CLAUDE.md"))
      && existsSync(join(dir, "docs"))
      && existsSync(join(dir, ".claude", "commands", "sk"));
}

// Accepts the source itself or the directory above it (a checkout, or a path
// saved by a release that pointed at the package root). Returns null if neither fits.
function asSource(dir) {
  if (isValidSource(dir)) return dir;
  if (isValidSource(join(dir, "pkg"))) return join(dir, "pkg");
  return null;
}

function findSource(target, fromOverride) {
  // 1. Explicit --from flag
  if (fromOverride) {
    const given = asSource(fromOverride);
    if (given) return given;
    console.log(c.red("[ERROR]") + ` --from path is not a valid SK source: ${fromOverride}`);
    console.log("  Expected: CLAUDE.md, docs/ and .claude/commands/sk/ in that directory or in its pkg/ folder");
    process.exit(1);
  }

  // 2. The package being executed. On `npx shipkit-cld@latest` this is the
  //    freshly-fetched version — it must win over any saved path, which may
  //    point at a stale npx cache from a previous run.
  if (isValidSource(__dirname)) return __dirname;

  // 3. Saved source path from a previous --from install/update
  const skSourceFile = join(target, ".claude", ".sk-source");
  if (existsSync(skSourceFile)) {
    const saved = readFileSync(skSourceFile, "utf-8").trim();
    if (saved && asSource(saved)) {
      console.log(c.blue("[INFO]") + ` Using saved source: ${saved}`);
      return asSource(saved);
    }
    // Fallback: try as relative path from target
    if (saved) {
      const relative = resolve(target, saved);
      if (asSource(relative)) {
        console.log(c.blue("[INFO]") + ` Using resolved source: ${relative}`);
        return asSource(relative);
      }
    }
  }

  // 4. Current working directory
  if (asSource(process.cwd())) return asSource(process.cwd());

  return null;
}

// Persist only explicit --from paths. Never persist the running package's
// __dirname: under npx that is an ephemeral cache path, and pinning it would
// make future updates reuse a stale version instead of @latest.
function saveSourcePath(target, source) {
  const skSourceFile = join(target, ".claude", ".sk-source");
  mkdirSync(dirname(skSourceFile), { recursive: true });
  writeFileSync(skSourceFile, source + "\n");
}

// --- Colors (ANSI) ---

const c = {
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

// --- Banner ---

function banner() {
  console.log();
  console.log(c.cyan(c.bold("  +-----------------------------------------+")));
  console.log(c.cyan(c.bold("  |     sk -- ShipKit Documentation          |")));
  console.log(c.cyan(c.bold("  |     Plan -> Dev -> Test lifecycle        |")));
  console.log(c.cyan(c.bold("  +-----------------------------------------+")));
  console.log();
}

// --- Route command ---

const args = process.argv.slice(2);

// Parse --from flag for explicit source override
const fromIdx = args.indexOf("--from");
const fromArg = fromIdx !== -1 && args[fromIdx + 1] ? resolve(args[fromIdx + 1]) : null;
const minimalFlag = args.includes("--minimal");
const dryRunFlag = args.includes("--dry-run");
const forceFlag = args.includes("--force");
const yesFlag = args.includes("--yes") || args.includes("-y");

// Positional args = everything that isn't a flag or the --from value
const positional = args.filter((a, i) => !a.startsWith("-") && args[i - 1] !== "--from");
const command = ["remove", "update", "init"].includes(positional[0]) ? positional[0] : "install";
const targetArg = command === "install" ? positional[0] : positional[1];

if (command === "remove") {
  await runRemove(resolve(targetArg || "."));
} else if (command === "update") {
  await runUpdate(resolve(targetArg || "."), fromArg, { dryRun: dryRunFlag, force: forceFlag });
} else if (command === "init") {
  await runInit(resolve(targetArg || "."), minimalFlag);
} else {
  await runInstall(resolve(targetArg || "."), minimalFlag);
}

// =============================================================================
// INSTALL
// =============================================================================

async function runInstall(target, minimal = false) {
  banner();

  console.log(c.blue("[INFO]") + ` Installing into: ${target}` + (minimal ? " (minimal profile)" : ""));
  console.log();

  // --- Pre-flight checks ---

  if (!existsSync(target)) {
    const answer = await ask(
      c.yellow("[WARN]") + " Target directory does not exist. Create it? (y/n) "
    );
    if (isYes(answer)) {
      mkdirSync(target, { recursive: true });
    } else {
      console.log("Aborted.");
      process.exit(1);
    }
  }

  // Already installed? Re-running install would displace live docs into
  // docs/old/ and re-lay blank templates — what the user wants here is update.
  if (existsSync(join(target, ".claude", "commands", "sk"))) {
    console.log(c.yellow("[WARN]") + " SK is already installed here -- running update instead.");
    console.log(c.yellow("       ") + " (A fresh install would move your live docs/ into docs/old/.)");
    console.log();
    return runUpdate(target, null, { dryRun: dryRunFlag, force: forceFlag });
  }

  // --- Find source before touching anything ---

  const source = findSource(target, null);
  if (!source) {
    console.log(
      c.yellow("[WARN]") +
        " Cannot find SK source files.\n" +
        "  Make sure you run this from the extracted sk/ folder.\n" +
        "  Expected: pkg/CLAUDE.md, pkg/docs/, .claude/ in the same directory"
    );
    process.exit(1);
  }
  const pkg = source;

  // Back up existing docs/ into docs/old before installing
  const docsDir = join(target, "docs");
  const oldDir = join(target, "docs", "old");
  let backedUp = false;

  if (existsSync(docsDir) && readdirSync(docsDir).length > 0) {
    console.log(
      c.yellow("[WARN]") + " Existing docs/ found -- backing up to docs/old/"
    );

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const backupDir = join(oldDir, timestamp);
    mkdirSync(backupDir, { recursive: true });

    for (const entry of readdirSync(docsDir, { withFileTypes: true })) {
      if (entry.name === "old") continue;
      const src = join(docsDir, entry.name);
      const dest = join(backupDir, entry.name);
      renameSync(src, dest);
    }

    backedUp = true;
    console.log(c.green("  [OK]") + ` Existing docs moved to docs/old/${timestamp}/`);
    console.log();
  }

  // --- Step 1: Create directory structure ---

  console.log(c.blue("[1/4]") + " Creating directory structure...");

  mkdirSync(join(target, ".claude", "commands", "sk"), { recursive: true });
  console.log(c.green("  [OK]") + " .claude/commands/sk/ created");

  // --- Step 2: Copy files ---

  console.log(c.blue("[2/4]") + " Copying documentation files...");

  if (minimal) {
    // Core homes only — the rest grow on demand (doc-creator commands create
    // their home with a stub README when it's missing).
    for (const entry of MINIMAL_DOCS) {
      const src = join(pkg, "docs", entry);
      if (existsSync(src)) {
        cpSync(src, join(target, "docs", entry), { recursive: true, force: true });
      }
    }
    console.log(c.green("  [OK]") + " docs/ core copied (minimal — other homes are created on demand)");
  } else {
    cpSync(join(pkg, "docs"), join(target, "docs"), { recursive: true, force: true });
    console.log(c.green("  [OK]") + " docs/ content copied");
  }

  // Commands, agents and skills go in file by file: an agent or skill the
  // project already has under the same name is the user's and is left alone.
  const ctx = newSyncContext(source, target, null, { fresh: true });
  for (const rel of shippedFiles(pkg, target, null)) {
    if (rel.startsWith(".claude/")) syncFile(ctx, rel);
  }
  console.log(c.green("  [OK]") + " .claude/commands/sk/, .claude/agents/, .claude/skills/ copied");
  for (const rel of ctx.results.skipped) {
    console.log(c.yellow("  [KEEP]") + ` ${rel} already exists and is yours -- SK's file of the same name was not installed`);
  }

  const claudeResult = syncClaudeMd(pkg, target, null);
  if (claudeResult === "created") {
    console.log(c.green("  [OK]") + " CLAUDE.md created");
  } else {
    console.log(c.yellow("  [KEEP]") + " Existing CLAUDE.md preserved -- SK template written to CLAUDE.sk.md (merge manually)");
  }

  // Record what SK installed: version, CLAUDE.md ownership, managed files
  writeManifest(target, source, claudeResult === "created" ? "sk" : "user", minimal ? "minimal" : "full", ctx.results.skipped);

  // --- Step 3: Validate ---

  console.log(c.blue("[3/4]") + " Validating installation...");

  let errors = 0;

  function checkFile(relPath) {
    const full = join(target, relPath);
    if (existsSync(full)) {
      console.log(c.green("  [OK]") + ` ${relPath}`);
    } else {
      console.log(c.yellow("  [!!]") + ` ${relPath} -- MISSING`);
      errors++;
    }
  }

  checkFile("CLAUDE.md");
  checkFile("docs/README.md");
  checkFile("docs/conventions/code-style.md");
  checkFile("docs/templates/task-prd.md");
  checkFile("docs/templates/epic.md");
  checkFile(".claude/commands/sk/plan.md");
  checkFile(".claude/commands/sk/dev.md");
  checkFile(".claude/commands/sk/test.md");
  checkFile(".claude/commands/sk/implement.md");
  checkFile(".claude/commands/sk/commit.md");
  checkFile(".claude/commands/sk/code-review.md");
  checkFile(".claude/commands/sk/security-review.md");
  checkFile(".claude/commands/sk/ui-review.md");
  checkFile("docs/commands-reference.md");
  checkFile(".claude/agents/architecture-reviewer.md");
  checkFile(".claude/commands/sk/retro.md");
  checkFile(".claude/commands/sk/migrate.md");

  console.log();
  if (errors > 0) {
    console.log(
      c.yellow(`[WARN]`) + ` ${errors} files missing. Installation may be incomplete.`
    );
  } else {
    console.log(c.green("[OK]") + " All core files present.");
  }

  // --- Step 4: Summary ---

  console.log(c.blue("[4/4]") + " Installation complete!");
  console.log();

  const cmdCount = countFiles(join(target, ".claude", "commands", "sk"));
  const fileCount = countFiles(join(target, "docs"), ["old"]) + cmdCount;

  console.log(c.bold(c.green(`  [SUCCESS] SK v${sourceVersion(source)} installed -- ${fileCount} files`)));
  if (backedUp) {
    console.log(c.yellow("  [NOTE]") + " Previous docs preserved in docs/old/");
  }
  console.log();
  console.log(c.bold("  Structure:"));
  console.log(`  ${target}/`);
  console.log("  ├── CLAUDE.md                  <- Agent reads this first");
  console.log(`  ├── .claude/commands/sk/       <- ${cmdCount} slash commands`);
  console.log("  |   ├── implement.md           /sk:implement");
  console.log("  |   ├── plan.md                /sk:plan");
  console.log("  |   ├── dev.md                 /sk:dev");
  console.log("  |   ├── test.md                /sk:test");
  console.log("  |   ├── new-task.md            /sk:new-task");
  console.log("  |   ├── new-epic.md            /sk:new-epic");
  console.log("  |   └── ...                    (and more)");
  console.log("  ├── .claude/agents/            <- Agent definitions");
  console.log("  ├── .claude/skills/            <- Active skills (TDD, etc.)");
  console.log("  └── docs/                      <- Documentation hub");
  console.log("      ├── conventions/           Code style, structure, git, testing");
  console.log("      ├── system/                Tech stack, schema, APIs");
  console.log("      ├── tasks/                 Task board + examples");
  console.log("      ├── templates/             Starter templates");
  console.log("      └── ...");
  console.log();
  console.log(c.bold("  Next steps:"));
  console.log();
  console.log(`  ${c.bold("New project (greenfield):")}`);
  console.log(`    1. Run ${c.cyan("/sk:kickoff")} -- guided setup + best-practice research`);
  console.log(`    2. Run ${c.cyan("/sk:brainstorm")} -- define your first feature`);
  console.log(`    3. Run ${c.cyan("/sk:implement")} -- build it`);
  console.log();
  console.log(`  ${c.bold("Existing project (brownfield):")}`);
  console.log(`    1. Run ${c.cyan("/sk:init-docs")} -- auto-scan codebase and populate docs`);
  console.log(`    2. Fill in Build Commands in ${c.cyan("CLAUDE.md")}`);
  console.log(`    3. Run ${c.cyan("/sk:new-task")} -- create your first task`);
  console.log(`    4. Run ${c.cyan("/sk:implement")} -- build it`);
  console.log();
  console.log(`  Run ${c.cyan("/sk:task-status")} to see your task board.`);
  console.log();
}

// =============================================================================
// INIT — docs/ and CLAUDE.md only, for projects that use the SK plugin
// =============================================================================

async function runInit(target, minimal = false) {
  banner();

  console.log(c.blue("[INFO]") + ` Scaffolding docs/ and CLAUDE.md in: ${target}` + (minimal ? " (minimal profile)" : ""));
  console.log();

  if (existsSync(join(target, ".claude", "commands", "sk"))) {
    console.log(c.red("[ERROR]") + " SK is installed here as copied files (.claude/commands/sk/ exists).");
    console.log("  To move this project to the plugin:");
    console.log(`    1. ${c.cyan("npx shipkit-cld remove .")}    (keeps docs/)`);
    console.log(`    2. ${c.cyan("claude plugin marketplace add moniav/sk")} and ${c.cyan("claude plugin install sk@shipkit")}`);
    console.log(`    3. ${c.cyan("npx shipkit-cld init .")}`);
    process.exit(1);
  }

  const source = findSource(target, null);
  if (!source) {
    console.log(c.red("[ERROR]") + " Cannot find SK source files. Run: " + c.cyan("npx shipkit-cld@latest init ."));
    process.exit(1);
  }
  const pkg = source;
  const oldManifest = readManifest(target);
  const profile = minimal ? "minimal" : oldManifest?.profile || "full";

  // Fill gaps only: a file that already exists is the project's and is never replaced,
  // so init is safe to re-run and safe on a project that already has docs/.
  let added = 0;
  let kept = 0;
  // Files the project had before SK: kept out of the manifest, so update leaves them alone too.
  const mine = [];
  const docs = listFilesRel(join(pkg, "docs")).filter(
    (rel) => profile !== "minimal" || MINIMAL_DOCS.some((entry) => rel === entry || rel.startsWith(entry + "/"))
  );
  for (const rel of docs) {
    const dest = join(target, "docs", rel);
    if (existsSync(dest)) {
      kept++;
      const wasManaged = oldManifest?.files ? `docs/${rel}` in oldManifest.files : hashFile(dest) === hashFile(join(pkg, "docs", rel));
      if (!wasManaged) mine.push(`docs/${rel}`);
      continue;
    }
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(join(pkg, "docs", rel), dest);
    added++;
  }
  console.log(c.green("  [OK]") + ` docs/: ${added} file(s) added, ${kept} already present and left as they are`);

  // CLAUDE.md: create it, or leave the project's own and offer the template beside it.
  const live = join(target, "CLAUDE.md");
  let claudeOwner = oldManifest?.claudeMd || "user";
  if (!existsSync(live)) {
    cpSync(join(pkg, "CLAUDE.md"), live);
    claudeOwner = "sk";
    console.log(c.green("  [OK]") + " CLAUDE.md created");
  } else if (hashFile(live) === hashFile(join(pkg, "CLAUDE.md"))) {
    console.log(c.green("  [OK]") + " CLAUDE.md already current");
  } else if (oldManifest) {
    console.log(c.yellow("  [KEEP]") + " CLAUDE.md left as it is");
  } else {
    cpSync(join(pkg, "CLAUDE.md"), join(target, "CLAUDE.sk.md"), { force: true });
    console.log(c.yellow("  [KEEP]") + " Existing CLAUDE.md preserved -- SK template written to CLAUDE.sk.md (merge manually)");
  }

  writeManifest(target, source, claudeOwner, profile, mine, "plugin");

  console.log();
  console.log(c.bold(c.green(`  [SUCCESS] SK v${sourceVersion(source)} docs scaffold ready`)));
  console.log();
  console.log(c.bold("  Commands, skills and agents come from the SK plugin:"));
  console.log(`    ${c.cyan("claude plugin marketplace add moniav/sk")}`);
  console.log(`    ${c.cyan("claude plugin install sk@shipkit")}`);
  console.log();
  console.log("  Then, in Claude Code:");
  console.log(`    New project:      ${c.cyan("/sk:kickoff")}`);
  console.log(`    Existing project: ${c.cyan("/sk:init-docs")}`);
  console.log();
  console.log(`  Later, ${c.cyan("npx shipkit-cld@latest update .")} refreshes the shipped templates, SOPs and reference docs.`);
  console.log();
}

// =============================================================================
// UPDATE — SK system files only; user content and user edits are preserved
// =============================================================================

async function runUpdate(target, fromOverride, opts = {}) {
  banner();

  const dryRun = !!opts.dryRun;
  const force = !!opts.force;

  console.log(c.blue("[INFO]") + ` Updating SK in: ${target}` + (dryRun ? " (dry run -- nothing will be written)" : ""));
  console.log();

  // --- Pre-flight: confirm SK is installed ---

  const skCommandsDir = join(target, ".claude", "commands", "sk");
  if (!existsSync(skCommandsDir) && readManifest(target)?.channel !== "plugin") {
    console.log(c.red("[ERROR]") + " SK is not installed here. Run install first:");
    console.log(`  ${c.cyan("npx shipkit-cld")} ${target === process.cwd() ? "" : target}`);
    process.exit(1);
  }

  // --- Find source ---

  const source = findSource(target, fromOverride);
  if (!source) {
    console.log(
      c.red("[ERROR]") +
        " Cannot find SK source files.\n" +
        "  Options:\n" +
        `  1. Update from local checkout:  ${c.cyan("npx shipkit-cld update . --from /path/to/sk")}\n` +
        `  2. Update from npm:             ${c.cyan("npx shipkit-cld@latest update .")}\n` +
        "  3. Run from the SK source dir:  cd /path/to/sk && node cli.mjs update " + target
    );
    process.exit(1);
  }

  // Persist only explicit --from overrides (see saveSourcePath)
  if (fromOverride && !dryRun) saveSourcePath(target, fromOverride);

  const oldManifest = readManifest(target);
  const newVersion = sourceVersion(source);
  const oldVersion = oldManifest?.version;

  console.log(c.blue("[INFO]") + ` Source: ${source}`);
  console.log(
    c.blue("[INFO]") +
      ` Updating to v${newVersion}` +
      (oldVersion ? ` (installed: v${oldVersion})` : "")
  );
  console.log();

  // --- What gets updated vs preserved ---

  console.log(c.bold("  SK-managed (updated file by file):"));
  console.log(c.yellow("    .claude/commands/sk/    <- slash commands"));
  console.log(c.yellow("    .claude/agents/         <- agent definitions"));
  console.log(c.yellow("    .claude/skills/         <- active skills"));
  console.log(c.yellow("    docs/templates/, docs/sop/, docs/reference/"));
  console.log(c.yellow("    docs/commands-reference.md, docs/README.md, docs/conventions/coding-behavior.md"));
  console.log(c.yellow("    CLAUDE.md               <- only if SK created it"));
  console.log();
  console.log(c.bold("  Never touched:"));
  console.log(c.green("    A managed file you edited  <- kept; SK's new version is written beside it as *" + SIDECAR));
  console.log(c.green("    Your own files, including ones that share a name with an SK file"));
  console.log(c.green("    docs/tasks/, docs/system/, docs/architecture/, docs/decisions/, docs/flows/"));
  console.log(c.green("    docs/conventions/       <- except coding-behavior.md"));
  if (force) {
    console.log();
    console.log(c.red("  --force: SK's version replaces every managed file, including ones you edited."));
  }
  console.log();

  if (!dryRun) {
    const answer = await ask("  Proceed with update? (y/n) ");
    if (!isYes(answer)) {
      console.log("  Aborted.");
      process.exit(0);
    }
    console.log();
  }

  const pkg = source;
  const ctx = newSyncContext(source, target, oldManifest, { dryRun, force });

  // --- Step 1: Sync managed files ---

  console.log(c.blue("[1/3]") + " Syncing commands, agents, skills, templates, SOPs and reference docs...");
  const shipped = shippedFiles(pkg, target, oldManifest);
  for (const rel of shipped) syncFile(ctx, rel);

  const r = ctx.results;
  const verb = dryRun ? "would be " : "";
  console.log(c.green("  [OK]") + ` ${r.updated.length} ${verb}updated, ${r.created.length} ${verb}added, ${r.unchanged.length} already current`);
  for (const rel of r.kept) {
    console.log(c.yellow("  [KEEP]") + ` ${rel} has local changes -- new version ${verb}written to ${rel}${SIDECAR}`);
  }
  for (const rel of r.skipped) {
    console.log(c.yellow("  [KEEP]") + ` ${rel} is your own file -- SK's file of the same name ${dryRun ? "would not be" : "was not"} installed`);
  }

  // --- Step 2: CLAUDE.md ---

  console.log(c.blue("[2/3]") + " Refreshing CLAUDE.md reference...");
  // Ownership comes from the manifest. Legacy installs (no manifest) can't
  // prove SK authored the live CLAUDE.md, so treat it as user-owned (safe).
  const claudeOwner = oldManifest?.claudeMd || "user";
  const claudeResult = syncClaudeMd(pkg, target, claudeOwner, ctx);
  if (claudeResult === "created") {
    console.log(c.green("  [OK]") + ` CLAUDE.md ${verb}created (none existed)`);
  } else if (claudeResult === "refreshed") {
    console.log(c.green("  [OK]") + ` CLAUDE.md ${verb}refreshed (SK-managed)`);
  } else {
    console.log(c.yellow("  [KEEP]") + " Your CLAUDE.md left untouched -- latest SK template in CLAUDE.sk.md");
  }

  // --- Step 3: Prune files SK no longer ships, record the new state ---

  console.log(c.blue("[3/3]") + " Removing files SK no longer ships...");
  const { pruned, orphaned } = pruneRemoved(ctx, shipped);
  for (const rel of pruned) console.log(c.yellow("  [RM]") + ` ${rel}`);
  for (const rel of orphaned) {
    console.log(c.yellow("  [KEEP]") + ` ${rel} is no longer shipped but has local changes -- delete it if you no longer need it`);
  }
  if (pruned.length === 0 && orphaned.length === 0) console.log(c.green("  [OK]") + " nothing to remove");

  if (!dryRun) {
    if (pruned.length > 0) {
      removeEmptyDirs(join(target, ".claude", "skills"));
      removeEmptyDirs(join(target, ".claude", "agents"));
    }
    const newOwner = claudeResult === "sidecar" ? "user" : "sk";
    writeManifest(target, source, newOwner, oldManifest?.profile || "full", r.skipped, oldManifest?.channel || "files");
  }

  // --- Summary ---

  console.log();
  if (dryRun) {
    console.log(c.bold(c.cyan("  [DRY RUN] No files were changed.")));
  } else {
    console.log(c.bold(c.green(`  [SUCCESS] SK updated to v${newVersion}`)));
  }

  if (r.kept.length > 0) {
    console.log();
    console.log(c.bold(`  ${r.kept.length} file(s) with local changes were kept:`));
    console.log("    Compare each with its " + SIDECAR + " sidecar, merge what you want, then delete the sidecar.");
    console.log("    To take SK's version instead, rename the sidecar over the file.");
    if (!oldManifest?.files) {
      console.log("    This install predates per-file tracking, so a file that differs from every");
      console.log("    released version is treated as edited. Re-run with --force to accept SK's");
      console.log("    version of every file (commit your work first).");
    }
  }

  const notes = oldVersion ? upgradeNotes(source, oldVersion, newVersion) : [];
  if (notes.length > 0) {
    console.log();
    console.log(c.bold(`  Releases since v${oldVersion}: ${notes.map((n) => "v" + n.version).join(", ")}`));
    for (const n of notes) {
      if (n.notes) console.log(`    v${n.version} upgrade notes: ${n.notes.replace(/\n/g, "\n      ")}`);
    }
    console.log("    Full details: CHANGELOG.md in the shipkit-cld package.");
  }
  console.log();
}

// =============================================================================
// REMOVE
// =============================================================================

async function runRemove(target) {
  banner();

  console.log(c.blue("[INFO]") + ` Removing SK from: ${target}`);
  console.log();

  const skCommandsDir = join(target, ".claude", "commands", "sk");
  const claudeMd = join(target, "CLAUDE.md");
  const claudeSk = join(target, "CLAUDE.sk.md");
  const docsDir = join(target, "docs");
  const manifest = readManifest(target);

  // --- Check if SK is installed ---

  const hasCommands = existsSync(skCommandsDir);
  const hasClaudeMd = existsSync(claudeMd);
  const hasClaudeSk = existsSync(claudeSk);
  // Ownership: trust the manifest when present. Legacy installs (no manifest)
  // fall back to the sidecar heuristic: a CLAUDE.sk.md sidecar means the user
  // had their own CLAUDE.md, so we must not delete it.
  const skManagedClaude = hasClaudeMd && (manifest ? manifest.claudeMd === "sk" : !hasClaudeSk);

  if (!hasCommands && !hasClaudeMd && !hasClaudeSk) {
    console.log(c.yellow("[WARN]") + " SK does not appear to be installed here.");
    process.exit(1);
  }

  // --- Show what will be removed ---

  console.log(c.bold("  Will remove:"));
  if (hasCommands) {
    const cmdCount = countFiles(skCommandsDir);
    console.log(c.red(`    .claude/commands/sk/    (${cmdCount} command files)`));
  }
  const agentsDir = join(target, ".claude", "agents");
  const skillsDir = join(target, ".claude", "skills");
  // With a manifest we delete only the files SK shipped; user-added agents
  // and skills in the same directories survive. Legacy: whole directories.
  const scopeNote = manifest ? "SK-shipped files only" : "whole directory";
  if (existsSync(agentsDir)) {
    console.log(c.red(`    .claude/agents/         (${scopeNote})`));
  }
  if (existsSync(skillsDir)) {
    console.log(c.red(`    .claude/skills/         (${scopeNote})`));
  }
  if (skManagedClaude) console.log(c.red("    CLAUDE.md"));
  if (hasClaudeSk) console.log(c.red("    CLAUDE.sk.md            (SK template reference)"));
  console.log();

  const docCount = existsSync(docsDir) ? countFiles(docsDir) : 0;
  if (docCount > 0 || hasClaudeSk) {
    console.log(c.green(`  Will keep:`));
    if (hasClaudeSk) console.log(c.green(`    CLAUDE.md              (your own -- not SK's)`));
    if (docCount > 0) console.log(c.green(`    docs/                  (${docCount} files preserved)`));
    console.log();
  }

  // --- Confirm ---

  const answer = await ask("  Proceed? (y/n) ");
  if (!isYes(answer)) {
    console.log("  Aborted.");
    process.exit(0);
  }

  console.log();

  // --- Remove ---

  let removed = 0;

  if (hasCommands) {
    rmSync(skCommandsDir, { recursive: true, force: true });
    console.log(c.green("  [OK]") + " .claude/commands/sk/ removed");
    removed++;
  }

  // Agents/skills: with a manifest, delete only SK-shipped files and keep
  // anything the user added alongside them; legacy removes the whole dir.
  function removeManaged(dirAbs, dirRel, label) {
    if (!existsSync(dirAbs)) return;
    const listed = manifest?.managed?.[dirRel];
    if (listed) {
      for (const rel of listed) {
        const f = join(dirAbs, rel);
        if (existsSync(f)) unlinkSync(f);
        if (existsSync(f + SIDECAR)) unlinkSync(f + SIDECAR);
      }
      removeEmptyDirs(dirAbs);
      const kept = existsSync(dirAbs);
      console.log(c.green("  [OK]") + ` ${label} SK files removed` + (kept ? " (your own files kept)" : ""));
    } else {
      rmSync(dirAbs, { recursive: true, force: true });
      console.log(c.green("  [OK]") + ` ${label} removed`);
    }
    removed++;
  }

  removeManaged(agentsDir, ".claude/agents", ".claude/agents/");
  removeManaged(skillsDir, ".claude/skills", ".claude/skills/");

  if (skManagedClaude) {
    unlinkSync(claudeMd);
    console.log(c.green("  [OK]") + " CLAUDE.md removed");
    removed++;
  }

  if (hasClaudeSk) {
    unlinkSync(claudeSk);
    console.log(c.green("  [OK]") + " CLAUDE.sk.md removed (your CLAUDE.md kept)");
    removed++;
  }

  // SK bookkeeping files
  for (const f of [manifestPath(target), join(target, ".claude", ".sk-source")]) {
    if (existsSync(f)) unlinkSync(f);
  }

  // Clean up empty .claude/commands/ if sk was the only namespace
  const commandsDir = join(target, ".claude", "commands");
  if (existsSync(commandsDir) && readdirSync(commandsDir).length === 0) {
    rmSync(commandsDir, { recursive: true });
    console.log(c.green("  [OK]") + " .claude/commands/ cleaned up (was empty)");
  }

  console.log();
  console.log(c.bold(c.green("  [SUCCESS] SK removed")));
  console.log(c.green("  docs/ preserved -- your documentation is untouched."));
  console.log();
  console.log(c.bold("  To reinstall:"));
  console.log(`  ${c.cyan("npx shipkit-cld")} ${target === process.cwd() ? "" : target}`);
  console.log();
}
