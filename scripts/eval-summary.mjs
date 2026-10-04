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
    const scores = runs.length ? runs.map((r) => r.score ?? 0) : [c.score ?? 0];
    const row = (skills[skill] ||= { fire: [], quiet: [] });
    row[kind].push(...scores);
  }
  return { skills, cost: result.costUsd, partial: result.partial };
}

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
const pct = (x) => (Number.isNaN(x) ? "  - " : `${String(Math.round(x * 100)).padStart(3)}%`);

const [beforePath, afterPath] = process.argv.slice(2);
if (!beforePath) {
  console.log("usage: node scripts/eval-summary.mjs <result.json> [<after.json>]");
  process.exit(1);
}
const before = load(beforePath);
const after = afterPath ? load(afterPath) : null;

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
