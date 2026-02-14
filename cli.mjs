#!/usr/bin/env node
// cli.mjs — ShipKit Documentation CLI
// Usage:
//   npx shipkit-cld [target]          Install into target (default: .)
//   npx shipkit-cld update [target]   Update commands & templates only (preserves user docs)
//   npx shipkit-cld remove [target]   Remove SK system files (keeps docs/)

import { existsSync, mkdirSync, cpSync, renameSync, readdirSync, rmSync, unlinkSync } from "fs";
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

if (command === "remove") {
  await runRemove(resolve(targetArg || "."));
} else if (command === "update") {
  await runUpdate(resolve(targetArg || "."));
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
    if (answer.toLowerCase() === "y") {
      mkdirSync(target, { recursive: true });
    } else {
      console.log("Aborted.");
      process.exit(1);
    }
  }

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

  const dirs = [
    "docs/architecture",
    "docs/conventions",
    "docs/sop",
    "docs/tasks/examples",
    "docs/flows",
    "docs/decisions",
    "docs/system",
    "docs/templates",
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
        "  Expected: CLAUDE.md, docs/, .claude/ in the same directory"
    );
    process.exit(1);
  }

  // --- Step 2: Copy files ---

  console.log(c.blue("[2/4]") + " Copying documentation files...");

  cpSync(join(source, "docs"), join(target, "docs"), { recursive: true, force: true });
  console.log(c.green("  [OK]") + " docs/ content copied");

  cpSync(
    join(source, ".claude", "commands", "sk"),
    join(target, ".claude", "commands", "sk"),
    { recursive: true, force: true }
  );
  console.log(c.green("  [OK]") + " .claude/commands/sk/ copied");

  cpSync(join(source, "CLAUDE.md"), join(target, "CLAUDE.md"), { force: true });
  if (existsSync(join(source, "GUIDE.md"))) {
    cpSync(join(source, "GUIDE.md"), join(target, "GUIDE.md"), { force: true });
  }
  console.log(c.green("  [OK]") + " CLAUDE.md copied");

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

  console.log(c.bold(c.green(`  [SUCCESS] SK installed -- ${fileCount} files`)));
  if (backedUp) {
    console.log(c.yellow("  [NOTE]") + " Previous docs preserved in docs/old/");
  }
  console.log();
  console.log(c.bold("  Structure:"));
  console.log(`  ${target}/`);
  console.log("  ├── CLAUDE.md                  <- Agent reads this first");
  console.log("  ├── .claude/commands/sk/       <- 17 slash commands");
  console.log("  |   ├── implement.md           /sk:implement");
  console.log("  |   ├── plan.md                /sk:plan");
  console.log("  |   ├── dev.md                 /sk:dev");
  console.log("  |   ├── test.md                /sk:test");
  console.log("  |   ├── new-task.md            /sk:new-task");
  console.log("  |   ├── new-epic.md            /sk:new-epic");
  console.log("  |   └── ...                    (10 more)");
  console.log("  └── docs/                      <- Documentation hub");
  console.log("      ├── conventions/           Code style, structure, git, testing");
  console.log("      ├── system/                Tech stack, schema, APIs");
  console.log("      ├── tasks/                 Task board + examples");
  console.log("      ├── templates/             Starter templates");
  console.log("      └── ...");
  console.log();
  console.log(c.bold("  Next steps:"));
  console.log(`  1. Edit ${c.cyan("docs/system/tech-stack.md")} -- add your real stack`);
  console.log(`  2. Edit ${c.cyan("docs/conventions/code-style.md")} -- match your patterns`);
  console.log(`  3. Edit ${c.cyan("CLAUDE.md")} -- add your project commands`);
  console.log(`  4. Run ${c.cyan("/sk:init-docs")} in Claude Code to auto-populate from codebase`);
  console.log(`  5. Run ${c.cyan("/sk:new-task")} to create your first task`);
  console.log();
}

// =============================================================================
// UPDATE — commands, templates, and SOPs only (preserves user content)
// =============================================================================

async function runUpdate(target) {
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

  let source = null;

  if (existsSync(join(__dirname, "CLAUDE.md")) && existsSync(join(__dirname, "docs"))) {
    source = __dirname;
  } else if (existsSync(join(process.cwd(), "CLAUDE.md")) && existsSync(join(process.cwd(), "docs"))) {
    source = process.cwd();
  } else {
    console.log(
      c.red("[ERROR]") +
        " Cannot find SK source files.\n" +
        "  Make sure you have the latest shipkit-cld package."
    );
    process.exit(1);
  }

  // --- What gets updated vs preserved ---

  console.log(c.bold("  Will update (overwrite):"));
  console.log(c.yellow("    .claude/commands/sk/    <- slash commands"));
  console.log(c.yellow("    docs/templates/         <- document templates"));
  console.log(c.yellow("    docs/sop/               <- standard procedures"));
  console.log(c.yellow("    CLAUDE.md               <- agent instructions"));
  console.log();
  console.log(c.bold("  Will preserve (not touched):"));
  console.log(c.green("    docs/tasks/             <- your task files"));
  console.log(c.green("    docs/conventions/       <- your code style"));
  console.log(c.green("    docs/system/            <- your tech stack, schema, APIs"));
  console.log(c.green("    docs/architecture/      <- your architecture docs"));
  console.log(c.green("    docs/decisions/         <- your ADRs"));
  console.log(c.green("    docs/flows/             <- your flow diagrams"));
  console.log();

  const answer = await ask("  Proceed with update? (y/n) ");
  if (answer.toLowerCase() !== "y") {
    console.log("  Aborted.");
    process.exit(0);
  }

  console.log();

  // --- Step 1: Update commands ---

  console.log(c.blue("[1/4]") + " Updating slash commands...");
  cpSync(
    join(source, ".claude", "commands", "sk"),
    join(target, ".claude", "commands", "sk"),
    { recursive: true, force: true }
  );
  const cmdCount = countFiles(join(target, ".claude", "commands", "sk"));
  console.log(c.green("  [OK]") + ` .claude/commands/sk/ updated (${cmdCount} files)`);

  // --- Step 2: Update templates ---

  console.log(c.blue("[2/4]") + " Updating templates...");
  cpSync(
    join(source, "docs", "templates"),
    join(target, "docs", "templates"),
    { recursive: true, force: true }
  );
  const tplCount = countFiles(join(target, "docs", "templates"));
  console.log(c.green("  [OK]") + ` docs/templates/ updated (${tplCount} files)`);

  // --- Step 3: Update lifecycle & SOPs ---

  console.log(c.blue("[3/4]") + " Updating SOPs...");

  cpSync(
    join(source, "docs", "sop"),
    join(target, "docs", "sop"),
    { recursive: true, force: true }
  );
  console.log(c.green("  [OK]") + " docs/sop/ updated");

  // --- Step 4: Update CLAUDE.md ---

  console.log(c.blue("[4/4]") + " Updating CLAUDE.md...");
  cpSync(join(source, "CLAUDE.md"), join(target, "CLAUDE.md"), { force: true });
  if (existsSync(join(source, "GUIDE.md"))) {
    cpSync(join(source, "GUIDE.md"), join(target, "GUIDE.md"), { force: true });
  }
  console.log(c.green("  [OK]") + " CLAUDE.md updated");

  // --- Summary ---

  console.log();
  console.log(c.bold(c.green("  [SUCCESS] SK updated")));
  console.log();
  console.log(c.bold("  Updated:"));
  console.log("    .claude/commands/sk/   (slash commands)");
  console.log("    docs/templates/        (document templates)");
  console.log("    docs/sop/             (standard procedures)");
  console.log("    CLAUDE.md             (agent instructions)");
  console.log();
  console.log(c.bold("  Preserved:"));
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
  const guideMd = join(target, "GUIDE.md");
  const docsDir = join(target, "docs");

  // --- Check if SK is installed ---

  const hasCommands = existsSync(skCommandsDir);
  const hasClaudeMd = existsSync(claudeMd);

  if (!hasCommands && !hasClaudeMd) {
    console.log(c.yellow("[WARN]") + " SK does not appear to be installed here.");
    process.exit(1);
  }

  // --- Show what will be removed ---

  console.log(c.bold("  Will remove:"));
  if (hasCommands) {
    const cmdCount = countFiles(skCommandsDir);
    console.log(c.red(`    .claude/commands/sk/    (${cmdCount} command files)`));
  }
  if (hasClaudeMd) console.log(c.red("    CLAUDE.md"));
  if (existsSync(guideMd)) console.log(c.red("    GUIDE.md"));
  console.log();

  if (existsSync(docsDir)) {
    const docCount = countFiles(docsDir);
    console.log(c.green(`  Will keep:`));
    console.log(c.green(`    docs/                  (${docCount} files preserved)`));
    console.log();
  }

  // --- Confirm ---

  const answer = await ask("  Proceed? (y/n) ");
  if (answer.toLowerCase() !== "y") {
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

  if (hasClaudeMd) {
    unlinkSync(claudeMd);
    console.log(c.green("  [OK]") + " CLAUDE.md removed");
    removed++;
  }

  if (existsSync(guideMd)) {
    unlinkSync(guideMd);
    console.log(c.green("  [OK]") + " GUIDE.md removed");
    removed++;
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
