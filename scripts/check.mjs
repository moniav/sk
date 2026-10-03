#!/usr/bin/env node
// scripts/check.mjs: repo consistency checks for SK (dev-only, never shipped).
// Usage:
//   node scripts/check.mjs            Run every check
//   node scripts/check.mjs --static   Skip the checks that run cli.mjs or the claude CLI
//
// Errors fail the run. Warnings are known gaps scheduled in
// dev-docs/planning/2026-10-best-practices-enhancement-plan.md; each names its item.

import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, appendFileSync } from "fs";
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

// --- 1. pkg/.claude and root .claude are the same files ---

for (const sub of ["commands/sk", "agents", "skills"]) {
  const a = join(PKG, ".claude", sub);
  const b = join(ROOT, ".claude", sub);
  const aFiles = listFilesRel(a);
  const bFiles = new Set(listFilesRel(b));
  for (const rel of aFiles) {
    if (!bFiles.has(rel)) err("sync", `.claude/${sub}/${rel} missing from the root copy`);
    else if (read(join(a, rel)) !== read(join(b, rel))) err("sync", `.claude/${sub}/${rel} differs between pkg/ and root`);
    bFiles.delete(rel);
  }
  for (const rel of bFiles) err("sync", `.claude/${sub}/${rel} exists in the root copy but not in pkg/`);
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
  ".claude-plugin/plugin.json",
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

// --- 5. Invocation control (plan items 1.3, 1.4, 1.5) ---

// Commands that commit, push, publish, schedule or approve: user-invoked only.
const MUST_GATE = ["commit", "pr", "finish", "routines", "founder", "announce", "campaign", "release", "update", "migrate", "orchestrate", "kickoff", "init-docs", "council"];
for (const name of MUST_GATE) {
  const path = join(commandsDir, `${name}.md`);
  if (!existsSync(path)) continue;
  if (frontmatter(read(path))?.fields["disable-model-invocation"] !== "true") err("gating", `commands/sk/${name}.md has side effects but is model-invocable`);
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
const INTERNAL_SKILLS = ["git-commit-flow", "subtask-execution", "research", "headless-operation", "executive-meeting"];
for (const name of INTERNAL_SKILLS) {
  const path = join(skillsDir, name, "SKILL.md");
  if (!existsSync(path)) continue;
  const f = frontmatter(read(path))?.fields || {};
  if (f["disable-model-invocation"] !== "true") err("internal-skill", `skills/${name} must set disable-model-invocation: true`);
  if (f["user-invocable"] !== "false") err("internal-skill", `skills/${name} must set user-invocable: false`);
}

// --- 6. Plugin manifest lists exactly the shipped agents (plan item 1.9) ---

{
  const manifest = JSON.parse(read(join(ROOT, ".claude-plugin", "plugin.json")));
  const listed = Array.isArray(manifest.agents) ? manifest.agents : [manifest.agents];
  const expected = agentFiles.map((f) => `./pkg/.claude/agents/${f}`);
  if (JSON.stringify([...listed].sort()) !== JSON.stringify(expected)) {
    err("plugin", `.claude-plugin/plugin.json "agents" must list each agent file: ${expected.join(", ")}`);
  }
}

// --- 7. Ratchets: reported so they only go down ---

{
  let emDashes = 0;
  for (const rel of listFilesRel(PKG)) if (rel.endsWith(".md")) emDashes += (read(join(PKG, rel)).match(/—/g) || []).length;
  if (emDashes > 0) warn("em-dashes (3.7)", `${emDashes} in pkg/ markdown`);
  warn("listing (2.2, 2.3)", `${listingChars} characters of always-loaded command and skill descriptions`);
}

// --- 8. Dynamic checks: install, update, plugin validation ---

function runCli(args, cwd) {
  return spawnSync(process.execPath, [join(ROOT, "cli.mjs"), ...args], { cwd, input: "y\ny\n", encoding: "utf-8" });
}

if (!staticOnly) {
  const tmp = mkdtempSync(join(tmpdir(), "sk-check-"));
  try {
    const install = runCli(["."], tmp);
    if (install.status !== 0) err("install", `cli.mjs install exited ${install.status}: ${install.stderr.trim()}`);

    for (const sub of [".claude/commands/sk", ".claude/agents", ".claude/skills"]) {
      for (const rel of listFilesRel(join(PKG, sub))) {
        if (!existsSync(join(tmp, sub, rel))) err("install", `${sub}/${rel} was not installed`);
      }
    }
    if (!existsSync(join(tmp, ".claude", ".sk-manifest.json"))) err("install", "no manifest written");

    // Safe update (plan item 1.8): user work must survive an update.
    const editedSkill = join(tmp, ".claude", "skills", "git-worktrees", "SKILL.md");
    const ownAgent = join(tmp, ".claude", "agents", "my-own.md");
    const ownTask = join(tmp, "docs", "tasks", "TASK-1.md");
    const sharedDoc = join(tmp, "docs", "README.md");
    appendFileSync(editedSkill, "\nUSER EDIT\n");
    writeFileSync(ownAgent, "my agent\n");
    writeFileSync(ownTask, "user task\n");
    appendFileSync(sharedDoc, "\nUSER ROW\n");

    const update = runCli(["update", ".", "--from", ROOT], tmp);
    if (update.status !== 0) err("update", `cli.mjs update exited ${update.status}: ${update.stderr.trim()}`);

    if (!existsSync(ownAgent)) err("update", "a user-added agent was deleted");
    if (!existsSync(ownTask) || read(ownTask) !== "user task\n") err("update", "a user task file was changed");
    if (!read(editedSkill).includes("USER EDIT")) err("update", "a locally edited shipped skill was overwritten");
    else if (!existsSync(editedSkill + ".sk-new")) err("update", "an edited shipped skill was kept but no .sk-new sidecar was written");
    if (!read(sharedDoc).includes("USER ROW")) err("update", "a user edit to docs/README.md was overwritten");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }

  // A file that shares a name with a shipped one but predates the install is the user's.
  const tmp2 = mkdtempSync(join(tmpdir(), "sk-check-"));
  try {
    runCli(["."], tmp2);
    const manifestPath = join(tmp2, ".claude", ".sk-manifest.json");
    const collide = join(tmp2, ".claude", "agents", "debugger.md");
    if (existsSync(manifestPath)) {
      // Simulate a pre-existing user agent: drop it from the manifest, replace its content.
      const manifest = JSON.parse(read(manifestPath));
      const agents = manifest.managed?.[".claude/agents"];
      if (Array.isArray(agents)) manifest.managed[".claude/agents"] = agents.filter((f) => f !== "debugger.md");
      else if (manifest.files) delete manifest.files[".claude/agents/debugger.md"];
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
      writeFileSync(collide, "mine\n");
      runCli(["update", ".", "--from", ROOT], tmp2);
      if (read(collide) !== "mine\n") err("update", "a user agent sharing a name with a shipped agent was overwritten");
    }
  } finally {
    rmSync(tmp2, { recursive: true, force: true });
  }

  const claude = spawnSync("claude", ["plugin", "validate", "."], { cwd: ROOT, encoding: "utf-8", shell: true });
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
