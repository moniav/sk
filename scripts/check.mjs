#!/usr/bin/env node
// scripts/check.mjs: repo consistency checks for SK (dev-only, never shipped).
// Usage:
//   node scripts/check.mjs            Run every check
//   node scripts/check.mjs --static   Skip the checks that run pkg/cli.mjs or the claude CLI
//
// Errors fail the run. Warnings are known gaps scheduled in
// dev-docs/planning/2026-10-best-practices-enhancement-plan.md; each names its item.

import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, appendFileSync } from "fs";
import { createHash } from "crypto";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import { tmpdir } from "os";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PKG = join(ROOT, "pkg");
const staticOnly = process.argv.includes("--static");

const errors = [];
const warnings = [];
const err = (check, msg) => errors.push(`${check}: ${msg}`);
const warn = (check, msg) => warnings.push(`${check}: ${msg}`);

// --- Helpers ---

function read(path) {
  return readFileSync(path, "utf-8").replace(/\r\n/g, "\n");
}

function listFilesRel(dir, base = dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFilesRel(full, base));
    else out.push(full.slice(base.length + 1).replace(/\\/g, "/"));
  }
  return out.sort();
}

// Minimal frontmatter reader: top-level `key: value` pairs, with folded/literal
// (`>`, `|`) and indented continuation lines joined into one string.
function frontmatter(text) {
  if (!text.startsWith("---\n")) return null;
  const end = text.indexOf("\n---", 4);
  if (end === -1) return null;
  const fm = {};
  let key = null;
  for (const line of text.slice(4, end).split("\n")) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (m) {
      key = m[1];
      fm[key] = /^[>|][+-]?$/.test(m[2]) ? "" : m[2];
    } else if (key && /^\s+\S/.test(line)) {
      fm[key] = (fm[key] ? fm[key] + " " : "") + line.trim();
    }
  }
  for (const k of Object.keys(fm)) fm[k] = fm[k].replace(/^["']|["']$/g, "");
  return { fields: fm, bodyStart: end + 4 };
}

const commandsDir = join(PKG, ".claude", "commands", "sk");
const skillsDir = join(PKG, ".claude", "skills");
const agentsDir = join(PKG, ".claude", "agents");

const commandFiles = readdirSync(commandsDir).filter((f) => f.endsWith(".md")).sort();
const agentFiles = readdirSync(agentsDir).filter((f) => f.endsWith(".md")).sort();
const skillNames = readdirSync(skillsDir, { withFileTypes: true })
  .filter((e) => e.isDirectory() && existsSync(join(skillsDir, e.name, "SKILL.md")))
  .map((e) => e.name)
  .sort();

// --- 1. Paths resolve from the plugin root ---

for (const rel of listFilesRel(PKG)) {
  if (!rel.endsWith(".md")) continue;
  const text = read(join(PKG, rel));
  const where = `pkg/${rel}`;
  // A path into SK's own files is only valid when it goes through the plugin root.
  for (const m of text.matchAll(/(?<![\w${}/])\.claude\/(skills\/[a-z-]+\/[\w./-]+|agents\/[a-z-]+\.md|commands\/sk\/[a-z-]+\.md)/g)) {
    err("paths", `${where}: bare path "${m[0]}"; SK files live in the plugin cache, go through \${CLAUDE_PLUGIN_ROOT}`);
  }
  // Only commands are loaded by Claude Code itself; a file read with the Read tool gets no substitution.
  if (text.includes("${CLAUDE_PLUGIN_ROOT}") && !rel.startsWith(".claude/commands/")) {
    err("paths", `${where}: \${CLAUDE_PLUGIN_ROOT} is only substituted in commands; use a path relative to this file`);
  }
  // Agents are dispatched by type; reading a definition file bypasses its tools and model.
  if (/subagent_type:\s*general-purpose[\s\S]{0,300}agents\/[a-z-]+\.md/.test(text)) {
    err("paths", `${where}: dispatches general-purpose and points it at an agent file; use the agent's type`);
  }
}

// --- 2. Advertised counts match the file system ---

const actual = { commands: commandFiles.length, skills: skillNames.length, agents: agentFiles.length };
const countPatterns = {
  commands: /(\d+)\s+(?:slash\s+|lifecycle\s+)?commands\b/gi,
  skills: /(\d+)\s+skills\b/gi,
  agents: /(\d+)\s+agents\b/gi,
};
const countFiles = [
  "package.json",
  "pkg/.claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
  "Readme.md",
  "CLAUDE.md",
  "docs/user-guides/install-as-plugin.md",
];
for (const rel of countFiles) {
  const path = join(ROOT, rel);
  if (!existsSync(path)) continue;
  const text = read(path);
  for (const [kind, re] of Object.entries(countPatterns)) {
    for (const m of text.matchAll(re)) {
      if (Number(m[1]) !== actual[kind]) err("counts", `${rel} says "${m[0]}" but there are ${actual[kind]} ${kind}`);
    }
  }
}

// --- 3. Frontmatter rules (Anthropic skill authoring limits) ---

const NAME_RE = /^[a-z0-9-]+$/;
let listingChars = 0;

for (const file of commandFiles) {
  const fm = frontmatter(read(join(commandsDir, file)));
  if (!fm) { err("frontmatter", `commands/sk/${file} has no frontmatter`); continue; }
  if (!fm.fields.description) err("frontmatter", `commands/sk/${file} has no description`);
  if (fm.fields["disable-model-invocation"] !== "true") listingChars += (fm.fields.description || "").length;
}

for (const name of skillNames) {
  const text = read(join(skillsDir, name, "SKILL.md"));
  const fm = frontmatter(text);
  if (!fm) { err("frontmatter", `skills/${name} has no frontmatter`); continue; }
  const f = fm.fields;
  if (!f.name) err("frontmatter", `skills/${name} has no name`);
  else {
    if (f.name !== name) err("frontmatter", `skills/${name} declares name "${f.name}"`);
    if (f.name.length > 64 || !NAME_RE.test(f.name)) err("frontmatter", `skills/${name}: name must be lowercase letters, digits and hyphens, 64 characters at most`);
    if (/claude|anthropic/.test(f.name)) err("frontmatter", `skills/${name}: name uses a reserved word`);
  }
  if (!f.description) err("frontmatter", `skills/${name} has no description`);
  else if (f.description.length > 1024) err("frontmatter", `skills/${name}: description is ${f.description.length} characters (limit 1024)`);
  if (f["disable-model-invocation"] !== "true") listingChars += (f.description || "").length;

  const bodyLines = text.slice(fm.bodyStart).split("\n").length;
  if (bodyLines > 500) err("size", `skills/${name}/SKILL.md body is ${bodyLines} lines (limit 500)`);

  // Bundled files referenced from a shell block must be anchored to the skill dir (plan item 2.4)
  for (const block of text.matchAll(/```[^\n]*\n([\s\S]*?)```/g)) {
    for (const line of block[1].split("\n")) {
      if (/(^|[\s"'=])references\//.test(line)) warn("paths (2.4)", `skills/${name}: "${line.trim()}" uses a relative references/ path`);
    }
  }

  // Long reference files need a contents list near the top (plan item 3.2)
  for (const rel of listFilesRel(join(skillsDir, name))) {
    if (!rel.endsWith(".md") || rel === "SKILL.md") continue;
    const ref = read(join(skillsDir, name, rel));
    const lines = ref.split("\n");
    if (lines.length > 100 && !/^#{1,3}\s+(table of\s+)?contents\b/im.test(lines.slice(0, 30).join("\n"))) {
      warn("references (3.2)", `skills/${name}/${rel} is ${lines.length} lines with no contents list`);
    }
  }
}

for (const file of agentFiles) {
  const fm = frontmatter(read(join(agentsDir, file)));
  if (!fm) { err("frontmatter", `agents/${file} has no frontmatter`); continue; }
  if (!fm.fields.name) err("frontmatter", `agents/${file} has no name`);
  if (!fm.fields.description) err("frontmatter", `agents/${file} has no description`);
}

// --- 4. allowed-tools must not pre-approve a whole binary (plan item 1.2) ---

// Binaries whose every invocation is read-only.
const HARMLESS = new Set(["date", "govulncheck", "pip-audit"]);
function checkAllowedTools(label, value) {
  if (!value) return;
  for (const m of value.matchAll(/Bash\(([^)]*)\)/g)) {
    const whole = m[1].match(/^([\w.-]+)\s*(?::\*|\s\*)$/);
    if (whole && !HARMLESS.has(whole[1])) err("allowed-tools", `${label} pre-approves every "${whole[1]}" command: ${m[0]}`);
  }
}
for (const file of commandFiles) checkAllowedTools(`commands/sk/${file}`, frontmatter(read(join(commandsDir, file)))?.fields["allowed-tools"]);
for (const name of skillNames) checkAllowedTools(`skills/${name}`, frontmatter(read(join(skillsDir, name, "SKILL.md")))?.fields["allowed-tools"]);

// --- 5. Invocation control (plan items 1.3, 1.4, 1.5, 2.2) ---

// The only commands the model may invoke on its own (decision D1). Every other
// command runs when typed, which also keeps its description out of the per-turn listing.
const MODEL_INVOCABLE = ["debug", "resume", "task-status", "new-task", "plan", "review"];
for (const file of commandFiles) {
  const name = file.replace(/\.md$/, "");
  const text = read(join(commandsDir, file));
  const f = frontmatter(text)?.fields || {};
  const gated = f["disable-model-invocation"] === "true";
  if (MODEL_INVOCABLE.includes(name)) {
    if (gated) err("gating", `commands/sk/${file} should be model-invocable (decision D1)`);
    if (!/\bUse when\b/.test(f.description || "")) err("gating", `commands/sk/${file} is model-invocable but its description has no "Use when" trigger`);
  } else if (!gated) {
    err("gating", `commands/sk/${file} must set disable-model-invocation: true (decision D1)`);
  }
  if (/\(project\)\s*$/.test(f.description || "")) err("frontmatter", `commands/sk/${file}: drop the "(project)" suffix from the description`);
  if (f["argument-hint"] && !text.includes("$ARGUMENTS")) err("frontmatter", `commands/sk/${file} takes arguments but never places $ARGUMENTS`);

  // The Skill tool cannot reach a gated command, so one command must not tell the model to run another.
  // "Suggest the user run /sk:x" is fine: the user types it.
  for (const m of text.slice(text.indexOf("\n---", 4)).matchAll(/^(?!\s*[-|>*]).*\b[Rr]un `\/sk:([a-z-]+)`[^?\n]*$/gm)) {
    if (/\buser(s)? run\b|\bsuggest\b/i.test(m[0])) continue;
    if (!MODEL_INVOCABLE.includes(m[1])) err("gating", `commands/sk/${file} tells the model to run gated /sk:${m[1]}: "${m[0].trim().slice(0, 70)}"`);
  }

  // The help command is the map of the others; a command it does not mention is one nobody will find.
  if (existsSync(join(commandsDir, "help.md")) && name !== "help" && !new RegExp("/sk:" + name + "\\b").test(read(join(commandsDir, "help.md")))) {
    err("help", `commands/sk/help.md does not mention /sk:${name}`);
  }
}

// Report-only commands: must not be able to edit the project.
const READ_ONLY = ["code-review", "perf-review", "security-review", "ui-review", "docs-audit", "debt", "recap", "task-status", "review"];
for (const name of READ_ONLY) {
  const path = join(commandsDir, `${name}.md`);
  if (!existsSync(path)) continue;
  const denied = frontmatter(read(path))?.fields["disallowed-tools"] || "";
  if (!/\bEdit\b/.test(denied)) err("read-only", `commands/sk/${name}.md is report-only but does not disallow Edit`);
}

// Skills loaded by commands, never by hand: hidden from both the model and the / menu.
// headless-operation is the exception on the model side: a scheduled prompt is stored
// outside SK and cannot carry an install path, so it reaches the skill by name.
const INTERNAL_SKILLS = ["git-commit-flow", "subtask-execution", "research", "headless-operation", "executive-meeting", "interviewing", "prototype", "product-brief", "flow-design", "architecture-design"];
const REACHED_BY_NAME = ["headless-operation"];
for (const name of INTERNAL_SKILLS) {
  const path = join(skillsDir, name, "SKILL.md");
  if (!existsSync(path)) continue;
  const f = frontmatter(read(path))?.fields || {};
  const gated = f["disable-model-invocation"] === "true";
  if (REACHED_BY_NAME.includes(name) ? gated : !gated) {
    err("internal-skill", `skills/${name} ${REACHED_BY_NAME.includes(name) ? "must stay model-invocable" : "must set disable-model-invocation: true"}`);
  }
  if (f["user-invocable"] !== "false") err("internal-skill", `skills/${name} must set user-invocable: false`);
}

// --- 5b. Model policy (plan item 2.6) ---

// An agent's definition is the single place its model is chosen, by alias.
// Judgement-heavy agents inherit so they are never weaker than the session.
const MODEL_ALIASES = ["inherit", "haiku", "sonnet", "opus"];
const MUST_INHERIT = ["debugger", "architecture-reviewer", "plan-reviewer"];
for (const file of agentFiles) {
  const name = file.replace(/\.md$/, "");
  const model = frontmatter(read(join(agentsDir, file)))?.fields.model;
  if (!MODEL_ALIASES.includes(model)) err("models", `agents/${file}: model must be one of ${MODEL_ALIASES.join(", ")} (found ${model || "none"})`);
  if (MUST_INHERIT.includes(name) && model !== "inherit") err("models", `agents/${file}: judgement-heavy agents use model: inherit`);
}
// Commands and skills run in the user's session on the user's model.
for (const file of commandFiles) {
  const text = read(join(commandsDir, file));
  if (frontmatter(text)?.fields.model) err("models", `commands/sk/${file}: commands must not set a model`);
  // council's seats are the one place a model is passed at dispatch (decision D3).
  if (file !== "council.md" && /^\s+model:\s*\w+/m.test(text.slice(text.indexOf("\n---", 4)))) err("models", `commands/sk/${file}: passes a model at dispatch; the agent definition sets it`);
}
for (const name of skillNames) {
  if (frontmatter(read(join(skillsDir, name, "SKILL.md")))?.fields.model) err("models", `skills/${name}: skills must not set a model`);
}

// --- 6. Plugin manifest (plan items 1.9, 2.8) ---

{
  // pkg/ is the plugin root, so an install caches only what ships.
  const manifest = JSON.parse(read(join(PKG, ".claude-plugin", "plugin.json")));
  const listed = Array.isArray(manifest.agents) ? manifest.agents : [manifest.agents];
  const expected = agentFiles.map((f) => `./.claude/agents/${f}`);
  if (JSON.stringify([...listed].sort()) !== JSON.stringify(expected)) {
    err("plugin", `pkg/.claude-plugin/plugin.json "agents" must list each agent file: ${expected.join(", ")}`);
  }
  // A set version pins users until it changes, so it must move with every release.
  const pkgVersion = JSON.parse(read(join(ROOT, "package.json"))).version;
  if (manifest.version !== pkgVersion) err("plugin", `plugin.json version ${manifest.version} does not match package.json ${pkgVersion}`);

  const marketplace = JSON.parse(read(join(ROOT, ".claude-plugin", "marketplace.json")));
  const entry = marketplace.plugins.find((p) => p.name === manifest.name);
  if (!entry) err("plugin", `marketplace.json has no entry named "${manifest.name}"`);
  else {
    if (entry.source !== "./pkg") err("plugin", `marketplace.json must install "${manifest.name}" from ./pkg (found ${JSON.stringify(entry.source)})`);
    if (entry.version) err("plugin", "marketplace.json must not set a version; plugin.json is the single source");
  }
  if (existsSync(join(ROOT, ".claude-plugin", "plugin.json"))) err("plugin", "a second plugin.json at the repository root would shadow pkg/");
}

// --- 7. Ratchets: reported so they only go down ---

{
  let emDashes = 0;
  for (const rel of listFilesRel(PKG)) if (rel.endsWith(".md")) emDashes += (read(join(PKG, rel)).match(/\u2014/g) || []).length;
  if (emDashes > 0) warn("em-dashes (3.7)", `${emDashes} in pkg/ markdown`);
  warn("listing (2.2, 2.3)", `${listingChars} characters of always-loaded command and skill descriptions`);
}

// --- 8. Dynamic checks: install, update, plugin validation ---

// stdin is empty on purpose: every run passes --yes or --dry-run, so a prompt would hang the test.
function runCli(args, cwd) {
  return spawnSync(process.execPath, [join(PKG, "cli.mjs"), ...args], { cwd, input: "", encoding: "utf-8", timeout: 120000 });
}

function scratch(fn) {
  const dir = mkdtempSync(join(tmpdir(), "sk-check-"));
  try {
    fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function snapshot(dir) {
  const out = {};
  for (const rel of listFilesRel(dir)) out[rel] = readFileSync(join(dir, rel), "latin1");
  return out;
}

const SIDECAR = ".sk-new";
const readManifest = (dir) => JSON.parse(read(join(dir, ".claude", ".sk-manifest.json")));
const writeManifest = (dir, m) => writeFileSync(join(dir, ".claude", ".sk-manifest.json"), JSON.stringify(m, null, 2) + "\n");

if (!staticOnly) {
  // init: docs/ and CLAUDE.md only. It fills gaps, never replaces a file, and is safe to re-run.
  scratch((tmp) => {
    const ownDoc = join(tmp, "docs", "README.md");
    mkdirSync(dirname(ownDoc), { recursive: true });
    writeFileSync(ownDoc, "mine\n");

    const init = runCli(["init", "."], tmp);
    if (init.status !== 0) return err("init", `cli.mjs init exited ${init.status}: ${init.stderr.trim()}`);
    for (const sub of ["commands", "skills", "agents"]) {
      if (existsSync(join(tmp, ".claude", sub))) err("init", `init copied ${sub} into the project`);
    }
    if (read(ownDoc) !== "mine\n") err("init", "init replaced a doc the project already had");
    for (const rel of listFilesRel(join(PKG, "docs"))) {
      if (!existsSync(join(tmp, "docs", rel))) err("init", `docs/${rel} was not scaffolded`);
    }
    if (!existsSync(join(tmp, "CLAUDE.md"))) err("init", "init did not create CLAUDE.md");
    const manifest = readManifest(tmp);
    if (manifest.channel !== "plugin") err("init", "manifest does not record the plugin channel");
    if (manifest.version !== JSON.parse(read(join(ROOT, "package.json"))).version) err("init", `manifest version ${manifest.version} is not the package version`);
    if ("docs/README.md" in manifest.files) err("init", "a doc the project already had was recorded as SK-managed");
    if (!manifest.files["docs/templates/task-prd.md"]) err("init", "manifest has no per-file hashes for the shipped docs");
    if (Object.keys(manifest.files).some((f) => f.startsWith(".claude/"))) err("init", "manifest lists .claude/ files");

    const before = snapshot(join(tmp, "docs"));
    const again = runCli(["init", "."], tmp);
    if (again.status !== 0 || JSON.stringify(snapshot(join(tmp, "docs"))) !== JSON.stringify(before)) err("init", "re-running init changed docs/");

    // update: refreshes untouched shipped docs, keeps edited ones with a sidecar, leaves the project's own alone.
    const edited = join(tmp, "docs", "templates", "task-prd.md");
    const untouched = join(tmp, "docs", "sop", "creating-a-task.md");
    appendFileSync(edited, "\nUSER EDIT\n");
    writeFileSync(untouched, "an older release of this SOP\n");
    const m1 = readManifest(tmp);
    m1.files["docs/sop/creating-a-task.md"] = createHash("sha256").update("an older release of this SOP\n", "latin1").digest("hex").slice(0, 16);
    m1.files["docs/sop/retired.md"] = createHash("sha256").update("old sop\n", "latin1").digest("hex").slice(0, 16);
    writeFileSync(join(tmp, "docs", "sop", "retired.md"), "old sop\n");
    writeManifest(tmp, m1);
    appendFileSync(join(tmp, "CLAUDE.md"), "\nUSER BUILD COMMANDS\n");

    const dry = runCli(["update", ".", "--dry-run"], tmp);
    if (dry.status !== 0) err("update", `dry run exited ${dry.status}: ${dry.stderr.trim()}`);
    if (!read(untouched).includes("older release")) err("update", "--dry-run wrote a file");

    const update = runCli(["update", ".", "--yes"], tmp);
    if (update.status !== 0) err("update", `update exited ${update.status}: ${update.stderr.trim()}`);
    if (read(ownDoc) !== "mine\n") err("update", "update replaced a doc the project already had");
    if (!read(edited).includes("USER EDIT")) err("update", "update overwrote an edited template");
    if (!existsSync(edited + SIDECAR)) err("update", "no sidecar was written for an edited template");
    if (read(untouched) !== read(join(PKG, "docs", "sop", "creating-a-task.md"))) err("update", "an untouched older doc was not refreshed");
    if (existsSync(untouched + SIDECAR)) err("update", "a sidecar was written for a file the user did not edit");
    if (existsSync(join(tmp, "docs", "sop", "retired.md"))) err("update", "an untouched doc SK no longer ships was not removed");
    if (!read(join(tmp, "CLAUDE.md")).includes("USER BUILD COMMANDS")) err("update", "an edited CLAUDE.md was overwritten");
    else if (!existsSync(join(tmp, "CLAUDE.sk.md"))) err("update", "an edited CLAUDE.md was kept but no CLAUDE.sk.md was written");
    for (const sub of ["commands", "skills", "agents"]) {
      if (existsSync(join(tmp, ".claude", sub))) err("update", `update copied ${sub} into the project`);
    }
    const m2 = readManifest(tmp);
    if (m2.channel !== "plugin") err("update", "update dropped the plugin channel");
    if ("docs/README.md" in m2.files) err("update", "update recorded the project's own doc as SK-managed");

    // Accepting a sidecar makes the file pristine again.
    writeFileSync(edited, readFileSync(edited + SIDECAR));
    rmSync(edited + SIDECAR);
    runCli(["update", ".", "--yes"], tmp);
    if (existsSync(edited + SIDECAR)) err("update", "a sidecar reappeared after the user accepted SK's version");

    // --force takes SK's version of an edited file.
    appendFileSync(edited, "\nUSER EDIT\n");
    runCli(["update", ".", "--yes", "--force"], tmp);
    if (read(edited).includes("USER EDIT")) err("update", "--force did not replace an edited file");
    if (existsSync(edited + SIDECAR)) err("update", "--force left a stale sidecar behind");
  });

  // migrate: a project where SK <= 2.x copied commands, agents and skills into .claude/.
  // SK's files go, the user's stay, docs/ and CLAUDE.md are untouched, and update works after.
  scratch((tmp) => {
    for (const sub of ["commands/sk", "agents", "skills"]) cpSync(join(PKG, ".claude", sub), join(tmp, ".claude", sub), { recursive: true });
    cpSync(join(PKG, "docs"), join(tmp, "docs"), { recursive: true });
    cpSync(join(PKG, "CLAUDE.md"), join(tmp, "CLAUDE.md"));
    const ownAgent = join(tmp, ".claude", "agents", "my-own.md");
    const ownTask = join(tmp, "docs", "tasks", "TASK-1.md");
    writeFileSync(ownAgent, "my agent\n");
    writeFileSync(ownTask, "my task\n");
    writeFileSync(join(tmp, ".claude", ".sk-source"), "/somewhere/sk\n");
    const edited = join(tmp, "docs", "templates", "task-prd.md");
    appendFileSync(edited, "\nUSER EDIT\n");
    // A 2.x manifest: channel files, per-file hashes, including the pre-edit hash of the edited template.
    const files = {};
    for (const sub of [".claude/commands/sk", ".claude/agents", ".claude/skills", "docs/templates", "docs/sop", "docs/reference"]) {
      for (const rel of listFilesRel(join(PKG, sub))) files[`${sub}/${rel}`] = createHash("sha256").update(read(join(PKG, sub, rel)), "latin1").digest("hex").slice(0, 16);
    }
    files["CLAUDE.md"] = createHash("sha256").update(read(join(PKG, "CLAUDE.md")), "latin1").digest("hex").slice(0, 16);
    writeManifest(tmp, { version: "2.4.0", claudeMd: "sk", profile: "full", channel: "files", files });

    const blocked = runCli(["init", "."], tmp);
    if (blocked.status === 0) err("migrate", "init ran on top of a file-copy install instead of asking for migrate");

    const migrate = runCli(["migrate", ".", "--yes"], tmp);
    if (migrate.status !== 0) return err("migrate", `cli.mjs migrate exited ${migrate.status}: ${migrate.stderr.trim()}`);
    if (existsSync(join(tmp, ".claude", "commands", "sk"))) err("migrate", ".claude/commands/sk/ was not removed");
    if (existsSync(join(tmp, ".claude", "skills", "git-worktrees"))) err("migrate", "SK's skills were not removed");
    if (!existsSync(ownAgent)) err("migrate", "a user-added agent was deleted");
    if (!existsSync(ownTask) || !read(edited).includes("USER EDIT")) err("migrate", "docs/ was not preserved");
    if (!existsSync(join(tmp, "CLAUDE.md"))) err("migrate", "CLAUDE.md was deleted");
    if (existsSync(join(tmp, ".claude", ".sk-source"))) err("migrate", ".sk-source was left behind");
    const m = readManifest(tmp);
    if (m.channel !== "plugin") err("migrate", "manifest does not record the plugin channel");
    if (Object.keys(m.files).some((f) => f.startsWith(".claude/"))) err("migrate", "manifest still lists .claude/ files");

    const again = runCli(["migrate", ".", "--yes"], tmp);
    if (again.status !== 0) err("migrate", "re-running migrate on a migrated project failed");
    const update = runCli(["update", ".", "--yes"], tmp);
    if (update.status !== 0) err("migrate", `update after migrate exited ${update.status}: ${update.stderr.trim()}`);
    if (!read(edited).includes("USER EDIT")) err("migrate", "update after migrate overwrote an edited template");
    if (!existsSync(edited + SIDECAR)) err("migrate", "update after migrate did not write a sidecar for the edited template");
  });

  // The plugin ships the CLI (pkg/cli.mjs), so /sk:scaffold runs it from the plugin
  // cache, where only the contents of pkg/ exist: no package.json, no enclosing pkg/ folder.
  scratch((cache) => {
    cpSync(PKG, cache, { recursive: true });
    scratch((tmp) => {
      const run = (args) => spawnSync(process.execPath, [join(cache, "cli.mjs"), ...args], { cwd: tmp, input: "", encoding: "utf-8", timeout: 120000 });
      const init = run(["init", ".", "--yes"]);
      if (init.status !== 0) return err("plugin-cli", `cli.mjs init from a plugin-layout copy exited ${init.status}: ${(init.stderr || init.stdout || "").trim().slice(0, 300)}`);
      if (!existsSync(join(tmp, "docs", "templates", "task-prd.md"))) err("plugin-cli", "init from the plugin copy did not scaffold docs/templates");
      if (!existsSync(join(tmp, "CLAUDE.md"))) err("plugin-cli", "init from the plugin copy did not create CLAUDE.md");
      const expectedVersion = JSON.parse(read(join(ROOT, "package.json"))).version;
      if (readManifest(tmp).version !== expectedVersion) err("plugin-cli", `manifest version is ${readManifest(tmp).version}, expected ${expectedVersion}`);
      appendFileSync(join(tmp, "docs", "templates", "task-prd.md"), "\nUSER EDIT\n");
      const update = run(["update", ".", "--yes"]);
      if (update.status !== 0) err("plugin-cli", `update from the plugin copy exited ${update.status}: ${(update.stderr || "").trim().slice(0, 300)}`);
      if (!read(join(tmp, "docs", "templates", "task-prd.md")).includes("USER EDIT")) err("plugin-cli", "update from the plugin copy overwrote an edited template");
    });
  });

  // The git-worktrees skill's setup command must actually work (plan item 1.1):
  // run the documented `git worktree add` line in a scratch repository.
  {
    const skill = read(join(skillsDir, "git-worktrees", "SKILL.md"));
    const documented = skill.match(/^\s*(git worktree add .*)$/m)?.[1];
    if (/git checkout -b/.test(skill.replace(/Do not run `git checkout -b`[^\n]*/g, ""))) {
      err("worktrees", "git-worktrees checks the branch out before adding the worktree, which git refuses");
    }
    if (!documented) err("worktrees", "git-worktrees has no `git worktree add` setup command");
    else {
      const tmp3 = mkdtempSync(join(tmpdir(), "sk-check-"));
      try {
        const git = (args, cwd) => spawnSync("git", args, { cwd, encoding: "utf-8" });
        const repo = join(tmp3, "proj");
        git(["init", "-q", "-b", "main", repo], tmp3);
        git(["-c", "user.name=sk", "-c", "user.email=sk@example.com", "commit", "-q", "--allow-empty", "-m", "init"], repo);
        const args = documented
          .replace("{project-name}", "proj")
          .replace(/\{task-name\}/g, "task")
          .replace("{base}", "main")
          .split(/\s+/)
          .slice(1);
        const added = git(args, repo);
        if (added.status !== 0) err("worktrees", `documented setup command fails: ${added.stderr.trim()}`);
        else if (git(["branch", "--show-current"], join(tmp3, "proj-task")).stdout.trim() !== "feature/task") {
          err("worktrees", "documented setup command did not create the worktree on the feature branch");
        }
      } finally {
        rmSync(tmp3, { recursive: true, force: true });
      }
    }
  }

  const claude = spawnSync("claude plugin validate . --strict", { cwd: ROOT, encoding: "utf-8", shell: true });
  if (claude.error || /not recognized|not found/i.test(claude.stderr || "")) {
    console.log("[INFO] claude CLI not on PATH -- skipped plugin validation");
  } else if (claude.status !== 0) {
    const detail = (claude.stdout + claude.stderr).split("\n").filter((l) => /❯/.test(l)).map((l) => l.replace(/[^\x20-\x7E]/g, "").trim()).join(" | ");
    err("plugin", `claude plugin validate failed: ${detail}`);
  }
}

// --- Report ---

for (const w of warnings) console.log(`[WARN] ${w}`);
for (const e of errors) console.log(`[ERROR] ${e}`);
console.log();
console.log(`${actual.commands} commands, ${actual.skills} skills, ${actual.agents} agents checked`);
if (errors.length > 0) {
  console.log(`[ERROR] ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
console.log(`[OK] no errors, ${warnings.length} warning(s)`);
