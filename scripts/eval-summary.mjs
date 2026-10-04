#!/usr/bin/env node
// scripts/eval-summary.mjs: per-skill trigger scores from `npm run evals -- --json <file>` output.
//
//   node scripts/eval-summary.mjs dev-docs/evals/baselines/wave1-haiku.json
//   node scripts/eval-summary.mjs before.json after.json     Side by side, with the change
//
// "fire" is the share of runs in which the skill was invoked when it should be;
// "quiet" is the share in which it stayed out when it should.

import { readFileSync } from "fs";

function load(path) {
  const result = JSON.parse(readFileSync(path, "utf-8"));
  const skills = {};
  for (const c of result.cases) {
    const parts = String(c.dir || c.name).split(/[\\/]/);
    const skill = parts.length > 1 ? parts[parts.length - 2] : c.name;
    const kind = (c.graders || []).some((g) => g.name === "stayed-quiet") ? "quiet" : "fire";
    const runs = Array.isArray(c.arms?.with) ? c.arms.with : [];
    const row = (skills[skill] ||= { fire: [], quiet: [] });
    for (const run of runs) {
      // A run that never reached the model says nothing about the skill. Hitting the
      // turn cap or the timeout is a real outcome; an account or rate limit is not.
      if (/session limit|usage limit|rate.?limit|overloaded|authentication/i.test(run.error || "")) {
        void_runs++;
        continue;
      }
      total_runs++;
      row[kind].push(run.score ?? 0);
    }
  }
  return { skills, cost: result.costUsd, partial: result.partial, voided: void_runs, scored: total_runs };
}

let void_runs = 0;
let total_runs = 0;

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
const pct = (x) => (Number.isNaN(x) ? "  - " : `${String(Math.round(x * 100)).padStart(3)}%`);

const [beforePath, afterPath] = process.argv.slice(2);
if (!beforePath) {
  console.log("usage: node scripts/eval-summary.mjs <result.json> [<after.json>]");
  process.exit(1);
}
function loadCounted(path) {
  void_runs = 0;
  total_runs = 0;
  return load(path);
}
const before = loadCounted(beforePath);
const after = afterPath ? loadCounted(afterPath) : null;

// A result where runs failed before reaching the model must not be read as a score.
let invalid = false;
for (const [label, r] of [[beforePath, before], [afterPath, after]]) {
  if (!r || r.voided === 0) continue;
  const share = r.voided / (r.voided + r.scored);
  console.log(`[WARN] ${label}: ${r.voided} of ${r.voided + r.scored} runs failed on an account or rate limit and are excluded.`);
  if (share > 0.1) {
    console.log(`[ERROR] ${label}: more than 10% of runs are void. This result is not usable; run the suite again.`);
    invalid = true;
  }
}

const names = [...new Set([...Object.keys(before.skills), ...Object.keys(after?.skills || {})])].sort();
console.log(`${"skill".padEnd(32)} fire  quiet${after ? "    fire  quiet   change in fire" : ""}`);
const totals = { bf: [], bq: [], af: [], aq: [] };
for (const name of names) {
  const b = before.skills[name] || { fire: [], quiet: [] };
  let line = `${name.padEnd(32)} ${pct(mean(b.fire))}  ${pct(mean(b.quiet))}`;
  totals.bf.push(...b.fire);
  totals.bq.push(...b.quiet);
  if (after) {
    const a = after.skills[name] || { fire: [], quiet: [] };
    totals.af.push(...a.fire);
    totals.aq.push(...a.quiet);
    const delta = Math.round((mean(a.fire) - mean(b.fire)) * 100);
    line += `    ${pct(mean(a.fire))}  ${pct(mean(a.quiet))}   ${Number.isNaN(delta) ? "" : (delta > 0 ? "+" : "") + delta}`;
  }
  console.log(line);
}
let total = `${"ALL".padEnd(32)} ${pct(mean(totals.bf))}  ${pct(mean(totals.bq))}`;
if (after) total += `    ${pct(mean(totals.af))}  ${pct(mean(totals.aq))}`;
console.log(total);
console.log(`cost: $${before.cost?.toFixed(2)}${before.partial ? " (partial run)" : ""}${after ? `, then $${after.cost?.toFixed(2)}${after.partial ? " (partial run)" : ""}` : ""}`);

if (invalid) process.exit(2);
