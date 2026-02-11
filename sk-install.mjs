#!/usr/bin/env node
// sk-install.mjs — Install ShipKit docs system into your project
// Usage: node sk-install.mjs [target-directory]
//
// Run from the extracted sk/ folder:
//   node sk-install.mjs /path/to/my-project
//
// Or from within your project:
//   node sk-install.mjs .

import { existsSync, mkdirSync, cpSync, renameSync, readdirSync, statSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Helpers ---

const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function countFiles(dir) {
  let count = 0;
  if (!existsSync(dir)) return 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countFiles(full);
    } else {
      count++;
    }
  }
  return count;
}

// --- Colors (ANSI) ---

const c = {
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

// --- Banner ---

console.log();
console.log(c.cyan(c.bold("  ┌─────────────────────────────────────┐")));
console.log(c.cyan(c.bold("  │     sk — ShipKit Documentation      │")));
console.log(c.cyan(c.bold("  │     Plan → Dev → Test lifecycle      │")));
console.log(c.cyan(c.bold("  └─────────────────────────────────────┘")));
console.log();

// --- Resolve paths ---

const target = resolve(process.argv[2] || ".");

console.log(c.blue("[INFO]") + ` Installing into: ${target}`);
console.log();

// --- Pre-flight checks ---

if (!existsSync(target)) {
  const answer = await ask(
    c.yellow("[WARN]") + " Target directory does not exist. Create it? (y/n) "
  );
  if (answer.toLowerCase() === "y") {
    mkdirSync(target, { recursive: true });
  } else {
    console.log("Aborted.");
    rl.close();
    process.exit(1);
  }
}

// Back up existing docs/ into docs/old before installing
const docsDir = join(target, "docs");
const oldDir = join(target, "docs", "old");
let backedUp = false;

if (existsSync(docsDir) && readdirSync(docsDir).length > 0) {
  console.log(
    c.yellow("[WARN]") + " Existing docs/ found — backing up to docs/old/"
  );

  // Create docs/old with timestamp to avoid collisions on repeated installs
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupDir = join(oldDir, timestamp);
  mkdirSync(backupDir, { recursive: true });

  // Move every item in docs/ except "old" itself into the backup
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

rl.close();

// --- Step 1: Create directory structure ---

console.log(c.blue("[1/4]") + " Creating directory structure...");

const dirs = [
  "docs/architecture",
  "docs/conventions",
  "docs/sop",
  "docs/tasks/examples",
  "docs/flows",
  "docs/decisions",
  "docs/system",
  "docs/templates",
  "docs/lifecycle",
  ".claude/commands/sk",
];

for (const dir of dirs) {
  mkdirSync(join(target, dir), { recursive: true });
}

console.log(c.green("  [OK]") + " docs/ tree created");
console.log(c.green("  [OK]") + " .claude/commands/sk/ created");

// --- Find source ---

let source = null;

if (existsSync(join(__dirname, "CLAUDE.md")) && existsSync(join(__dirname, "docs"))) {
  source = __dirname;
} else if (existsSync(join(process.cwd(), "CLAUDE.md")) && existsSync(join(process.cwd(), "docs"))) {
  source = process.cwd();
} else {
  console.log(
    c.yellow("[WARN]") +
      " Cannot find SK source files.\n" +
      "  Make sure you run this from the extracted sk/ folder.\n" +
      "  Expected: CLAUDE.md, GUIDE.md, docs/, .claude/ in the same directory"
  );
  process.exit(1);
}

// --- Step 2: Copy files ---

console.log(c.blue("[2/4]") + " Copying documentation files...");

// Copy docs/
cpSync(join(source, "docs"), join(target, "docs"), { recursive: true, force: true });
console.log(c.green("  [OK]") + " docs/ content copied");

// Copy .claude/commands/sk/
cpSync(
  join(source, ".claude", "commands", "sk"),
  join(target, ".claude", "commands", "sk"),
  { recursive: true, force: true }
);
console.log(c.green("  [OK]") + " .claude/commands/sk/ copied");

// Copy root files
cpSync(join(source, "CLAUDE.md"), join(target, "CLAUDE.md"), { force: true });
if (existsSync(join(source, "GUIDE.md"))) {
  cpSync(join(source, "GUIDE.md"), join(target, "GUIDE.md"), { force: true });
}
console.log(c.green("  [OK]") + " CLAUDE.md + GUIDE.md copied");

// --- Step 3: Validate ---

console.log(c.blue("[3/4]") + " Validating installation...");

let errors = 0;

function checkFile(relPath) {
  const full = join(target, relPath);
  if (existsSync(full)) {
    console.log(c.green("  [OK]") + ` ${relPath}`);
  } else {
    console.log(c.yellow("  [!!]") + ` ${relPath} — MISSING`);
    errors++;
  }
}

checkFile("CLAUDE.md");
checkFile("docs/README.md");
checkFile("docs/lifecycle/README.md");
checkFile("docs/conventions/code-style.md");
checkFile("docs/templates/task-prd.md");
checkFile("docs/templates/epic.md");
checkFile(".claude/commands/sk/plan.md");
checkFile(".claude/commands/sk/dev.md");
checkFile(".claude/commands/sk/test.md");
checkFile(".claude/commands/sk/implement.md");

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

const fileCount =
  countFiles(join(target, "docs")) +
  countFiles(join(target, ".claude", "commands", "sk"));

console.log(c.bold(c.green(`  [SUCCESS] SK installed — ${fileCount} files`)));
if (backedUp) {
  console.log(c.yellow("  [NOTE]") + " Previous docs preserved in docs/old/");
}
console.log();
console.log(c.bold("  Structure:"));
console.log(`  ${target}/`);
console.log("  ├── CLAUDE.md                  <- Agent reads this first");
console.log("  ├── GUIDE.md                   <- Human quick-start guide");
console.log("  ├── .claude/commands/sk/       <- 12 slash commands");
console.log("  │   ├── implement.md           /sk:implement");
console.log("  │   ├── plan.md                /sk:plan");
console.log("  │   ├── dev.md                 /sk:dev");
console.log("  │   ├── test.md                /sk:test");
console.log("  │   ├── new-task.md            /sk:new-task");
console.log("  │   ├── new-epic.md            /sk:new-epic");
console.log("  │   └── ...                    (8 more)");
console.log("  └── docs/                      <- Documentation hub");
console.log("      ├── lifecycle/             Plan -> Dev -> Test");
console.log("      ├── conventions/           Code style, structure, git, testing");
console.log("      ├── system/                Tech stack, schema, APIs");
console.log("      ├── tasks/                 Task board + examples");
console.log("      ├── templates/             Starter templates");
console.log("      └── ...");
console.log();
console.log(c.bold("  Next steps:"));
console.log(`  1. Edit ${c.cyan("docs/system/tech-stack.md")} — add your real stack`);
console.log(`  2. Edit ${c.cyan("docs/conventions/code-style.md")} — match your patterns`);
console.log(`  3. Edit ${c.cyan("CLAUDE.md")} — add your project commands`);
console.log(`  4. Run ${c.cyan("/sk:init-docs")} in Claude Code to auto-populate from codebase`);
console.log(`  5. Run ${c.cyan("/sk:new-task")} to create your first task`);
console.log();
