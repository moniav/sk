#!/usr/bin/env node
// scripts/evals.mjs: run the eval suite in dev-docs/evals/ with `claude plugin eval`.
// Every run is a real model session on your own account, so it costs money:
// pass --max-cost-usd to cap it. Extra arguments go straight to the claude CLI.
//
//   npm run evals -- --tag trigger --model haiku --runs 1 --max-cost-usd 2
//   npm run evals -- --snapshot v2.0.0 --tag trigger --json dev-docs/evals/baselines/v2.0.0-haiku.json
//
// The suite always runs against a frozen copy of the plugin, never the live tree:
// a run takes minutes, and a tree that is edited meanwhile gives a result that
// describes no real version. --snapshot <git-ref> freezes that commit instead of
// the working tree, using today's cases.
//
// See dev-docs/guides/skill-evals.md.

import { cpSync, existsSync, mkdtempSync, rmSync } from "fs";
import { delimiter, isAbsolute, join, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import { tmpdir } from "os";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CASES = join(ROOT, "dev-docs", "evals");
const env = { ...process.env };
const passthrough = process.argv.slice(2);

let snapshotRef = null;
const snapIdx = passthrough.indexOf("--snapshot");
if (snapIdx !== -1) {
  snapshotRef = passthrough[snapIdx + 1];
  passthrough.splice(snapIdx, 2);
  if (!snapshotRef) {
    console.log("[ERROR] --snapshot needs a git ref");
    process.exit(1);
  }
}

// Output paths are relative to this repository, wherever the run happens.
for (const flag of ["--json", "--report", "--output-dir"]) {
  const i = passthrough.indexOf(flag);
  const value = passthrough[i + 1];
  if (i !== -1 && value && !value.startsWith("-") && !isAbsolute(value)) passthrough[i + 1] = resolve(ROOT, value);
}

const scratch = mkdtempSync(join(tmpdir(), "sk-evals-"));
let tree = ROOT;
let worktree = null;
if (snapshotRef) {
  worktree = join(scratch, "tree");
  const add = spawnSync("git", ["worktree", "add", "--detach", worktree, snapshotRef], { cwd: ROOT, encoding: "utf-8" });
  if (add.status !== 0) {
    console.log(`[ERROR] cannot check out ${snapshotRef}: ${add.stderr.trim()}`);
    process.exit(1);
  }
  tree = worktree;
}

const copyCases = (to) =>
  cpSync(CASES, to, { recursive: true, filter: (src) => !/[\\/](results|baselines)([\\/]|$)/.test(src.slice(CASES.length)) });

// The plugin root is pkg/ (older commits: the repository root). The cases must sit
// below the plugin, so they are copied in beside it.
let cwd;
const evalArgs = [];
if (existsSync(join(tree, "pkg", ".claude-plugin", "plugin.json"))) {
  cwd = join(scratch, "plugin");
  cpSync(join(tree, "pkg"), cwd, { recursive: true });
  copyCases(join(cwd, "evals"));
} else {
  if (!worktree) {
    console.log("[ERROR] no pkg/.claude-plugin/plugin.json in the working tree");
    process.exit(1);
  }
  cwd = worktree;
  rmSync(join(cwd, "dev-docs", "evals"), { recursive: true, force: true });
  copyCases(join(cwd, "dev-docs", "evals"));
  evalArgs.push("--eval-dir", "dev-docs/evals");
}
console.log(`[INFO] evaluating ${snapshotRef || "the working tree"} from a frozen copy in ${cwd}`);

// `claude plugin eval` refuses to run with git older than 2.31, because older
// git cannot switch off a repository's hooks for the run. With no git at all it
// runs normally, so hide an old git from the child instead of failing.
const git = spawnSync("git", ["--version"], { encoding: "utf-8" });
const version = git.stdout?.match(/(\d+)\.(\d+)/);
if (version && (Number(version[1]) < 2 || (Number(version[1]) === 2 && Number(version[2]) < 31))) {
  const pathKey = Object.keys(env).find((k) => k.toLowerCase() === "path") || "PATH";
  const hasGit = (dir) => ["git", "git.exe", "git.cmd"].some((f) => existsSync(join(dir, f)));
  env[pathKey] = env[pathKey].split(delimiter).filter((dir) => dir && !hasGit(dir)).join(delimiter);
  console.log(`[INFO] git ${version[0]} is older than 2.31 -- running the evals without git on PATH`);
}

const args = ["plugin", "eval", ".", ...evalArgs, "--ablation", "none", "--no-publish", "--trust-plugin", ...passthrough];
const quoted = args.map((a) => (/[\s"]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a)).join(" ");
const run = spawnSync(`claude ${quoted}`, { cwd, env, stdio: "inherit", shell: true });

if (worktree) spawnSync("git", ["worktree", "remove", "--force", worktree], { cwd: ROOT });
rmSync(scratch, { recursive: true, force: true });
process.exit(run.status ?? 1);
