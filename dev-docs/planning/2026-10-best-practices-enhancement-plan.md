# Best-Practices Enhancement Plan (post-v2.0.0)

> **Status 2026-10-03:** Wave 1 implemented on branch `feat/best-practices-wave-1` (not yet merged or released). Waves 2 to 4 not started. All fourteen decisions settled by the maintainer the same day.
> Source: a review of all 23 skills, 53 commands and 8 agents against Anthropic's current docs, plus three external skill repos.
> Revised the same day to add safe update (1.8), the plugin manifest fix (1.9), the model policy (2.6) and deployment (2.8).
> Every item names the files it touches and a check that proves it is done.

## Sources

| Source | Revision | Used for |
|--------|----------|----------|
| [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) | fetched 2026-10-03 | description rules, 500-line limit, reference depth, evals |
| [Claude Code skills reference](https://code.claude.com/docs/en/skills) | fetched 2026-10-03 | frontmatter fields, listing budget, compaction limits |
| [Claude Code subagents](https://code.claude.com/docs/en/sub-agents) | fetched 2026-10-03 | agent frontmatter, `skills:` preload, `maxTurns` |
| [Model configuration](https://code.claude.com/docs/en/model-config), [Choosing a model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model), [Cost and intelligence](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence) | fetched 2026-10-03 | model policy, effort, alias behaviour |
| [Plugin manifest](https://code.claude.com/docs/en/plugins-reference), [Publish](https://code.claude.com/docs/en/plugins/publish), [Host a marketplace](https://code.claude.com/docs/en/plugins/host-marketplace) | fetched 2026-10-03 | deployment, versioning, path variables |
| [mattpocock/skills](https://github.com/mattpocock/skills) | `d81f3a1` | brevity, completion criteria, invocation rules, router, retro |
| [cursor/plugins pstack](https://github.com/cursor/plugins/tree/main/pstack) | `23e4138` | reply contracts, blinded evals, evidence ladder, unslop |
| [michaelshimeles/skills](https://github.com/michaelshimeles/skills) | `4b72f46` | worktree flow, evidence protocol |

## Principles for this plan

1. **Fix what is broken before improving what works.**
   Wave 1 is bugs and permissions only.
2. **Measure before rewriting.**
   The eval harness (Wave 2) lands before the content rewrite (Wave 3), so description and length changes are compared against a baseline.
3. **Every edit lands in both `pkg/.claude/` and root `.claude/`.**
   A sync check (item 1.7) enforces this from Wave 1 onward.
4. **Shorter is the default direction.**
   A sentence stays only if it changes behaviour versus the model's default.
5. **Borrowed text keeps its provenance.**
   Anything adapted from the three repos (all MIT) is noted in the file and in `CHANGELOG.md`.

## Decisions (settled 2026-10-03)

All fourteen were put to the maintainer and answered.
All fourteen follow the recommendation.
The `D` labels are the ones the items below refer to.

| # | Label | Decision | Outcome | Applies in |
|---|-------|----------|---------|------------|
| 1 | D1 | Which commands may the model invoke on its own? | Only `debug`, `resume`, `task-status`, `new-task`, `plan`, `review`. All others are gated. | 1.4, 2.2 |
| 2 | | A shipped file the user edited, on update | Keep the user's file; write the new version beside it as `<name>.sk-new`. | 1.8 |
| 3 | | Report-only commands | Blocked from editing with `disallowed-tools`; `Write` allowed only where a report is saved. | 1.3 |
| 4 | D6 | Primary install channel | The plugin. The npm file-copy channel is kept for projects that need a pinned version. | 2.8 |
| 5 | | Plugin version | Set, equal to `package.json`, bumped by `/sk:release`. | 2.8 |
| 6 | | Agent model policy | By role: `inherit` for judgement-heavy, `sonnet` for bounded, `haiku` for mechanical. | 2.6 |
| 7 | | `effort` in frontmatter | Not set until evals exist; then tested on `task-status` and `resume`. | 2.6 |
| 8 | | Eval tooling | Built-in `claude plugin eval` first; custom harness only for what it cannot do. | 2.1 |
| 9 | | Plan review | Split into a separate `plan-reviewer` agent. | 2.5 |
| 10 | D2 | TDD strictness | Escape hatch added: skip only when impractical, with a named alternative check and its output. | 3.5 |
| 11 | D5 | Plain-writing rules | Content, filler and plain-speech rules ship as defaults. Style rules (sentence-case headings, straight quotes, colon use, bold use) ship as an optional section. | 3.6 |
| 12 | | Em dash cleanup | Sentence by sentence: `pkg/docs/` templates first, other files as they are edited. | 3.7 |
| 13 | D3 | Council | Personas kept; a different model per seat; the report shows where seats agree. | 4.7 |
| 14 | D4, D7 | Breaking structural changes | No skill renames before v3.0. Commands become skill folders only after the plugin is primary, and only in v3.0. | 4.9 |

Not decided, no deadline: stable and latest release channels, submission to Anthropic's directory, and the generated verify skill (4.6), which needs a design note first.

---

## Wave 1: Correctness and safety (target v2.0.1)

Small, independent fixes.
No behaviour change for users beyond fewer silent approvals.

### Wave 1 status: implemented

Every item is committed on `feat/best-practices-wave-1`, one commit per item, and `npm test` passes with no errors.
Remaining work for v2.0.1: merge, bump the version, rename the changelog's `Unreleased` heading, tag, run `npm run baselines`, publish.

What differs from the item text below:

- **1.3:** eight of the nine commands disallow `Edit` and `NotebookEdit` but keep `Write`, because a headless run saves its report in the same turn. `task-status` writes nothing and disallows all three.
  The restriction clears on the next user message, so "fix this" follow-ups still work.
- **1.7:** gaps that belong to later waves (relative `references/` paths, reference files with no contents list, em dashes, listing size) are reported as warnings naming their item, so the script can pass after Wave 1.
  A `scripts/sync.mjs` (`npm run sync`) was added: edit `pkg/.claude/` only, then mirror it into the dogfood copy.
- **1.8:** three additions beyond the item text.
  `pkg/.sk-baselines.json`, generated by `scripts/baselines.mjs` from the release tags, holds the hash of every released version of each file, so an install from before per-file hashes upgrades cleanly instead of treating every changed file as a user edit.
  A `--force` flag takes SK's version of every managed file.
  An SK-created `CLAUDE.md` is refreshed only until the user edits it; before this fix an update discarded build commands the user had filled in.
  The customisation rule is in the README and the update command, not in `pkg/CLAUDE.md`, which is at 99 of its 100 lines.
- **1.9:** verified in a real headless session that all eight agents load as `sk:<name>`.
  `claude plugin details` reports "Agents (0)" for any agent declared in the manifest, including in a minimal test plugin, so that command cannot be used as the acceptance check.

Carried forward:

- **For 2.2:** `disable-model-invocation` also stops a skill from being preloaded into scheduled tasks.
  Before gating `docs-audit`, `deps`, `debt`, `retro` and `review`, confirm that a routine whose prompt is "Run /sk:<command> headless" still runs them.

### 1.1 Fix the `git-worktrees` setup sequence (bug, reproduced)

The skill runs `git checkout -b feature/x` and then `git worktree add ../dir feature/x`.
Git refuses with `fatal: 'feature/x' is already checked out`.

- **Change:** one command, `git worktree add <dir> -b <branch> <base>`.
  Add a "harness-managed worktrees" note: when Claude Code creates the worktree (for example `isolation: worktree` in `/sk:orchestrate`), skip manual create and remove.
  Cleanup uses `git branch -D` with the reason (squash and rebase merges make `-d` refuse).
  Add the shared-resource warning: ports, databases and lockfiles are not isolated.
- **Files:** `skills/git-worktrees/SKILL.md`.
- **Done when:** the documented commands run clean in a scratch repo, kept as a regression script under `dev-docs/` (see 1.7).

### 1.2 Narrow `allowed-tools` grants

Current grants pre-approve destructive commands.
`Bash(git:*)` covers `git push --force` and `git reset --hard`.
`Bash(gh:*)` covers `gh pr merge` and `gh repo delete`.
`deps` pre-approves `npm:*`, `pip:*`, `cargo:*`, `go:*`, `poetry:*`, which covers publish and install.

- **Change:** list read-only subcommands only, in current space syntax.
  Example for analyzers: `Bash(git diff *) Bash(git log *) Bash(git status *) Bash(git show *) Bash(git rev-parse *) Bash(date *)`.
  Example for `deps`: `Bash(npm audit *) Bash(npm outdated *) Bash(npm ls *)` and the equivalents per ecosystem.
  `pr`: `Bash(gh pr create *) Bash(gh pr view *)` plus the git read set.
- **Files:** the 11 commands that set `allowed-tools`.
- **Done when:** no `allowed-tools` line contains a bare `tool:*` or `tool *` wildcard at the binary level; a grep in the check script (1.7) fails on one.

### 1.3 Make report-only commands actually read-only

`allowed-tools` only skips prompts; it does not remove tools.

- **Change:** add `disallowed-tools: Edit Write NotebookEdit` to commands that must not modify the project.
  Commands that save a report keep `Write` and state the one directory they may write to.
- **Files:** `code-review`, `perf-review`, `security-review`, `ui-review`, `docs-audit`, `debt`, `recap`, `task-status`, `review`.
- **Done when:** each of those commands either lists `disallowed-tools` or names its single output directory in the first 20 lines.

### 1.4 Gate side-effecting commands

Only 7 of 53 commands set `disable-model-invocation: true`.
The model can currently invoke `/sk:commit`, `/sk:pr`, `/sk:finish` and `/sk:routines` unprompted.

- **Change:** gate every command that commits, pushes, publishes, schedules or approves.
  Minimum set: `commit`, `pr`, `finish`, `routines`, `founder`, `announce`, `campaign`.
  The full set follows decision D1 and lands in Wave 2 (item 2.2).
- **Done when:** the listed commands carry the flag, and a manual check confirms `/sk:finish` still runs its flow (it reads `git-commit-flow` by path, not through the Skill tool).

### 1.5 Hide internal skills from the `/` menu

`git-commit-flow`, `subtask-execution`, `research`, `headless-operation` and `executive-meeting` are loaded by commands, never by hand.
They still appear as `/subtask-execution` and so on.

- **Change:** add `user-invocable: false` alongside the existing gate.
- **Done when:** `/skills` in a test install lists none of the five.

### 1.6 Fix internal contradictions and drift

- `subtask-execution`: the execution order says a `[TEST]` subtask must go red first; the per-type checklist says "Run tests, confirm they pass".
  Make the checklist say red.
- `.claude-plugin/plugin.json` says "48 commands, 22 skills"; `package.json` says 53 and 23.
  Derive both from one count.
  (The missing `version` field is deliberate during the experimental phase, per `plugin-split-plan.md`; it is set in item 2.8.)
- `subtask-execution` hard-codes camelCase, `is/has` prefixes and import order.
  Replace with "follow `docs/conventions/code-style.md`; if empty, match the surrounding code".
- **Done when:** the count check in 1.7 passes and the two skills read consistently.

### 1.7 Add a zero-dependency check script

SK has no automated test.
`node cli.mjs /tmp/sk-test` is manual.

- **Change:** `scripts/check.mjs` (Node >= 18, no dependencies, not shipped) that fails on:
  - any difference between `pkg/.claude/` and root `.claude/`;
  - command, skill and agent counts in `package.json`, `plugin.json`, `Readme.md` and root `CLAUDE.md` that do not match the file system;
  - frontmatter missing `description`, `name` over 64 characters, description over 1,024 characters;
  - a skill body over 500 lines, or a reference file over 100 lines with no contents list;
  - a relative `references/` path used in a shell command without `${CLAUDE_SKILL_DIR}`;
  - a binary-level wildcard in `allowed-tools`;
  - an install into a temp dir that does not produce the expected file set;
  - an update over a temp install that loses a locally edited file, a same-named user file, or a user row in a shared doc (the three cases in 1.8);
  - `claude plugin validate` errors, when the `claude` CLI is on the PATH (skipped with a notice otherwise).
- **Files:** `scripts/check.mjs`, `package.json` (`"test": "node scripts/check.mjs"`), root `CLAUDE.md` build commands.
- **Done when:** `npm test` exits non-zero on current `main` for the known drift, then zero after 1.1 to 1.6.

### 1.8 Safe update

`npx shipkit-cld update` overwrites SK-managed directories wholesale.
A test in a scratch project showed three silent losses: a local edit to a shipped skill, a user's own agent that shares a name with an SK agent, and a row the user added to `docs/README.md`.
User files with their own names, and everything under `docs/tasks/`, were kept.

- **Change:**
  - The manifest records a content hash per shipped file.
  - On update, a file whose current hash differs from the recorded one was edited by the user: keep it and write the new version beside it as `<name>.sk-new`, the same sidecar pattern `CLAUDE.md` already uses.
  - A file that exists but is not in the manifest is the user's: never overwrite it, warn instead.
  - `docs/README.md` and `docs/conventions/coding-behavior.md` follow the hash rule instead of being replaced.
  - New flags: `--dry-run` prints what would be overwritten, kept, written as a sidecar and pruned; `--yes` skips the prompt for unattended runs.
  - After updating, print the changelog's upgrade notes between the installed and the new version.
  - Installs made before hashes existed have no baseline: treat every differing file as user-edited on the first hashed update, and say so in the output.
- **Customisation rule (documented in `pkg/CLAUDE.md` and the README):** shipped files belong to SK; project-specific behaviour goes in files SK never touches (`docs/conventions/`, `docs/business/brand-voice.md`, and the user's own skills and agents under their own names).
- **Files:** `cli.mjs`, `commands/sk/update.md`, `Readme.md`.
- **Done when:** the three loss cases are regression tests in `check.mjs` and pass.

### 1.9 Fix the plugin manifest

`claude plugin validate .` fails today with `agents: Invalid string: must end with ".md"`.
The manifest points `agents` at a directory; only individual `.md` files are accepted.
The experimental plugin channel advertised in the README is therefore probably not loading.

- **Change:** list each agent file in `plugin.json`.
  Keep the list generated from the file system by `check.mjs` so it cannot drift.
- **Done when:** `claude plugin validate .` passes, and a real install from the marketplace in a scratch project shows every command, skill and agent in `claude plugin details sk`.

---

## Wave 2: Discovery and loading (target v2.1.0)

The model can only use a skill whose description it can see.
In a real session the descriptions of SK's ten model-invoked skills were dropped from the listing; only their names remained.

### 2.1 Build the eval harness first

Adapted from pstack's `playbooks/eval.md`.
Lives in `dev-docs/guides/skill-evals.md` plus `dev-docs/evals/`; never shipped.
Before building anything custom, evaluate Claude Code's built-in `claude plugin eval` (cases in an `evals/` folder, or the path in `experimental.evals`).
Use it if it can express trigger checks and rubric scoring across models; build the custom harness only for what it cannot do.

- **Trigger evals:** for each model-invoked skill, at least three prompts that should fire it and two that should not.
- **Behaviour evals:** for the core loop (`dev`, `test`, `debug`), one organic task each with a rubric of 3 to 6 checkable criteria.
- **Blinding rules:** the candidate prompt reads like a user request; no "eval", "rubric" or "test" in any path or prompt it sees; skill use is graded from which files the transcript shows were opened, not from self-report.
- **Models:** run on Haiku, Sonnet and Opus, because `subagent-driven-development` dispatches to Haiku.
- **Done when:** a baseline run on v2.0.1 is saved under `dev-docs/evals/baseline-2.0.1/`.

### 2.2 Decide and apply invocation for every command

- **Change:** apply decision D1.
  Gated commands get a plain one-line human-facing description.
  The few model-invoked commands get a trigger-first description.
  Remove the "(project)" suffix everywhere.
- **Done when:** the combined length of all always-loaded descriptions (commands plus skills) is recorded in `check.mjs` output and is at least 60% lower than the v2.0.1 baseline.

### 2.3 Rewrite the ten model-invoked skill descriptions

- **Change:** 200 to 300 characters each, trigger first, third person, one trigger per distinct case.
  Drop the lists of `/sk:` command names.
  `verification-before-completion` and `escalation-rules` are currently written as orders; rewrite as descriptions.
- **Done when:** trigger evals from 2.1 score at least as well as baseline on all three models, and descriptions survive in the listing of a session that also has a second large skill pack installed.

### 2.4 Make paths work in both install channels

The plugin docs confirm that `${CLAUDE_PLUGIN_ROOT}` resolves anywhere in command, skill and agent markdown.
That settles the open question in `plugin-split-plan.md` and replaces the dual-resolution wording considered there.

- **Change:**
  - A skill's own bundled files: `${CLAUDE_SKILL_DIR}/references/...` (fixes `create-pdf`, `copywriting`, `legal-advisor`, `technical-diagrams`, TDD).
    This works unchanged in both channels.
  - Cross-file references (a command reading a shared skill): written once in `pkg/` as `${CLAUDE_PLUGIN_ROOT}/.claude/skills/<name>/SKILL.md`.
    For the npm channel, `cli.mjs` rewrites that prefix to `.claude/` as it copies each file.
    Root `.claude/` (the dogfood copy) is produced by the same rewrite, and `check.mjs` compares after the rewrite.
  - Agents: dispatch by name ("the `spec-reviewer` agent"), not by file path.
  - Model-invoked skills: "Call the Skill tool with `<name>`", one call per skill.
    The Skill tool cannot reach a gated skill, so gated shared skills are always read by path.
- **Files:** all commands and skills with `.claude/` path references; `cli.mjs`; update `plugin-split-plan.md` to record the ruling.
- **Done when:** a plugin install and an npm install each run `/sk:new-task` then `/sk:dev` end to end with no "file not found", and no shipped file contains a bare `.claude/skills/` or `.claude/agents/` path.

### 2.5 Agent hygiene

- Split plan review out of `spec-reviewer` (Haiku) into a new `plan-reviewer` agent on `inherit`.
  Code-versus-spec checking suits Haiku; attacking a plan does not.
- `implementer`: add `skills: [test-driven-development, verification-before-completion]`; remove the path reference.
- Models follow the policy in 2.6.
- Add `maxTurns` to the five reviewers and `dependency-analyzer`.
- Do not add `memory:` to reviewers; it grants Write and Edit and breaks their read-only guarantee.
- **Done when:** `/sk:plan` dispatches `plan-reviewer`, and agent count is updated everywhere (9).

### 2.6 Model policy

Anthropic's guidance: effort is often a better lever than switching models, the choice should be measured with evals, and a multi-model setup must beat the single model's own effort curve.
For subagents the resolution order is: value passed at dispatch, then agent frontmatter, then the user's `CLAUDE_CODE_SUBAGENT_MODEL`, then the session model.
Two consequences today: a pinned agent can be weaker than the user's session (the `debugger` on Sonnet under an Opus or Fable session), and pinned frontmatter overrides the user's own subagent default.

- **Commands and skills:** never set `model`.
  They run in the user's session on the model the user chose, and an override is silently ignored where an organisation restricts models.
- **Agents, by role, aliases only (never model IDs):**

  | Role | Agents | Setting |
  |------|--------|---------|
  | Judgement-heavy | `debugger`, `architecture-reviewer`, `plan-reviewer` | `inherit` |
  | Bounded | `implementer`, `quality-reviewer`, `security-reviewer`, `perf-reviewer` | `sonnet` |
  | Mechanical | `spec-reviewer`, `dependency-analyzer` | `haiku` |

- **Single source:** agent frontmatter.
  Remove the `model:` lines passed at dispatch in `orchestrate.md` and `council.md`, and the model table in `subagent-driven-development`.
  `council.md` seats are settled under decision D3.
- **Dynamic part, escalate on failure:** when a subtask fails review twice or returns `NEEDS_CONTEXT`, re-dispatch it one tier up using the dispatch-time override.
  This is the only permitted override and lives in `escalation-rules`.
- **Size rule:** subtasks of an XS or S task with exact file paths may start the implementer on `haiku`; everything else starts on `sonnet`.
- **Effort:** not set in frontmatter in this wave.
  After the 2.1 baseline exists, test `effort: low` on `task-status` and `resume` and keep it only if evals hold.
- **User control (README):** `CLAUDE_CODE_SUBAGENT_MODEL` with `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` runs every SK agent on one model; Claude Code's advisor setting suits users who want a cheaper session with a stronger model to consult.
  Note that aliases resolve to older models on Bedrock, Vertex and Foundry.
- **Done when:** grep for a model name in `commands/` and `skills/` returns only the escalation rule, and behaviour evals on the three tiers are recorded.

### 2.7 Command ergonomics

- Add `argument-hint` to every command that accepts arguments.
- Place `$ARGUMENTS` where it is used rather than relying on the appended fallback.
- **Done when:** `check.mjs` reports no command that mentions arguments in its body without a hint.

### 2.8 Deployment: plugin as the primary channel (decision D6)

Commands, skills and agents ship as a Claude Code plugin; the npm CLI scaffolds `docs/` and `CLAUDE.md`.
With the plugin, a project holds no SK files, so updates cannot overwrite user work and a team shares SK through one settings entry.
The trade-off is one plugin version per user; projects that need a pinned version keep the npm channel.

- **Make `pkg/` the plugin root.**
  The marketplace entry uses `"source": "./"`, which copies the whole repository, including `dev-docs/` and the duplicate root `.claude/`, into every user's plugin cache.
  Move `plugin.json` to `pkg/.claude-plugin/` and set the entry's source to `./pkg`.
  `cli.mjs` must not copy `.claude-plugin/` into projects.
- **Set `version`** in `plugin.json`, equal to `package.json`, bumped by `/sk:release`.
  Without it users track every commit on `main`; with it they move only on a release.
  Do not also set it on the marketplace entry.
- **`npx shipkit-cld init [--minimal]`:** scaffolds `docs/` and `CLAUDE.md` only.
  `install`, `update` and `remove` stay for the file-copy channel.
- **README and install guide:**
  - plugin install: `claude plugin marketplace add moniav/sk`, then `claude plugin install sk@shipkit`, then `npx shipkit-cld init`;
  - auto-update is off by default for third-party marketplaces: enable it under `/plugin` > Marketplaces, or run `claude plugin update sk@shipkit`;
  - team setup: `claude plugin marketplace add moniav/sk --scope project` and commit the settings file;
  - migration from a file-copy install: `npx shipkit-cld remove` (keeps `docs/`), install the plugin, run `init` to fill gaps;
  - "pick one channel": installing both gives every command twice.
- **CI:** `claude plugin validate . --strict` on every push.
- **Done when:** validation passes strictly, the plugin cache of a fresh install contains only `pkg/`, a version bump is what delivers an update to an installed user, and the full lifecycle (`new-task`, `plan`, `dev`, `test`, `finish`) runs from a plugin-only install.

---

## Wave 3: Content quality and proof (target v2.2.0)

Guarded by the Wave 2 evals: no rewrite merges if behaviour evals regress.

### 3.1 The no-op pass

For each sentence: does it change behaviour versus the model's default?
If not, delete the whole sentence.

- **Order:** `council` (395 lines), `legal-scan` (320), `orchestrate` (305), `init-docs` (302), `update-docs` (275), `brainstorm` (259), `deps` (239), `refactor` (233), `perf-review` (222), `debug` (210); then `copywriting`, `technical-writing`, `context-priming`.
- **Target:** no command over 200 lines; non-negotiable rules and exit gates in the first 5,000 tokens, because that is all that survives compaction.
- **Done when:** line counts are recorded before and after in the changelog, and behaviour evals hold.

### 3.2 Split `legal-advisor` and stop command and skill duplication

- `legal-advisor/SKILL.md` becomes a router: sub-command table, scan steps, constraints at the top.
  Each sub-command and the `docs/legal/` index format move to `references/`.
  Grep patterns live only in `references/detection-signals.md`.
- `legal-scan`, `ops`, `copywrite`: the command owns arguments, intake and output location; the skill owns the method.
- Add a contents list to `detection-signals.md` and `svg-elements.md`.
  Move TDD's `anti-patterns.md` into `references/`.
- **Done when:** `legal-advisor/SKILL.md` is under 120 lines and no paragraph appears in both a command and its skill.

### 3.3 Checkable completion criteria and reply contracts

- Every phase gate is rewritten as something the model can show it met.
  Model: mattpocock's `diagnosing-bugs`, where phase 1 is done only when one named command has already been run and goes red on this bug.
- Every command ends with a `**Reply:**` line naming what the final message must contain.
- Multi-step commands instruct: copy the steps into the todo list verbatim; a skipped step stays as `skip: <reason>`.
- **Files:** `debug`, `dev`, `test`, `implement`, `refactor`, `migrate`, `finish`, `plan`, and the `debugger` agent first; the rest follow.
- **Done when:** each listed command has a reply contract and no gate uses "understand", "review" or "ensure" without an observable.

### 3.4 Evidence protocol

Merges pstack's evidence ladder with michaelshimeles's evidence protocol into `verification-before-completion` and `/sk:test`.

- **Ladder:** stated, pointed at the line, walked the failure, ran it, reproduced in the running app.
  Each claim and each reviewer finding says which rung it reached.
- **Three states:** `passed`, `failed`, `untested` with a reason.
  Nothing is skipped silently.
- **Before first:** for a bug fix, capture the failure before writing the fix.
- **Stamp:** every report names the commit and branch tested.
- **Non-UI evidence:** measured numbers, output pairs, transcript excerpts.
- No recorder or uploader is shipped; the protocol is tool-neutral.
- **Files:** `skills/verification-before-completion`, `commands/sk/test.md`, the five reviewer agents, `docs/templates` test-report template if present.
- **Done when:** a `/sk:test` run on a sample task produces a report with all three states possible and a commit stamp.

### 3.5 TDD adjustments (decision D2)

- Add the escape hatch with its required alternative evidence.
- Add two anti-patterns from mattpocock: tautological tests (expected value recomputed the way the code does) and horizontal slicing (all tests first, then all code).
- Label the `npm test` examples as illustrations and add one non-Node example.
- **Done when:** `implementer` no longer says "Do NOT skip TDD" without the hatch, and TDD evals hold.

### 3.6 Writing rules reference (decision D5)

- Add `skills/technical-writing/references/plain-writing-rules.md`, adapted from pstack `unslop` (MIT, provenance noted), with stable rule numbers.
- `technical-writing` drops its generic advice and points to it.
  `copywriting`, `/sk:pr`, `/sk:changelog`, `/sk:announce` point to it too.
  `docs/business/brand-voice.md` overrides it.
- The content, filler and plain-speech rules are defaults.
  The style rules (sentence-case headings, straight quotes, colon use, bold use) sit in a separate optional section that a project turns on through `brand-voice.md`.
- Because the straight-quote rule is optional, `create-pdf` keeps converting straight quotes to curly.
  State in `create-pdf` that this is a rendering step applied to PDF output, never to source files.
- **Done when:** the five consumers reference one file, none restates its rules, and `pkg/docs/` templates pass the default rules.

### 3.7 Em dash cleanup in shipped text

`pkg/` contains 1,810 em dashes across 144 of 154 markdown files, 293 of them in doc templates copied into user projects.

- **Change:** rewrite each sentence properly (comma, colon, full stop or restructure); never a blind character swap.
  Templates under `pkg/docs/` first.
  Other files are cleaned as they are substantially edited in 3.1 to 3.6, not reflowed wholesale.
- **Done when:** `pkg/docs/` has zero, and `check.mjs` reports the remaining count so it only goes down.

---

## Wave 4: New capabilities (target v2.3.0)

Each is independent and can be dropped without affecting the others.

### 4.1 `/sk:help` router

One user-invoked command that maps situations to commands and shows the main flow (brainstorm, new-task, plan, dev, test, finish) with its on-ramps.
Costs no per-turn context.
It must be updated whenever a command is added or renamed; `check.mjs` fails if a command is not mentioned in it.

### 4.2 `/sk:retro` improves the environment

- Mechanical mistake: propose a lint rule, hook or CI check, not more prose.
- Judgement call: propose a line in the conventions the reviewer enforces.
  Standards are enforced by `quality-reviewer`, not by the implementer, which has the most context pressure.
- Findings are routed to a named file edit and applied only on approval.
- Optional transcript mining with three lenses (judgement, tooling, divergent), from pstack `reflect`.

### 4.3 Decision trail upgrade

Replace the tables in `plow-ahead` and `headless-operation` with one shared format: append-only, one row per decision, with an evidence-pointer column and a result column.
A wrong call gets a superseding row, never an edit.
At the end of an unattended run, the trail is audited against what actually happened.

### 4.4 PR body template

`/sk:pr` and `git-commit-flow` step 6 adopt: summary as the smallest diagram or diff sketch that shows the change, before and after evidence, and a merge-danger line (one-way or two-way door, blast radius).

### 4.5 Interview pattern

`brainstorm`, `plan` and the executive grill mode adopt: ask every currently answerable question in one numbered round, each with a recommended answer; look up facts instead of asking for them; done when no open question remains.

### 4.6 Project-local verify skill (candidate)

A command that generates a skill inside the user's project describing how to launch, health-check, drive and tear down their app, plus a short feature map, and runs it once before handing over.
Biggest item in this wave; needs its own design note before commitment.

### 4.7 Council variation (decision D3)

Per-seat model variation and an agreement map in the report.

### 4.8 Wider distribution (optional)

- **Stable and latest channels:** two marketplace files with different names pointing at different branches.
- **Anthropic's directory:** submit through the developer portal (requires a paid claude.ai plan); it also reaches claude.ai and Cowork, where some components do not load.
- **Other agents:** `npx skills add moniav/sk` through skills.sh copies skill folders only; SK's commands and agents do not transfer.

### 4.9 Commands as skills (decision D7, major version only)

The plugin docs recommend skills over commands for new plugins, and in a plugin every skill is prefixed with the plugin name, so `/sk:plan` survives the conversion.
It gains bundled reference files per command and `${CLAUDE_SKILL_DIR}`.
It is only safe once the plugin is the primary channel, because the file-copy channel would lose the `/sk:` prefix.

---

## Explicitly out of scope

| Idea | Why not |
|------|---------|
| Converting `commands/sk/*.md` to skill folders before the plugin is primary | The npm channel would lose the `/sk:` prefix. Deferred to item 4.9. |
| 25 separate principle skills (pstack) | Each adds an always-loaded description or a path read; SK folds principles into existing skills. |
| Shipping a screen recorder or image uploader | Breaks zero-dependency and language-agnostic constraints; public upload by default is unsafe. |
| Vendor review-bot loops (greploop) | Vendor-specific. Only the bounded-loop shape is reused. |
| Issue-tracker plumbing (mattpocock) | `docs/tasks/` already fills this role. |
| Skill renames | Break existing installs (decision D4). |
| `memory:` on reviewer agents | Grants write access. |

## Risks

| Risk | Mitigation |
|------|------------|
| Gating commands breaks a flow that invoked them through the Skill tool | Verified none do today; `check.mjs` greps for Skill-tool calls naming a gated command. |
| Shorter prompts lose a behaviour someone relied on | Wave 2 evals gate every Wave 3 merge; line counts and eval scores go in the changelog. |
| Narrower `allowed-tools` adds permission prompts | Intended for write operations; read sets are listed generously. Note it in the release notes. |
| Plugin and npm channels drift | Item 2.4 acceptance runs both; `check.mjs` covers counts. |
| Pre-hash installs have no baseline, so the first safe update writes many `.sk-new` sidecars | The output explains why and lists them; `--dry-run` shows the count first. |
| Moving the plugin root to `pkg/` breaks existing experimental plugin installs | The channel fails validation today, so few working installs exist; note it in the release and keep the marketplace and plugin names unchanged. |
| A set `version` that is not bumped strands users on an old copy | `check.mjs` fails when `plugin.json` and `package.json` versions differ; `/sk:release` bumps both. |
| `inherit` agents cost more for users on a large session model | Documented with the `CLAUDE_CODE_SUBAGENT_MODEL` override; evals record cost per tier. |
| Existing installs keep stale files after agent split or file moves | `cli.mjs update` already prunes by manifest; add the new and moved files to the install test. |

## Sequencing

```
Wave 1 (2.0.1)  1.7 check script  ->  1.1 .. 1.6, 1.9 in any order  ->  1.8 safe update
Wave 2 (2.1.0)  2.1 evals + baseline  ->  2.2, 2.3  ->  2.4  ->  2.5, 2.6, 2.7  ->  2.8 deployment
Wave 3 (2.2.0)  3.2, 3.6 (structure)  ->  3.1 (no-op pass)  ->  3.3, 3.4, 3.5  ->  3.7 alongside
Wave 4 (2.3.0)  4.1, 4.4, 4.5 (small)  ->  4.2, 4.3  ->  4.6, 4.7 (need design notes)  ->  4.8 optional
Major (3.0)     4.9 commands as skills
```

1.8 lands before any wave that moves or rewrites many shipped files, so existing users are protected first.
2.4 lands before 2.8, because the plugin cannot be promoted while cross-file paths break in it.
One commit per numbered item, conventional format, unrelated fixes kept separate.
`dev-docs/guides/skill-authoring-guide.md` is updated at the end of Wave 2 with the invocation rules, path rules and description rules settled there.
