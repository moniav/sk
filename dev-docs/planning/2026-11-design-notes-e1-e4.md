# Design notes E1 to E4

> Status: proposals for decision, nothing built. Written 2026-11-07, after PR1 to PR14 of `2026-11-implementation-plan.md` landed.
> Facts about Claude Code are quoted from code.claude.com/docs (pages named in each note) and checked against Claude Code 2.1.319 where a run could show them. Where the docs are silent, the note says so.

## Summary

| Note | Question | Recommendation | Decision needed |
|------|----------|----------------|-----------------|
| E1 | Move the 55 commands to skills? | **Not now.** Commands are merged into skills, not deprecated, and the move gains nothing measurable today. Revisit on a named trigger. | Agree to defer, or schedule for 4.0 |
| E2 | Split core and company plugins? | **Stay deferred.** If it happens: separate plugin folders, the company plugin declaring `dependencies: ["sk"]`. Not `strict: false`. | Agree to keep deferred |
| E3 | Who writes a run and cost log? | **Headless runs only, from `claude -p --output-format json`, appended by the scheduler's runbook.** No hook, no transcript reader. Interactive sessions use `/usage` and OpenTelemetry. | Approve for 3.3.0, size S |
| E4 | Approve the verify-skill note? | **Approve with three changes:** evaluate it with a behaviour case, align its description with how built-in launchers look for a project skill, and drop the `remove` test. | Approve, amend or reject |

---

## E1 Commands as skills

### What the docs say now

- "**Custom commands have been merged into skills.** A file at `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md` both create `/deploy` and work the same way. Your existing `.claude/commands/` files keep working." A command file is "the older format and still works… Prefer a skill for new work." The word "deprecated" does not appear. (skills.md)
- Command files "support the same frontmatter except `name` and `paths`" (skills.md). `${CLAUDE_PLUGIN_ROOT}` is substituted in "skill, command, and agent content" (plugins/components.md).
- A plugin skill is invoked as `/<plugin>:<directory>`, a plugin command as `/<plugin>:<file>` (plugins/components.md): every `/sk:name` would survive the move.
- Outside plugins, a skill wins over a command of the same name. What happens when one plugin ships both `commands/x.md` and `skills/x/` is not documented. No SK command shares a name with an SK skill today.
- Skills can bundle files (`references/`, `${CLAUDE_SKILL_DIR}`) and take `paths`; commands cannot.

### Gains

1. Each command could carry its own `references/`, so the largest bodies (`init-docs` at 15.6 KB, `plan` at 12.1 KB) could move detail out of the always-read file. Today that detail goes in a skill the command reads, which works.
2. `paths` frontmatter, which only skills accept.
3. No context gain. SK's 49 gated commands are already off the listing (`disable-model-invocation: true`), and they would carry the same flag as skills. `npm test` measures the listing at 3,764 characters either way.

### Costs

- 55 files become 55 folders (`commands/sk/review.md` to `skills/review/SKILL.md`), each with a `name` that matches its folder.
- `scripts/check.mjs`: the counts (55 commands and 28 skills become 83 skills in six files), the gating list, the report-only list, the internal-skills list, the per-type frontmatter allowlists, the 18 KB guard and the selftest fixtures all key on the commands folder.
- Six files in `pkg/` that name a command path (`cli.mjs`, `file-structure.md`, `update-docs`, `finish`, `review`, `scaffold`), every behaviour eval that names a command file, `help.md`, the Readme, the install guide and `docs/commands-reference.md`.
- The skills folder would mix 28 rules and procedures with 55 user commands, and the distinction CLAUDE.md draws (commands are started by the user; skills are rules the model applies) would need a naming or folder convention to survive.
- A one-time risk for users: a plugin update that renames every file. Names are unchanged, so nothing they type changes, but any local copy or fork breaks.

### Recommendation

Do not move now. The docs keep commands working and the move buys one feature SK does not need yet. Revisit when either of these happens:
- the docs mark `.claude/commands/` deprecated or announce its removal, or
- a command needs bundled reference files that cannot live in a skill it reads.

If it is scheduled, do it in one PR at a major version (4.0), with `check.mjs` changed first so the move is mechanical, and keep `skills/` split by prefix or by a `kind:` convention so commands and rules stay distinguishable.

---

## E2 Core and company plugins

The idea: ship the engineering lifecycle as `sk`, and the business and executive commands (about 14: `ceo`, `cto`, `cmo`, `coo`, `founder`, `council`, `copywrite`, `campaign`, `announce`, `competitor`, `positioning`, `pricing`, `legal-scan`, `new-business-doc`) as a second plugin, so a user who wants only one does not pay for the other's listing and files.

### What the docs say now

- **`strict`** (marketplace-reference.md): "Default `true`. Whether `plugin.json` is the definitive source for the plugin's components." With `strict: false` and a `plugin.json` present, a marketplace entry that declares components makes the plugin fail to load ("`Plugin <name> has conflicting manifests`").
- **Several plugins in one repository:** yes; each is one object in the marketplace's `plugins` array, with a relative source such as `./plugins/company` (plugins/create-marketplace.md).
- **Versions:** `plugin.json`'s `version` wins over the marketplace entry's, and a set version pins the plugin until it changes (plugins/loading.md, manifest-reference.md).
- **Dependencies:** `plugin.json` accepts `dependencies` (`"name"`, `"name@marketplace"`, or an object with a semver range); dependencies within the same marketplace need no extra setting (plugins/dependencies.md). This did not exist when the research was done, and it changes the answer.

### Options

| | A: one tree, `strict: false` entries | B: separate plugin folders |
|---|---|---|
| Layout | One `pkg/`; the marketplace lists two entries that each name their components | `pkg/` (core) and `pkg-company/`, each with its own `plugin.json` |
| Versions | Move to the marketplace entries; `plugin.json` must stop declaring components | One `version` per `plugin.json`; `check.mjs --release` checks each folder |
| Shared skills | Both entries can point at the same skill folders | The company plugin declares `dependencies: ["sk"]` and reads core skills by name; shared files are not duplicated |
| Risk | A component declared in both places stops the plugin loading; every `plugin.json` check in `check.mjs` changes meaning | Two releases to keep in step; a company command that reads a core file by path breaks if core is absent, so dependencies must be declared |

### Recommendation

Stay deferred: nobody has asked for half of SK, and the business commands cost no listing space today (all gated). If the split is wanted later, take **B**: it keeps `plugin.json` authoritative, which `check.mjs` and `claude plugin validate` already rely on, and the new `dependencies` field removes the old reason to prefer A (sharing files between plugins).

---

## E3 Run and cost log

The question: SK's routines and headless runs (`/sk:routines`, the `headless-operation` skill) produce reports, but no record of what each run cost, how long it took or whether it failed. Who should write that record?

### What the docs and a real run say

- `claude -p --output-format json` returns `total_cost_usd` and "a per-model cost breakdown" (headless.md). A real run on 2.1.319 returned, among others: `total_cost_usd`, `num_turns`, `duration_ms`, `duration_api_ms`, `usage`, `modelUsage`, `session_id`, `is_error`, `subtype`, `stop_reason`, `permission_denials`.
- Transcripts live at `~/.claude/projects/<project>/<session-id>.jsonl`, and "the entry format is internal to Claude Code and changes between versions, so scripts that parse these files directly can break on any release" (sessions.md). They do hold per-message token usage today.
- `SessionEnd` gets `transcript_path` and a `reason`, no cost; `Stop` fires per turn with no cost (hooks.md). The research found a Stop-hook logger writing thousands of empty rows (ECC).
- Interactive sessions already have `/usage` (aliases `/cost`, `/stats`; dollar figures "computed locally from token counts at list price", costs.md), the status line's `cost.*` fields, and OpenTelemetry metrics `claude_code.cost.usage` and `claude_code.token.usage` (monitoring-usage.md). Whether those work under `-p` is not documented.

### Options

| Writer | Verdict |
|--------|---------|
| A hook (`Stop` or `SessionEnd`) | Rejected: no cost in the payload, per-turn firing, and a hook in every session for a few scheduled runs |
| A report-only command that reads transcripts | Rejected: the docs call the format internal and unstable, so it would break on any release |
| The scheduler's runbook, from the `-p` result | **Recommended**: documented fields, written once per run, nothing runs in interactive sessions |

### Recommendation

For 3.3.0, size S:
- `/sk:routines` writes runbooks that call `claude -p … --output-format json`, keep the JSON, and append one line per run to `docs/reviews/runs.jsonl`: date, command, `total_cost_usd`, `num_turns`, `duration_ms`, `is_error`, `session_id`. The runbook shows the line for `jq` and for PowerShell (`ConvertFrom-Json`), so it stays language-neutral.
- `/sk:recap` and `/sk:retro` read `runs.jsonl` when it exists: cost and failure counts per routine for the period, counted, never estimated.
- Interactive sessions: SK writes nothing and points to `/usage` and, for teams, OpenTelemetry.

Open point: whether `/usage` or OpenTelemetry metrics work in `-p` runs. If metrics do, a team with a collector already has this, and the runbook line stays only for teams without one.

---

## E4 Verify skill

`2026-10-verify-skill-design-note.md` proposes `/sk:verify-setup`: it writes a project-owned skill at `.claude/skills/verify/SKILL.md` (launch, health check, drive, teardown, feature map), runs it once, and hands over with each step's proof. Its six decisions (V1 to V6) and its risks still hold. Three things changed since it was written.

1. **It can be evaluated now.** The note assumed it could only be hand-tested. The behaviour suite now runs with Bash in a sandbox on Linux (PR3 onwards). A fixture with a few-line HTTP server can check that the command finds the start script, writes the five sections, starts the server, gets the health check, stops it, and marks a step it could not run as `untested`. The hand test in two real projects stays for UI apps.
2. **Built-in launchers look for a project skill first.** The Claude Code build this was written in (2.1.319, cloud) ships a `run` skill whose description says it "first looks for a project skill that already covers launching the app". That is not in the docs pages read for these notes, so it is not relied on. But it argues for a generated description that says plainly it covers launching, driving and stopping the app, so any launcher finds it.
3. **There is no `remove` any more.** Since ADR-003 the plugin is the only channel and the scaffold script has `init`, `update` and `migrate`, none of which touch `.claude/`. The planned regression test shrinks to "`update` and `migrate` leave `.claude/skills/verify/` alone".

### Recommendation

Approve with those three changes, as its own minor release after 3.3.0 (size M). The behaviour case is written first and must fail without the command.
