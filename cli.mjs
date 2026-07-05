#!/usr/bin/env node
// cli.mjs — ShipKit Documentation CLI
// Usage:
//   npx shipkit-cld [target]                    Install into target (default: .)
//   npx shipkit-cld update [target]             Update from package source
//   npx shipkit-cld update [target] --from PATH Update from local SK checkout
//   npx shipkit-cld remove [target]             Remove SK system files (keeps docs/)

import { existsSync, mkdirSync, cpSync, renameSync, readdirSync, rmSync, unlinkSync, writeFileSync, readFileSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Helpers ---

function ask(question) {
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

const MANAGED_DIRS = [
  ".claude/commands/sk",
  ".claude/agents",
  ".claude/skills",
  "docs/templates",
  "docs/sop",
  "docs/reference",
];

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
    return JSON.parse(readFileSync(join(source, "package.json"), "utf-8")).version || "unknown";
  } catch {
    return "unknown";
  }
}

function writeManifest(target, source, claudeMdOwner) {
  const managed = {};
  for (const dir of MANAGED_DIRS) {
    managed[dir] = listFilesRel(join(source, "pkg", dir));
  }
  const manifest = {
    version: sourceVersion(source),
    updatedAt: new Date().toISOString(),
    // "sk" = SK created CLAUDE.md and may refresh/remove it; "user" = never touch it
    claudeMd: claudeMdOwner,
    managed,
  };
  mkdirSync(join(target, ".claude"), { recursive: true });
  writeFileSync(manifestPath(target), JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}

// Delete files SK shipped previously but no longer ships. Only files recorded
// in the previous manifest are candidates — user-added files are never touched.
function pruneRemoved(target, oldManifest, source) {
  if (!oldManifest || !oldManifest.managed) return [];
  const pruned = [];
  for (const dir of MANAGED_DIRS) {
    const before = oldManifest.managed[dir] || [];
    const shipped = new Set(listFilesRel(join(source, "pkg", dir)));
    for (const rel of before) {
      if (shipped.has(rel)) continue;
      const full = join(target, dir, rel);
      if (existsSync(full)) {
        unlinkSync(full);
        pruned.push(`${dir}/${rel}`);
      }
    }
  }
  return pruned;
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
// ownership: "sk" -> SK created it, refresh in place; "user"/unknown -> never
// overwrite; drop the SK template alongside as CLAUDE.sk.md to merge manually.
// Returns "created" | "refreshed" | "sidecar".
function syncClaudeMd(pkg, target, ownership) {
  const live = join(target, "CLAUDE.md");
  if (!existsSync(live)) {
    cpSync(join(pkg, "CLAUDE.md"), live, { force: true });
    return "created";
  }
  if (ownership === "sk") {
    cpSync(join(pkg, "CLAUDE.md"), live, { force: true });
    return "refreshed";
  }
  cpSync(join(pkg, "CLAUDE.md"), join(target, "CLAUDE.sk.md"), { force: true });
  return "sidecar";
}

function isValidSource(dir) {
  return existsSync(join(dir, "pkg", "CLAUDE.md"))
      && existsSync(join(dir, "pkg", "docs"))
      && existsSync(join(dir, "pkg", ".claude", "commands", "sk"));
}

function findSource(target, fromOverride) {
  // 1. Explicit --from flag
  if (fromOverride) {
    if (isValidSource(fromOverride)) return fromOverride;
    console.log(c.red("[ERROR]") + ` --from path is not a valid SK source: ${fromOverride}`);
    console.log("  Expected: pkg/CLAUDE.md, pkg/docs/, and pkg/.claude/commands/sk/ in that directory");
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
    if (saved && isValidSource(saved)) {
      console.log(c.blue("[INFO]") + ` Using saved source: ${saved}`);
      return saved;
    }
    // Fallback: try as relative path from target
    if (saved) {
      const relative = resolve(target, saved);
      if (isValidSource(relative)) {
        console.log(c.blue("[INFO]") + ` Using resolved source: ${relative}`);
        return relative;
      }
    }
  }

  // 4. Current working directory
  if (isValidSource(process.cwd())) return process.cwd();

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
const command = ["remove", "update"].includes(args[0]) ? args[0] : "install";
const targetArg = command === "install" ? args[0] : args[1];

// Parse --from flag for explicit source override
const fromIdx = args.indexOf("--from");
const fromArg = fromIdx !== -1 && args[fromIdx + 1] ? resolve(args[fromIdx + 1]) : null;

if (command === "remove") {
  await runRemove(resolve(targetArg || "."));
} else if (command === "update") {
  await runUpdate(resolve(targetArg || "."), fromArg);
} else {
  await runInstall(resolve(targetArg || "."));
}

// =============================================================================
// INSTALL
// =============================================================================

async function runInstall(target) {
  banner();

  console.log(c.blue("[INFO]") + ` Installing into: ${target}`);
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
    return runUpdate(target, null);
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
  const pkg = join(source, "pkg");

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

  cpSync(join(pkg, "docs"), join(target, "docs"), { recursive: true, force: true });
  console.log(c.green("  [OK]") + " docs/ content copied");

  cpSync(
    join(pkg, ".claude", "commands", "sk"),
    join(target, ".claude", "commands", "sk"),
    { recursive: true, force: true }
  );
  console.log(c.green("  [OK]") + " .claude/commands/sk/ copied");

  // Copy agents
  const agentsSource = join(pkg, ".claude", "agents");
  if (existsSync(agentsSource)) {
    mkdirSync(join(target, ".claude", "agents"), { recursive: true });
    cpSync(agentsSource, join(target, ".claude", "agents"), { recursive: true, force: true });
    console.log(c.green("  [OK]") + " .claude/agents/ copied");
  }

  // Copy skills
  const skillsSource = join(pkg, ".claude", "skills");
  if (existsSync(skillsSource)) {
    mkdirSync(join(target, ".claude", "skills"), { recursive: true });
    cpSync(skillsSource, join(target, ".claude", "skills"), { recursive: true, force: true });
    console.log(c.green("  [OK]") + " .claude/skills/ copied");
  }

  const claudeResult = syncClaudeMd(pkg, target, null);
  if (claudeResult === "created") {
    console.log(c.green("  [OK]") + " CLAUDE.md created");
  } else {
    console.log(c.yellow("  [KEEP]") + " Existing CLAUDE.md preserved -- SK template written to CLAUDE.sk.md (merge manually)");
  }

  // Record what SK installed: version, CLAUDE.md ownership, managed files
  writeManifest(target, source, claudeResult === "created" ? "sk" : "user");

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
// UPDATE — commands, templates, and SOPs only (preserves user content)
// =============================================================================

async function runUpdate(target, fromOverride) {
  banner();

  console.log(c.blue("[INFO]") + ` Updating SK in: ${target}`);
  console.log();

  // --- Pre-flight: confirm SK is installed ---

  const skCommandsDir = join(target, ".claude", "commands", "sk");
  if (!existsSync(skCommandsDir)) {
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
  if (fromOverride) saveSourcePath(target, fromOverride);

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

  console.log(c.bold("  Will update (overwrite):"));
  console.log(c.yellow("    .claude/commands/sk/    <- slash commands"));
  console.log(c.yellow("    docs/templates/         <- document templates"));
  console.log(c.yellow("    docs/sop/               <- standard procedures"));
  console.log(c.yellow("    docs/reference/         <- shipped reference data"));
  console.log(c.yellow("    docs/commands-reference.md"));
  console.log(c.yellow("    docs/README.md          <- doc map"));
  console.log(c.yellow("    docs/conventions/coding-behavior.md"));
  console.log(c.yellow("    CLAUDE.md               <- agent instructions"));
  console.log(c.yellow("    .claude/agents/         <- agent definitions"));
  console.log(c.yellow("    .claude/skills/         <- active skills"));
  console.log();
  console.log(c.bold("  Will preserve (not touched):"));
  console.log(c.green("    docs/tasks/             <- your task files"));
  console.log(c.green("    docs/conventions/       <- your code style (except coding-behavior.md)"));
  console.log(c.green("    docs/system/            <- your tech stack, schema, APIs"));
  console.log(c.green("    docs/architecture/      <- your architecture docs"));
  console.log(c.green("    docs/decisions/         <- your ADRs"));
  console.log(c.green("    docs/flows/             <- your flow diagrams"));
  console.log();

  const answer = await ask("  Proceed with update? (y/n) ");
  if (!isYes(answer)) {
    console.log("  Aborted.");
    process.exit(0);
  }

  console.log();

  const pkg = join(source, "pkg");

  // --- Step 1: Update commands ---

  console.log(c.blue("[1/5]") + " Updating slash commands...");
  cpSync(
    join(pkg, ".claude", "commands", "sk"),
    join(target, ".claude", "commands", "sk"),
    { recursive: true, force: true }
  );
  const cmdCount = countFiles(join(target, ".claude", "commands", "sk"));
  console.log(c.green("  [OK]") + ` .claude/commands/sk/ updated (${cmdCount} files)`);

  // --- Step 2: Update templates ---

  console.log(c.blue("[2/5]") + " Updating templates & reference docs...");
  cpSync(
    join(pkg, "docs", "templates"),
    join(target, "docs", "templates"),
    { recursive: true, force: true }
  );
  const tplCount = countFiles(join(target, "docs", "templates"));
  console.log(c.green("  [OK]") + ` docs/templates/ updated (${tplCount} files)`);

  // SK-shipped reference content (safe to overwrite — not user-authored)
  const refSource = join(pkg, "docs", "reference");
  if (existsSync(refSource)) {
    cpSync(refSource, join(target, "docs", "reference"), { recursive: true, force: true });
    console.log(c.green("  [OK]") + " docs/reference/ updated");
  }
  const cmdRefSource = join(pkg, "docs", "commands-reference.md");
  if (existsSync(cmdRefSource)) {
    cpSync(cmdRefSource, join(target, "docs", "commands-reference.md"), { force: true });
    console.log(c.green("  [OK]") + " docs/commands-reference.md updated");
  }

  // SK-authored docs that live alongside user content — refresh the individual
  // files only (never the whole parent dir, which would clobber user files).
  const shippedDocs = [
    ["docs/README.md", "docs/README.md"],
    ["docs/conventions/coding-behavior.md", "docs/conventions/coding-behavior.md"],
  ];
  for (const [rel] of shippedDocs) {
    const src = join(pkg, rel);
    if (existsSync(src)) {
      const dest = join(target, rel);
      mkdirSync(dirname(dest), { recursive: true });
      cpSync(src, dest, { force: true });
      console.log(c.green("  [OK]") + ` ${rel} updated`);
    }
  }

  // --- Step 3: Update lifecycle & SOPs ---

  console.log(c.blue("[3/5]") + " Updating SOPs...");

  cpSync(
    join(pkg, "docs", "sop"),
    join(target, "docs", "sop"),
    { recursive: true, force: true }
  );
  console.log(c.green("  [OK]") + " docs/sop/ updated");

  // --- Step 4: Update CLAUDE.md ---

  console.log(c.blue("[4/5]") + " Refreshing CLAUDE.md reference...");
  // Ownership comes from the manifest. Legacy installs (no manifest) can't
  // prove SK authored the live CLAUDE.md, so treat it as user-owned (safe).
  const claudeOwner = oldManifest?.claudeMd || "user";
  const claudeResult = syncClaudeMd(pkg, target, claudeOwner);
  if (claudeResult === "created") {
    console.log(c.green("  [OK]") + " CLAUDE.md created (none existed)");
  } else if (claudeResult === "refreshed") {
    console.log(c.green("  [OK]") + " CLAUDE.md refreshed (SK-managed)");
  } else {
    console.log(c.yellow("  [KEEP]") + " Your CLAUDE.md left untouched -- latest SK template in CLAUDE.sk.md");
  }

  // --- Step 5: Update agents and skills ---

  console.log(c.blue("[5/5]") + " Updating agents and skills...");

  const agentsSource = join(pkg, ".claude", "agents");
  if (existsSync(agentsSource)) {
    mkdirSync(join(target, ".claude", "agents"), { recursive: true });
    cpSync(agentsSource, join(target, ".claude", "agents"), { recursive: true, force: true });
    console.log(c.green("  [OK]") + " .claude/agents/ updated");
  }

  const skillsSource = join(pkg, ".claude", "skills");
  if (existsSync(skillsSource)) {
    mkdirSync(join(target, ".claude", "skills"), { recursive: true });
    cpSync(skillsSource, join(target, ".claude", "skills"), { recursive: true, force: true });
    console.log(c.green("  [OK]") + " .claude/skills/ updated");
  }

  // --- Prune files SK no longer ships, record the new state ---

  const pruned = pruneRemoved(target, oldManifest, source);
  if (pruned.length > 0) {
    console.log();
    console.log(c.blue("[INFO]") + ` Removed ${pruned.length} file(s) no longer shipped by SK:`);
    for (const p of pruned) console.log(c.yellow("  [RM]") + ` ${p}`);
    removeEmptyDirs(join(target, ".claude", "skills"));
    removeEmptyDirs(join(target, ".claude", "agents"));
  }

  const newOwner = claudeResult === "sidecar" ? "user" : "sk";
  writeManifest(target, source, newOwner);

  // --- Summary ---

  console.log();
  console.log(c.bold(c.green(`  [SUCCESS] SK updated to v${newVersion}`)));
  console.log();
  console.log(c.bold("  Updated:"));
  console.log("    .claude/commands/sk/   (slash commands)");
  console.log("    docs/templates/        (document templates)");
  console.log("    docs/sop/             (standard procedures)");
  console.log("    docs/reference/        (shipped reference data)");
  console.log("    docs/commands-reference.md");
  console.log("    docs/README.md         (doc map)");
  console.log("    docs/conventions/coding-behavior.md");
  if (claudeResult === "sidecar") {
    console.log("    CLAUDE.sk.md           (latest SK template; merge into your CLAUDE.md)");
  } else {
    console.log("    CLAUDE.md              (SK-managed agent instructions)");
  }
  console.log("    .claude/agents/        (agent definitions)");
  console.log("    .claude/skills/        (active skills)");
  console.log();
  console.log(c.bold("  Preserved:"));
  if (claudeResult === "sidecar") {
    console.log("    CLAUDE.md             (your agent instructions -- never overwritten)");
  }
  console.log("    docs/tasks/           (your tasks & epics)");
  console.log("    docs/conventions/     (your code style)");
  console.log("    docs/system/          (your tech stack)");
  console.log("    docs/architecture/    (your architecture)");
  console.log("    docs/decisions/       (your ADRs)");
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
