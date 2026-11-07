#!/usr/bin/env node
// scripts/check-selftest.mjs: proves each static check in check.mjs fails when its rule is broken.
// Copies the repository into a temp dir, breaks one rule per case, runs check.mjs --static against
// the copy, and expects the named error. Dev-only, never shipped.

import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync, appendFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import { tmpdir } from "os";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const COPY = ["pkg", "scripts", "package.json", "CLAUDE.md", "Readme.md", ".claude-plugin", "docs"];

const edit = (dir, rel, from, to) => {
  const path = join(dir, rel);
  // A Windows checkout has CRLF line endings; anchors are written with \n.
  const text = readFileSync(path, "utf-8").replace(/\r\n/g, "\n");
  if (!text.includes(from)) throw new Error(`fixture anchor not found in ${rel}: ${from}`);
  writeFileSync(path, text.replace(from, to));
};
const addFrontmatterKey = (dir, rel, line) => edit(dir, rel, "\n---\n", `\n${line}\n---\n`);

const CASES = [
  ["secrets", (d) => edit(d, "pkg/.claude/commands/sk/init-docs.md", "**Never read secrets.**", "Secrets:")],
  ["arguments", (d) => edit(d, "pkg/.claude/commands/sk/ops.md", "**Mode:** `$ARGUMENTS`", "**Mode: $ARGUMENTS**")],
  ["frontmatter-keys", (d) => addFrontmatterKey(d, "pkg/.claude/commands/sk/recap.md", "alowed-tools: Read")],
  ["frontmatter-keys", (d) => addFrontmatterKey(d, "pkg/.claude/agents/debugger.md", "permissionMode: plan")],
  ["agent-skills", (d) => edit(d, "pkg/.claude/agents/implementer.md", "  - verification-before-completion", "  - no-such-skill")],
  ["references", (d) => appendFileSync(join(d, "pkg/.claude/commands/sk/recap.md"), "\nRead `${CLAUDE_PLUGIN_ROOT}/.claude/skills/missing/SKILL.md`.\n")],
  ["references", (d) => appendFileSync(join(d, "pkg/.claude/skills/plow-ahead/SKILL.md"), "\nSee `../no-such-skill/SKILL.md`.\n")],
  ["positional-args", (d) => appendFileSync(join(d, "pkg/.claude/commands/sk/recap.md"), "\n```bash\nawk '{print $1}' file\n```\n")],
  ["size", (d) => appendFileSync(join(d, "pkg/.claude/commands/sk/recap.md"), "\n" + "x".repeat(19 * 1024) + "\n")],
  ["preload", (d) => appendFileSync(join(d, "pkg/.claude/commands/sk/recap.md"), "\n- Deps: !`npm install || true`\n")],
  ["preload", (d) => appendFileSync(join(d, "pkg/.claude/commands/sk/recap.md"), "\n- Log: !`git log --oneline -5`\n")],
  ["hook", (d) => edit(d, "pkg/hooks/hooks.json", '"SessionStart"', '"PreToolUse"')],
  ["preload", (d) => edit(d, "pkg/.claude/commands/sk/resume.md", "Bash(cat docs/tasks/.current)", "Read")],
  ["hook", (d) => edit(d, "pkg/hooks/session-start.mjs", "For reference only:", "Resume now:")],
  ["read-only", (d) => edit(d, "pkg/.claude/commands/sk/recap.md", "still only reports", "only reports")],
];

let failed = 0;
for (const [expected, breakIt] of CASES) {
  const dir = mkdtempSync(join(tmpdir(), "sk-selftest-"));
  try {
    for (const rel of COPY) cpSync(join(ROOT, rel), join(dir, rel), { recursive: true });
    breakIt(dir);
    const run = spawnSync(process.execPath, [join(dir, "scripts", "check.mjs"), "--static"], {
      encoding: "utf-8", env: { ...process.env, SK_CHECK_ROOT: dir },
    });
    const out = run.stdout + run.stderr;
    if (run.status === 0 || !out.includes(`[ERROR] ${expected}:`)) {
      failed++;
      console.log(`[FAIL] selftest: breaking "${expected}" did not produce its error`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
console.log(failed ? `[ERROR] ${failed} of ${CASES.length} selftest case(s) failed` : `[OK] selftest: ${CASES.length} broken fixtures each caught`);
process.exit(failed ? 1 : 0);
