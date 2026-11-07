#!/usr/bin/env node
// scripts/eval-summary.mjs: per-skill trigger scores from `npm run evals -- --json <file>` output.
//
//   node scripts/eval-summary.mjs dev-docs/evals/baselines/wave1-haiku.json
//   node scripts/eval-summary.mjs before.json after.json     Side by side, with the change
//
// "fire" is the share of runs in which the skill was invoked when it should be;
// "quiet" is the share in which it stayed out when it should.
//
// Behaviour results (cases tagged behaviour) are summarised per case instead: the with-plugin
// score, the change against the run without the plugin, and with two files each case's
// transition (improved, regressed, stable, persistent fail). Any regression exits 1. A case
// where the plugin scores no better than the run without it does not discriminate, and is flagged.

import { existsSync, readFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// A case tagged holdout is never used to tune a description; its score is the honest one.
// Tags are not in the result file, so they are read from the case in this repository.
function isHoldout(dir) {
  const path = join(ROOT, "dev-docs", String(dir || "").replace(/\\/g, "/"), "prompt.md");
  return existsSync(path) && /^tags:.*\bholdout\b/m.test(readFileSync(path, "utf-8"));
}

function load(path) {
  const result = JSON.parse(readFileSync(path, "utf-8"));
  const skills = {};
  for (const c of result.cases) {
    const parts = String(c.dir || c.name).split(/[\\/]/);
    const skill = parts.length > 1 ? parts[parts.length - 2] : c.name;
    const kind = (c.graders || []).some((g) => g.name === "stayed-quiet") ? "quiet" : "fire";
    const runs = Array.isArray(c.arms?.with) ? c.arms.with : [];
    const row = (skills[skill] ||= { fire: [], quiet: [], fireHeld: [], quietHeld: [] });
    const bucket = isHoldout(c.dir) ? `${kind}Held` : kind;
    for (const run of runs) {
      // A run that never reached the model says nothing about the skill. Hitting the
      // turn cap or the timeout is a real outcome; an account or rate limit is not.
      if (/session limit|usage limit|rate.?limit|overloaded|authentication/i.test(run.error || "")) {
        void_runs++;
        continue;
      }
      total_runs++;
      row[bucket].push(run.score ?? 0);
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
// --- Behaviour results: one row per case ---
// A run that never reached the model (an account limit, a missing sandbox, a failed fixture)
// says nothing about SK; its graders can even "pass" on an empty workspace.
const VOID = /session limit|usage limit|rate.?limit|overloaded|authentication|sandbox|scaffold failed/i;
function loadCases(path) {
  const result = JSON.parse(readFileSync(path, "utf-8"));
  const cases = {};
  let voided = 0;
  for (const c of result.cases || []) {
    const valid = (arm) => (Array.isArray(c.arms?.[arm]) ? c.arms[arm] : []).filter((r) => {
      if (VOID.test(r.error || "")) { voided++; return false; }
      return true;
    });
    const withRuns = valid("with");
    const withoutRuns = valid("without");
    const score = withRuns.length ? mean(withRuns.map((r) => r.score ?? 0)) : NaN;
    const delta = withoutRuns.length && withRuns.length ? score - mean(withoutRuns.map((r) => r.score ?? 0)) : undefined;
    // Cost, turns and time per run: the median of the runs that reached the model.
    const median = (xs) => {
      const s = xs.filter((x) => typeof x === "number").sort((p, q) => p - q);
      return s.length ? s[Math.floor((s.length - 1) / 2)] : NaN;
    };
    const perf = (runs) => ({ cost: median(runs.map((r) => r.costUsd)), turns: median(runs.map((r) => r.turns)) });
    cases[c.name] = { score, delta, with: perf(withRuns), without: perf(withoutRuns) };
  }
  if (voided) console.log(`[WARN] ${path}: ${voided} run(s) never reached the model and are excluded.`);
  return { cases, cost: result.costUsd, partial: result.partial };
}
function isBehaviour(path) {
  const result = JSON.parse(readFileSync(path, "utf-8"));
  return (result.cases || []).some((c) => /behaviour/.test(String(c.dir || "")) || (c.tags || []).includes("behaviour"));
}
if (isBehaviour(beforePath)) {
  const PASS = 0.8;
  const b = loadCases(beforePath);
  const a = afterPath ? loadCases(afterPath) : null;
  const vsNone = (v) => (v === undefined || v === null ? "   - " : `${v >= 0 ? "+" : ""}${Math.round(v * 100)}`.padStart(5));
  let regressed = 0;
  console.log(`${"case".padEnd(30)} score  vs none${a ? "    score  vs none   transition" : ""}`);
  for (const name of [...new Set([...Object.keys(b.cases), ...Object.keys(a?.cases || {})])].sort()) {
    const x = b.cases[name];
    let line = `${name.padEnd(30)} ${x ? pct(x.score) : "  - "}  ${vsNone(x?.delta)}`;
    if (a) {
      const y = a.cases[name];
      let transition = "new";
      if (x && y) {
        const was = x.score >= PASS;
        const is = y.score >= PASS;
        transition = was && is ? "stable" : is ? "improved" : was ? "REGRESSED" : "persistent fail";
        if (was && !is) regressed++;
      } else if (!y) transition = "removed";
      line += `    ${y ? pct(y.score) : "  - "}  ${vsNone(y?.delta)}   ${transition}`;
    }
    const last = (a && a.cases[name]) || x;
    if (last && typeof last.delta === "number" && last.delta <= 0) line += "   (no better than without the plugin)";
    console.log(line);
  }
  // Performance: what a run costs with the plugin against without it, and (given two files)
  // how the cost with the plugin moved. Ratios are summarised as a geometric mean over cases.
  const geo = (xs) => {
    const v = xs.filter((x) => Number.isFinite(x) && x > 0);
    return v.length ? Math.exp(v.reduce((s, x) => s + Math.log(x), 0) / v.length) : NaN;
  };
  const signed = (r) => (Number.isFinite(r) ? `${r >= 1 ? "+" : ""}${Math.round((r - 1) * 100)}%` : "-");
  const usd = (v) => (Number.isFinite(v) ? `$${v.toFixed(3)}` : "    -  ");
  console.log(`\n${"cost per run (median)".padEnd(30)}   with  without${a ? "     with  without   change with" : ""}`);
  const ratios = { b: [], a: [], moved: [], bt: [], at: [] };
  for (const name of [...new Set([...Object.keys(b.cases), ...Object.keys(a?.cases || {})])].sort()) {
    const x = b.cases[name];
    const y = a ? a.cases[name] : undefined;
    let line = `${name.padEnd(30)} ${usd(x?.with.cost)} ${usd(x?.without.cost)}`;
    if (x) {
      ratios.b.push(x.with.cost / x.without.cost);
      ratios.bt.push(x.with.turns / x.without.turns);
    }
    if (a) {
      line += `   ${usd(y?.with.cost)} ${usd(y?.without.cost)}   ${x && y ? signed(y.with.cost / x.with.cost) : "-"}`;
      if (y) {
        ratios.a.push(y.with.cost / y.without.cost);
        ratios.at.push(y.with.turns / y.without.turns);
      }
      if (x && y) ratios.moved.push(y.with.cost / x.with.cost);
    }
    console.log(line);
  }
  let summary = `with the plugin vs without: cost ${signed(geo(ratios.b))}, turns ${signed(geo(ratios.bt))}`;
  if (a) summary += `; then cost ${signed(geo(ratios.a))}, turns ${signed(geo(ratios.at))}; cost with the plugin moved ${signed(geo(ratios.moved))}`;
  console.log(summary);
  const money = (r) => `$${r.cost?.toFixed(2)}${r.partial ? " (partial run)" : ""}`;
  console.log(`total: ${money(b)}${a ? `, then ${money(a)}` : ""}`);
  if (regressed) console.log(`[ERROR] ${regressed} case(s) regressed`);
  process.exit(regressed ? 1 : 0);
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

// Held-out cases are never used to tune a description, so they are the score to trust.
if (names.some((n) => before.skills[n]?.fireHeld?.length || after?.skills[n]?.fireHeld?.length)) {
  console.log(`\n${"held-out (the honest score)".padEnd(32)} fire  quiet${after ? "    fire  quiet" : ""}`);
  const held = { bf: [], bq: [], af: [], aq: [] };
  for (const name of names) {
    const b = before.skills[name] || {};
    let line = `${name.padEnd(32)} ${pct(mean(b.fireHeld || []))}  ${pct(mean(b.quietHeld || []))}`;
    held.bf.push(...(b.fireHeld || []));
    held.bq.push(...(b.quietHeld || []));
    if (after) {
      const a = after.skills[name] || {};
      held.af.push(...(a.fireHeld || []));
      held.aq.push(...(a.quietHeld || []));
      line += `    ${pct(mean(a.fireHeld || []))}  ${pct(mean(a.quietHeld || []))}`;
    }
    console.log(line);
  }
  console.log(`${"ALL".padEnd(32)} ${pct(mean(held.bf))}  ${pct(mean(held.bq))}${after ? `    ${pct(mean(held.af))}  ${pct(mean(held.aq))}` : ""}`);
}

if (invalid) process.exit(2);
