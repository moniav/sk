#!/usr/bin/env node
// cli.mjs: the script behind /sk:scaffold. Ships inside the plugin; Claude Code runs it
// from the plugin cache as `node "${CLAUDE_PLUGIN_ROOT}/cli.mjs" <command> .`
//
//   init [target] [--minimal]            Create docs/ and CLAUDE.md; fills gaps, never replaces a file
//   update [target] [--dry-run] [--force] Refresh the shipped docs (templates, SOPs, reference docs,
//                                        a few index docs) and an SK-created CLAUDE.md, keeping edits
//   migrate [target]                     Remove the commands, agents and skills an older SK copied into
//                                        .claude/ (the plugin provides them now); docs/ is kept
//   --yes / -y                           Answer yes to every prompt
//
// Commands, agents and skills are never written into a project: they load from the plugin.

import { existsSync, mkdirSync, cpSync, readdirSync, rmSync, unlinkSync, writeFileSync, readFileSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";
import { createHash } from "crypto";

const PKG = dirname(fileURLToPath(import.meta.url));

// --- What SK manages inside a project ---

// Whole directories whose every file SK ships.
const MANAGED_DIRS = ["docs/templates", "docs/sop", "docs/reference"];
// SK-authored docs that live next to user content, managed file by file.
const SHIPPED_DOCS = ["docs/commands-reference.md", "docs/README.md", "docs/conventions/coding-behavior.md"];
// Minimal profile: core doc homes only; doc-creator commands add the others on demand.
const MINIMAL_DOCS = ["README.md", "START-HERE.md", "commands-reference.md", "system", "conventions", "tasks", "templates", "sop", "_archive"];
// A new SK version of a file the user edited is written beside it with this suffix.
const SIDECAR = ".sk-new";
// Directories an older SK release copied into projects; migrate removes SK's files from them.
const LEGACY_DIRS = [".claude/commands/sk", ".claude/agents", ".claude/skills"];

// --- Helpers ---

const c = {
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

function ask(question) {
  if (yesFlag) return Promise.resolve("y");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => rl.question(question, (answer) => { rl.close(); res(answer); }));
}

const isYes = (answer) => ["y", "yes"].includes(answer.trim().toLowerCase());

function listFilesRel(dir, base = dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFilesRel(full, base));
    else out.push(full.slice(base.length + 1).replace(/\\/g, "/"));
  }
  return out;
}

function countFiles(dir) {
  return listFilesRel(dir).length;
}

function removeEmptyDirs(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) removeEmptyDirs(join(dir, entry.name));
  }
  if (readdirSync(dir).length === 0) rmSync(dir, { recursive: true });
}

// Line endings are normalized so a checkout with autocrlf does not look like a user edit.
function hashData(buffer) {
  const text = buffer.toString("latin1").replace(/\r\n/g, "\n");
  return createHash("sha256").update(text, "latin1").digest("hex").slice(0, 16);
}
const hashFile = (path) => hashData(readFileSync(path));

function version() {
  try {
    return JSON.parse(readFileSync(join(PKG, ".claude-plugin", "plugin.json"), "utf-8")).version || "unknown";
  } catch {
    return "unknown";
  }
}

function banner() {
  console.log();
  console.log(c.cyan(c.bold("  +-----------------------------------------+")));
  console.log(c.cyan(c.bold("  |     sk -- ShipKit Documentation          |")));
  console.log(c.cyan(c.bold("  |     Plan -> Dev -> Test lifecycle        |")));
  console.log(c.cyan(c.bold("  +-----------------------------------------+")));
  console.log();
}

// --- Manifest (.claude/.sk-manifest.json) ---
// Records the SK version, who owns CLAUDE.md, the doc profile, and the hash SK shipped
// for every file it manages, which is how update tells an untouched file from an edited one.

const manifestPath = (target) => join(target, ".claude", ".sk-manifest.json");

function readManifest(target) {
  try {
    return JSON.parse(readFileSync(manifestPath(target), "utf-8"));
  } catch {
    return null;
  }
}

// Every doc path SK manages in a target. A minimal-profile install never had docs/reference.
function shippedFiles(target, oldManifest) {
  const skipRef = oldManifest?.profile === "minimal" && !existsSync(join(target, "docs", "reference"));
  const out = [];
  for (const dir of MANAGED_DIRS) {
    if (dir === "docs/reference" && skipRef) continue;
    for (const rel of listFilesRel(join(PKG, dir))) out.push(`${dir}/${rel}`);
  }
  for (const rel of SHIPPED_DOCS) if (existsSync(join(PKG, rel))) out.push(rel);
  return out;
}

// Did SK put this file here? true / false, or null when there is no record.
function isKnownToSk(oldManifest, rel) {
  if (!oldManifest) return null;
  if (oldManifest.files) return rel in oldManifest.files;
  if (!oldManifest.managed) return null;
  for (const dir of MANAGED_DIRS) {
    if (rel.startsWith(dir + "/")) return (oldManifest.managed[dir] || []).includes(rel.slice(dir.length + 1));
  }
  return SHIPPED_DOCS.includes(rel);
}

// `mine` = files the project had before SK, kept out of the manifest so update leaves them alone.
function writeManifest(target, claudeMdOwner, profile, mine = []) {
  const skip = new Set(mine);
  const files = {};
  for (const rel of shippedFiles(target, { profile })) {
    if (skip.has(rel) || !existsSync(join(target, rel))) continue;
    files[rel] = hashFile(join(PKG, rel));
  }
  if (claudeMdOwner === "sk") files["CLAUDE.md"] = hashFile(join(PKG, "CLAUDE.md"));
  const manifest = {
    version: version(),
    updatedAt: new Date().toISOString(),
    claudeMd: claudeMdOwner, // "sk" = SK created it and may refresh it; "user" = never touched
    profile,                 // "full" | "minimal"
    channel: "plugin",       // commands, agents and skills come from the plugin
    files,
  };
  mkdirSync(dirname(manifestPath(target)), { recursive: true });
  writeFileSync(manifestPath(target), JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}

// --- Per-file sync ---
// Outcomes: created | unchanged | updated | kept (edited; new version in a sidecar) | skipped (the user's own file).

function syncFile(ctx, rel) {
  const src = readFileSync(join(PKG, rel));
  const dest = join(ctx.target, rel);
  const write = (to) => {
    if (ctx.dryRun) return;
    mkdirSync(dirname(to), { recursive: true });
    writeFileSync(to, src);
  };
  const dropSidecar = () => {
    if (!ctx.dryRun && existsSync(dest + SIDECAR)) unlinkSync(dest + SIDECAR);
  };
  if (!existsSync(dest)) {
    write(dest);
    return ctx.results.created.push(rel);
  }
  const current = hashFile(dest);
  if (current === hashData(src)) {
    dropSidecar();
    return ctx.results.unchanged.push(rel);
  }
  if (ctx.force || current === ctx.old?.files?.[rel]) {
    write(dest);
    dropSidecar();
    return ctx.results.updated.push(rel);
  }
  if (isKnownToSk(ctx.old, rel) === false) return ctx.results.skipped.push(rel);
  write(dest + SIDECAR);
  return ctx.results.kept.push(rel);
}

// Delete docs SK shipped before but no longer ships: only files the manifest recorded,
// and only when untouched; an edited one is reported and left in place.
function pruneRemoved(ctx, shipped) {
  const result = { pruned: [], orphaned: [] };
  const old = ctx.old;
  if (!old?.files) return result;
  const still = new Set(shipped);
  for (const rel of Object.keys(old.files)) {
    if (still.has(rel) || rel === "CLAUDE.md" || !rel.startsWith("docs/")) continue;
    const full = join(ctx.target, rel);
    if (!existsSync(full)) continue;
    if (ctx.force || hashFile(full) === old.files[rel]) {
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

// CLAUDE.md: created when missing; refreshed only while SK owns it and the user has not
// edited it; otherwise SK's template is written beside it as CLAUDE.sk.md.
function syncClaudeMd(target, ownership, ctx) {
  const live = join(target, "CLAUDE.md");
  const src = join(PKG, "CLAUDE.md");
  if (!existsSync(live)) {
    if (!ctx.dryRun) cpSync(src, live, { force: true });
    return "created";
  }
  const current = hashFile(live);
  if (ownership === "sk" && (ctx.force || current === hashFile(src) || current === ctx.old?.files?.["CLAUDE.md"])) {
    if (!ctx.dryRun) cpSync(src, live, { force: true });
    return "refreshed";
  }
  if (current === hashFile(src)) return "refreshed";
  if (!ctx.dryRun) cpSync(src, join(target, "CLAUDE.sk.md"), { force: true });
  return "sidecar";
}

const hasLegacyCopy = (target) => existsSync(join(target, ".claude", "commands", "sk"));

function explainMigrate() {
  console.log(c.red("[ERROR]") + " An older SK copied its commands, agents and skills into .claude/ here.");
  console.log("  The plugin provides them now. Remove the copies first (docs/ is kept):");
  console.log(`    ${c.cyan("/sk:scaffold migrate")}   (or: node cli.mjs migrate .)`);
  process.exit(1);
}

// --- Route ---

const args = process.argv.slice(2);
const minimalFlag = args.includes("--minimal");
const dryRunFlag = args.includes("--dry-run");
const forceFlag = args.includes("--force");
const yesFlag = args.includes("--yes") || args.includes("-y");
const positional = args.filter((a) => !a.startsWith("-"));
const command = positional[0];
const target = resolve(positional[1] || ".");

if (command === "init") await runInit(target, minimalFlag);
else if (command === "update") await runUpdate(target, { dryRun: dryRunFlag, force: forceFlag });
else if (command === "migrate") await runMigrate(target);
else {
  console.log("Usage: node cli.mjs <init|update|migrate> [target] [--minimal] [--dry-run] [--force] [--yes]");
  console.log("Inside Claude Code: /sk:scaffold, /sk:scaffold update, /sk:scaffold migrate");
  process.exit(command ? 1 : 0);
}

// =============================================================================
// INIT: docs/ and CLAUDE.md, filling gaps only
// =============================================================================

async function runInit(target, minimal) {
  banner();
  console.log(c.blue("[INFO]") + ` Scaffolding docs/ and CLAUDE.md in: ${target}` + (minimal ? " (minimal profile)" : ""));
  console.log();
  if (hasLegacyCopy(target)) explainMigrate();

  const oldManifest = readManifest(target);
  const profile = minimal ? "minimal" : oldManifest?.profile || "full";
  const docs = listFilesRel(join(PKG, "docs")).filter(
    (rel) => profile !== "minimal" || MINIMAL_DOCS.some((entry) => rel === entry || rel.startsWith(entry + "/"))
  );
  let added = 0;
  let kept = 0;
  const mine = [];
  for (const rel of docs) {
    const dest = join(target, "docs", rel);
    if (existsSync(dest)) {
      kept++;
      const wasManaged = oldManifest?.files ? `docs/${rel}` in oldManifest.files : hashFile(dest) === hashFile(join(PKG, "docs", rel));
      if (!wasManaged) mine.push(`docs/${rel}`);
      continue;
    }
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(join(PKG, "docs", rel), dest);
    added++;
  }
  console.log(c.green("  [OK]") + ` docs/: ${added} file(s) added, ${kept} already present and left as they are`);

  const live = join(target, "CLAUDE.md");
  let claudeOwner = oldManifest?.claudeMd || "user";
  if (!existsSync(live)) {
    cpSync(join(PKG, "CLAUDE.md"), live);
    claudeOwner = "sk";
    console.log(c.green("  [OK]") + " CLAUDE.md created");
  } else if (hashFile(live) === hashFile(join(PKG, "CLAUDE.md"))) {
    console.log(c.green("  [OK]") + " CLAUDE.md already current");
  } else if (oldManifest) {
    console.log(c.yellow("  [KEEP]") + " CLAUDE.md left as it is");
  } else {
    cpSync(join(PKG, "CLAUDE.md"), join(target, "CLAUDE.sk.md"), { force: true });
    console.log(c.yellow("  [KEEP]") + " Existing CLAUDE.md preserved -- SK template written to CLAUDE.sk.md (merge manually)");
  }

  writeManifest(target, claudeOwner, profile, mine);

  console.log();
  console.log(c.bold(c.green(`  [SUCCESS] SK v${version()} docs scaffold ready`)));
  console.log();
  console.log("  Next, in Claude Code:");
  console.log(`    New product or feature:  ${c.cyan("/sk:prd")}`);
  console.log(`    Existing codebase:       ${c.cyan("/sk:init-docs")}`);
  console.log(`    Later:                   ${c.cyan("/sk:scaffold update")} refreshes the shipped templates, SOPs and reference docs`);
  console.log();
}

// =============================================================================
// UPDATE: shipped docs and an SK-created CLAUDE.md; edits are kept
// =============================================================================

async function runUpdate(target, opts) {
  banner();
  const { dryRun, force } = opts;
  console.log(c.blue("[INFO]") + ` Updating SK docs in: ${target}` + (dryRun ? " (dry run -- nothing will be written)" : ""));
  console.log();
  if (hasLegacyCopy(target)) explainMigrate();

  const oldManifest = readManifest(target);
  if (!oldManifest) {
    console.log(c.red("[ERROR]") + " No SK scaffold here. Run " + c.cyan("/sk:scaffold") + " first.");
    process.exit(1);
  }
  console.log(c.blue("[INFO]") + ` Updating to v${version()}` + (oldManifest.version ? ` (installed: v${oldManifest.version})` : ""));
  console.log();
  console.log(c.bold("  SK-managed (updated file by file):"));
  console.log(c.yellow("    docs/templates/, docs/sop/, docs/reference/"));
  console.log(c.yellow("    docs/commands-reference.md, docs/README.md, docs/conventions/coding-behavior.md"));
  console.log(c.yellow("    CLAUDE.md               <- only if SK created it and it is unchanged"));
  console.log();
  console.log(c.bold("  Never touched:"));
  console.log(c.green("    A managed file you edited  <- kept; SK's new version is written beside it as *" + SIDECAR));
  console.log(c.green("    Your own files, including ones that share a name with an SK file"));
  console.log(c.green("    docs/prd/, docs/tasks/, docs/system/, docs/architecture/, docs/decisions/, docs/flows/, docs/features/"));
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

  const ctx = { target, old: oldManifest, dryRun, force, results: { created: [], unchanged: [], updated: [], kept: [], skipped: [] } };
  const verb = dryRun ? "would be " : "";

  console.log(c.blue("[1/3]") + " Syncing templates, SOPs and reference docs...");
  const shipped = shippedFiles(target, oldManifest);
  for (const rel of shipped) syncFile(ctx, rel);
  const r = ctx.results;
  console.log(c.green("  [OK]") + ` ${r.updated.length} ${verb}updated, ${r.created.length} ${verb}added, ${r.unchanged.length} already current`);
  for (const rel of r.kept) console.log(c.yellow("  [KEEP]") + ` ${rel} has local changes -- new version ${verb}written to ${rel}${SIDECAR}`);
  for (const rel of r.skipped) console.log(c.yellow("  [KEEP]") + ` ${rel} is your own file -- SK's file of the same name ${dryRun ? "would not be" : "was not"} installed`);

  console.log(c.blue("[2/3]") + " Refreshing CLAUDE.md...");
  const claudeResult = syncClaudeMd(target, oldManifest.claudeMd || "user", ctx);
  if (claudeResult === "created") console.log(c.green("  [OK]") + ` CLAUDE.md ${verb}created (none existed)`);
  else if (claudeResult === "refreshed") console.log(c.green("  [OK]") + ` CLAUDE.md ${verb}refreshed`);
  else console.log(c.yellow("  [KEEP]") + " Your CLAUDE.md left untouched -- latest SK template in CLAUDE.sk.md");

  console.log(c.blue("[3/3]") + " Removing docs SK no longer ships...");
  const { pruned, orphaned } = pruneRemoved(ctx, shipped);
  for (const rel of pruned) console.log(c.yellow("  [RM]") + ` ${rel}`);
  for (const rel of orphaned) console.log(c.yellow("  [KEEP]") + ` ${rel} is no longer shipped but has local changes -- delete it if you no longer need it`);
  if (pruned.length === 0 && orphaned.length === 0) console.log(c.green("  [OK]") + " nothing to remove");

  if (!dryRun) {
    const owner = claudeResult === "sidecar" ? "user" : oldManifest.claudeMd === "sk" || claudeResult === "created" ? "sk" : "user";
    const mine = shipped.filter((rel) => isKnownToSk(oldManifest, rel) === false && existsSync(join(target, rel)));
    writeManifest(target, owner, oldManifest.profile || "full", mine);
  }

  console.log();
  console.log(dryRun ? c.bold(c.cyan("  [DRY RUN] No files were changed.")) : c.bold(c.green(`  [SUCCESS] SK docs updated to v${version()}`)));
  if (r.kept.length > 0) {
    console.log();
    console.log(c.bold(`  ${r.kept.length} file(s) with local changes were kept:`));
    console.log("    Compare each with its " + SIDECAR + " sidecar, merge what you want, then delete the sidecar.");
    console.log("    To take SK's version instead, rename the sidecar over the file.");
  }
  console.log("  Release notes: https://github.com/moniav/sk/blob/main/CHANGELOG.md");
  console.log();
}

// =============================================================================
// MIGRATE: from a file-copy install (SK <= 2.x) to the plugin
// =============================================================================

async function runMigrate(target) {
  banner();
  console.log(c.blue("[INFO]") + ` Migrating to the plugin in: ${target}`);
  console.log();
  const manifest = readManifest(target);
  const legacy = LEGACY_DIRS.filter((dir) => existsSync(join(target, dir)));
  if (legacy.length === 0 && !existsSync(join(target, ".claude", ".sk-source"))) {
    console.log(c.green("  [OK]") + " Nothing to migrate: no copied commands, agents or skills here.");
    if (!manifest) console.log("  Run " + c.cyan("/sk:scaffold") + " to create docs/ and CLAUDE.md.");
    return;
  }

  // Which files are SK's: the manifest's record when there is one; otherwise the whole
  // directories, which an older SK created and owned entirely.
  const recorded = manifest?.files
    ? Object.keys(manifest.files).filter((rel) => rel.startsWith(".claude/"))
    : manifest?.managed
      ? LEGACY_DIRS.flatMap((dir) => (manifest.managed[dir] || []).map((rel) => `${dir}/${rel}`))
      : null;

  console.log(c.bold("  Will remove:"));
  console.log(c.red("    .claude/commands/sk/      (every file: the plugin provides /sk: commands now)"));
  console.log(c.red(`    .claude/agents/, .claude/skills/   (${recorded ? "SK's files only; yours are kept" : "whole directories: no manifest to tell SK's files from yours"})`));
  console.log(c.red("    .claude/.sk-source and *" + SIDECAR + " sidecars"));
  console.log(c.green("  Will keep:  docs/, CLAUDE.md, .claude/settings.json and everything else"));
  console.log();
  const answer = await ask("  Proceed? (y/n) ");
  if (!isYes(answer)) {
    console.log("  Aborted.");
    process.exit(0);
  }
  console.log();

  const cmds = join(target, ".claude", "commands", "sk");
  if (existsSync(cmds)) {
    rmSync(cmds, { recursive: true, force: true });
    console.log(c.green("  [OK]") + " .claude/commands/sk/ removed");
  }
  for (const dir of [".claude/agents", ".claude/skills"]) {
    const abs = join(target, dir);
    if (!existsSync(abs)) continue;
    if (recorded) {
      for (const rel of recorded.filter((r) => r.startsWith(dir + "/"))) {
        const f = join(target, rel);
        if (existsSync(f)) unlinkSync(f);
        if (existsSync(f + SIDECAR)) unlinkSync(f + SIDECAR);
      }
      removeEmptyDirs(abs);
      console.log(c.green("  [OK]") + ` ${dir}/ SK files removed` + (existsSync(abs) ? " (your own files kept)" : ""));
    } else {
      rmSync(abs, { recursive: true, force: true });
      console.log(c.green("  [OK]") + ` ${dir}/ removed`);
    }
  }
  const sourceFile = join(target, ".claude", ".sk-source");
  if (existsSync(sourceFile)) unlinkSync(sourceFile);
  const commandsDir = join(target, ".claude", "commands");
  if (existsSync(commandsDir) && readdirSync(commandsDir).length === 0) rmSync(commandsDir, { recursive: true });

  // Keep the docs record so update still knows which docs are SK's and which were edited.
  const docsRecord = {};
  for (const [rel, hash] of Object.entries(manifest?.files || {})) if (rel.startsWith("docs/") || rel === "CLAUDE.md") docsRecord[rel] = hash;
  const owner = manifest?.claudeMd || "user";
  const next = writeManifest(target, owner, manifest?.profile || "full");
  // Preserve the hashes of the versions actually installed, not the current ones, so an
  // untouched older doc is still recognised as untouched on the next update.
  next.files = { ...next.files, ...docsRecord };
  writeFileSync(manifestPath(target), JSON.stringify(next, null, 2) + "\n");

  console.log();
  console.log(c.bold(c.green("  [SUCCESS] Migrated. docs/ and CLAUDE.md are untouched.")));
  console.log();
  console.log("  If the plugin is not installed yet:");
  console.log(`    ${c.cyan("claude plugin marketplace add moniav/sk")}`);
  console.log(`    ${c.cyan("claude plugin install sk@shipkit")}`);
  console.log(`  Then ${c.cyan("/sk:scaffold update")} to refresh the shipped docs.`);
  console.log();
}
